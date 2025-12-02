const cameraHelper = {
  async startCamera(videoElement) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      videoElement.srcObject = stream;
      return true;
    } catch (error) {
      console.error('Error accessing camera:', error);
      return false;
    }
  },

  stopCamera() {
    const videoElement = document.getElementById('cameraFeed');
    if (videoElement && videoElement.srcObject) {
      const stream = videoElement.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoElement.srcObject = null;
    }
  },

  captureImage(videoElement, canvas) {
    try {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.9);
    } catch (error) {
      console.error('Error capturing image:', error);
      return null;
    }
  },

  async getCapturedImageBlob() {
    const capturedImage = document.getElementById('capturedImage');
    if (capturedImage.src && capturedImage.src !== 'about:blank') {
      const response = await fetch(capturedImage.src);
      return await response.blob();
    }
    return null;
  }
};
window.cameraHelper = cameraHelper;