document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll y Progreso
    const handleScroll = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById("scroll-bar");
        if(progressBar) progressBar.style.width = scrolled + "%";
    };
    window.addEventListener('scroll', handleScroll);

    // 2. Tema Oscuro/Claro
    const btn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';

    const setTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            if(btn) btn.innerText = 'MODO CLARO';
        } else {
            document.body.classList.remove('dark-mode');
            if(btn) btn.innerText = 'MODO OSCURO';
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

    // 3. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === "#") return;
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // 4. Animación al hacer Scroll
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-up');
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.service-card, .section-title, .visual-container, .hero-glass-card');
    elementsToAnimate.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s ease-out";
        observer.observe(el);
    });

    // 5. Menú Móvil
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
                const icon = mobileBtn.querySelector('i');
                if(icon) icon.classList.replace('ri-close-line', 'ri-menu-3-line');
            });
        });
    }

    // 6. CARRUSEL CORREGIDO: EFECTO PEEKING CENTRADO
    const track = document.getElementById('carousel-track');
    if (track) {
        const items = document.querySelectorAll('.carousel-item');
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        const container = track.parentElement; 
        
        let currentIndex = 0;
        let startX, isDragging = false;
        let gap = 30;

        const updateCarousel = () => {
            const containerWidth = container.offsetWidth;
            const itemWidth = items[0].offsetWidth;
            
            const currentItemOffset = currentIndex * (itemWidth + gap);
            const centerFlexOffset = (containerWidth / 2) - (itemWidth / 2);
            
            const finalTranslate = centerFlexOffset - currentItemOffset;
            track.style.transform = `translateX(${finalTranslate}px)`;

            items.forEach((item, index) => {
                if (index === currentIndex) {
                    item.classList.add('is-active');
                } else {
                    item.classList.remove('is-active');
                }
            });
        };

        const resetAutoPlay = () => {
            clearInterval(autoPlay);
            autoPlay = setInterval(() => {
                currentIndex = (currentIndex + 1) >= items.length ? 0 : currentIndex + 1;
                updateCarousel();
            }, 5000);
        };

        let autoPlay = setInterval(() => {
            currentIndex = (currentIndex + 1) >= items.length ? 0 : currentIndex + 1;
            updateCarousel();
        }, 5000);

        updateCarousel();

        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                if (currentIndex > 0) currentIndex--;
                else currentIndex = items.length - 1;
                updateCarousel();
                resetAutoPlay();
            });
        }

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                if (currentIndex < items.length - 1) currentIndex++;
                else currentIndex = 0;
                updateCarousel();
                resetAutoPlay();
            });
        }

        const dragStart = (e) => {
            clearInterval(autoPlay);
            isDragging = true;
            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            track.style.transition = 'none'; 
        };

        const dragMove = (e) => {
            if (!isDragging) return;
            const x = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            const diff = x - startX;
            
            const containerWidth = container.offsetWidth;
            const itemWidth = items[0].offsetWidth;
            const currentItemOffset = currentIndex * (itemWidth + gap);
            const centerFlexOffset = (containerWidth / 2) - (itemWidth / 2);
            
            const baseTranslate = centerFlexOffset - currentItemOffset;
            track.style.transform = `translateX(${baseTranslate + diff}px)`;
        };

        const dragEnd = (e) => {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'; 
            
            let endX = e.type.includes('mouse') || e.type === 'mouseleave' ? (e.pageX || startX) : e.changedTouches[0].clientX;
            const diff = endX - startX;
            
            if (Math.abs(diff) > 100) {
                if (diff > 0 && currentIndex > 0) currentIndex--;
                else if (diff < 0 && currentIndex < items.length - 1) currentIndex++;
            }
            
            updateCarousel();
            resetAutoPlay();
        };

        track.addEventListener('mousedown', dragStart);
        track.addEventListener('touchstart', dragStart, {passive: true});
        track.addEventListener('mousemove', dragMove);
        track.addEventListener('touchmove', dragMove, {passive: true});
        track.addEventListener('mouseup', dragEnd);
        track.addEventListener('touchend', dragEnd);
        track.addEventListener('mouseleave', dragEnd);

        window.addEventListener('resize', updateCarousel);
    }
});