// src/scripts/components/story-card.js - Professional Story Card Web Component

/**
 * StoryCard - Custom Web Component for displaying story cards
 * @extends HTMLElement
 * 
 * @example
 * <story-card></story-card>
 * 
 * // Set story data
 * const card = document.querySelector('story-card');
 * card.story = {
 *   id: '1',
 *   name: 'My Story',
 *   photoUrl: 'image.jpg',
 *   description: 'Description...',
 *   createdAt: '2024-01-01',
 *   lat: -6.2,
 *   lon: 106.8
 * };
 */
class StoryCard extends HTMLElement {
  constructor() {
    super();
    
    // Internal state
    this._story = null;
    this._isLoading = false;
    this._imageLoaded = false;
    
    // Bind methods
    this._handleLocationClick = this._handleLocationClick.bind(this);
    this._handleImageLoad = this._handleImageLoad.bind(this);
    this._handleImageError = this._handleImageError.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleShareClick = this._handleShareClick.bind(this);
  }

  /**
   * Observed attributes for automatic updates
   */
  static get observedAttributes() {
    return ['loading', 'compact'];
  }

  /**
   * Lifecycle: Component connected to DOM
   */
  connectedCallback() {
    this.setAttribute('role', 'article');
    this._addStyles();
  }

  /**
   * Lifecycle: Component disconnected from DOM
   */
  disconnectedCallback() {
    this._removeEventListeners();
  }

  /**
   * Lifecycle: Attribute changed
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  /**
   * Getter for story data
   */
  get story() {
    return this._story;
  }

  /**
   * Setter for story data
   * @param {Object} story - Story object
   */
  set story(story) {
    if (!story) {
      console.warn('StoryCard: Invalid story data');
      return;
    }

    this._story = this._validateStoryData(story);
    this.render();
  }

  /**
   * Validate and sanitize story data
   */
  _validateStoryData(story) {
    return {
      id: story.id || this._generateId(),
      name: this._sanitizeHTML(story.name || 'Untitled Story'),
      photoUrl: story.photoUrl || this._getPlaceholderImage(),
      description: this._sanitizeHTML(story.description || 'No description'),
      createdAt: story.createdAt || new Date().toISOString(),
      lat: this._validateCoordinate(story.lat),
      lon: this._validateCoordinate(story.lon),
      author: story.author || 'Anonymous'
    };
  }

  /**
   * Validate coordinate values
   */
  _validateCoordinate(coord) {
    const num = parseFloat(coord);
    return !isNaN(num) ? num : null;
  }

