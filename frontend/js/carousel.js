/**
 * Carousel Module - Menangani image slider di homepage
 */

const Carousel = (() => {
    
    let currentSlide = 0;
    let slideCount = 0;
    let autoPlayInterval = null;
    let isPlaying = true;
    const AUTO_PLAY_DELAY = 5000; // 5 detik

    /**
     * Initialize carousel
     */
    const init = () => {
        const container = document.getElementById('carousel-container');
        if (!container) return;

        slideCount = container.children.length;
        
        if (slideCount === 0) {
            console.warn('No slides found in carousel');
            return;
        }

        // Set initial position
        updateSlidePosition();
        
        // Update indicators
        updateIndicators();

        // Start autoplay
        startAutoPlay();

        // Add touch/swipe support
        addTouchSupport();

        console.log(`🎠 Carousel initialized with ${slideCount} slides`);
    };

    /**
     * Move carousel to specific direction
     */
    const move = (direction) => {
        if (slideCount === 0) return;

        // Stop autoplay sementara saat manual navigation
        stopAutoPlay();

        // Calculate new slide index
        currentSlide = (currentSlide + direction + slideCount) % slideCount;

        // Update position
        updateSlidePosition();
        
        // Update indicators
        updateIndicators();

        // Restart autoplay setelah 3 detik
        setTimeout(() => {
            if (isPlaying) startAutoPlay();
        }, 3000);
    };

    /**
     * Go to specific slide
     */
    const goToSlide = (index) => {
        if (index < 0 || index >= slideCount) return;

        stopAutoPlay();
        currentSlide = index;
        updateSlidePosition();
        updateIndicators();

        setTimeout(() => {
            if (isPlaying) startAutoPlay();
        }, 3000);
    };

    /**
     * Update slide position with smooth transition
     */
    const updateSlidePosition = () => {
        const container = document.getElementById('carousel-container');
        if (!container) return;

        const offset = -currentSlide * 100;
        container.style.transform = `translateX(${offset}%)`;
    };

    /**
     * Update carousel indicators
     */
    const updateIndicators = () => {
        const indicators = document.querySelectorAll('.carousel-indicator');
        if (indicators.length === 0) return;

        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.remove('bg-white/50');
                indicator.classList.add('bg-white');
                indicator.setAttribute('aria-current', 'true');
            } else {
                indicator.classList.add('bg-white/50');
                indicator.classList.remove('bg-white');
                indicator.setAttribute('aria-current', 'false');
            }
        });
    };

    /**
     * Start autoplay
     */
    const startAutoPlay = () => {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        
        autoPlayInterval = setInterval(() => {
            move(1);
        }, AUTO_PLAY_DELAY);

        isPlaying = true;
    };

    /**
     * Stop autoplay
     */
    const stopAutoPlay = () => {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        isPlaying = false;
    };

    /**
     * Pause autoplay
     */
    const pause = () => {
        stopAutoPlay();
    };

    /**
     * Resume autoplay
     */
    const resume = () => {
        if (!isPlaying) {
            startAutoPlay();
        }
    };

    /**
     * Add touch/swipe support untuk mobile
     */
    const addTouchSupport = () => {
        const container = document.getElementById('carousel-container');
        if (!container) return;

        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50;

        const handleTouchStart = (e) => {
            touchStartX = e.touches[0].clientX;
            pause(); // Pause saat user touch
        };

        const handleTouchMove = (e) => {
            touchEndX = e.touches[0].clientX;
        };

        const handleTouchEnd = () => {
            const swipeDistance = touchStartX - touchEndX;

            if (Math.abs(swipeDistance) > minSwipeDistance) {
                if (swipeDistance > 0) {
                    // Swipe left - next slide
                    move(1);
                } else {
                    // Swipe right - previous slide
                    move(-1);
                }
            } else {
                // Resume autoplay jika tidak ada swipe
                resume();
            }
        };

        container.parentElement.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.parentElement.addEventListener('touchmove', handleTouchMove, { passive: true });
        container.parentElement.addEventListener('touchend', handleTouchEnd);
    };

    /**
     * Pause carousel saat tab tidak aktif (performance optimization)
     */
    const handleVisibilityChange = () => {
        if (document.hidden) {
            pause();
        } else {
            resume();
        }
    };

    /**
     * Destroy carousel (cleanup)
     */
    const destroy = () => {
        stopAutoPlay();
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

    /**
     * Get current slide index
     */
    const getCurrentSlide = () => {
        return currentSlide;
    };

    /**
     * Get total slide count
     */
    const getSlideCount = () => {
        return slideCount;
    };

    // Setup visibility change handler
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Public API
    return {
        init,
        move,
        goToSlide,
        pause,
        resume,
        destroy,
        getCurrentSlide,
        getSlideCount
    };
})();

// Note: Carousel akan di-init dari HomePage.init()