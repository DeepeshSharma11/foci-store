// Global variables
let appsData = [];
let gamesData = [];
let currentPage = 1;
const itemsPerPage = 8; // 6 items per page

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAllFeatures();
});

// Initialize all features
async function initializeAllFeatures() {
    await loadData();
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

// Load data from JSON
async function loadData() {
    try {
        const response = await fetch('apps.json');
        const data = await response.json();
        appsData = data.apps || [];
        gamesData = data.games || [];
        
        // Populate apps and games on respective pages
        populateAppsPage();
        populateGamesPage();
        populateFeaturedApps();
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to static data if JSON fails
        loadStaticData();
    }
}

// Fallback static data
function loadStaticData() {
    appsData = [
        {
            id: 1,
            name: "WhatsApp MOD",
            description: "Enhanced version with extra features like theme customization, privacy options, and more",
            category: "social",
            image: "assets/images/fmwhatsapp.png",
            size: "95 MB",
            version: "v2.23.5.76",
            rating: 4.7,
            downloads: "10K+",
            downloadUrl: "https://getkukuymun.site/url/2A8QZ54HRrD",
            badge: "Trending"
        },
        {
            id: 2,
            name: "Instagram MOD",
            description: "Download photos, videos, stories with enhanced privacy and customization options.",
            category: "social",
            image: "assets/images/Insta-Pro-APK.png",
            size: "143 MB",
            version: "v289.0.0.18.109",
            rating: 4.7,
            downloads: "8K+",
            downloadUrl: "https://getkukuymun.site/url/2A8QZ54HRrD",
            badge: "New"
        },
        {
            id: 3,
            name: "YouTube MOD",
            description: "Ad-free YouTube experience with background play and video download capabilities.",
            category: "media",
            image: "assets/images/youtube-mod.png",
            size: "85 MB",
            version: "v18.45.43",
            rating: 4.8,
            downloads: "15K+",
            downloadUrl: "https://vanced.to/",
            badge: "Popular"
        },
        {
            id: 4,
            name: "File Manager MOD",
            description: "Advanced file management with root access, cloud integration, and premium themes.",
            category: "tools",
            image: "assets/images/file-manager.png",
            size: "8 MB",
            version: "v4.2.1",
            rating: 4.8,
            downloads: "5K+",
            downloadUrl: "https://liteapks.com/download/file-manager-77834",
            badge: "Pro"
        },
        {
            id: 5,
            name: "XPlayer",
            description: "XPlayer Mod APK is an impressive video player tool and gives you the best experience with support for multiple formats.",
            category: "media",
            image: "assets/images/xplayer.png",
            size: "38 MB",
            version: "v2.4.8.2",
            rating: 4.5,
            downloads: "7K+",
            downloadUrl: "https://liteapks.com/download/xplayer-5858",
            badge: "Enhanced"
        },
        {
            id: 6,
            name: "Office Suite MOD",
            description: "Complete office suite with PDF editing, cloud sync, and all premium features unlocked.",
            category: "productivity",
            image: "assets/images/office-suite.png",
            size: "120 MB",
            version: "v14.8.4",
            rating: 4.7,
            downloads: "6K+",
            downloadUrl: "#",
            badge: "Premium"
        },
        {
            id: 7,
            name: "TikTok MOD",
            description: "Download videos without watermark, unlimited features and enhanced privacy options.",
            category: "social",
            image: "assets/images/tiktok-mod.png",
            size: "120 MB",
            version: "v30.5.4",
            rating: 4.6,
            downloads: "15K+",
            downloadUrl: "https://example.com/tiktok",
            badge: "Popular"
        },
        {
            id: 8,
            name: "Spotify MOD",
            description: "Ad-free music, unlimited skips, and premium features unlocked.",
            category: "media",
            image: "assets/images/spotify-mod.png",
            size: "85 MB",
            version: "v8.8.96",
            rating: 4.9,
            downloads: "20K+",
            downloadUrl: "https://example.com/spotify",
            badge: "Premium"
        }
    ];
    
    gamesData = [
        {
            id: 1,
            name: "Subway Surfers MOD",
            description: "Unlimited coins, keys, and all characters unlocked. Run endlessly without restrictions.",
            category: "action",
            image: "assets/images/subway-surfers.png",
            size: "150 MB",
            version: "v3.12.1",
            rating: 4.8,
            downloads: "25K+",
            downloadUrl: "https://an1.com/file_4683-dw.html",
            badge: "Unlimited"
        },
        {
            id: 2,
            name: "Asphalt 9 MOD",
            description: "Unlimited credits, all cars unlocked, and premium features for the ultimate racing experience.",
            category: "racing",
            image: "assets/images/asphalt-9.png",
            size: "2.1 GB",
            version: "v3.9.4",
            rating: 4.9,
            downloads: "12K+",
            downloadUrl: "https://asphalt-9-legends-mod.apkresult.io/download",
            badge: "Premium"
        },
        {
            id: 3,
            name: "Candy Crush MOD",
            description: "Unlimited lives, boosters, and all levels unlocked. Sweet gaming without limits.",
            category: "puzzle",
            image: "assets/images/candy-crush.png",
            size: "95 MB",
            version: "v1.260.1.2",
            rating: 4.7,
            downloads: "18K+",
            downloadUrl: "https://candy-crush-soda-saga.apkrabi.com/download/",
            badge: "Unlimited"
        },
        {
            id: 4,
            name: "Minecraft MOD",
            description: "Unlocked skins, texture packs, and premium features for unlimited creativity.",
            category: "adventure",
            image: "assets/images/minecraft.png",
            size: "180 MB",
            version: "v1.20.15.01",
            rating: 4.9,
            downloads: "15K+",
            downloadUrl: "#",
            badge: "Premium"
        },
        {
            id: 5,
            name: "FIFA Mobile MOD",
            description: "Unlimited coins, all players unlocked, and premium features for the ultimate football experience.",
            category: "sports",
            image: "assets/images/fifa-mobile.png",
            size: "1.2 GB",
            version: "v17.0.14",
            rating: 4.8,
            downloads: "10K+",
            downloadUrl: "#",
            badge: "Enhanced"
        },
        {
            id: 6,
            name: "Call of Duty MOD",
            description: "Unlimited CP, all weapons unlocked, and premium battle pass for ultimate warfare.",
            category: "action",
            image: "assets/images/call-of-duty.png",
            size: "2.5 GB",
            version: "v1.0.39",
            rating: 4.9,
            downloads: "20K+",
            downloadUrl: "#",
            badge: "Pro"
        },
        {
            id: 7,
            name: "Temple Run 2 MOD",
            description: "Unlimited coins, all characters unlocked, and infinite energy for endless running.",
            category: "adventure",
            image: "assets/images/temple-run.png",
            size: "80 MB",
            version: "v1.100.0",
            rating: 4.6,
            downloads: "8K+",
            downloadUrl: "#",
            badge: "Unlimited"
        },
        {
            id: 8,
            name: "PUBG Mobile MOD",
            description: "Unlimited UC, aim assist, and all skins unlocked for battle royale dominance.",
            category: "action",
            image: "assets/images/pubg-mobile.png",
            size: "1.8 GB",
            version: "v3.0.0",
            rating: 4.9,
            downloads: "30K+",
            downloadUrl: "#",
            badge: "Pro"
        }
    ];
    
    populateAppsPage();
    populateGamesPage();
    populateFeaturedApps();
}

// Populate apps page with pagination
function populateAppsPage() {
    const appsGrid = document.querySelector('.apps-grid');
    if (!appsGrid) return;

    // Remove loading message
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
        loadingMessage.remove();
    }

    // Apply pagination
    const paginatedData = applyPagination(appsData);
    updateGrid(paginatedData, 'apps');
    updatePaginationButtons(appsData.length);
}

