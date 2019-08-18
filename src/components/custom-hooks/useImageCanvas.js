import React from 'react'

const useImageCanvas = (onFileChange, onImageChange, arrayListener) => {
  const [file, setFile] = React.useState(null)
  const [image, setImage] = React.useState(null)
  const canvasRef = React.useRef()
  const [canvasDim, setCanvasDim] = React.useState(null)

  React.useEffect(() => {
    if (file) {
      onFileChange()
      var reader = new FileReader()
      reader.onloadend = event => {
        saveImage(event.target.result)
      }
      reader.readAsDataURL(file)
      return () => { reader.abort() }
    }
  }, [file])

  const saveImage = (imgSrc) => {
    var img = new Image();
    img.src = imgSrc
    img.onload = () => {
      var canvasW = window.innerWidth / 2
      if (canvasW > 600) {
        canvasW = 600
      }
      const canvasH = (img.height * canvasW) / img.width
      setCanvasDim({
        width: canvasW,
        height: canvasH,
        scale: img.width / canvasW
      })
      setImage(img)
    }
  }

  React.useEffect(() => {
    if (image) {
      const canvasCtx = canvasRef.current.getContext('2d')
      canvasCtx.beginPath()
      canvasCtx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvasDim.width, canvasDim.height);
      if (onImageChange) {
        onImageChange(canvasCtx)
      }
      canvasCtx.stroke()
    }
  }, [image, ...arrayListener])

  return [canvasRef, canvasDim, image, setFile]
}

export default useImageCanvas