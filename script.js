/* =========================================
   1. ELEMEN UTAMA
========================================= */

const pages = [...document.querySelectorAll(".page")];

const music = document.getElementById("bgMusic");
const soundToggle = document.getElementById("soundToggle");
const toast = document.getElementById("toast");

const openEnvelope = document.getElementById("openEnvelope");
const moreButton = document.getElementById("moreButton");


/* =========================================
   2. ELEMEN CUPID
========================================= */

const shootingScene = document.getElementById("shootingScene");
const darkOverlay = document.getElementById("darkOverlay");

const cupid = document.getElementById("cupid");
const cupidImage = document.getElementById("cupidImage");
const bow = document.getElementById("bow");

const bowArrow = document.getElementById("bowArrow");
const flyingArrow = document.getElementById("flyingArrow");
const arrowTrail = document.getElementById("arrowTrail");

const targetHeart = document.getElementById("targetHeart");
const heartExplosion = document.getElementById("heartExplosion");
const heartParticles = document.getElementById("heartParticles");

const finalMessage = document.getElementById("finalMessage");


/* =========================================
   3. VARIABEL ANIMASI
========================================= */

let kejutanDimulai = false;
let animationToken = 0;


/* =========================================
   4. PINDAH HALAMAN
========================================= */

/* =========================================
   CINEMATIC PAGE TRANSITION
========================================= */

let pageTransitioning = false;

let transitionOverlay = document.createElement("div");
transitionOverlay.id = "cinematicOverlay";
transitionOverlay.setAttribute("aria-hidden", "true");
document.body.appendChild(transitionOverlay);

function showPage(id) {

    if (pageTransitioning) return;

    // Cupid tetap memakai animasi aslinya.
    if (id !== "page-cupid") {
        resetCupid();
    }

    // Transisi Cupid tidak ditumpuk dengan transisi ini.
    if (id === "page-cupid") {
        pages.forEach(page => {
            page.classList.remove(
                "enter-soft",
                "enter-gallery",
                "enter-letter",
                "enter-music"
            );
            page.classList.toggle("active", page.id === id);
        });

        resetCupid();
        mulaiTransisiCupid();
        return;
    }

    pageTransitioning = true;

    const transitionByPage = {
        "page-envelope": "enter-soft",
        "page-intro": "enter-soft",
        "page-choose": "enter-soft",
        "page-gallery": "enter-gallery",
        "page-letter": "enter-letter",
        "page-music": "enter-music"
    };

    // Mulai layar menghitam.
    transitionOverlay.classList.remove("reveal");
    transitionOverlay.classList.add("blackout");

    // Ganti halaman saat layar sudah gelap.
    setTimeout(() => {

        pages.forEach(page => {
            page.classList.remove(
                "enter-soft",
                "enter-gallery",
                "enter-letter",
                "enter-music"
            );

            page.classList.toggle("active", page.id === id);
        });

        const currentPage = document.getElementById(id);

        if (currentPage && transitionByPage[id]) {
            currentPage.classList.add(transitionByPage[id]);
        }

        // Mulai membuka layar.
        transitionOverlay.classList.remove("blackout");
        transitionOverlay.classList.add("reveal");

    }, 550);

    // Selesaikan transisi.
    setTimeout(() => {
        transitionOverlay.classList.remove("reveal");
        pageTransitioning = false;
    }, 1900);
}

/* =========================================
   5. NAVIGASI TOMBOL
========================================= */

document.querySelectorAll("[data-next]").forEach(button => {

    button.addEventListener("click", () => {
        showPage(button.dataset.next);
    });

});

document.querySelectorAll("[data-back]").forEach(button => {

    button.addEventListener("click", () => {
        showPage(button.dataset.back);
    });

});


/* =========================================
   6. BUKA AMPLOP
========================================= */

let amplopSedangDibuka = false;

openEnvelope.addEventListener("click", async () => {

    if (amplopSedangDibuka) return;

    amplopSedangDibuka = true;

    // Animasi amplop
    openEnvelope.classList.add("opening");

    // Memanggil fungsi musik
    playMusic();

    // Tunggu animasi selesai
    await tunggu(1100);

    // Pindah ke halaman intro
    showPage("page-intro");

    // Reset
    openEnvelope.classList.remove("opening");
    amplopSedangDibuka = false;

});


/* =========================================
   7. MUSIC CONTROL
========================================= */

// Fungsi memutar musik
async function playMusic() {

    try {

        await music.play();

        soundToggle.textContent = "♫";
        soundToggle.classList.add("playing");

    } catch (error) {

        showToast("Tekan ikon musik untuk memutar lagu ♫");

    }

}

