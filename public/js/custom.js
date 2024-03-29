/* General site stuff */
$(document).on('ready', function() {

    // set date in footer
    year =  new Date().getFullYear();
    document.getElementById("year").innerHTML = year;

    // Contact email stuff
    $('.email').hide();
    $('.contact-modal').on('show.bs.modal', function (event) {

      var ee = 'ponponbarbar';
      var gg = 'gmail.com';
      $(this).find('#modalEmail').attr('href', 'mailto:' + ee + '@' + gg );
    });

    // Admin delete images on archive page 
    $('.yellp-delete').on('click', function (e) {
        e.preventDefault();

        var imgUrl = $(this).attr('href');
        var fileName = $(this).attr('data-file');

        // make ajax post
        var delOpts = {
            type: "POST",
            url: imgUrl,
            data: { 'filename' : fileName },
            success: function() {
              setTimeout(function() {
                window.location.reload();
              }, 100);
            },
        };

        $.ajax(delOpts);
    });
});

/* Size Main Nav, Marquees and grids to correct window size */
$(document).on('ready', function () {
    responsiveLayout();
    Marquee3k.refreshAll();
});

$(window).on('resize', function () {
    responsiveLayout();
    Marquee3k.refreshAll();
});

function responsiveLayout () {
    var w = $(document).width();
    var gridW = 330;

    // screen-xl size marquees to width above 1320
    if (w >= 1320) {
      $('#addy').css('max-width', (w - 990 + 'px'));
      $('#hours').css('max-width', (w - 990 + 'px'));
      $('#testimonials').css('max-width', (w - 990 + 'px'));
      $('#testimonials figure').css('max-width', (w - 990 + 'px'));
    }
    // screen-lg get remaining screen width above 990 and size marquees/nav to it
    if (w >= 1160 && w < 1320) {
      $('#addy').css('max-width', ((w / 330 - 3) * 330));
      $('#hours').css('max-width', ((w / 330 - 3) * 330));
      $('#testimonials').css('max-width', ((w / 330 - 3) * 330));
      $('#testimonials figure').css('max-width', ((w / 330 - 3) * 330));

      $('#yellps .spacer').show();
      $('#yellps .yellp-img').css('margin-left', '0');

      $('.yellp-arrow').text(' →');
    }
    // screen-md get remaining screen width above 660 and size marquees/nav to it
    if (w >= 787 && w <= 1159) {
      $('#addy').css('max-width', ((w / 330 - 2) * 330));
      $('#hours').css('max-width', ((w / 330 - 2) * 330));
      $('#testimonials').css('max-width', ((w / 330 - 2) * 330));
      $('#testimonials figure').css('max-width', ((w / 330 - 2) * 330));

      $('.yellp-arrow').text(' →');

      $('#yellps .spacer').filter(':odd').hide();
      $('#yellps .yellp-img').filter(':even').css('margin-left', '0');
      $('#yellps .yellp-img').filter(':odd').css('margin-left', '330px');
    }
    // screen-sm
    if (w <= 786) {
      $('#mainNav').css('max-width', '100%');
      $('#addy').css('max-width', '100%');
      $('#hours').css('max-width', '100%');
      $('#testimonials').css('max-width', '100%');
      $('#testimonials figure').css('max-width', '100%');

      $('#yellps .yellp-img').filter(':even').css('margin-left', '0');
      $('.yellp-arrow').text(' ↓');
    }
    if (w >= 660 && w <= 785) {
      $('#yellps .yellp-img').filter(':odd').css('margin-left', '0');
      $('#yellps .yellp-img').filter(':even').css('margin-left', '330px');
    }
    if (w <= 660) {
      $('#yellps .yellp-img').filter(':even').css('margin-left', '0');
    }
    // screen-xs
    if (w <= 495) {
      // reset display styles so css can work
      $('#yellps .yellp-img').filter(':even').css('margin-left', '0');
      $('#yellps .spacer').css('display', '');
    }
}

/* Drawing Canvas Yellp App */
var canvas,
    canvasWidth = 306,
    canvasHeight = 306; // leave room for canvas border

var canvasDiv = document.getElementById('canvasDiv');
canvas = document.createElement('canvas');
canvas.setAttribute('width', canvasWidth);
canvas.setAttribute('height', canvasHeight);
canvas.setAttribute('id', 'canvas');
canvasDiv.appendChild(canvas);
if (typeof G_vmlCanvasManager !== 'undefined') {
    canvas = G_vmlCanvasManager.initElement(canvas);
}
context = canvas.getContext("2d");

// Add Yellp starter template to canvas.
make_starter();

function make_starter()
{
  logo_image = new Image();
  logo_image.src = '/images/yellp/yellp-starter.png';
  logo_image.onload = function(){
    context.drawImage(logo_image, 0, 0, 306, 306); //leave room for canvas border
  };
}

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

    // Clear starter template and add Yellp logo to canvas.
    make_logo();

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
        
        var newImg = new FormData();
        //var bf = new File([blob], 'fileName', {type: blob.type}); 
        newImg.append('image_upload', blob, 'filename.png'); // fileName is just a placeholder here

        var opts = {
            type: 'POST',
            url: '/api/imageupload/create',
            data: newImg,
            cache: false,
            processData: false,
            contentType: false,
            //contentType: "multipart/form-data",
            success: function (data) {
              data.image_upload.name = 'yellp_' + data.image_upload._id;
              data.image_upload.filename = 'yellp_' + data.image_upload._id;
              data.image_upload.url = '/uploads/images/' + data.image_upload.image.filename;
              data.image_upload.imageType = 'image/png';
              data.image_upload.createdTimeStamp = new Date();
              
              //Update the image with the information above.
              $.get('/api/imageupload/'+data.image_upload._id+'/update', data.image_upload, function(data) {
                console.log('Image information updated.');
                
              })

              // If the metadata update fails:
              .fail(function (data) {
                
                console.error('The image metadata was not updated. Here is the error message from the server:');
                console.error('Server status: '+err.status);
                console.error('Server message: '+err.statusText);

                alert('Failed to connect to the server while trying to update image metadata!');
              });
              setTimeout(function () {
                window.location.reload();
              }, 100);

            },
        };

        $.ajax(opts);
    }

});
