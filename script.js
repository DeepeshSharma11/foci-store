// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
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
});

// AOS (Animate On Scroll) initialization
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Add delay for staggered animations
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                entry.target.style.transitionDelay = `${delay}ms`;
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// Download functionality
function initializeDownloadSystem() {
    const modal = document.getElementById('downloadModal');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelDownload');
    const appNameSpan = document.getElementById('appName');
    const progressBar = document.querySelector('.progress');
    const progressText = document.querySelector('.progress-text');
    
    let downloadInProgress = false;
    let downloadProgress = 0;
    let progressInterval;
    
    // Add event listeners to all download buttons
    const downloadButtons = document.querySelectorAll('.download-btn, .btn-download');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const appName = this.getAttribute('data-name') || 
                           this.closest('.app-card, .game-card, .featured-item')?.querySelector('h3')?.textContent || 
                           'Application';
            startDownload(appName);
        });
    });
    
    function startDownload(appName) {
        if (downloadInProgress) {
            showNotification('A download is already in progress. Please wait for it to complete.', 'warning');
            return;
        }
        
        // Set app name in modal
        appNameSpan.textContent = appName;
        
        // Reset progress
        downloadProgress = 0;
        progressBar.style.width = '0%';
        progressText.textContent = 'Preparing download...';
        
        // Show modal with animation
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Start progress simulation
        downloadInProgress = true;
        progressInterval = setInterval(updateProgress, 200);
        
        // Track download in analytics (simulated)
        trackDownload(appName);
    }
    
    function updateProgress() {
        if (downloadProgress < 100) {
            downloadProgress += Math.random() * 15;
            if (downloadProgress > 100) downloadProgress = 100;
            
            progressBar.style.width = downloadProgress + '%';
            
            if (downloadProgress < 30) {
                progressText.textContent = 'Preparing download...';
            } else if (downloadProgress < 70) {
                progressText.textContent = 'Downloading...';
            } else {
                progressText.textContent = 'Almost done...';
            }
        } else {
            // Download complete
            clearInterval(progressInterval);
            progressText.textContent = 'Download complete!';
            
            // Hide modal after a delay
            setTimeout(function() {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                downloadInProgress = false;
                
                // Show success message
                showNotification('Download completed successfully!', 'success');
            }, 1000);
        }
    }
    
    function trackDownload(appName) {
        // Simulate analytics tracking
        console.log(`Download started: ${appName}`);
        
        // In a real implementation, you would send this to your analytics service
        // Example: gtag('event', 'download', { 'app_name': appName });
    }
    
    // Close modal when clicking X
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Cancel download button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    function closeModal() {
        if (downloadInProgress) {
            if (confirm('Download in progress. Are you sure you want to cancel?')) {
                clearInterval(progressInterval);
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                downloadInProgress = false;
            }
        } else {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
}

// Scroll effects
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Parallax effect for hero section
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }
}

// Counter animations
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                const step = target / (duration / 16); // 60fps
                let current = 0;
                
                const timer = setInterval(function() {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current);
                }, 16);
                
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        if (question && answer && toggle) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                        }
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active', !isActive);
                
                // Animate height
                if (!isActive) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        }
    });
}

// Contact form handling with FormSubmit.co integration
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const successMessage = document.getElementById('successMessage');
        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnText = submitBtn?.querySelector('.btn-text');
        const btnLoading = submitBtn?.querySelector('.btn-loading');

        // Hide success message initially
        if (successMessage) {
            successMessage.style.display = 'none';
        }

        // Add input event listeners for validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateField(this);
            });
            
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
        
        contactForm.addEventListener('submit', function(e) {
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
            if (submitBtn && btnText && btnLoading) {
                submitBtn.classList.add('loading');
                btnText.style.display = 'none';
                btnLoading.style.display = 'flex';
                submitBtn.disabled = true;
            }

            // Get form data
            const formData = new FormData(contactForm);
            
            // Create URL parameters for FormSubmit.co
            const params = new URLSearchParams();
            params.append('name', formData.get('name') || '');
            params.append('email', formData.get('email') || '');
            params.append('subject', formData.get('subject') || '');
            params.append('message', formData.get('message') || '');
            params.append('_subject', 'New Contact Form Submission - FociStore');
            params.append('_template', 'table');
            params.append('_captcha', 'false');

            // Send to FormSubmit.co using AJAX
            fetch('https://formsubmit.co/ajax/niku3325@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                body: params.toString()
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Show success message
                    contactForm.style.display = 'none';
                    if (successMessage) {
                        successMessage.style.display = 'block';
                        successMessage.style.opacity = '0';
                        
                        // Animate success message
                        setTimeout(() => {
                            successMessage.style.transition = 'opacity 0.5s ease';
                            successMessage.style.opacity = '1';
                        }, 100);
                    }
                    showNotification('Message sent successfully! We will get back to you soon.', 'success');
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Sorry, there was an error sending your message. Please try again later.', 'error');
                
                // Reset button state
                if (submitBtn && btnText && btnLoading) {
                    submitBtn.classList.remove('loading');
                    btnText.style.display = 'block';
                    btnLoading.style.display = 'none';
                    submitBtn.disabled = false;
                }
            });
        });
    }
}

