document.addEventListener('DOMContentLoaded', () => {
    let menutoggle = document.querySelector('.toggle');
    let menuitems = document.querySelector('.menu-items');

    // Check if elements exist
    if (!menutoggle || !menuitems) {
        console.error("Menu toggle or menu items not found");
        return;
    }

    function openMenu() {
        menuitems.classList.add('open');
        menuitems.classList.remove('close');
    }

    function closeMenu() {
        menuitems.classList.add('close');
        menuitems.classList.remove('open');
        setTimeout(() => {
            menuitems.classList.add('nav-opacity');
            menuitems.classList.remove('close');
            setTimeout(() => {
                menuitems.classList.remove('nav-opacity');
            }, 500);
        }, 500);
    }

    menutoggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent click from bubbling to document
        menutoggle.classList.toggle('active');
        if (menutoggle.classList.contains('active')) {
            openMenu();
        } else {
            closeMenu();
        }
    });

    const removeClass = () => {
        menutoggle.classList.remove('active');
        menuitems.classList.add('closeTop');
        menuitems.classList.remove('open');
        setTimeout(() => {
            menuitems.classList.remove('closeTop');
        }, 500);
    };

    // SMOOTH SCROLL DOWN PAGE WHEN MENU LINK CLICKED
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((navItem) => {
        const link = navItem;

        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }

            removeClass();
        });
    });

    // Direct access to menu items with class 'menu-item'
    const menuLinks = document.querySelectorAll('a.menu-item');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
            
            // Close the menu
            menutoggle.classList.remove('active');
            closeMenu();
        });
    });

    // Handle social icons clicks to close menu
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            if (menutoggle.classList.contains('active')) {
                menutoggle.classList.remove('active');
                closeMenu();
            }
        });
    });
    
    // Add event listener to close menu when clicking outside
    document.addEventListener('click', (e) => {
        // Check if menu is open and click is outside menu and toggle button
        if (menutoggle.classList.contains('active') && 
            !menuitems.contains(e.target) && 
            !menutoggle.contains(e.target)) {
            menutoggle.classList.remove('active');
            closeMenu();
        }
    });
    
    // Prevent clicks inside menu container from closing the menu
    // unless it's a menu item or social icon
    menuitems.addEventListener('click', (e) => {
        // Only stop propagation if not clicking on a menu item or social icon
        if (!e.target.closest('.menu-item') && !e.target.closest('.social-icon')) {
            e.stopPropagation();
        }
    });
});
