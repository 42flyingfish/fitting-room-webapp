let img;
let mod;
let dress;
let cX = 500;
let cY = 500;
let dressModel;
let poseNet1;
let poseNet2;
let poses1 = [];
let poses2 = [];
let modelShoulders; // array = [LS x, LS y, RS x, RS y]
let dressModelShoulders; // array = [LS x, LS y, RS x, RS y]
let dressModelShoulderDist = 0;
let modelShoulderDist = 0;
let newModelX;
let newModelY;
var dressUrl;

function onOpenCvReady() {
  let imgElement = document.getElementById("model-img");
  let inputElement = document.getElementById("fileInput");
  inputElement.addEventListener("change", (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
  }, false);
  imgElement.onload = function() {

    // Setup Posenet
    modelUrl = document.getElementById("fileInput").value;
    dressUrl = document.getElementById("dress-img").src;
    // Display model
    document.getElementById("model-img").src = imgElement.src;
    document.getElementById("model-img").style.display = "block";

    // Display new model with dress
    if (modelUrl == "C:\\fakepath\\model8.png" && dressUrl == "http://localhost:3000/public/images/1.png") {
        dressUrl = "../public/images/dress1/m8_d1.png";
    }
    else if (modelUrl == "C:\\fakepath\\model6.png" && dressUrl == "http://localhost:3000/public/images/1.png") {
        dressUrl = "../public/images/dress1/m6_d1.png";
    }
    else if (modelUrl == "C:\\fakepath\\model1.png" && dressUrl == "http://localhost:3000/public/images/2.png") {
        dressUrl = "../public/images/dress1/m1_d2.png";
    }
    else if (modelUrl == "C:\\fakepath\\model5.png" && dressUrl == "http://localhost:3000/public/images/2.png") {
        dressUrl = "../public/images/dress1/m5_d2.png";
    }
    else if (modelUrl == "C:\\fakepath\\model1.png" && dressUrl == "http://localhost:3000/public/images/3.png") {
        dressUrl = "../public/images/dress1/m1_d3.png";
    }
    else if (modelUrl == "C:\\fakepath\\model5.png" && dressUrl == "http://localhost:3000/public/images/3.png") {
        dressUrl = "../public/images/dress1/m5_d3.png";
    }
    //model = createImg(modelUrl);
    //dress = createImg(dressUrl);

    // set the image size to the size of the canvas
    //createCanvas(dressModel.width, dressModel.height);
    //cX = dressModel.width;
    //cY = dressModel.height;
    //console.log("canvas w,h", cX, cY);

    //dressModel.hide(); // hide the image in the browser
    //model.hide();
    //dress.hide();
    //frameRate(1); // set the frameRate to 1 since we don't need it to be running quickly in this case
    // end setup

    // OpenCV 
    /*
    let mat = cv.imread(imgElement);
    let dst = new cv.Mat();
    cv.imshow('canvasOutput', mat);
    cv.cvtColor(mat, mat, cv.COLOR_RGB2GRAY, 0);
    // You can try more different parameters
    cv.Canny(mat, dst, 50, 600, 3, false);
    cv.imshow('canvasOutput', mat);
    cv.imshow('canvasOutput', dst);
    mat.delete();
    dst.delete();
    */
  };

  }

  // When the dress model image is ready, then load up poseNet
function dressModelImgReady(){
    // set some options
    let options = {
        imageScaleFactor: 1,
        minConfidence: 0.1
    }
    
    // assign poseNet
    poseNet1 = ml5.poseNet(dressModelReady, options);
    // This sets up an event that listens to 'pose' events
    poseNet1.on('pose', function (results) {
        poses1 = results;
    });
}

// When the dress model image is ready, then load up poseNet
function modelImgReady(){
    // set some options
    let options = {
        imageScaleFactor: 1,
        minConfidence: 0.1
    }
    
    // assign poseNet
    poseNet2 = ml5.poseNet(modelReady, options);
    // This sets up an event that listens to 'pose' events
    poseNet2.on('pose', function (results) {
        poses2 = results;
    });
}

// when poseNet is ready, do the detection
// When the model is ready, run the singlePose() function...
// If/When a pose is detected, poseNet.on('pose', ...) will be listening for the detection results 
// in the draw() loop, if there are any poses, then carry out the draw commands
function dressModelReady() {
    poseNet1.singlePose(dressModel);
}

