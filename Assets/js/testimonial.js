const testimonials = [
    {
        name: "Raj Patel",
        image: "Assets/Images/Testimonial/1.jpg",
        text: "Working with Joy was an absolute pleasure! Their attention to detail and innovative solutions transformed our project. Delivered exceptional results ahead of schedule.",
        date: "[ MARCH, 2024 ]"
    },
    {
        name: "Rajesh Patel",
        image: "Assets/Images/Testimonial/2.jpg",
        text: "Joy is a coding genius! They took our complex requirements and turned them into elegant, efficient code. Their technical expertise and problem-solving skills are outstanding.",
        date: "[ FEBRUARY, 2024 ]"
    },
    {
        name: "Priya Shah",
        image: "Assets/Images/Testimonial/3.jpg",
        text: "I've worked with many developers, but Joy stands out for their exceptional communication and dedication. They went above and beyond to ensure our project's success.",
        date: "[ JANUARY, 2024 ]"
    },
    {
        name: "Amit Mehta",
        image: "Assets/Images/Testimonial/4.jpg",
        text: "Joy's expertise in modern development practices and frameworks is impressive. They delivered a robust, scalable solution that exceeded our expectations.",
        date: "[ DECEMBER, 2023 ]"
    },
    {
        name: "Neha Desai",
        image: "Assets/Images/Testimonial/5.jpg",
        text: "Incredible work ethic and technical prowess! Joy not only delivered high-quality code but also provided valuable insights that improved our overall architecture.",
        date: "[ NOVEMBER, 2023 ]"
    },
    {
        name: "Vikram Patel",
        image: "Assets/Images/Testimonial/6.jpg",
        text: "Joy's ability to quickly understand complex requirements and translate them into efficient solutions is remarkable. A true professional who delivers excellence.",
        date: "[ OCTOBER, 2023 ]"
    },
    {
        name: "Meera Sharma",
        image: "Assets/Images/Testimonial/7.jpg",
        text: "Outstanding technical skills combined with great project management. Joy consistently delivered high-quality work while maintaining clear communication throughout.",
        date: "[ SEPTEMBER, 2023 ]"
    },
    {
        name: "Arjun Malhotra",
        image: "Assets/Images/Testimonial/8.jpg",
        text: "Joy brought both technical excellence and innovative thinking to our project. Their solutions were elegant, well-documented, and perfectly aligned with our needs.",
        date: "[ AUGUST, 2023 ]"
    }
];

function createTestimonialCard(testimonial) {
    return `
        <div class="testimonial-card">
            <div class="company-date" style="justify-content: flex-end;">
                <div class="review-date">${testimonial.date}</div>
            </div>
            <p>"${testimonial.text}"</p>
            <div class="reviewer-img-name">
                <img src="${testimonial.image}"><span><h4>${testimonial.name}</h4></span>
            </div>
        </div>
    `;
}

function populateTestimonials() {
    const row1 = document.getElementById('row1');
    const row2 = document.getElementById('row2');

    for (let i = 0; i < testimonials.length; i++) {
        const card = createTestimonialCard(testimonials[i]);
        if (i < 4) {
            row1.innerHTML += card;
        } else {
            row2.innerHTML += card;
        }
    }

    // Duplicate cards for seamless scrolling
    row1.innerHTML += row1.innerHTML;
    row2.innerHTML += row2.innerHTML;
}

// Call the function when the page loads
window.addEventListener('load', populateTestimonials);

// Pause animation on hover
const rows = document.querySelectorAll('.testimonial-row');
rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
        row.style.animationPlayState = 'paused';
    });
    row.addEventListener('mouseleave', () => {
        row.style.animationPlayState = 'running';
    });
});