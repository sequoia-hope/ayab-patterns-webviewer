// Configuration
const REPO_BASE_URL = 'https://raw.githubusercontent.com/AllYarnsAreBeautiful/ayab-patterns/main/StitchWorld/';
const TOTAL_PATTERNS = 408;

// State
let patterns = [];
let filteredPatterns = [];
let currentPatternIndex = 0;

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

// Initialize patterns array
function initializePatterns() {
    patterns = [];
    for (let i = 1; i <= TOTAL_PATTERNS; i++) {
        const paddedNumber = String(i).padStart(3, '0');
        patterns.push({
            number: i,
            paddedNumber: paddedNumber,
            filename: `${paddedNumber}.png`,
            url: `${REPO_BASE_URL}${paddedNumber}.png`
        });
    }
    filteredPatterns = [...patterns];
}

// Render gallery
function renderGallery() {
    gallery.innerHTML = '';

    if (filteredPatterns.length === 0) {
        gallery.innerHTML = `
            <div class="no-results">
                <h3>No patterns found</h3>
                <p>Try adjusting your search criteria</p>
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
                alt="Pattern ${pattern.paddedNumber}"
                loading="lazy"
            />
            <div class="pattern-info">
                <div class="pattern-number">Pattern ${pattern.paddedNumber}</div>
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
    const total = patterns.length;
    patternCount.textContent = showing === total
        ? `Showing all ${total} patterns`
        : `Showing ${showing} of ${total} patterns`;
}

// Open modal
function openModal(index) {
    currentPatternIndex = index;
    const pattern = filteredPatterns[index];

    modalImage.src = pattern.url;
    modalImage.alt = `Pattern ${pattern.paddedNumber}`;
    modalTitle.textContent = `Pattern ${pattern.paddedNumber}`;
    downloadLink.href = pattern.url;
    downloadLink.download = pattern.filename;
    viewOriginal.href = `https://github.com/AllYarnsAreBeautiful/ayab-patterns/blob/main/StitchWorld/${pattern.filename}`;

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
        // Search by pattern number
        filteredPatterns = patterns.filter(pattern => {
            return pattern.paddedNumber.includes(searchTerm) ||
                   pattern.number.toString().includes(searchTerm);
        });
    }

    applySorting();
    renderGallery();
}

// Apply sorting
function applySorting() {
    const order = sortOrder.value;
    filteredPatterns.sort((a, b) => {
        return order === 'asc' ? a.number - b.number : b.number - a.number;
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
function init() {
    initializePatterns();
    renderGallery();
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
