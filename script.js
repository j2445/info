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

    const modalDate = document.querySelector(".modal-content time");
    if (i === 0) {
      modalDate.textContent = "January 15, 2024";
      modalDate.setAttribute("datetime", "2024-01-15");
    } else if (i === 1) {
      modalDate.textContent = "November 20, 2023";
      modalDate.setAttribute("datetime", "2023-11-20");
    } else if (i === 2) {
      modalDate.textContent = "September 5, 2023";
      modalDate.setAttribute("datetime", "2023-09-05");
    }

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

  // Show the submit preloader
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


  // Get form data
  const formData = new FormData(form);

// First send to Google Sheets
fetch(scriptURL, {
  method: "POST",
  body: formData
})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response;
})
.then(() => {
  // After successful submission, send to Telegram
  const name = document.querySelector('input[name="your-name"]').value;
  const phone = document.querySelector('input[name="your-number"]').value;
  const email = document.querySelector('input[name="your-email"]').value;
  const messageInput = document.querySelector('textarea[name="message"]').value;  // Changed to textarea
  const timestamp = new Date().toLocaleString();

  const telegramMessage = `*New Contact Form Submission*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email}\n*Message:* ${messageInput}\n*Timestamp:* ${timestamp}`;
  return sendTelegramMessage(telegramMessage);
})
.then(() => {
    setTimeout(() => {
      submitPreloader.style.opacity = '0';
      setTimeout(() => {
        submitPreloader.style.display = 'none';
        form.reset();

        // Show thank you modal
const backdrop = document.createElement('div');
backdrop.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 999;
  opacity: 0;
  transition: opacity 0.3s ease;
`;
document.body.appendChild(backdrop);

const modal = document.createElement('div');
modal.style.cssText = `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.7);
  background-color: #1e1e1e;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  min-width: 300px;
`;

modal.innerHTML = `
  <div style="color: #28a745; margin-bottom: 20px;">
    <svg width="60" height="60" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  </div>
  <h3 style="color: #fff; font-size: 24px; margin-bottom: 15px;">Thank You!</h3>
  <p style="color: #b3b3b3; font-size: 16px; margin-bottom: 25px; line-height: 1.5;">Your message has been sent successfully. I'll get back to you soon!</p>
  <div style="display: flex; justify-content: center;">
    <button id="closeModal" style="
      background-color: #28a745;
      color: #fff;
      border: none;
      padding: 12px 30px;
      border-radius: 25px;
      font-size: 16px;
      cursor: pointer;
      transition: transform 0.2s ease, background-color 0.2s ease;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    ">Close</button>
  </div>
`;

document.body.appendChild(modal);

// Fade-in effect
requestAnimationFrame(() => {
  backdrop.style.opacity = '1';
  modal.style.opacity = '1';
  modal.style.transform = 'translate(-50%, -50%) scale(1)';
});

// Add hover effect to close button
const closeButton = document.getElementById('closeModal');
closeButton.addEventListener('mouseover', () => {
  closeButton.style.backgroundColor = '#218838';
  closeButton.style.transform = 'scale(1.05)';
});
closeButton.addEventListener('mouseout', () => {
  closeButton.style.backgroundColor = '#28a745';
  closeButton.style.transform = 'scale(1)';
});

closeButton.onclick = () => {
  backdrop.style.opacity = '0';
  modal.style.opacity = '0';
  modal.style.transform = 'translate(-50%, -50%) scale(0.7)';
  setTimeout(() => {
    document.body.removeChild(modal);
    document.body.removeChild(backdrop);
  }, 300);
};

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