// Populate games page with pagination
function populateGamesPage() {
    const gamesGrid = document.querySelector('.games-grid');
    if (!gamesGrid) return;

    // Apply pagination
    const paginatedData = applyPagination(gamesData);
    updateGrid(paginatedData, 'games');
    updatePaginationButtons(gamesData.length);
}

// Populate featured apps on homepage
function populateFeaturedApps() {
    const featuredGrid = document.querySelector('.featured-grid');
    if (!featuredGrid) return;

    // Get first 3 apps for featured section
    const featuredApps = appsData.slice(0, 3);
    
    featuredGrid.innerHTML = '';
    
    if (featuredApps.length === 0) {
        return;
    }
    
    featuredApps.forEach((app, index) => {
        const featuredItem = createFeaturedItem(app, index);
        featuredGrid.appendChild(featuredItem);
    });
    
    // Re-initialize animations for new elements
    initializeAnimations();
}

// Apply pagination to data
function applyPagination(data) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
}

// Update pagination buttons
function updatePaginationButtons(totalItems) {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    pagination.innerHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.innerHTML = '‹ Previous';
        prevBtn.addEventListener('click', () => {
            currentPage--;
            applyFilters();
        });
        pagination.appendChild(prevBtn);
    }
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're at the start
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            applyFilters();
        });
        pagination.appendChild(pageBtn);
    }
    
    // Next button
    if (currentPage < totalPages) {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn next';
        nextBtn.innerHTML = 'Next ›';
        nextBtn.addEventListener('click', () => {
            currentPage++;
            applyFilters();
        });
        pagination.appendChild(nextBtn);
    }
}

