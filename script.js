// Wrap all code in an IIFE (Immediately Invoked Function Expression)
(function() {

    // Configuration
    const CONFIG = {
        ITEMS_PER_PAGE: 8,
        DEBOUNCE_DELAY: 300,
        API_ENDPOINTS: {
            CONTACT_FORM: 'https://formsubmit.co/ajax/focistore@gmail.com'
        },
        ANIMATION: {
            ENABLED: true,
            DELAY_INCREMENT: 100
        }
    };

    // "Global" state for the page (within the IIFE)
    const state = {
        allData: [], // Will hold apps OR games, depending on the page
        filteredData: [],
        currentPage: 1,
        itemsPerPage: CONFIG.ITEMS_PER_PAGE,
        pageType: 'apps', // Default page type
        filters: {
            category: 'all',
            sort: 'popular',
            search: ''
        },
        isLoading: false,
        observers: [] // Track observers for cleanup
    };

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeAllFeatures();
    });

    // Cleanup function
    function cleanup() {
        state.observers.forEach(observer => {
            if (observer && typeof observer.disconnect === 'function') {
                observer.disconnect();
            }
        });
        state.observers = [];
    }

    // Initialize all features
    function initializeAllFeatures() {
        // This function now correctly determines the page and loads data *first*
        initializePageSpecificFeatures(); 
        
        // These are all general and can run after
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
        
        // Add cleanup on page unload
        window.addEventListener('beforeunload', cleanup);
    }

    // Page-specific feature initialization (NOW CONTROLS DATA LOADING)
    function initializePageSpecificFeatures() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        
        switch(path) {
            case 'index.html':
            case '':
                state.pageType = 'apps'; // Featured apps
                loadData('featured'); // Load data for featured section
                initializeHeroAnimations();
                break;
            case 'apps.html':
                state.pageType = 'apps';
                loadData('apps'); // Load app data
                initializeAdvancedFilters();
                initializeSearch(); // Init search & filters *after* data load starts
                initializeFilters();
                break;
            case 'games.html':
                state.pageType = 'games';
                loadData('games'); // Load game data
                initializeAdvancedFilters();
                initializeSearch(); // Init search & filters *after* data load starts
                initializeFilters();
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

    // --- NEW APP LOADING AND RENDERING FUNCTIONS ---

    /**
     * Fetches app/game data from apps.json
     */
    async function loadData(pageType) {
        if (state.isLoading) return;
        
        state.isLoading = true;
        let allApps = [];
        let allGames = [];

        try {
            const response = await fetch('apps.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allApps = data.apps || [];
            allGames = data.games || [];
        } catch (error) {
            console.error('Error loading data from apps.json:', error);
            showNotification('Could not load data. Using fallback.', 'warning');
            // Fallback to static data if JSON fails
            const staticData = loadStaticData();
            allApps = staticData.staticApps;
            allGames = staticData.staticGames;
        } finally {
            state.isLoading = false;
        }

        // Validate data
        if (!Array.isArray(allApps)) allApps = [];
        if (!Array.isArray(allGames)) allGames = [];

        // Set the correct data in the state
        if (pageType === 'apps') {
            state.allData = allApps;
        } else if (pageType === 'games') {
            state.allData = allGames;
        } else if (pageType === 'featured') {
            populateFeaturedApps(allApps); // Special case for homepage
            initializePopularCategories(allApps); // NEW: Initialize popular categories
            return; // Don't need to do the rest
        }

        state.filteredData = state.allData;
        
        // Once data is loaded, populate categories and render the grid
        populateCategories();
        applyFiltersAndRender();
    }

    /**
     * NEW: Initialize popular categories on homepage
     */
    function initializePopularCategories(allApps) {
        const popularCategoriesContainer = document.getElementById('popularCategories');
        if (!popularCategoriesContainer) return;

        // Calculate popular categories based on app count and average rating
        const categoryStats = {};
        
        allApps.forEach(app => {
            if (!categoryStats[app.category]) {
                categoryStats[app.category] = {
                    count: 0,
                    totalRating: 0,
                    totalPopularity: 0
                };
            }
            categoryStats[app.category].count++;
            categoryStats[app.category].totalRating += app.rating;
            categoryStats[app.category].totalPopularity += app.popularity;
        });

        // Convert to array and sort by popularity (count + rating)
        const popularCategories = Object.entries(categoryStats)
            .map(([category, stats]) => ({
                category,
                count: stats.count,
                avgRating: stats.totalRating / stats.count,
                avgPopularity: stats.totalPopularity / stats.count,
                score: stats.count + (stats.totalRating / stats.count) * 10
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 6); // Top 6 categories

        // Create category cards
        popularCategoriesContainer.innerHTML = '';
        
        popularCategories.forEach((cat, index) => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.setAttribute('data-aos', 'fade-up');
            categoryCard.setAttribute('data-aos-delay', (index * 100).toString());
            
            const icon = getCategoryIcon(cat.category);
            const appCount = cat.count;
            
            categoryCard.innerHTML = `
                <div class="category-icon">${icon}</div>
                <h4>${cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}</h4>
                <p>${appCount} ${appCount === 1 ? 'App' : 'Apps'}</p>
                <div class="category-stats">
                    <span class="category-rating">⭐ ${cat.avgRating.toFixed(1)}</span>
                </div>
                <button class="category-explore" data-category="${cat.category}">
                    Explore
                </button>
            `;
            
            popularCategoriesContainer.appendChild(categoryCard);
        });

        // Add event listeners for explore buttons
        popularCategoriesContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('category-explore')) {
                const category = e.target.getAttribute('data-category');
                navigateToCategory(category);
            }
        });
    }

    /**
     * NEW: Get appropriate icon for each category
     */
    function getCategoryIcon(category) {
        const icons = {
            social: '👥',
            media: '🎬',
            tools: '🛠️',
            productivity: '💼',
            action: '🎯',
            racing: '🏎️',
            puzzle: '🧩',
            adventure: '🗺️',
            sports: '⚽'
        };
        return icons[category] || '📱';
    }

    /**
     * NEW: Navigate to apps page with category filter applied
     */
    function navigateToCategory(category) {
        // Store the category filter in sessionStorage
        sessionStorage.setItem('selectedCategory', category);
        sessionStorage.setItem('redirectFromHome', 'true');
        
        // Navigate to apps page
        window.location.href = 'apps.html';
    }

    /**
     * NEW: Apply stored category filter when arriving from homepage
     */
    function applyStoredCategoryFilter() {
        if (sessionStorage.getItem('redirectFromHome') === 'true') {
            const storedCategory = sessionStorage.getItem('selectedCategory');
            if (storedCategory) {
                const categoryFilter = document.getElementById('categoryFilter');
                if (categoryFilter) {
                    categoryFilter.value = storedCategory;
                    // Apply filter after a short delay to ensure data is loaded
                    setTimeout(() => {
                        applyFiltersAndRender();
                    }, 100);
                }
            }
            // Clear the storage
            sessionStorage.removeItem('selectedCategory');
            sessionStorage.removeItem('redirectFromHome');
        }
    }

    // Fallback static data
    function loadStaticData() {
        const staticApps = [
            { id: 1, name: "WhatsApp MOD", description: "Enhanced version...", category: "social", image: "assets/images/fmwhatsapp.png", size: "95 MB", version: "v2.23.5.76", rating: 4.7, popularity: 95, releaseDate: "2024-10-20T00:00:00Z", downloads: "10K+", downloadUrl: "https://getkukuymun.site/url/2A8QZ54HRrD", badge: "Trending" },
            { id: 2, name: "Instagram MOD", description: "Download photos, videos...", category: "social", image: "assets/images/Insta-Pro-APK.png", size: "143 MB", version: "v289.0.0.18.109", rating: 4.7, popularity: 92, releaseDate: "2024-10-19T00:00:00Z", downloads: "8K+", downloadUrl: "https://getkukuymun.site/url/2A8QZ54HRrD", badge: "New" },
            { id: 3, name: "YouTube MOD", description: "Ad-free YouTube experience...", category: "media", image: "assets/images/youtube-mod.png", size: "85 MB", version: "v18.45.43", rating: 4.8, popularity: 98, releaseDate: "2024-10-22T00:00:00Z", downloads: "15K+", downloadUrl: "https://vanced.to/", badge: "Popular" },
            { id: 4, name: "File Manager MOD", description: "Advanced file management...", category: "tools", image: "assets/images/file-manager.png", size: "8 MB", version: "v4.2.1", rating: 4.8, popularity: 80, releaseDate: "2024-10-18T00:00:00Z", downloads: "5K+", downloadUrl: "https://liteapks.com/download/file-manager-77834", badge: "Pro" },
            { id: 5, name: "XPlayer", description: "XPlayer Mod APK is an impressive video player...", category: "media", image: "assets/images/xplayer.png", size: "38 MB", version: "v2.4.8.2", rating: 4.5, popularity: 82, releaseDate: "2024-10-17T00:00:00Z", downloads: "7K+", downloadUrl: "https://liteapks.com/download/xplayer-5858", badge: "Enhanced" },
            { id: 6, name: "Office Suite MOD", description: "Complete office suite with PDF editing...", category: "productivity", image: "assets/images/office-suite.png", size: "120 MB", version: "v14.8.4", rating: 4.7, popularity: 85, releaseDate: "2024-10-16T00:00:00Z", downloads: "6K+", downloadUrl: "#", badge: "Premium" },
            { id: 7, name: "TikTok MOD", description: "Download videos without watermark...", category: "social", image: "assets/images/tiktok-mod.png", size: "120 MB", version: "v30.5.4", rating: 4.6, popularity: 96, releaseDate: "2024-10-21T00:00:00Z", downloads: "15K+", downloadUrl: "https://example.com/tiktok", badge: "Popular" },
            { id: 8, name: "Spotify MOD", description: "Ad-free music, unlimited skips...", category: "media", image: "assets/images/spotify-mod.png", size: "85 MB", version: "v8.8.96", rating: 4.9, popularity: 99, releaseDate: "2024-10-23T00:00:00Z", downloads: "20K+", downloadUrl: "https://example.com/spotify", badge: "Premium" }
        ];
        
        const staticGames = [
            { id: 1, name: "Subway Surfers MOD", description: "Unlimited coins, keys...", category: "action", image: "assets/images/subway-surfers.png", size: "150 MB", version: "v3.12.1", rating: 4.8, popularity: 98, releaseDate: "2024-10-23T00:00:00Z", downloads: "25K+", downloadUrl: "https://an1.com/file_4683-dw.html", badge: "Unlimited" },
            { id: 2, name: "Asphalt 9 MOD", description: "Unlimited credits, all cars unlocked...", category: "racing", image: "assets/images/asphalt-9.png", size: "2.1 GB", version: "v3.9.4", rating: 4.9, popularity: 95, releaseDate: "2024-10-22T00:00:00Z", downloads: "12K+", downloadUrl: "https://asphalt-9-legends-mod.apkresult.io/download", badge: "Premium" },
            { id: 3, name: "Candy Crush MOD", description: "Unlimited lives, boosters...", category: "puzzle", image: "assets/images/candy-crush.png", size: "95 MB", version: "v1.260.1.2", rating: 4.7, popularity: 90, releaseDate: "2024-10-21T00:00:00Z", downloads: "18K+", downloadUrl: "https://candy-crush-soda-saga.apkrabi.com/download/", badge: "Unlimited" },
            { id: 4, name: "Minecraft MOD", description: "Unlocked skins, texture packs...", category: "adventure", image: "assets/images/minecraft.png", size: "180 MB", version: "v1.20.15.01", rating: 4.9, popularity: 96, releaseDate: "2024-10-20T00:00:00Z", downloads: "15K+", downloadUrl: "#", badge: "Premium" },
            { id: 5, name: "FIFA Mobile MOD", description: "Unlimited coins, all players unlocked...", category: "sports", image: "assets/images/fifa-mobile.png", size: "1.2 GB", version: "v17.0.14", rating: 4.8, popularity: 88, releaseDate: "2024-10-19T00:00:00Z", downloads: "10K+", downloadUrl: "#", badge: "Enhanced" },
            { id: 6, name: "Call of Duty MOD", description: "Unlimited CP, all weapons unlocked...", category: "action", image: "assets/images/call-of-duty.png", size: "2.5 GB", version: "v1.0.39", rating: 4.9, popularity: 97, releaseDate: "2024-10-18T00:00:00Z", downloads: "20K+", downloadUrl: "#", badge: "Pro" },
            { id: 7, name: "Temple Run 2 MOD", description: "Unlimited coins, all characters unlocked...", category: "adventure", image: "assets/images/temple-run.png", size: "80 MB", version: "v1.100.0", rating: 4.6, popularity: 85, releaseDate: "2024-10-17T00:00:00Z", downloads: "8K+", downloadUrl: "#", badge: "Unlimited" },
            { id: 8, name: "PUBG Mobile MOD", description: "Unlimited UC, aim assist...", category: "action", image: "assets/images/pubg-mobile.png", size: "1.8 GB", version: "v3.0.0", rating: 4.9, popularity: 100, releaseDate: "2024-10-24T00:00:00Z", downloads: "30K+", downloadUrl: "#", badge: "Pro" }
        ];

        return { staticApps, staticGames };
    }

    /**
     * Populates the category filter dropdown *dynamically*
     */
    function populateCategories() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return;

        // Get unique categories from the *loaded data*
        const categories = [...new Set(state.allData.map(app => app.category))];
        categories.sort(); // Sort alphabetically
        
        categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilter.appendChild(option);
        });

        // Apply stored category filter if coming from homepage
        applyStoredCategoryFilter();
    }

    /**
     * Populates featured apps on homepage
     */
    function populateFeaturedApps(allApps) {
        const featuredGrid = document.querySelector('.featured-grid');
        if (!featuredGrid) return;

        // Get first 3 apps for featured section
        const featuredApps = allApps.slice(0, 3);
        featuredGrid.innerHTML = '';
        if (featuredApps.length === 0) return;
        
        featuredApps.forEach((app, index) => {
            const featuredItem = createFeaturedItem(app, index);
            featuredGrid.appendChild(featuredItem);
        });
        
        // Re-initialize animations for new elements
        initializeAnimations();
    }

    /**
     * Applies all filters and sorting, then triggers rendering
     */
    function applyFiltersAndRender() {
        const category = document.getElementById('categoryFilter')?.value || 'all';
        const sort = document.getElementById('sortFilter')?.value || 'popular';
        const search = document.getElementById('searchInput')?.value.toLowerCase() || '';

        // Update state
        state.filters.category = category;
        state.filters.sort = sort;
        state.filters.search = search;

        // 1. Filter by Category
        let result = state.allData;
        if (category !== 'all') {
            result = result.filter(app => app.category === category);
        }

        // 2. Filter by Search
        if (search.length > 0) {
            result = result.filter(item => 
                item.name.toLowerCase().includes(search) ||
                item.description.toLowerCase().includes(search) ||
                item.category.toLowerCase().includes(search)
            );
        }

        // 3. Sort
        switch(sort) {
            case 'newest':
                result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'popular':
            default:
                // Sort by popularity, falling back to rating if popularity is missing
                result.sort((a, b) => (b.popularity || b.rating * 10) - (a.popularity || a.rating * 10));
                break;
        }

        state.filteredData = result;
        state.currentPage = 1; // Reset to first page after filtering

        // Show notification
        if (search.length > 0) {
            showNotification(`Found ${result.length} results for "${search}"`, 'info');
        }

        renderGrid();
        renderPagination();
    }

    /**
     * Renders the grid of app/game cards for the *current page*
     */
    function renderGrid() {
        const grid = document.querySelector(state.pageType === 'games' ? '.games-grid' : '.apps-grid');
        if (!grid) return;

        // Remove loading message
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            loadingMessage.remove();
        }

        grid.innerHTML = ''; // Clear previous content

        if (state.filteredData.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">${state.pageType === 'games' ? '🎮' : '📱'}</div>
                    <h3>No ${state.pageType === 'games' ? 'games' : 'applications'} found</h3>
                    <p>${state.currentPage > 1 ? 'Try going back to previous pages' : 'Try changing your filters or search terms'}</p>
                </div>
            `;
            return;
        }

        // Calculate apps for the current page
        const startIndex = (state.currentPage - 1) * state.itemsPerPage;
        const endIndex = startIndex + state.itemsPerPage;
        const pageData = state.filteredData.slice(startIndex, endIndex);

        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();
        pageData.forEach((item, index) => {
            const card = (state.pageType === 'games') ? createGameCard(item, index) : createAppCard(item, index);
            fragment.appendChild(card);
        });
        
        grid.appendChild(fragment);

        // Re-initialize animations for new elements
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        } else {
            initializeAnimations();
        }
    }

    /**
     * Renders the pagination buttons
     */
    function renderPagination() {
        let paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) {
            paginationContainer = document.getElementById('pagination');
        }
        if (!paginationContainer) return;

        const totalPages = Math.ceil(state.filteredData.length / state.itemsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'flex';
        paginationContainer.innerHTML = '';
        
        // Previous button
        if (state.currentPage > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'page-btn';
            prevBtn.innerHTML = '‹ Previous';
            prevBtn.addEventListener('click', () => {
                state.currentPage--;
                renderGrid();
                renderPagination();
                scrollToTop();
            });
            paginationContainer.appendChild(prevBtn);
        }
        
        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, state.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
             paginationContainer.appendChild(createPageButton(1));
             if(startPage > 2) paginationContainer.appendChild(createPageDots());
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationContainer.appendChild(createPageButton(i));
        }

        if (endPage < totalPages) {
            if(endPage < totalPages - 1) paginationContainer.appendChild(createPageDots());
            paginationContainer.appendChild(createPageButton(totalPages));
        }
        
        // Next button
        if (state.currentPage < totalPages) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'page-btn next';
            nextBtn.innerHTML = 'Next ›';
            nextBtn.addEventListener('click', () => {
                state.currentPage++;
                renderGrid();
                renderPagination();
                scrollToTop();
            });
            paginationContainer.appendChild(nextBtn);
        }
    }

    // Helper for pagination
    function createPageButton(pageNumber) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${pageNumber === state.currentPage ? 'active' : ''}`;
        pageBtn.textContent = pageNumber;
        pageBtn.addEventListener('click', () => {
            state.currentPage = pageNumber;
            renderGrid();
            renderPagination();
            scrollToTop();
        });
        return pageBtn;
    }

    // Helper for pagination
    function createPageDots() {
         const dots = document.createElement('span');
         dots.className = 'page-dots';
         dots.textContent = '...';
         return dots;
    }

    // Helper to scroll to top on page change
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Create app card HTML
    function createAppCard(app, index) {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.setAttribute('data-aos', 'zoom-in');
        card.setAttribute('data-aos-delay', (index * 100).toString());
        card.setAttribute('data-category', app.category);
        
        card.innerHTML = `
            <div class="card-image">
                <img src="${app.image}" alt="${app.name}" loading="lazy" onerror="this.onerror=null; this.src='https://placehold.co/300x200/667eea/ffffff?text=App+Image'">
                <div class="card-badge">${app.badge}</div>
            </div>
            <div class="card-content">
                <h3>${app.name}</h3>
                <p>${app.description}</p>
                <div class="card-meta">
                    <span class="app-size">${app.size}</span>
                    <span class="app-version">${app.version}</span>
                    <span class="app-rating">⭐ ${app.rating}</span>
                </div>
                <div class="card-actions">
                    <button class="btn-download" data-name="${app.name}" data-url="${app.downloadUrl}">Download</button>
                    <button class="btn-details" data-name="${app.name}">Details</button>
                </div>
            </div>
        `;
        return card;
    }

    // Create game card HTML
    function createGameCard(game, index) {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.setAttribute('data-aos', 'zoom-in');
        card.setAttribute('data-aos-delay', (index * 100).toString());
        card.setAttribute('data-category', game.category);
        
        card.innerHTML = `
            <div class="card-image">
                <img src="${game.image}" alt="${game.name}" loading="lazy" onerror="this.onerror=null; this.src='https://placehold.co/300x200/667eea/ffffff?text=Game+Image'">
                <div class="card-badge">${game.badge}</div>
            </div>
            <div class="card-content">
                <h3>${game.name}</h3>
                <p>${game.description}</p>
                <div class="card-meta">
                    <span class="app-size">${game.size}</span>
                    <span class="app-version">${game.version}</span>
                    <span class="app-rating">⭐ ${game.rating}</span>
                </div>
                <div class="card-actions">
                    <button class="btn-download" data-name="${game.name}" data-url="${game.downloadUrl}">Download</button>
                    <button class="btn-details" data-name="${game.name}">Details</button>
                </div>
            </div>
        `;
        return card;
    }

    // Create featured item HTML
    function createFeaturedItem(app, index) {
        const item = document.createElement('div');
        item.className = 'featured-item';
        item.setAttribute('data-aos', 'zoom-in');
        item.setAttribute('data-aos-delay', ((index + 1) * 100).toString());
        
        item.innerHTML = `
            <div class="featured-image">
                <img src="${app.image}" alt="${app.name}" loading="lazy" onerror="this.onerror=null; this.src='https://placehold.co/300x200/667eea/ffffff?text=Featured+App'">
                <div class="featured-badge">${app.badge}</div>
            </div>
            <h3>${app.name}</h3>
            <p>${app.description}</p>
            <div class="app-info">
                <span class="app-size">${app.size}</span>
                <span class="app-version">${app.version}</span>
            </div>
            <button class="download-btn" data-name="${app.name}" data-url="${app.downloadUrl}">Download Now</button>
        `;
        return item;
    }

    // --- ORIGINAL/UTILITY FUNCTIONS (Optimized) ---

    // AOS initialization with memory management
    function initializeAnimations() {
        const needsScrollAnimations = document.querySelectorAll('[data-aos]');
        if (needsScrollAnimations.length === 0) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries, obs) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.classList.add('aos-animate');
                    const delay = element.getAttribute('data-aos-delay') || 0;
                    element.style.transitionDelay = `${delay}ms`;
                    obs.unobserve(element);
                }
            });
        }, observerOptions);

        needsScrollAnimations.forEach(el => {
            observer.observe(el);
        });

        // Store observer for cleanup
        state.observers.push(observer);
    }

    // Enhanced image loading with retry logic
    function loadImageWithFallback(imgElement, src, maxRetries = 2) {
        let retries = 0;
        
        function loadImage() {
            imgElement.src = src;
        }
        
        imgElement.onerror = function() {
            if (retries < maxRetries) {
                retries++;
                // Retry with cache busting
                imgElement.src = src + (src.includes('?') ? '&' : '?') + 't=' + Date.now();
            } else {
                imgElement.src = 'https://placehold.co/300x200/667eea/ffffff?text=Image+Not+Found';
                imgElement.alt = 'Image not available';
            }
        };
        
        loadImage();
    }

    // Enhanced download system with better error handling
    function initializeDownloadSystem() {
        let downloadInProgress = false;
        let progressInterval;
        
        // Event delegation for dynamic buttons
        document.addEventListener('click', function(e) {
            const button = e.target.closest('.download-btn, .btn-download');
            if (button) {
                e.preventDefault();
                const appName = button.getAttribute('data-name') || 
                              button.closest('.app-card, .game-card, .featured-item')?.querySelector('h3')?.textContent || 
                              'Application';
                const downloadUrl = button.getAttribute('data-url') || '#';
                startDownload(appName, downloadUrl);
            }
        });
        
        function startDownload(appName, downloadUrl) {
            if (downloadInProgress) {
                showNotification('A download is already in progress. Please wait.', 'warning');
                return;
            }
            
            let modal = document.getElementById('downloadModal');
            if (!modal) {
                console.warn("Modal not found. Creating fallback.");
                modal = createDownloadModal();
            }
            
            const appNameSpan = modal.querySelector('#appName');
            const progressBar = modal.querySelector('.progress');
            const progressText = modal.querySelector('.progress-text');
            const confirmView = modal.querySelector('.modal-confirm-cancel');
            
            if (appNameSpan) appNameSpan.textContent = appName;
            if (confirmView) confirmView.style.display = 'none';
            
            let downloadProgress = 0;
            if (progressBar) progressBar.style.width = '0%';
            if (progressText) progressText.textContent = 'Preparing download...';
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            downloadInProgress = true;
            progressInterval = setInterval(() => {
                downloadProgress += Math.random() * 15;
                if (downloadProgress > 100) downloadProgress = 100;
                updateProgress(downloadProgress, progressBar, progressText, downloadUrl, modal);
            }, 200);
            
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
                clearInterval(progressInterval);
                if (progressText) progressText.textContent = 'Download complete!';
                
                setTimeout(() => {
                    if (modal) modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    downloadInProgress = false;
                    
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
                    <div class="modal-content" style="position: relative; overflow: hidden;">
                        <span class="close">&times;</span>
                        <h3>Download <span id="appName">App</span></h3>
                        <p>Your download will begin shortly...</p>
                        <div class="download-progress">
                            <div class="progress-bar"><div class="progress progress-animated"></div></div>
                            <span class="progress-text">Preparing download...</span>
                        </div>
                        <div class="modal-actions">
                            <button class="cancel-btn" id="cancelDownload">Cancel</button>
                        </div>
                        <!-- Custom Confirm Dialog -->
                        <div class="modal-confirm-cancel" style="display: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255, 255, 255, 0.95); flex-direction: column; justify-content: center; align-items: center; padding: 20px; text-align: center; z-index: 10;">
                            <h4 style="margin-top: 0; margin-bottom: 10px; font-size: 1.2rem;">Cancel Download?</h4>
                            <p style="margin: 0 0 20px;">Are you sure you want to stop the download?</p>
                            <div>
                                <button class="btn-confirm-cancel" id="confirmCancel">Yes, Cancel</button>
                                <button class="btn-resume-cancel" id="resumeDownload">No, Resume</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const modal = document.getElementById('downloadModal');
            addModalListeners(modal);
            return modal;
        }

        function closeModal(modal) {
            if (downloadInProgress) {
                const confirmView = modal.querySelector('.modal-confirm-cancel');
                if (confirmView) confirmView.style.display = 'flex';
            } else {
                if (modal) modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
        
        function addModalListeners(modal) {
            if (!modal) return;
            const confirmView = modal.querySelector('.modal-confirm-cancel');
            
            modal.querySelector('.close')?.addEventListener('click', () => closeModal(modal));
            modal.querySelector('.cancel-btn, #cancelDownload')?.addEventListener('click', () => closeModal(modal));
            
            modal.querySelector('#confirmCancel')?.addEventListener('click', () => {
                clearInterval(progressInterval);
                if (modal) modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                downloadInProgress = false;
                if (confirmView) confirmView.style.display = 'none';
                showNotification('Download cancelled.', 'info');
            });
            
            modal.querySelector('#resumeDownload')?.addEventListener('click', () => {
                if (confirmView) confirmView.style.display = 'none';
            });
        }
        
        addModalListeners(document.getElementById('downloadModal'));
        
        function trackDownload(appName) {
            console.log(`Download started: ${appName}`);
            // Here you can integrate with analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download', {
                    'event_category': 'engagement',
                    'event_label': appName
                });
            }
        }
    }

    // Enhanced modal system with focus trapping
    function initializeModalSystem() {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                const modal = e.target;
                if (modal.id === 'downloadModal') {
                    const cancelBtn = modal.querySelector('.cancel-btn, #cancelDownload');
                    if (cancelBtn) cancelBtn.click();
                } else {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    if (modal.style.display === 'block') {
                        if (modal.id === 'downloadModal') {
                            const cancelBtn = modal.querySelector('.cancel-btn, #cancelDownload');
                            if (cancelBtn) cancelBtn.click();
                        } else {
                            modal.style.display = 'none';
                            document.body.style.overflow = 'auto';
                        }
                    }
                });
            }
        });
    }

    // Enhanced notification system
    function showNotification(message, type = 'info') {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
            document.body.appendChild(container);
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content" style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 10px;">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification" style="background: none; border: none; color: inherit; font-size: 1.2rem; cursor: pointer; padding: 0 5px;">&times;</button>
            </div>
        `;

        const colors = { info: '#3182ce', success: '#38a169', warning: '#dd6b20', error: '#e53e3e' };
        notification.style.cssText = `background: #fff; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; min-width: 250px; max-width: 350px; animation: slideInRight 0.3s ease; border-left: 5px solid ${colors[type] || colors.info};`;
        
        container.appendChild(notification);
        
        const styleSheet = document.getElementById('dynamic-styles');
        if (!styleSheet) {
            const style = document.createElement('style');
            style.id = 'dynamic-styles';
            style.textContent = `
                @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
            `;
            document.head.appendChild(style);
        }

        const close = () => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        };
        
        const autoRemove = setTimeout(close, 5000);
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            close();
        });
    }

    // Keep all other existing functions (they're already good)
    // Hero section animations for homepage
    function initializeHeroAnimations() {
        const heroContent = document.querySelector('.hero-content');
        const heroGraphic = document.querySelector('.hero-graphic');
        if (heroContent) heroContent.classList.add('slide-in-left');
        if (heroGraphic) heroGraphic.classList.add('slide-in-right');
    }

    // Team animations for about page
    function initializeTeamAnimations() {
        const valueItems = document.querySelectorAll('.value-item');
        const statsItems = document.querySelectorAll('.stat-mini');
        
        valueItems.forEach((item, index) => {
            item.classList.add('stagger-item');
            setTimeout(() => item.classList.add('visible'), index * 150);
        });
        
        statsItems.forEach((item, index) => {
            item.classList.add('stagger-item');
            setTimeout(() => item.classList.add('visible'), index * 100 + 500);
        });
    }

    // Contact page animations
    function initializeContactAnimations() {
        const contactMethods = document.querySelectorAll('.contact-method');
        const formElements = document.querySelectorAll('.form-group');
        
        contactMethods.forEach((method, index) => {
            method.classList.add('stagger-item');
            setTimeout(() => method.classList.add('visible'), index * 100);
        });
        
        formElements.forEach((element, index) => {
            element.classList.add('stagger-item');
            setTimeout(() => element.classList.add('visible'), index * 80 + 300);
        });
    }

    // Legal page initialization
    function initializeLegalPage() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // Enhanced filter functionality
    function initializeFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortFilter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                debounce(applyFiltersAndRender, CONFIG.DEBOUNCE_DELAY)();
            });
        }
        
        if (sortFilter) {
            sortFilter.addEventListener('change', () => {
                debounce(applyFiltersAndRender, CONFIG.DEBOUNCE_DELAY)();
            });
        }
    }

    // Advanced filters for apps/games pages
    function initializeAdvancedFilters() {
        const filterControls = document.querySelector('.filter-controls');
        if (filterControls) filterControls.classList.add('slide-in-top');
    }

    // Enhanced search functionality
    function initializeSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        
        if (searchInput && searchButton) {
            searchButton.addEventListener('click', applyFiltersAndRender);
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') applyFiltersAndRender();
            });
            searchInput.addEventListener('input', debounce(applyFiltersAndRender, 500));
        }
    }

    // Scroll effects
    function initializeScrollEffects() {
        const header = document.querySelector('.header');
        let ticking = false;
        
        if (header) {
            window.addEventListener('scroll', function() {
                if (!ticking) {
                    requestAnimationFrame(function() {
                        if (window.scrollY > 100) {
                            header.classList.add('scrolled');
                            if (window.scrollY > 200) header.classList.add('compact');
                            else header.classList.remove('compact');
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

    // Counter animations
    function initializeCounters() {
        const counters = document.querySelectorAll('.stat-number');
        if (counters.length === 0) return;
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count') || counter.textContent.replace(/,/g, ''));
                    const duration = 2000;
                    let startTime = null;

                    const animate = (timestamp) => {
                        if (!startTime) startTime = timestamp;
                        const progress = Math.min((timestamp - startTime) / duration, 1);
                        const current = Math.floor(progress * target);
                        counter.textContent = current.toLocaleString();
                        
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };
                    requestAnimationFrame(animate);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
        state.observers.push(observer);
    }

    // FAQ functionality
    function initializeFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length === 0) return;
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                question.setAttribute('role', 'button');
                question.setAttribute('aria-expanded', 'false');
                if (!answer.id) answer.id = `faq-${Math.random().toString(36).substr(2, 9)}`;
                question.setAttribute('aria-controls', answer.id);
                
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) closeFAQItem(otherItem);
                    });
                    if (!isActive) openFAQItem(item);
                    else closeFAQItem(item);
                });
                
                question.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        question.click();
                    }
                });
            }
        });
        
        function openFAQItem(item) {
            const q = item.querySelector('.faq-question');
            const a = item.querySelector('.faq-answer');
            if (!q || !a) return;
            item.classList.add('active');
            q.setAttribute('aria-expanded', 'true');
            a.style.maxHeight = a.scrollHeight + 'px';
        }
        
        function closeFAQItem(item) {
            const q = item.querySelector('.faq-question');
            const a = item.querySelector('.faq-answer');
            if (!q || !a) return;
            item.classList.remove('active');
            q.setAttribute('aria-expanded', 'false');
            a.style.maxHeight = '0';
        }
    }

    // Contact form handling
    function initializeContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        const successMessage = document.getElementById('successMessage');
        const submitBtn = contactForm.querySelector('.submit-btn');

        if (successMessage) successMessage.style.display = 'none';

        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => validateField(input));
            input.addEventListener('blur', () => validateField(input));
        });
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) isValid = false;
            });
            
            if (!isValid) {
                showNotification('Please fix the errors in the form.', 'error');
                return;
            }
            
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }
            
            try {
                await submitContactForm(contactForm);
                contactForm.style.display = 'none';
                if (successMessage) {
                    successMessage.style.display = 'block';
                    successMessage.classList.add('show');
                }
                showNotification('Message sent successfully!', 'success');
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('Sorry, there was an error. Please try again.', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
            }
        });
        
        async function submitContactForm(form) {
            const formData = new FormData(form);
            const params = new URLSearchParams();
            params.append('name', formData.get('name') || '');
            params.append('email', formData.get('email') || '');
            params.append('subject', formData.get('subject') || '');
            params.append('message', formData.get('message') || '');
            params.append('_subject', 'New Contact Form Submission - FociStore');
            params.append('_template', 'table');
            params.append('_captcha', 'false');

            const response = await fetch(CONFIG.API_ENDPOINTS.CONTACT_FORM, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
                body: params.toString()
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data.success !== 'true' && data.success !== true) throw new Error('Form submission failed');
            return data;
        }
    }

    // Field validation
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        let isValid = true;
        let errorMessage = '';
        
        let errorContainer = field.parentNode.querySelector('.field-error');
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'field-error';
            field.parentNode.appendChild(errorContainer);
        }
        
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (value) {
            switch (fieldName) {
                case 'name':
                    if (value.length < 2) { isValid = false; errorMessage = 'Name must be at least 2 characters'; }
                    break;
                case 'email':
                    if (!isValidEmail(value)) { isValid = false; errorMessage = 'Please enter a valid email'; }
                    break;
                case 'subject':
                    if (value.length < 5) { isValid = false; errorMessage = 'Subject must be at least 5 characters'; }
                    break;
                case 'message':
                    if (value.length < 10) { isValid = false; errorMessage = 'Message must be at least 10 characters'; }
                    break;
            }
        }
        
        if (!isValid) {
            field.classList.add('error');
            errorContainer.textContent = errorMessage;
        } else {
            field.classList.remove('error');
            errorContainer.textContent = '';
        }
        return isValid;
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Navigation initialization
    function initializeNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('nav a[href]');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            if ((currentPage === '' || currentPage === 'index.html') && linkHref === 'index.html') {
                link.classList.add('active');
            } else if (linkHref !== 'index.html' && currentPage === linkHref) {
                link.classList.add('active');
            }
        });
    }

    // Page transitions
    function initializePageTransitions() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    }

    // Navigation scroll
    function initializeNavScroll() {
        const nav = document.querySelector('nav ul');
        if (!nav) return;
        const navContainer = document.querySelector('nav');
        if (!navContainer) return;

        let leftBtn = navContainer.querySelector('.nav-scroll-left');
        let rightBtn = navContainer.querySelector('.nav-scroll-right');

        if (!leftBtn) {
            leftBtn = document.createElement('button');
            leftBtn.className = 'nav-scroll-indicator nav-scroll-left';
            leftBtn.innerHTML = '‹';
            leftBtn.setAttribute('aria-label', 'Scroll left');
            navContainer.appendChild(leftBtn);
        }
        if (!rightBtn) {
            rightBtn = document.createElement('button');
            rightBtn.className = 'nav-scroll-indicator nav-scroll-right';
            rightBtn.innerHTML = '›';
            rightBtn.setAttribute('aria-label', 'Scroll right');
            navContainer.appendChild(rightBtn);
        }

        navContainer.style.position = 'relative';
        
        leftBtn.addEventListener('click', () => nav.scrollBy({ left: -200, behavior: 'smooth' }));
        rightBtn.addEventListener('click', () => nav.scrollBy({ left: 200, behavior: 'smooth' }));
        
        function updateScrollButtons() {
            const scrollLeft = nav.scrollLeft;
            const maxScrollLeft = nav.scrollWidth - nav.clientWidth;
            leftBtn.classList.toggle('visible', scrollLeft > 1);
            rightBtn.classList.toggle('visible', scrollLeft < maxScrollLeft - 1);
        }
        
        nav.addEventListener('scroll', debounce(updateScrollButtons, 100));
        window.addEventListener('resize', debounce(updateScrollButtons, 100));
        setTimeout(updateScrollButtons, 100);
    }

    // Ripple effects
    function initializeRippleEffects() {
        document.addEventListener('click', function(e) {
            const button = e.target.closest('.cta-button, .download-btn, .btn-download, .submit-btn, .btn-details, .catalog-link, .page-btn, .cancel-btn, .btn-confirm-cancel, .btn-resume-cancel');
            if (button) createRippleEffect(e, button);
        });
    }

    function createRippleEffect(event, button) {
        const buttonStyles = window.getComputedStyle(button);
        if (buttonStyles.position === 'static') button.style.position = 'relative';
        if (buttonStyles.overflow !== 'hidden') button.style.overflow = 'hidden';

        const ripple = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        ripple.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        ripple.classList.add('ripple-effect');
        
        const existingRipple = button.querySelector('.ripple-effect');
        if (existingRipple) existingRipple.remove();
        
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    // Details button
    function initializeDetailsButtons() {
        document.addEventListener('click', function(e) {
            if (e.target.matches('.btn-details')) {
                const card = e.target.closest('.app-card, .game-card');
                const appName = card?.querySelector('h3')?.textContent || 'Application';
                showNotification(`Details for ${appName} would be displayed here.`, 'info');
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

    // Lazy loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '0px 0px 100px 0px' }); 

        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
        state.observers.push(imageObserver);
    }

    // Error handling for images
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            if (e.target.src.includes('placehold.co')) return; 
            e.target.src = 'https://placehold.co/300x200/667eea/ffffff?text=Image+Not+Found';
            e.target.alt = 'Image not available';
        }
    }, true);

    // Page visibility
    document.addEventListener('visibilitychange', function() {
        document.body.classList.toggle('page-hidden', document.hidden);
    });

    // Add CSS for page visibility state ONLY
    const style = document.createElement('style');
    style.textContent = `
        .page-hidden .pulse,
        .page-hidden .bounce,
        .page-hidden .float,
        .page-hidden .animated-gradient,
        .page-hidden .progress-animated {
            animation-play-state: paused;
        }
        
        /* Popular Categories Styles */
        .popular-categories {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        
        .category-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            border: 1px solid #e2e8f0;
        }
        
        .category-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .category-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .category-card h4 {
            margin: 0.5rem 0;
            color: #2d3748;
            font-size: 1.1rem;
        }
        
        .category-card p {
            color: #718096;
            margin: 0.5rem 0;
            font-size: 0.9rem;
        }
        
        .category-stats {
            margin: 0.5rem 0;
        }
        
        .category-rating {
            background: #f7fafc;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            color: #4a5568;
        }
        
        .category-explore {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 0.5rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 0.5rem;
            font-size: 0.9rem;
        }
        
        .category-explore:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
    `;
    document.head.appendChild(style);

})(); // End of IIFE