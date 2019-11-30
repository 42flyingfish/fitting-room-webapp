function onOpenCvReady() {
  let imgElement = document.getElementById("model-img");
  let inputElement = document.getElementById("fileInput");
  inputElement.addEventListener("change", (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
  }, false);
  imgElement.onload = function() {
    let mat = cv.imread(imgElement);
    let dst = new cv.Mat();
    cv.imshow('canvasOutput', mat);
    cv.cvtColor(mat, mat, cv.COLOR_RGB2GRAY, 0);
    // You can try more different parameters
    cv.Canny(mat, dst, 50, 100, 3, false);
    //cv.imshow('canvasOutput', mat);
    //cv.imshow('canvasOutput', dst);
    mat.delete();
    dst.delete();
  };

  }