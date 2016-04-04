// Main JavaScript
// Geemakun Storey - Mobile Review App

"use strict"
// Global variables
var destinationType;
var pictureSource;
var app = { 
  init: function( ){
    console.log('This is code that will run once Cordova is ready'); 
  }

};
function init(ev){
  //when page is ready add event listeners to every object as needed
  //add listeners to buttons
  var pl = document.querySelectorAll(".page-link");
  [].forEach.call(pl, function(obj, index){
     var navTap = new Hammer(obj);
      navTap.on('tap', navigate);
  });
  //add listeners to pages
 var pages = document.querySelectorAll("[data-role=page]");
  [].forEach.call(pages, function(obj, index){
    obj.className = "inactive-page";
    if(index==0){
      obj.className = "active-page";
    }
    //transitionend or animationend listeners
    obj.addEventListener("animationend", pageAnimated);
  });
}
// Three Ajax calls
// 1-  LIST REVIEWS
var listReviews = {
  method: "POST",
  init: function (){
var xhr = new XMLHttpRequest();
  xhr.open(listReviews.method, "https://griffis.edumedia.ca/mad9022/reviewr/reviews/get/", true);
  xhr.addEventListener("load", listReviews.gotResponse);
  xhr.addEventListener("error", listReviews.failed);
  xhr.send();
  },
  gotResponse: function(ev){
    document.querySelector("p:last-child").textContent = ev.target.responseText;
  var data = JSON.parse( ev.target.responseText );
  },
  failed: function(ev){
    console.log("An error occurred"); 
  }
};
// CAMERA BUTTON
function onDeviceReady() {
            pictureSource = navigator.camera.PictureSourceType;
            destinationType = navigator.camera.DestinationType;
        }
function onPhotoDataSuccess(fileURI) {
            // Uncomment to view the base64 encoded image data
            var basedSix = fileURI;
             console.log(fileURI);

            // Get image handle
            //
            var smallImage = document.getElementById('smallImage');

            // Unhide image elements
            //
            smallImage.style.display = 'block';

            // Show the captured photo
            // The inline CSS rules are used to resize the image
            //
            smallImage.src = fileURI;
        }
function capturePhoto() {
            alert('taking photo');
            // Take picture using device camera and retrieve image as base64-encoded string
            navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
                quality : 75,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit : true,
                encodingType : Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                targetWidth : 100,
                targetHeight : 100,
                cameraDirection : Camera.Direction.FRONT,
                saveToPhotoAlbum : false
            });
        }
function onFail(message) {
            alert('Failed because: ' + message);
        }
// 2 - SUBMIT REVIEW
var sendData = {
    init: function (){
        var xhr =  new XMLHttpRequest();
        xhr.open("POST", "https://griffis.edumedia.ca/mad9022/reviewr/review/set/", true);
        xhr.addEventListener("load", sendData.gotResponse);
        xhr.addEventListener("error", sendData.failed);
        
        var form = document.getElementById("submitForm");
        form.addEventListener("submit", function(ev){
            ev.preventDefault();
            var formData = new FormData();
            var uuid = device.uuid;
            var action = device.action;
            var ttl = document.getElementById("title").value;
            var review =  document.getElementById("review").value;
            var rating = document.getElementById("rating").value;
            var image = document.getElementById("smallImage");
            
            
            formData.append("uuid", uuid);
            formData.append("action", action);
            formData.append("title", ttl);
            formData.append("review_txt", review);
            formData.append("rating", rating);
            formData.append("img", image);
            
            xhr.send(formData);
        });
    },
    gotResponse: function(ev){
        document.querySelector("p:last-child").textContent = ev.target.responseText;
        var data = JSON.parse( ev.target.responseText );
        console.dir(data);
        console.log("succes");
    },
    failed: function(ev){
    console.log("An error occurred");
    console.dir(ev); 
  }
};
 // 3 - SINGLE REVIEW DETAILS
var singleReview = {
    method: "POST",
    init: function(){
  var xhr = new XMLHttpRequest();
  xhr.open(singleReview.method, "https://griffis.edumedia.ca/mad9022/reviewr/review/get/", true);
  xhr.addEventListener("load", singleReview.gotResponse);
  xhr.addEventListener("error", singleReview.failed);
  xhr.send();
  },
  gotResponse: function(ev){
    document.querySelector("p:last-child").textContent = ev.target.responseText;
  var data = JSON.parse( ev.target.responseText );
  console.dir(data);
  },
  failed: function(ev){
    console.log("An error occurred"); 
  }
};

// PAGE NAVIGATION
function navigate(ev){
  ev.preventDefault();
  var btn = ev.srcEvent.target;
    console.dir(ev);
    if (btn.tagName.toLowerCase() == "i") {
        btn = btn.parentElement;
    } if(btn.tagName.toLowerCase() == "div"){
        btn = btn.parentElement;
    }  
  var href = btn.href;
  var id = href.split("#")[1];
  //history.pushState();
  var pages = document.querySelectorAll('[data-role="page"]');
  for(var p=0; p<pages.length; p++){
    //console.log(pages[p].id, page);
    if(pages[p].id === id){
      pages[p].classList.remove("hidden");
      if(pages[p].className !== "active-page"){
        pages[p].className = "active-page";
      }
      //console.log("active ", page)
    }else{
      if(pages[p].className !== "inactive-page"){
        pages[p].className = "inactive-page";
      }
    }
  }
}
function pageAnimated(ev){
  //console.log("Transition finished for " + ev.target.id);
  //console.dir(ev);
  var page = ev.target;
  if( page.className == "active-page" ){
    console.log(ev.target.id, " has just appeared");
  }else{
    console.log(ev.target.id, " has just disappeared");
    //ev.target.classList.add("hidden");
    //Not required
  }
}
  document.addEventListener("deviceready", function(event) {
    console.log("DOM fully loaded and parsed");
    init();
    onDeviceReady();
    app.init();
    sendData.init();
    listReviews.init(); 
    singleReview.init();
  });


