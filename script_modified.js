// import { brotliDecompressSync } from "zlib";

// base path to dress.
let currentDress = "images/dress0/";
/*
* switches the dress model
*/
function model(){ 
  var e = document.getElementById("hips_meas");
  var opt = e.options[e.selectedIndex].value;
  /* var pic = "http://drive.google.com/uc?export=view&id=14H-Pig994PAnV3RW9ZYs5ZCyWXh7XXDH"; */

  // switch (opt) {
  //   case "h2":
  //     var pic = currentDress + "dress-s.png";
  //     document.getElementById("rec-size").innerHTML = "Model Size: S";
  //     break;
  //   case "h3":
  //     var pic = currentDress + "dress-m.png";
  //     document.getElementById("rec-size").innerHTML = "Model Size: M";
  //     break;
  //   case "h4":
  //     var pic = currentDress + "dress-l.png";
  //     document.getElementById("rec-size").innerHTML = "Model Size: L";
  //     break;
  //   case "h5":
  //     var pic = currentDress + "dress-xl.png";
  //     document.getElementById("rec-size").innerHTML = "Model Size: XL";
  //     break;
  //   case "h6":
  //     var pic = currentDress + "dress-xxl.png";
  //     document.getElementById("rec-size").innerHTML = "Model Size: XXL";
  //     break;
  //   default:
  //     var pic = currentDress + "dress-xs.png";
  //     document.getElementById("rec-size").innerHTML = "Model Size: XS";
  // }
  
let chest = document.getElementById("chest_meas").selectedIndex;
let waist = document.getElementById("waist_meas").selectedIndex;
let hips = document.getElementById("hips_meas").selectedIndex;

let bodAvg = parseInt((chest+waist+hips)/3, 10);

switch (bodAvg) {
  case 0:
    var pic = currentDress + "dress-xs.png";
    document.getElementById("rec-size").innerHTML = "Model Size: XS";
    break;
  case 1:
    var pic = currentDress + "dress-s.png";
    document.getElementById("rec-size").innerHTML = "Model Size: S";
    break;
  case 2:
    var pic = currentDress + "dress-m.png";
    document.getElementById("rec-size").innerHTML = "Model Size: M";
    break;
  case 3:
    var pic = currentDress + "dress-l.png";
    document.getElementById("rec-size").innerHTML = "Model Size: L";
    break;
  case 4:
    var pic = currentDress + "dress-xl.png";
    document.getElementById("rec-size").innerHTML = "Model Size: XL";
    break;
  case 5:
    var pic = currentDress + "dress-xxl.png";
    document.getElementById("rec-size").innerHTML = "Model Size: XXL";
    break;
}

alert(bodAvg);




  document.getElementById('model-img').src = pic;
  document.getElementById('model-img').style.display='block';
  document.getElementById('rec-size').style.display='block';
  
}
/*
* Adds the images to the dress library
*/
function addImages(){
  let img = document.createElement("img");
    img.src = "images/dress0/dress-icon.png";
    img.style.cssText = "cursor:pointer;";
    img.setAttribute("onclick","setDress("+0+")");
    let dressLib = document.getElementById("dress-container");
    dressLib.appendChild(img);
  for(let i = 1; i < 2; i++){
    let img = document.createElement("img");
    img.src = "testimg.png";
    img.style.cssText = "width:40%;margin: 20px; cursor:pointer;";
    img.setAttribute("onclick","setDress("+i+")");
    let dressLib = document.getElementById("dress-container");
    dressLib.appendChild(img);
  }
  
}
/*
* chooses which dresses will be displayed
*/
function setDress(dressNum){
  currentDress = "images/dress"+dressNum+"/";
}

/*
* On loading the window add the images to the dress library.
*/
window.onload = function() {
  addImages();
};