// Field validation function
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
    
    // Show error if invalid
    if (!isValid && value !== '') {
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = errorMessage;
        errorElement.style.cssText = `
            color: #ea4335;
            font-size: 0.85rem;
            margin-top: 0.5rem;
        `;
        field.parentNode.appendChild(errorElement);
        
        // Add shake animation
        field.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }
    
    return isValid || value === '';
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
            return;
        }
        
        // Show loading state
        searchButton.textContent = 'Searching...';
        searchButton.disabled = true;
        
        // Simulate search
        setTimeout(() => {
            showNotification(`Search results for "${query}" would be displayed here.`, 'info');
            searchButton.textContent = 'Search';
            searchButton.disabled = false;
        }, 1000);
    }
}

// Filter functionality for apps and games pages
function initializeFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
    
    function applyFilters() {
        const category = categoryFilter ? categoryFilter.value : 'all';
        const sort = sortFilter ? sortFilter.value : 'popular';
        
        // Get all items
        const items = document.querySelectorAll('.app-card, .game-card');
        
        // Filter by category
        items.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Sort items (simplified implementation)
        const container = document.querySelector('.apps-grid, .games-grid');
        if (container) {
            const itemsArray = Array.from(items).filter(item => item.style.display !== 'none');
            
            itemsArray.sort((a, b) => {
                const nameA = a.querySelector('h3')?.textContent.toLowerCase() || '';
                const nameB = b.querySelector('h3')?.textContent.toLowerCase() || '';
                
                switch (sort) {
                    case 'name':
                        return nameA.localeCompare(nameB);
                    case 'newest':
                        // This would compare dates in a real implementation
                        return 0;
                    case 'popular':
                    default:
                        // This would compare popularity in a real implementation
                        return 0;
                }
            });
            
            // Reappend sorted items
            itemsArray.forEach(item => {
                container.appendChild(item);
            });
        }
        
        showNotification('Filters applied successfully!', 'success');
    }
}

// Navigation initialization
function initializeNavigation() {
    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Page transitions
function initializePageTransitions() {
    // Add page transition in
    document.body.classList.add('page-transition');
    
    // Add click handlers for internal links
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && link.href.startsWith(window.location.origin) && 
            !link.href.includes('#') && link.target !== '_blank') {
            e.preventDefault();
            
            // Add page transition out
            document.body.style.animation = 'pageOut 0.3s ease';
            
            setTimeout(() => {
                window.location.href = link.href;
            }, 300);
        }
    });
}