// Tombol kontrol musik
soundToggle.addEventListener("click", async () => {

    if (music.paused) {

        await playMusic();

    } else {

        music.pause();

        soundToggle.textContent = "♪";
        soundToggle.classList.remove("playing");

    }

});


/* =========================================
   8. TOMBOL INFO
========================================= */

moreButton.addEventListener("click", () => {
    showToast("Dibuat dengan sepenuh hati ♡");
});


/* =========================================
   9. TOAST
========================================= */

function showToast(message) {

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);

}


/* =========================================
   10. FUNGSI TUNGGU
========================================= */

function tunggu(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function tungguGambar(img) {

    return new Promise(resolve => {

        if (!img) {
            resolve(false);
            return;
        }

        if (img.complete) {
            resolve(img.naturalWidth > 0);
            return;
        }

        img.addEventListener("load", () => resolve(true), {
            once: true
        });

        img.addEventListener("error", () => resolve(false), {
            once: true
        });

    });

}


/* =========================================
   11. POSISI PANAH
========================================= */

function aturPosisiPanah() {

    const sceneRect = shootingScene.getBoundingClientRect();
    const bowRect = bow.getBoundingClientRect();
    const targetRect = targetHeart.getBoundingClientRect();

    const startX =
        bowRect.left + bowRect.width * 0.8 - sceneRect.left;

    const startY =
        bowRect.top + bowRect.height * 0.5 - sceneRect.top;

    const targetX =
        targetRect.left + targetRect.width / 2 - sceneRect.left;

    const targetY =
        targetRect.top + targetRect.height / 2 - sceneRect.top;

    const dx = targetX - startX;
    const dy = targetY - startY;

    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    bowArrow.style.left = `${startX}px`;
    bowArrow.style.top = `${startY}px`;

    flyingArrow.style.setProperty("--start-x", `${startX}px`);
    flyingArrow.style.setProperty("--start-y", `${startY}px`);
    flyingArrow.style.setProperty("--target-x", `${targetX}px`);
    flyingArrow.style.setProperty("--target-y", `${targetY}px`);
    flyingArrow.style.setProperty("--angle", `${angle}deg`);

    arrowTrail.style.left = `${startX}px`;
    arrowTrail.style.top = `${startY}px`;
    arrowTrail.style.width = `${Math.hypot(dx, dy)}px`;
    arrowTrail.style.transform = `rotate(${angle}deg)`;

    return { targetX, targetY, angle };
}


/* =========================================
   12. PARTIKEL HATI
========================================= */

function buatPartikelHati() {

    heartParticles.innerHTML = "";

    const simbol = ["💗", "💖", "💕", "✨", "♡"];

    const sceneRect = shootingScene.getBoundingClientRect();
    const rect = targetHeart.getBoundingClientRect();

    const centerX =
        rect.left + rect.width / 2 - sceneRect.left;

    const centerY =
        rect.top + rect.height / 2 - sceneRect.top;

    for (let i = 0; i < 18; i++) {

        const particle = document.createElement("span");

        particle.className = "particle";

        particle.textContent =
            simbol[Math.floor(Math.random() * simbol.length)];

        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;

        const sudut = 2 * Math.PI * i / 18;
        const jarak = 70 + Math.random() * 100;

        particle.style.setProperty(
            "--x",
            `${Math.cos(sudut) * jarak}px`
        );

        particle.style.setProperty(
            "--y",
            `${Math.sin(sudut) * jarak}px`
        );

        heartParticles.appendChild(particle);

        setTimeout(() => particle.remove(), 1400);
    }
}


/* =========================================
   13. RESET CUPID
========================================= */

function resetCupid() {

    animationToken++;
    kejutanDimulai = false;

    cupid.classList.remove("shoot");
    bowArrow.classList.remove("ready");
    flyingArrow.classList.remove("shoot");
    arrowTrail.classList.remove("active");

    targetHeart.classList.remove("show", "hit");
    heartExplosion.classList.remove("explode");
    finalMessage.classList.remove("show");

    flyingArrow.removeAttribute("style");
    bowArrow.removeAttribute("style");
    arrowTrail.removeAttribute("style");

    heartParticles.innerHTML = "";

    darkOverlay.classList.remove("active");
    shootingScene.classList.remove("active");
}


/* =========================================
   14. ANIMASI CUPID
========================================= */

async function mulaiTransisiCupid() {

    if (kejutanDimulai) return;

    kejutanDimulai = true;

    const token = ++animationToken;

    // Layar gelap.
    darkOverlay.classList.add("active");

    await tunggu(850);
    if (token !== animationToken) return;

    // Tampilkan adegan.
    shootingScene.classList.add("active");

    await tungguGambar(cupidImage);

    await tunggu(350);
    if (token !== animationToken) return;

    // Buka layar.
    darkOverlay.classList.remove("active");

    await tunggu(300);
    if (token !== animationToken) return;

    // Tampilkan hati.
    targetHeart.classList.add("show");

    await tunggu(650);
    if (token !== animationToken) return;

    // Cupid membidik.
    cupid.classList.add("shoot");
    bowArrow.classList.add("ready");

    await tunggu(1000);
    if (token !== animationToken) return;

    // Hitung posisi panah.
    const posisi = aturPosisiPanah();

    flyingArrow.classList.remove("shoot");
    arrowTrail.classList.remove("active");

    void flyingArrow.offsetWidth;

    // Panah terbang.
    flyingArrow.classList.add("shoot");
    arrowTrail.classList.add("active");

    await tunggu(1800);
    if (token !== animationToken) return;

    // Panah mengenai hati.
    flyingArrow.classList.remove("shoot");

    flyingArrow.style.left = `${posisi.targetX}px`;
    flyingArrow.style.top = `${posisi.targetY}px`;
    flyingArrow.style.opacity = "1";

    flyingArrow.style.transform =
        `translate(-50%, -50%) rotate(${posisi.angle}deg) scale(.85)`;

    targetHeart.classList.remove("show");
    targetHeart.classList.add("hit");

    // Ledakan hati.
    heartExplosion.classList.add("explode");
    buatPartikelHati();

    await tunggu(900);
    if (token !== animationToken) return;

    // Pesan akhir.
    finalMessage.classList.add("show");
}


/* =========================================
   15. PARTIKEL ROMANTIS
========================================= */

function buatPartikelRomantis() {

    const stage = document.querySelector(".stage");

    if (!stage) return;

    // Hindari membuat partikel berulang kali
    if (stage.querySelector(".romantic-particle")) return;

    const simbol = ["♡", "♥", "✦", "✧", "🧚"];

    for (let i = 0; i < 13; i++) {

        const particle = document.createElement("span");

        particle.className = "romantic-particle";

        particle.textContent =
            simbol[Math.floor(Math.random() * simbol.length)];

        particle.style.setProperty(
            "--left", `${Math.random() * 100}%`
        );

        particle.style.setProperty(
            "--size", `${12 + Math.random() * 12}px`
        );

        particle.style.setProperty(
            "--duration", `${8 + Math.random() * 8}s`
        );

        particle.style.setProperty(
            "--delay", `${Math.random() * -15}s`
        );

        stage.appendChild(particle);
    }
}

buatPartikelRomantis();


/* =========================================
   16. FOTO GALERI BISA DIPERBESAR
========================================= */

const galleryPhotos = document.querySelectorAll(
    "#page-gallery .gallery .polaroid"
);

const lightbox = document.createElement("div");

lightbox.className = "photo-lightbox";

lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Tutup foto">
        &times;
    </button>
    <div class="lightbox-photo">
        <div class="photo"></div>
    </div>
`;

document.body.appendChild(lightbox);

const lightboxPhoto = lightbox.querySelector(".photo");
const closeLightbox = lightbox.querySelector(".lightbox-close");

galleryPhotos.forEach(card => {

    card.style.cursor = "pointer";

    card.addEventListener("click", () => {

        const photo = card.querySelector(".photo");

        if (!photo) return;

        // Ambil gambar dari foto asli
        lightboxPhoto.style.backgroundImage =
            getComputedStyle(photo).backgroundImage;

        lightboxPhoto.style.backgroundSize = "cover";

        lightboxPhoto.style.backgroundPosition =
            getComputedStyle(photo).backgroundPosition;

        lightbox.classList.add("show");
    });
});

function tutupLightbox() {
    lightbox.classList.remove("show");
}

closeLightbox.addEventListener("click", tutupLightbox);

lightbox.addEventListener("click", event => {

    if (event.target === lightbox) {
        tutupLightbox();
    }

});

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        tutupLightbox();
    }

});


/* =====================================
   17. ROMANTIC BIRTHDAY CAKE INTERACTION
===================================== */

const cakeScene = document.getElementById("cakeScene");
const cakeInstruction = document.getElementById("cakeInstruction");
const birthdayCake = document.getElementById("birthdayCake");

let cakeClicked = false;

if (birthdayCake) {

    birthdayCake.addEventListener("click", () => {

        if (cakeClicked) return;

        cakeClicked = true;

        cakeScene.classList.add("blown");
        birthdayCake.classList.add("blown");

        cakeInstruction.style.opacity = "0";

        setTimeout(() => {

            cakeInstruction.textContent =
                "Berdoa lalu klik LET'S GO";

            cakeInstruction.style.opacity = "1";

        }, 600);

    });

}