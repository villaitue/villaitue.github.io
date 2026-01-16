document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.querySelector('i').classList.remove('fa-times');
            navToggle.querySelector('i').classList.add('fa-bars');
        });
    });

    // Sticky Navbar transparency effect
    const navbar = document.querySelector('.navbar');

    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNavbar);
    updateNavbar(); // Init logic on load

    // Initial call to start the slideshow
    initHeroSlideshow();

    // Booking Form Initialization
    initBookingForm();
});

/* --- Hero Slideshow Logic --- */
function initHeroSlideshow() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const images = [
        'assets/images/portada/cab-volcan.jpg',
        'assets/images/portada/cab-entrada.jpg',
        'assets/images/portada/cab-amanecervilla.jpg',
        'assets/images/portada/cab-recep.jpg'
    ];

    // Preload images
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    let currentIndex = 0;

    // Change image every 3 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        hero.style.backgroundImage = `url('${images[currentIndex]}')`;
    }, 3000);
}

/* --- Booking Form Logic --- */
function initBookingForm() {
    const form = document.getElementById('registroForm');
    if (!form) return;

    const btnSubmit = document.getElementById('btnSubmit');
    const inputs = form.querySelectorAll('input, textarea');

    // Validation Function
    function validateForm() {
        if (form.checkValidity()) {
            btnSubmit.disabled = false;
        } else {
            btnSubmit.disabled = true;
        }
    }

    // Add listener to all inputs
    inputs.forEach(input => {
        input.addEventListener('input', validateForm);
        input.addEventListener('change', validateForm);
    });

    // Initial check
    validateForm();

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const messageDiv = document.getElementById('message');

        // Disable button
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Enviando...';

        // Hide previous messages
        messageDiv.classList.remove('show', 'success', 'error');

        // Collect form data
        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            fechaLlegada: document.getElementById('fechaLlegada').value,
            fechaSalida: document.getElementById('fechaSalida').value,
            adultos: document.getElementById('adultos').value,
            ninos: document.getElementById('ninos').value,
            comentarios: document.getElementById('comentarios').value,
            fechaRegistro: new Date().toISOString()
        };

        try {
            const response = await fetch('https://apps.villaitue.cl/webhook-test/respuesta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                messageDiv.textContent = '¡Registro exitoso! Nos pondremos en contacto contigo pronto.';
                messageDiv.classList.add('success', 'show');
                form.reset();
                validateForm(); // Re-disable button after reset
            } else {
                throw new Error('Error en el servidor');
            }
        } catch (error) {
            console.error('Submission Error:', error);
            messageDiv.textContent = 'Hubo un error al enviar tu registro. Por favor, intenta nuevamente o contáctanos directamente.';
            messageDiv.classList.add('error', 'show');
        } finally {
            // Only re-enable if form is valid (though reset makes it invalid usually)
            // But we change text back
            btnSubmit.textContent = 'Envío de Solicitud';
            validateForm();
        }
    });
}

/* --- Auto-Generated Carousel Logic --- */
const cabinImages = {
    'cabina2': [
        'assets/images/para2/cab4-me.jpg',
        'assets/images/para2/cab4-mesa.jpg',
        'assets/images/para2/cab4-baño.jpeg',
        'assets/images/para2/cab5-cam3.jpg',
        'assets/images/para2/cab5-serv.jpg'
    ],
    'cabina4': [
        'assets/images/para4/cab3-ent1.jpg',
        'assets/images/para4/cab3-cocina.jpeg',
        'assets/images/para4/cab3-com.jpeg',
        'assets/images/para4/cab3-camas.jpeg',
        'assets/images/para4/cab3-entre2.jpeg'
    ],
    'cabina5': [
        'assets/images/para5/cab1-puerta.jpg',
        'assets/images/para5/cab6-living-concina-com.JPG',
        'assets/images/para5/cab6-in.JPG',
        'assets/images/para5/cab1-living.jpeg',
        'assets/images/para5/cab2-balcon.jpeg'
    ]
};

let currentImageIndex = 0;
let currentCabinType = '';

function openCarousel(type) {
    if (!cabinImages[type]) return;

    currentCabinType = type;
    currentImageIndex = 0;

    const modal = document.getElementById('carousel-modal');
    const img = document.getElementById('carousel-image');

    img.src = cabinImages[type][0];
    modal.style.display = "block";

    // Disable scroll
    document.body.style.overflow = "hidden";
}

function closeCarousel() {
    const modal = document.getElementById('carousel-modal');
    modal.style.display = "none";
    // Enable scroll
    document.body.style.overflow = "auto";
}

function changeSlide(direction) {
    if (!currentCabinType || !cabinImages[currentCabinType]) return;

    const images = cabinImages[currentCabinType];
    currentImageIndex += direction;

    if (currentImageIndex >= images.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = images.length - 1;
    }

    const img = document.getElementById('carousel-image');
    // Fade effect could be added here
    img.src = images[currentImageIndex];
}

// Close on outside click
window.onclick = function (event) {
    const modal = document.getElementById('carousel-modal');
    if (event.target == modal) {
        closeCarousel();
    }
}

// Keyboard navigation
document.addEventListener('keydown', function (event) {
    const modal = document.getElementById('carousel-modal');
    if (modal.style.display === "block") {
        if (event.key === "Escape") {
            closeCarousel();
        } else if (event.key === "ArrowLeft") {
            changeSlide(-1);
        } else if (event.key === "ArrowRight") {
            changeSlide(1);
        }
    }
});
