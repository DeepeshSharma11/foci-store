// Wrap all code in an IIFE (Immediately Invoked Function Expression)
(function() {
    "use strict";

    // Global state
    const state = {
        allData: [],
        filteredData: [],
        currentPage: 1,
        itemsPerPage: 8,
        pageType: 'apps', // Default
    };

    // Cache DOM elements that are frequently accessed
    const elements = {
        grid: null, // Will be set based on page
        pagination: null,
        categoryFilter: document.getElementById('categoryFilter'),
        sortFilter: document.getElementById('sortFilter'),
        searchInput: document.getElementById('searchInput'),
        loadingMessage: document.getElementById('loadingMessage')
    };

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', initializeAllFeatures);

    function initializeAllFeatures() {
        initializePageSpecificFeatures();
        
        // General features
        initializeAnimations();
        initializeDownloadSystem();
        initializeScrollEffects();
        initializeCounters();
        initializeContactForm();
        initializeNavigation();
        initializeFAQ();
        initializePageTransitions();
        initializeNavScroll();
        initializeRippleEffects();
        initializeDetailsButtons();
        initializeModalSystem();
    }

    // --- PAGE INITIALIZATION & DATA LOADING ---

    function initializePageSpecificFeatures() {
        // Robust path detection
        const path = window.location.pathname;
        let page = path.split("/").pop();
        if (page === '' || page === '/') page = 'index.html';
        
        // Remove potential query strings or hashes from filename if present
        page = page.split('?')[0].split('#')[0];

        switch(page) {
            case 'index.html':
                state.pageType = 'featured';
                loadData('featured');
                initializeHeroAnimations();
                break;
            case 'apps.html':
                state.pageType = 'apps';
                elements.grid = document.querySelector('.apps-grid');
                elements.pagination = document.getElementById('pagination') || document.querySelector('.pagination');
                loadData('apps');
                initializeSearchAndFilters();
                break;
            case 'games.html':
                state.pageType = 'games';
                elements.grid = document.querySelector('.games-grid');
                elements.pagination = document.getElementById('pagination') || document.querySelector('.pagination');
                loadData('games');
                initializeSearchAndFilters();
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
            default:
                // Fallback for homepage if path is weird
                if (!page || page === 'focistore') { 
                    state.pageType = 'featured';
                    loadData('featured');
                }
                break;
        }
    }

    function initializeSearchAndFilters() {
        initializeFilters();
        initializeSearch();
    }

    async function loadData(pageType) {
        try {
            // Check global variable first, then fallback
            const data = typeof appData !== 'undefined' ? appData : loadStaticData();
            
            if (pageType === 'featured') {
                populateFeaturedApps(data.apps || []);
                return;
            }

            // Set data based on page type
            state.allData = (pageType === 'apps') ? (data.apps || []) : (data.games || []);
            state.filteredData = [...state.allData]; // Create a shallow copy

            populateCategories();
            
            // Check for URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const categoryParam = urlParams.get('category');
            if (categoryParam && elements.categoryFilter) {
                // Check if valid option
                if ([...elements.categoryFilter.options].some(o => o.value === categoryParam)) {
                    elements.categoryFilter.value = categoryParam;
                }
            }

            applyFiltersAndRender();
            
        } catch (error) {
            console.error('Error loading data:', error);
            showNotification('Could not load data. Using fallback.', 'warning');
            
            const staticFallback = loadStaticData();
            if (pageType === 'featured') {
                populateFeaturedApps(staticFallback.staticApps.slice(0, 3));
            } else {
                state.allData = (pageType === 'apps') ? staticFallback.staticApps : staticFallback.staticGames;
                state.filteredData = [...state.allData];
                populateCategories();
                applyFiltersAndRender();
            }
        }
    }

    // --- RENDERING LOGIC ---

    function applyFiltersAndRender(resetPage = true) {
        if (!elements.grid) return;

        const category = elements.categoryFilter?.value || 'all';
        const sort = elements.sortFilter?.value || 'popular';
        const search = elements.searchInput?.value.toLowerCase().trim() || '';

        // 1. Filter
        let result = state.allData.filter(item => {
            const matchesCategory = category === 'all' || item.category === category;
            const matchesSearch = !search || 
                item.name.toLowerCase().includes(search) || 
                item.description.toLowerCase().includes(search) ||
                item.category.toLowerCase().includes(search);
            return matchesCategory && matchesSearch;
        });

        // 2. Sort
        result.sort((a, b) => {
            switch(sort) {
                case 'newest':
                    // Optimization: String comparison for ISO dates is faster than new Date()
                    return (b.releaseDate || '').localeCompare(a.releaseDate || '');
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'popular':
                default:
                    return (b.popularity || 0) - (a.popularity || 0);
            }
        });

        state.filteredData = result;
        if (resetPage) state.currentPage = 1;

        renderGrid();
        renderPagination();
    }

    function renderGrid() {
        const grid = elements.grid;
        if (!grid) return;

        // Visual loading state
        grid.innerHTML = `
            <div class="loading-message" id="loadingMessage">
                <div class="loading-spinner"></div>
                <p>Loading ${state.pageType}...</p>
            </div>`;

        // Small timeout to allow UI to breathe
        setTimeout(() => {
            grid.innerHTML = ''; // Clear loading

            if (state.filteredData.length === 0) {
                grid.innerHTML = `
                    <div class="no-results">
                        <div class="no-results-icon">${state.pageType === 'games' ? '🎮' : '📱'}</div>
                        <h3>No ${state.pageType} found</h3>
                        <p>Try changing your filters or search terms.</p>
                    </div>`;
                return;
            }

            const startIndex = (state.currentPage - 1) * state.itemsPerPage;
            const endIndex = startIndex + state.itemsPerPage;
            const pageData = state.filteredData.slice(startIndex, endIndex);

            // Optimization: Use DocumentFragment to minimize reflows
            const fragment = document.createDocumentFragment();

            pageData.forEach((item, index) => {
                const card = createItemCard(item, index, state.pageType);
                fragment.appendChild(card);
            });

            grid.appendChild(fragment);

            // Refresh animations
            if (typeof AOS !== 'undefined') {
                AOS.refreshHard();
            } else {
                initializeAnimations(); // Fallback re-run
            }
        }, 50);
    }

    function createItemCard(item, index, type) {
        const card = document.createElement('div');
        // Combined class logic
        card.className = `${type === 'games' ? 'game-card' : 'app-card'} card-hover`;
        card.setAttribute('data-aos', 'zoom-in');
        card.setAttribute('data-aos-delay', ((index % state.itemsPerPage) * 50).toString());
        card.setAttribute('data-category', item.category);

        // Native lazy loading added
        card.innerHTML = `
            <div class="card-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.onerror=null; this.src='https://placehold.co/300x200/667eea/ffffff?text=Image+N/A'">
                ${item.badge ? `<div class="card-badge">${item.badge}</div>` : ''}
            </div>
            <div class="card-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="card-meta">
                    ${item.size ? `<span class="app-size">${item.size}</span>` : ''}
                    ${item.version ? `<span class="app-version">${item.version}</span>` : ''}
                    ${item.rating ? `<span class="app-rating">⭐ ${item.rating}</span>` : ''}
                </div>
                <div class="card-actions">
                    <button class="btn-download btn-animate" data-name="${item.name}" data-url="${item.downloadUrl}">Download</button>
                    <button class="btn-details btn-animate" data-name="${item.name}">Details</button>
                </div>
            </div>
        `;
        return card;
    }

    function createFeaturedItem(app, index) {
        const item = document.createElement('div');
        item.className = 'featured-item card-hover';
        item.setAttribute('data-aos', 'zoom-in');
        item.setAttribute('data-aos-delay', ((index + 1) * 100).toString());

        item.innerHTML = `
            <div class="featured-image">
                <img src="${app.image}" alt="${app.name}" loading="lazy" onerror="this.onerror=null; this.src='https://placehold.co/300x200/667eea/ffffff?text=Featured'">
                ${app.badge ? `<div class="featured-badge">${app.badge}</div>` : ''}
            </div>
            <h3>${app.name}</h3>
            <p>${app.description}</p>
            <div class="app-info">
                ${app.size ? `<span class="app-size">${app.size}</span>` : ''}
                ${app.version ? `<span class="app-version">${app.version}</span>` : ''}
            </div>
            <button class="download-btn btn-animate" data-name="${app.name}" data-url="${app.downloadUrl}">Download Now</button>
        `;
        return item;
    }

    function populateFeaturedApps(allApps) {
        const featuredGrid = document.querySelector('.featured-grid');
        if (!featuredGrid) return;

        const featuredApps = allApps.slice(0, 3);
        featuredGrid.innerHTML = '';
        
        const fragment = document.createDocumentFragment();
        featuredApps.forEach((app, index) => {
            fragment.appendChild(createFeaturedItem(app, index));
        });
        featuredGrid.appendChild(fragment);

        initializeAnimations();
    }

    function populateCategories() {
        if (!elements.categoryFilter) return;

        const categories = [...new Set(state.allData.map(app => app.category))].sort();
        
        // Keep "All" and append others
        elements.categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        
        const fragment = document.createDocumentFragment();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            fragment.appendChild(option);
        });
        elements.categoryFilter.appendChild(fragment);
    }

    // --- PAGINATION ---

    function renderPagination() {
        const container = elements.pagination;
        if (!container) return;

        const totalPages = Math.ceil(state.filteredData.length / state.itemsPerPage);

        // Hide if strictly 1 page or empty
        if (totalPages <= 1) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'flex';
        container.innerHTML = '';

        const fragment = document.createDocumentFragment();

        // Previous
        const prevBtn = createPageButton('‹ Prev', state.currentPage > 1 ? state.currentPage - 1 : null);
        fragment.appendChild(prevBtn);

        // Logic for "..." pagination
        const maxVisible = 5; // e.g., 1 ... 4 5 6 ... 10
        let startPage = 1, endPage = totalPages;
        
        if (totalPages > maxVisible) {
            // Complex logic logic simplified for readability
            if (state.currentPage <= 3) {
                endPage = 4; // Show 1, 2, 3, 4 ... Last
            } else if (state.currentPage >= totalPages - 2) {
                startPage = totalPages - 3; // Show 1 ... 7, 8, 9, 10
            } else {
                startPage = state.currentPage - 1;
                endPage = state.currentPage + 1;
            }
        }

        // Always Page 1
        if (startPage > 1) {
            fragment.appendChild(createPageButton(1, 1));
            if (startPage > 2) fragment.appendChild(createPageDots());
        }

        // Middle Pages
        for (let i = startPage; i <= endPage; i++) {
            // If total pages is small, we loop 1 to total. 
            // If total pages is large, we loop filtered range.
            // We must handle the overlap with Page 1/Last to avoid duplicates if logic isn't perfect
            if (totalPages > maxVisible && (i === 1 || i === totalPages)) continue;
            fragment.appendChild(createPageButton(i, i));
        }

        // Always Last Page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) fragment.appendChild(createPageDots());
            fragment.appendChild(createPageButton(totalPages, totalPages));
        }

        // Next
        const nextBtn = createPageButton('Next ›', state.currentPage < totalPages ? state.currentPage + 1 : null);
        nextBtn.classList.add('next');
        fragment.appendChild(nextBtn);

        container.appendChild(fragment);
    }

    function createPageButton(text, pageNum) {
        const btn = document.createElement('button');
        btn.className = 'page-btn';
        btn.textContent = text;
        
        if (pageNum === state.currentPage) btn.classList.add('active');
        
        if (pageNum !== null) {
            btn.onclick = () => {
                if (pageNum === state.currentPage) return;
                state.currentPage = pageNum;
                renderGrid();
                renderPagination();
                elements.grid?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            };
        } else {
            btn.disabled = true;
        }
        return btn;
    }

    function createPageDots() {
        const span = document.createElement('span');
        span.className = 'page-dots';
        span.textContent = '...';
        return span;
    }

    // --- EVENT LISTENERS & UTILITIES ---

    function initializeFilters() {
        if (elements.categoryFilter) {
            elements.categoryFilter.addEventListener('change', () => applyFiltersAndRender(true));
        }
        if (elements.sortFilter) {
            elements.sortFilter.addEventListener('change', () => applyFiltersAndRender(true));
        }
    }

    function initializeSearch() {
        if (!elements.searchInput) return;

        // Debounced search
        elements.searchInput.addEventListener('input', debounce(() => applyFiltersAndRender(true), 400));
        
        // Enter key
        elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') applyFiltersAndRender(true);
        });

        const searchBtn = document.getElementById('searchButton');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => applyFiltersAndRender(true));
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // --- DOWNLOAD SYSTEM ---

    function initializeDownloadSystem() {
        let downloadInProgress = false;
        let progressInterval;
        const modal = document.getElementById('downloadModal');

        // Delegation for download buttons
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('.download-btn, .btn-download');
            if (btn) {
                e.preventDefault();
                const appName = btn.dataset.name || 'Application';
                const url = btn.dataset.url || '#';
                startDownload(appName, url);
            }
        });

        // Initialize modal logic only if modal exists
        if (!modal) return;

        // UI References
        const ui = {
            appName: modal.querySelector('#appName'),
            progressBar: modal.querySelector('.progress'),
            progressText: modal.querySelector('.progress-text'),
            confirmView: modal.querySelector('.modal-confirm-cancel'),
            mainView: modal.querySelector('.modal-main-content'),
            closeBtns: modal.querySelectorAll('.close, #cancelDownload')
        };

        function startDownload(appName, url) {
            if (downloadInProgress) {
                showNotification('Download already in progress.', 'warning');
                return;
            }

            if (ui.appName) ui.appName.textContent = appName;
            if (ui.confirmView) ui.confirmView.style.display = 'none';
            if (ui.mainView) ui.mainView.style.display = 'block';
            if (ui.progressBar) ui.progressBar.style.width = '0%';
            if (ui.progressText) ui.progressText.textContent = 'Preparing...';

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            downloadInProgress = true;

            let progress = 0;
            progressInterval = setInterval(() => {
                progress += Math.random() * 15 + 5;
                if (progress > 100) progress = 100;
                
                if (ui.progressBar) ui.progressBar.style.width = `${progress}%`;
                if (ui.progressText) {
                    if (progress < 30) ui.progressText.textContent = 'Connecting...';
                    else if (progress < 70) ui.progressText.textContent = `Downloading... ${Math.floor(progress)}%`;
                    else ui.progressText.textContent = 'Finalizing...';
                }

                if (progress >= 100) completeDownload(url);
            }, 300);
        }

        function completeDownload(url) {
            clearInterval(progressInterval);
            if (ui.progressText) ui.progressText.textContent = 'Download Ready!';
            
            setTimeout(() => {
                resetModal();
                if (url && url !== '#') {
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', '');
                    link.target = '_blank'; // Safer for external links
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    showNotification('Download started!', 'success');
                } else {
                    showNotification('Demo download complete.', 'info');
                }
            }, 800);
        }

        function resetModal() {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            downloadInProgress = false;
            clearInterval(progressInterval);
        }

        // Modal Close Logic
        ui.closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (downloadInProgress) {
                    // Show confirmation if downloading
                    if (ui.confirmView) {
                        ui.confirmView.style.display = 'flex';
                        ui.mainView.style.display = 'none';
                    } else {
                        resetModal(); // Fallback if no confirm view
                    }
                } else {
                    resetModal();
                }
            });
        });

        // Cancel Confirmation
        modal.querySelector('#confirmCancel')?.addEventListener('click', () => {
            resetModal();
            showNotification('Download cancelled.', 'info');
        });

        modal.querySelector('#resumeDownload')?.addEventListener('click', () => {
            if (ui.confirmView) ui.confirmView.style.display = 'none';
            if (ui.mainView) ui.mainView.style.display = 'block';
        });

        // Escape key handler logic is in initializeModalSystem
    }

    // --- UTILITIES & VISUALS ---

    function initializeAnimations() {
        if (typeof AOS !== 'undefined') {
            AOS.init({ duration: 600, once: true, offset: 50 });
        } else {
            // Optimized Fallback: IntersectionObserver
            const els = document.querySelectorAll('[data-aos]:not(.aos-animate)');
            if (!els.length) return;

            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('aos-animate');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            els.forEach(el => obs.observe(el));
        }
    }

    function initializeNavigation() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        const cleanPath = path.split('?')[0].split('#')[0];
        
        document.querySelectorAll('nav a').forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            // Strict check
            if (href === cleanPath || (cleanPath === 'index.html' && (href === './' || href === '/'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function initializeScrollEffects() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        let lastY = 0;
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            requestAnimationFrame(() => {
                if (y > 100) {
                    header.classList.add('scrolled');
                    // Toggle compact mode based on scroll direction
                    header.classList.toggle('compact', y > lastY && y > 200);
                } else {
                    header.classList.remove('scrolled', 'compact');
                }
                lastY = y;
            });
        }, { passive: true });
    }

    function initializeRippleEffects() {
        document.body.addEventListener('click', (e) => {
            const target = e.target.closest('.btn-download, .download-btn, .btn-details, .page-btn, .cta-button');
            if (!target) return;

            const circle = document.createElement('span');
            const d = Math.max(target.clientWidth, target.clientHeight);
            const r = target.getBoundingClientRect();
            
            circle.style.width = circle.style.height = `${d}px`;
            circle.style.left = `${e.clientX - r.left - d/2}px`;
            circle.style.top = `${e.clientY - r.top - d/2}px`;
            circle.classList.add('ripple-effect');
            
            // Remove old ripples to prevent DOM buildup
            const old = target.querySelector('.ripple-effect');
            if (old) old.remove();
            
            target.appendChild(circle);
            setTimeout(() => circle.remove(), 600);
        });
    }

    function showNotification(msg, type = 'info') {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            // Added CSS class for container styling usually found in CSS file, explicitly set here just in case
            container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 10px; pointer-events: none;';
            document.body.appendChild(container);
        }

        const notif = document.createElement('div');
        notif.className = `notification notification-${type} notification-slide-in`;
        notif.style.pointerEvents = 'auto'; // Enable clicking on the notification itself
        notif.innerHTML = `
            <div class="notification-content">
                <span>${msg}</span>
                <button class="notification-close">&times;</button>
            </div>`;
        
        container.prepend(notif);

        // Auto remove
        const timer = setTimeout(remove, 5000);
        
        function remove() {
            clearTimeout(timer);
            notif.classList.replace('notification-slide-in', 'notification-slide-out');
            notif.addEventListener('animationend', () => notif.remove());
        }

        notif.querySelector('.notification-close').onclick = remove;
    }

    function initializeContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('.submit-btn');
            const originalText = btn.textContent;
            
            // Simple validation
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let valid = true;
            inputs.forEach(i => {
                if (!i.value.trim()) { i.classList.add('error'); valid = false; } 
                else { i.classList.remove('error'); }
            });
            if (!valid) return showNotification('Please fill all required fields', 'error');

            // Simulate sending (or use FormSubmit if configured)
            btn.disabled = true;
            btn.textContent = 'Sending...';
            
            try {
                // Using fetch to formsubmit
                const formData = new FormData(form);
                const response = await fetch(form.action || 'https://formsubmit.co/ajax/focistore@gmail.com', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    showNotification('Message sent successfully!', 'success');
                    form.reset();
                    form.style.display = 'none';
                    document.getElementById('successMessage').style.display = 'block';
                } else {
                    throw new Error('Server error');
                }
            } catch (err) {
                console.error(err);
                showNotification('Failed to send message.', 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    }

    // Placeholders for other init functions to prevent errors if features aren't used on current page
    function initializeHeroAnimations() {}
    function initializeTeamAnimations() {}
    function initializeContactAnimations() {}
    function initializeLegalPage() {}
    function initializeDetailsButtons() {}
    function initializeNavScroll() {}
    
    function initializeModalSystem() {
        // Global modal closer for Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal');
                modals.forEach(m => {
                    if (m.style.display === 'block') {
                        // Check if it's download modal and invoke cancel click
                        if (m.id === 'downloadModal') {
                            const cancel = m.querySelector('#cancelDownload');
                            if (cancel) cancel.click();
                            else m.style.display = 'none';
                        } else {
                            m.style.display = 'none';
                        }
                        document.body.style.overflow = '';
                    }
                });
            }
        });
    }

    function initializeCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        if(!counters.length) return;
        
        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count);
                    let start = 0;
                    const increment = target / 50; // 50 frames
                    
                    const timer = setInterval(() => {
                        start += increment;
                        el.textContent = Math.floor(start).toLocaleString();
                        if (start >= target) {
                            el.textContent = target.toLocaleString();
                            clearInterval(timer);
                        }
                    }, 30);
                    observer.unobserve(el);
                }
            });
        });
        counters.forEach(c => obs.observe(c));
    }

    function initializeFAQ() {
        const faq = document.querySelector('.faq-list');
        if (!faq) return;
        
        faq.addEventListener('click', (e) => {
            const question = e.target.closest('.faq-question');
            if (!question) return;
            
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close others
            faq.querySelectorAll('.faq-item.active').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    }

    // --- STATIC DATA FALLBACK ---
    // Kept at bottom to keep logic clean. Only used if data.js fails or is missing.
    function loadStaticData() {
        return {
            staticApps: [
                {
                    "id": 1, "name": "WhatsApp MOD", "description": "Enhanced version with themes & privacy.",
                    "category": "social", "image": "assets/images/fmwhatsapp.png", "size": "95 MB",
                    "version": "v9.82", "rating": 4.7, "popularity": 95, "releaseDate": "2024-10-20",
                    "downloadUrl": "#", "badge": "Trending"
                },
                {
                    "id": 2, "name": "Instagram MOD", "description": "Download media & privacy features.",
                    "category": "social", "image": "assets/images/Insta-Pro-APK.png", "size": "60 MB",
                    "version": "v10.0", "rating": 4.6, "popularity": 92, "releaseDate": "2024-10-19",
                    "downloadUrl": "#", "badge": "New"
                },
                {
                    "id": 3, "name": "Spotify Premium", "description": "Ad-free music & unlimited skips.",
                    "category": "media", "image": "assets/images/spotify-mod.png", "size": "85 MB",
                    "version": "v8.8", "rating": 4.9, "popularity": 99, "releaseDate": "2024-10-23",
                    "downloadUrl": "#", "badge": "Premium"
                },
                {
                    "id": 4, "name": "YouTube ReVanced", "description": "Ad-free background play.",
                    "category": "media", "image": "assets/images/app.revanced.android.youtube.200.png", "size": "120 MB",
                    "version": "v18.45", "rating": 4.8, "popularity": 98, "releaseDate": "2024-10-22",
                    "downloadUrl": "#", "badge": "Popular"
                }
            ],
            staticGames: [
                {
                    "id": 1, "name": "Subway Surfers MOD", "description": "Unlimited coins & keys.",
                    "category": "action", "image": "assets/images/subway-surfers.png", "size": "150 MB",
                    "version": "v3.12", "rating": 4.8, "popularity": 98, "releaseDate": "2024-10-23",
                    "downloadUrl": "#", "badge": "Unlimited"
                },
                {
                    "id": 2, "name": "Minecraft PE", "description": "Full unlocked game.",
                    "category": "adventure", "image": "assets/images/minecraft.png", "size": "180 MB",
                    "version": "v1.20", "rating": 4.9, "popularity": 96, "releaseDate": "2024-10-20",
                    "downloadUrl": "#", "badge": "Premium"
                },
                {
                    "id": 3, "name": "PUBG Mobile", "description": "No recoil & aim assist.",
                    "category": "action", "image": "assets/images/pubg-mobile.png", "size": "1.8 GB",
                    "version": "v3.0", "rating": 4.9, "popularity": 100, "releaseDate": "2024-10-24",
                    "downloadUrl": "#", "badge": "Pro"
                }
            ]
        };
    }

})();