// Configuration
const REPO_BASE_URL = 'https://raw.githubusercontent.com/AllYarnsAreBeautiful/ayab-patterns/main/';
const API_BASE_URL = 'https://api.github.com/repos/AllYarnsAreBeautiful/ayab-patterns/contents/';

// Pattern collections configuration
const COLLECTIONS = [
    { name: 'StitchWorld', displayName: 'StitchWorld', count: 555 },
    { name: 'StitchWorld2', displayName: 'StitchWorld 2', count: 40 },
    { name: 'StitchWorld3', displayName: 'StitchWorld 3', count: 683 },
    { name: 'StitchWorldExtras', displayName: 'StitchWorld Extras', count: 63 },
    { name: 'kh910', displayName: 'KH910', count: 36 }
];

// State
let allPatterns = [];
let patterns = [];
let filteredPatterns = [];
let currentPatternIndex = 0;
let selectedCollections = new Set(COLLECTIONS.map(c => c.name));
let isLoading = false;

// DOM Elements
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const downloadLink = document.getElementById('downloadLink');
const viewOriginal = document.getElementById('viewOriginal');
const searchInput = document.getElementById('searchInput');
const gridSize = document.getElementById('gridSize');
const sortOrder = document.getElementById('sortOrder');
const patternCount = document.getElementById('patternCount');
const prevPattern = document.getElementById('prevPattern');
const nextPattern = document.getElementById('nextPattern');
const modalClose = document.querySelector('.modal-close');
const collectionFilters = document.getElementById('collectionFilters');

// Load patterns from GitHub API
async function loadPatterns() {
    if (isLoading) return;
    isLoading = true;

    gallery.innerHTML = '<div class="loading">Loading patterns from all collections...</div>';

    allPatterns = [];

    try {
        // Load patterns from each collection
        for (const collection of COLLECTIONS) {
            const response = await fetch(`${API_BASE_URL}${collection.name}`);
            const files = await response.json();

            // Filter for PNG files only
            const pngFiles = files.filter(file =>
                file.name.toLowerCase().endsWith('.png') && file.type === 'file'
            );

            // Create pattern objects
            pngFiles.forEach(file => {
                allPatterns.push({
                    filename: file.name,
                    collection: collection.name,
                    collectionDisplay: collection.displayName,
                    url: `${REPO_BASE_URL}${collection.name}/${file.name}`,
                    githubUrl: file.html_url,
                    size: file.size
                });
            });
        }

        // Sort by collection then filename
        allPatterns.sort((a, b) => {
            if (a.collection !== b.collection) {
                return COLLECTIONS.findIndex(c => c.name === a.collection) -
                       COLLECTIONS.findIndex(c => c.name === b.collection);
            }
            return a.filename.localeCompare(b.filename);
        });

        applyCollectionFilter();

    } catch (error) {
        console.error('Error loading patterns:', error);
        gallery.innerHTML = `
            <div class="no-results">
                <h3>Error loading patterns</h3>
                <p>Please try refreshing the page</p>
            </div>
        `;
    } finally {
        isLoading = false;
    }
}

// Apply collection filter
function applyCollectionFilter() {
    patterns = allPatterns.filter(pattern =>
        selectedCollections.has(pattern.collection)
    );
    filterPatterns();
}

