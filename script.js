/* ============================================================================
   Carrusel 1  –  se crea dinámicamente un «track» y se desliza con transform
   Estructura HTML sin tocar:
     .tarjeta.carrusel-container
        ├─ .carrusel-slide   (× n)
        └─ .carrusel-controles  (#anterior  #siguiente  .pagination-text …)
   ==========================================================================*/
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".tarjeta.carrusel-container");
  if (!container) return;

  const slides = Array.from(container.querySelectorAll(".carrusel-slide"));
  const prevBtn = container.querySelector("#anterior");
  const nextBtn = container.querySelector("#siguiente");
  const indicator = container.querySelector(".pagination-text");
  const pauseBtn = container.querySelector("#pausar");

  if (!slides.length || !prevBtn || !nextBtn || !pauseBtn) return;

  let track = container.querySelector(".carrusel-track");
  if (!track) {
    track = document.createElement("div");
    track.className = "carrusel-track";
    slides.forEach(s => track.appendChild(s));
    container.insertBefore(track, container.querySelector(".carrusel-controles"));
  }

  let index = 0;
  const maxIndex = slides.length - 1;

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === maxIndex;
    if (indicator) indicator.textContent = `${index + 1} / ${slides.length}`;
  }

  prevBtn.addEventListener("click", () => {
    if (index > 0) index--;
    update();
  });

  nextBtn.addEventListener("click", () => {
    if (index < maxIndex) index++;
    update();
  });

  update();

  // ----------- AUTO PLAY CON PAUSA -----------

  let autoSlide = true;
  let interval = setInterval(() => {
    if (autoSlide && index < maxIndex) {
      index++;
      update();
    } else if (autoSlide && index === maxIndex) {
      index = 0;
      update();
    }
  }, 3000); // cada 5 segundos

  pauseBtn.addEventListener("click", () => {
    autoSlide = !autoSlide;
    pauseBtn.textContent = autoSlide ? "❚❚" : "▶";
  });
});


/* ============================================================================
   Carrusel 2 – Productos Digitales
   Avanza de a 1 tarjeta, mostrando siempre cardsPerView visibles.
   Clases usadas: 
     · .slider2-container         (envoltura del carrusel)
     · .card-list                 (pista que se desplaza)
     · .card-item                 (cada tarjeta)
     · .slider-prev  .slider-next (flechas ‹ ›)
     · .pagination-slides         (contador “n / N”)
   ==========================================================================*/
(() => {
  const container  = document.querySelector(".slider2-container");
  if (!container) return;

  const track      = container.querySelector(".card-list");
  const prevBtn    = container.querySelector(".slider-prev");
  const nextBtn    = container.querySelector(".slider-next");
  const indicator  = container.querySelector(".pagination-slides");
  const slides     = Array.from(track.children);
  const GAP        = parseFloat(getComputedStyle(track).gap) || 0;

  /* ---------- responsive: cuántas tarjetas caben ---------- */
  function cardsPerView () {
    const vw = window.innerWidth;
    if (vw <= 768)  return 1;        // móviles y tablets pequeñas: solo 1
    if (vw <= 1024) return 2;        // tablets medianas
    return 4;                        // escritorio
  }

  /* ---------- variables de estado ---------- */
  let visible      = cardsPerView();            
  let cardWidth    = slides[0].getBoundingClientRect().width;
  let maxIndex     = slides.length - visible;
  let index        = 0;

  /* ---------- helpers ---------- */
  function updateSizes () {
    visible   = cardsPerView();
    cardWidth = slides[0].getBoundingClientRect().width;
    maxIndex  = Math.max(slides.length - visible, 0);
    goTo(index, false);
  }

  function goTo (i, animate = true) {
    index = Math.max(0, Math.min(i, maxIndex));
    const offset = -((cardWidth + GAP) * index);
    if (!animate) {
      track.style.transition = "none";
      track.style.transform  = `translateX(${offset}px)`;
      requestAnimationFrame(() => track.style.transition = "");
    } else {
      track.style.transform  = `translateX(${offset}px)`;
    }
    updateUI();
  }

  function updateUI () {
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === maxIndex;
    if (indicator) indicator.textContent = `${index + 1} / ${maxIndex + 1}`;
  }

  /* ---------- listeners ---------- */
  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));
  window.addEventListener("resize",  updateSizes);

  /* ---------- init ---------- */
  updateSizes();
})();

/* ============================================================================
    MENU HAMBURGESA PARA MOVILES
   ==========================================================================*/
