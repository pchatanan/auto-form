import React from 'react'
import firebase from 'firebase'
import { useArray } from './AreaDefiner'
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

const ExtractedItem = props => {
  const { item, image, scale, onImageLoaded, onDetectChange } = props
  const [textReturned, setTextReturned] = React.useState('')
  const canvasRef = React.useRef()
  React.useEffect(() => {
    const canvasCtx = canvasRef.current.getContext('2d')
    canvasCtx.drawImage(image, item.x, item.y, item.w, item.h, 0, 0, item.w / scale, item.h / scale);
    canvasCtx.stroke()
    var dataURL = canvasRef.current.toDataURL()
    onImageLoaded(dataURL)
  }, [image, item, scale])
  return <div>
    <label>{item.name}</label>
    <canvas style={{ border: '1px solid red' }} ref={canvasRef} width={item.w / scale} height={item.h / scale} />
    {item.detected !== null && item.detected !== undefined ? <input value={item.detected} onChange={e => { onDetectChange(e.target.value) }} /> : <h3>{'Cannot Detect Text'}</h3>}
  </div>
}

const Detector = props => {
  const [templates, setTemplates] = React.useState(null)
  const [selectedTemplateId, setSelectedTemplateId] = React.useState('')
  const [formId, setFormId] = React.useState(null)
  const [items, perform] = useArray()
  const [canvasRef, canvasDim, img, setFile] = useImageCanvas(() => { perform.clear() }, null, [])
  const [dataUrls, setDataUrls] = React.useState({})

  React.useEffect(() => {
    firebase.firestore().collection('templates').get()
      .then((querySnapshot) => {
        var newTemplates = []
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          newTemplates.push({ id: doc.id, data: doc.data() })
        });
        setTemplates(newTemplates)
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }, [])

  const createOptions = () => {
    return templates.map((template, index) => {
      return <option key={index} value={template.id}>
        {template.data.formName}
      </option>
    })
  }

  return <div>
    <div>
      {img && templates && <select value={selectedTemplateId} onChange={e => {
        setSelectedTemplateId(e.target.value)
        perform.setItems(templates.filter(temp => { return temp.id === e.target.value })[0].data.formSpec.map((template) => {
          return {
            x: template.x * img.width,
            y: template.y * img.height,
            w: template.w * img.width,
            h: template.h * img.height,
            name: template.name
          }
        }))
      }}>
        {createOptions()}
      </select>}
    </div>
    <div>
      <input type='file' accept="image/jpeg" onChange={e => {
        setFile(e.target.files[0])
      }}></input>
    </div>
    <div style={style.content}>
      <div style={style.canvasContainer}>
        {img && <canvas style={style.canvas} ref={canvasRef} width={canvasDim.width} height={canvasDim.height} />}
      </div>
      {img && selectedTemplateId && <div style={style.items}>
        {items.map((item, index) => {
          var newItem = { ...item }
          return <ExtractedItem item={item} image={img} scale={canvasDim.scale} key={index} onImageLoaded={dataUrl => {
            setDataUrls(preDataUrls => {
              return {
                ...preDataUrls,
                [item.name]: dataUrl
              }
            })
          }} onDetectChange={newDetect => {
            newItem.detected = newDetect
            perform.update(newItem, index)
          }} />
        })}
      </div>}
    </div>
    <button onClick={e => {
      console.log(dataUrls)
      var dataDocId
      firebase.firestore().collection('templates').doc(selectedTemplateId).collection('data').add({})
        .then(docRef => {
          dataDocId = docRef.id
          setFormId(dataDocId)
          // Create a root reference
          var storageRef = firebase.storage().ref();
          items.forEach((item, index) => {
            var dataURL = dataUrls[item.name]
            // Create a reference to 'mountains.jpg'
            var testRef = storageRef.child(`templates/${selectedTemplateId}/data/${dataDocId}/${item.name}.jpg`);
            testRef.putString(dataURL, 'data_url').then((snapshot) => {
              console.log(`${item.name}: Uploaded !`)
              snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log("File available at", downloadURL);
                var readHandwriting = firebase.functions().httpsCallable('readHandwriting');
                readHandwriting({ downloadURL }).then((result) => {
                  // Read result of the Cloud Function.
                  perform.updatePre(preItem => {
                    var newPreItem = { ...preItem }
                    if (result.data) {
                      newPreItem['detected'] = result.data.text
                    }
                    else {
                      newPreItem['detected'] = ''
                    }
                    newPreItem['downloadURL'] = downloadURL
                    return newPreItem
                  }, index)
                })
              });
            })
          })
        })
    }}>Detect Text</button>
    <button onClick={e => {
      var temp = {}
      items.forEach(item => {
        temp[item.name] = {
          text: item.detected,
          url: item.downloadURL
        }
      })
      temp.Notes = []
      firebase.firestore().collection('templates').doc(selectedTemplateId).collection('data').doc(formId).set(temp)
        .then(() => {
          console.log("Document successfully written!");
          props.history.push('/')
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    }}>Upload</button>
  </div>
}

export default Detector