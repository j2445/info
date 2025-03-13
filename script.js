'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}


// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}



// Contact Form


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

  // Show the submit preloader instead of main preloader
  const submitPreloader = document.getElementById('submitPreloader');
  submitPreloader.style.display = 'flex';
  submitPreloader.style.position = 'fixed';
  submitPreloader.style.top = '0';
  submitPreloader.style.left = '0';
  submitPreloader.style.width = '100%';
  submitPreloader.style.height = '100%';
  submitPreloader.style.backgroundColor = '#0a0a0a';
  submitPreloader.style.zIndex = '9999';
  submitPreloader.style.opacity = '1';
  submitPreloader.style.transition = 'opacity 0.5s ease';

  // Extract form values from the input fields
  const name = document.querySelector('input[name="your-name"]').value;
  const phone = document.querySelector('input[name="your-number"]').value;
  const email = document.querySelector('input[name="your-email"]').value;
  const messageInput = document.querySelector('input[name="message"]').value;

  // Generate timestamp
  const timestamp = new Date().toLocaleString();

  // Construct the Telegram message
  const telegramMessage = `*New Contact Form Submission*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email}\n*Message:* ${messageInput}\n*Timestamp:* ${timestamp}`;

  // Send the Telegram message
  sendTelegramMessage(telegramMessage);

  // Submit the form data to Google Sheets
  fetch(form.action, {
    method: "POST",
    body: new FormData(form)
  })
  .then(response => {
    setTimeout(() => {
      submitPreloader.style.opacity = '0';
      setTimeout(() => {
        submitPreloader.style.display = 'none';
        form.reset();

        // Show thank you modal
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
      }, 500);
    }, 2000);
  })
  .catch(error => {
    console.error("Error submitting form data!", error.message);
    submitPreloader.style.display = 'none';
  });
});



// Preloader
document.addEventListener('DOMContentLoaded', function() {
  const preloader = document.getElementById('preloader');
  const progressFill = document.querySelector('.progress-fill');
  const progressText = document.querySelector('.progress-text');
  const loadingText = document.querySelectorAll('.loading-text span');
  let progress = 0;

  loadingText.forEach((span, index) => {
      span.style.setProperty('--i', index + 1);
  });

  const interval = setInterval(() => {
      progress += 1;
      progressFill.style.width = `${progress}%`;
      progressText.textContent = `${progress}%`;
      
      if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
              preloader.style.opacity = '0';
              preloader.style.transition = 'opacity 0.5s ease';
              setTimeout(() => {
                  preloader.style.display = 'none';
                  document.getElementById('home').classList.add('visible');
              }, 500);
          }, 500);
      }
  }, 30);
});