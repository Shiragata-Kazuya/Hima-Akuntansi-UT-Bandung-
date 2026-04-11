# 🎓 HIMA AKUNTANSI UT BANDUNG - Website Resmi

Website resmi Himpunan Mahasiswa Akuntansi Universitas Terbuka Bandung (Kabinet Sinergi 2024-2025).

## 📁 Struktur Project

```
Backend/
├── node_modules/                # Default install node.js nodemon   
├── package-lock.json            # Defult install node.js nodemon
└──  server.js                   # data dari Home page, kegiatan, dan strukture

frontend/
 └──  project/
      ├── index.html                # File HTML utama
      ├── styles.css                # Semua styling CSS
      ├── js/
      │   ├── config.js             # Konfigurasi aplikasi
      │   ├── utils.js              # Utility functions
      │   ├── security.js           # Security module
      │   ├── navigation.js         # Navigation handler
      │   ├── carousel.js           # Carousel slider
      │   ├── init.js               # App initialization
      │   └── pages/
      │       ├── home.js           # Halaman Beranda
      │       ├── kegiatan.js       # Halaman Kegiatan
      │       ├── struktur.js       # Halaman Struktur
      │       └── kontak.js         # Halaman Kontak
      └── README.md                 # Dokumentasi ini
```

## 🔒 Fitur Keamanan

### 1. **Content Security Policy (CSP)**
- Mencegah XSS attacks
- Whitelist domain untuk script & style
- Header keamanan tambahan (X-Frame-Options, etc)

### 2. **Input Validation & Sanitization**
- Sanitasi HTML untuk mencegah XSS
- Validasi email, nama, dan input text
- SQL Injection pattern detection
- XSS pattern detection

### 3. **Rate Limiting**
- Maksimal 5 percobaan per menit untuk form submission
- Mencegah spam dan brute force attacks

### 4. **Secure Storage**
- Session storage dengan base64 encoding
- NEVER menggunakan localStorage untuk data sensitif
- Automatic cleanup on session end

### 5. **CSRF Protection**
- Token generation untuk forms
- Random token menggunakan crypto API

### 6. **Error Handling**
- Global error handler
- Unhandled promise rejection handler
- Suspicious activity logging

## 🚀 Cara Menggunakan

### Setup Basic

1. **Clone/Download Project**
   ```bash
   git clone [repository-url]
   cd hima-akuntansi-ut
   ```

2. **Buka dengan Browser**
   - Langsung buka `index.html` di browser
   - Atau gunakan local server:
     ```bash
     # Dengan Python
     python -m http.server 8000
     
     # Dengan Node.js
     npx http-server
     ```

3. **Akses di Browser**
   ```
   http://localhost:8000
   ```

### Konfigurasi

Edit `js/config.js` untuk mengubah:
- Informasi kontak
- Social media links
- Feature flags
- Rate limiting settings
- Validasi rules

```javascript
const Config = {
    CONTACT: {
        email: 'email@domain.com',
        phone: '+62 xxx',
        // ...
    },
    FEATURES: {
        enableAnalytics: true,  // Enable Google Analytics
        enableDarkMode: true,   // Enable dark mode
        // ...
    }
}
```

## 📱 Fitur Aplikasi

### 1. **Halaman Beranda**
- Hero carousel dengan auto-play
- Informasi tentang organisasi
- Visi & Misi
- Statistics counter

### 2. **Halaman Kegiatan**
- Grid layout activities
- Filter berdasarkan kategori
- Modal detail kegiatan
- Form feedback dengan validasi

### 3. **Halaman Struktur Organisasi**
- Switcher: Bagan / Galeri
- Dropdown periode tahun
- Hierarki organisasi visual
- Gallery foto dokumentasi

### 4. **Halaman Kontak**
- Form kontak dengan validasi real-time
- Info kontak lengkap
- Social media links
- Map placeholder

## 🎨 Kustomisasi

### Mengubah Warna Tema

Edit di `index.html` bagian Tailwind config:

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                navy: { 
                    800: '#0a192f',  // Ubah warna navy
                    900: '#020c1b' 
                },
                gold: { 
                    400: '#FFD700',  // Ubah warna gold
                    500: '#D4AF37',
                    600: '#AA8C2C' 
                }
            }
        }
    }
}
```

### Menambah Data Kegiatan

Edit `js/pages/kegiatan.js`:

```javascript
const activities = [
    {
        id: 1,
        title: "Nama Kegiatan",
        date: "DD Bulan YYYY",
        image: "url-gambar",
        shortDesc: "Deskripsi singkat",
        fullDesc: "Deskripsi lengkap",
        category: "Kategori" // Seminar/Workshop/Sosial/dll
    },
    // Tambahkan kegiatan baru di sini
];
```

### Menambah Struktur Organisasi

Edit `js/pages/struktur.js`:

```javascript
const strukturData = {
    "2024": {
        ketua: { name: "Nama", img: "url" },
        wakil: { name: "Nama", img: "url" },
        divisi: [
            {
                nama: "Nama Divisi",
                kadiv: { name: "Nama", img: "url" },
                anggota: [
                    { name: "Nama", img: "url" },
                    // ...
                ]
            }
        ]
    }
};
```

## 🔧 Development

### Debug Mode

Saat development (localhost), akses debug tools via console:

```javascript
window.APP_DEBUG.config      // Lihat konfigurasi
window.APP_DEBUG.utils       // Akses utility functions
window.APP_DEBUG.security    // Akses security module
window.APP_DEBUG.navigation  // Akses navigation module
```

### Performance Monitoring

Performance metrics akan otomatis di-log ke console saat page load:
- Page Load Time
- Server Response Time
- DOM Render Time

### Error Logging

Semua error otomatis di-log ke console. Dalam production, integrate dengan error tracking service (Sentry, etc).

## 📦 Dependencies

### External Libraries
- **Tailwind CSS** (3.x) - Utility-first CSS framework
- **Font Awesome** (6.4.0) - Icon library
- **ui-avatars.com** - Avatar generator API

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔐 Security Best Practices

1. **NEVER expose API keys** di client-side code
2. **Always validate** input di client DAN server
3. **Use HTTPS** di production
4. **Enable CSP headers** di server
5. **Implement rate limiting** di server-side juga
6. **Regular security audits** dan updates
7. **Sanitize user input** sebelum render

## 🚀 Deployment

### GitHub Pages
```bash
# Push ke GitHub
git add .
git commit -m "Initial commit"
git push origin main

# Enable GitHub Pages di Settings
# Source: main branch / root
```

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Custom Server
Upload semua file ke web server via FTP/SFTP. Pastikan:
- Enable HTTPS
- Configure CSP headers
- Set proper cache headers
- Enable gzip compression

## 📈 Future Improvements

- [ ] Backend API integration
- [ ] Database untuk kegiatan & struktur
- [ ] User authentication
- [ ] Admin dashboard
- [ ] Newsletter subscription
- [ ] Event calendar
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] PWA features (offline mode)
- [ ] Push notifications

## 👥 Contributors

- **Development Team** - Hima Akuntansi UT Bandung
- **Design** - Tim Kreatif Kabinet Sinergi
- **Content** - Tim Humas & PDD

## 📄 License

Copyright © 2024 HIMA AKUNTANSI UT BANDUNG - Kabinet Sinergi
All rights reserved.

## 📞 Support

Jika ada pertanyaan atau issues:
- Email: himaaksi.utbandung@gmail.com
- Instagram: @himaaksi_utbandung
- WhatsApp: +62 812 3456 7890

---

**Made with ❤️ by HIMA AKUNTANSI UT BANDUNG**