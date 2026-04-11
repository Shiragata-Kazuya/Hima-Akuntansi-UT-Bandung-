/**
 * ========================================
 * UTILS.JS - Utility Functions
 * ========================================
 */

const Utils = (() => {
    
    /**
     * Format tanggal ke format Indonesia
     */
    const formatDateID = (dateString) => {
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];

        const date = new Date(dateString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    };

    /**
     * Truncate text dengan ellipsis
     */
    const truncateText = (text, maxLength = 100) => {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    };

    /**
     * Debounce function untuk performance
     */
    const debounce = (func, delay = 300) => {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    /**
     * Throttle function untuk event handling
     */
    const throttle = (func, limit = 300) => {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    /**
     * Deep clone object
     */
    const deepClone = (obj) => {
        if (obj === null || typeof obj !== 'object') return obj;
        
        try {
            return JSON.parse(JSON.stringify(obj));
        } catch (error) {
            console.error('Deep clone error:', error);
            return obj;
        }
    };

    /**
     * Check if element is in viewport
     */
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    /**
     * Lazy load images
     */
    const lazyLoadImages = () => {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    };

    /**
     * Smooth scroll to element
     */
    const smoothScrollTo = (elementId, offset = 0) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    };

    /**
     * Generate unique ID
     */
    const generateUniqueId = (prefix = 'id') => {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    /**
     * Copy text to clipboard
     */
    const copyToClipboard = async (text) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback untuk browser lama
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    return true;
                } catch (error) {
                    document.body.removeChild(textArea);
                    return false;
                }
            }
        } catch (error) {
            console.error('Copy to clipboard failed:', error);
            return false;
        }
    };

    /**
     * Show toast notification
     */
    const showToast = (message, type = 'info', duration = 3000) => {
        const toast = document.createElement('div');
        
        const bgColors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };

        toast.className = `fixed bottom-4 right-4 ${bgColors[type] || bgColors.info} text-white px-6 py-3 rounded-lg shadow-lg z-[9999] animate-slide-in-right`;
        toast.textContent = message;
        
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease-out';
            
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, duration);
    };

    /**
     * Format file size
     */
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    /**
     * Get query parameter from URL
     */
    const getQueryParam = (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    };

    /**
     * Set query parameter in URL
     */
    const setQueryParam = (param, value) => {
        const url = new URL(window.location);
        url.searchParams.set(param, value);
        window.history.pushState({}, '', url);
    };

    /**
     * Check if user is on mobile device
     */
    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    /**
     * Get device type
     */
    const getDeviceType = () => {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return 'tablet';
        }
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return 'mobile';
        }
        return 'desktop';
    };

    /**
     * Local storage helper dengan error handling
     */
    const storage = {
        set: (key, value) => {
            try {
                const data = JSON.stringify(value);
                localStorage.setItem(key, data);
                return true;
            } catch (error) {
                console.error('LocalStorage set error:', error);
                return false;
            }
        },
        
        get: (key, defaultValue = null) => {
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : defaultValue;
            } catch (error) {
                console.error('LocalStorage get error:', error);
                return defaultValue;
            }
        },
        
        remove: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('LocalStorage remove error:', error);
                return false;
            }
        },
        
        clear: () => {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('LocalStorage clear error:', error);
                return false;
            }
        }
    };

    // Public API
    return {
        formatDateID,
        truncateText,
        debounce,
        throttle,
        deepClone,
        isInViewport,
        lazyLoadImages,
        smoothScrollTo,
        generateUniqueId,
        copyToClipboard,
        showToast,
        formatFileSize,
        getQueryParam,
        setQueryParam,
        isMobile,
        getDeviceType,
        storage
    };
})();