document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.getElementById('carousel');
    const staticCarousel = document.getElementById('carousel-static');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeLightboxButton = document.getElementById('close-lightbox');
    const scrollLeftButton = document.getElementById('scroll-left');
    const scrollRightButton = document.getElementById('scroll-right');
    const scrollStaticLeftButton = document.getElementById('scroll-static-left');
    const scrollStaticRightButton = document.getElementById('scroll-static-right');
    const hintText = document.createElement('div'); // Text hint element
    let index = 3;
    let autoScrollInterval;
    const carouselContainer = document.querySelector('.carousel-container');
    const previewWidth = carouselContainer.clientWidth / 3; // width of one preview
    let touchStartX = 0;
    let touchEndX = 0;

    // Add text hint
    hintText.textContent = 'Use keyboard ⇜ ⇝ to navigate';
    hintText.style.position = 'absolute';
    hintText.style.bottom = '10px'; // Adjust position as needed
    hintText.style.left = '50%';
    hintText.style.transform = 'translateX(-50%)';
    hintText.style.color = '#fff';
    hintText.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    hintText.style.padding = '5px';
    hintText.style.borderRadius = '5px';
    hintText.style.display = 'none'; // Initially hidden
    lightbox.appendChild(hintText);

    function checkDirection() {
        if (touchEndX < touchStartX) scrollRight();
        if (touchEndX > touchStartX) scrollLeft();
    }

    // Swipe event listeners
    carouselContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoScroll();
    });

    carouselContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        checkDirection();
    });

    function duplicateItems(container) {
        const items = Array.from(container.children);
        const firstItems = items.slice(0, 3);
        const lastItems = items.slice(-3);

        firstItems.forEach(item => {
            container.appendChild(item.cloneNode(true));
        });

        lastItems.reverse().forEach(item => {
            container.insertBefore(item.cloneNode(true), container.firstChild);
        });

        container.style.transform = `translateX(-${3 * previewWidth}px)`;
        index = 3;
    }

    function updateCarouselTransform(container) {
        container.style.transition = 'transform 0.5s';
        container.style.transform = `translateX(-${index * previewWidth}px)`;
    }

    function resetCarouselTransform(container, newIndex) {
        container.style.transition = 'none';
        container.style.transform = `translateX(-${newIndex * previewWidth}px)`;
        index = newIndex;
    }

    function scrollLeft() {
        index--;
        if (carousel) updateCarouselTransform(carousel);
        if (staticCarousel) updateCarouselTransform(staticCarousel);
    }

    function scrollRight() {
        index++;
        if (carousel) updateCarouselTransform(carousel);
        if (staticCarousel) updateCarouselTransform(staticCarousel);
    }

    function handleTransitionEnd(event) {
        const container = event.target;
        const totalImages = container.children.length;

        if (index === 0) {
            resetCarouselTransform(container, totalImages - 6);
        } else if (index >= totalImages - 3) {
            resetCarouselTransform(container, 3);
        }
    }

    // Function to start auto-scroll
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            scrollRight();
        }, 3000); // Auto-scroll every 3 seconds
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    // Function to load static images and add to carousel
    function loadStaticImages() {
        fetch('/api/static_images')
            .then(response => response.json())
            .then(images => {
                while (images.length < 3) {
                    images = images.concat(images); // Duplicate the images array
                }

                images.forEach(image => {
                    const img = document.createElement('img');
                    img.src = image;
                    img.alt = 'Static Image';
                    img.className = 'preview';
                    if (staticCarousel) {
                        staticCarousel.appendChild(img);
                    }
                });

                if (staticCarousel) {
                    duplicateItems(staticCarousel);
                    staticCarousel.addEventListener('transitionend', handleTransitionEnd);
                    startAutoScroll();
                }

                // Update previews after images are added
                const previews = document.querySelectorAll('.preview');

                // Add event listeners for lightbox on static images
                previews.forEach((preview, i) => {
                    preview.addEventListener('click', () => {
                        openLightbox(i);
                    });
                });
            });
    }

    // Load static images on page load if no photos from database
    if (!carousel.children.length) {
        loadStaticImages();
    } else {
        duplicateItems(carousel);
        carousel.addEventListener('transitionend', handleTransitionEnd);
        startAutoScroll();
    }

    // Handle click event on preview images to open in fullscreen
    document.addEventListener('click', function (event) {
        const previews = document.querySelectorAll('.preview');
        if (event.target.classList.contains('preview')) {
            const index = Array.from(previews).indexOf(event.target);
            if (index !== -1) {
                openLightbox(index);
            }
        }
    });

    // Function to open lightbox with the image at a specific index
    function openLightbox(index) {
        const previews = document.querySelectorAll('.preview');
        if (!lightboxImage) {
            console.error('lightboxImage element not found');
            return;
        }
        if (previews.length === 0) {
            console.error('No preview elements found');
            return;
        }
        if (index >= 0 && index < previews.length) {
            lightboxImage.src = previews[index].src;
            lightbox.style.display = 'flex';
            hintText.style.display = 'block'; // Show the hint text when lightbox opens
        } else {
            console.error('Index out of bounds for previews');
        }
    }

    // Close lightbox when close button is clicked
    closeLightboxButton.addEventListener('click', function () {
        lightbox.style.display = 'none';
        hintText.style.display = 'none'; // Hide the hint text when lightbox closes
    });

    // Handle manual scrolling for database carousel
    if (scrollLeftButton) {
        scrollLeftButton.addEventListener('click', function () {
            stopAutoScroll();
            scrollLeft();
        });
    }

    if (scrollRightButton) {
        scrollRightButton.addEventListener('click', function () {
            stopAutoScroll();
            scrollRight();
        });
    }

    // Handle manual scrolling for static carousel
    if (scrollStaticLeftButton) {
        scrollStaticLeftButton.addEventListener('click', function () {
            stopAutoScroll();
            scrollLeft();
        });
    }

    if (scrollStaticRightButton) {
        scrollStaticRightButton.addEventListener('click', function () {
            stopAutoScroll();
            scrollRight();
        });
    }

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function (event) {
        if (lightbox.style.display === 'flex') {
            const previews = document.querySelectorAll('.preview');
            let currentIndex = Array.from(previews).findIndex(preview => preview.src === lightboxImage.src);

            if (currentIndex === -1) {
                console.error('Current index not found in previews');
                return;
            }

            switch (event.key) {
                case 'ArrowRight':
                    if (currentIndex < previews.length - 1) {
                        openLightbox(currentIndex + 1);
                    }
                    break;
                case 'ArrowLeft':
                    if (currentIndex > 0) {
                        openLightbox(currentIndex - 1);
                    }
                    break;
                case 'Escape':
                    lightbox.style.display = 'none';
                    hintText.style.display = 'none'; // Hide the hint text when lightbox closes
                    break;
            }
        }
    });

    // Lightbox mouse wheel navigation
    lightbox.addEventListener('wheel', function (e) {
        e.preventDefault();
        const previews = document.querySelectorAll('.preview');
        let currentIndex = Array.from(previews).findIndex(preview => preview.src === lightboxImage.src);

        if (currentIndex === -1) {
            console.error('Current index not found in previews');
            return;
        }

        if (e.deltaY < 0) {
            if (currentIndex > 0) {
                openLightbox(currentIndex - 1);
            }
        } else {
            if (currentIndex < previews.length - 1) {
                openLightbox(currentIndex + 1);
            }
        }
    });
});