  /**
   * Generate unique ID
   */
  _generateId() {
    return `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sanitize HTML to prevent XSS
   */
  _sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Get placeholder image
   */
  _getPlaceholderImage() {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
  }

  /**
   * Format date to readable string
   */
  _formatDate(dateString) {
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }

      // Format options
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      
      return date.toLocaleDateString('id-ID', options);
    } catch (error) {
      console.error('StoryCard: Date formatting error', error);
      return 'Unknown Date';
    }
  }

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  _formatRelativeTime(dateString) {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      if (days > 7) return this._formatDate(dateString);
      if (days > 0) return `${days} hari yang lalu`;
      if (hours > 0) return `${hours} jam yang lalu`;
      if (minutes > 0) return `${minutes} menit yang lalu`;
      return 'Baru saja';
    } catch (error) {
      return this._formatDate(dateString);
    }
  }

  /**
   * Truncate text to specified length
   */
  _truncateText(text, maxLength = 150) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
  }

  /**
   * Check if story is favorited
   */
  async _isFavorite() {
    if (!window.indexedDBHelper) return false;
    
    try {
      return await window.indexedDBHelper.isFavorite(this._story.id);
    } catch (error) {
      console.error('StoryCard: Error checking favorite status', error);
      return false;
    }
  }

  /**
   * Render the component
   */
  async render() {
    if (!this._story) {
      this._renderEmpty();
      return;
    }

    const { id, name, photoUrl, description, createdAt, lat, lon, author } = this._story;
    const isCompact = this.hasAttribute('compact');
    const hasLocation = lat !== null && lon !== null;
    
    // Check if favorited
    const isFavorited = await this._isFavorite();
    
    this.innerHTML = `
      <article class="story-card ${isCompact ? 'compact' : ''}" data-story-id="${id}">
        <!-- Image Container -->
        <div class="story-image-container">
          <img 
            src="${photoUrl}" 
            alt="Cerita: ${name}" 
            class="story-image"
            loading="lazy"
            decoding="async"
          >
          
          <!-- Image Overlay -->
          <div class="story-image-overlay">
            <button 
              class="btn-icon btn-favorite ${isFavorited ? 'active' : ''}" 
              aria-label="${isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}"
              title="${isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}"
            >
              <i class="fas fa-heart"></i>
            </button>
            <button 
              class="btn-icon btn-share" 
              aria-label="Bagikan cerita"
              title="Bagikan cerita"
            >
              <i class="fas fa-share-alt"></i>
            </button>
          </div>
          
          <!-- Location Badge -->
          ${hasLocation ? `
            <div class="location-badge" title="Lokasi tersedia">
              <i class="fas fa-map-marker-alt"></i>
              <span class="visually-hidden">Memiliki lokasi</span>
            </div>
          ` : ''}
        </div>
        
        <!-- Story Content -->
        <div class="story-content">
          <!-- Header -->
          <div class="story-header">
            <h3 class="story-title" title="${name}">
              ${name}
            </h3>
            <div class="story-meta">
              <span class="story-author">
                <i class="fas fa-user" aria-hidden="true"></i>
                <span>${author}</span>
              </span>
              <span class="story-separator">•</span>
              <time 
                class="story-date" 
                datetime="${new Date(createdAt).toISOString()}"
                title="${this._formatDate(createdAt)}"
              >
                ${this._formatRelativeTime(createdAt)}
              </time>
            </div>
          </div>
          
          <!-- Description -->
          <p class="story-description">
            ${this._truncateText(description, isCompact ? 100 : 150)}
          </p>
          
          <!-- Footer Actions -->
          <div class="story-footer">
            ${hasLocation ? `
              <button 
                class="btn-location" 
                data-lat="${lat}" 
                data-lon="${lon}"
                aria-label="Lihat lokasi di peta"
              >
                <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                <span>Lihat di Peta</span>
              </button>
            ` : `
              <div class="no-location">
                <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                <span>Tidak ada lokasi</span>
              </div>
            `}
            
            <button class="btn-view-detail" aria-label="Lihat detail cerita">
              <span>Selengkapnya</span>
              <i class="fas fa-arrow-right" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </article>
    `;

    // Attach event listeners after render
    this._attachEventListeners();
  }

  /**
   * Render empty state
   */
  _renderEmpty() {
    this.innerHTML = `
      <article class="story-card empty">
        <div class="empty-state">
          <i class="fas fa-image"></i>
          <p>No story data available</p>
        </div>
      </article>
    `;
  }

  /**
   * Attach event listeners to interactive elements
   */
  _attachEventListeners() {
    // Location button
    const locationBtn = this.querySelector('.btn-location');
    if (locationBtn) {
      locationBtn.addEventListener('click', this._handleLocationClick);
    }

    // Image load/error
    const image = this.querySelector('.story-image');
    if (image) {
      image.addEventListener('load', this._handleImageLoad);
      image.addEventListener('error', this._handleImageError);
    }

    // Favorite button
    const favoriteBtn = this.querySelector('.btn-favorite-modern');
    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', this._handleFavoriteClick);
    }

    // Share button
    const shareBtn = this.querySelector('.btn-share-glass');
    if (shareBtn) {
      shareBtn.addEventListener('click', this._handleShareClick);
    }

    // View detail button
    const detailBtn = this.querySelector('.btn-view-detail');
    if (detailBtn) {
      detailBtn.addEventListener('click', () => {
        this._dispatchEvent('story-detail-click', this._story);
      });
    }
  }

  /**
   * Remove event listeners
   */
  _removeEventListeners() {
    const locationBtn = this.querySelector('.btn-location');
    if (locationBtn) {
      locationBtn.removeEventListener('click', this._handleLocationClick);
    }

    const image = this.querySelector('.story-image');
    if (image) {
      image.removeEventListener('load', this._handleImageLoad);
      image.removeEventListener('error', this._handleImageError);
    }

    const favoriteBtn = this.querySelector('.btn-favorite-modern');
    if (favoriteBtn) {
      favoriteBtn.removeEventListener('click', this._handleFavoriteClick);
    }

    const shareBtn = this.querySelector('.btn-share-glass');
    if (shareBtn) {
      shareBtn.removeEventListener('click', this._handleShareClick);
    }
  }

  /**
   * Handle location button click
   */
  _handleLocationClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const btn = event.currentTarget;
    const lat = parseFloat(btn.dataset.lat);
    const lon = parseFloat(btn.dataset.lon);
    
    if (isNaN(lat) || isNaN(lon)) {
      console.error('StoryCard: Invalid coordinates');
      return;
    }

    this._dispatchEvent('story-location-click', {
      ...this._story,
      lat,
      lon
    });
  }

  /**
   * Handle image load
   */
  _handleImageLoad() {
    this._imageLoaded = true;
    const img = this.querySelector('.story-image');
    if (img) {
      img.classList.add('loaded');
    }
  }

  /**
   * Handle image error
   */
  _handleImageError() {
    console.warn('StoryCard: Failed to load image', this._story?.photoUrl);
    
    const img = this.querySelector('.story-image');
    if (img) {
      img.src = this._getPlaceholderImage();
      img.alt = 'Image not available';
    }
  }

  /**
   * Handle favorite button click
   */
  async _handleFavoriteClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const btn = event.currentTarget;
    const isFavorited = btn.classList.contains('active');
    
    if (!window.indexedDBHelper) {
      console.error('StoryCard: IndexedDB helper not available');
      return;
    }

    try {
      if (isFavorited) {
        // Remove from favorites
        await window.indexedDBHelper.removeFromFavorites(this._story.id);
        btn.classList.remove('active');
        btn.setAttribute('aria-label', 'Tambah ke favorit');
        btn.setAttribute('title', 'Tambah ke favorit');
        
        if (window.showToast) {
          window.showToast('Dihapus dari favorit', 'info');
        }
      } else {
        // Add to favorites
        await window.indexedDBHelper.addToFavorites(this._story);
        btn.classList.add('active');
        btn.setAttribute('aria-label', 'Hapus dari favorit');
        btn.setAttribute('title', 'Hapus dari favorit');
        
        if (window.showToast) {
          window.showToast('✅ Ditambahkan ke favorit', 'success');
        }
      }

      this._dispatchEvent('story-favorite-toggle', {
        story: this._story,
        isFavorited: !isFavorited
      });
    } catch (error) {
      console.error('StoryCard: Error toggling favorite', error);
      
      if (window.showToast) {
        window.showToast('Gagal mengubah favorit', 'error');
      }
    }
  }

  /**
   * Handle share button click
   */
  async _handleShareClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const shareData = {
      title: this._story.name,
      text: this._story.description,
      url: window.location.href
    };

    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('StoryCard: Shared successfully');
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('StoryCard: Error sharing', error);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        
        if (window.showToast) {
          window.showToast('✅ Link disalin ke clipboard', 'success');
        }
      } catch (error) {
        console.error('StoryCard: Error copying to clipboard', error);
        
        if (window.showToast) {
          window.showToast('Gagal menyalin link', 'error');
        }
      }
    }

    this._dispatchEvent('story-share-click', this._story);
  }

  /**
   * Dispatch custom event
   */
  _dispatchEvent(eventName, detail) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true
    });
    
    this.dispatchEvent(event);
    console.log(`StoryCard: Dispatched ${eventName}`, detail);
  }

  /**
   * Add component styles
   */
  _addStyles() {
    if (document.getElementById('story-card-styles')) return;

    const style = document.createElement('style');
    style.id = 'story-card-styles';
    style.textContent = `
      /* Story Card Styles */
      .story-card {
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .story-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      /* Image Container */
      .story-image-container {
        position: relative;
        width: 100%;
        padding-top: 66.67%; /* 3:2 aspect ratio */
        overflow: hidden;
        background: #f0f0f0;
        isolation: isolate; /* Create stacking context */
      }

      .story-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
        opacity: 0;
      }

      .story-image.loaded {
        opacity: 1;
      }

      .story-card:hover .story-image {
        transform: scale(1.05);
      }

      /* Modern Favorite Button - Top Right */
      .btn-favorite-modern {
        position: absolute !important;
        top: 16px !important;
        right: 16px !important;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 100 !important;
        pointer-events: auto;
      }

      .btn-favorite-modern:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        background: rgba(255, 255, 255, 1);
      }

