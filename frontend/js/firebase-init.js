/**
 * ========================================
 * FIREBASE-INIT.JS - Inisialisasi Firebase
 * ========================================
 * File ini menjadi satu-satunya titik inisialisasi Firebase.
 * Semua halaman cukup meng-import { db } dari file ini.
 */

import Config from './config.js';

// Import Firebase SDK v9 Modular dari CDN (compat build agar tidak perlu bundler)
import { initializeApp }   from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore }    from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Inisialisasi Firebase menggunakan config terpusat
const app = initializeApp(Config.FIREBASE_CONFIG);

// Ekspor instance Firestore agar bisa dipakai di seluruh halaman
export const db = getFirestore(app);

console.log('🔥 Firebase berhasil diinisialisasi.');
