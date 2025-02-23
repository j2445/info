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



// Your Google Apps Script URL for Google Sheets submission
const scriptURL = "https://script.google.com/macros/s/AKfycbyY3ADxOPDkuewyTiAnyUL-wIY6Heauht20xkmdSFAMxT_lT-KdlDocV7xlDnRT0AZo/exec";
const form = document.forms["contact-form"];

// Your Telegram Bot credentials (provided)
const telegramBotToken = "7767198078:AAFZ6LUrFyHXAcrwe1h21n5-FwXhuQpGUUg";
const telegramChatId = "1024398170";

// Function to send a message via the Telegram Bot API
function sendTelegramMessage(message) {
  return fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: telegramChatId,
      text: message,
      parse_mode: "Markdown"
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Telegram response:", data);
    return data;
  })
  .catch(error => console.error("Error sending Telegram message:", error));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Show the preloader
  document.getElementById('preloader').style.display = 'flex';

  // Extract form values from the input fields
  const name = document.querySelector('input[name="your-name"]').value;
  const phone = document.querySelector('input[name="your-number"]').value;
  const email = document.querySelector('input[name="your-email"]').value;
  const messageInput = document.querySelector('input[name="message"]').value;

  // Generate timestamp (using the browser's locale format)
  const timestamp = new Date().toLocaleString();

  // Construct the Telegram message content with Markdown formatting
  const telegramMessage = `*New Contact Form Submission*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email}\n*Message:* ${messageInput}\n*Timestamp:* ${timestamp}`;

  // Send the Telegram message
  sendTelegramMessage(telegramMessage);

  // Submit the form data to Google Sheets
  fetch(form.action, {
    method: "POST",
    body: new FormData(form)
  })
  .then(response => {
    // Hide preloader after submission completes
    document.getElementById('preloader').style.display = 'none';
    form.reset();

    // Create a modal for user confirmation
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
      <p style="font-size: 20px; color: #333; margin-bottom: 20px;">Thank you! Your message has been sent.</p>
      <div style="text-align: center;">
        <button id="closeModal" style="padding: 12px 25px; background-color: #28a745; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Close</button>
      </div>
    `;
    document.body.appendChild(modal);

    // Fade-in effect for the modal
    setTimeout(() => {
      modal.style.opacity = '1';
      modal.style.transform = 'translate(-50%, -50%)';
    }, 10);

    document.getElementById('closeModal').onclick = () => {
      document.body.removeChild(modal);
      document.body.removeChild(backdrop);
    };
  })
  .catch(error => {
    console.error("Error submitting form data!", error.message);
    // Hide preloader in case of error
    document.getElementById('preloader').style.display = 'none';
  });
});