// Render gallery
function renderGallery() {
    gallery.innerHTML = '';

    if (filteredPatterns.length === 0) {
        gallery.innerHTML = `
            <div class="no-results">
                <h3>No patterns found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }

    filteredPatterns.forEach((pattern, index) => {
        const card = document.createElement('div');
        card.className = 'pattern-card';
        card.innerHTML = `
            <img
                class="pattern-image"
                src="${pattern.url}"
                alt="${pattern.filename}"
                loading="lazy"
            />
            <div class="pattern-info">
                <div class="pattern-number">${pattern.filename}</div>
                <div class="pattern-collection">${pattern.collectionDisplay}</div>
            </div>
        `;
        card.addEventListener('click', () => openModal(index));
        gallery.appendChild(card);
    });

    updateStats();
}

// Update stats
function updateStats() {
    const showing = filteredPatterns.length;
    const total = allPatterns.length;
    const inSelectedCollections = patterns.length;

    if (showing === total) {
        patternCount.textContent = `Showing all ${total} patterns`;
    } else if (showing === inSelectedCollections) {
        patternCount.textContent = `Showing ${showing} patterns from selected collections`;
    } else {
        patternCount.textContent = `Showing ${showing} of ${inSelectedCollections} patterns`;
    }
}

// Open modal
function openModal(index) {
    currentPatternIndex = index;
    const pattern = filteredPatterns[index];

    modalImage.src = pattern.url;
    modalImage.alt = pattern.filename;
    modalTitle.textContent = `${pattern.filename} - ${pattern.collectionDisplay}`;
    downloadLink.href = pattern.url;
    downloadLink.download = pattern.filename;
    viewOriginal.href = pattern.githubUrl;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Update navigation buttons
    prevPattern.disabled = index === 0;
    nextPattern.disabled = index === filteredPatterns.length - 1;
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Navigate patterns in modal
function navigatePattern(direction) {
    const newIndex = currentPatternIndex + direction;
    if (newIndex >= 0 && newIndex < filteredPatterns.length) {
        openModal(newIndex);
    }
}

// Filter patterns
function filterPatterns() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!searchTerm) {
        filteredPatterns = [...patterns];
    } else {
        // Search by filename or collection
        filteredPatterns = patterns.filter(pattern => {
            return pattern.filename.toLowerCase().includes(searchTerm) ||
                   pattern.collectionDisplay.toLowerCase().includes(searchTerm);
        });
    }

    applySorting();
    renderGallery();
}

// Apply sorting
function applySorting() {
    const order = sortOrder.value;
    filteredPatterns.sort((a, b) => {
        if (order === 'asc') {
            // Sort by collection then filename
            if (a.collection !== b.collection) {
                return COLLECTIONS.findIndex(c => c.name === a.collection) -
                       COLLECTIONS.findIndex(c => c.name === b.collection);
            }
            return a.filename.localeCompare(b.filename);
        } else {
            // Reverse order
            if (a.collection !== b.collection) {
                return COLLECTIONS.findIndex(c => c.name === b.collection) -
                       COLLECTIONS.findIndex(c => c.name === a.collection);
            }
            return b.filename.localeCompare(a.filename);
        }
    });
}

// Toggle collection filter
function toggleCollection(collectionName) {
    if (selectedCollections.has(collectionName)) {
        selectedCollections.delete(collectionName);
    } else {
        selectedCollections.add(collectionName);
    }

    // Update button states
    updateCollectionButtons();

    // Reapply filters
    applyCollectionFilter();
}

// Update collection button states
function updateCollectionButtons() {
    COLLECTIONS.forEach(collection => {
        const button = document.getElementById(`filter-${collection.name}`);
        if (button) {
            if (selectedCollections.has(collection.name)) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }
    });
}

// Initialize collection filters
function initCollectionFilters() {
    collectionFilters.innerHTML = '';

    COLLECTIONS.forEach(collection => {
        const button = document.createElement('button');
        button.id = `filter-${collection.name}`;
        button.className = 'collection-filter active';
        button.textContent = `${collection.displayName} (${collection.count})`;
        button.addEventListener('click', () => toggleCollection(collection.name));
        collectionFilters.appendChild(button);
    });
}

// Change grid size
function changeGridSize() {
    gallery.className = `gallery ${gridSize.value}`;
}

// Event Listeners
searchInput.addEventListener('input', filterPatterns);
gridSize.addEventListener('change', changeGridSize);
sortOrder.addEventListener('change', () => {
    applySorting();
    renderGallery();
});

modalClose.addEventListener('click', closeModal);
prevPattern.addEventListener('click', () => navigatePattern(-1));
nextPattern.addEventListener('click', () => navigatePattern(1));

// Close modal on background click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    switch (e.key) {
        case 'Escape':
            closeModal();
            break;
        case 'ArrowLeft':
            navigatePattern(-1);
            break;
        case 'ArrowRight':
            navigatePattern(1);
            break;
    }
});

// Initialize app
async function init() {
    initCollectionFilters();
    await loadPatterns();
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
