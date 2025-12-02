// src/scripts/components/navbar.js - Professional Navigation Component

class Navbar {
  constructor() {
    this.navToggle = null;
    this.navMenu = null;
    this.authNavItems = null;
    this.guestNavItems = null;
    this.isMenuOpen = false;
    this.scrollThreshold = 50;
    this.lastScrollTop = 0;
    
    this._init();
  }

  /**
   * Initialize navbar component
   */
  _init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._setup());
    } else {
      this._setup();
    }
  }

  /**
   * Setup navbar after DOM is ready
   */
  _setup() {
    console.log('Navbar: Initializing...');
    
    // Cache DOM elements
    this._cacheElements();
    
    // Bind all events
    this._bindEvents();
    
    // Initialize auth state
    this._updateAuthState();
    
    // Update active link
    this._updateActiveLink();
    
    // Add scroll effect
    this._setupScrollEffect();
    
    console.log('Navbar: Ready');
  }

  /**
   * Cache DOM elements for better performance
   */
  _cacheElements() {
    this.navToggle = document.getElementById('navToggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.authNavItems = document.querySelectorAll('.nav-item-auth');
    this.guestNavItems = document.querySelectorAll('.nav-item-guest');
    this.logoutBtn = document.getElementById('logoutBtn');
  }

  /**
   * Bind all event listeners
   */
  _bindEvents() {
    // Mobile toggle
    this._bindMobileToggle();
    
    // Close on outside click
    this._bindOutsideClick();
    
    // Close on link click (mobile)
    this._bindLinkClick();
    
    // Logout button
    this._bindLogout();
    
    // Hash change for SPA routing
    this._bindHashChange();
    
    // Auth change events
    this._bindAuthChange();
    
    // Keyboard navigation
    this._bindKeyboardNav();
  }

  /**
   * Bind mobile toggle button
   */
  _bindMobileToggle() {
    if (!this.navToggle || !this.navMenu) return;
    
    this.navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this._toggleMenu();
    });
  }

  /**
   * Toggle mobile menu
   */
  _toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    // Update classes
    this.navMenu.classList.toggle('active', this.isMenuOpen);
    document.body.classList.toggle('menu-open', this.isMenuOpen);
    
    // Update ARIA attributes
    this.navToggle.setAttribute('aria-expanded', this.isMenuOpen.toString());
    
    // Update icon
    const icon = this.navToggle.querySelector('i');
    if (icon) {
      icon.className = this.isMenuOpen ? 'fas fa-times' : 'fas fa-bars';
    }
    
    // Prevent body scroll when menu is open
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    console.log(`Navbar: Menu ${this.isMenuOpen ? 'opened' : 'closed'}`);
  }

  /**
   * Close menu
   */
  _closeMenu() {
    if (!this.isMenuOpen) return;
    
    this.isMenuOpen = false;
    this.navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
    this.navToggle.setAttribute('aria-expanded', 'false');
    
    const icon = this.navToggle.querySelector('i');
    if (icon) {
      icon.className = 'fas fa-bars';
    }
    
    document.body.style.overflow = '';
  }

  /**
   * Bind outside click to close menu
   */
  _bindOutsideClick() {
    document.addEventListener('click', (e) => {
      if (!this.isMenuOpen) return;
      
      // Check if click is outside menu and toggle button
      if (!e.target.closest('.nav-menu') && !e.target.closest('#navToggle')) {
        this._closeMenu();
      }
    });
  }

  /**
   * Bind link clicks to close menu on mobile
   */
  _bindLinkClick() {
    if (!this.navMenu) return;
    
    const links = this.navMenu.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        // Close menu when link is clicked (on mobile)
        if (window.innerWidth <= 768) {
          setTimeout(() => this._closeMenu(), 100);
        }
      });
    });
  }

  /**
   * Bind logout button
   */
  _bindLogout() {
    if (!this.logoutBtn) return;
    
    this.logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this._handleLogout();
    });
  }

  /**
   * Handle logout
   */
  _handleLogout() {
    console.log('Navbar: Logging out...');
    
    // Confirm logout
    if (!confirm('Apakah Anda yakin ingin keluar?')) {
      return;
    }
    
    // Clear auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    
    // Dispatch auth change event
    window.dispatchEvent(new Event('authChanged'));
    
    // Show toast if available
    if (window.showToast) {
      window.showToast('✅ Berhasil logout', 'success');
    }
    
    // Redirect to login
    setTimeout(() => {
      window.location.hash = '#/masuk';
    }, 500);
    
    console.log('Navbar: Logged out');
  }

  /**
   * Bind hash change event
   */
  _bindHashChange() {
    window.addEventListener('hashchange', () => {
      this._updateActiveLink();
      this._closeMenu(); // Close menu on route change
    });
  }

  /**
   * Bind auth change event
   */
  _bindAuthChange() {
    window.addEventListener('authChanged', () => {
      console.log('Navbar: Auth state changed');
      this._updateAuthState();
    });
  }

  /**
   * Bind keyboard navigation (ESC to close menu)
   */
  _bindKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      // Close menu on ESC
      if (e.key === 'Escape' && this.isMenuOpen) {
        this._closeMenu();
      }
      
      // Focus trap in mobile menu
      if (this.isMenuOpen && e.key === 'Tab') {
        this._handleTabKey(e);
      }
    });
  }

  /**
   * Handle tab key for focus trap in mobile menu
   */
  _handleTabKey(e) {
    if (window.innerWidth > 768) return;
    
    const focusableElements = this.navMenu.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  /**
   * Update auth state (show/hide nav items)
   */
  _updateAuthState() {
    const isLoggedIn = this._isAuthenticated();
    
    console.log(`Navbar: Auth state = ${isLoggedIn ? 'Logged In' : 'Guest'}`);
    
    // Show/hide auth items
    this.authNavItems.forEach(item => {
      item.style.display = isLoggedIn ? '' : 'none';
    });
    
    // Show/hide guest items
    this.guestNavItems.forEach(item => {
      item.style.display = isLoggedIn ? 'none' : '';
    });
    
    // Update user info if logged in
    if (isLoggedIn) {
      this._updateUserInfo();
    }
  }

  /**
   * Update user info in navbar
   */
  _updateUserInfo() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    
    try {
      const user = JSON.parse(userStr);
      
      // Update logout button with user name
      if (this.logoutBtn) {
        const userName = user.name || 'User';
        const userNameSpan = this.logoutBtn.querySelector('span');
        
        if (userNameSpan && !userNameSpan.textContent.includes('Keluar')) {
          // Create user dropdown or keep simple
          // For now, keep simple with just logout
        }
      }
    } catch (error) {
      console.error('Navbar: Failed to parse user data', error);
    }
  }

  /**
   * Update active link based on current route
   */
  _updateActiveLink() {
    const currentHash = window.location.hash || '#/';
    const navLinks = this.navMenu?.querySelectorAll('a[href^="#"]') || [];
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === currentHash || 
                      (currentHash === '#/' && href === '#/') ||
                      (currentHash.startsWith(href) && href !== '#/');
      
      // Update active state
      link.classList.toggle('active', isActive);
      
      // Update ARIA attribute
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Setup scroll effect (hide/show on scroll)
   */
  _setupScrollEffect() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this._handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /**
   * Handle scroll behavior
   */
  _handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const header = document.querySelector('.app-header');
    
    if (!header) return;
    
    // Add shadow when scrolled
    if (scrollTop > this.scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide on scroll down, show on scroll up (optional)
    if (Math.abs(scrollTop - this.lastScrollTop) > 5) {
      if (scrollTop > this.lastScrollTop && scrollTop > 100) {
        header.classList.add('nav-hidden');
      } else {
        header.classList.remove('nav-hidden');
      }
    }
    
    this.lastScrollTop = scrollTop;
  }

  /**
   * Check if user is authenticated
   */
  _isAuthenticated() {
    const token = localStorage.getItem('token');
    return token !== null && token !== '';
  }

  /**
   * Public method to update auth state (for external use)
   */
  updateAuthState() {
    this._updateAuthState();
  }

  /**
   * Public method to close menu (for external use)
   */
  closeMenu() {
    this._closeMenu();
  }

  /**
   * Add scroll effect styles dynamically
   */
  static addScrollStyles() {
    if (document.getElementById('navbarScrollStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'navbarScrollStyles';
    style.textContent = `
      /* Navbar scroll effects */
      .app-header {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .app-header.scrolled {
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .app-header.nav-hidden {
        transform: translateY(-100%);
      }

      /* Mobile menu overlay */
      body.menu-open::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 98;
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      /* Active link styling */
      .nav-menu a.active {
        background-color: rgba(58, 134, 255, 0.1);
        color: var(--color-primary);
        font-weight: 600;
      }

      .nav-menu a.active::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 60%;
        background-color: var(--color-primary);
        border-radius: 0 4px 4px 0;
      }

      /* Smooth transitions */
      .nav-menu a {
        position: relative;
        transition: all 0.3s ease;
      }

      /* Focus styles for accessibility */
      .nav-menu a:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }

      #navToggle:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
    `;
    
    document.head.appendChild(style);
  }
}

// Add scroll styles
Navbar.addScrollStyles();

// Initialize navbar
const navbar = new Navbar();
window.Navbar = Navbar;

// Export for module usage
export default Navbar;