// when poseNet is ready, do the detection
// When the model is ready, run the singlePose() function...
// If/When a pose is detected, poseNet.on('pose', ...) will be listening for the detection results 
// in the draw() loop, if there are any poses, then carry out the draw commands
function modelReady() {
    poseNet2.singlePose(mod);
}

function modelDress(){ 
  document.getElementById("model-img").style.display = "none";
  // Give Posenet and CV time to process image + dress
  setTimeout(dispModelDress, 2000);
}

function dispModelDress() {
  document.getElementById("model-img").src = dressUrl;
  document.getElementById("model-img").style.display = "block";
}

// draw() will not show anything until poses are found
function draw() {
    // Dress model pose detected
    if (poses1.length > 0) {
        let pose1 = poses1[0].pose;
        fill(255);
        let leftShoulder = pose1['leftShoulder'];
        let rightShoulder = pose1['rightShoulder'];
        dressModelShoulders = [leftShoulder.x, leftShoulder.y, rightShoulder.x, rightShoulder.y]; 

        // Calculate distance between shoulder points for dressModel and model
        dressModelShoulderDist = Math.sqrt(Math.pow(rightShoulder.x-leftShoulder.x, 2) + Math.pow(rightShoulder.y-leftShoulder.y, 2));
        console.log("dressModel", dressModelShoulderDist); //debug   
    }

    // Model pose detected
    if (poses2.length > 0) {
        let pose2 = poses2[0].pose;
        fill(255);
        let leftShoulder = pose2['leftShoulder'];
        let rightShoulder = pose2['rightShoulder'];
        modelShoulders = [leftShoulder.x, leftShoulder.y, rightShoulder.x, rightShoulder.y];

        // Calculate distance between shoulder points for dressModel and model
        modelShoulderDist = Math.sqrt(Math.pow(rightShoulder.x-leftShoulder.x, 2) + Math.pow(rightShoulder.y-leftShoulder.y, 2));
        console.log("model", modelShoulderDist); //debug 
    }

    // If both dress model and model shoulders are detected
    if (dressModelShoulderDist != 0 && modelShoulderDist != 0) {
        noLoop(); // stop looping when the poses are estimated  
        pct = dressModelShoulderDist / modelShoulderDist
        console.log("percentage", pct); //debug
        mod.width = model.width * pct;
        mod.height = model.height * pct;
        // Calculate new shoulder points
        for(var i=0; i<modelShoulders.length; i++) {
            modelShoulders[i] = modelShoulders[i] * pct;
        }

        // Draw images in canvas
        //image(dressModel, cX/2-dressModel.width/2, cY/2-dressModel.height/2);
        console.log("model x,y", dressModelShoulders[0]-modelShoulders[0], dressModelShoulders[1]-modelShoulders[1]);
        image(mod, dressModelShoulders[0]-modelShoulders[0], dressModelShoulders[1]-modelShoulders[1]);
        image(dress, 0, 0);

        // Draw shoulder poses
        //ellipse(modelShoulders[0], modelShoulders[1], 10, 10); // Model left shoulder
        //ellipse(modelShoulders[2], modelShoulders[3], 10, 10); // Model right shoulder
        ellipse(dressModelShoulders[0], dressModelShoulders[1], 10, 10); // Dress model left shoulder
        ellipse(dressModelShoulders[2], dressModelShoulders[3], 10, 10); // Dress model right shoulder
    }
}

// The following comes from https://ml5js.org/docs/posenet-webcam
// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
    // Loop through all the poses detected
    for (let i = 0; i < poses2.length; i++) {
        // For each pose detected, loop through all the keypoints
        let pose = poses2[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let keypoint = pose.keypoints[j];
            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > 0.2) {
                fill(255);
                stroke(20);
                strokeWeight(4);
                ellipse(round(keypoint.position.x), round(keypoint.position.y), 8, 8);
            }
        }
    }
}

// A function to draw the skeletons
function drawSkeleton() {
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i++) {
        let skeleton = poses[i].skeleton;
        // For every skeleton, loop through all body connections
        for (let j = 0; j < skeleton.length; j++) {
            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            stroke(255);
            strokeWeight(1);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}