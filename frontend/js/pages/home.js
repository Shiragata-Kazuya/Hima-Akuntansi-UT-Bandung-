/**
 * HOME.JS - Halaman Beranda (ES Module)
 *
 * Struktur Firestore aktual:
 *   Koleksi : home
 *   Dokumen : data
 *   Field   : about{title,description}, features[], stats[], hero{slides[]}, visiMisi{visi,misi}
 */

import { db } from '../firebase-init.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const HomePage = (() => {

    let homeData = null;

    // ── FETCH ────────────────────────────────
    const loadHomeData = async () => {
        _renderLoading();
        try {
            // ✅ Koleksi: 'home', Dokumen: 'data'
            const snap = await getDoc(doc(db, 'home', 'data'));
            if (snap.exists()) {
                homeData = snap.data();
                console.log('✅ Data Home dimuat dari Firestore (home/data).');
            } else {
                console.warn('⚠️ home/data tidak ditemukan. Pakai fallback.');
                homeData = _fallback();
            }
        } catch (err) {
            console.error('❌ Gagal fetch home/data:', err);
            homeData = _fallback();
        }
        render();
    };

    // ── FALLBACK ─────────────────────────────
    const _fallback = () => ({
        hero: {
            slides: [
                { image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600', title: 'Profesional & Berintegritas', subtitle: 'Membangun Generasi Akuntan Unggul', alt: 'Accounting Team' },
                { image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600', title: 'Kolaborasi & Inovasi', subtitle: 'Bersama Hima Akuntansi UT Bandung', alt: 'Collaboration' }
            ]
        },
        about: { title: 'Tentang Kami', description: 'Himpunan Mahasiswa Akuntansi Universitas Terbuka Bandung.' },
        features: [
            { icon: 'fa-book-open', title: 'Edukasi', description: 'Workshop dan seminar untuk meningkatkan kompetensi' },
            { icon: 'fa-users', title: 'Sosial', description: 'Kegiatan bakti sosial dan kepedulian masyarakat' },
            { icon: 'fa-network-wired', title: 'Relasi', description: 'Membangun jaringan profesional yang luas' }
        ],
        stats: [
            { number: '20+', label: 'Anggota Aktif', icon: 'fa-users' },
            { number: '10+', label: 'Kegiatan per Tahun', icon: 'fa-calendar-check' },
            { number: '5+', label: 'Mitra Kerjasama', icon: 'fa-handshake' },
            { number: '2+', label: 'Tahun Berdiri', icon: 'fa-trophy' }
        ],
        visiMisi: {
            visi: { title: 'Visi', content: 'Menjadikan HIMA Akuntansi sebagai organisasi yang unggul, aktif, inovatif, dan berintegritas tinggi.' },
            misi: { title: 'Misi', items: ['Menjadi Jembatan Komunikasi & Aspirasi', 'Meningkatan Kualitas Akademik & Profesionalisme', 'Pengembangan Inovasi dan Kreativitas', 'Solidaritas & Kolaborasi Strategis', 'Kontribusi Sosial & Pengabdian Masyarakat'] }
        }
    });

    // ── HELPERS ──────────────────────────────
    const _e = (str) => { if (str == null) return ''; const d = document.createElement('div'); d.textContent = str; return d.innerHTML; };
    const _renderLoading = () => {
        const c = document.getElementById('page-home');
        if (c) c.innerHTML = `<div class="flex justify-center items-center min-h-[400px]"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900"></div></div>`;
    };

    // ── RENDER ───────────────────────────────
    const render = () => {
        const container = document.getElementById('page-home');
        if (!container || !homeData) return;

        // Hero: bisa dari homeData.hero.slides atau fallback 1 slide kosong
        const slides = homeData.hero?.slides ?? [];

        container.innerHTML = `
            <section class="page-section fade-in">

                <!-- Hero Carousel -->
                <div class="relative bg-navy-900 h-[500px] w-full overflow-hidden">
                    <div id="carousel-container" class="absolute inset-0 flex transition-transform duration-700 ease-in-out">
                        ${slides.length > 0 ? slides.map(s => `
                            <div class="min-w-full h-full relative">
                                <img src="${_e(s.image)}" alt="${_e(s.alt)}"
                                     class="w-full h-full object-cover opacity-40" loading="lazy">
                                <div class="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                                    <h1 class="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">${_e(s.title)}</h1>
                                    <p class="text-gold-400 text-xl font-medium tracking-wide">${_e(s.subtitle)}</p>
                                </div>
                            </div>`).join('') : `
                            <div class="min-w-full h-full flex items-center justify-center">
                                <h1 class="text-4xl font-bold text-white">HIMA AKUNTANSI UT BANDUNG</h1>
                            </div>`
                        }
                    </div>
                    ${slides.length > 1 ? `
                    <button onclick="Carousel.move(-1)" class="absolute left-4 top-1/2 -translate-y-1/2 bg-gold-500/20 hover:bg-gold-500 text-white p-3 rounded-full backdrop-blur-sm transition" aria-label="Previous slide">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button onclick="Carousel.move(1)" class="absolute right-4 top-1/2 -translate-y-1/2 bg-gold-500/20 hover:bg-gold-500 text-white p-3 rounded-full backdrop-blur-sm transition" aria-label="Next slide">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        ${slides.map((_, i) => `<button onclick="Carousel.goToSlide(${i})" class="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white transition" aria-label="Slide ${i+1}"></button>`).join('')}
                    </div>` : ''}
                </div>

                <!-- About -->
                <div class="max-w-4xl mx-auto py-16 px-4 text-center">
                    <h2 class="text-3xl font-bold text-navy-900 mb-6 border-b-4 border-gold-500 inline-block pb-2">
                        ${_e(homeData.about?.title ?? 'Tentang Kami')}
                    </h2>
                    <p class="text-lg text-gray-600 leading-relaxed mb-8">
                        ${_e(homeData.about?.description ?? '')}
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                        ${(homeData.features ?? []).map(f => `
                            <div class="p-6 bg-white shadow-lg rounded-xl border-t-4 border-navy-800 hover:-translate-y-2 transition duration-300">
                                <i class="fas ${_e(f.icon)} text-4xl text-gold-500 mb-4"></i>
                                <h3 class="text-xl font-bold text-navy-900 mb-2">${_e(f.title)}</h3>
                                <p class="text-gray-600 text-sm">${_e(f.description)}</p>
                            </div>`).join('')}
                    </div>
                </div>

                <!-- Stats -->
                <div class="bg-navy-900 py-16">
                    <div class="max-w-6xl mx-auto px-4">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            ${(homeData.stats ?? []).map(s => `
                                <div class="text-white">
                                    <i class="fas ${_e(s.icon)} text-3xl text-gold-400 mb-3"></i>
                                    <div class="text-4xl font-bold text-gold-400 mb-2">${_e(s.number)}</div>
                                    <div class="text-sm text-gray-300">${_e(s.label)}</div>
                                </div>`).join('')}
                        </div>
                    </div>
                </div>

                <!-- Visi Misi -->
                <div class="max-w-6xl mx-auto py-16 px-4">
                    <div class="grid md:grid-cols-2 gap-10">
                        <div class="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-gold-500">
                            <div class="flex items-center gap-3 mb-4">
                                <i class="fas fa-eye text-3xl text-gold-500"></i>
                                <h3 class="text-2xl font-bold text-navy-900">${_e(homeData.visiMisi?.visi?.title ?? 'Visi')}</h3>
                            </div>
                            <p class="text-gray-700 leading-relaxed text-justify">${_e(homeData.visiMisi?.visi?.content ?? '')}</p>
                        </div>
                        <div class="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-navy-800">
                            <div class="flex items-center gap-3 mb-4">
                                <i class="fas fa-bullseye text-3xl text-navy-800"></i>
                                <h3 class="text-2xl font-bold text-navy-900">${_e(homeData.visiMisi?.misi?.title ?? 'Misi')}</h3>
                            </div>
                            <ul class="space-y-3 text-gray-600">
                                ${(homeData.visiMisi?.misi?.items ?? []).map(item => `
                                    <li class="flex items-start gap-2">
                                        <i class="fas fa-check-circle text-gold-500 mt-1"></i>
                                        <span>${_e(item)}</span>
                                    </li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

            </section>`;

        if (typeof Carousel !== 'undefined' && slides.length > 1) Carousel.init();
    };

    const init = () => loadHomeData();
    return { init, render, loadHomeData };
})();

export default HomePage;