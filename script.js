// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAllFeatures();
});

// Initialize all features
function initializeAllFeatures() {
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
}

// AOS (Animate On Scroll) initialization
function initializeAnimations() {
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
                            <div class="progress"></div>
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
        
        // You can integrate with Google Analytics or other services here
        // Example: gtag('event', 'download', { 'app_name': appName });
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
    let hasAnimated = false;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters(counters);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
    
    function animateCounters(counters) {
        counters.forEach(counter => {
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
        });
    }
}

// FAQ functionality with improved accessibility
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        if (question && answer && toggle) {
            // Add ARIA attributes for accessibility
            question.setAttribute('role', 'button');
            question.setAttribute('aria-expanded', 'false');
            question.setAttribute('aria-controls', answer.id || `faq-${Math.random().toString(36).substr(2, 9)}`);
            
            if (!answer.id) {
                answer.id = `faq-${Math.random().toString(36).substr(2, 9)}`;
            }
            
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
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');

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
        setLoadingState(true, submitBtn, btnText, btnLoading);
        
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
            setLoadingState(false, submitBtn, btnText, btnLoading);
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
    
    function setLoadingState(loading, submitBtn, btnText, btnLoading) {
        if (!submitBtn) return;
        
        if (loading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'flex';
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            if (btnText) btnText.style.display = 'block';
            if (btnLoading) btnLoading.style.display = 'none';
        }
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
        
        // Add shake animation
        field.style.animation = 'none';
        setTimeout(() => {
            field.style.animation = 'shake 0.5s ease-in-out';
        }, 10);
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
        
        // Real-time search suggestions (optional)
        searchInput.addEventListener('input', debounce(function() {
            // Implement search suggestions here if needed
        }, 300));
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
        
        // Simulate search (replace with actual search logic)
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
        
        // Sort items
        if (sort !== 'popular') {
            sortItems(items, sort, category);
        }
        
        showNotification(`Found ${visibleItems} items`, 'success');
    }
    
    function sortItems(items, sortBy, category) {
        const container = document.querySelector('.apps-grid, .games-grid');
        if (!container) return;
        
        const visibleItems = Array.from(items).filter(item => 
            category === 'all' || item.getAttribute('data-category') === category
        );
        
        visibleItems.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    const nameA = a.querySelector('h3')?.textContent.toLowerCase() || '';
                    const nameB = b.querySelector('h3')?.textContent.toLowerCase() || '';
                    return nameA.localeCompare(nameB);
                    
                case 'newest':
                    // Implement date-based sorting
                    return 0;
                    
                default:
                    return 0;
            }
        });
        
        // Reappend sorted items
        visibleItems.forEach(item => {
            container.appendChild(item);
        });
    }
}

// Navigation initialization
function initializeNavigation() {
    // Add active class to current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a[href]');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage.includes(linkHref.replace('.html', '')) && linkHref !== 'index.html')) {
            link.classList.add('active');
        }
        
        // Smooth scrolling for anchor links
        if (link.getAttribute('href')?.startsWith('#')) {
            link.addEventListener('click', smoothScrollToAnchor);
        }
    });
}

// Smooth scroll to anchor
function smoothScrollToAnchor(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Page transitions
function initializePageTransitions() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Handle internal link clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && link.href.startsWith(window.location.origin) && 
            !link.href.includes('#') && link.target !== '_blank') {
            e.preventDefault();
            
            document.body.style.opacity = '0';
            
            setTimeout(() => {
                window.location.href = link.href;
            }, 300);
        }
    });
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
        const button = e.target.closest('.cta-button, .download-btn, .btn-download, .submit-btn, .btn-details');
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
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        zIndex: '3000',
        maxWidth: '400px',
        animation: 'slideInRight 0.3s ease'
    });
    
    // Set background based on type
    const colors = {
        success: 'linear-gradient(135deg, #34a853, #2e7d32)',
        error: 'linear-gradient(135deg, #ea4335, #c62828)',
        warning: 'linear-gradient(135deg, #fbbc04, #f57c00)',
        info: 'linear-gradient(135deg, #4285f4, #1565c0)'
    };
    
    notification.style.background = colors[type] || colors.info;
    
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

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close modal with Escape
    if (e.key === 'Escape') {
        const modal = document.getElementById('downloadModal');
        if (modal && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        // Close notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => notification.remove());
    }
});

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

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAllFeatures,
        showNotification,
        isValidEmail,
        validateField,
        debounce
    };
}