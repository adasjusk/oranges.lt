document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const nav = document.getElementById('nav');
    const themeSwitcher = document.getElementById('theme-switcher');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const converter = new showdown.Converter({
        parseImgDimensions: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tables: true,
        rawHtml: true
    });
    const wikiPath = window.location.pathname.includes('mcwiki') ? 'mcwiki' : 'scpwiki';

    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>`;
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>`;

    // --- Mobile Menu Toggle ---
    mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        document.body.classList.toggle('sidebar-open');
    });

    // Close sidebar when clicking on overlay
    document.addEventListener('click', (e) => {
        if (document.body.classList.contains('sidebar-open') && 
            !sidebar.contains(e.target) && 
            e.target !== mobileMenuToggle &&
            !mobileMenuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    });

    // --- Theme Handling ---
    const applyTheme = (theme) => {
        document.body.className = theme;
        themeSwitcher.innerHTML = theme === 'light-theme' ? moonIcon : sunIcon;
        localStorage.setItem('wiki-theme', theme);
    };

    themeSwitcher.addEventListener('click', () => {
        const newTheme = document.body.className === 'light-theme' ? 'dark-theme' : 'light-theme';
        applyTheme(newTheme);
    });

    const savedTheme = localStorage.getItem('wiki-theme') || 'light-theme';
    applyTheme(savedTheme);

    // --- Content Loading ---
    const loadContent = async (page) => {
        try {
            const response = await fetch(`${page}`);
            if (!response.ok) {
                throw new Error('Page not found');
            }
            const markdown = await response.text();
            const html = converter.makeHtml(markdown);
            content.innerHTML = html;
            window.history.pushState({}, '', `?page=${page}`);
        } catch (error) {
            content.innerHTML = `<h1>Error</h1><p>${error.message}</p>`;
        }
    };

    // --- Navigation Loading ---
    const loadNav = async () => {
        try {
            const response = await fetch(`map.md`);
            const text = await response.text();
            const html = converter.makeHtml(text);
            nav.innerHTML = html;

            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const page = e.target.getAttribute('href');
                    loadContent(page);
                    // Close mobile menu when link is clicked
                    sidebar.classList.remove('active');
                    document.body.classList.remove('sidebar-open');
                });
            });
        } catch (error) {
            nav.innerHTML = 'Failed to load navigation.';
        }
    };

    // --- Initial Load ---
    const urlParams = new URLSearchParams(window.location.search);
    const pageFromQuery = urlParams.get('page');
    const initialPage = pageFromQuery || 'main.md';
    
    loadNav();
    loadContent(initialPage);

    // --- Search Functionality ---
    const searchInput = document.getElementById('search-input');
    const wikiPages = ['main.md', 'about.md', 'history.md', 'world.md', 'plugins.md', 'links.md'];
    let searchResultsContainer = null;

    searchInput.addEventListener('input', async (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Hide search results
            if (searchResultsContainer) {
                searchResultsContainer.style.display = 'none';
            }
            return;
        }

        if (searchTerm.length < 2) {
            return; // Wait for at least 2 characters
        }

        // Create results container if it doesn't exist
        if (!searchResultsContainer) {
            searchResultsContainer = document.createElement('div');
            searchResultsContainer.id = 'search-results';
            searchResultsContainer.className = 'search-results-container';
            document.getElementById('search-container').appendChild(searchResultsContainer);
        }

        // Show and clear previous results
        searchResultsContainer.style.display = 'block';
        searchResultsContainer.innerHTML = '<div class="search-loading">Searching...</div>';

        // Search through all pages
        const results = [];
        
        for (const page of wikiPages) {
            try {
                const response = await fetch(page);
                if (response.ok) {
                    const text = await response.text();
                    const lowerText = text.toLowerCase();
                    
                    if (lowerText.includes(searchTerm)) {
                        // Extract page title from markdown
                        const titleMatch = text.match(/^#\s+(.+)$/m);
                        const title = titleMatch ? titleMatch[1] : page.replace('.md', '');
                        
                        // Count occurrences
                        const occurrences = (lowerText.match(new RegExp(escapeRegex(searchTerm), 'g')) || []).length;
                        
                        // Get a snippet of context
                        const index = lowerText.indexOf(searchTerm);
                        const start = Math.max(0, index - 50);
                        const end = Math.min(text.length, index + searchTerm.length + 50);
                        let snippet = text.substring(start, end).replace(/\n/g, ' ');
                        if (start > 0) snippet = '...' + snippet;
                        if (end < text.length) snippet = snippet + '...';
                        
                        results.push({
                            page,
                            title,
                            occurrences,
                            snippet
                        });
                    }
                }
            } catch (error) {
                console.error(`Error searching ${page}:`, error);
            }
        }

        // Display results
        if (results.length === 0) {
            searchResultsContainer.innerHTML = '<div class="search-no-results">No results found</div>';
        } else {
            let html = `<div class="search-results-header">About ${results.length} result(s)</div>`;
            results.forEach(result => {
                html += `
                    <div class="search-result-item" data-page="${result.page}">
                        <div class="search-result-title">${result.title}</div>
                        <div class="search-result-snippet">${result.snippet}</div>
                    </div>
                `;
            });
            searchResultsContainer.innerHTML = html;
            
            // Add click handlers to results
            searchResultsContainer.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const page = item.getAttribute('data-page');
                    console.log('Navigating to:', page); // Debug log
                    loadContent(page);
                    searchInput.value = '';
                    searchResultsContainer.style.display = 'none';
                    // Close mobile menu when search result is clicked
                    sidebar.classList.remove('active');
                    document.body.classList.remove('sidebar-open');
                });
            });
        }
    });

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
});