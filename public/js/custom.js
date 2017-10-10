/* Contact email stuff */
$(document).on('ready', function() {
    $('.email').hide();
    $('.contact-modal').on('show.bs.modal', function (event) {

      var ee = 'ponponbarbar';
      var gg = 'gmail.com';
      $(this).find('#modalEmail').attr('href', 'mailto:' + ee + '@' + gg );
    });
});

/* Background colors of cocktail menu */
$('.cocktail:nth-child(3n)').css('background-color', '#ffc000');
$('.cocktail:nth-of-type(3n+1)').css('background-color', '#66ccf9');

/* Size Main Nav & Marquees to correct window size */
$(document).on('ready', function() {
    marqueeSize();
});

$(window).on('resize', function() {
    marqueeSize();
});

function marqueeSize() {
    var w = $(document).width();
    var gridW = 330;
   
   // screen-md or larger get remaining screen width above 990 and size marquees/nav to it
    if ( w >= 990 && w < 1320 ) {
      $('#mainNav').css('max-width', ( (w/330 - 3) * 330 ) );
      $('#addy').css('max-width', ( (w/330 - 3) * 330 ) );
      $('#hours').css('max-width', ( (w/330 - 3) * 330 ) );
      Marquee3k.refreshAll();
    }
    // screen-sm or smaller
    if ( w <= 989 ) {
      $('#mainNav').css('max-width', '100%');
      $('#addy').css('max-width', '100%');
      $('#hours').css('max-width', '100%');
      Marquee3k.refreshAll();
    }
}

/* Drawing Canvas Yellp App */
var canvas,
    canvasWidth = 306,
    canvasHeight = 306; //leave room for canvas border

var canvasDiv = document.getElementById('canvasDiv');
canvas = document.createElement('canvas');
canvas.setAttribute('width', canvasWidth);
canvas.setAttribute('height', canvasHeight);
canvas.setAttribute('id', 'canvas');
canvasDiv.appendChild(canvas);
if (typeof G_vmlCanvasManager != 'undefined') {
    canvas = G_vmlCanvasManager.initElement(canvas);
}
context = canvas.getContext("2d");

// Add Yellp logo to canvas.
make_logo();

function make_logo()
{
  logo_image = new Image();
  logo_image.src = '/images/yellp/yellp-template.png';
  logo_image.onload = function(){
    context.drawImage(logo_image, 0, 0, 306, 306); //leave room for canvas border
  };
}

// Clears the canvas.
clearCanvas = function() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    make_logo();
};

// get click/drag position while mouse is down
$('#canvas').mousedown(function(e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
});

// get position while dragging
$('#canvas').mousemove(function(e) {
    if (paint) {
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
    }
});

// not clicking don't draw
$('#canvas').mouseup(function(e) {
    paint = false;
});

// off of paper don't draw
$('#canvas').mouseleave(function(e) {
    paint = false;
});

// records where we dragged
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}

// function to redraw the canvas with saved dragging area
function redraw() {
    //context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    context.strokeStyle = "#ff3366";
    context.lineJoin = "round";
    context.lineWidth = 4;

    for (var i = 0; i < clickX.length; i++) {
        context.beginPath();
        if (clickDrag[i] && i) {
            context.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
            context.moveTo(clickX[i] - 1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.stroke();
    }
}

// clear canvas when clear button is clicked
$('#clearCanvas').on('click', function(e) {
    clickX = new Array();
    clickY = new Array();
    clickDrag = new Array();
    clearCanvas();
});


// save canvas element as 
$('#saveCanvas').on('click', function() {

    if (clickX.length, clickDrag.length, clickY.length > 0) {
          if (canvas.toBlob) { //Ensure the toBlob library is loaded
            canvas.toBlob( handleCanvasBlob );
          } else {
            console.error('Could not access toBlob library!');
            return;
          }
    } else {
        $('.canvas-footer').prepend('<p class="alert alert-warning text-center col-lg-12">Say something when you Yellp<sub>®</sub> at me!</p>');
        
        return;
    }

    function handleCanvasBlob(blob) {

        var bf = new File([blob], 'fileName', {type: blob.type}); // fileName is just a placeholder here
        var newImg = new FormData();
        newImg.append('image_upload', bf, "filename.png");

        var opts = {
            type: 'POST',
            url: '/api/imageupload/create',
            data: newImg,
            cache: false,
            processData: false,
            contentType: false,
            success: function(data) {

              data.image_upload.name = 'yellp_' + data.image_upload._id;
              data.image_upload.filename = 'yellp_' + data.image_upload._id;
              data.image_upload.url = '/uploads/images/yellp_' + data.image_upload.image.filename;
              data.image_upload.imageType = 'image/png';
              data.image_upload.createdTimeStamp = new Date();
              
              //Update the image with the information above.
              $.get('/api/imageupload/'+data.image_upload._id+'/update', data.image_upload, function(data) {

                console.log('Image information updated.');
                
              })

              //If the metadata update fails:
              .fail(function(data) {
                
                console.error('The image metadata was not updated. Here is the error message from the server:');
                console.error('Server status: '+err.status);
                console.error('Server message: '+err.statusText);

                alert('Failed to connect to the server while trying to update image metadata!');
              });

              setTimeout(function() {
                window.location.reload();
              }, 100);

            }
        };

        $.ajax(opts);
    }

});

/*function uploadImage() {

  var selectedImage = $('#image_upload').get(0).files[0];

  //Error handling
  if(selectedImage === undefined)
    alert('You did not select an image!');
    
  //Create the FormData data object and append the image to it.
  var newImage = new FormData();
  newImage.append('image_upload', selectedImage); //This is the raw image that was selected

  //Set the form options.
  var opts = {
    url: '/api/imageupload/create',
    data: newImage,
    cache: false,
    contentType: false,
    processData: false,
    type: 'POST',
    
    //This function is executed when the image uploads successfully.
    success: function(data){
      //Dev Note: KeystoneAPI only allows image and image uploads with the image itself. Any extra metadata will have to
      //be uploaded/updated with a second call.
      
      //console.log('Image upload succeeded! ID: ' + data.image_upload._id);

      //Fill out the image metadata information
      data.image_upload.name = $('#image_name').val();
      data.image_upload.url = '/uploads/images/'+data.image_upload.image.imagename;
      data.image_upload.imageType = data.image_upload.image.mimetype;
      data.image_upload.createdTimeStamp = new Date();
      
      //Update the image with the information above.
      $.get('/api/imageupload/'+data.image_upload._id+'/update', data.image_upload, function(data) {
        
        //console.log('Image information updated.');
        
        //Add the uploaded image to the uploaded image list.
        $('#image_list').append('<li><a href="'+data.collection.url+'" download>'+data.collection.name+'</a></li>');
        
      })
      
      //If the metadata update fails:
      .fail(function(data) {
        
        console.error('The image metadata was not updated. Here is the error message from the server:');
        console.error('Server status: '+err.status);
        console.error('Server message: '+err.statusText);

        alert('Failed to connect to the server while trying to update image metadata!');
      });
    },
    
    //This error function is called if the POST fails for submitting the image itself.
    error: function(err) {
      
      console.error('The image was not uploaded to the server. Here is the error message from the server:');
      console.error('Server status: '+err.status);
      console.error('Server message: '+err.statusText);

      alert('Failed to connect to the server!');
    }
  };

  //Execute the AJAX call.
  jQuery.ajax(opts);
      
}*/

/* Animate.css callback to remove classes by js after anim ends */
$.fn.extend({
    animateCss: function(animName) {
        var animEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animName).one(animEnd, function() {
            $(this).removeClass('animated ' + animName);
        });
    }
});
