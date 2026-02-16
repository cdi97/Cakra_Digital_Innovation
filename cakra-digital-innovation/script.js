// JavaScript untuk Cakra Digital Innovation Website
// Author: Cakra Digital Innovation Team
// Version: 1.0.0

// Main Application Class
class CakraDigitalWebsite {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.backToTopBtn = document.getElementById('back-to-top');
        this.contactForm = document.getElementById('contact-form');
        
        this.navbarState = {
            isScrolled: false,
            isMobileMenuOpen: false,
            activeSection: 'home'
        };
        
        this.animationState = {
            isAnimating: false,
            elements: []
        };

        this.init();
    }

    // Initialize all functionality
    init() {
        this.setupEventListeners();
        this.setupScrollEffects();
        this.setupFormValidation();
        this.setupAnimations();
        this.setupIntersectionObserver();
        this.initializeCounters();
        this.setupSmoothScrolling();
    }

    // Setup all event listeners
    setupEventListeners() {
        // Mobile menu toggle
        this.mobileMenuBtn?.addEventListener('click', () => this.toggleMobileMenu());
        
        // Back to top button
        this.backToTopBtn?.addEventListener('click', () => this.scrollToTop());
        
        // Contact form submission
        this.contactForm?.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Window scroll events
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Window resize events
        window.addEventListener('resize', () => this.handleResize());
        
        // Navigation link clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavLinkClick(e));
        });

        // Service cards hover effects
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', () => this.handleCardHover(card, true));
            card.addEventListener('mouseleave', () => this.handleCardHover(card, false));
        });

        // Portfolio items click
        document.querySelectorAll('.portfolio-item').forEach(item => {
            item.addEventListener('click', () => this.handlePortfolioClick(item));
        });
    }

    // Mobile menu functionality
    toggleMobileMenu() {
        this.navbarState.isMobileMenuOpen = !this.navbarState.isMobileMenuOpen;
        
        if (this.mobileMenu) {
            this.mobileMenu.classList.toggle('show');
            this.mobileMenuBtn?.classList.toggle('active');
        }
        
        // Animate hamburger menu
        if (this.mobileMenuBtn) {
            const icon = this.mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        }
    }

    // Scroll effects
    setupScrollEffects() {
        this.handleScroll();
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Navbar scroll effect
        if (scrollTop > 50) {
            this.navbar?.classList.add('scrolled');
            this.navbarState.isScrolled = true;
        } else {
            this.navbar?.classList.remove('scrolled');
            this.navbarState.isScrolled = false;
        }
        
        // Back to top button visibility
        if (scrollTop > 300) {
            this.backToTopBtn?.classList.add('show');
        } else {
            this.backToTopBtn?.classList.remove('show');
        }
        
        // Update active section based on scroll position
        this.updateActiveSection();
    }

    // Update active navigation section
    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionElement = section;
            const sectionTop = sectionElement.offsetTop;
            const sectionHeight = sectionElement.offsetHeight;
            const sectionId = sectionElement.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navbarState.activeSection = sectionId || 'home';
                this.updateActiveNavLink();
            }
        });
    }

    // Update active navigation link
    updateActiveNavLink() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${this.navbarState.activeSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Smooth scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href')?.substring(1);
                if (targetId) {
                    this.scrollToSection(targetId);
                }
            });
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (this.navbarState.isMobileMenuOpen) {
                this.toggleMobileMenu();
            }
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Form validation and submission
    setupFormValidation() {
        if (!this.contactForm) return;
        
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const fieldName = field.name;
        const fieldValue = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remove previous error
        this.clearFieldError(field);
        
        // Validation rules
        switch (fieldName) {
            case 'name':
                if (fieldValue.length < 3) {
                    errorMessage = 'Nama minimal 3 karakter';
                    isValid = false;
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(fieldValue)) {
                    errorMessage = 'Format email tidak valid';
                    isValid = false;
                }
                break;
                
            case 'subject':
                if (fieldValue.length < 5) {
                    errorMessage = 'Subject minimal 5 karakter';
                    isValid = false;
                }
                break;
                
            case 'message':
                if (fieldValue.length < 10) {
                    errorMessage = 'Pesan minimal 10 karakter';
                    isValid = false;
                }
                break;
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Create or update error message
        let errorElement = field.parentElement?.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message text-red-500 text-sm mt-1';
            field.parentElement?.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement?.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.contactForm) return;
        
        // Validate all fields
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            this.showFormMessage('error', 'Mohon perbaiki kesalahan pada form');
            return;
        }
        
        // Get form data
        const formData = {
            name: this.contactForm.querySelector('[name="name"]').value,
            email: this.contactForm.querySelector('[name="email"]').value,
            subject: this.contactForm.querySelector('[name="subject"]').value,
            message: this.contactForm.querySelector('[name="message"]').value
        };
        
        // Show loading state
        this.setFormLoading(true);
        
        try {
            // Simulate API call (replace with actual API endpoint)
            await this.submitForm(formData);
            this.showFormMessage('success', 'Pesan berhasil dikirim! Kami akan segera menghubungi Anda.');
            this.contactForm.reset();
        } catch (error) {
            this.showFormMessage('error', 'Terjadi kesalahan. Silakan coba lagi.');
            console.error('Form submission error:', error);
        } finally {
            this.setFormLoading(false);
        }
    }

    async submitForm(formData) {
        // Simulate API delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (90% success rate for demo)
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Simulated network error'));
                }
            }, 2000);
        });
    }

    setFormLoading(isLoading) {
        const submitBtn = this.contactForm?.querySelector('button[type="submit"]');
        if (submitBtn) {
            if (isLoading) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Mengirim...';
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Kirim Pesan';
            }
        }
    }

    showFormMessage(type, message) {
        // Remove existing messages
        const existingMessage = this.contactForm?.parentElement?.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message p-4 rounded-lg mb-4 ${
            type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`;
        messageDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Insert before form
        this.contactForm?.parentElement?.insertBefore(messageDiv, this.contactForm);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Animations
    setupAnimations() {
        this.addScrollAnimations();
        this.addHoverAnimations();
    }

    addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.service-card, .portfolio-item, .stat-number').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        element.classList.add('animate-in');
        
        // Add specific animations based on element type
        if (element.classList.contains('service-card')) {
            element.classList.add('slide-in-left');
        } else if (element.classList.contains('portfolio-item')) {
            element.classList.add('slide-in-right');
        } else if (element.classList.contains('stat-number')) {
            this.animateCounter(element);
        }
    }

    addHoverAnimations() {
        // Button hover effects
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.classList.add('interactive-element');
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.classList.remove('interactive-element');
            });
        });
    }

    // Counter animation for statistics
    initializeCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.textContent?.replace(/\D/g, '') || '0');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current).toString() + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toString() + '+';
            }
        };
        
        updateCounter();
    }

    // Intersection Observer for scroll animations
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);
        
        // Observe sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    // Event handlers
    handleNavLinkClick(e) {
        e.preventDefault();
        const target = e.target;
        const targetId = target.getAttribute('href')?.substring(1);
        
        if (targetId) {
            this.scrollToSection(targetId);
        }
    }

    handleResize() {
        // Close mobile menu on resize if screen becomes larger
        if (window.innerWidth > 768 && this.navbarState.isMobileMenuOpen) {
            this.toggleMobileMenu();
        }
    }

    handleCardHover(card, isHovering) {
        if (isHovering) {
            card.classList.add('hovered');
        } else {
            card.classList.remove('hovered');
        }
    }

    handlePortfolioClick(item) {
        // Add portfolio item click functionality
        console.log('Portfolio item clicked:', item);
        // You can add modal or navigation logic here
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CakraDigitalWebsite();
    
    // Add loading animation removal
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Make available globally
window.CakraDigitalWebsite = CakraDigitalWebsite;
