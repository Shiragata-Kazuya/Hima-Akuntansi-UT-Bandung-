/**
 * Security Module - Menangani keamanan aplikasi
 */

const Security = (() => {
    
    /**
     * Sanitasi input HTML untuk mencegah XSS
     */
    const sanitizeHTML = (str) => {
        if (typeof str !== 'string') return '';
        
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };

    /**
     * Escape karakter khusus HTML
     */
    const escapeHTML = (str) => {
        if (typeof str !== 'string') return '';
        
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };
        
        return str.replace(/[&<>"'/]/g, (char) => map[char]);
    };

    /**
     * Validasi email format
     */
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    /**
     * Validasi URL format
     */
    const isValidURL = (url) => {
        try {
            const urlObj = new URL(url);
            return ['http:', 'https:'].includes(urlObj.protocol);
        } catch {
            return false;
        }
    };

    /**
     * Rate limiting untuk form submissions
     */
    const rateLimiter = (() => {
        const attempts = new Map();
        const MAX_ATTEMPTS = 5;
        const WINDOW_MS = 60000; // 1 menit

        return {
            check: (key) => {
                const now = Date.now();
                const userAttempts = attempts.get(key) || [];
                
                // Filter attempts dalam time window
                const recentAttempts = userAttempts.filter(
                    time => now - time < WINDOW_MS
                );

                if (recentAttempts.length >= MAX_ATTEMPTS) {
                    return false;
                }

                recentAttempts.push(now);
                attempts.set(key, recentAttempts);
                return true;
            },
            
            reset: (key) => {
                attempts.delete(key);
            }
        };
    })();

    /**
     * Generate random token untuk CSRF protection
     */
    const generateToken = () => {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    };

    /**
     * Validasi input form
     */
    const validateFormInput = (input, type = 'text', maxLength = 1000) => {
        if (!input || typeof input !== 'string') {
            return { valid: false, error: 'Input tidak valid' };
        }

        // Cek panjang
        if (input.length > maxLength) {
            return { valid: false, error: `Input terlalu panjang (max ${maxLength} karakter)` };
        }

        // Validasi berdasarkan tipe
        switch (type) {
            case 'email':
                if (!isValidEmail(input)) {
                    return { valid: false, error: 'Format email tidak valid' };
                }
                break;
            
            case 'url':
                if (!isValidURL(input)) {
                    return { valid: false, error: 'Format URL tidak valid' };
                }
                break;
            
            case 'name':
                // Hanya huruf, spasi, dan karakter tertentu
                if (!/^[a-zA-Z\s\-'.]+$/.test(input)) {
                    return { valid: false, error: 'Nama hanya boleh berisi huruf' };
                }
                break;
        }

        return { valid: true, sanitized: sanitizeHTML(input) };
    };

    /**
     * Content Security Policy checker
     */
    const checkCSP = () => {
        const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (!meta) {
            console.warn('CSP header tidak ditemukan!');
            return false;
        }
        return true;
    };

    /**
     * Prevent clickjacking
     */
    const preventClickjacking = () => {
        if (window.top !== window.self) {
            console.warn('Clickjacking terdeteksi!');
            window.top.location = window.self.location;
        }
    };

    /**
     * Secure storage wrapper dengan enkripsi sederhana
     */
    const secureStorage = {
        set: (key, value) => {
            try {
                const data = JSON.stringify(value);
                const encoded = btoa(data); // Base64 encoding
                sessionStorage.setItem(key, encoded);
                return true;
            } catch (error) {
                console.error('Error menyimpan data:', error);
                return false;
            }
        },
        
        get: (key) => {
            try {
                const encoded = sessionStorage.getItem(key);
                if (!encoded) return null;
                const data = atob(encoded);
                return JSON.parse(data);
            } catch (error) {
                console.error('Error membaca data:', error);
                return null;
            }
        },
        
        remove: (key) => {
            sessionStorage.removeItem(key);
        },
        
        clear: () => {
            sessionStorage.clear();
        }
    };

    /**
     * Log aktivitas mencurigakan
     */
    const logSuspiciousActivity = (activity, details = {}) => {
        const log = {
            timestamp: new Date().toISOString(),
            activity,
            details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        console.warn('Aktivitas Mencurigakan:', log);
        
        // Dalam produksi, kirim ke server untuk monitoring
        // sendToSecurityMonitoring(log);
    };

    /**
     * Deteksi SQL Injection patterns
     */
    const detectSQLInjection = (input) => {
        const sqlPatterns = [
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC)\b)/gi,
            /(union.*select|select.*from|insert.*into)/gi,
            /[';]--/g,
            /\/\*.*\*\//g
        ];

        for (const pattern of sqlPatterns) {
            if (pattern.test(input)) {
                logSuspiciousActivity('SQL Injection Attempt', { input });
                return true;
            }
        }
        return false;
    };

    /**
     * Deteksi XSS patterns
     */
    const detectXSS = (input) => {
        const xssPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<iframe/gi,
            /<object/gi,
            /<embed/gi
        ];

        for (const pattern of xssPatterns) {
            if (pattern.test(input)) {
                logSuspiciousActivity('XSS Attempt', { input });
                return true;
            }
        }
        return false;
    };

    /**
     * Validasi input komprehensif
     */
    const validateInput = (input, options = {}) => {
        const {
            type = 'text',
            maxLength = 1000,
            required = true,
            allowHTML = false
        } = options;

        // Cek required
        if (required && (!input || input.trim() === '')) {
            return { valid: false, error: 'Field ini wajib diisi' };
        }

        if (!input) return { valid: true, sanitized: '' };

        // Deteksi serangan
        if (detectSQLInjection(input)) {
            return { valid: false, error: 'Input mengandung karakter berbahaya' };
        }

        if (!allowHTML && detectXSS(input)) {
            return { valid: false, error: 'Input mengandung kode berbahaya' };
        }

        // Validasi form input
        const validation = validateFormInput(input, type, maxLength);
        
        return validation;
    };

    /**
     * Initialize security measures
     */
    const init = () => {
        checkCSP();
        preventClickjacking();
        
        // Disable console di production (optional)
        if (window.location.hostname !== 'localhost' && 
            window.location.hostname !== '127.0.0.1') {
            // console.log = () => {};
            // console.warn = () => {};
        }

        console.log('🔒 Security module initialized');
    };

    // Public API
    return {
        sanitizeHTML,
        escapeHTML,
        isValidEmail,
        isValidURL,
        validateInput,
        rateLimiter,
        generateToken,
        secureStorage,
        logSuspiciousActivity,
        init
    };
})();

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', Security.init);
} else {
    Security.init();
}