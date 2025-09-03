const services = [
    {
        id: 'web-development',
        title: 'Web Development',
        description: 'Crafting Dynamic, Scalable, and Future-Ready Websites That Stand Out.',
        startingCost: 200,
        features: [
            'Custom Web Design',
            'Responsive Design',
            'SEO-Friendly Structure',
            'Performance Optimization',
            'Content Management',
            'Ongoing Support',
        ],
        imageUrl: 'Assets/Images/Works/01-DEVPULSE.webp',
    },
    {
        id: 'web-design',
        title: 'Web Design',
        description: 'Where Creativity Meets Functionality to Craft Visually Stunning Websites.',
        startingCost: 150,
        features: [
            'Bespoke Visual Design',
            'User-Centered Design',
            'Mobile-First Design',
            'Design Prototyping',
            'High-Fidelity Mockups',
            'Cross-Browser Compatibility',
            'Branding Integration',
        ],
        imageUrl: 'Assets/Images/Works/02-EDISON.webp',
    },
    {
        id: 'graphics-design',
        title: 'Graphics Design',
        description: 'Transforming Ideas into Visual Masterpieces That Speak to Your Audience.',
        startingCost: 100,
        features: [
            'Custom Logos & Branding',
            'Marketing Materials',
            'Social Media Graphics',
            'Web & App UI Elements',
            'Illustrations & Icons',
            'Print Design',
        ],
        imageUrl: 'Assets/Images/Works/1.jpg',
    },
];

function createAccordionItem(service, index) {
    return `
        <div class="accordion-item">
            <h2 class="accordion-header" id="heading${index}">
                <button class="accordion-button ${index !== 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="${index === 0 ? 'true' : 'false'}" aria-controls="collapse${index}">
                    ${service.title}
                </button>
            </h2>
            <div id="collapse${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" aria-labelledby="heading${index}" data-bs-parent="#services-accordion">
                <div class="accordion-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p>${service.description}</p>
                            <p>Starts At <u>Cost® — $${service.startingCost}</u></p>
                            <p class="fw-bold">[ KEY FEATURES ]</p>
                            <ul class="list-unstyled">
                                ${service.features.map(feature => `<li><i class="fas fa-check me-2"></i>${feature}</li>`).join('')}
                            </ul>
                            <a href="#contact" class="theme-btn">Get Started</a>
                        </div>
                        <div class="col-md-6 mt-3 mt-md-0">
                            <img src="${service.imageUrl}" alt="${service.title}" class="service-image">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initAccordion() {
    const accordionContainer = document.getElementById('services-accordion');
    accordionContainer.className = 'accordion';

    services.forEach((service, index) => {
        const accordionItem = createAccordionItem(service, index);
        accordionContainer.innerHTML += accordionItem;
    });
}

document.addEventListener('DOMContentLoaded', initAccordion);



