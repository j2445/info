/*========== disable copy ==========*/
document.addEventListener('copy', function(event) {
  const selection = window.getSelection();
  const selectedText = selection.toString();
    if (selectedText.includes('http') || selection.anchorNode.parentElement.tagName === 'A') {
    event.preventDefault(); 
  }
});

/*========== disable link dragging ==========*/
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('dragstart', function(event) {
    event.preventDefault();
  });
});

/*========== disable image dragging ==========*/
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('dragstart', function(event) {
    event.preventDefault();
  });
});


/*========== disable right-click ==========*/
document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
});

/*========== page reload logo click ==========*/
document.getElementById('logo').addEventListener('click', function() {
  history.scrollRestoration = 'manual';
  window.location.href = window.location.href.split('#')[0]; 
});

/*========== menu icon navbar ==========*/
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};


/*========== scroll sections active link ==========*/
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });


/*========== sticky navbar ==========*/
let header = document.querySelector('.header');

header.classList.toggle('sticky', window.scrollY > 100);


/*========== remove menu icon navbar when click navbar link (scroll) ==========*/
menuIcon.classList.remove('bx-x');
navbar.classList.remove('active');

};


/*========== swiper ==========*/
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 50,
    loop: true,
    grabCursor: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
});


/*========== dark light mode ==========*/
let darkModeIcon = document.querySelector('#darkMode-icon');

darkModeIcon.onclick = () => {
    darkModeIcon.classList.toggle('bx-sun');
    document.body.classList.toggle('dark-mode');
};


/*========== scroll reveal ==========*/
ScrollReveal({
    // reset: true,
    distance: '80px',
    duration: 2000,
    delay: 200
});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img img, .services-container, .portfolio-box, .testimonial-wrapper, .contact form', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-img img', { origin: 'left' });
ScrollReveal().reveal('.home-content h3, .home-content p, .about-content', { origin: 'right' });



/*========== contact ==========*/
const scriptURL =
"https://script.google.com/macros/s/AKfycbyY3ADxOPDkuewyTiAnyUL-wIY6Heauht20xkmdSFAMxT_lT-KdlDocV7xlDnRT0AZo/exec";
const form = document.forms["contact-form"];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const backdrop = document.createElement('div');
  backdrop.style.position = 'fixed';
  backdrop.style.top = '0';
  backdrop.style.left = '0';
  backdrop.style.width = '100%';
  backdrop.style.height = '100%';
  backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  backdrop.style.zIndex = '999';
  document.body.appendChild(backdrop);

  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.backgroundColor = '#fff';
  modal.style.padding = '30px';
  modal.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
  modal.style.borderRadius = '10px';
  modal.style.zIndex = '1000';
  modal.style.opacity = '0';
  modal.style.transition = 'opacity 0.4s ease-in-out, transform 0.4s ease-in-out';
  modal.style.transform = 'translate(-50%, -60%)';
  modal.innerHTML = `
    <p style="font-size: 20px; color: #333; margin-bottom: 20px;">Thank you! Your message has been sent to Joy Patel.</p>
    <div style="text-align: center;">
      <button id="closeModal" style="padding: 12px 25px; background-color: #28a745; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Close</button>
    </div>
  `;
  document.body.appendChild(modal);

  // Fade-in effect
  setTimeout(() => {
    modal.style.opacity = '1';
    modal.style.transform = 'translate(-50%, -50%)';
  }, 10);

  document.getElementById('closeModal').onclick = () => {
    document.body.removeChild(modal);
    document.body.removeChild(backdrop);
  };

  fetch(form.action, {
    method: "POST",
    body: new FormData(form),
  })
    .then((response) => {
      form.reset();
    })
    .catch((error) => console.error("Error!", error.message));
});

