document.addEventListener('DOMContentLoaded', function() {
    // Handle click event on gallery images
    var galleryImages = document.querySelectorAll('.photo img');
    if (galleryImages.length > 0) {
        galleryImages.forEach(function(img) {
            img.addEventListener('click', function() {
                var lightboxImg = document.getElementById('lightbox-img');
                var lightbox = document.getElementById('lightbox');
                if (lightboxImg && lightbox) {
                    lightboxImg.src = img.src;
                    lightbox.style.display = 'block';
                }
            });
        });
    }

    // Close lightbox when close button is clicked
    var closeButton = document.getElementById('close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            var lightbox = document.getElementById('lightbox');
            if (lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }

    // Handle click event on preview images
    var previews = document.querySelectorAll('.preview');
    var detailedPhoto = document.getElementById('detailed-photo');
    var photoDescription = document.getElementById('photo-description');

    previews.forEach(function(preview) {
        preview.addEventListener('click', function() {
            // Update the detailed photo and description
            detailedPhoto.src = preview.src;
            photoDescription.innerText = preview.alt;

            // Adjust the size of the detailed photo and description
            detailedPhoto.style.maxWidth = '100%'; // Adjust as needed
            photoDescription.style.width = '100%'; // Adjust as needed

            // Show lightbox
            var lightbox = document.getElementById('lightbox');
            lightbox.style.display = 'block';
        });
    });
});
