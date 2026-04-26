/**
 * KEGIATAN.JS - Halaman Kegiatan (ES Module)
 *
 * Struktur Firestore aktual (2 format yang terdeteksi dari screenshot):
 *
 * FORMAT A — Dokumen langsung (doc ID = "1", "2", dst):
 *   kegiatan/1 → { id, title, date, image, shortDesc, fullDesc, category }
 *
 * FORMAT B — Dokumen wrapper 'data' dengan array:
 *   kegiatan/data → { activities: [ {id, title, ...}, ... ] }
 *
 * Kode ini mendukung KEDUA format sekaligus.
 */

import { db } from '../firebase-init.js';
import {
    collection, getDocs, doc, getDoc,
    addDoc, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const KegiatanPage = (() => {

    let activities = [];

    // ── FETCH ────────────────────────────────
    const loadActivities = async () => {
        _renderLoading();
        try {
            // Coba ambil semua dokumen di koleksi 'kegiatan'
            const snapshot = await getDocs(collection(db, 'kegiatan'));
            let result = [];

            snapshot.forEach(docSnap => {
                const d = docSnap.data();

                if (docSnap.id === 'data' && Array.isArray(d.activities)) {
                    // ✅ FORMAT B: dokumen 'data' berisi array activities
                    result.push(...d.activities);
                } else if (docSnap.id !== 'data') {
                    // ✅ FORMAT A: setiap dokumen = 1 kegiatan
                    result.push({ id: docSnap.id, ...d });
                }
            });

            // Deduplikasi berdasarkan id jika ada yang dobel
            const seen = new Set();
            activities = result.filter(a => {
                const key = String(a.id ?? a.title);
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });

            // Urutkan: terbaru berdasarkan id/date (opsional)
            activities.sort((a, b) => String(b.id).localeCompare(String(a.id)));

            console.log(`✅ ${activities.length} kegiatan dimuat dari Firestore.`);
        } catch (err) {
            console.error('❌ Gagal fetch kegiatan:', err);
            activities = [];
        }
        render();
    };

    // ── HELPERS ──────────────────────────────
    const _e = (str) => { if (str == null) return ''; const d = document.createElement('div'); d.textContent = str; return d.innerHTML; };
    const _renderLoading = () => {
        const c = document.getElementById('page-kegiatan');
        if (c) c.innerHTML = `<div class="flex justify-center items-center min-h-[400px]"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900"></div></div>`;
    };

    const renderActivities = (filter = 'all') => {
        const filtered = filter === 'all' ? activities : activities.filter(a => a.category === filter);
        if (filtered.length === 0) return `
            <div class="col-span-full text-center py-20">
                <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
                <p class="text-gray-500 text-lg">Belum ada kegiatan untuk kategori ini</p>
            </div>`;

        return filtered.map(act => `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover-gold-glow transition duration-300 cursor-pointer flex flex-col h-full"
                 onclick="KegiatanPage.openModal('${_e(String(act.id))}')"
                 data-category="${_e(act.category)}">
                <div class="h-48 overflow-hidden relative">
                    <!-- Gunakan background-image agar imgPosX/imgPosY/imgScale dari admin bisa diterapkan -->
                    <div class="w-full h-full"
                         style="
                             background-image: url('${_e(act.image)}');
                             background-size: ${(act.imgScale ?? 1) * 100}%;
                             background-position: ${act.imgPosX ?? 50}% ${act.imgPosY ?? 50}%;
                             background-repeat: no-repeat;
                             background-color: #e9ecef;
                             transition: background-size 0.5s ease;
                         "
                         onmouseover="this.style.backgroundSize='${((act.imgScale ?? 1) * 1.08) * 100}%'"
                         onmouseout="this.style.backgroundSize='${(act.imgScale ?? 1) * 100}%'">
                    </div>
                    <span class="absolute top-3 right-3 bg-gold-500 text-navy-900 text-xs font-bold px-3 py-1 rounded-full">
                        ${_e(act.category)}
                    </span>
                </div>
                <div class="p-6 flex-1 flex flex-col">
                    <span class="text-gold-600 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <i class="far fa-calendar"></i>${_e(act.date)}
                    </span>
                    <h3 class="text-xl font-bold text-navy-900 mb-2">${_e(act.title)}</h3>
                    <p class="text-gray-600 text-sm flex-1">${_e(act.shortDesc)}</p>
                    <div class="mt-4 text-navy-800 font-semibold text-sm flex items-center group">
                        Lihat Detail <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition"></i>
                    </div>
                </div>
            </div>`).join('');
    };

    // ── MAIN RENDER ──────────────────────────
    const render = () => {
        const container = document.getElementById('page-kegiatan');
        if (!container) return;

        container.innerHTML = `
            <section class="page-section fade-in py-10 px-4">
                <div class="max-w-7xl mx-auto">
                    <div class="text-center mb-12">
                        <h2 class="text-3xl md:text-4xl font-bold text-navy-900 mb-3">Kegiatan Kami</h2>
                        <p class="text-gray-600 mt-2">Dokumentasi dan Informasi Agenda Terbaru</p>
                        <div class="flex flex-wrap justify-center gap-3 mt-8">
                            <button onclick="KegiatanPage.filterCategory('all')" class="filter-btn px-6 py-2 rounded-full border-2 border-navy-900 font-semibold transition-all duration-300 bg-navy-900 text-gold-400" data-category="all">Semua</button>
                            <button onclick="KegiatanPage.filterCategory('Seminar')" class="filter-btn px-6 py-2 rounded-full border-2 border-navy-900 text-navy-900 font-semibold hover:bg-navy-900 hover:text-gold-400 transition-all duration-300" data-category="Seminar">Seminar</button>
                            <button onclick="KegiatanPage.filterCategory('Workshop')" class="filter-btn px-6 py-2 rounded-full border-2 border-navy-900 text-navy-900 font-semibold hover:bg-navy-900 hover:text-gold-400 transition-all duration-300" data-category="Workshop">Workshop</button>
                            <button onclick="KegiatanPage.filterCategory('Sosial')" class="filter-btn px-6 py-2 rounded-full border-2 border-navy-900 text-navy-900 font-semibold hover:bg-navy-900 hover:text-gold-400 transition-all duration-300" data-category="Sosial">Sosial</button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="activity-container">
                        ${renderActivities()}
                    </div>

                    <!-- Feedback Form -->
                    <div class="mt-20 bg-navy-900 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        <div class="absolute inset-0 opacity-10">
                            <div class="absolute top-0 left-0 w-64 h-64 bg-gold-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                            <div class="absolute bottom-0 right-0 w-96 h-96 bg-gold-500 rounded-full translate-x-1/2 translate-y-1/2"></div>
                        </div>
                        <div class="relative z-10 text-center text-white">
                            <i class="fas fa-comments text-5xl text-gold-400 mb-4"></i>
                            <h3 class="text-2xl md:text-3xl font-bold mb-2">Suara Anda Sangat Berarti</h3>
                            <p class="text-gray-300 mb-8">Berikan masukan untuk kegiatan yang lebih baik</p>
                            <form id="feedback-form" class="max-w-lg mx-auto space-y-4">
                                <input type="text" id="feedback-name" placeholder="Nama Anda (Opsional)"
                                       class="w-full px-4 py-3 rounded-lg bg-navy-800 border border-navy-700 text-white placeholder-gray-400 focus:border-gold-500 transition">
                                <textarea id="feedback-message" placeholder="Tulis masukan Anda..." required rows="4"
                                          class="w-full px-4 py-3 rounded-lg bg-navy-800 border border-navy-700 text-white placeholder-gray-400 focus:border-gold-500 transition"></textarea>
                                <button type="submit" id="feedback-btn"
                                        class="w-full bg-gold-500 text-navy-900 font-bold py-3 rounded-lg hover:bg-gold-400 transition shadow-lg flex items-center justify-center gap-2">
                                    <i class="fas fa-paper-plane"></i><span>Kirim Masukan</span>
                                </button>
                            </form>
                            <div id="feedback-notif" class="hidden mt-4 px-4 py-3 rounded-lg text-sm font-semibold"></div>
                        </div>
                    </div>
                </div>
            </section>`;

        document.getElementById('feedback-form')?.addEventListener('submit', handleFeedback);
    };

    // ── FILTER ───────────────────────────────
    const filterCategory = (category) => {
        const container = document.getElementById('activity-container');
        if (!container) return;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn.dataset.category === category) { btn.classList.add('bg-navy-900', 'text-gold-400'); btn.classList.remove('text-navy-900'); }
            else { btn.classList.remove('bg-navy-900', 'text-gold-400'); btn.classList.add('text-navy-900'); }
        });
        container.style.opacity = '0';
        setTimeout(() => { container.innerHTML = renderActivities(category); container.style.opacity = '1'; }, 200);
    };

    // ── MODAL ────────────────────────────────
    const openModal = (id) => {
        const act = activities.find(a => String(a.id) === String(id));
        if (!act) return;
        const mc = document.getElementById('modal-container');
        if (!mc) return;
        mc.innerHTML = `
            <div class="fixed inset-0 z-[60] overflow-y-auto">
                <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onclick="KegiatanPage.closeModal()"></div>
                    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
                            <div class="flex justify-between items-start mb-4">
                                <h3 class="text-2xl font-bold text-navy-900">${_e(act.title)}</h3>
                                <button onclick="KegiatanPage.closeModal()" class="text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-times text-2xl"></i>
                                </button>
                            </div>
                            <img src="${_e(act.image)}" alt="${_e(act.title)}"
                                 class="w-full h-64 object-cover rounded-lg mb-4"
                                 onerror="this.src='https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800'">
                            <div class="flex items-center gap-4 mb-4">
                                <span class="flex items-center gap-2 text-gold-600 font-bold"><i class="far fa-calendar"></i>${_e(act.date)}</span>
                                <span class="bg-gold-100 text-gold-800 px-3 py-1 rounded-full text-xs font-bold">${_e(act.category)}</span>
                            </div>
                            <p class="text-gray-700 leading-relaxed">${_e(act.fullDesc)}</p>
                        </div>
                        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
                            <button onclick="KegiatanPage.closeModal()"
                                    class="w-full inline-flex justify-center rounded-md px-6 py-2 bg-navy-900 text-white font-medium hover:bg-navy-800 sm:w-auto transition">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
    };

    const closeModal = () => { const mc = document.getElementById('modal-container'); if (mc) mc.innerHTML = ''; };

    // ── FEEDBACK → FIRESTORE ─────────────────
    const _notif = (msg, ok) => {
        const n = document.getElementById('feedback-notif');
        if (!n) return;
        n.textContent = msg;
        n.className = `mt-4 px-4 py-3 rounded-lg text-sm font-semibold ${ok ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`;
        n.classList.remove('hidden');
        if (ok) setTimeout(() => n.classList.add('hidden'), 5000);
    };

    const handleFeedback = async (e) => {
        e.preventDefault();
        const name = document.getElementById('feedback-name')?.value.trim() || 'Anonim';
        const message = document.getElementById('feedback-message')?.value.trim();
        const btn = document.getElementById('feedback-btn');
        if (!message) { _notif('⚠️ Pesan tidak boleh kosong.', false); return; }
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Mengirim...';
        try {
            await addDoc(collection(db, 'feedback_kegiatan'), { name, message, timestamp: serverTimestamp() });
            _notif('✅ Terima kasih! Masukan Anda telah kami terima.', true);
            e.target.reset();
        } catch (err) {
            console.error('❌ Gagal simpan feedback:', err);
            _notif('❌ Gagal mengirim. Silakan coba lagi.', false);
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i><span>Kirim Masukan</span>';
        }
    };

    const init = () => loadActivities();
    return { init, render, filterCategory, openModal, closeModal };
})();

export default KegiatanPage;