      .btn-favorite-modern:active {
        transform: scale(0.95);
      }

      /* Heart Icon SVG */
      .heart-icon {
        width: 24px;
        height: 24px;
        position: relative;
      }

      .heart-outline {
        fill: none;
        stroke: #ff5e5b;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        transition: all 0.3s ease;
      }

      .heart-fill {
        fill: transparent;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform-origin: center;
        transform: scale(0);
      }

      /* Active State - Filled Heart */
      .btn-favorite-modern.active {
        background: linear-gradient(135deg, #ff5e5b 0%, #ff9a9e 100%);
        animation: heartBeat 0.5s ease;
      }

      .btn-favorite-modern.active .heart-outline {
        stroke: white;
        fill: white;
      }

      .btn-favorite-modern.active .heart-fill {
        fill: white;
        transform: scale(1);
      }

      /* Heart Beat Animation */
      @keyframes heartBeat {
        0%, 100% {
          transform: scale(1);
        }
        25% {
          transform: scale(1.2);
        }
        50% {
          transform: scale(0.95);
        }
        75% {
          transform: scale(1.1);
        }
      }

      /* Favorite Count Badge */
      .favorite-count {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #ff5e5b;
        color: white;
        font-size: 0.7rem;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 10px;
        min-width: 20px;
        text-align: center;
        box-shadow: 0 2px 6px rgba(255, 94, 91, 0.4);
      }

      /* Glass Effect Share Button */
      .btn-action-glass {
        position: absolute !important;
        top: 76px !important;
        right: 16px !important;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        opacity: 0;
        transform: translateY(-10px);
        z-index: 99 !important;
        pointer-events: auto;
      }

      .story-card:hover .btn-action-glass {
        opacity: 1;
        transform: translateY(0);
        transition-delay: 0.1s;
      }

      .btn-action-glass i {
        color: #3a86ff;
        font-size: 1.1rem;
      }

      .btn-action-glass:hover {
        transform: scale(1.1) translateY(0);
        background: rgba(255, 255, 255, 0.4);
        box-shadow: 0 6px 20px rgba(58, 134, 255, 0.3);
      }

      .btn-action-glass:active {
        transform: scale(0.95) translateY(0);
      }

      /* Modern Location Badge */
      .location-badge-modern {
        position: absolute !important;
        bottom: 16px !important;
        left: 16px !important;
        background: linear-gradient(135deg, rgba(58, 134, 255, 0.95) 0%, rgba(131, 56, 236, 0.95) 100%);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: white;
        padding: 8px 14px;
        border-radius: 24px;
        font-size: 0.85rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 16px rgba(58, 134, 255, 0.4);
        transition: all 0.3s ease;
        z-index: 98 !important;
        pointer-events: auto;
      }

      .location-badge-modern:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(58, 134, 255, 0.5);
      }

