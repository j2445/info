document.addEventListener("DOMContentLoaded", function () {

    const cursor = document.querySelector('.cursor');
    const h1Elements = document.querySelectorAll('h1');
    const aElements = document.querySelectorAll('a');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    const handleMouseEnter = () => {
        cursor.style.transform = 'scale(2) translate(-25%, -25%)';
    };

    const handleMouseLeave = () => {
        cursor.style.transform = 'scale(1) translate(-50%, -50%)';
    };

    h1Elements.forEach(h1 => {
        h1.addEventListener('mouseenter', handleMouseEnter);
        h1.addEventListener('mouseleave', handleMouseLeave);
    });

    aElements.forEach(a => {
        a.addEventListener('mouseenter', handleMouseEnter);
        a.addEventListener('mouseleave', handleMouseLeave);
    });

    // PLAY AUDIO WHEN BUTTON CLICKED
    const bodyTop = document.getElementById('bodyTop');
    bodyTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const audio = document.getElementById('playAudio');
        audio.play();
    });

    // BODY TOP BUTTON & HEADER STICKY
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        const isSticky = window.scrollY > 200;
        bodyTop.classList.toggle('sticky', isSticky);
        header.classList.toggle('sticky', isSticky);
    });

    // Create a function to update the date and time
    function updateDateTime() {
        const updateDate = new Date();
        let hours = updateDate.getHours();
        let minutes = updateDate.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;

        const show = `${hours} : ${minutes} ${ampm}`;
        document.querySelector('#time').textContent = show;
    }

    setInterval(updateDateTime, 1000);

    // ANIMATE TEXT
    const myText = new SplitType('#developer-txt');

    gsap.to('.char', {
        y: 0,
        stagger: 0.05,
        delay: 0.2,
        duration: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: '#developer-txt',
            start: 'top 95%',
            end: 'bottom 80%',
            scrub: true
        }
    });


    // ANIMATE SIGNATURE GIF ON SCROLL
    const signGif = document.getElementById('signature-gif');

    gsap.to(signGif, {
        y: 280,
        delay: 0.2,
        duration: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: signGif,
            start: 'center 20%',
            end: 'bottom 50%%',
            scrub: true
        }
    });


    const textSelectors = ['#text-work', '#text-about', '#text-service', '#text-testimonial', '#text-faq', '#text-experience', '#text-stack'];
    textSelectors.forEach(selector => animateText(selector, 'bottom bottom', 'center 80%'));


    // WORK SECTION CARDS ANIMATION

    gsap.registerPlugin(ScrollTrigger);

    // Initialize GSAP animations
    function initCardAnimations() {
        gsap.utils.toArray('.portfolio-card').forEach((card, index) => {
            gsap.set(card, { opacity: 0, y: 50 });

            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: index * 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom-=100',
                    end: 'bottom center',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }

    window.addEventListener('load', initCardAnimations);





    // EXPERIENCE SECTION ITEMS ANIMATION
    gsap.registerPlugin(ScrollTrigger);

    function initExperienceAnimations() {
        gsap.utils.toArray('.experience-item').forEach((item, index) => {
            gsap.from(item, {
                opacity: 0,
                y: 30,
                duration: 1,
                delay: index * 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top bottom-=100',
                    end: 'bottom center',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }

    window.addEventListener('load', () => {
        initExperienceAnimations();
    });




    // STACKS SECTION ITEMS ANIMATION
    gsap.registerPlugin(ScrollTrigger);

    function initStacksAnimations() {
        gsap.utils.toArray('.stack-item').forEach((item, index) => {
            gsap.fromTo(item,
                { opacity: 0, x: 30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    delay: index * 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top bottom-=100',
                        end: 'bottom center',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    }

    window.addEventListener('load', initStacksAnimations);



    // FOOTER ANIMATION
    gsap.registerPlugin(ScrollTrigger);

    gsap.to('.brand-text', {
        scrollTrigger: {
            trigger: '.footer-section',
            start: 'center 90%',
            end: 'center 70%',
            scrub: 1
        },
        y: 0,
        duration: 1,
        ease: 'power2.out',
    });


    // Scroll-triggered animation for the green circle
    gsap.to('.green-circle', {
        scrollTrigger: {
            trigger: '.footer-section',
            start: 'center 90%',
            end: 'center 70%',
            scrub: 1
        },
        scale: 2,
        duration: 1,
        ease: 'power2.out'
    });









});


function animateText(selector, start, end, markers = false) {
    const animatedText = new SplitType(selector);

    gsap.to(`${selector} .char`, {
        y: 0,
        stagger: 0.15,
        delay: 0.2,
        duration: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: selector,
            start: start,
            end: end,
            markers: markers,
            scrub: 0.2,
        }
    });
}

// ROLE TEXT ANIMATION FOR HERO SECTION

let words = document.querySelectorAll(".word");
words.forEach((word) => {
    let letters = word.textContent.split("");
    word.textContent = "";
    letters.forEach((letter) => {
        let span = document.createElement("span");
        span.textContent = letter;
        span.className = "letter";
        word.append(span);
    });
});

let currentWordIndex = 0;
let maxWordIndex = words.length - 1;
words[currentWordIndex].style.opacity = "1";

let rotateText = () => {
    let currentWord = words[currentWordIndex];
    let nextWord =
        currentWordIndex === maxWordIndex ? words[0] : words[currentWordIndex + 1];
    // rotate out letters of current word
    Array.from(currentWord.children).forEach((letter, i) => {
        setTimeout(() => {
            letter.className = "letter out";
        }, i * 80);
    });
    // reveal and rotate in letters of next word
    nextWord.style.opacity = "1";
    Array.from(nextWord.children).forEach((letter, i) => {
        letter.className = "letter behind";
        setTimeout(() => {
            letter.className = "letter in";
        }, 340 + i * 80);
    });
    currentWordIndex =
        currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
};

rotateText();
setInterval(rotateText, 3000);