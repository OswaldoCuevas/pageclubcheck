/**
 * ClubCheck - Landing Page Functionality
 * Scroll animations, carousel, modal lightbox
 */

(function() {
	'use strict';

	/* ========================================
	   UTILITY FUNCTIONS
	   ======================================== */

	/**
	 * Update current year in footer
	 */
	function updateCurrentYear() {
		const yearElement = document.getElementById('current-year');
		if (yearElement) {
			yearElement.textContent = new Date().getFullYear();
		}
	}

	/* ========================================
	   SCROLL REVEAL ANIMATIONS
	   ======================================== */

	let revealObserver = null;

	/**
	 * Reveal an element immediately (skip animation completely)
	 * @param {Element} element - Element to reveal
	 */
	function revealImmediately(element) {
		if (!element) return;
		
		// Force immediate reveal by disabling transitions temporarily
		element.style.transition = 'none';
		element.style.opacity = '1';
		element.style.transform = 'none';
		
		// Add revealed classes
		element.classList.add('revealed');
		element.classList.remove('inactive');
		
		// Force reflow to apply styles immediately
		element.offsetHeight;
		
		// Re-enable transitions after a frame
		requestAnimationFrame(() => {
			element.style.transition = '';
			element.style.opacity = '';
			element.style.transform = '';
		});
	}

	/**
	 * Reveal a section and all its children immediately (no animation)
	 * @param {Element} section - Section element to reveal
	 */
	function revealSectionInstantly(section) {
		if (!section) return;
		
		// Reveal the section itself
		revealImmediately(section);
		
		// Reveal all animated children
		const animatedChildren = section.querySelectorAll(
			'.reveal, .reveal-left, .reveal-scale, .reveal-animate, .stagger-children, .stagger-children > *'
		);
		animatedChildren.forEach(child => revealImmediately(child));
	}

	/**
	 * Initialize scroll reveal animations
	 */
	function initScrollReveal() {
		// Add reveal-animate class to enable animations after page load
		document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .stagger-children').forEach(el => {
			el.classList.add('reveal-animate');
		});

		// Intersection Observer configuration
		const observerOptions = {
			root: null,
			rootMargin: '0px 0px -80px 0px',
			threshold: 0.15
		};

		// Create observer
		revealObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('revealed');
				}
			});
		}, observerOptions);

		// Observe all reveal elements
		document.querySelectorAll('.reveal-animate').forEach(el => {
			revealObserver.observe(el);
		});
	}

	/**
	 * Handle navigation link clicks - instant reveal + native smooth scroll
	 * Replaces jQuery scrolly for faster, more responsive navigation
	 */
	function initNavigationReveal() {
		// Get all navigation links (both in nav and internal links)
		const navLinks = document.querySelectorAll('#nav a[href^="#"]');
		
		navLinks.forEach(link => {
			// Replace scrolly completely for nav links
			link.addEventListener('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				const targetId = this.getAttribute('href');
				if (targetId && targetId !== '#') {
					const targetSection = document.querySelector(targetId);
					if (targetSection) {
						// Add instant-reveal class to skip ALL animations
						targetSection.classList.add('instant-reveal', 'revealed');
						targetSection.classList.remove('inactive');
						
						// Get nav height for offset
						const nav = document.getElementById('nav');
						const navHeight = nav ? nav.offsetHeight : 0;
						
						// Calculate target position
						const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
						
						// Use native smooth scroll (much faster than jQuery animate)
						window.scrollTo({
							top: targetPosition,
							behavior: 'smooth'
						});
						
						// Update active class on nav links
						navLinks.forEach(l => l.classList.remove('active', 'active-locked'));
						this.classList.add('active', 'active-locked');
						
						// Remove instant-reveal after scroll completes
						setTimeout(() => {
							targetSection.classList.remove('instant-reveal');
							this.classList.remove('active-locked');
						}, 800);
					}
				}
			}, true); // capture phase
		});
	}

	/* ========================================
	   CAROUSEL FUNCTIONALITY
	   ======================================== */

	let currentSlide = 0;
	let carouselInterval = null;

	/**
	 * Move carousel to next or previous slide
	 * @param {number} direction - 1 for next, -1 for previous
	 */
	function moveCarousel(direction) {
		const slides = document.querySelectorAll('.carousel-slide');
		const carouselTitle = document.querySelector('.carousel-title');
		
		if (slides.length === 0) return;

		slides[currentSlide].classList.remove('active');
		currentSlide = (currentSlide + direction + slides.length) % slides.length;
		slides[currentSlide].classList.add('active');
		
		if (carouselTitle && slides[currentSlide].dataset.title) {
			carouselTitle.textContent = slides[currentSlide].dataset.title;
		}
	}

	/**
	 * Initialize carousel auto-advance
	 */
	function initCarousel() {
		const slides = document.querySelectorAll('.carousel-slide');
		if (slides.length === 0) return;

		// Auto-advance carousel every 5 seconds
		carouselInterval = setInterval(() => moveCarousel(1), 5000);
	}

	// Expose moveCarousel to global scope for onclick handlers
	window.moveCarousel = moveCarousel;

	/* ========================================
	   MODAL LIGHTBOX FUNCTIONALITY
	   ======================================== */

	let modalCurrentIndex = 0;

	/**
	 * Open modal with selected image
	 * @param {number} index - Index of the image to display
	 */
	function openModal(index) {
		const modal = document.getElementById('image-modal');
		const modalImg = document.getElementById('modal-image');
		const modalCaption = document.getElementById('modal-caption');
		const slides = document.querySelectorAll('.carousel-slide');

		if (!modal || !modalImg || slides.length === 0) return;

		modalCurrentIndex = index;
		modal.classList.add('active');
		modalImg.src = slides[index].querySelector('img').src;
		modalCaption.textContent = slides[index].dataset.title || '';
		document.body.style.overflow = 'hidden';
	}

	/**
	 * Close modal lightbox
	 */
	function closeModal() {
		const modal = document.getElementById('image-modal');
		if (!modal) return;

		modal.classList.remove('active');
		document.body.style.overflow = '';
	}

	/**
	 * Navigate to next or previous image in modal
	 * @param {number} direction - 1 for next, -1 for previous
	 */
	function modalNavigate(direction) {
		const slides = document.querySelectorAll('.carousel-slide');
		const modalImg = document.getElementById('modal-image');
		const modalCaption = document.getElementById('modal-caption');

		if (slides.length === 0 || !modalImg) return;

		modalCurrentIndex = (modalCurrentIndex + direction + slides.length) % slides.length;
		const slide = slides[modalCurrentIndex];
		modalImg.src = slide.querySelector('img').src;
		modalCaption.textContent = slide.dataset.title || '';
	}

	/**
	 * Initialize modal event listeners
	 */
	function initModal() {
		const modal = document.getElementById('image-modal');
		if (!modal) return;

		// Click on carousel slides to open modal
		document.querySelectorAll('.carousel-slide').forEach((slide, index) => {
			slide.addEventListener('click', () => openModal(index));
		});

		// Close modal on escape key
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				closeModal();
			}
			if (modal.classList.contains('active')) {
				if (e.key === 'ArrowLeft') modalNavigate(-1);
				if (e.key === 'ArrowRight') modalNavigate(1);
			}
		});

		// Close modal on backdrop click
		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				closeModal();
			}
		});
	}

	// Expose modal functions to global scope for onclick handlers
	window.closeModal = closeModal;
	window.modalNavigate = modalNavigate;

	/* ========================================
	   INITIALIZATION
	   ======================================== */

	/**
	 * Initialize all functionality when DOM is ready
	 */
	function init() {
		updateCurrentYear();
		initCarousel();
		initModal();
		initNavigationReveal();
	}

	/**
	 * Initialize scroll reveal after page load
	 */
	window.addEventListener('load', function() {
		initScrollReveal();
	});

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

})();
