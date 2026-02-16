// TypeScript untuk Cakra Digital Innovation Website
// Author: Cakra Digital Innovation Team
// Version: 1.0.0

// Interface definitions
interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface NavbarState {
    isScrolled: boolean;
    isMobileMenuOpen: boolean;
    activeSection: string;
}

interface AnimationState {
    isAnimating: boolean;
    elements: Element[];
}

// Main Application Class
class CakraDigitalWebsite {
    private navbar: HTMLElement | null;
    private mobileMenuBtn: HTMLElement | null;
    private mobileMenu: HTMLElement | null;
    private backToTopBtn: HTMLElement | null;
    private contactForm: HTMLFormElement | null;
    private navbarState: NavbarState;
    private animationState: AnimationState;

    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.backToTopBtn = document.getElementById('back-to-top');
        this.contactForm = document.getElementById('contact-form') as HTMLFormElement;
        
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
    private init(): void {
        this.setupEventListeners();
        this.setupScrollEffects();
        this.setupFormValidation();
        this.setupAnimations();
        this.setupIntersectionObserver();
        this.initializeCounters();
        this.setupSmoothScrolling();
    }

    // Setup all event listeners
    private setupEventListeners(): void {
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
    private toggleMobileMenu(): void {
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
    private setupScrollEffects(): void {
        this.handleScroll();
    }

    private handleScroll(): void {
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
    private updateActiveSection(): void {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionElement = section as HTMLElement;
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
    private updateActiveNavLink(): void {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${this.navbarState.activeSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Smooth scrolling
    private setupSmoothScrolling(): void {
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

    private scrollToSection(sectionId: string): void {
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

    private scrollToTop(): void {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Form validation and submission
    private setupFormValidation(): void {
        if (!this.contactForm) return;
        
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input as HTMLInputElement | HTMLTextAreaElement));
            input.addEventListener('input', () => this.clearFieldError(input as HTMLInputElement | HTMLTextAreaElement));
        });
    }

    private validateField(field: HTMLInputElement | HTMLTextAreaElement): boolean {
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

    private showFieldError(field: HTMLInputElement | HTMLTextAreaElement, message: string): void {
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

    private clearFieldError(field: HTMLInputElement | HTMLTextAreaElement): void {
        field.classList.remove('error');
        const errorElement = field.parentElement?.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    private async handleFormSubmit(e: Event): Promise<void> {
        e.preventDefault();
        
        if (!this.contactForm) return;
        
        // Validate all fields
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input as HTMLInputElement | HTMLTextAreaElement)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            this.showFormMessage('error', 'Mohon perbaiki kesalahan pada form');
            return;
        }
        
        // Get form data
        const formData: ContactFormData = {
            name: (this.contactForm.querySelector('[name="name"]') as HTMLInputElement).value,
            email: (this.contactForm.querySelector('[name="email"]') as HTMLInputElement).value,
            subject: (this.contactForm.querySelector('[name="subject"]') as HTMLInputElement).value,
            message: (this.contactForm.querySelector('[name="message"]') as HTMLTextAreaElement).value
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

    private async submitForm(formData: ContactFormData): Promise<void> {
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

    private setFormLoading(isLoading: boolean): void {
        const submitBtn = this.contactForm?.querySelector('button[type="submit"]');
        if (submitBtn) {
            if (isLoading) {
                submitBtn.setAttribute('disabled', 'true');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Mengirim...';
            } else {
                submitBtn.removeAttribute('disabled');
                submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Kirim Pesan';
            }
        }
    }

    private showFormMessage(type: 'success' | 'error', message: string): void {
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
    private setupAnimations(): void {
        this.addScrollAnimations();
        this.addHoverAnimations();
    }

    private addScrollAnimations(): void {
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

    private animateElement(element: Element): void {
        element.classList.add('animate-in');
        
        // Add specific animations based on element type
        if (element.classList.contains('service-card')) {
            element.classList.add('slide-in-left');
        } else if (element.classList.contains('portfolio-item')) {
            element.classList.add('slide-in-right');
        } else if (element.classList.contains('stat-number')) {
            this.animateCounter(element as HTMLElement);
        }
    }

    private addHoverAnimations(): void {
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
    private initializeCounters(): void {
        const counters = document.querySelectorAll('.stat-number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target as HTMLElement);
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    private animateCounter(element: HTMLElement): void {
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
    private setupIntersectionObserver(): void {
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
    private handleNavLinkClick(e: Event): void {
        e.preventDefault();
        const target = e.target as HTMLAnchorElement;
        const targetId = target.getAttribute('href')?.substring(1);
        
        if (targetId) {
            this.scrollToSection(targetId);
        }
    }

    private handleResize(): void {
        // Close mobile menu on resize if screen becomes larger
        if (window.innerWidth > 768 && this.navbarState.isMobileMenuOpen) {
            this.toggleMobileMenu();
        }
    }

    private handleCardHover(card: Element, isHovering: boolean): void {
        if (isHovering) {
            card.classList.add('hovered');
        } else {
            card.classList.remove('hovered');
        }
    }

    private handlePortfolioClick(item: Element): void {
        // Add portfolio item click functionality
        console.log('Portfolio item clicked:', item);
        // You can add modal or navigation logic here
    }

    // Utility methods
    private debounce(func: Function, wait: number): Function {
        let timeout: number;
        return function executedFunction(...args: any[]) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    private throttle(func: Function, limit: number): Function {
        let inThrottle: boolean;
        const self = this;
        return function executedFunction(this: any, ...args: any[]) {
            if (!inThrottle) {
                func.apply(self, args);
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

// Export for potential module usage
export { CakraDigitalWebsite };

// Make available globally
declare global {
    interface Window {
        CakraDigitalWebsite: typeof CakraDigitalWebsite;
    }
}

// Assign to global window object
if (typeof window !== 'undefined') {
    window.CakraDigitalWebsite = CakraDigitalWebsite;
}