document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const hamburger = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');
    const dropdowns = document.querySelectorAll('.dropdown');
    let menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);
    
    // Función para abrir/cerrar el menú hamburguesa
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        
        // Prevenir scroll cuando el menú está abierto
        if (mainNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Cerrar el menú al hacer clic en el overlay
    menuOverlay.addEventListener('click', function() {
        hamburger.classList.remove('active');
        mainNav.classList.remove('active');
        this.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Manejo de los menús desplegables en móvil
    dropdowns.forEach(function(dropdown) {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        
        // En móvil, hacer clic en un enlace desplegable lo abre/cierra
        dropdownToggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('open');
                
                // Cerrar otros submenús abiertos
                dropdowns.forEach(function(otherDropdown) {
                    if (otherDropdown !== dropdown && otherDropdown.classList.contains('open')) {
                        otherDropdown.classList.remove('open');
                    }
                });
            }
        });
    });
    
    // Resize handler
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
            hamburger.classList.remove('active');
            mainNav.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Resetear los dropdowns abiertos
            dropdowns.forEach(function(dropdown) {
                dropdown.classList.remove('open');
            });
        }
    });
});

/* CARRUSEL SECCION 6 PARA MOVIL */
(() => {
  const track = document.getElementById("blog-track");
  const slides = Array.from(track.children); // .card-item
  const indicator = document.querySelector(".pagination-slides-blog");

  let index = 0;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  function getCardWidth() {
    return track.clientWidth;
  }

  function updateUI() {
    if (indicator) {
      indicator.textContent = `${index + 1} / ${slides.length}`;
    }
  }

  function goTo(i, animate = true) {
    index = Math.max(0, Math.min(i, slides.length - 1));
    const offset = -index * getCardWidth();

    track.style.transition = animate ? "transform 0.4s ease" : "none";
    track.style.transform = `translateX(${offset}px)`;

    updateUI();
  }

  // Swipe handlers
  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    track.style.transition = "none"; // disable animation while dragging
  });

  track.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;
    const offset = -index * getCardWidth() + deltaX;
    track.style.transform = `translateX(${offset}px)`;
  });

  track.addEventListener("touchend", () => {
    if (!isDragging) return;
    const deltaX = currentX - startX;
    const threshold = getCardWidth() / 4; // mínimo para cambiar slide
    if (deltaX > threshold && index > 0) {
      index--;
    } else if (deltaX < -threshold && index < slides.length - 1) {
      index++;
    }
    isDragging = false;
    goTo(index, true);
  });

  window.addEventListener("resize", () => goTo(index, false));

  // Init
  goTo(0, false);
})();

/* ACORDEON FOOTER */
document.addEventListener("DOMContentLoaded", function () {
    const toggles = document.querySelectorAll(".footer-toggle");

    toggles.forEach((toggle) => {
      toggle.addEventListener("click", function () {
        const list = this.nextElementSibling;
        const isOpen = list.classList.contains("show");

        document.querySelectorAll(".footer-links").forEach((ul) => {
          ul.classList.remove("show");
        });
        document.querySelectorAll(".footer-toggle").forEach((t) => {
          t.classList.remove("active");
        });

        if (!isOpen) {
          list.classList.add("show");
          this.classList.add("active");
        }
      });
    });
  });

  /* FUNCIONALIDAD BOTON NO SCROLL QUE ABRE POP UP */
  document.addEventListener('DOMContentLoaded', function() {
    // Referencias a los elementos
    const joinButtonCollapsed = document.getElementById('joinButtonCollapsed');
    const joinPanel = document.getElementById('joinPanel');
    const closePanel = document.getElementById('closePanel');
    
    // Mostrar el panel expandido y ocultar el botón colapsado
    joinButtonCollapsed.addEventListener('click', function() {
        joinPanel.style.display = 'block';
        joinButtonCollapsed.style.display = 'none';
    });
    
    // Cerrar el panel y mostrar el botón colapsado nuevamente
    closePanel.addEventListener('click', function() {
        joinPanel.style.display = 'none';
        joinButtonCollapsed.style.display = 'flex';
    });
    
    // También puedes agregar funcionalidad al botón de chat si es necesario
    const chatButton = document.querySelector('.chat-button');
    chatButton.addEventListener('click', function() {
        // Acción al hacer clic en el botón de chat
        // Por ejemplo, abrir un panel de chat
        alert('Abriendo chat...');
    });
});



/* menu de servicios fijo */

window.addEventListener('scroll', function () {
    const menu = document.querySelector('.menu-servicios');
    const section = document.querySelector('.seccion2content-menu');

    const sectionTop = section.getBoundingClientRect().top;

    if (sectionTop <= 0) {
      menu.classList.add('sticky');
    } else {
      menu.classList.remove('sticky');
    }
  });