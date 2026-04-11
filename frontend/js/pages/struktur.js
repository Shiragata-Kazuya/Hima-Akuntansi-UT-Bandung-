/**
 * STRUKTUR.JS - Halaman Struktur Organisasi (ES Module)
 *
 * Struktur Firestore aktual (dari screenshot):
 *   Koleksi : struktur
 *   Dokumen : data
 *   Field   : "2023" → { divisi[], galeri[], ketua{}, wakil{} }
 *             "2024" → { divisi[], galeri[], ketua{}, wakil{} }
 *
 * Jadi SEMUA data semua periode ada di SATU dokumen `struktur/data`,
 * dengan nama periode sebagai KEY di dalam dokumen.
 */

import { db } from '../firebase-init.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const StrukturPage = (() => {

    let currentTab     = sessionStorage.getItem('struktur_tab')    || 'bagan';
    let currentZoom    = 1;
    let isDragging     = false;
    let startX, startY, translateX = 0, translateY = 0;

    // Seluruh data dari Firestore (semua periode dalam satu objek)
    let allData        = null; // { "2023": {...}, "2024": {...} }
    let availablePeriodes = [];

    // ── FETCH ────────────────────────────────
    const loadStruktur = async () => {
        _renderLoading();
        try {
            // ✅ Koleksi: 'struktur', Dokumen: 'data'
            const snap = await getDoc(doc(db, 'struktur', 'data'));
            if (!snap.exists()) throw new Error('Dokumen struktur/data tidak ditemukan.');

            allData = snap.data();

            // Ambil daftar periode dari key dokumen (filter hanya angka tahun)
            availablePeriodes = Object.keys(allData)
                .filter(k => /^\d{4}$/.test(k))
                .sort((a, b) => b - a); // urutkan terbaru dulu

            if (availablePeriodes.length === 0) throw new Error('Tidak ada data periode di dalam struktur/data.');

            console.log(`✅ Data Struktur dimuat. Periode tersedia: ${availablePeriodes.join(', ')}`);
            render();
        } catch (err) {
            console.error('❌ Gagal fetch struktur/data:', err);
            _renderError(err.message);
        }
    };

    // ── LOADING & ERROR ──────────────────────
    const _renderLoading = () => {
        const c = document.getElementById('page-struktur');
        if (c) c.innerHTML = `<div class="flex justify-center items-center min-h-[400px]"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900"></div></div>`;
    };

    const _renderError = (msg = '') => {
        const c = document.getElementById('page-struktur');
        if (!c) return;
        c.innerHTML = `
            <div class="text-center py-16">
                <i class="fas fa-exclamation-circle text-5xl text-red-400 mb-4"></i>
                <p class="text-lg font-bold text-red-500 mb-2">Gagal memuat data struktur</p>
                <p class="text-gray-500 text-sm mb-6">${msg}</p>
                <button onclick="StrukturPage.init()" class="bg-navy-900 text-white px-6 py-2 rounded-lg hover:bg-navy-800 transition">
                    Coba Lagi
                </button>
            </div>`;
    };

    // ── HELPERS ──────────────────────────────
    const _e = (str) => { if (str == null) return ''; const d = document.createElement('div'); d.textContent = str; return d.innerHTML; };

    // ── MAIN RENDER ──────────────────────────
    const render = () => {
        const container = document.getElementById('page-struktur');
        if (!container || !allData) return;

        const activePeriode = sessionStorage.getItem('struktur_periode') || availablePeriodes[0];
        const dataTahun     = allData[activePeriode];

        const periodeOptions = availablePeriodes.map(p => `
            <option value="${p}" ${activePeriode === p ? 'selected' : ''}>
                Periode ${p}-${parseInt(p) + 1}
            </option>`).join('');

        container.innerHTML = `
            <section class="page-section fade-in py-10 px-4">
                <div class="max-w-7xl mx-auto text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-navy-900 mb-2">Struktur Organisasi</h2>
                    <p class="text-gray-500 mb-8">Periode ${_e(activePeriode)}</p>

                    <div class="flex flex-col items-center gap-6 mb-12">
                        <div class="relative">
                            <select id="periode-select" onchange="StrukturPage.gantiPeriode(this.value)"
                                    class="appearance-none bg-white border-2 border-navy-900 text-navy-900 font-bold py-3 px-10 pr-12 rounded-full cursor-pointer hover:bg-gray-50 transition">
                                ${periodeOptions}
                            </select>
                            <i class="fas fa-chevron-down absolute right-4 top-4 pointer-events-none text-navy-900"></i>
                        </div>

                        <div class="inline-flex rounded-md shadow-sm">
                            <button onclick="StrukturPage.switchTab('bagan')"
                                    class="px-6 py-2.5 text-sm font-bold rounded-l-lg border-2 border-navy-900 ${currentTab === 'bagan' ? 'bg-navy-900 text-gold-400' : 'bg-white text-navy-900'}">
                                <i class="fas fa-sitemap mr-2"></i>Bagan
                            </button>
                            <button onclick="StrukturPage.switchTab('galeri')"
                                    class="px-6 py-2.5 text-sm font-bold rounded-r-lg border-2 border-navy-900 ${currentTab === 'galeri' ? 'bg-navy-900 text-gold-400' : 'bg-white text-navy-900'}">
                                <i class="fas fa-images mr-2"></i>Galeri
                            </button>
                        </div>
                    </div>

                    <div id="struktur-content" class="min-h-[400px]">
                        ${!dataTahun
                            ? `<div class="text-center py-10 text-gray-400"><i class="fas fa-archive text-5xl mb-4"></i><p>Data periode ${_e(activePeriode)} tidak tersedia.</p></div>`
                            : (currentTab === 'bagan' ? _renderBagan(dataTahun, activePeriode) : _renderGaleri(dataTahun))
                        }
                    </div>
                </div>
            </section>

            <!-- Image Modal -->
            <div id="image-modal" class="hidden fixed inset-0 z-50 bg-black/90 flex justify-center items-center">
                <img id="modal-img" class="max-h-[90vh] max-w-[90vw] object-contain"
                     onmousedown="StrukturPage.startDrag(event)"
                     onmousemove="StrukturPage.doDrag(event)"
                     onmouseup="StrukturPage.endDrag()"
                     onmouseleave="StrukturPage.endDrag()">
                <button onclick="StrukturPage.closeModal()"
                        class="absolute top-5 right-5 text-white text-4xl hover:text-gold-400 transition">&times;</button>
                <div class="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                    <i class="fas fa-search-plus mr-2"></i>Scroll untuk zoom
                </div>
            </div>`;

        // Pasang wheel listener untuk zoom
        const modal = document.getElementById('image-modal');
        if (modal) {
            modal.addEventListener('wheel', (e) => {
                if (!modal.classList.contains('hidden')) { e.preventDefault(); zoomImage(e.deltaY > 0 ? -0.1 : 0.1); }
            }, { passive: false });
        }
    };

    // ── GANTI PERIODE ─────────────────────────
    const gantiPeriode = (tahun) => {
        sessionStorage.setItem('struktur_periode', tahun);
        render();
    };

    // ── RENDER BAGAN ─────────────────────────
    const _renderPersonCard = (person, role, isLeader = false) => {
        if (!person) return '';
        const border = isLeader ? 'border-gold-500' : 'border-gray-200';
        const size   = isLeader ? 'w-32 h-32' : 'w-24 h-24';
        const pos    = person.posisi || 'object-top';
        const scale  = person.scale  || 1;
        return `
            <div class="flex flex-col items-center group select-none">
                <div class="${size} rounded-full overflow-hidden border-4 ${border} shadow-lg mb-3 bg-white hover:shadow-xl transition-shadow cursor-pointer relative"
                     onclick="StrukturPage.openModal('${_e(person.img)}')" oncontextmenu="return false;">
                    <img src="${_e(person.img)}" alt="${_e(person.name)}"
                         class="w-full h-full object-cover ${pos} transition-transform duration-300 group-hover:scale-110 pointer-events-none"
                         style="transform: scale(${scale});" loading="lazy"
                         onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(person.name ?? 'N')}&background=0a192f&color=FFD700&size=256'">
                    <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                        <i class="fas fa-expand-alt text-white"></i>
                    </div>
                </div>
                <h4 class="font-bold text-navy-900 text-center text-sm md:text-base group-hover:text-gold-500 transition-colors">${_e(person.name)}</h4>
                <span class="text-xs text-gold-600 font-semibold uppercase tracking-wide">${_e(role)}</span>
            </div>`;
    };

    const _renderBagan = (data, periode) => {
        if (!data.divisi || data.divisi.length === 0) return `
            <div class="text-center text-gray-400 py-10 border-2 border-dashed border-gray-300 rounded-xl">
                <i class="fas fa-archive text-5xl mb-4"></i>
                <p>Data bagan periode ${_e(periode)} telah diarsipkan</p>
            </div>`;

        return `
            <div class="fade-in">
                <div class="flex justify-center gap-10 md:gap-20 mb-16 relative">
                    <div class="absolute top-20 left-1/2 -translate-x-1/2 w-32 border-t-2 border-dashed border-gray-300 -z-10"></div>
                    ${_renderPersonCard(data.ketua, 'Ketua Hima', true)}
                    ${_renderPersonCard(data.wakil, 'Wakil Ketua', true)}
                </div>
                <div class="grid grid-cols-1 gap-12">
                    ${(data.divisi ?? []).map(div => `
                        <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-100 relative mt-8 hover:shadow-lg transition-shadow">
                            <h3 class="absolute -top-4 left-1/2 -translate-x-1/2 bg-navy-900 text-gold-400 px-6 py-1 rounded-full font-bold shadow-md whitespace-nowrap">
                                Divisi ${_e(div.nama)}
                            </h3>
                            <div class="flex flex-col items-center mt-6">
                                <div class="mb-8">${_renderPersonCard(div.kadiv, 'Kepala Divisi')}</div>
                                <div class="w-full border-t border-gray-200 mb-6 relative">
                                    <span class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-400">Anggota</span>
                                </div>
                                <div class="flex flex-wrap justify-center gap-8 w-full">
                                    ${(div.anggota ?? []).map(m => _renderPersonCard(m, 'Staf')).join('')}
                                </div>
                            </div>
                        </div>`).join('')}
                </div>
            </div>`;
    };

    // ── RENDER GALERI ─────────────────────────
    const _renderGaleri = (data) => {
        if (!data.galeri || data.galeri.length === 0) return `
            <div class="text-center text-gray-400 py-10">
                <i class="fas fa-image text-5xl mb-4"></i><p>Belum ada foto dokumentasi</p>
            </div>`;

        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
                ${data.galeri.map(item => `
                    <div class="group relative overflow-hidden rounded-xl shadow-lg aspect-[4/3] cursor-pointer hover:shadow-xl transition-shadow select-none"
                         onclick="StrukturPage.openModal('${_e(item.url)}')">
                        <img src="${_e(item.url)}" alt="${_e(item.caption)}"
                             class="w-full h-full object-cover ${item.posisi || 'object-center'} transform group-hover:scale-110 transition duration-500 pointer-events-none"
                             loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800'">
                        <div class="absolute inset-0 z-10" oncontextmenu="return false;"></div>
                        <div class="absolute inset-0 bg-gradient-to-t from-navy-900/90 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-6 z-20 pointer-events-none">
                            <p class="text-white font-medium text-sm border-l-4 border-gold-500 pl-3">${_e(item.caption)}</p>
                        </div>
                    </div>`).join('')}
            </div>`;
    };

    // ── MODAL & ZOOM ──────────────────────────
    const openModal = (imgUrl) => {
        const modal = document.getElementById('image-modal');
        const img   = document.getElementById('modal-img');
        if (modal && img) {
            img.src = imgUrl; modal.classList.remove('hidden');
            currentZoom = 1; translateX = 0; translateY = 0;
            _updateTransform(); document.body.style.overflow = 'hidden';
        }
    };
    const closeModal = () => {
        const modal = document.getElementById('image-modal');
        if (modal) { modal.classList.add('hidden'); document.body.style.overflow = 'auto'; }
    };
    const zoomImage = (amount) => { currentZoom = Math.min(5, Math.max(0.5, currentZoom + amount)); _updateTransform(); };
    const _updateTransform = () => {
        const img = document.getElementById('modal-img');
        if (img) img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
    };
    const startDrag = (e) => { if (currentZoom > 1) { isDragging = true; startX = e.clientX - translateX; startY = e.clientY - translateY; const img = document.getElementById('modal-img'); if (img) img.style.transition = 'none'; } };
    const doDrag   = (e) => { if (!isDragging) return; e.preventDefault(); translateX = e.clientX - startX; translateY = e.clientY - startY; _updateTransform(); };
    const endDrag  = () => { isDragging = false; const img = document.getElementById('modal-img'); if (img) img.style.transition = 'transform 0.2s ease-out'; };

    // ── TAB ───────────────────────────────────
    const switchTab = (tabName) => { currentTab = tabName; sessionStorage.setItem('struktur_tab', tabName); render(); };

    // ── PUBLIC API ────────────────────────────
    const init = () => loadStruktur();
    return { init, render, switchTab, gantiPeriode, openModal, closeModal, zoomImage, startDrag, doDrag, endDrag };
})();

export default StrukturPage;