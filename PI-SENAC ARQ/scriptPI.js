/* CARROSSEL */
const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const dotsContainer = document.querySelector(".carousel-dots");

let index = 0;

/* Criar bolinhas */
slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.addEventListener("click", () => goToSlide(i));  //dot = idemtifica arquivo js...
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".carousel-dots span");

function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    slides[i].classList.add("active");
    dots[i].classList.add("active");
}

function goToSlide(i) {
    index = i;
    showSlide(index);
}

/* Botões */
prevBtn.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
});

nextBtn.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    showSlide(index);
});

/* Automático */
setInterval(() => {
    index = (index + 1) % slides.length;
    showSlide(index);
}, 5000);

/* Iniciar */
showSlide(index);

/* Menu Responsivo */
function clickmenu() {
    if (itens.style.display === "block") {
        itens.style.display = "none";
    } else {
        itens.style.display = "block";
    }
}

function mudouTamanho() {
    if (window.innerWidth >= 768) {
        itens.style.display = "block";
    } else {
        itens.style.display = "none";
    }
}
