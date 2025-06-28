// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close mobile menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 255, 255, 0.1)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Animate skill bars on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-category').forEach(category => {
    skillObserver.observe(category);
});

// Animate project cards on scroll
const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    projectObserver.observe(card);
});

// Animate service cards on scroll
const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    serviceObserver.observe(card);
});

// Download Resume function
function downloadResume() {
    // Create a link to download the actual PDF file
    const link = document.createElement('a');
    link.href = 'Amith-KJ-FlowCV-Resume-20250620.pdf';
    link.download = 'Amith_KJ_Resume.pdf';
    link.target = '_blank';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success notification
    showNotification('Resume downloaded successfully!', 'success');
}

const contactForm = document.getElementById('contactForm');
const formFields = ['name', 'email', 'message'];

function showInlineError(field, message) {
    let errorElem = document.getElementById(field + '-error');
    if (!errorElem) {
        errorElem = document.createElement('div');
        errorElem.className = 'form-error';
        errorElem.id = field + '-error';
        document.getElementById(field).parentNode.appendChild(errorElem);
    }
    errorElem.textContent = message;
}

function clearInlineErrors() {
    formFields.forEach(field => {
        const errorElem = document.getElementById(field + '-error');
        if (errorElem) errorElem.remove();
    });
}

function validateField(field, value) {
    if (!value.trim()) {
        return 'This field is required.';
    }
    if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
            return 'Please enter a valid email address.';
        }
    }
    return '';
}

// Real-time validation
formFields.forEach(field => {
    const input = document.getElementById(field);
    if (input) {
        input.addEventListener('input', () => {
            const error = validateField(field, input.value);
            if (error) {
                showInlineError(field, error);
            } else {
                const errorElem = document.getElementById(field + '-error');
                if (errorElem) errorElem.remove();
            }
        });
    }
});

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearInlineErrors();
        let hasError = false;
        const formData = new FormData(this);
        formFields.forEach(field => {
            const value = formData.get(field);
            const error = validateField(field, value);
            if (error) {
                showInlineError(field, error);
                hasError = true;
            }
        });
        if (hasError) {
            scrollToForm();
            return;
        }
        // Show loading spinner
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        // Simulate success (no EmailJS)
        setTimeout(() => {
            showToast('Thank you! We have received your message and will reply to you soon.', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            scrollToForm();
        }, 1200);
    });
}

function showToast(message, type = 'info') {
    // Remove existing toast
    const oldToast = document.querySelector('.form-toast');
    if (oldToast) oldToast.remove();
    // Create toast
    const toast = document.createElement('div');
    toast.className = `form-toast form-toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    document.querySelector('.contact-form').appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Toast styles
const toastStyle = document.createElement('style');
toastStyle.textContent = `
.form-toast {
  margin-top: 1.2rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 1.05rem;
  background: rgba(0,255,255,0.12);
  color: #C0C0C0;
  box-shadow: 0 0 12px #00FFFF;
  transition: opacity 0.4s;
  opacity: 1;
  text-align: center;
}
.form-toast-success {
  background: linear-gradient(90deg, #00FFB2 60%, #39FF14 100%);
  color: #000;
  box-shadow: 0 0 18px #39FF14;
}
.form-toast-error {
  background: #2a0000;
  color: #FF4C4C;
  box-shadow: 0 0 12px #FF4C4C;
}
`;
document.head.appendChild(toastStyle);

function scrollToForm() {
    const formSection = document.getElementById('contact');
    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(57, 255, 20, 0.9)' : type === 'error' ? 'rgba(255, 0, 0, 0.9)' : 'rgba(0, 255, 255, 0.9)'};
        color: #000000;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Typing animation for hero section
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        typeWriter(heroSubtitle, originalText, 50);
    }
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add glowing effect to buttons on hover
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.8)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
});

// Add click effect to project links
document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(0, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Intersection Observer for fade-in animations
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe elements for fade-in
document.querySelectorAll('.about-content, .skills-grid, .projects-grid, .services-grid, .contact-content').forEach(el => {
    fadeObserver.observe(el);
});

// Add fade-in CSS
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
    .fade-in {
        animation: fadeIn 0.8s ease forwards;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(fadeStyle);

// Preloader (optional)
window.addEventListener('load', () => {
    // Remove preloader if exists
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }
});

// Console welcome message
console.log(`
%cWelcome to Amith K J's Portfolio! 👋
%c
%cBuilt with ❤️ using HTML, CSS, and JavaScript
%cCheck out my GitHub: https://github.com/Amith-KJ-01
`, 
'color: #00FFFF; font-size: 20px; font-weight: bold;',
'',
'color: #C0C0C0; font-size: 14px;',
'color: #39FF14; font-size: 14px;'
); 