// base path to dress.
//let currentDress = "images/dress1/";

/*
* Sets model picture from specified file uploaded
*/
/*
function setModel() {
  let imgElement = document.getElementById("model-img");
  let inputElement = document.getElementById("chosenFile");
  let filename = window.URL.createObjectURL(inputElement.files[0]);
  imgElement.src = filename;
  document.getElementById('model-img').style.display='block';
}
*/
/*
* Dresses model with current dress
*/
/*
function setDress(dressNum) {
  currentDress = "public/images/dress"+dressNum+"/";
  document.getElementById('dress-img').src = currentDress + "dress-crop.png";
  document.getElementById('dress-img').style.display='block';
}
*/
/*
* Adds the images to the dress library
*/
/*
function addImages() {
  for (let i = 1; i < 8; i++) {
    let dress = "public/images/dress"+i+"/dress-icon.png";
    let img = document.createElement("img");
    img.src = dress;
    img.setAttribute("onclick","setDress("+i+")");
    let dressLib = document.getElementById("dress-container");
    dressLib.appendChild(img);
  }
}
*/
/*
* Uploads image to the dress library - NOT DONE YET
* Problem: Choose File only gets me image file name, not path to image file
*/
function addImage() {
  let dress = "";
}
/*
* On loading the window add the images to the dress library.
*/
/*
window.onload = function() {
  addImages();
};
*/