// Update grid with data
function updateGrid(data, type) {
    const grid = document.querySelector(type === 'games' ? '.games-grid' : '.apps-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (data.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">${type === 'games' ? '🎮' : '📱'}</div>
                <h3>No ${type === 'games' ? 'games' : 'applications'} found</h3>
                <p>${currentPage > 1 ? 'Try going back to previous pages' : 'Try changing your filters or search terms'}</p>
            </div>
        `;
        return;
    }
    
    data.forEach((item, index) => {
        const card = type === 'games' ? createGameCard(item, index) : createAppCard(item, index);
        grid.appendChild(card);
    });
    
    // Re-initialize animations for new elements
    initializeAnimations();
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
            <img src="${app.image}" alt="${app.name}" onerror="this.src='https://via.placeholder.com/300x200/667eea/ffffff?text=App+Image'">
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
            <img src="${game.image}" alt="${game.name}" onerror="this.src='https://via.placeholder.com/300x200/667eea/ffffff?text=Game+Image'">
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
            <img src="${app.image}" alt="${app.name}" onerror="this.src='https://via.placeholder.com/300x200/667eea/ffffff?text=Featured+App'">
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

// Page-specific feature initialization
function initializePageSpecificFeatures() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initializeHeroAnimations();
            break;
        case 'apps.html':
        case 'games.html':
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

// Enhanced filter functionality with pagination
function initializeFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) {
        populateCategoryFilter(categoryFilter, getCurrentPageType());
        categoryFilter.addEventListener('change', () => {
            currentPage = 1; // Reset to first page when filter changes
            debounce(applyFilters, 300)();
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', () => {
            currentPage = 1; // Reset to first page when sort changes
            debounce(applyFilters, 300)();
        });
    }
}

function getCurrentPageType() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage.includes('games')) return 'games';
    if (currentPage.includes('apps')) return 'apps';
    return 'apps'; // default
}

function populateCategoryFilter(filter, type) {
    const categories = type === 'games' ? 
        ['all', 'action', 'adventure', 'puzzle', 'racing', 'sports'] :
        ['all', 'social', 'media', 'productivity', 'tools'];
    
    filter.innerHTML = '<option value="all">All Categories</option>';
    
    categories.forEach(category => {
        if (category !== 'all') {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            filter.appendChild(option);
        }
    });
}

function applyFilters() {
    const category = document.getElementById('categoryFilter')?.value || 'all';
    const sort = document.getElementById('sortFilter')?.value || 'popular';
    const pageType = getCurrentPageType();
    const data = pageType === 'games' ? gamesData : appsData;
    
    let filteredData = data.filter(item => 
        category === 'all' || item.category === category
    );
    
    // Sort data
    filteredData = sortData(filteredData, sort);
    
    // Apply pagination
    const paginatedData = applyPagination(filteredData);
    
    // Update grid
    updateGrid(paginatedData, pageType);
    
    // Update pagination buttons
    updatePaginationButtons(filteredData.length);
    
    showNotification(`Showing page ${currentPage} of ${Math.ceil(filteredData.length / itemsPerPage)}`, 'success');
}

function sortData(data, sortType) {
    switch(sortType) {
        case 'newest':
            return [...data].reverse();
        case 'name':
            return [...data].sort((a, b) => a.name.localeCompare(b.name));
        case 'popular':
        default:
            return data;
    }
}

// Advanced filters for apps/games pages
function initializeAdvancedFilters() {
    const filterControls = document.querySelector('.filter-controls');
    if (!filterControls) return;

    // Add animation to filter controls
    filterControls.classList.add('slide-in-top');
}

// Enhanced search functionality with pagination
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
        
        // Real-time search with debounce
        searchInput.addEventListener('input', debounce(performSearch, 500));
    }
}

function performSearch() {
    const query = document.getElementById('searchInput')?.value.trim().toLowerCase();
    const pageType = getCurrentPageType();
    const data = pageType === 'games' ? gamesData : appsData;
    
    // Reset to first page when searching
    currentPage = 1;
    
    if (!query || query.length < 2) {
        // If search query is too short, show all items
        const paginatedData = applyPagination(data);
        updateGrid(paginatedData, pageType);
        updatePaginationButtons(data.length);
        return;
    }
    
    const filteredData = data.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
    
    const paginatedData = applyPagination(filteredData);
    updateGrid(paginatedData, pageType);
    updatePaginationButtons(filteredData.length);
    
    showNotification(`Found ${filteredData.length} results for "${query}"`, 'info');
}

// Download functionality with improved error handling
function initializeDownloadSystem() {
    let downloadInProgress = false;
    let progressInterval;
    
    // Add event listeners to all download buttons (delegated for dynamic content)
    document.addEventListener('click', function(e) {
        if (e.target.matches('.download-btn, .btn-download')) {
            e.preventDefault();
            
            // Get app details
            const appName = e.target.getAttribute('data-name') || 
                           e.target.closest('.app-card, .game-card, .featured-item')?.querySelector('h3')?.textContent || 
                           'Application';
            const downloadUrl = e.target.getAttribute('data-url') || '#';
            
            startDownload(appName, downloadUrl);
        }
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
                    <p>Your download will begin shortly...</p>
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
    // This is now handled by updatePaginationButtons
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

// Add CSS for page visibility state and loading
const style = document.createElement('style');
style.textContent = `
    .page-hidden .pulse,
    .page-hidden .bounce,
    .page-hidden .float,
    .page-hidden .animated-gradient {
        animation-play-state: paused;
    }
    
    .loading-message {
        text-align: center;
        padding: 3rem;
        color: #666;
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    .no-results {
        text-align: center;
        padding: 4rem 2rem;
        color: #666;
        grid-column: 1 / -1;
    }

    .no-results-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }

    .no-results h3 {
        color: #333;
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
    }

    .no-results p {
        font-size: 1.1rem;
        opacity: 0.8;
    }
    
    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        margin-top: 3rem;
        flex-wrap: wrap;
    }

    .page-btn {
        padding: 0.8rem 1.2rem;
        border: 2px solid #e0e0e0;
        background: white;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
        min-width: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
    }

    .page-btn:hover {
        border-color: #667eea;
        color: #667eea;
        transform: translateY(-2px);
    }

    .page-btn.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-color: #667eea;
    }

    .page-btn.next {
        padding: 0.8rem 1.5rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Function to add new apps dynamically
function addNewApp(appData) {
    const newApp = {
        id: appsData.length + 1,
        ...appData
    };
    appsData.push(newApp);
    
    // Update all relevant pages
    populateAppsPage();
    populateFeaturedApps();
    
    showNotification(`New app "${appData.name}" added successfully!`, 'success');
}

// Function to add new games dynamically
function addNewGame(gameData) {
    const newGame = {
        id: gamesData.length + 1,
        ...gameData
    };
    gamesData.push(newGame);
    
    // Update games page
    populateGamesPage();
    
    showNotification(`New game "${gameData.name}" added successfully!`, 'success');
}

// Reset to first page when page loads
window.addEventListener('load', function() {
    currentPage = 1;
});