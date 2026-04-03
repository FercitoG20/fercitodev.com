document.addEventListener('DOMContentLoaded', () => {
    
    // 1. BARRA DE PROGRESO (SCROLL)
    const handleScroll = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById("scroll-bar");
        if(progressBar) {
            progressBar.style.width = scrolled + "%";
        }
    };
    window.addEventListener('scroll', handleScroll);

    // 2. MODO OSCURO (PERSISTENTE)
    const btn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';

    const setTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            if(btn) btn.innerText = 'Modo Claro';
        } else {
            document.body.classList.remove('dark-mode');
            if(btn) btn.innerText = 'Modo Oscuro';
        }
    };

    setTheme(savedTheme);

    if(btn) {
        btn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            setTheme(isDark ? 'dark' : 'light');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // 3. PARALLAX 3D SUTIL PARA LA TARJETA (SOLO DESKTOP)
    const card = document.querySelector('.hero-glass-card');
    if (card && window.innerWidth > 1024) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 60;
            const y = (window.innerHeight / 2 - e.pageY) / 60;
            card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        });
    }

    // 4. OBSERVADOR DE ANIMACIONES (REVEAL ON SCROLL)
    const observerOptions = { 
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.service-card, .section-title, .visual-container');
    elementsToAnimate.forEach(el => {
        el.style.opacity = "0";
        observer.observe(el);
    });

    // 5. FUNCIONALIDAD DEL MENÚ MÓVIL
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    if(mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            const icon = mobileBtn.querySelector('i');
            if(navMenu.classList.contains('active')) {
                icon.classList.replace('ri-menu-3-line', 'ri-close-line');
            } else {
                icon.classList.replace('ri-close-line', 'ri-menu-3-line');
            }
        });

        document.querySelectorAll('.nav-link, .btn-theme, .btn-action').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileBtn.querySelector('i').classList.replace('ri-close-line', 'ri-menu-3-line');
            });
        });
    }
});