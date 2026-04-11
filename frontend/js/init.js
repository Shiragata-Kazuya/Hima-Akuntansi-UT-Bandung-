/**
 * ========================================
 * INIT.JS - Entry Point Aplikasi (ES Module)
 * ========================================
 */

import HomePage     from './pages/home.js';
import KegiatanPage from './pages/kegiatan.js';
import StrukturPage from './pages/struktur.js';
import KontakPage   from './pages/kontak.js';

// ── 1. Expose modul ke window (untuk onclick di HTML) ──
window.HomePage     = HomePage;
window.KegiatanPage = KegiatanPage;
window.StrukturPage = StrukturPage;
window.KontakPage   = KontakPage;

// ── 2. Lazy-init tracker ──
const VALID_PAGES = ['home', 'kegiatan', 'struktur', 'kontak'];
const initialized = { home: false, kegiatan: false, struktur: false, kontak: false };

const initPage = (name) => {
    if (!VALID_PAGES.includes(name) || initialized[name]) return;
    initialized[name] = true;
    console.log(`🔧 Init modul: ${name}`);
    if (name === 'home')     HomePage.init();
    if (name === 'kegiatan') KegiatanPage.init();
    if (name === 'struktur') StrukturPage.init();
    if (name === 'kontak')   KontakPage.init();
};

// ── 3. Patch Navigation.showPage ──
const patchNavigation = () => {
    // window.Navigation harus sudah ada karena navigation.js
    // adalah script biasa yang dimuat SEBELUM init.js di index.html
    if (typeof window.Navigation?.showPage !== 'function') {
        console.error('❌ window.Navigation tidak ditemukan. Pastikan navigation.js sudah mengandung window.Navigation = Navigation di bagian bawah file.');
        // Fallback darurat: render home langsung tanpa navigation
        initPage('home');
        document.getElementById('page-home')?.classList.remove('hidden');
        return false;
    }

    const original = window.Navigation.showPage.bind(window.Navigation);
    window.Navigation.showPage = (name) => {
        original(name);   // urus DOM show/hide
        initPage(name);   // init modul halaman (1x saja)
    };
    console.log('✅ Navigation.showPage di-patch.');
    return true;
};

// ── 4. Tentukan halaman awal ──
const getInitialPage = () => {
    const hash  = window.location.hash.slice(1);
    const saved = localStorage.getItem('active_page');
    if (VALID_PAGES.includes(hash))  return hash;
    if (VALID_PAGES.includes(saved)) return saved;
    return 'home';
};

// ── 5. Bootstrap ──
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 HIMA AKUNTANSI UT BANDUNG - Aplikasi dimulai.');

    // Init navigation listeners (aman jika fungsi init tidak ada)
    if (typeof window.Navigation?.init === 'function') {
        window.Navigation.init();
    }

    // Patch & buka halaman awal
    if (patchNavigation()) {
        window.Navigation.showPage(getInitialPage());
    }
});