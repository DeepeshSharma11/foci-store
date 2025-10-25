// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAllFeatures();
});

// Initialize all features
function initializeAllFeatures() {
    initializePageSpecificFeatures();
    initializeAnimations();
    initializeDownloadSystem();
    initializeScrollEffects();
    initializeCounters();
    initializeContactForm();
    initializeNavigation();
    initializeFAQ();
    initializeSearch();
    initializeFilters();
    initializePageTransitions();
    initializeNavScroll();
    initializeRippleEffects();
    initializeDetailsButtons();
    initializePagination();
    initializeModalSystem();
}

// Page-specific feature initialization
function initializePageSpecificFeatures() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initializeHeroAnimations();
            initializeFeaturedApps();
            break;
        case 'apps.html':
        case 'games.html':
            initializeAppGrid();
            initializeAdvancedFilters();
            break;
        case 'about.html':
            initializeTeamAnimations();
            break;
        case 'contact.html':
            initializeContactAnimations();
            break;
        case 'privacy.html':
        case 'terms.html':
            initializeLegalPage();
            break;
    }
}

// AOS (Animate On Scroll) initialization
function initializeAnimations() {
    // Check if we're on a page that needs scroll animations
    const needsScrollAnimations = document.querySelectorAll('[data-aos]').length > 0;
    if (!needsScrollAnimations) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.classList.add('aos-animate');
                
                // Add delay for staggered animations
                const delay = element.getAttribute('data-aos-delay') || 0;
                element.style.transitionDelay = `${delay}ms`;
                
                // Remove observer after animation
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// Hero section animations for homepage
function initializeHeroAnimations() {
    const heroContent = document.querySelector('.hero-content');
    const heroGraphic = document.querySelector('.hero-graphic');
    
    if (heroContent) {
        heroContent.classList.add('slide-in-left');
    }
    if (heroGraphic) {
        heroGraphic.classList.add('slide-in-right');
    }
}

// Featured apps carousel for homepage
function initializeFeaturedApps() {
    const featuredGrid = document.querySelector('.featured-grid');
    if (!featuredGrid) return;

    // Add hover animations to featured items
    const featuredItems = featuredGrid.querySelectorAll('.featured-item');
    featuredItems.forEach(item => {
        item.classList.add('card-hover', 'stagger-item');
    });

    // Make items visible with delay
    setTimeout(() => {
        featuredItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 100);
        });
    }, 500);
}

// App grid animations for apps/games pages
function initializeAppGrid() {
    const appGrids = document.querySelectorAll('.apps-grid, .games-grid');
    
    appGrids.forEach(grid => {
        const cards = grid.querySelectorAll('.app-card, .game-card');
        cards.forEach((card, index) => {
            card.classList.add('stagger-item');
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Add hover effects
            card.classList.add('card-hover');
            
            // Make visible with delay
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        });
    });
}

// Team animations for about page
function initializeTeamAnimations() {
    const valueItems = document.querySelectorAll('.value-item');
    const statsItems = document.querySelectorAll('.stat-mini');
    
    // Animate value items
    valueItems.forEach((item, index) => {
        item.classList.add('stagger-item');
        setTimeout(() => {
            item.classList.add('visible');
        }, index * 150);
    });
    
    // Animate stats
    statsItems.forEach((item, index) => {
        item.classList.add('stagger-item');
        setTimeout(() => {
            item.classList.add('visible');
        }, index * 100 + 500);
    });
}

// Contact page animations
function initializeContactAnimations() {
    const contactMethods = document.querySelectorAll('.contact-method');
    const formElements = document.querySelectorAll('.form-group');
    
    // Animate contact methods
    contactMethods.forEach((method, index) => {
        method.classList.add('stagger-item');
        setTimeout(() => {
            method.classList.add('visible');
        }, index * 100);
    });
    
    // Animate form elements
    formElements.forEach((element, index) => {
        element.classList.add('stagger-item');
        setTimeout(() => {
            element.classList.add('visible');
        }, index * 80 + 300);
    });
}

