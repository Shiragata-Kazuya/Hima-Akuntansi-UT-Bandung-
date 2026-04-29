/**
 * ========================================
 * KONTAK.JS - Halaman Kontak (ES Module)
 * ========================================
 * - Data kontak diambil dari Firestore koleksi `kontak` (doc: "main").
 * - Form submission disimpan ke koleksi `pesan_masuk` menggunakan addDoc.
 *
 * Struktur dokumen Firestore `kontak/main`:
 * {
 *   email:   string,
 *   phone:   string,
 *   address: string,
 *   social: {
 *     instagram: string,   // "@handle" atau "handle"
 *     twitter:   string,
 *     linkedin:  string    // slug perusahaan
 *   }
 * }
 */

import { db } from '../firebase-init.js';
import {
    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// ─── EmailJS config (pindahkan ke sini agar tidak menganggu async function) ───
const SERVICE_ID  = 'service_a8l8rsn';   // MASUKKAN SERVICE ID DI SINI
const TEMPLATE_ID = 'template_cjt27rs';  // MASUKKAN TEMPLATE ID DI SINI
const USER_ID     = 'PdFEAzoytCuoFvR4y';

const KontakPage = (() => {

    let kontakData = null;

    // ─────────────────────────────────────────
    // DATA FETCHING
    // ─────────────────────────────────────────

    const loadKontakData = async () => {
        _renderLoading();

        try {
            const docSnap = await getDoc(doc(db, 'kontak', 'data'));

            if (docSnap.exists()) {
                kontakData = docSnap.data();
                console.log('✅ Data Kontak berhasil dimuat dari Firestore.');
            } else {
                console.warn('⚠️ Dokumen kontak/main tidak ditemukan. Menggunakan data fallback.');
                kontakData = _getFallbackData();
            }
        } catch (error) {
            console.error('❌ Gagal ambil data kontak dari Firestore:', error);
            kontakData = _getFallbackData();
        }

        render();
    };

    const _getFallbackData = () => ({
        email:   'himaaksi.utbandung@gmail.com',
        phone:   '+62 22 1234 567',
        address: 'Universitas Terbuka Bandung, Jl. Cihampelas No. 123, Bandung',
        social: {
            instagram: '@himaaksi_utbandung',
            twitter:   '@himaaksi_ut',
            linkedin:  'hima-akuntansi-ut'
        }
    });

    // ─────────────────────────────────────────
    // LOADING STATE
    // ─────────────────────────────────────────

    const _renderLoading = () => {
        const container = document.getElementById('page-kontak');
        if (!container) return;
        container.innerHTML = `
            <div class="flex justify-center items-center min-h-[400px]">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900"></div>
            </div>`;
    };

    // ─────────────────────────────────────────
    // UTILITY
    // ─────────────────────────────────────────

    const escapeHTML = (str) => {
        if (str == null) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    // ─────────────────────────────────────────
    // MAIN RENDER — HTML tidak diubah, hanya data source
    // ─────────────────────────────────────────

    const render = () => {
        const container = document.getElementById('page-kontak');
        if (!container || !kontakData) return;

        const instagramHandle = kontakData.social.instagram.replace('@', '');
        const twitterHandle   = kontakData.social.twitter.replace('@', '');
        const linkedinSlug    = kontakData.social.linkedin;
        const waNumber        = kontakData.phone.replace(/[\s\+\-]/g, '');

        container.innerHTML = `
            <section class="page-section fade-in py-10 px-4">
                <div class="max-w-6xl mx-auto">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px]">

                        <!-- Left Side: Contact Info -->
                        <div class="bg-navy-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
                            <div class="absolute inset-0 opacity-10">
                                <div class="absolute top-0 right-0 w-64 h-64 bg-gold-500 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                                <div class="absolute bottom-0 left-0 w-96 h-96 bg-gold-500 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                            </div>

                            <div class="relative z-10">
                                <h2 class="text-3xl md:text-4xl font-bold mb-6 text-gold-400">Hubungi Kami</h2>
                                <p class="text-gray-300 mb-8">Kami siap membantu menjawab pertanyaan Anda. Jangan ragu untuk menghubungi kami!</p>

                                <div class="space-y-6">
                                    <!-- Lokasi -->
                                    <div class="flex items-start gap-4 group">
                                        <div class="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center group-hover:bg-gold-500 transition-colors duration-300">
                                            <i class="fas fa-map-marker-alt text-gold-500 group-hover:text-navy-900 text-xl transition-colors duration-300"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-gold-400 mb-1">Lokasi</h4>
                                            <p class="text-sm text-gray-300">${escapeHTML(kontakData.address)}</p>
                                        </div>
                                    </div>

                                    <!-- Email -->
                                    <div class="flex items-start gap-4 group">
                                        <div class="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center group-hover:bg-gold-500 transition-colors duration-300">
                                            <i class="fas fa-envelope text-gold-500 group-hover:text-navy-900 text-xl transition-colors duration-300"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-gold-400 mb-1">Email</h4>
                                            <a href="mailto:${escapeHTML(kontakData.email)}"
                                               class="text-sm text-gray-300 hover:text-gold-400 transition-colors">
                                                ${escapeHTML(kontakData.email)}
                                            </a>
                                        </div>
                                    </div>

                                    <!-- Phone -->
                                    <div class="flex items-start gap-4 group">
                                        <div class="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center group-hover:bg-gold-500 transition-colors duration-300">
                                            <i class="fas fa-phone text-gold-500 group-hover:text-navy-900 text-xl transition-colors duration-300"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-gold-400 mb-1">Telepon</h4>
                                            <a href="tel:${escapeHTML(waNumber)}"
                                               class="text-sm text-gray-300 hover:text-gold-400 transition-colors">
                                                ${escapeHTML(kontakData.phone)}
                                            </a>
                                        </div>
                                    </div>

                                    <!-- Social Media -->
                                    <div class="flex items-start gap-4 group">
                                        <div class="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center group-hover:bg-gold-500 transition-colors duration-300">
                                            <i class="fas fa-share-alt text-gold-500 group-hover:text-navy-900 text-xl transition-colors duration-300"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-gold-400 mb-1">Media Sosial</h4>
                                            <div class="flex gap-3 mt-2">
                                                <a href="https://instagram.com/${escapeHTML(instagramHandle)}"
                                                   target="_blank" rel="noopener noreferrer"
                                                   class="w-10 h-10 bg-white/10 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-colors duration-300 group/icon"
                                                   aria-label="Instagram">
                                                    <i class="fab fa-instagram text-gold-400 group-hover/icon:text-navy-900"></i>
                                                </a>
                                                <a href="https://twitter.com/${escapeHTML(twitterHandle)}"
                                                   target="_blank" rel="noopener noreferrer"
                                                   class="w-10 h-10 bg-white/10 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-colors duration-300 group/icon"
                                                   aria-label="Twitter">
                                                    <i class="fab fa-twitter text-gold-400 group-hover/icon:text-navy-900"></i>
                                                </a>
                                                <a href="https://linkedin.com/company/${escapeHTML(linkedinSlug)}"
                                                   target="_blank" rel="noopener noreferrer"
                                                   class="w-10 h-10 bg-white/10 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-colors duration-300 group/icon"
                                                   aria-label="LinkedIn">
                                                    <i class="fab fa-linkedin text-gold-400 group-hover/icon:text-navy-900"></i>
                                                </a>
                                                <a href="https://wa.me/${escapeHTML(waNumber)}"
                                                   target="_blank" rel="noopener noreferrer"
                                                   class="w-10 h-10 bg-white/10 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-colors duration-300 group/icon"
                                                   aria-label="WhatsApp">
                                                    <i class="fab fa-whatsapp text-gold-400 group-hover/icon:text-navy-900"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="relative z-10 mt-8 pt-6 border-t border-gold-500/30">
                                <p class="text-sm text-gray-400">
                                    <i class="far fa-clock mr-2"></i>
                                    Senin - Jumat: 09.00 - 17.00 WIB
                                </p>
                            </div>
                        </div>

                        <!-- Right Side: Contact Form -->
                        <div class="p-10 flex flex-col justify-center">
                            <h3 class="text-2xl md:text-3xl font-bold text-navy-900 mb-2">Kirim Pesan</h3>
                            <p class="text-gray-600 mb-6">Isi formulir di bawah ini dan kami akan segera menghubungi Anda</p>

                            <form id="contact-form" class="space-y-5">
                                <!-- Nama -->
                                <div>
                                    <label for="contact-name" class="block text-sm font-semibold text-navy-900 mb-2">
                                        Nama Lengkap <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" id="contact-name" name="name" required
                                           placeholder="Masukkan nama lengkap Anda"
                                           class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all duration-300">
                                    <span class="text-red-500 text-xs hidden" id="name-error"></span>
                                </div>

                                <!-- Email -->
                                <div>
                                    <label for="contact-email" class="block text-sm font-semibold text-navy-900 mb-2">
                                        Email <span class="text-red-500">*</span>
                                    </label>
                                    <input type="email" id="contact-email" name="email" required
                                           placeholder="email@example.com"
                                           class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all duration-300">
                                    <span class="text-red-500 text-xs hidden" id="email-error"></span>
                                </div>

                                <!-- Subject -->
                                <div>
                                    <label for="contact-subject" class="block text-sm font-semibold text-navy-900 mb-2">
                                        Subjek <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" id="contact-subject" name="subject" required
                                           placeholder="Topik pesan Anda"
                                           class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all duration-300">
                                    <span class="text-red-500 text-xs hidden" id="subject-error"></span>
                                </div>

                                <!-- Message -->
                                <div>
                                    <label for="contact-message" class="block text-sm font-semibold text-navy-900 mb-2">
                                        Pesan <span class="text-red-500">*</span>
                                    </label>
                                    <textarea id="contact-message" name="message" required rows="5"
                                              placeholder="Tuliskan pesan Anda di sini..."
                                              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 resize-none transition-all duration-300"></textarea>
                                    <span class="text-red-500 text-xs hidden" id="message-error"></span>
                                </div>

                                <!-- Submit Button -->
                                <button type="submit" id="submit-btn"
                                        class="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
                                    <i class="fas fa-paper-plane mr-2"></i>Kirim Pesan
                                </button>

                                <!-- Notifikasi sukses/gagal -->
                                <div id="form-notif" class="hidden px-4 py-3 rounded-lg text-sm font-semibold text-center"></div>
                            </form>
                        </div>
                    </div>

                    <!-- Google Maps Section -->
                    <div class="mt-10 bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div class="h-[400px] relative">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.6130848963026!2d107.7102313739977!3d-6.936760493063214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68c389194ea69d%3A0x17ffbd659d2e3af4!2sUniversitas%20Terbuka%20Bandung!5e0!3m2!1sid!2sid!4v1770736732538!5m2!1sid!2sid"
                                width="100%"
                                height="100%"
                                style="border:0;"
                                allowfullscreen=""
                                loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade"
                                class="grayscale hover:grayscale-0 transition-all duration-500">
                            </iframe>
                            <div class="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg">
                                <p class="text-sm font-semibold text-navy-900">
                                    <i class="fas fa-map-marker-alt text-gold-500 mr-2"></i>
                                    Universitas Terbuka Bandung
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        attachEventListeners();
    };

    // ─────────────────────────────────────────
    // FORM EVENT LISTENERS
    // ─────────────────────────────────────────

    const attachEventListeners = () => {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', handleSubmit);

        // Real-time validation: hapus error saat user mengetik
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', (e) => clearError(e.target.name));
        });
    };

    const showError = (fieldName, message) => {
        const errorEl = document.getElementById(`${fieldName}-error`);
        const inputEl = document.querySelector(`[name="${fieldName}"]`);
        if (errorEl && inputEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
            inputEl.classList.add('border-red-500');
            inputEl.classList.remove('border-gray-300');
        }
    };

    const clearError = (fieldName) => {
        const errorEl = document.getElementById(`${fieldName}-error`);
        const inputEl = document.querySelector(`[name="${fieldName}"]`);
        if (errorEl && inputEl) {
            errorEl.classList.add('hidden');
            inputEl.classList.remove('border-red-500');
            inputEl.classList.add('border-gray-300');
        }
    };

    const _showFormNotif = (message, isSuccess) => {
        const notif = document.getElementById('form-notif');
        if (!notif) return;
        notif.textContent = message;
        notif.className   = `px-4 py-3 rounded-lg text-sm font-semibold text-center ${
            isSuccess
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
        }`;
        notif.classList.remove('hidden');
        if (isSuccess) {
            setTimeout(() => notif.classList.add('hidden'), 6000);
        }
    };

    // ─────────────────────────────────────────
    // FORM SUBMISSION → FIRESTORE addDoc
    // ─────────────────────────────────────────

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form      = e.target;
        const submitBtn = document.getElementById('submit-btn');
        const formData  = new FormData(form);

        const name    = formData.get('name').trim();
        const email   = formData.get('email').trim();
        const subject = formData.get('subject').trim();
        const message = formData.get('message').trim();

        // Validasi sederhana
        let hasError = false;
        if (!name)    { showError('name',    'Nama tidak boleh kosong.');    hasError = true; }
        if (!email)   { showError('email',   'Email tidak boleh kosong.');   hasError = true; }
        if (!subject) { showError('subject', 'Subjek tidak boleh kosong.');  hasError = true; }
        if (!message) { showError('message', 'Pesan tidak boleh kosong.');   hasError = true; }
        if (hasError) return;

        // Rate limiting
        if (typeof Security !== 'undefined' && !Security.rateLimiter.check('contact')) {
            _showFormNotif('⏳ Anda terlalu sering mengirim. Tunggu beberapa saat.', false);
            return;
        }

        // Loading state
        submitBtn.disabled  = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Mengirim...';

        try {
            // 1️⃣ Simpan ke Firestore koleksi `pesan_masuk`
            await addDoc(collection(db, 'pesan_masuk'), {
                name,
                email,
                subject,
                message,
                timestamp: serverTimestamp(),
                status:    'unread'
            });
            console.log('✅ Pesan berhasil disimpan ke Firestore koleksi pesan_masuk.');

            // 2️⃣ Kirim notifikasi email via EmailJS
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
                from_name:    name,    // cocok dengan {{from_name}} di From Name
                name:         name,    // cocok dengan {{name}} di body
                email:        email,   // cocok dengan {{email}} di Reply To
                title:        subject, // cocok dengan {{title}} di Subject
                message:      message  // cocok dengan {{message}} di body
            }, USER_ID);
            console.log('✅ Email notifikasi berhasil dikirim via EmailJS.');

            _showFormNotif('✅ Pesan Anda berhasil terkirim! Kami akan segera menghubungi Anda.', true);
            form.reset();
        } catch (error) {
            console.error('❌ Error:', error);
            // Pesan tetap tersimpan di Firestore meski email gagal
            if (error?.text || error?.status) {
                // Error dari EmailJS
                _showFormNotif('⚠️ Pesan tersimpan, tapi gagal kirim email notifikasi. Hubungi kami langsung.', false);
            } else {
                _showFormNotif('❌ Gagal mengirim pesan. Silakan coba lagi atau hubungi kami langsung.', false);
            }
        } finally {
            submitBtn.disabled  = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Kirim Pesan';
        }
    };

    // ─────────────────────────────────────────
    // PUBLIC API
    // ─────────────────────────────────────────

    const init = () => loadKontakData();

    return { init, render, loadKontakData };
})();

export default KontakPage;
