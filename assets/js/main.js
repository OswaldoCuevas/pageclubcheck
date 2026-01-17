/*
	Stellar by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$main = $('#main');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Nav.
		var $nav = $('#nav');

		if ($nav.length > 0) {

			// Shrink effect.
				$main
					.scrollex({
						mode: 'top',
						enter: function() {
							$nav.addClass('alt');
						},
						leave: function() {
							$nav.removeClass('alt');
						},
					});

			// Links.
				var $nav_a = $nav.find('a');

				$nav_a
					.scrolly({
						speed: 1000,
						offset: function() { return $nav.height(); }
					})
					.on('click', function() {

						var $this = $(this);

						// External link? Bail.
							if ($this.attr('href').charAt(0) != '#')
								return;

						// Deactivate all links.
							$nav_a
								.removeClass('active')
								.removeClass('active-locked');

						// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
							$this
								.addClass('active')
								.addClass('active-locked');

					})
					.each(function() {

						var	$this = $(this),
							id = $this.attr('href'),
							$section = $(id);

						// No section for this link? Bail.
							if ($section.length < 1)
								return;

						// Scrollex.
							$section.scrollex({
								mode: 'middle',
								initialize: function() {

									// Deactivate section.
										if (browser.canUse('transition'))
											$section.addClass('inactive');

								},
								enter: function() {

									// Activate section.
										$section.removeClass('inactive');

									// No locked links? Deactivate all links and activate this section's one.
										if ($nav_a.filter('.active-locked').length == 0) {

											$nav_a.removeClass('active');
											$this.addClass('active');

										}

									// Otherwise, if this section's link is the one that's locked, unlock it.
										else if ($this.hasClass('active-locked'))
											$this.removeClass('active-locked');

								}
							});

					});

		}

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000
		});

	// Carousel
		initCarousel();

	// Laptop Mockup Scroll Animation
		initLaptopAnimation();

})(jQuery);

// Laptop Scroll Animation
function initLaptopAnimation() {
	const laptop = document.querySelector('.laptop-frame');
	if (!laptop) return;
	
	const heroSection = document.querySelector('#header');
	let animationComplete = false;
	
	// Wait for CSS entrance animation to complete (0.7s delay + 0.7s duration = 1.4s)
	setTimeout(() => {
		animationComplete = true;
	}, 1500);
	
	window.addEventListener('scroll', () => {
		// Don't apply scroll transforms until entrance animation is complete
		if (!animationComplete) return;
		
		const scrollY = window.scrollY;
		const heroHeight = heroSection ? heroSection.offsetHeight : 600;
		
		// Calculate progress (0 to 1) based on scroll within hero
		const progress = Math.min(scrollY / (heroHeight * 0.5), 1);
		
		// Interpolate rotation from 5deg to 0deg
		const rotation = 5 * (1 - progress);
		// Interpolate scale from 1 to 1.02
		const scale = 1 + (0.02 * progress);
		
		laptop.style.transform = `rotateX(${rotation}deg) scale(${scale})`;
	});
}

// Carousel Functions
let currentSlide = 0;

function initCarousel() {
	const slides = document.querySelectorAll('.carousel-slide');
	
	if (!slides.length) return;
	
	// Auto-play (optional - uncomment to enable)
	// setInterval(() => moveCarousel(1), 5000);
	
	// Keyboard navigation
	document.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowLeft') moveCarousel(-1);
		if (e.key === 'ArrowRight') moveCarousel(1);
	});
	
	// Touch/swipe support
	let touchStartX = 0;
	let touchEndX = 0;
	
	const carousel = document.querySelector('.carousel');
	if (carousel) {
		carousel.addEventListener('touchstart', (e) => {
			touchStartX = e.changedTouches[0].screenX;
		});
		
		carousel.addEventListener('touchend', (e) => {
			touchEndX = e.changedTouches[0].screenX;
			handleSwipe();
		});
	}
	
	function handleSwipe() {
		const swipeThreshold = 50;
		if (touchEndX < touchStartX - swipeThreshold) {
			moveCarousel(1);
		}
		if (touchEndX > touchStartX + swipeThreshold) {
			moveCarousel(-1);
		}
	}
}

function moveCarousel(direction) {
	const slides = document.querySelectorAll('.carousel-slide');
	const titleElement = document.querySelector('.carousel-title');
	
	if (!slides.length) return;
	
	slides[currentSlide].classList.remove('active');
	
	currentSlide += direction;
	
	if (currentSlide >= slides.length) currentSlide = 0;
	if (currentSlide < 0) currentSlide = slides.length - 1;
	
	slides[currentSlide].classList.add('active');
	
	// Update title
	if (titleElement) {
		titleElement.textContent = slides[currentSlide].getAttribute('data-title');
	}
}

function goToSlide(index) {
	const slides = document.querySelectorAll('.carousel-slide');
	const titleElement = document.querySelector('.carousel-title');
	
	if (!slides.length) return;
	
	slides[currentSlide].classList.remove('active');
	
	currentSlide = index;
	
	slides[currentSlide].classList.add('active');
	
	// Update title
	if (titleElement) {
		titleElement.textContent = slides[currentSlide].getAttribute('data-title');
	}
}

// Image Modal / Lightbox Functions
let modalIndex = 0;

function initImageModal() {
	const slides = document.querySelectorAll('.carousel-slide');
	
	slides.forEach((slide, index) => {
		slide.addEventListener('click', () => {
			openModal(index);
		});
	});
	
	// Close modal with Escape key
	document.addEventListener('keydown', (e) => {
		const modal = document.getElementById('image-modal');
		if (modal && modal.classList.contains('active')) {
			if (e.key === 'Escape') closeModal();
			if (e.key === 'ArrowLeft') modalNavigate(-1);
			if (e.key === 'ArrowRight') modalNavigate(1);
		}
	});
	
	// Close modal when clicking outside image
	const modal = document.getElementById('image-modal');
	if (modal) {
		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				closeModal();
			}
		});
	}
}

function openModal(index) {
	const modal = document.getElementById('image-modal');
	const slides = document.querySelectorAll('.carousel-slide');
	
	if (!modal || !slides.length) return;
	
	modalIndex = index;
	updateModalImage();
	modal.classList.add('active');
	document.body.style.overflow = 'hidden';
}

function closeModal() {
	const modal = document.getElementById('image-modal');
	if (modal) {
		modal.classList.remove('active');
		document.body.style.overflow = '';
	}
}

function modalNavigate(direction) {
	const slides = document.querySelectorAll('.carousel-slide');
	
	modalIndex += direction;
	
	if (modalIndex >= slides.length) modalIndex = 0;
	if (modalIndex < 0) modalIndex = slides.length - 1;
	
	updateModalImage();
}

function updateModalImage() {
	const slides = document.querySelectorAll('.carousel-slide');
	const modalImage = document.getElementById('modal-image');
	const modalCaption = document.getElementById('modal-caption');
	
	if (!slides.length || !modalImage) return;
	
	const currentSlideEl = slides[modalIndex];
	const img = currentSlideEl.querySelector('img');
	
	modalImage.src = img.src;
	modalImage.alt = img.alt;
	
	if (modalCaption) {
		modalCaption.textContent = currentSlideEl.getAttribute('data-title') || '';
	}
}

// Initialize modal when DOM is ready
document.addEventListener('DOMContentLoaded', initImageModal);