// Legal page initialization
function initializeLegalPage() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Download functionality with improved error handling
function initializeDownloadSystem() {
    let downloadInProgress = false;
    let progressInterval;
    
    // Add event listeners to all download buttons
    const downloadButtons = document.querySelectorAll('.download-btn, .btn-download');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get app details
            const appName = this.getAttribute('data-name') || 
                           this.closest('.app-card, .game-card, .featured-item')?.querySelector('h3')?.textContent || 
                           'Application';
            const downloadUrl = this.getAttribute('data-url') || '#';
            
            startDownload(appName, downloadUrl);
        });
    });
    
    function startDownload(appName, downloadUrl) {
        if (downloadInProgress) {
            showNotification('A download is already in progress. Please wait for it to complete.', 'warning');
            return;
        }
        
        // Create modal if it doesn't exist
        let modal = document.getElementById('downloadModal');
        if (!modal) {
            modal = createDownloadModal();
        }
        
        // Update modal content
        const appNameSpan = modal.querySelector('#appName');
        const progressBar = modal.querySelector('.progress');
        const progressText = modal.querySelector('.progress-text');
        
        if (appNameSpan) appNameSpan.textContent = appName;
        
        // Reset progress
        let downloadProgress = 0;
        if (progressBar) progressBar.style.width = '0%';
        if (progressText) progressText.textContent = 'Preparing download...';
        
        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Start progress simulation
        downloadInProgress = true;
        progressInterval = setInterval(() => {
            updateProgress(downloadProgress, progressBar, progressText, downloadUrl, modal);
            downloadProgress += Math.random() * 15;
            if (downloadProgress > 100) downloadProgress = 100;
        }, 200);
        
        // Track download in analytics
        trackDownload(appName);
    }
    
    function updateProgress(progress, progressBar, progressText, downloadUrl, modal) {
        if (progressBar) progressBar.style.width = progress + '%';
        
        if (progress < 30) {
            if (progressText) progressText.textContent = 'Preparing download...';
        } else if (progress < 70) {
            if (progressText) progressText.textContent = `Downloading... ${Math.floor(progress)}%`;
        } else if (progress < 100) {
            if (progressText) progressText.textContent = 'Almost done...';
        } else {
            // Download complete
            clearInterval(progressInterval);
            if (progressText) progressText.textContent = 'Download complete!';
            
            // Hide modal after a delay and redirect
            setTimeout(() => {
                if (modal) modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                downloadInProgress = false;
                
                // Redirect to download URL
                if (downloadUrl && downloadUrl !== '#') {
                    window.open(downloadUrl, '_blank');
                }
                
                showNotification('Download completed successfully!', 'success');
            }, 1000);
        }
    }
    
    function createDownloadModal() {
        const modalHTML = `
            <div class="modal" id="downloadModal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h3>Download <span id="appName">App</span></h3>
                    <div class="download-progress">
                        <div class="progress-bar">
                            <div class="progress progress-animated"></div>
                        </div>
                        <span class="progress-text">Preparing download...</span>
                    </div>
                    <div class="modal-actions">
                        <button class="cancel-btn" id="cancelDownload">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById('downloadModal');
        
        // Add event listeners for modal
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = modal.querySelector('.cancel-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modal));
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => closeModal(modal));
        }
        
        // Close when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
        
        return modal;
    }
    
    function closeModal(modal) {
        if (downloadInProgress) {
            if (confirm('Download in progress. Are you sure you want to cancel?')) {
                clearInterval(progressInterval);
                if (modal) modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                downloadInProgress = false;
            }
        } else {
            if (modal) modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    function trackDownload(appName) {
        // Simulate analytics tracking
        console.log(`Download started: ${appName}`);
    }
}

// Scroll effects with improved performance
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    let ticking = false;
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    if (window.scrollY > 100) {
                        header.classList.add('scrolled');
                        
                        // Add compact class when scrolling down
                        if (window.scrollY > 200) {
                            header.classList.add('compact');
                        } else {
                            header.classList.remove('compact');
                        }
                    } else {
                        header.classList.remove('scrolled', 'compact');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
}

// Counter animations with improved performance
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count') || counter.textContent);
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(function() {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current).toLocaleString();
                }, 16);
                
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// FAQ functionality with improved accessibility
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            // Add ARIA attributes for accessibility
            question.setAttribute('role', 'button');
            question.setAttribute('aria-expanded', 'false');
            
            if (!answer.id) {
                answer.id = `faq-${Math.random().toString(36).substr(2, 9)}`;
            }
            question.setAttribute('aria-controls', answer.id);
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        closeFAQItem(otherItem);
                    }
                });
                
                // Toggle current item
                if (!isActive) {
                    openFAQItem(item);
                } else {
                    closeFAQItem(item);
                }
            });
            
            // Keyboard support
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        }
    });
    
    function openFAQItem(item) {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
    }
    
    function closeFAQItem(item) {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        item.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
    }
}

// Contact form handling with improved validation
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const successMessage = document.getElementById('successMessage');
    const submitBtn = contactForm.querySelector('.submit-btn');

    // Initialize form state
    if (successMessage) {
        successMessage.style.display = 'none';
    }

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
    });
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showNotification('Please fix the errors in the form before submitting.', 'error');
            return;
        }
        
        // Show loading state
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }
        
        try {
            await submitContactForm(contactForm);
            
            // Success handling
            contactForm.style.display = 'none';
            if (successMessage) {
                successMessage.style.display = 'block';
                successMessage.classList.add('show');
            }
            showNotification('Message sent successfully! We will get back to you soon.', 'success');
            
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Sorry, there was an error sending your message. Please try again later.', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        }
    });
    
    async function submitContactForm(form) {
        const formData = new FormData(form);
        
        // For FormSubmit.co integration
        const params = new URLSearchParams();
        params.append('name', formData.get('name') || '');
        params.append('email', formData.get('email') || '');
        params.append('subject', formData.get('subject') || '');
        params.append('message', formData.get('message') || '');
        params.append('_subject', 'New Contact Form Submission - FociStore');
        params.append('_template', 'table');
        params.append('_captcha', 'false');

        const response = await fetch('https://formsubmit.co/ajax/focistore@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: params.toString()
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        if (!data.success) {
            throw new Error('Form submission failed');
        }
        
        return data;
    }
}

// Improved field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    field.classList.remove('error');
    
    // Validation rules
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (value) {
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;
                
            case 'email':
                if (!isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'subject':
                if (value.length < 5) {
                    isValid = false;
                    errorMessage = 'Subject must be at least 5 characters long';
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                }
                break;
        }
    }
    
    // Show error if invalid
    if (!isValid) {
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = errorMessage;
        field.parentNode.appendChild(errorElement);
    }
    
    return isValid || (!field.required && value === '');
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query.length < 2) {
            showNotification('Please enter at least 2 characters to search.', 'warning');
            searchInput.focus();
            return;
        }
        
        // Show loading state
        const originalText = searchButton.textContent;
        searchButton.textContent = 'Searching...';
        searchButton.disabled = true;
        
        // Simulate search
        setTimeout(() => {
            showNotification(`Found results for "${query}"`, 'info');
            searchButton.textContent = originalText;
            searchButton.disabled = false;
        }, 1000);
    }
}

// Filter functionality
function initializeFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    [categoryFilter, sortFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', debounce(applyFilters, 300));
        }
    });
    
    function applyFilters() {
        const category = categoryFilter ? categoryFilter.value : 'all';
        const sort = sortFilter ? sortFilter.value : 'popular';
        
        const items = document.querySelectorAll('.app-card, .game-card');
        let visibleItems = 0;
        
        // Filter by category
        items.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                visibleItems++;
            } else {
                item.style.display = 'none';
            }
        });
        
        showNotification(`Found ${visibleItems} items`, 'success');
    }
}

// Advanced filters for apps/games pages
function initializeAdvancedFilters() {
    const filterControls = document.querySelector('.filter-controls');
    if (!filterControls) return;

    // Add animation to filter controls
    filterControls.classList.add('slide-in-top');
}

// FIXED Navigation initialization
function initializeNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a[href]');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const linkHref = link.getAttribute('href');
        
        // Home page case
        if ((currentPage === '' || currentPage === 'index.html') && linkHref === 'index.html') {
            link.classList.add('active');
        }
        // Other pages - exact match
        else if (linkHref === currentPage) {
            link.classList.add('active');
        }
        // Other pages - partial match
        else if (currentPage.includes(linkHref.replace('.html', '')) && linkHref !== 'index.html') {
            link.classList.add('active');
        }
    });
}

// Page transitions
function initializePageTransitions() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

// Navigation scroll functionality
function initializeNavScroll() {
    const nav = document.querySelector('nav ul');
    if (!nav) return;
    
    // Create scroll buttons
    const navContainer = document.querySelector('nav');
    if (!navContainer) return;
    
    const leftBtn = document.createElement('button');
    leftBtn.className = 'nav-scroll-indicator nav-scroll-left';
    leftBtn.innerHTML = '‹';
    leftBtn.setAttribute('aria-label', 'Scroll left');
    
    const rightBtn = document.createElement('button');
    rightBtn.className = 'nav-scroll-indicator nav-scroll-right';
    rightBtn.innerHTML = '›';
    rightBtn.setAttribute('aria-label', 'Scroll right');
    
    navContainer.style.position = 'relative';
    navContainer.appendChild(leftBtn);
    navContainer.appendChild(rightBtn);
    
    // Scroll functions
    leftBtn.addEventListener('click', () => {
        nav.scrollBy({ left: -200, behavior: 'smooth' });
    });
    
    rightBtn.addEventListener('click', () => {
        nav.scrollBy({ left: 200, behavior: 'smooth' });
    });
    
    // Update button visibility
    function updateScrollButtons() {
        const scrollLeft = nav.scrollLeft;
        const maxScrollLeft = nav.scrollWidth - nav.clientWidth;
        
        leftBtn.classList.toggle('visible', scrollLeft > 0);
        rightBtn.classList.toggle('visible', scrollLeft < maxScrollLeft - 1);
    }
    
    nav.addEventListener('scroll', debounce(updateScrollButtons, 100));
    window.addEventListener('resize', debounce(updateScrollButtons, 100));
    
    // Initial update
    setTimeout(updateScrollButtons, 100);
}

// Ripple effects for buttons
function initializeRippleEffects() {
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.cta-button, .download-btn, .btn-download, .submit-btn, .btn-details, .catalog-link, .page-btn, .cancel-btn');
        if (button) {
            createRippleEffect(e, button);
        }
    });
}

function createRippleEffect(event, button) {
    const ripple = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    ripple.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    ripple.classList.add('ripple-effect');
    
    // Remove existing ripples
    const existingRipples = button.querySelectorAll('.ripple-effect');
    existingRipples.forEach(ripple => ripple.remove());
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Details button functionality
function initializeDetailsButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn-details')) {
            const card = e.target.closest('.app-card, .game-card');
            const appName = card?.querySelector('h3')?.textContent || 'Application';
            showNotification(`Details for ${appName} would be displayed here.`, 'info');
        }
    });
}

// Pagination functionality
function initializePagination() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('.page-btn') && !e.target.classList.contains('active')) {
            const buttons = document.querySelectorAll('.page-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            showNotification('Loading page content...', 'info');
        }
    });
}

// Modal system initialization
function initializeModalSystem() {
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close modals with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });
}

// Utility function: Debounce
function debounce(func, wait) {
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

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close on click
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// Performance optimization: Lazy loading
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'https://via.placeholder.com/300x200/667eea/ffffff?text=Image+Not+Found';
        e.target.alt = 'Image not available';
    }
}, true);

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause animations if needed
        document.body.classList.add('page-hidden');
    } else {
        // Page is visible, resume animations
        document.body.classList.remove('page-hidden');
    }
});

// Add CSS for page visibility state
const style = document.createElement('style');
style.textContent = `
    .page-hidden .pulse,
    .page-hidden .bounce,
    .page-hidden .float,
    .page-hidden .animated-gradient {
        animation-play-state: paused;
    }
`;
document.head.appendChild(style);