// Navigation scroll functionality
function initializeNavScroll() {
    const nav = document.querySelector('nav ul');
    const scrollLeft = document.querySelector('.nav-scroll-left');
    const scrollRight = document.querySelector('.nav-scroll-right');
    
    if (nav) {
        // Create scroll buttons if they don't exist
        if (!scrollLeft && !scrollRight) {
            const navContainer = document.querySelector('nav');
            if (navContainer) {
                const leftBtn = document.createElement('button');
                leftBtn.className = 'nav-scroll-indicator nav-scroll-left';
                leftBtn.innerHTML = '‹';
                leftBtn.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 5px;
                    transform: translateY(-50%);
                    background: rgba(255,255,255,0.3);
                    border: none;
                    color: white;
                    padding: 0.5rem;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 10;
                    display: none;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                
                const rightBtn = document.createElement('button');
                rightBtn.className = 'nav-scroll-indicator nav-scroll-right';
                rightBtn.innerHTML = '›';
                rightBtn.style.cssText = `
                    position: absolute;
                    top: 50%;
                    right: 5px;
                    transform: translateY(-50%);
                    background: rgba(255,255,255,0.3);
                    border: none;
                    color: white;
                    padding: 0.5rem;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 10;
                    display: none;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                
                navContainer.style.position = 'relative';
                navContainer.appendChild(leftBtn);
                navContainer.appendChild(rightBtn);
                
                // Add event listeners
                leftBtn.addEventListener('click', () => {
                    nav.scrollBy({ left: -100, behavior: 'smooth' });
                });
                
                rightBtn.addEventListener('click', () => {
                    nav.scrollBy({ left: 100, behavior: 'smooth' });
                });
                
                // Show/hide scroll buttons based on scroll position
                nav.addEventListener('scroll', () => {
                    leftBtn.style.display = nav.scrollLeft > 0 ? 'flex' : 'none';
                    rightBtn.style.display = 
                        nav.scrollLeft < (nav.scrollWidth - nav.clientWidth) ? 'flex' : 'none';
                });
                
                // Initial check
                setTimeout(() => {
                    leftBtn.style.display = nav.scrollLeft > 0 ? 'flex' : 'none';
                    rightBtn.style.display = 
                        nav.scrollLeft < (nav.scrollWidth - nav.clientWidth) ? 'flex' : 'none';
                }, 100);
            }
        }
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
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Set background based on type
    const colors = {
        success: 'linear-gradient(135deg, #34a853, #2e7d32)',
        error: 'linear-gradient(135deg, #ea4335, #c62828)',
        warning: 'linear-gradient(135deg, #fbbc04, #f57c00)',
        info: 'linear-gradient(135deg, #4285f4, #1565c0)'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Close on click
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.matches('.cta-button, .download-btn, .btn-download, .submit-btn, .btn-details')) {
        const button = e.target;
        const ripple = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
        ripple.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
        ripple.classList.add('ripple-effect');
        
        // Remove existing ripples
        const existingRipples = button.querySelectorAll('.ripple-effect');
        existingRipples.forEach(ripple => ripple.remove());
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Add loading state for buttons
document.addEventListener('click', function(e) {
    if (e.target.matches('.download-btn, .btn-download, .submit-btn')) {
        const button = e.target;
        button.classList.add('loading');
        
        setTimeout(() => {
            button.classList.remove('loading');
        }, 2000);
    }
});

// Pagination functionality
document.addEventListener('click', function(e) {
    if (e.target.matches('.page-btn') && !e.target.classList.contains('active')) {
        const buttons = document.querySelectorAll('.page-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        showNotification('Loading page...', 'info');
        
        // Simulate page load
        setTimeout(() => {
            showNotification('Page loaded successfully!', 'success');
        }, 1000);
    }
});

// Details button functionality
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-details')) {
        const card = e.target.closest('.app-card, .game-card');
        const appName = card?.querySelector('h3')?.textContent || 'Application';
        showNotification(`Details for ${appName} would be displayed here.`, 'info');
    }
});

// Initialize tooltips for rating stars
document.addEventListener('DOMContentLoaded', function() {
    const ratings = document.querySelectorAll('.app-rating');
    ratings.forEach(rating => {
        rating.title = 'User Rating';
    });
});

// Performance optimization: Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        const modal = document.getElementById('downloadModal');
        if (modal && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    // Navigate with arrow keys in FAQ
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const activeFaq = document.querySelector('.faq-item.active');
        if (activeFaq) {
            e.preventDefault();
            const allFaqs = Array.from(document.querySelectorAll('.faq-item'));
            const currentIndex = allFaqs.indexOf(activeFaq);
            let nextIndex;
            
            if (e.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % allFaqs.length;
            } else {
                nextIndex = (currentIndex - 1 + allFaqs.length) % allFaqs.length;
            }
            
            // Close current FAQ
            activeFaq.classList.remove('active');
            const activeAnswer = activeFaq.querySelector('.faq-answer');
            if (activeAnswer) {
                activeAnswer.style.maxHeight = '0';
            }
            
            // Open next FAQ
            const nextFaq = allFaqs[nextIndex];
            nextFaq.classList.add('active');
            const nextAnswer = nextFaq.querySelector('.faq-answer');
            if (nextAnswer) {
                nextAnswer.style.maxHeight = nextAnswer.scrollHeight + 'px';
            }
            
            // Scroll into view
            nextFaq.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
});

// Add service worker for PWA functionality (commented out as it's optional)
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
*/

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAnimations,
        initializeDownloadSystem,
        initializeScrollEffects,
        initializeCounters,
        initializeContactForm,
        initializeNavigation,
        initializeFAQ,
        initializeSearch,
        initializeFilters,
        initializeNavScroll,
        showNotification,
        isValidEmail,
        validateField
    };
}