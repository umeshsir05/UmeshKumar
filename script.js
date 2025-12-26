// Educational Portfolio JavaScript

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initActiveNav();
    initSkillAnimations();
    initStatsCounter();
    initContactForm();
    initScrollAnimations();
    initThemeToggle();
});

// 1. Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        // Change icon based on state
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').className = 'fas fa-bars';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                menuToggle.querySelector('i').className = 'fas fa-bars';
            }
        }
    });
}

// 2. Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate offset for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 3. Active Navigation on Scroll
function initActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNav() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initialize on load
}

// 4. Animated Skill Bars
function initSkillAnimations() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // If skill bar is in viewport
            if (rect.top < windowHeight - 100) {
                const width = bar.style.width;
                bar.style.width = '0';
                
                // Animate after a short delay
                setTimeout(() => {
                    bar.style.transition = 'width 1.5s ease-in-out';
                    bar.style.width = width;
                }, 200);
            }
        });
    }
    
    // Animate on scroll
    let skillsAnimated = false;
    
    function checkSkillsInView() {
        const skillsSection = document.getElementById('skills');
        if (!skillsSection || skillsAnimated) return;
        
        const rect = skillsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            animateSkillBars();
            skillsAnimated = true;
        }
    }
    
    window.addEventListener('scroll', checkSkillsInView);
    checkSkillsInView(); // Check on load
}

// 5. Animated Stats Counter
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const targetValue = stat.textContent;
            let currentValue = 0;
            const increment = getIncrementValue(targetValue);
            const duration = 2000; // 2 seconds
            const steps = duration / 50; // Update every 50ms
            const stepValue = parseFloat(targetValue) / steps;
            
            const timer = setInterval(() => {
                currentValue += stepValue;
                if (currentValue >= parseFloat(targetValue)) {
                    stat.textContent = targetValue;
                    clearInterval(timer);
                } else {
                    // Format based on value type
                    if (targetValue.includes('.')) {
                        stat.textContent = currentValue.toFixed(1);
                    } else {
                        stat.textContent = Math.floor(currentValue) + '+';
                    }
                }
            }, 50);
        });
    }
    
    function getIncrementValue(value) {
        if (value.includes('.')) {
            return 0.1; // For GPA
        } else if (parseInt(value) > 100) {
            return 10; // For larger numbers
        } else {
            return 1; // For smaller numbers
        }
    }
    
    // Start animation when stats are in view
    let statsAnimated = false;
    
    function checkStatsInView() {
        const statsSection = document.getElementById('home');
        if (!statsSection || statsAnimated) return;
        
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            animateStats();
            statsAnimated = true;
        }
    }
    
    window.addEventListener('scroll', checkStatsInView);
    checkStatsInView(); // Check on load
}

