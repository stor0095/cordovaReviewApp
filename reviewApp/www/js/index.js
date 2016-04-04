// Main JavaScript
// Geemakun Storey - Cordova App - Camera Reviews

"use strict"
// Global variables
var destinationType;
var pictureSource;
var pages;
var currentPage = 0;
var app = {
pages: [],    
init: function(ev){
  //when page is ready add event listeners to every object as needed
  var pl = document.querySelectorAll(".page-link");
  [].forEach.call(pl, function(obj, index){
     var navTap = new Hammer(obj);
      navTap.on('tap', app.navigate);
  });
  //add listeners to pages
    pages = document.querySelectorAll("[data-role=page]");
  [].forEach.call(pages, function(obj, index){
    obj.className = "inactive-page";
    if(index==0){
      obj.className = "active-page";
    }
    //transitionend or animationend listeners
    obj.addEventListener("animationend", app.pageAnimated);
  });
    // Event listener for camera button and submit button
    var camAction =  document.getElementById("camBtn");
    camAction.addEventListener("click", app.capturePhoto);
    document.getElementById("submitBtn").addEventListener("click", app.sendReview);
    window.addEventListener("popstate", app.popPop);
    // Get list for homepage
    app.listReviews();
  },
changePage: function(show){
  for (var i =0; i < pages.length; i++){
      pages[i].className = "inactive-page";
  }
    pages[show].className = "active-page";
},
navigate: function(ev){
      ev.preventDefault();
  var btn = ev.srcEvent.target;
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
},
    // List for the first page
listReviews: function() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://griffis.edumedia.ca/mad9022/reviewr/reviews/get/");
    xhr.addEventListener("load", function(ev){
        var data = JSON.parse(ev.target.responseText);
        var display = document.getElementById("pattern");
        var ul = document.createElement("ul");
        ul.className = "list img-list";
        display.appendChild(ul);
            for(var i=0; i < data.reviews.length; i++){  
            //console.log(data.reviews[i].title);
            // Define review title and rating. Appened to list
            var reviewTitle = data.reviews[i].title;
            var reviewRating = data.reviews[i].rating;
            var li = document.createElement("li");
            li.className = "listItem";
            ul.appendChild(li);
                // Create anchor tag for the list items
            var listBtn = document.createElement("a");
                // Add css class to anchor button
            listBtn.className = "listItem";
            listBtn.setAttribute("href", app.fetchListReviewDetails(listBtn, data.reviews[i].id));
            listBtn.textContent = reviewTitle + " - Rating: " + reviewRating;
            li.appendChild(listBtn);
            }   
    });
    xhr.addEventListener("error", function(ev){
        alert("Trouble connecting to server...");
    });
    var params = new FormData();
        params.append("uuid", "random_test");
        xhr.send(params);
},
    // Code snippet from MADD peers to set the href attribute
fetchListReviewDetails: function(a,id){
    a.addEventListener("click", function (ev) {
            ev.preventDefault();
            currentPage = 1;
            app.changePage(currentPage);
            app.singleReviewPage(id);
        });
},    
   
    // Send review to server
sendReview: function(ev){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://griffis.edumedia.ca/mad9022/reviewr/review/set/");
    xhr.addEventListener("load", function(ev){
        var data = JSON.parse( ev.target.responseText );
        // On success, return to main page
        window.location.replace("index.html");
    });
    xhr.addEventListener("error", function(ev){
        alert("Error sending");
    });
     var form = document.getElementById("submitForm");
        form.addEventListener("submit", function(ev){
            ev.preventDefault();
            var formData = new FormData();
            // Declare variables to get ready to append form to server
            var uuid = device.uuid;
            var ttl = document.getElementById("title").value;
            var review =  document.getElementById("review").value;
            var rating = document.getElementById("rating").value;
            var image = document.getElementById("smallImage");
            
            // Appending the new form data
            formData.append("uuid", "random_test");
            formData.append("action", "insert");
            formData.append("title", ttl);
            formData.append("review_txt", review);
            formData.append("rating", rating);
            formData.append("img", encodeURIComponent(app.imgSrc));
             
            xhr.send(formData);
            // Reset the form
            form.reset();
           
        });                                    
    },  
    // List single review 
singleReviewPage: function(id, ev){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://griffis.edumedia.ca/mad9022/reviewr/review/get/");
        xhr.addEventListener("load", function(ev){
            var data = JSON.parse( ev.target.responseText );
            // Review details 
            var reviewTitle = data.review_details.title;
            var reviewText = data.review_details.review_txt;
            var reviewRating = data.review_details.rating;
            // Call div to display the review
            var mainDisplay = document.getElementById("singleReviewDiv");
            // Keep the div empty
            mainDisplay.innerHTML = "";
            // ul created to contain the review
            var ul = document.createElement("ul");
            var h3 = document.createElement("h3");
            // styles added to h3 title before appending to ul
            // repeat styling for review_txt and review.rating
            h3.style.fontWeight = "700";
            h3.style.paddingBottom = ".8rem";
            h3.textContent = reviewTitle;
            ul.appendChild(h3);
            var li1 = document.createElement("li");
            li1.style.paddingBottom = ".8rem";
            li1.textContent = "Review: " + reviewText;
            ul.appendChild(li1);
            var li2 = document.createElement("li");
            li2.style.paddingBottom = ".8rem";
            li2.style.fontWeight = "700";
            li2.textContent = "Rating: " + reviewRating;
            ul.appendChild(li2);
            var image = new Image();
            // Decode base64 string to turn it back into viewable image
            image.src = decodeURIComponent(data.review_details.img);
            ul.appendChild(image);
            mainDisplay.appendChild(ul);
    });
    xhr.addEventListener("error", function(ev){
        alert("Trouble connecting to server...");
    });
    var params = new FormData();
    params.append("uuid", "random_test");
    params.append("review_id", id);
    xhr.send(params);
    },
    // Camera Button Functions
onDeviceReady: function(){
         pictureSource = navigator.camera.PictureSourceType;
         destinationType = navigator.camera.DestinationType;
    },
onPhotoDataSuccess: function(imageData){
             //console.log(imageData);
            // Get image handle
            var smallImage = document.getElementById("smallImage");
            var realData = "data:image/jpeg;base64," + imageData;;
            smallImage.src = realData;
            app.imgSrc = realData;        
    },
capturePhoto: function(){
            // Take picture using device camera and retrieve image as base64-encoded string
            navigator.camera.getPicture(app.onPhotoDataSuccess, app.onFail, {
                quality : 75,
                destinationType: Camera.DestinationType.DATA_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit : true,
                encodingType : Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                targetWidth : 100,
                targetHeight : 100,
                cameraDirection : Camera.Direction.FRONT,
                saveToPhotoAlbum : true
            });
    },
onFail: function(message){
        alert('Failed because: ' + message);
    },
popPop: function(ev){
    ev.preventDefault();
}
};
// On device ready, launch the app
document.addEventListener('deviceready', app.init);