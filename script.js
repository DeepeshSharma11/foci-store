// Wrap all code in an IIFE (Immediately Invoked Function Expression)
(function() {

    // "Global" state for the page (within the IIFE)
    const state = {
        allData: [], // Will hold apps OR games, depending on the page
        filteredData: [],
        currentPage: 1,
        itemsPerPage: 8, // Using your new value
        pageType: 'apps', // Default page type
    };

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeAllFeatures();
    });

    // Initialize all features
    function initializeAllFeatures() {
        // This function now correctly determines the page and loads data *first*
        initializePageSpecificFeatures();

        // These are all general and can run after
        initializeAnimations();
        initializeDownloadSystem(); // CRITICAL: Bug fixed
        initializeScrollEffects();
        initializeCounters();
        initializeContactForm();
        initializeNavigation();
        initializeFAQ();
        initializePageTransitions();
        initializeNavScroll();
        initializeRippleEffects();
        initializeDetailsButtons();
        initializeModalSystem(); // CRITICAL: Bug fixed
        // initializeLazyLoading(); // <-- REMOVED Lazy Loading Call
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
        }

        // Set the correct data in the state
        if (pageType === 'apps') {
            state.allData = allApps;
        } else if (pageType === 'games') {
            state.allData = allGames;
        } else if (pageType === 'featured') {
            populateFeaturedApps(allApps); // Special case for homepage
            return; // Don't need to do the rest
        }

        state.filteredData = state.allData;

        // Once data is loaded, populate categories
        populateCategories();

        // --- NEW: Apply filters from URL parameters ---
        applyUrlFilters();
        // --- END NEW ---

        // Render the grid with potentially pre-filtered data
        applyFiltersAndRender();
    }

     // --- NEW FUNCTION to apply filters from URL ---
    function applyUrlFilters() {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        const categoryFilter = document.getElementById('categoryFilter');

        if (categoryParam && categoryFilter) {
            // Check if the category exists in the dropdown options
            const optionExists = Array.from(categoryFilter.options).some(option => option.value === categoryParam);
            if (optionExists) {
                categoryFilter.value = categoryParam;
                console.log(`Set category filter from URL: ${categoryParam}`);
                // No need to call applyFiltersAndRender here, it's called right after in loadData
            } else {
                 console.warn(`Category "${categoryParam}" from URL not found in filter options.`);
            }
        }
     }
     // --- END NEW FUNCTION ---


    // Fallback static data (UPDATED with user's JSON)
    function loadStaticData() {
        const staticApps = [
            {
                "id": 1,
                "name": "WhatsApp MOD",
                "description": "Enhanced version with extra features like theme customization, privacy options, and more",
                "category": "social",
                "image": "assets/images/fmwhatsapp.png",
                "size": "95 MB",
                "version": "v2.23.5.76",
                "rating": 4.7,
                "popularity": 95,
                "releaseDate": "2024-10-20T00:00:00Z",
                "downloads": "10K+",
                "downloadUrl": "https://getkukuymun.site/url/2A8QZ54HRrD",
                "badge": "Trending"
            },
            {
                "id": 2,
                "name": "Instagram MOD",
                "description": "Download photos, videos, stories with enhanced privacy and customization options.",
                "category": "social",
                "image": "assets/images/Insta-Pro-APK.png",
                "size": "143 MB",
                "version": "v289.0.0.18.109",
                "rating": 4.7,
                "popularity": 92,
                "releaseDate": "2024-10-19T00:00:00Z",
                "downloads": "8K+",
                "downloadUrl": "https://getkukuymun.site/url/2A8QZ54HRrD",
                "badge": "New"
            },
            {
                "id": 3,
                "name": "YouTube MOD",
                "description": "Ad-free YouTube experience with background play and video download capabilities.",
                "category": "media",
                "image": "assets/images/app.revanced.android.youtube.200.png", // Updated image name
                "size": "85 MB",
                "version": "v18.45.43",
                "rating": 4.8,
                "popularity": 98,
                "releaseDate": "2024-10-22T00:00:00Z",
                "downloads": "15K+",
                "downloadUrl": "https://vanced.to/",
                "badge": "Popular"
            },
            {
                "id": 4,
                "name": "File Manager MOD",
                "description": "Advanced file management with root access, cloud integration, and premium themes.",
                "category": "tools",
                "image": "assets/images/video-player-all-format-1 mobile.png", // Updated image name
                "size": "8 MB",
                "version": "v4.2.1",
                "rating": 4.8,
                "popularity": 80,
                "releaseDate": "2024-10-18T00:00:00Z",
                "downloads": "5K+",
                "downloadUrl": "https://liteapks.com/download/file-manager-77834",
                "badge": "Pro"
            },
            {
                "id": 5,
                "name": "XPlayer",
                "description": "XPlayer Mod APK is an impressive video player tool and gives you the best experience.", // Updated description
                "category": "media",
                "image": "assets/images/xplayer.png",
                "size": "38 MB",
                "version": "v2.4.8.2",
                "rating": 4.5,
                "popularity": 82,
                "releaseDate": "2024-10-17T00:00:00Z",
                "downloads": "7K+",
                "downloadUrl": "https://liteapks.com/download/xplayer-5858",
                "badge": "Enhanced"
            },
            {
                "id": 6,
                "name": "Office Suite MOD",
                "description": "Complete office suite with PDF editing, cloud sync, and all premium features unlocked.",
                "category": "productivity",
                "image": "assets/images/office-suite.png",
                "size": "120 MB",
                "version": "v14.8.4",
                "rating": 4.7,
                "popularity": 85,
                "releaseDate": "2024-10-16T00:00:00Z",
                "downloads": "6K+",
                "downloadUrl": "#",
                "badge": "Premium"
            },
            {
                "id": 7,
                "name": "TikTok MOD",
                "description": "Download videos without watermark, unlimited features and enhanced privacy options.",
                "category": "social",
                "image": "assets/images/tiktok-mod.png",
                "size": "120 MB",
                "version": "v30.5.4",
                "rating": 4.6,
                "popularity": 96,
                "releaseDate": "2024-10-21T00:00:00Z",
                "downloads": "15K+",
                "downloadUrl": "https://example.com/tiktok",
                "badge": "Popular"
            },
            {
                "id": 8,
                "name": "Spotify MOD",
                "description": "Ad-free music, unlimited skips, and premium features unlocked.",
                "category": "media",
                "image": "assets/images/spotify-mod.png",
                "size": "85 MB",
                "version": "v8.8.96",
                "rating": 4.9,
                "popularity": 99,
                "releaseDate": "2024-10-23T00:00:00Z",
                "downloads": "20K+",
                "downloadUrl": "https://example.com/spotify",
                "badge": "Premium"
            },
            {
                "id": 9,
                "name": "Snapchat MOD",
                "description": "Save snaps, view stories anonymously, and access premium filters.",
                "category": "social",
                "image": "assets/images/snapchat-mod.png",
                "size": "95 MB",
                "version": "v12.1.0.30",
                "rating": 4.5,
                "popularity": 90,
                "releaseDate": "2024-10-15T00:00:00Z",
                "downloads": "9K+",
                "downloadUrl": "#",
                "badge": "New"
            }
        ];

        const staticGames = [
            {
                "id": 1,
                "name": "Subway Surfers MOD",
                "description": "Unlimited coins, keys, and all characters unlocked. Run endlessly without restrictions.",
                "category": "action",
                "image": "assets/images/subway-surfers.png",
                "size": "150 MB",
                "version": "v3.12.1",
                "rating": 4.8,
                "popularity": 98,
                "releaseDate": "2024-10-23T00:00:00Z",
                "downloads": "25K+",
                "downloadUrl": "https://an1.com/file_4683-dw.html",
                "badge": "Unlimited"
            },
            {
                "id": 2,
                "name": "Asphalt 9 MOD",
                "description": "Unlimited credits, all cars unlocked, and premium features for the ultimate racing experience.",
                "category": "racing",
                "image": "assets/images/asphalt-9.png",
                "size": "2.1 GB",
                "version": "v3.9.4",
                "rating": 4.9,
                "popularity": 95,
                "releaseDate": "2024-10-22T00:00:00Z",
                "downloads": "12K+",
                "downloadUrl": "https://asphalt-9-legends-mod.apkresult.io/download",
                "badge": "Premium"
            },
            {
                "id": 3,
                "name": "Candy Crush MOD",
                "description": "Unlimited lives, boosters, and all levels unlocked. Sweet gaming without limits.",
                "category": "puzzle",
                "image": "assets/images/candy-crush.png",
                "size": "95 MB",
                "version": "v1.260.1.2",
                "rating": 4.7,
                "popularity": 90,
                "releaseDate": "2024-10-21T00:00:00Z",
                "downloads": "18K+",
                "downloadUrl": "https://candy-crush-soda-saga.apkrabi.com/download/",
                "badge": "Unlimited"
            },
            {
                "id": 4,
                "name": "Minecraft MOD",
                "description": "Unlocked skins, texture packs, and premium features for unlimited creativity.",
                "category": "adventure",
                "image": "assets/images/minecraft.png",
                "size": "180 MB",
                "version": "v1.20.15.01",
                "rating": 4.9,
                "popularity": 96,
                "releaseDate": "2024-10-20T00:00:00Z",
                "downloads": "15K+",
                "downloadUrl": "#",
                "badge": "Premium"
            },
            {
                "id": 5,
                "name": "FIFA Mobile MOD",
                "description": "Unlimited coins, all players unlocked, and premium features for the ultimate football experience.",
                "category": "sports",
                "image": "assets/images/fifa-mobile.png",
                "size": "1.2 GB",
                "version": "v17.0.14",
                "rating": 4.8,
                "popularity": 88,
                "releaseDate": "2024-10-19T00:00:00Z",
                "downloads": "10K+",
                "downloadUrl": "#",
                "badge": "Enhanced"
            },
            {
                "id": 6,
                "name": "Call of Duty MOD",
                "description": "Unlimited CP, all weapons unlocked, and premium battle pass for ultimate warfare.",
                "category": "action",
                "image": "assets/images/call-of-duty.png",
                "size": "2.5 GB",
                "version": "v1.0.39",
                "rating": 4.9,
                "popularity": 97,
                "releaseDate": "2024-10-18T00:00:00Z",
                "downloads": "20K+",
                "downloadUrl": "#",
                "badge": "Pro"
            },
            {
                "id": 7,
                "name": "Temple Run 2 MOD",
                "description": "Unlimited coins, all characters unlocked, and infinite energy for endless running.",
                "category": "adventure",
                "image": "assets/images/temple-run.png",
                "size": "80 MB",
                "version": "v1.100.0",
                "rating": 4.6,
                "popularity": 85,
                "releaseDate": "2024-10-17T00:00:00Z",
                "downloads": "8K+",
                "downloadUrl": "#",
                "badge": "Unlimited"
            },
            {
                "id": 8,
                "name": "PUBG Mobile MOD",
                "description": "Unlimited UC, aim assist, and all skins unlocked for battle royale dominance.",
                "category": "action",
                "image": "assets/images/pubg-mobile.png",
                "size": "1.8 GB",
                "version": "v3.0.0",
                "rating": 4.9,
                "popularity": 100,
                "releaseDate": "2024-10-24T00:00:00Z",
                "downloads": "30K+",
                "downloadUrl": "#",
                "badge": "Pro"
            },
            {
                "id": 9,
                "name": "Clash of Clans MOD",
                "description": "Unlimited gems, gold, and elixir with all troops and buildings unlocked for epic battles.",
                "category": "strategy",
                "image": "assets/images/clash-of-clans.png",
                "size": "150 MB",
                "version": "v14.0.10",
                "rating": 4.8,
                "popularity": 93,
                "releaseDate": "2024-10-25T00:00:00Z",
                "downloads": "22K+",
                "downloadUrl": "#",
                "badge": "Enhanced"
            }
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
    }

    /**
     * Populates featured apps on homepage (from your new code)
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
     * This function is for *filter changes*, so it resets the page to 1.
     */
    function applyFiltersAndRender(resetPage = true) {
        const category = document.getElementById('categoryFilter')?.value || 'all';
        const sort = document.getElementById('sortFilter')?.value || 'popular';
        const search = document.getElementById('searchInput')?.value.toLowerCase() || '';

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
                // Sort by releaseDate if available, otherwise keep original order
                if (result.length > 0 && result[0].releaseDate) {
                    result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                }
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'popular':
            default:
                // Sort by popularity, falling back to rating if popularity is missing
                result.sort((a, b) => (b.popularity || b.rating * 10 || 0) - (a.popularity || a.rating * 10 || 0));
                break;
        }


        state.filteredData = result;
        if(resetPage) {
             state.currentPage = 1; // Reset to first page after filtering
        }

        // Show notification only on explicit search
        // if (search.length > 0 && resetPage) { // Only show on new search/filter action
        //     showNotification(`Found ${result.length} results`, 'info');
        // }

        renderGrid();
        renderPagination();
    }

    /**
     * Renders the grid of app/game cards for the *current page*
     */
    function renderGrid() {
        const grid = document.querySelector(state.pageType === 'games' ? '.games-grid' : '.apps-grid');
        if (!grid) return;

        // Add loading state visually
        grid.innerHTML = `<div class="loading-message" id="loadingMessage">
                            <div class="loading-spinner"></div>
                            <p>Loading ${state.pageType}...</p>
                          </div>`;

        // Slight delay to allow loading spinner to show
        setTimeout(() => {
             // Remove loading message
            const loadingMessage = document.getElementById('loadingMessage');
            if (loadingMessage) {
                loadingMessage.remove();
            } else {
                 grid.innerHTML = ''; // Clear anyway if message not found
            }


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

             // Check if page has no items (e.g., navigating past the last page somehow)
            if(pageData.length === 0 && state.currentPage > 1) {
                // Go back to the last valid page
                state.currentPage = Math.ceil(state.filteredData.length / state.itemsPerPage);
                renderGrid(); // Re-render with the correct page
                renderPagination();
                return;
            }


            // Create and append app cards
            pageData.forEach((item, index) => {
                const card = (state.pageType === 'games') ? createGameCard(item, index) : createAppCard(item, index);
                grid.appendChild(card);
            });

            // Re-initialize animations for new elements
            if (typeof AOS !== 'undefined') {
                AOS.refreshHard(); // Use refreshHard for dynamically added content
            } else {
                initializeAnimations(); // Fallback to re-running observer
            }
         }, 50); // Small delay
    }

    /**
     * Renders the pagination buttons
     * This is based on your new, more advanced logic
     */
    function renderPagination() {
        let paginationContainer = document.getElementById('pagination'); // Use the specific ID
        if (!paginationContainer) {
            console.warn("Pagination container with ID 'pagination' not found.");
            // Fallback to class if ID not found (though ID is better)
            paginationContainer = document.querySelector('.pagination');
            if(!paginationContainer) return;
        }

        const totalItems = state.filteredData.length;
        const totalPages = Math.ceil(totalItems / state.itemsPerPage);

        // Add loading class while rendering
        paginationContainer.classList.add('loading');

        paginationContainer.innerHTML = ''; // Clear previous buttons

        if (totalPages <= 1) {
            paginationContainer.style.display = 'none'; // Hide if only one page or less
            paginationContainer.classList.remove('loading');
            return;
        }

        paginationContainer.style.display = 'flex'; // Ensure it's visible

        // Previous button
        const prevBtn = createPageButton('‹ Previous', state.currentPage > 1 ? state.currentPage - 1 : null);
        if (state.currentPage === 1) {
             prevBtn.disabled = true;
        }
        paginationContainer.appendChild(prevBtn);


        // Page numbers logic
        const maxVisiblePages = 5; // Total buttons including ellipsis potentially
        const halfVisible = Math.floor((maxVisiblePages - 2) / 2); // Buttons around current page

        let startPage = 1;
        let endPage = totalPages;

        let showStartEllipsis = false;
        let showEndEllipsis = false;

        if (totalPages > maxVisiblePages) {
            if (state.currentPage <= halfVisible + 1) {
                // Near the start
                endPage = maxVisiblePages - 1;
                showEndEllipsis = true;
            } else if (state.currentPage >= totalPages - halfVisible) {
                // Near the end
                startPage = totalPages - (maxVisiblePages - 2);
                showStartEllipsis = true;
            } else {
                // In the middle
                startPage = state.currentPage - halfVisible;
                endPage = state.currentPage + halfVisible;
                showStartEllipsis = true;
                showEndEllipsis = true;
            }
        }


         // Always show page 1
        paginationContainer.appendChild(createPageButton(1, 1));

        // Start ellipsis
        if (showStartEllipsis) {
            paginationContainer.appendChild(createPageDots());
        }

        // Middle page numbers
         for (let i = startPage; i <= endPage; i++) {
             if (i > 1 && i < totalPages) { // Don't repeat page 1 or last page
                paginationContainer.appendChild(createPageButton(i, i));
            }
        }

        // End ellipsis
        if (showEndEllipsis) {
            paginationContainer.appendChild(createPageDots());
        }

         // Always show last page if more than 1 page
        if (totalPages > 1) {
            paginationContainer.appendChild(createPageButton(totalPages, totalPages));
        }

        // Next button
        const nextBtn = createPageButton('Next ›', state.currentPage < totalPages ? state.currentPage + 1 : null);
        nextBtn.classList.add('next');
         if (state.currentPage === totalPages) {
             nextBtn.disabled = true;
        }
        paginationContainer.appendChild(nextBtn);

        // Remove loading class after rendering
        paginationContainer.classList.remove('loading');
    }

    // Helper for pagination - Creates button OR returns existing if pageNum matches
    function createPageButton(text, pageNum) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-btn';
        pageBtn.textContent = text;

        if (pageNum !== null) {
            pageBtn.dataset.page = pageNum; // Store page number in data attribute
            if (pageNum === state.currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.addEventListener('click', (e) => {
                 // Prevent re-rendering if clicking the active page
                if (e.target.classList.contains('active') || e.target.disabled) return;

                 state.currentPage = pageNum;
                 renderGrid(); // Only render grid + pagination
                 renderPagination();
                 // Scroll to top of grid smoothly
                 const gridElement = document.querySelector('.apps-grid, .games-grid');
                 if(gridElement) {
                     gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                 }
            });
        } else {
            // This is for Prev/Next text buttons without a direct page number link initially
            pageBtn.disabled = true; // Disabled unless pageNum provided later
        }

        return pageBtn;
    }


    // Helper for pagination dots
    function createPageDots() {
         const dots = document.createElement('span');
         dots.className = 'page-dots';
         dots.textContent = '...';
         return dots;
    }

    // Create app card HTML (from your new code)
    function createAppCard(app, index) {
        const card = document.createElement('div');
        card.className = 'app-card card-hover'; // Added card-hover
        card.setAttribute('data-aos', 'zoom-in');
        // Calculate delay based on index within the current page view
        const delay = (index % state.itemsPerPage) * 50; // Smaller delay
        card.setAttribute('data-aos-delay', delay.toString());
        card.setAttribute('data-category', app.category);

        card.innerHTML = `
            <div class="card-image">
                <img src="${app.image}" alt="${app.name}" onerror="this.onerror=null; this.src='https://placehold.co/300x200/667eea/ffffff?text=App+Image'">
                ${app.badge ? `<div class="card-badge">${app.badge}</div>` : ''}
            </div>
            <div class="card-content">
                <h3>${app.name}</h3>
                <p>${app.description}</p>
                <div class="card-meta">
                    ${app.size ? `<span class="app-size">${app.size}</span>` : ''}
                    ${app.version ? `<span class="app-version">${app.version}</span>` : ''}
                    ${app.rating ? `<span class="app-rating">⭐ ${app.rating}</span>` : ''}
                </div>
                <div class="card-actions">
                    <button class="btn-download btn-animate" data-name="${app.name}" data-url="${app.downloadUrl}">Download</button>
                    <button class="btn-details btn-animate" data-name="${app.name}">Details</button>
                </div>
            </div>
        `;
        return card;
    }

    // Create game card HTML (from your new code)
    function createGameCard(game, index) {
        const card = document.createElement('div');
        card.className = 'game-card card-hover'; // Added card-hover
        card.setAttribute('data-aos', 'zoom-in');
        // Calculate delay based on index within the current page view
        const delay = (index % state.itemsPerPage) * 50; // Smaller delay
        card.setAttribute('data-aos-delay', delay.toString());
        card.setAttribute('data-category', game.category);

        card.innerHTML = `
            <div class="card-image">
                <img src="${game.image}" alt="${game.name}" onerror="this.onerror=null; this.src='https://placehold.co/300x200/667eea/ffffff?text=Game+Image'">
                 ${game.badge ? `<div class="card-badge">${game.badge}</div>` : ''}
            </div>
            <div class="card-content">
                <h3>${game.name}</h3>
                <p>${game.description}</p>
                <div class="card-meta">
                    ${game.size ? `<span class="app-size">${game.size}</span>` : ''}
                    ${game.version ? `<span class="app-version">${game.version}</span>` : ''}
                    ${game.rating ? `<span class="app-rating">⭐ ${game.rating}</span>` : ''}
                </div>
                <div class="card-actions">
                    <button class="btn-download btn-animate" data-name="${game.name}" data-url="${game.downloadUrl}">Download</button>
                    <button class="btn-details btn-animate" data-name="${game.name}">Details</button>
                </div>
            </div>
        `;
        return card;
    }

    // Create featured item HTML (from your new code)
    function createFeaturedItem(app, index) {
        const item = document.createElement('div');
        item.className = 'featured-item card-hover'; // Added card-hover
        item.setAttribute('data-aos', 'zoom-in');
        item.setAttribute('data-aos-delay', ((index + 1) * 100).toString());

        item.innerHTML = `
            <div class="featured-image">
                <img src="${app.image}" alt="${app.name}" onerror="this.onerror=null; this.src='https://placehold.co/300x200/667eea/ffffff?text=Featured+App'">
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

    // --- ORIGINAL/UTILITY FUNCTIONS ---

    // AOS (Animate On Scroll) initialization
    function initializeAnimations() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 600, // Default duration
                once: true, // Only animate once
                offset: 50, // Trigger animations a bit sooner
            });
        } else {
             console.warn("AOS library not found. Falling back to basic Intersection Observer.");
             // Fallback Observer (Simplified)
            const needsScrollAnimations = document.querySelectorAll('[data-aos]');
            if (needsScrollAnimations.length === 0) return;

            const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        element.classList.add('aos-animate'); // Use AOS class for compatibility
                        const delay = element.getAttribute('data-aos-delay') || 0;
                        element.style.transitionDelay = `${delay}ms`;
                        obs.unobserve(element);
                    }
                });
            }, observerOptions);
            needsScrollAnimations.forEach(el => observer.observe(el));
        }
    }


    // Hero section animations for homepage
    function initializeHeroAnimations() {
        // Using AOS data attributes now, JS might not be needed
        // const heroContent = document.querySelector('.hero-content');
        // const heroGraphic = document.querySelector('.hero-graphic');
        // if (heroContent) heroContent.classList.add('slide-in-left'); // Or use data-aos="fade-right"
        // if (heroGraphic) heroGraphic.classList.add('slide-in-right'); // Or use data-aos="fade-left"
    }

    // Team animations for about page
    function initializeTeamAnimations() {
        // Can use AOS data attributes + delays on team cards and social links
        // Example: <div class="team-card" data-aos="fade-up" data-aos-delay="100">
    }

    // Contact page animations
    function initializeContactAnimations() {
       // Can use AOS data attributes + delays on contact methods and form groups
    }

    // Legal page initialization
    function initializeLegalPage() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                try {
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                } catch (error) {
                     console.error("Error finding or scrolling to anchor:", error);
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
                debounce(applyFiltersAndRender, 300)(true); // Pass true to reset page
            });
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', () => {
                debounce(applyFiltersAndRender, 300)(true); // Pass true to reset page
            });
        }
    }

    // Advanced filters for apps/games pages
    function initializeAdvancedFilters() {
        // const filterControls = document.querySelector('.filter-controls');
        // if (filterControls) filterControls.classList.add('slide-in-top'); // Use data-aos="fade-down" instead
    }

    // Enhanced search functionality
    function initializeSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');

        if (searchInput && searchButton) {
            searchButton.addEventListener('click', () => applyFiltersAndRender(true)); // Pass true to reset page
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') applyFiltersAndRender(true); // Pass true to reset page
            });
            // Real-time search with debounce
            searchInput.addEventListener('input', debounce(() => applyFiltersAndRender(true), 500)); // Pass true
        }
    }


    // Download functionality with CRITICAL `confirm()` FIX
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
                console.error("Download modal (#downloadModal) not found in the HTML.");
                showNotification('Error: Download interface missing.', 'error');
                // modal = createDownloadModal(); // Fallback creation removed, rely on HTML
                return;
            }

            const appNameSpan = modal.querySelector('#appName');
            const progressBar = modal.querySelector('.progress');
            const progressText = modal.querySelector('.progress-text');
            const confirmView = modal.querySelector('.modal-confirm-cancel');
            const mainContentView = modal.querySelector('.modal-main-content'); // Assuming main content area needs hiding


            if (appNameSpan) appNameSpan.textContent = appName;

            // Ensure confirm view is hidden and main view is visible initially
            if (confirmView) confirmView.style.display = 'none';
            if (mainContentView) mainContentView.style.display = 'block'; // Or 'flex' etc.

            let downloadProgress = 0;
            if (progressBar) progressBar.style.width = '0%';
            if (progressText) progressText.textContent = 'Preparing download...';

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            downloadInProgress = true;
            progressInterval = setInterval(() => {
                downloadProgress += Math.random() * 15 + 5; // Slightly faster progress
                if (downloadProgress > 100) downloadProgress = 100;
                updateProgress(downloadProgress, progressBar, progressText, downloadUrl, modal);
            }, 300); // Slower interval

            trackDownload(appName);
        }

        function updateProgress(progress, progressBar, progressText, downloadUrl, modal) {
            if (progressBar) progressBar.style.width = progress + '%';

            if (progress < 30) {
                if (progressText) progressText.textContent = 'Preparing download...';
            } else if (progress < 70) {
                if (progressText) progressText.textContent = `Downloading... ${Math.floor(progress)}%`;
            } else if (progress < 100) {
                if (progressText) progressText.textContent = 'Finalizing...';
            } else {
                clearInterval(progressInterval);
                 if (progressText) progressText.textContent = 'Download complete!';
                 if (progressBar) progressBar.style.width = '100%'; // Ensure it visually completes

                setTimeout(() => {
                    if (modal) modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    downloadInProgress = false;

                    if (downloadUrl && downloadUrl !== '#') {
                         // Simulate download trigger for files not directly linked (like #)
                        if (downloadUrl === '#') {
                             showNotification('Download simulation complete (no URL provided).', 'info');
                        } else {
                            // Create a temporary link and click it
                            const tempLink = document.createElement('a');
                            tempLink.href = downloadUrl;
                            tempLink.setAttribute('download', ''); // Optional: Suggests a filename if possible
                            tempLink.setAttribute('target', '_blank'); // Open in new tab/window
                            document.body.appendChild(tempLink);
                            tempLink.click();
                            document.body.removeChild(tempLink);
                            showNotification('Download started!', 'success');
                         }
                    } else {
                         showNotification('No download URL specified.', 'warning');
                    }
                }, 1200); // Slightly longer delay
            }
        }


        function closeModal(modal) {
            if (!modal) return;
            const confirmView = modal.querySelector('.modal-confirm-cancel');
            const mainContentView = modal.querySelector('.modal-main-content');

            if (downloadInProgress) {
                 if (confirmView) {
                     confirmView.style.display = 'flex'; // Show confirm dialog
                     if(mainContentView) mainContentView.style.display = 'none'; // Hide main content
                 } else {
                     // Fallback if confirm view doesn't exist (should not happen with correct HTML)
                     console.warn("Cancel confirmation view not found.");
                     // Simple close without confirm - potential to interrupt download
                     // clearInterval(progressInterval);
                     // modal.style.display = 'none';
                     // document.body.style.overflow = 'auto';
                     // downloadInProgress = false;
                 }
            } else {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                 if (confirmView) confirmView.style.display = 'none'; // Ensure confirm is hidden
                 if (mainContentView) mainContentView.style.display = 'block'; // Ensure main content is visible next time

            }
        }

        function addModalListeners(modal) {
            if (!modal) return;
            const confirmView = modal.querySelector('.modal-confirm-cancel');
            const mainContentView = modal.querySelector('.modal-main-content');

            // Close button (top right X)
            modal.querySelector('.close')?.addEventListener('click', () => closeModal(modal));

            // Initial "Cancel" button
            modal.querySelector('#cancelDownload')?.addEventListener('click', () => closeModal(modal));

            // "Yes, Cancel" button inside confirm dialog
            modal.querySelector('#confirmCancel')?.addEventListener('click', () => {
                clearInterval(progressInterval);
                if (modal) modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                downloadInProgress = false;
                if (confirmView) confirmView.style.display = 'none'; // Hide confirm view
                if (mainContentView) mainContentView.style.display = 'block'; // Show main view for next time
                showNotification('Download cancelled.', 'info');
            });

            // "No, Resume" button inside confirm dialog
            modal.querySelector('#resumeDownload')?.addEventListener('click', () => {
                if (confirmView) confirmView.style.display = 'none'; // Hide confirm view
                 if (mainContentView) mainContentView.style.display = 'block'; // Show main view again

            });
        }

        // Add listeners to the modal *if it exists in the HTML* on load
        addModalListeners(document.getElementById('downloadModal'));

        function trackDownload(appName) {
            // Placeholder for analytics
            console.log(`Download started: ${appName}`);
            // Example: if (typeof gtag === 'function') { gtag('event', 'download', {'app_name': appName}); }
        }
    }


    // Scroll effects
    function initializeScrollEffects() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;
        let ticking = false;

        if (header) {
            window.addEventListener('scroll', function() {
                const currentScrollY = window.scrollY;
                if (!ticking) {
                    window.requestAnimationFrame(function() {
                        if (currentScrollY > 100) {
                            header.classList.add('scrolled');
                            // Add compact based on scrolling down past a threshold
                            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                                header.classList.add('compact');
                            } else if (currentScrollY < lastScrollY || currentScrollY <= 200) {
                                // Remove compact if scrolling up or near the top
                                header.classList.remove('compact');
                            }
                        } else {
                            header.classList.remove('scrolled', 'compact');
                        }
                        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY; // Update last scroll position
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }
    }


    // Counter animations
    function initializeCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]'); // Only select those with data-count
        if (counters.length === 0) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.count, 10);
                    const duration = 2000; // ms
                    let startTime = null;

                    const animateCount = (timestamp) => {
                        if (!startTime) startTime = timestamp;
                        const progress = Math.min((timestamp - startTime) / duration, 1);
                        const currentVal = Math.floor(progress * target);
                        counter.textContent = currentVal.toLocaleString(); // Format with commas

                        if (progress < 1) {
                            requestAnimationFrame(animateCount);
                        } else {
                            counter.textContent = target.toLocaleString(); // Ensure final value is exact
                        }
                    };

                    requestAnimationFrame(animateCount);
                    obs.unobserve(counter); // Animate only once
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% visible

        counters.forEach(counter => {
             // Initialize text content to 0 before observing
            counter.textContent = '0';
            observer.observe(counter);
        });
    }

    // FAQ functionality
    function initializeFAQ() {
        const faqList = document.querySelector('.faq-list');
        if (!faqList) return;

        // Use event delegation on the list container
        faqList.addEventListener('click', (e) => {
             const question = e.target.closest('.faq-question');
             if (!question) return; // Clicked outside a question

             const faqItem = question.closest('.faq-item');
             if (!faqItem) return;

             const answer = faqItem.querySelector('.faq-answer');
             if (!answer) return;

             const isActive = faqItem.classList.contains('active');

             // Close all other items first (optional, for accordion style)
             faqList.querySelectorAll('.faq-item.active').forEach(item => {
                 if (item !== faqItem) {
                     closeFAQItem(item);
                 }
             });

             // Toggle current item
             if (!isActive) {
                 openFAQItem(faqItem);
             } else {
                 closeFAQItem(faqItem);
             }
        });

        // Add keyboard support using delegation as well
         faqList.addEventListener('keydown', (e) => {
             const question = e.target.closest('.faq-question');
             if (!question) return;

             if (e.key === 'Enter' || e.key === ' ') {
                 e.preventDefault();
                 question.click(); // Trigger the click handler
             }
         });


        function setupFAQItem(item) {
             const question = item.querySelector('.faq-question');
             const answer = item.querySelector('.faq-answer');

             if (question && answer) {
                 question.setAttribute('role', 'button');
                 question.setAttribute('aria-expanded', 'false');
                 if (!answer.id) answer.id = `faq-answer-${Math.random().toString(36).substr(2, 9)}`;
                 question.setAttribute('aria-controls', answer.id);
                 answer.setAttribute('role', 'region');
                 answer.setAttribute('aria-labelledby', question.id || (question.id = `faq-question-${Math.random().toString(36).substr(2, 9)}`));
             }
         }

        // Initial setup for accessibility attributes
        faqList.querySelectorAll('.faq-item').forEach(setupFAQItem);


        function openFAQItem(item) {
            const q = item.querySelector('.faq-question');
            const a = item.querySelector('.faq-answer');
            if (!q || !a) return;
            item.classList.add('active');
            q.setAttribute('aria-expanded', 'true');
            // Animate max-height
            a.style.maxHeight = a.scrollHeight + 'px';
        }

        function closeFAQItem(item) {
            const q = item.querySelector('.faq-question');
            const a = item.querySelector('.faq-answer');
            if (!q || !a) return;
            item.classList.remove('active');
            q.setAttribute('aria-expanded', 'false');
             // Animate max-height back to 0
            a.style.maxHeight = '0';
        }
    }


    // Contact form handling
    function initializeContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        const successMessage = document.getElementById('successMessage');
        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnText = submitBtn?.querySelector('.btn-text');
        const btnLoading = submitBtn?.querySelector('.btn-loading');


        if (successMessage) successMessage.style.display = 'none';

        const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            // Validate on blur and input for immediate feedback
            input.addEventListener('input', () => validateField(input));
            input.addEventListener('blur', () => validateField(input));
        });

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            let isValid = true;
            // Validate all required fields on submit
            inputs.forEach(input => {
                if (!validateField(input)) isValid = false;
            });

             // Validate email specifically if present but not required initially
            const emailInput = contactForm.querySelector('input[type="email"]');
            if (emailInput && !validateField(emailInput)) {
                 isValid = false;
            }


            if (!isValid) {
                showNotification('Please fix the errors in the form.', 'error');
                 // Focus the first invalid field
                const firstError = contactForm.querySelector('.error');
                if (firstError) firstError.focus();
                return;
            }

            // Show loading state
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                if(btnText) btnText.style.display = 'none';
                if(btnLoading) btnLoading.style.display = 'flex';
            }

            try {
                const responseData = await submitContactForm(contactForm);
                console.log("FormSubmit Response:", responseData); // Log success response

                // Use the success message div from HTML
                 if (successMessage) {
                    contactForm.style.display = 'none'; // Hide form
                    successMessage.style.display = 'block';
                    successMessage.classList.add('show');
                } else {
                     // Fallback notification if success div is missing
                    showNotification('Message sent successfully!', 'success');
                    contactForm.reset(); // Reset form fields
                 }

            } catch (error) {
                console.error('Form submission error:', error);
                showNotification(`Error: ${error.message || 'Could not send message. Please try again.'}`, 'error');
            } finally {
                 // Hide loading state
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                     if(btnText) btnText.style.display = 'inline'; // Or 'block'
                     if(btnLoading) btnLoading.style.display = 'none';
                }
            }
        });

        async function submitContactForm(form) {
            const formData = new FormData(form);
            const formAction = form.action || 'https://formsubmit.co/ajax/focistore@gmail.com'; // Use action from form or default

            // Use URLSearchParams for simple forms, or keep FormData for file uploads
            const params = new URLSearchParams();
            formData.forEach((value, key) => {
                params.append(key, value);
            });
             // Add FormSubmit specific hidden fields if not in HTML
            if(!formData.has('_subject')) params.append('_subject', 'New Contact Form Submission - FociStore');
            if(!formData.has('_template')) params.append('_template', 'table');
             // Consider adding honey pot or captcha fields here if needed


            const response = await fetch(formAction, {
                method: 'POST',
                headers: { /* 'Content-Type': 'application/x-www-form-urlencoded', */ 'Accept': 'application/json' }, // Let browser set Content-Type for FormData, or set explicitly for URLSearchParams
                body: params // Use params for x-www-form-urlencoded
                // body: formData // Use formData if sending multipart/form-data (e.g., file uploads)
            });

            const responseText = await response.text(); // Get raw response text
            console.log("Raw FormSubmit Response Text:", responseText);


             if (!response.ok) {
                 // Try to parse error if JSON, otherwise use status text
                 let errorMsg = `Network error: ${response.status} ${response.statusText}`;
                 try {
                     const errorJson = JSON.parse(responseText);
                     errorMsg = errorJson.message || errorMsg;
                 } catch (parseError) { /* Ignore if not JSON */ }
                 throw new Error(errorMsg);
             }

             // Try parsing response as JSON
             try {
                const data = JSON.parse(responseText);
                 // FormSubmit success is often just { success: "true" } as string
                if (data.success !== 'true' && data.success !== true) {
                    throw new Error(data.message || 'Form submission failed');
                }
                return data; // Return parsed data on success
             } catch(e) {
                 console.error("Failed to parse FormSubmit response as JSON:", e);
                 // Consider success even if response is not JSON, if status is OK
                 if (response.ok) {
                     return { success: true, message: "Submitted (non-JSON response)" };
                 } else {
                    throw new Error("Form submission failed (invalid response).");
                 }
             }
        }
    }


    // Field validation - More robust
    function validateField(field) {
        if (!field) return true; // Shouldn't happen, but safety check

        const value = field.value.trim();
        const fieldName = field.name || field.type; // Use name or fallback to type
        let isValid = true;
        let errorMessage = '';

        // Find or create error message container
        let errorContainer = field.parentNode.querySelector(`.field-error[data-for="${field.id || fieldName}"]`);
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'field-error';
            errorContainer.dataset.for = field.id || fieldName; // Link error to field
             // Insert after the field
             field.parentNode.insertBefore(errorContainer, field.nextSibling);
             // Ensure it's visually hidden initially
             errorContainer.style.display = 'none';
        }


        // Basic required check
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        // Type-specific checks ONLY IF value is present or field is required
        else if (value || field.required) {
            switch (fieldName) {
                case 'name':
                    if (value.length < 2) { isValid = false; errorMessage = 'Name must be at least 2 characters'; }
                    break;
                case 'email':
                    if (!isValidEmail(value)) { isValid = false; errorMessage = 'Please enter a valid email address'; }
                    break;
                case 'subject':
                     if (value.length < 5 && field.required) { isValid = false; errorMessage = 'Subject must be at least 5 characters'; }
                    break;
                case 'message':
                    if (value.length < 10 && field.required) { isValid = false; errorMessage = 'Message must be at least 10 characters'; }
                    break;
                // Add more cases for other field names or types (e.g., phone, url)
            }
        }

        // Apply styles and show/hide error message
        if (!isValid) {
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
            errorContainer.textContent = errorMessage;
            errorContainer.style.display = 'block'; // Show error
        } else {
            field.classList.remove('error');
            field.setAttribute('aria-invalid', 'false');
            errorContainer.textContent = '';
            errorContainer.style.display = 'none'; // Hide error
        }
        return isValid;
    }


    // Email validation
    function isValidEmail(email) {
        // More robust regex
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email);
    }

    // Navigation initialization
    function initializeNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('nav a[href]');

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href').split('?')[0]; // Ignore query parameters for matching

             // Remove active class initially
            link.classList.remove('active');

            if ((currentPage === '' || currentPage === 'index.html') && (linkHref === '' || linkHref === 'index.html')) {
                link.classList.add('active');
            } else if (linkHref !== '' && linkHref !== 'index.html' && currentPage === linkHref) {
                link.classList.add('active');
            }
        });
    }


    // Page transitions
    function initializePageTransitions() {
        // Simple fade-in on load
        document.body.style.opacity = '0';
        requestAnimationFrame(() => { // Ensure styles are applied before transition starts
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        });

         // Add transition out effect (optional)
        // window.addEventListener('beforeunload', () => {
        //     document.body.style.transition = 'opacity 0.3s ease';
        //     document.body.style.opacity = '0';
        // });
    }

    // Navigation scroll
    function initializeNavScroll() {
        const nav = document.querySelector('nav ul');
        if (!nav) return;
        const navContainer = nav.closest('nav'); // Get parent nav element
        if (!navContainer) return;

        let leftBtn = navContainer.querySelector('.nav-scroll-left');
        let rightBtn = navContainer.querySelector('.nav-scroll-right');

        // Only create buttons if they don't exist
        if (!leftBtn) {
            leftBtn = document.createElement('button');
            leftBtn.className = 'nav-scroll-indicator nav-scroll-left';
            leftBtn.innerHTML = '‹';
            leftBtn.setAttribute('aria-label', 'Scroll left');
            leftBtn.style.display = 'none'; // Hide initially
            navContainer.appendChild(leftBtn);
             leftBtn.addEventListener('click', () => nav.scrollBy({ left: -200, behavior: 'smooth' }));

        }
        if (!rightBtn) {
            rightBtn = document.createElement('button');
            rightBtn.className = 'nav-scroll-indicator nav-scroll-right';
            rightBtn.innerHTML = '›';
            rightBtn.setAttribute('aria-label', 'Scroll right');
            rightBtn.style.display = 'none'; // Hide initially
            navContainer.appendChild(rightBtn);
             rightBtn.addEventListener('click', () => nav.scrollBy({ left: 200, behavior: 'smooth' }));
        }

        // Ensure nav container allows positioning
        if (window.getComputedStyle(navContainer).position === 'static') {
             navContainer.style.position = 'relative';
        }


        let scrollTimeout;
        function updateScrollButtons() {
             clearTimeout(scrollTimeout);
             scrollTimeout = setTimeout(() => { // Debounce resize/scroll check
                const scrollLeft = nav.scrollLeft;
                const scrollWidth = nav.scrollWidth;
                const clientWidth = nav.clientWidth;
                const maxScrollLeft = scrollWidth - clientWidth;

                // Show buttons only if content overflows
                const showButtons = scrollWidth > clientWidth;

                if(leftBtn) {
                    leftBtn.style.display = showButtons && scrollLeft > 1 ? 'flex' : 'none';
                    leftBtn.classList.toggle('visible', showButtons && scrollLeft > 1); // For CSS transitions
                }
                 if(rightBtn) {
                    rightBtn.style.display = showButtons && scrollLeft < maxScrollLeft - 1 ? 'flex' : 'none';
                    rightBtn.classList.toggle('visible', showButtons && scrollLeft < maxScrollLeft - 1); // For CSS transitions
                 }
             }, 50); // Adjust debounce delay as needed
        }

        // Listeners
        nav.addEventListener('scroll', updateScrollButtons, { passive: true });
        window.addEventListener('resize', updateScrollButtons);

        // Initial check after a short delay to allow layout calculation
        setTimeout(updateScrollButtons, 200);
         // Also check on load in case content loads dynamically later
         window.addEventListener('load', () => setTimeout(updateScrollButtons, 300));
    }


    // Ripple effects
    function initializeRippleEffects() {
        // Use event delegation on the document body
        document.body.addEventListener('click', function(e) {
            // Check if the clicked element or its ancestor matches the buttons
            const button = e.target.closest('.cta-button, .download-btn, .btn-download, .submit-btn, .btn-details, .catalog-link, .page-btn, .cancel-btn, .btn-confirm-cancel, .btn-resume-cancel');
            if (button && !button.disabled) { // Check if button is not disabled
                createRippleEffect(e, button);
            }
        });
    }

    function createRippleEffect(event, button) {
        // Ensure button allows positioning
        const buttonStyles = window.getComputedStyle(button);
        if (buttonStyles.position === 'static') {
            button.style.position = 'relative'; // Temporarily set if static
        }
        if (buttonStyles.overflow !== 'hidden') {
            button.style.overflow = 'hidden'; // Temporarily set if not hidden
        }

        const ripple = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        ripple.style.width = ripple.style.height = `${diameter}px`;
        // Calculate position relative to the button, not viewport
        const rect = button.getBoundingClientRect();
        ripple.style.left = `${event.clientX - rect.left - radius}px`;
        ripple.style.top = `${event.clientY - rect.top - radius}px`;
        ripple.classList.add('ripple-effect'); // Use class for animation

        // Remove any previous ripple to prevent buildup if clicked rapidly
        const existingRipple = button.querySelector('.ripple-effect');
        if (existingRipple) {
            existingRipple.remove();
        }

        button.appendChild(ripple);

        // Remove the ripple element after the animation completes
        ripple.addEventListener('animationend', () => {
            ripple.remove();
             // Reset temporary styles if they were added
             if (buttonStyles.position === 'static') button.style.position = '';
             if (buttonStyles.overflow !== 'hidden') button.style.overflow = '';
        });
    }


    // Details button
    function initializeDetailsButtons() {
        // Use event delegation
        document.body.addEventListener('click', function(e) {
            if (e.target.matches('.btn-details')) {
                const card = e.target.closest('.app-card, .game-card');
                const appName = card?.querySelector('h3')?.textContent || 'Item';
                 // Placeholder action: Show notification
                 // In a real app, this would likely open a modal or navigate to a details page
                showNotification(`Details for ${appName} (placeholder).`, 'info');

                // Example: Open a details modal
                // const detailsModal = document.getElementById('detailsModal');
                // if(detailsModal) {
                //     populateDetailsModal(appName, card); // Function to fill modal content
                //     detailsModal.style.display = 'block';
                //     document.body.style.overflow = 'hidden';
                // }
            }
        });
    }

    // Modal system initialization (Fixed)
    function initializeModalSystem() {
         // Close modals by clicking outside the modal-content
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                const modal = e.target;
                 // Special handling for download modal cancellation
                if (modal.id === 'downloadModal') {
                    const cancelBtn = modal.querySelector('#cancelDownload'); // Find the specific cancel button
                    if (cancelBtn) {
                         cancelBtn.click(); // Trigger the cancel logic (which includes confirmation)
                         return; // Prevent default closing
                    }
                }
                 // Default close for other modals or if download cancel button not found
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Close modals with escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                 // Find the topmost visible modal
                 const visibleModals = Array.from(document.querySelectorAll('.modal')).filter(m => m.style.display === 'block');
                 if (visibleModals.length > 0) {
                     const topModal = visibleModals[visibleModals.length - 1]; // Get the last one (likely topmost)

                     if (topModal.id === 'downloadModal') {
                         const cancelBtn = topModal.querySelector('#cancelDownload');
                         if (cancelBtn) {
                             cancelBtn.click(); // Trigger cancel logic
                             return; // Prevent default closing
                         }
                     }
                      // Default close
                     topModal.style.display = 'none';
                     document.body.style.overflow = 'auto';
                 }
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

    // Notification system - Improved
    function showNotification(message, type = 'info') {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            // Basic container styles (positioning) - should be in CSS ideally
            container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; max-width: 350px;';
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
         // Apply base and type-specific classes for styling via CSS
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert'); // Accessibility

        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;

         // Add animation class for entrance
         notification.classList.add('notification-slide-in');

        // Prepend to show newest at the top
        container.prepend(notification);

        const close = () => {
             // Add animation class for exit
             notification.classList.remove('notification-slide-in');
             notification.classList.add('notification-slide-out');
             // Remove element after animation finishes
             notification.addEventListener('animationend', () => {
                notification.remove();
                // Remove container if empty? Optional.
                // if (container.children.length === 0) container.remove();
             });
        };

        const autoRemoveTimeout = setTimeout(close, 5000); // Auto-close after 5 seconds

        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemoveTimeout); // Clear auto-close if manually closed
            close();
        });
    }


    // Lazy loading for images with data-src
    /* REMOVED initializeLazyLoading function and call */


    // Error handling for images - Improved placeholder
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            const img = e.target;
             // Prevent infinite loop if placeholder itself fails
             if (img.src.includes('placehold.co')) return;

             // Get dimensions if possible, otherwise default
             const width = img.clientWidth > 0 ? img.clientWidth : 300;
             const height = img.clientHeight > 0 ? img.clientHeight : (img.classList.contains('card-image') || img.classList.contains('featured-image') ? 200 : width * 0.66); // Guess height based on context
             const text = img.alt || 'Image Error';

             img.src = `https://placehold.co/${width}x${Math.round(height)}/667eea/ffffff?text=${encodeURIComponent(text)}`;
             img.alt = text; // Ensure alt text is set
             console.warn(`Image failed to load: ${e.target.src}. Replaced with placeholder.`);
        }
    }, true); // Use capture phase to catch errors early


    // Handle page visibility changes for performance
    document.addEventListener('visibilitychange', function() {
        // Toggle class on body for CSS to pause animations
        document.body.classList.toggle('page-hidden', document.hidden);

        // Optional: More complex logic, e.g., pausing videos or timers
        if (document.hidden) {
            // console.log("Page hidden - pausing activities");
        } else {
            // console.log("Page visible - resuming activities");
        }
    });

    // Add CSS for page visibility state (Keep this minimal CSS in JS)
    const style = document.createElement('style');
    style.id = 'dynamic-styles'; // Give it an ID to prevent duplicates if run again
    if (!document.getElementById(style.id)) { // Check if already added
        style.textContent = `
            .page-hidden .animated-gradient,
            .page-hidden .loading-spinner,
            .page-hidden [data-aos], /* Attempt to pause AOS animations */
            .page-hidden .float, /* Pause custom animations */
            .page-hidden .pulse,
            .page-hidden .bounce
             {
                animation-play-state: paused !important; /* Force pause */
            }
             /* Style for lazy loaded images fade-in */
            /* img:not(.loaded) { opacity: 0; transition: opacity 0.5s; } REMOVED */
            /* img.loaded { opacity: 1; } REMOVED */
        `;
        document.head.appendChild(style);
    }


    // Reset to first page when page initially loads (for apps/games pages)
     // This needs to run *after* filters might be set by URL
    // window.addEventListener('load', function() {
    //      if (state.pageType === 'apps' || state.pageType === 'games') {
    //          // Only reset if no URL parameter forced a different state
    //          const urlParams = new URLSearchParams(window.location.search);
    //          if (!urlParams.has('category') && !urlParams.has('search')) { // Add other potential params
    //              state.currentPage = 1;
    //              // Re-render if necessary, though initial render should handle page 1
    //              // applyFiltersAndRender(false); // Render without resetting filters
    //          }
    //      }
    // });


})(); // End of IIFE

