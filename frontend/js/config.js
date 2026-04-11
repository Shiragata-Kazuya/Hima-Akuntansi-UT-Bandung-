/**
 * ========================================
 * CONFIG.JS - Konfigurasi Aplikasi (ES Module)
 * ========================================
 */

const Config = {
    // Informasi Aplikasi
    APP_NAME: 'HIMA AKUNTANSI UT BANDUNG',
    APP_VERSION: '2.0.0',

    // ✅ FIREBASE CONFIGURATION
    // Ganti semua nilai placeholder di bawah ini dengan data dari
    // Firebase Console > Project Settings > Your Apps > SDK setup and configuration
    FIREBASE_CONFIG: {
        apiKey:            "AIzaSyCAYA5893rHVg19bWK_TpoH8fmUWhmWUPc",
        authDomain:        "hima-akuntansi-ut-bandung.firebaseapp.com",
        projectId:         "hima-akuntansi-ut-bandung",
        storageBucket:     "hima-akuntansi-ut-bandung.firebasestorage.app",
        messagingSenderId: "1026390101138",
        appId:             "1:1026390101138:web:49667ae3d26379f779ea4b",
    },

    // Kontak (digunakan sebagai fallback jika Firestore tidak tersedia)
    CONTACT: {
        email:     'himaaksi.utbandung@gmail.com',
        phone:     '+62 22 1234 567',
        whatsapp:  '+6281234567890',
        address:   'Universitas Terbuka Bandung, Jl. Cihampelas No. 123, Bandung',
    },

    // Social Media (fallback)
    SOCIAL_MEDIA: {
        instagram: 'https://instagram.com/himaaksi_utbandung',
        twitter:   'https://twitter.com/himaaksi_ut',
        linkedin:  'https://linkedin.com/company/himaaksi-utbandung',
        youtube:   'https://youtube.com/@himaaksi',
    },

    // Feature Flags
    FEATURES: {
        enableAnalytics:        false,
        enableServiceWorker:    false,
        enablePushNotifications: false,
        enableDarkMode:         false,
    },

    // Rate Limiting
    RATE_LIMIT: {
        maxAttempts: 5,
        windowMs:    60000, // 1 menit
    },

    // Validation
    VALIDATION: {
        maxNameLength:    100,
        maxEmailLength:   100,
        maxMessageLength: 1000,
        maxSubjectLength: 200,
    },

    // Carousel Settings
    CAROUSEL: {
        autoPlayDelay:      5000,
        transitionDuration: 700,
    },
};

// Freeze agar tidak bisa diubah dari luar
Object.freeze(Config);
Object.freeze(Config.FIREBASE_CONFIG);
Object.freeze(Config.CONTACT);
Object.freeze(Config.SOCIAL_MEDIA);
Object.freeze(Config.FEATURES);
Object.freeze(Config.RATE_LIMIT);
Object.freeze(Config.VALIDATION);
Object.freeze(Config.CAROUSEL);

export default Config;