      .location-icon-wrapper {
        width: 24px;
        height: 24px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .location-icon-wrapper i {
        font-size: 0.85rem;
      }

      .location-text {
        letter-spacing: 0.3px;
      }

      /* Story Content */
      .story-content {
        padding: 1.25rem;
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .story-header {
        margin-bottom: 0.75rem;
      }

      .story-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1d3557;
        margin: 0 0 0.5rem 0;
        line-height: 1.3;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .story-meta {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;
        color: #6c757d;
      }

      .story-author {
        display: flex;
        align-items: center;
        gap: 0.35rem;
      }

      .story-separator {
        opacity: 0.5;
      }

      .story-description {
        font-size: 0.95rem;
        line-height: 1.6;
        color: #4a5568;
        margin: 0 0 1rem 0;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }

      /* Story Footer */
      .story-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e9ecef;
        margin-top: auto;
      }

      .btn-location,
      .btn-view-detail {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-location {
        background: rgba(58, 134, 255, 0.1);
        color: #3a86ff;
      }

      .btn-location:hover {
        background: #3a86ff;
        color: white;
        transform: translateX(-2px);
      }

      .btn-view-detail {
        background: transparent;
        color: #6c757d;
        padding: 0.5rem;
      }

      .btn-view-detail:hover {
        color: #3a86ff;
        transform: translateX(2px);
      }

      .no-location {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;
        color: #adb5bd;
      }

      /* Compact Mode */
      .story-card.compact {
        flex-direction: row;
        max-height: 200px;
      }

      .story-card.compact .story-image-container {
        width: 250px;
        padding-top: 0;
        flex-shrink: 0;
      }

      .story-card.compact .story-image {
        position: relative;
      }

      .story-card.compact .story-content {
        padding: 1rem;
      }

      .story-card.compact .story-description {
        -webkit-line-clamp: 2;
      }

      /* Empty State */
      .story-card.empty {
        min-height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .empty-state {
        text-align: center;
        color: #adb5bd;
      }

      .empty-state i {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .story-card.compact {
          flex-direction: column;
          max-height: none;
        }

        .story-card.compact .story-image-container {
          width: 100%;
          padding-top: 66.67%;
        }

        .story-title {
          font-size: 1.1rem;
        }

        .story-description {
          font-size: 0.9rem;
        }

        .story-footer {
          flex-direction: column;
          gap: 0.5rem;
        }

        .btn-location,
        .btn-view-detail {
          width: 100%;
          justify-content: center;
        }

        /* Mobile adjustments for buttons */
        .btn-favorite-modern,
        .btn-action-glass {
          width: 44px;
          height: 44px;
        }

        .btn-favorite-modern {
          top: 12px;
          right: 12px;
        }

        .btn-action-glass {
          top: 68px;
          right: 12px;
        }

        .location-badge-modern {
          bottom: 12px;
          left: 12px;
          font-size: 0.8rem;
          padding: 6px 12px;
        }

        .location-icon-wrapper {
          width: 20px;
          height: 20px;
        }

        .location-text {
          display: none;
        }
      }

      /* Animations */
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .story-card {
        animation: fadeIn 0.5s ease backwards;
      }

      /* Accessibility */
      .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      /* Focus styles */
      .btn-favorite-modern:focus-visible,
      .btn-action-glass:focus-visible,
      .btn-location:focus-visible,
      .btn-view-detail:focus-visible {
        outline: 3px solid #3a86ff;
        outline-offset: 3px;
      }
    `;

    document.head.appendChild(style);
  }
}

// Define the custom element
customElements.define('story-card', StoryCard);

// Export for module usage
window.StoryCard = StoryCard;
export default StoryCard;