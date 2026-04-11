/**
 * ========================================
 * NAVIGATION.JS - Navigation Module (FIXED)
 * ========================================
 * FIX UTAMA: Tambahkan `window.Navigation = Navigation` di akhir file
 * agar object ini bisa diakses oleh init.js dan onclick di HTML.
 */

const Navigation = (() => {

    const pages = ['home', 'kegiatan', 'struktur', 'kontak'];
    let currentPage = 'home';

    const showPage = (pageId) => {
        if (!pages.includes(pageId)) {
            console.error(`Navigation: Invalid page "${pageId}"`);
            return;
        }

        currentPage = pageId;
        localStorage.setItem('active_page', pageId);

        // Sembunyikan semua halaman
        pages.forEach(page => {
            const el = document.getElementById(`page-${page}`);
            if (el) el.classList.add('hidden');
        });

        // Tampilkan halaman yang dipilih
        const target = document.getElementById(`page-${pageId}`);
        if (target) {
            target.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        updateNavButtons(pageId);
        closeMobileMenu();
        updateURL(pageId);
        console.log(`Page view: ${pageId}`);
    };

    const updateNavButtons = (activePageId) => {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('text-gold-400', 'border-b-2', 'border-gold-400');
            btn.setAttribute('aria-current', 'false');
        });
        const activeBtn = document.getElementById(`nav-${activePageId}`);
        if (activeBtn) {
            activeBtn.classList.add('text-gold-400', 'border-b-2', 'border-gold-400');
            activeBtn.setAttribute('aria-current', 'page');
        }
    };

    const toggleMobileMenu = () => {
        const menu = document.getElementById('mobile-menu');
        if (!menu) return;
        menu.classList.toggle('hidden');
        const btn = document.querySelector('[onclick*="toggleMobileMenu"]');
        if (btn) btn.setAttribute('aria-expanded', String(!menu.classList.contains('hidden')));
    };

    const closeMobileMenu = () => {
        const menu = document.getElementById('mobile-menu');
        if (menu && !menu.classList.contains('hidden')) {
            menu.classList.add('hidden');
            const btn = document.querySelector('[onclick*="toggleMobileMenu"]');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }
    };

    const updateURL = (pageId) => {
        if (history.pushState) {
            history.pushState({ page: pageId }, '', `${window.location.pathname}#${pageId}`);
        } else {
            window.location.hash = pageId;
        }
    };

    const getCurrentPage = () => currentPage;

    const init = () => {
        // Handle tombol back/forward browser
        window.addEventListener('popstate', (event) => {
            const hash = window.location.hash.slice(1);
            const target = (event.state?.page && pages.includes(event.state.page))
                ? event.state.page
                : (pages.includes(hash) ? hash : 'home');
            showPage(target);
        });

        // Tutup mobile menu saat resize ke desktop
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth >= 768) closeMobileMenu();
            }, 250);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMobileMenu();
            if (e.ctrlKey || e.metaKey) {
                const idx = pages.indexOf(currentPage);
                if (e.key === 'ArrowLeft'  && idx > 0)                  { e.preventDefault(); showPage(pages[idx - 1]); }
                if (e.key === 'ArrowRight' && idx < pages.length - 1)   { e.preventDefault(); showPage(pages[idx + 1]); }
            }
        });

        console.log('🧭 Navigation module initialized');
    };

    return { showPage, toggleMobileMenu, closeMobileMenu, getCurrentPage, init };
})();

// ✅ INI YANG HILANG — Expose ke window agar bisa diakses oleh init.js dan onclick HTML
window.Navigation = Navigation;