// 6. Contact Form Submission
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields!', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address!', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call (in real app, replace with actual fetch/axios call)
        setTimeout(() => {
            // Success
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Add to console for debugging
            console.log('Contact Form Submitted:', { name, email, subject, message });
            
        }, 1500);
    });
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// 7. Notification System
function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(78, 205, 196, 0.9)' : 'rgba(255, 107, 107, 0.9)'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        backdrop-filter: blur(10px);
        border-left: 4px solid ${type === 'success' ? '#4ecdc4' : '#ff6b6b'};
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    // Add keyframe animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// 8. Scroll Animations for Elements
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.education-item, .experience-item, .project-card, .stat-card');
    
    function checkElementsInView() {
        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight - 100) {
                element.classList.add('animate-in');
            }
        });
    }
    
    // Add animation styles
    const animationStyles = `
        .education-item, .experience-item, .project-card, .stat-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .education-item.animate-in,
        .experience-item.animate-in,
        .project-card.animate-in,
        .stat-card.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .education-item:nth-child(1).animate-in { transition-delay: 0.1s; }
        .education-item:nth-child(2).animate-in { transition-delay: 0.2s; }
        .education-item:nth-child(3).animate-in { transition-delay: 0.3s; }
        
        .experience-item:nth-child(1).animate-in { transition-delay: 0.1s; }
        .experience-item:nth-child(2).animate-in { transition-delay: 0.2s; }
        .experience-item:nth-child(3).animate-in { transition-delay: 0.3s; }
        
        .project-card:nth-child(1).animate-in { transition-delay: 0.1s; }
        .project-card:nth-child(2).animate-in { transition-delay: 0.2s; }
        .project-card:nth-child(3).animate-in { transition-delay: 0.3s; }
        
        .stat-card:nth-child(1).animate-in { transition-delay: 0.1s; }
        .stat-card:nth-child(2).animate-in { transition-delay: 0.2s; }
        .stat-card:nth-child(3).animate-in { transition-delay: 0.3s; }
        .stat-card:nth-child(4).animate-in { transition-delay: 0.4s; }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
    
    window.addEventListener('scroll', checkElementsInView);
    checkElementsInView(); // Check on load
}

// 9. Theme Toggle (Optional)
function initThemeToggle() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.id = 'themeToggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.title = 'Toggle Light/Dark Mode';
    themeToggle.setAttribute('aria-label', 'Toggle theme');
    
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #00adb5;
        color: #1a1a2e;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 5px 15px rgba(0, 173, 181, 0.3);
        transition: all 0.3s;
    `;
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        this.innerHTML = document.body.classList.contains('light-theme')
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
        
        // Save preference to localStorage
        if (document.body.classList.contains('light-theme')) {
            localStorage.setItem('portfolio-theme', 'light');
        } else {
            localStorage.setItem('portfolio-theme', 'dark');
        }
    });
    
    document.body.appendChild(themeToggle);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Add light theme styles
    const lightThemeStyles = `
        body.light-theme {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            color: #333;
        }
        
        body.light-theme .navbar {
            background: rgba(255, 255, 255, 0.95);
            border-bottom: 2px solid #00adb5;
        }
        
        body.light-theme .nav-menu a {
            color: #333;
        }
        
        body.light-theme .nav-menu a:hover,
        body.light-theme .nav-menu a.active {
            background: #00adb5;
            color: white;
        }
        
        body.light-theme .logo {
            color: #00adb5;
        }
        
        body.light-theme .section {
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        body.light-theme .about-content,
        body.light-theme .education-content,
        body.light-theme .experience-content,
        body.light-theme .skill-category,
        body.light-theme .project-card,
        body.light-theme .contact-form,
        body.light-theme .stat-card,
        body.light-theme .achievement-item,
        body.light-theme .contact-method,
        body.light-theme .detail-item {
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            border-color: rgba(0, 173, 181, 0.2);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        body.light-theme .skill-bar {
            background: rgba(0, 0, 0, 0.1);
        }
        
        body.light-theme .course-tag,
        body.light-theme .tech-tag {
            background: rgba(0, 173, 181, 0.1);
            color: #00adb5;
        }
        
        body.light-theme .footer {
            background: rgba(255, 255, 255, 0.95);
            border-top: 2px solid #00adb5;
        }
        
        body.light-theme .footer-text {
            color: #666;
        }
        
        body.light-theme .footer-links a {
            color: #00adb5;
        }
        
        body.light-theme .footer-copyright {
            color: #888;
        }
        
        body.light-theme .social-link {
            background: white;
            border-color: #00adb5;
        }
        
        body.light-theme .form-group input,
        body.light-theme .form-group textarea {
            background: rgba(255, 255, 255, 0.7);
            border-color: rgba(0, 0, 0, 0.1);
            color: #333;
        }
        
        body.light-theme .btn-outline {
            color: #00adb5;
            border-color: #00adb5;
        }
        
        body.light-theme .btn-outline:hover {
            background: #00adb5;
            color: white;
        }
        
        body.light-theme #themeToggle {
            background: #00adb5;
            color: white;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = lightThemeStyles;
    document.head.appendChild(styleSheet);
}

// 10. Education Icon Animation Control
function initEducationAnimation() {
    const educationIcons = document.querySelectorAll('.edu-icon');
    
    function controlAnimation() {
        const homeSection = document.getElementById('home');
        if (!homeSection) return;
        
        const rect = homeSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        
        educationIcons.forEach(icon => {
            if (isInView) {
                icon.style.animationPlayState = 'running';
            } else {
                icon.style.animationPlayState = 'paused';
            }
        });
    }
    
    window.addEventListener('scroll', controlAnimation);
    controlAnimation(); // Check on load
}

// Initialize education animation
initEducationAnimation();

// 11. Print Resume Functionality (Optional)
function addPrintButton() {
    const printButton = document.createElement('button');
    printButton.id = 'printResume';
    printButton.innerHTML = '<i class="fas fa-print"></i>';
    printButton.title = 'Print Resume';
    printButton.setAttribute('aria-label', 'Print resume');
    
    printButton.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #ffd369;
        color: #1a1a2e;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 5px 15px rgba(255, 211, 105, 0.3);
        transition: all 0.3s;
    `;
    
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    printButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    printButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(printButton);
    
    // Add print styles
    const printStyles = `
        @media print {
            .navbar,
            .hero-buttons,
            .menu-toggle,
            #themeToggle,
            #printResume,
            .view-more,
            .social-links,
            .contact-form,
            .footer {
                display: none !important;
            }
            
            body {
                background: white !important;
                color: black !important;
            }
            
            .container {
                margin-top: 0 !important;
                padding: 20px !important;
            }
            
            .section {
                page-break-inside: avoid;
                padding: 30px 0 !important;
                border: none !important;
            }
            
            .hero-content {
                display: block !important;
                text-align: center !important;
            }
            
            .hero-image {
                display: none !important;
            }
            
            .stat-card {
                break-inside: avoid;
                box-shadow: none !important;
                border: 1px solid #ddd !important;
            }
            
            .skill-progress {
                background: #00adb5 !important;
            }
            
            a {
                color: #00adb5 !important;
                text-decoration: none !important;
            }
            
            .btn {
                display: none !important;
            }
        }
    `;
    
    const printStyleSheet = document.createElement('style');
    printStyleSheet.textContent = printStyles;
    printStyleSheet.media = 'print';
    document.head.appendChild(printStyleSheet);
}

// Add print button if needed
// addPrintButton();

// 12. Initialize everything
console.log('Educational Portfolio loaded successfully!');