function showPage(page) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`page-${page}`).classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(`nav-${page}`);
    if (btn) btn.classList.add('active');
}

function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

let carouselIndex = 0;
function moveCarousel(dir) {
    const c = document.getElementById('carousel-container');
    const total = c.children.length;
    carouselIndex = (carouselIndex + dir + total) % total;
    c.style.transform = `translateX(-${carouselIndex * 100}%)`;
}

setInterval(() => moveCarousel(1), 7000);

const activities = [
    {
        title: "Seminar Akuntansi",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
        desc: "Seminar nasional akuntansi",
        date: "12 Januari 2025"
    }
];

const container = document.getElementById("activity-container");
if (container) {
    activities.forEach(a => {
        const d = document.createElement("div");
        d.innerHTML = `<img src="${a.image}"><h3>${a.title}</h3>`;
        d.onclick = () => openModal(a);
        container.appendChild(d);
    });
}

function openModal(a) {
    document.getElementById("modal-title").innerText = a.title;
    document.getElementById("modal-image").src = a.image;
    document.getElementById("modal-desc").innerText = a.desc;
    document.getElementById("modal-date").innerText = a.date;
    document.getElementById("activity-modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("activity-modal").classList.add("hidden");
}

function loadStruktur() {
    document.getElementById("struktur-content").innerText = "Struktur periode dipilih";
}

function switchStrukturTab(tab) {
    document.getElementById("tab-bagan").classList.toggle("active", tab === "bagan");
    document.getElementById("tab-galeri").classList.toggle("active", tab === "galeri");
}

function handleContact(e) {
    e.preventDefault();
    alert("Pesan terkirim");
}
