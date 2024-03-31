document.addEventListener('DOMContentLoaded', function() {
  // Handle click event on gallery images
  var galleryImages = document.querySelectorAll('.photo img');
  galleryImages.forEach(function(img) {
      img.addEventListener('click', function() {
          var lightboxImg = document.getElementById('lightbox-img');
          var lightbox = document.getElementById('lightbox');

          lightboxImg.src = img.src;
          lightbox.style.display = 'block';
      });
  });

  // Close lightbox when close button is clicked
  var closeButton = document.getElementById('close');
  closeButton.addEventListener('click', function() {
      var lightbox = document.getElementById('lightbox');
      lightbox.style.display = 'none';
  });
});

function do_close() {
  var lightbox = document.getElementById('lightbox');
  lightbox.style.display = 'none';
}
