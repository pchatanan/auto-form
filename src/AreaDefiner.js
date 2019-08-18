import React from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'
import useImageCanvas from './components/custom-hooks/useImageCanvas';

const style = {
  container: {
    overflow: 'hidden'
  },
  top: {
    height: '60px',
  },
  content: {
    height: 'calc(100vh - 120px)',
    display: 'flex',
  },
  canvasContainer: {
    overflow: 'auto',
    flex: '1'
  },
  items: {
    overflow: 'auto',
    flex: '1'
  },
  bottom: {
    height: '60px',
  },
  canvas: {
    border: '1px solid black'
  },
  areaItemDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}

export const useArray = () => {
  const [items, setItems] = React.useState([])
  const newItems = [...items]

  const add = newItem => {
    setItems([...items, newItem])
  }

  const remove = index => {
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const clear = () => {
    setItems([])
  }

  const moveUp = index => {
    if (index > 0) {
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]]
      setItems(newItems)
    }
  }

  const moveDown = index => {
    if (index < items.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
      setItems(newItems)
    }
  }

  const update = (newItem, index) => {
    newItems[index] = newItem
    setItems(newItems)
  }

  const updatePre = (getNewItem, index) => {
    setItems(preItems => {
      var newPreItems = [...preItems]
      var newItem = getNewItem(preItems[index])
      newPreItems[index] = newItem
      return newPreItems
    })
  }

  const perform = {
    add, remove, clear, moveUp, moveDown, update, setItems, updatePre
  }

  return [items, perform]
}

const AreaItem = props => {
  const { item, image, scale, dispatch } = props
  const canvasRef = React.useRef()
  React.useEffect(() => {
    const canvasCtx = canvasRef.current.getContext('2d')
    canvasCtx.drawImage(image, item.x * scale, item.y * scale, item.w * scale, item.h * scale, 0, 0, item.w, item.h);
  }, [image, item, scale])
  return <div style={style.areaItemDiv}>
    <input value={item.name} onChange={e => { dispatch('update', { ...item, name: e.target.value }) }}></input>
    <canvas ref={canvasRef} width={item.w} height={item.h} />
    <div>
      <button onClick={e => { dispatch('remove') }}>remove</button>
      <button onClick={e => { dispatch('moveup') }}>up</button>
      <button onClick={e => { dispatch('movedown') }}>down</button>
    </div>
  </div>
}

const AreaDefiner = props => {
  const [formName, setFormName] = React.useState('')
  const [items, perform] = useArray()

  const [canvasRef, canvasDim, img, setFile] = useImageCanvas(() => { perform.clear() }, canvasCtx => {
    items.forEach(item => {
      canvasCtx.rect(item.x, item.y, item.w, item.h)
    })
  }, [items])

  // drawing
  const [anchor, setAnchor] = React.useState(null)

  const updateCanvas = (image, rects) => {
    const canvasCtx = canvasRef.current.getContext('2d')
    canvasCtx.beginPath()
    canvasCtx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvasDim.width, canvasDim.height);
    rects.forEach(item => {
      canvasCtx.rect(item.x, item.y, item.w, item.h)
    })
    canvasCtx.stroke()
  }

  const handleMouseDown = e => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setAnchor({ x, y })
  }

  const handleMouseMove = e => {
    if (anchor) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      updateCanvas(img, [...items, {
        x: anchor.x,
        y: anchor.y,
        w: x - anchor.x,
        h: y - anchor.y
      }])
    }
  }

  const handleMouseUp = e => {
    if (anchor) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const areaW = x - anchor.x
      const areaH = y - anchor.y
      const newItem = {
        x: x < anchor.x ? x : anchor.x,
        y: y < anchor.y ? y : anchor.y,
        w: Math.abs(areaW),
        h: Math.abs(areaH),
        name: ''
      }
      perform.add(newItem)
      setAnchor(null)
    }

  }

  return <div style={style.container}>
    <div style={style.top}>
      <label>Form name</label>
      <input value={formName} onChange={e => { setFormName(e.target.value) }}></input>
      <input type='file' accept="image/jpeg" onChange={e => {
        setFile(e.target.files[0])
      }}></input>
    </div>
    <div style={style.content}>
      <div style={style.canvasContainer}>
        {img && <canvas style={style.canvas} ref={canvasRef} width={canvasDim.width} height={canvasDim.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp} />}
      </div>
      <div style={style.items}>
        {items.map((item, idx) => {
          return <AreaItem item={item} image={img} scale={canvasDim.scale} key={idx} dispatch={(type, data) => {
            switch (type) {
              case 'remove':
                perform.remove(idx)
                break
              case 'moveup':
                perform.moveUp(idx)
                break
              case 'movedown':
                perform.moveDown(idx)
                break
              case 'update':
                perform.update(data, idx)
                break
              default:
                break
            }
          }} />
        })}
      </div>
    </div>
    <div style={style.bottom}>
      <button onClick={e => {
        const formSpec = items.map(item => {
          return {
            ...item,
            x: item.x * canvasDim.scale / img.width,
            y: item.y * canvasDim.scale / img.height,
            w: item.w * canvasDim.scale / img.width,
            h: item.h * canvasDim.scale / img.height
          }
        })
        const areas = {
          formName, formSpec
        }
        firebase.firestore().collection('templates').add(areas)
          .then(docRef => {
            console.log(docRef.id)
            props.history.push('/detect')
          })
      }}>submit</button>
    </div>
  </div>
}

export default AreaDefiner