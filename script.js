// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Active link highlighting based on scroll position (for index page)
if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// For education page, highlight the education link
if (window.location.pathname.includes('education.html')) {
    const educationLink = document.querySelector('.nav-link[href="education.html"]');
    if (educationLink) {
        educationLink.classList.add('active');
    }
}

// Animate skill bars when they come into view
const skillBars = document.querySelectorAll('.skill-progress');
const skillsSection = document.getElementById('skills');

function animateSkillBars() {
    skillBars.forEach(skillBar => {
        const width = skillBar.style.width;
        skillBar.style.width = '0';
        
        setTimeout(() => {
            skillBar.style.width = width;
        }, 100);
    });
}

// Use Intersection Observer to trigger skill bar animation
if (skillsSection && skillBars.length > 0) {
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
            }
        });
    }, observerOptions);

    observer.observe(skillsSection);
}

// Contact form submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const subject = contactForm.querySelectorAll('input[type="text"]')[1].value;
        const message = contactForm.querySelector('textarea').value;
        
        // In a real application, you would send this data to a server
        // For demo purposes, we'll just show an alert
        alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
        
        // Reset form
        contactForm.reset();
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Skip if it's a link to another page
        if (this.getAttribute('href').startsWith('#') && 
            (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/'))) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Initialize skill bars with their widths
window.addEventListener('DOMContentLoaded', () => {
    // Set initial active link for index page
    if (window.location.hash && (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/'))) {
        const activeLink = document.querySelector(`.nav-link[href="${window.location.hash}"]`);
        if (activeLink) {
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            activeLink.classList.add('active');
        }
    }
    
    // Animation for education timeline items on education page
    if (window.location.pathname.includes('education.html')) {
        const educationItems = document.querySelectorAll('.education-item');
        
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const educationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Set initial styles and observe each education item
        educationItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            educationObserver.observe(item);
        });
    }
});