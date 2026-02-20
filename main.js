/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// State
let gamesData = [];
let searchTerm = '';
let selectedGame = null;
let isFullscreen = false;

// DOM Elements
const searchInput = document.getElementById('search-input');
const gamesGrid = document.getElementById('games-grid');
const noResults = document.getElementById('no-results');
const gameModal = document.getElementById('game-modal');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');
const modalExternal = document.getElementById('modal-external');
const modalFullscreen = document.getElementById('modal-fullscreen');
const modalClose = document.getElementById('modal-close');
const gameIframe = document.getElementById('game-iframe');
const maximizeIcon = document.getElementById('maximize-icon');
const minimizeIcon = document.getElementById('minimize-icon');
const currentYearSpan = document.getElementById('current-year');

// Initialize
async function init() {
  currentYearSpan.textContent = new Date().getFullYear();
  
  try {
    const response = await fetch('./games.json');
    gamesData = await response.json();
    renderGames();
  } catch (error) {
    console.error('Failed to load games:', error);
    gamesGrid.innerHTML = '<p class="text-red-500 text-center col-span-full">Failed to load games list. Please try again later.</p>';
  }

  // Event Listeners
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderGames();
  });

  modalClose.addEventListener('click', closeModal);
  modalFullscreen.addEventListener('click', toggleFullscreen);

  // Close modal on escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && selectedGame) {
      closeModal();
    }
  });

  // Close modal on backdrop click
  gameModal.addEventListener('click', (e) => {
    if (e.target === gameModal) {
      closeModal();
    }
  });
}

function renderGames() {
  const filteredGames = gamesData.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  gamesGrid.innerHTML = '';

  if (filteredGames.length === 0) {
    noResults.classList.remove('hidden');
  } else {
    noResults.classList.add('hidden');
    filteredGames.forEach((game) => {
      const gameCard = createGameCard(game);
      gamesGrid.appendChild(gameCard);
    });
  }
}

function createGameCard(game) {
  const div = document.createElement('div');
  div.className = 'group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer';
  
  div.innerHTML = `
    <div class="aspect-video overflow-hidden">
      <img
        src="${game.thumbnail}"
        alt="${game.title}"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        referrerpolicy="no-referrer"
      />
    </div>
    <div class="p-4">
      <h3 class="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
        ${game.title}
      </h3>
      <p class="text-sm text-slate-400 line-clamp-2">
        ${game.description}
      </p>
    </div>
    <div class="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors pointer-events-none"></div>
  `;

  div.addEventListener('click', () => openModal(game));
  return div;
}

function openModal(game) {
  selectedGame = game;
  modalTitle.textContent = game.title;
  modalExternal.href = game.url;
  gameIframe.src = game.url;
  
  gameModal.classList.remove('hidden');
  gameModal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  selectedGame = null;
  gameIframe.src = '';
  gameModal.classList.add('hidden');
  gameModal.classList.remove('flex');
  document.body.style.overflow = '';
  
  if (isFullscreen) {
    toggleFullscreen();
  }
}

function toggleFullscreen() {
  isFullscreen = !isFullscreen;
  
  if (isFullscreen) {
    modalContent.classList.remove('max-w-5xl', 'h-[80vh]');
    modalContent.classList.add('w-full', 'h-full');
    maximizeIcon.classList.add('hidden');
    minimizeIcon.classList.remove('hidden');
  } else {
    modalContent.classList.add('max-w-5xl', 'h-[80vh]');
    modalContent.classList.remove('w-full', 'h-full');
    maximizeIcon.classList.remove('hidden');
    minimizeIcon.classList.add('hidden');
  }
}

// Start the app
init();
