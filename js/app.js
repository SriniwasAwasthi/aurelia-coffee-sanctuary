/* ==========================================================================
   AURELIA — Haute Roastery & Coffee Sanctuary
   Core Application Controller (Ultra-Luxury & Interactive Edition)
   ========================================================================== */

import { MENU_ITEMS, CUPPING_FLIGHT_LOTS } from './menu-data.js?v=20260921_1';
import { CoffeeSommelier } from './sommelier.js?v=20260921_1';
import { ReservationManager } from './reservation.js?v=20260921_1';
import { AmbientSoundscape } from './audio-player.js?v=20260921_1';

class AureliaApp {
  constructor() {
    this.cart = [];
    this.activeCategory = 'all';
    this.activeGalleryCategory = 'all';
    this.searchQuery = '';
    this.currentLightboxIndex = 0;
    this.selectedFlightLots = ['flight-geisha', 'flight-yirgacheffe', 'flight-bourbon'];

    this.galleryImages = [
      {
        src: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85",
        category: "barista",
        title: "The Main Sanctuary & Barista Bar",
        caption: "Polished Italian Carrara marble, custom brushed brass Kees van der Westen espresso machines, and amber backlighting."
      },
      {
        src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85",
        category: "salon",
        title: "The Velvet Library Lounge",
        caption: "Deep emerald velvet banquettes, floor-to-ceiling specialty coffee library, and bespoke acoustic treatment."
      },
      {
        src: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=85",
        category: "salon",
        title: "The Sunlit Courtyard Veranda",
        caption: "A tranquil botanical haven bathed in natural morning light, surrounded by live coffee plants and jasmine vines."
      },
      {
        src: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=85",
        category: "roaster",
        title: "The Cast-Iron Roasting Drum",
        caption: "Our custom 1968 Probat drum roaster where small micro-lots are gently roasted to peak caramelization."
      },
      {
        src: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=85",
        category: "barista",
        title: "The Copper Drip Cupping Bar",
        caption: "Individual barista stations dedicated to precision V60, Chemex, and siphon extractions at 92°C."
      },
      {
        src: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85",
        category: "salon",
        title: "Evening Candlelit Lounge",
        caption: "As dusk descends, warm candlelight fills the salon alongside affogatos and chilled nitro infusions."
      },
      {
        src: "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=1200&q=85",
        category: "barista",
        title: "The Barista Precision Dial-in",
        caption: "Micro-adjustments of grind micron size and water temperature for optimal single-origin extraction."
      },
      {
        src: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=85",
        category: "salon",
        title: "The Morning Table Setting",
        caption: "Linen napkins, hand-turned stoneware ceramics, and fresh morning viennoiseries straight from our bakehouse."
      }
    ];

    this.activeGalleryCategory = 'all';
    this.isManualScroll = false;
    this.scrollTimeout = null;

    this.init();
  }

  init() {
    this.updateOpeningStatus();
    this.renderMenu();
    this.renderCuppingFlight();
    this.renderGalleryGrid();
    this.bindEvents();
    this.initNavigationHighlighting();
    this.initScrollSpy();
    this.initSubmodules();
    this.loadPersistedCart();
  }

  updateOpeningStatus() {
    const statusElement = document.getElementById('live-opening-status');
    if (!statusElement) return;

    const now = new Date();
    const currentHour = now.getHours();

    // Cafe hours: 7:00 to 22:00 (7 AM to 10 PM)
    const isOpen = currentHour >= 7 && currentHour < 22;

    if (isOpen) {
      statusElement.innerHTML = `
        <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 status-dot-pulse"></span>
        <span class="text-emerald-300 font-semibold">Open Now</span>
        <span class="text-gold-500/40">•</span>
        <span class="text-stone-300">Welcoming Guests Until 10:00 PM</span>
      `;
    } else {
      const nextOpenText = currentHour < 7 ? 'Opening Today at 7:00 AM' : 'Opening Tomorrow at 7:00 AM';
      statusElement.innerHTML = `
        <span class="inline-block w-2.5 h-2.5 rounded-full bg-amber-400"></span>
        <span class="text-amber-300 font-semibold">Currently Closed</span>
        <span class="text-gold-500/40">•</span>
        <span class="text-stone-400">${nextOpenText}</span>
      `;
    }
  }

  initSubmodules() {
    // Sommelier
    const sommelier = new CoffeeSommelier();
    sommelier.init();

    // Reservation Manager
    new ReservationManager('vip-reservation-form', 'vip-pass-modal-root');

    // Ambient Soundscape
    new AmbientSoundscape('btn-audio-toggle', 'sound-equalizer');
  }

  bindEvents() {
    // Global Keyboard listener for Accessibility
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      } else if (e.key === 'ArrowLeft') {
        const lightbox = document.getElementById('lightbox-modal-root');
        if (lightbox && lightbox.innerHTML.trim() !== '') {
          this.navigateLightbox(-1);
        }
      } else if (e.key === 'ArrowRight') {
        const lightbox = document.getElementById('lightbox-modal-root');
        if (lightbox && lightbox.innerHTML.trim() !== '') {
          this.navigateLightbox(1);
        }
      }
    });

    // Global Event Listeners
    window.addEventListener('aurelia:add-to-tray', (e) => {
      this.addToCart(e.detail.item);
    });

    window.addEventListener('aurelia:toast', (e) => {
      this.showToast(e.detail.title, e.detail.message, e.detail.type);
    });

    // Category Filter Buttons
    const filterBtns = document.querySelectorAll('[data-menu-filter]');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.getAttribute('data-menu-filter');
        this.activeCategory = cat;

        filterBtns.forEach(b => {
          b.classList.remove('bg-gold-500', 'text-stone-950', 'font-bold');
          b.classList.add('bg-stone-900/60', 'text-gold-200/80', 'border-gold-500/20');
        });

        e.currentTarget.classList.remove('bg-stone-900/60', 'text-gold-200/80', 'border-gold-500/20');
        e.currentTarget.classList.add('bg-gold-500', 'text-stone-950', 'font-bold');

        this.renderMenu();
      });
    });

    // Gallery Category Filter Buttons
    const galleryBtns = document.querySelectorAll('[data-gallery-filter]');
    galleryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.getAttribute('data-gallery-filter');
        this.activeGalleryCategory = cat;

        galleryBtns.forEach(b => {
          b.classList.remove('bg-gold-500', 'text-stone-950', 'font-bold');
          b.classList.add('bg-stone-900/60', 'text-gold-200/80', 'border-gold-500/20');
        });

        e.currentTarget.classList.remove('bg-stone-900/60', 'text-gold-200/80', 'border-gold-500/20');
        e.currentTarget.classList.add('bg-gold-500', 'text-stone-950', 'font-bold');

        this.renderGalleryGrid();
      });
    });

    // Menu Search Input
    const searchInput = document.getElementById('menu-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderMenu();
      });
    }

    // Cart Drawer Toggles
    const cartToggleBtn = document.getElementById('btn-open-cart');
    const closeCartBtn = document.getElementById('btn-close-cart');
    const cartOverlay = document.getElementById('cart-drawer-overlay');

    if (cartToggleBtn) cartToggleBtn.addEventListener('click', () => this.toggleCartDrawer(true));
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => this.toggleCartDrawer(false));
    if (cartOverlay) cartOverlay.addEventListener('click', () => this.toggleCartDrawer(false));

    // Cart Checkout
    const btnCheckout = document.getElementById('btn-checkout-tray');
    if (btnCheckout) {
      btnCheckout.addEventListener('click', () => this.handleCheckout());
    }

    // Gallery Lightbox clicks initial
    this.bindGalleryClicks();

    // Mobile Navigation Drawer Toggle
    const mobileMenuBtn = document.getElementById('btn-mobile-menu');
    const mobileMenuCloseBtn = document.getElementById('btn-close-mobile-nav');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

    if (mobileMenuBtn && mobileNavDrawer) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('hidden');
      });
    }
    if (mobileMenuCloseBtn && mobileNavDrawer) {
      mobileMenuCloseBtn.addEventListener('click', () => {
        mobileNavDrawer.classList.add('hidden');
      });
    }
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileNavDrawer) mobileNavDrawer.classList.add('hidden');
      });
    });

    // Newsletter VIP Subscription
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput?.value.trim();
        if (email) {
          this.showToast(
            'VIP Sanctuary Access Granted',
            `Welcome to Aurelia Gazette. A complimentary cupping voucher has been dispatched to ${email}.`,
            'success'
          );
          emailInput.value = '';
        }
      });
    }

    // Copy Address Button
    const copyAddrBtn = document.getElementById('btn-copy-address');
    if (copyAddrBtn) {
      copyAddrBtn.addEventListener('click', () => {
        const text = '742 Grand Boulevard, Haute Atelier District, Suite 100';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).catch(() => {});
        }
        this.showToast('Address Copied', 'Sanctuary coordinates copied to clipboard.', 'success');
      });
    }
  }

  /* ==========================================================================
     NAVIGATION ACTIVE STATE MANAGEMENT & SCROLL-DRIVEN HIGHLIGHTING
     ========================================================================== */

  initNavigationHighlighting() {
    // Desktop Nav Links
    const desktopLinks = document.querySelectorAll('.desktop-nav-link');
    desktopLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          this.navigateToSection(targetId);
        }
      });
    });

    // Mobile Nav Links
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const mobileDrawer = document.getElementById('mobile-nav-drawer');
          if (mobileDrawer) mobileDrawer.classList.add('hidden');
          this.navigateToSection(targetId);
        }
      });
    });
  }

  navigateToSection(sectionId) {
    const targetEl = document.getElementById(sectionId);
    if (!targetEl) return;

    this.isManualScroll = true;
    clearTimeout(this.scrollTimeout);

    // Immediately highlight clicked tab in yellow, all others in white
    this.setActiveNav(sectionId);

    // Smooth scroll with sticky navbar offset
    const navHeight = 85;
    const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
    window.scrollTo({
      top: Math.max(0, targetPos),
      behavior: 'smooth'
    });

    // Reset manual scroll lock after scroll finishes
    this.scrollTimeout = setTimeout(() => {
      this.isManualScroll = false;
    }, 850);
  }

  setActiveNav(sectionId) {
    if (!sectionId) {
      this.clearAllNavActive();
      return;
    }

    // Update Desktop Nav Links
    const desktopLinks = document.querySelectorAll('.desktop-nav-link');
    desktopLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.remove('nav-tab-inactive');
        link.classList.add('nav-tab-active');
      } else {
        link.classList.remove('nav-tab-active');
        link.classList.add('nav-tab-inactive');
      }
    });

    // Update Mobile Nav Links
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.remove('mobile-nav-inactive');
        link.classList.add('mobile-nav-active');
      } else {
        link.classList.remove('mobile-nav-active');
        link.classList.add('mobile-nav-inactive');
      }
    });
  }

  clearAllNavActive() {
    document.querySelectorAll('.desktop-nav-link').forEach(link => {
      link.classList.remove('nav-tab-active');
      link.classList.add('nav-tab-inactive');
    });
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.classList.remove('mobile-nav-active');
      link.classList.add('mobile-nav-inactive');
    });
  }

  initScrollSpy() {
    const sectionIds = [
      'craft',      // The Four Pillars of Aurelia (The Craft)
      'vault',      // The Tasting Vault
      'flight',     // The Cupping Flight Experience
      'sommelier',  // The Aurelia Coffee Sommelier
      'sanctuary',  // The Sanctuary Architecture Gallery
      'journal',    // The Aesthetic Journal Lookbook
      'reserve',    // Reserve Your Table & Cupping Flight
      'visit'       // Visit Aurelia Hours & Map
    ];

    const updateScrollSpy = () => {
      if (this.isManualScroll) return;

      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      // When near top of the page (Hero Section), all tabs remain in white
      if (scrollY < 240) {
        this.clearAllNavActive();
        return;
      }

      // Check if at the bottom of the page (Hours & Map section)
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      if (scrollY + windowHeight >= docHeight - 80) {
        this.setActiveNav('visit');
        return;
      }

      const triggerPoint = scrollY + (windowHeight * 0.35);
      let matchedSectionId = null;

      for (let i = 0; i < sectionIds.length; i++) {
        const sec = document.getElementById(sectionIds[i]);
        if (sec) {
          const top = sec.offsetTop;
          const height = sec.offsetHeight;
          if (triggerPoint >= top && triggerPoint < top + height) {
            matchedSectionId = sectionIds[i];
            break;
          }
        }
      }

      if (matchedSectionId) {
        this.setActiveNav(matchedSectionId);
      }
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollSpy();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial check on load
    updateScrollSpy();
  }

  closeAllModals() {
    ['flavor-modal-root', 'vip-pass-modal-root', 'lightbox-modal-root', 'checkout-modal-root'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '';
    });
    this.toggleCartDrawer(false);
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    if (mobileDrawer) mobileDrawer.classList.add('hidden');
  }

  bindGalleryClicks() {
    document.querySelectorAll('[data-gallery-index]').forEach(item => {
      item.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-gallery-index'), 10);
        this.openLightbox(idx);
      });
    });
  }

  getActiveGalleryItems() {
    if (this.activeGalleryCategory !== 'all') {
      return this.galleryImages.filter(i => i.category === this.activeGalleryCategory);
    }
    return this.galleryImages;
  }

  renderGalleryGrid() {
    const grid = document.getElementById('sanctuary-gallery-grid');
    if (!grid) return;

    const items = this.getActiveGalleryItems();

    grid.innerHTML = items.map((img, idx) => {
      return `
        <div data-gallery-index="${idx}" class="group relative h-80 rounded-3xl overflow-hidden border border-gold-500/20 cursor-pointer shadow-xl luxury-card">
          <img src="${img.src}" alt="${img.title}" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
          <div class="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-gold-500/30 flex items-center justify-center text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/></svg>
          </div>
          <div class="absolute bottom-6 left-6 right-6">
            <span class="text-[10px] uppercase tracking-widest text-gold-400 font-cinzel">Haute Sanctuary Space</span>
            <h3 class="text-lg font-cinzel font-bold text-stone-100 mt-1">${img.title}</h3>
          </div>
        </div>
      `;
    }).join('');

    this.bindGalleryClicks();
  }

  // CUPPING FLIGHT BUILDER
  renderCuppingFlight() {
    const container = document.getElementById('cupping-flight-container');
    if (!container) return;

    container.innerHTML = `
      <div class="glass-panel-deep p-8 md:p-12 rounded-3xl border border-gold-500/30 shadow-2xl relative overflow-hidden">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-gold-500/20 mb-8">
          <div>
            <span class="text-[11px] uppercase tracking-widest text-gold-400 font-cinzel">Exclusive Master Ritual</span>
            <h3 class="text-2xl sm:text-3xl font-cinzel font-bold text-stone-100 mt-1">Curate Your 3-Bean Cupping Flight</h3>
            <p class="text-stone-300 text-xs sm:text-sm mt-1 max-w-xl">
              Experience side-by-side extraction of rare single origins. Hand-poured tableside into crystal glasses at calibrated temperatures.
            </p>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <div class="text-[10px] uppercase tracking-widest text-stone-400 font-cinzel">Flight Price</div>
              <div class="text-2xl font-cinzel font-bold text-gold-400">$24.00</div>
            </div>
            <button
              type="button"
              id="btn-add-cupping-flight"
              class="btn-gold px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer shadow-xl whitespace-nowrap flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Add Flight to Tray
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          ${CUPPING_FLIGHT_LOTS.map(lot => {
            const isChecked = this.selectedFlightLots.includes(lot.id);
            return `
              <div
                data-flight-lot="${lot.id}"
                class="flight-lot-card p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isChecked
                    ? 'bg-gold-500/15 border-gold-400 shadow-lg shadow-gold-500/10'
                    : 'bg-stone-900/60 border-gold-500/15 hover:border-gold-500/40'
                }"
              >
                <div>
                  <div class="flex justify-between items-start mb-2">
                    <span class="text-[10px] font-cinzel uppercase px-2 py-0.5 rounded-full ${
                      isChecked ? 'bg-gold-500 text-stone-950 font-bold' : 'bg-stone-800 text-gold-300'
                    }">
                      ${lot.badge}
                    </span>
                    <div class="w-5 h-5 rounded-full border flex items-center justify-center ${
                      isChecked ? 'border-gold-400 bg-gold-500 text-stone-950' : 'border-stone-600'
                    }">
                      ${isChecked ? '✓' : ''}
                    </div>
                  </div>
                  <h5 class="text-sm font-cinzel font-bold text-stone-100 mb-1">${lot.name}</h5>
                  <p class="text-[11px] text-gold-400/80 font-mono mb-2">${lot.terroir}</p>
                </div>
                <p class="text-[11px] text-stone-300 line-clamp-2">${lot.profile}</p>
              </div>
            `;
          }).join('')}
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400 pt-2">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-gold-400"></span>
            <span>Select any <strong>3 rare micro-lots</strong> (${this.selectedFlightLots.length}/3 selected)</span>
          </div>
          <div class="text-stone-300">
            Served with hand-carved ice, mineral cleansing water, and cupping flavor note cards.
          </div>
        </div>
      </div>
    `;

    // Attach flight lot selection clicks
    container.querySelectorAll('[data-flight-lot]').forEach(card => {
      card.addEventListener('click', (e) => {
        const lotId = e.currentTarget.getAttribute('data-flight-lot');
        if (this.selectedFlightLots.includes(lotId)) {
          if (this.selectedFlightLots.length > 1) {
            this.selectedFlightLots = this.selectedFlightLots.filter(id => id !== lotId);
            this.renderCuppingFlight();
          } else {
            this.showToast('Minimum Selection', 'Please keep at least 1 lot in your flight.', 'info');
          }
        } else {
          if (this.selectedFlightLots.length < 3) {
            this.selectedFlightLots.push(lotId);
            this.renderCuppingFlight();
          } else {
            // Replace first
            this.selectedFlightLots.shift();
            this.selectedFlightLots.push(lotId);
            this.renderCuppingFlight();
          }
        }
      });
    });

    // Add flight to tray
    const addFlightBtn = container.querySelector('#btn-add-cupping-flight');
    if (addFlightBtn) {
      addFlightBtn.addEventListener('click', () => {
        const names = this.selectedFlightLots.map(id => CUPPING_FLIGHT_LOTS.find(l => l.id === id)?.name).filter(Boolean).join(', ');
        const flightItem = {
          id: `flight-custom-${Date.now()}`,
          name: "Aurelia 3-Bean Cupping Flight",
          category: "pourover",
          categoryName: "Master Cupping Flight",
          subtitle: names,
          price: 24.00,
          badge: "Curated Flight",
          image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=85",
          description: `Custom tableside cupping flight including: ${names}.`,
          origin: "Triple Terroir Flight",
          altitude: "1,800m - 2,100m",
          process: "Comparative Tasting",
          roastLevel: "Multi-Roast Spectrum",
          tastingNotes: ["Comparative Terroir", "Floral & Fruity", "Volcanic Depth"],
          metrics: { acidity: 90, body: 85, sweetness: 92, aroma: 98 },
          pairing: "Florentine Lace Cookies"
        };
        this.addToCart(flightItem);
      });
    }
  }

  renderMenu() {
    const menuGrid = document.getElementById('menu-items-grid');
    if (!menuGrid) return;

    let items = MENU_ITEMS;

    // Filter by category
    if (this.activeCategory !== 'all') {
      items = items.filter(i => i.category === this.activeCategory);
    }

    // Filter by search query
    if (this.searchQuery) {
      items = items.filter(i =>
        i.name.toLowerCase().includes(this.searchQuery) ||
        i.subtitle.toLowerCase().includes(this.searchQuery) ||
        i.description.toLowerCase().includes(this.searchQuery) ||
        i.tastingNotes.some(n => n.toLowerCase().includes(this.searchQuery))
      );
    }

    if (items.length === 0) {
      menuGrid.innerHTML = `
        <div class="col-span-full text-center py-16">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <h4 class="text-xl font-cinzel text-amber-100 font-bold mb-2">No Matching Creations Found</h4>
          <p class="text-stone-400 text-sm max-w-md mx-auto">Try refining your search terms or exploring one of our curated category tabs above.</p>
        </div>
      `;
      return;
    }

    menuGrid.innerHTML = items.map(item => `
      <div class="luxury-card rounded-3xl overflow-hidden flex flex-col group border border-gold-500/20">
        <!-- Image Container (Clickable for quick view) -->
        <div data-flavor-id="${item.id}" class="relative h-64 overflow-hidden cursor-pointer">
          <img
            src="${item.image}"
            alt="${item.name}"
            loading="lazy"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"></div>

          <!-- Top Badges -->
          <div class="absolute top-4 left-4 flex gap-2">
            <span class="px-3 py-1 rounded-full bg-stone-950/85 backdrop-blur-md text-[11px] font-cinzel text-gold-300 border border-gold-500/30 shadow-lg">
              ${item.badge}
            </span>
          </div>

          <!-- Price Badge -->
          <div class="absolute top-4 right-4 bg-gold-500 text-stone-950 px-3.5 py-1 rounded-full font-cinzel font-bold text-sm shadow-xl">
            $${item.price.toFixed(2)}
          </div>

          <!-- Category overlay -->
          <div class="absolute bottom-3 left-4 text-[11px] uppercase tracking-widest text-gold-400 font-cinzel">
            ${item.categoryName}
          </div>
        </div>

        <!-- Card Content -->
        <div class="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h4 data-flavor-id="${item.id}" class="text-xl font-cinzel font-bold text-amber-50 mb-1 group-hover:text-gold-300 transition-colors cursor-pointer">
              ${item.name}
            </h4>
            <p class="text-xs text-gold-200/70 font-playfair italic mb-3">${item.subtitle}</p>
            <p class="text-stone-300 text-xs md:text-sm leading-relaxed mb-4 line-clamp-3">${item.description}</p>

            <!-- Tasting Notes Pills -->
            <div class="flex flex-wrap gap-1.5 mb-5">
              ${item.tastingNotes.slice(0, 3).map(note => `
                <span class="px-2.5 py-0.5 rounded-md bg-amber-950/40 border border-gold-500/15 text-gold-200/90 text-[11px] font-sans">
                  ${note}
                </span>
              `).join('')}
              ${item.tastingNotes.length > 3 ? `
                <span class="px-2 py-0.5 rounded-md bg-stone-900 text-stone-400 text-[10px] self-center">
                  +${item.tastingNotes.length - 3}
                </span>
              ` : ''}
            </div>
          </div>

          <!-- Card Bottom Action Bar -->
          <div class="pt-4 border-t border-gold-500/15 flex items-center justify-between gap-2">
            <button
              type="button"
              data-flavor-id="${item.id}"
              class="text-xs font-cinzel uppercase tracking-wider text-gold-400/90 hover:text-gold-200 flex items-center gap-1.5 transition-colors cursor-pointer py-1.5"
            >
              <svg class="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Flavor Profile
            </button>

            <button
              type="button"
              data-add-tray-id="${item.id}"
              class="btn-gold px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Add to Tray
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach click listeners for flavor modals
    menuGrid.querySelectorAll('[data-flavor-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-flavor-id');
        const item = MENU_ITEMS.find(i => i.id === id);
        if (item) this.openFlavorProfileModal(item);
      });
    });

    // Attach click listeners for add to tray
    menuGrid.querySelectorAll('[data-add-tray-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-add-tray-id');
        const item = MENU_ITEMS.find(i => i.id === id);
        if (item) this.addToCart(item);
      });
    });
  }

  openFlavorProfileModal(item) {
    const modalRoot = document.getElementById('flavor-modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div id="flavor-modal-backdrop" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div class="relative w-full max-w-2xl glass-panel-deep p-8 md:p-10 rounded-3xl border border-gold-500/30 shadow-2xl modal-enter modal-enter-active">
          <!-- Close button -->
          <button type="button" id="btn-close-flavor-modal" class="absolute top-5 right-5 text-stone-400 hover:text-gold-300 transition-colors cursor-pointer">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          <!-- Top header -->
          <div class="flex items-start gap-5 mb-6 pb-6 border-b border-gold-500/20">
            <img src="${item.image}" alt="${item.name}" class="w-24 h-24 rounded-2xl object-cover border border-gold-500/30 shadow-lg" />
            <div class="flex-1">
              <span class="text-xs uppercase tracking-widest text-gold-400 font-cinzel">${item.categoryName}</span>
              <h3 class="text-2xl font-cinzel font-bold text-amber-50 mt-1">${item.name}</h3>
              <p class="text-xs text-gold-200/70 font-playfair italic mb-2">${item.subtitle}</p>
              <div class="text-lg font-cinzel font-bold text-gold-400">$${item.price.toFixed(2)}</div>
            </div>
          </div>

          <!-- Terroir Details -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <div class="p-3 rounded-xl bg-stone-950/60 border border-gold-500/15">
              <div class="text-[10px] uppercase tracking-wider text-gold-300/70 font-cinzel">Origin / Terroir</div>
              <div class="text-xs text-stone-200 font-medium mt-1 truncate">${item.origin}</div>
            </div>
            <div class="p-3 rounded-xl bg-stone-950/60 border border-gold-500/15">
              <div class="text-[10px] uppercase tracking-wider text-gold-300/70 font-cinzel">Elevation</div>
              <div class="text-xs text-stone-200 font-medium mt-1">${item.altitude}</div>
            </div>
            <div class="p-3 rounded-xl bg-stone-950/60 border border-gold-500/15 col-span-2 sm:col-span-1">
              <div class="text-[10px] uppercase tracking-wider text-gold-300/70 font-cinzel">Harvest Process</div>
              <div class="text-xs text-stone-200 font-medium mt-1 truncate">${item.process}</div>
            </div>
          </div>

          <!-- Sensory Radar & Metrics -->
          <div class="bg-stone-950/70 p-5 rounded-2xl border border-gold-500/20 mb-6">
            <div class="text-xs uppercase tracking-widest text-gold-300 font-cinzel mb-4 flex items-center justify-between">
              <span>Sensory Profiler (Cupping Score)</span>
              <span class="text-gold-400 text-xs font-mono">Q-Grade Standard</span>
            </div>

            <div class="space-y-3.5">
              <!-- Acidity -->
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-stone-300">Vibrant Acidity / Brightness</span>
                  <span class="text-gold-400 font-mono">${item.metrics.acidity}%</span>
                </div>
                <div class="h-2 w-full bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                  <div class="h-full bg-gradient-to-r from-amber-600 to-gold-400 rounded-full transition-all duration-700" style="width: ${item.metrics.acidity}%"></div>
                </div>
              </div>

              <!-- Body -->
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-stone-300">Body & Tactile Mouthfeel</span>
                  <span class="text-gold-400 font-mono">${item.metrics.body}%</span>
                </div>
                <div class="h-2 w-full bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                  <div class="h-full bg-gradient-to-r from-amber-600 to-gold-400 rounded-full transition-all duration-700" style="width: ${item.metrics.body}%"></div>
                </div>
              </div>

              <!-- Sweetness -->
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-stone-300">Natural Caramel Sweetness</span>
                  <span class="text-gold-400 font-mono">${item.metrics.sweetness}%</span>
                </div>
                <div class="h-2 w-full bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                  <div class="h-full bg-gradient-to-r from-amber-600 to-gold-400 rounded-full transition-all duration-700" style="width: ${item.metrics.sweetness}%"></div>
                </div>
              </div>

              <!-- Aroma -->
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-stone-300">Aromatic Intensity</span>
                  <span class="text-gold-400 font-mono">${item.metrics.aroma}%</span>
                </div>
                <div class="h-2 w-full bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                  <div class="h-full bg-gradient-to-r from-amber-600 to-gold-400 rounded-full transition-all duration-700" style="width: ${item.metrics.aroma}%"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Action -->
          <div class="flex items-center justify-between gap-4">
            <div class="text-xs text-stone-400">
              Ideal Pairing: <strong class="text-gold-200">${item.pairing}</strong>
            </div>
            <button
              type="button"
              id="btn-modal-add-tray"
              class="btn-gold px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Add to Tasting Tray
            </button>
          </div>
        </div>
      </div>
    `;

    const closeBtn = modalRoot.querySelector('#btn-close-flavor-modal');
    if (closeBtn) closeBtn.addEventListener('click', () => { modalRoot.innerHTML = ''; });

    const backdrop = modalRoot.querySelector('#flavor-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) modalRoot.innerHTML = '';
      });
    }

    const addBtn = modalRoot.querySelector('#btn-modal-add-tray');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.addToCart(item);
        modalRoot.innerHTML = '';
      });
    }
  }

  // CART (TASTING TRAY) MANAGEMENT
  addToCart(item) {
    const existing = this.cart.find(c => c.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({ ...item, quantity: 1 });
    }
    this.saveCart();
    this.updateCartUI();
    // Notification removed per user preference: sleek, non-intrusive feedback
  }

  removeFromCart(itemId) {
    this.cart = this.cart.filter(c => c.id !== itemId);
    this.saveCart();
    this.updateCartUI();
  }

  updateQuantity(itemId, delta) {
    const item = this.cart.find(c => c.id === itemId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeFromCart(itemId);
    } else {
      this.saveCart();
      this.updateCartUI();
    }
  }

  saveCart() {
    try {
      localStorage.setItem('aurelia_cart', JSON.stringify(this.cart));
    } catch (e) {}
  }

  loadPersistedCart() {
    try {
      const saved = localStorage.getItem('aurelia_cart');
      if (saved) {
        this.cart = JSON.parse(saved);
        this.updateCartUI();
      }
    } catch (e) {}
  }

  updateCartUI() {
    const badge = document.getElementById('cart-badge-count');
    const drawerList = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-subtotal');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');

    const totalCount = this.cart.reduce((sum, i) => sum + i.quantity, 0);
    if (badge) {
      badge.textContent = totalCount;
      badge.classList.toggle('hidden', totalCount === 0);
      if (totalCount > 0) {
        badge.classList.remove('cart-badge-pulse');
        void badge.offsetWidth; // Trigger reflow for smooth animation restart
        badge.classList.add('cart-badge-pulse');
      }
    }

    if (!drawerList) return;

    if (this.cart.length === 0) {
      drawerList.innerHTML = `
        <div class="text-center py-16 px-4">
          <div class="w-16 h-16 rounded-full bg-stone-900 border border-gold-500/20 flex items-center justify-center mx-auto mb-4 text-gold-400/60">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          </div>
          <h4 class="font-cinzel text-lg text-amber-100 font-bold mb-1">Your Tasting Tray is Empty</h4>
          <p class="text-xs text-stone-400">Discover our signature extractions or single-origin pour-overs from The Tasting Vault.</p>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '$0.00';
      if (taxEl) taxEl.textContent = '$0.00';
      if (totalEl) totalEl.textContent = '$0.00';
      return;
    }

    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.085;
    const total = subtotal + tax;

    drawerList.innerHTML = this.cart.map(item => `
      <div class="p-4 rounded-2xl bg-stone-900/80 border border-gold-500/20 flex items-center gap-4">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover border border-gold-500/20 shrink-0" />
        <div class="flex-1 min-w-0">
          <h5 class="text-sm font-cinzel font-bold text-amber-100 truncate">${item.name}</h5>
          <div class="text-xs text-gold-400 font-medium">$${item.price.toFixed(2)}</div>

          <!-- Quantity Controls -->
          <div class="flex items-center gap-2 mt-2">
            <button type="button" data-qty-dec="${item.id}" class="w-6 h-6 rounded-md bg-stone-950 border border-gold-500/30 text-gold-300 flex items-center justify-center text-xs hover:bg-gold-500 hover:text-stone-950 transition-colors cursor-pointer">-</button>
            <span class="text-xs font-mono font-bold text-stone-200 w-5 text-center">${item.quantity}</span>
            <button type="button" data-qty-inc="${item.id}" class="w-6 h-6 rounded-md bg-stone-950 border border-gold-500/30 text-gold-300 flex items-center justify-center text-xs hover:bg-gold-500 hover:text-stone-950 transition-colors cursor-pointer">+</button>
          </div>
        </div>

        <button type="button" data-remove-item="${item.id}" class="text-stone-500 hover:text-rose-400 transition-colors cursor-pointer p-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>
    `).join('');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

    // Attach quantity & remove listeners
    drawerList.querySelectorAll('[data-qty-dec]').forEach(b => {
      b.addEventListener('click', (e) => this.updateQuantity(e.currentTarget.getAttribute('data-qty-dec'), -1));
    });
    drawerList.querySelectorAll('[data-qty-inc]').forEach(b => {
      b.addEventListener('click', (e) => this.updateQuantity(e.currentTarget.getAttribute('data-qty-inc'), 1));
    });
    drawerList.querySelectorAll('[data-remove-item]').forEach(b => {
      b.addEventListener('click', (e) => this.removeFromCart(e.currentTarget.getAttribute('data-remove-item')));
    });
  }

  toggleCartDrawer(open) {
    const drawer = document.getElementById('cart-drawer-container');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (!drawer || !overlay) return;

    if (open) {
      drawer.classList.remove('translate-x-full');
      overlay.classList.remove('hidden');
    } else {
      drawer.classList.add('translate-x-full');
      overlay.classList.add('hidden');
    }
  }

  handleCheckout() {
    if (this.cart.length === 0) {
      this.showToast('Empty Tray', 'Please select a coffee or pastry first.', 'info');
      return;
    }

    const modalRoot = document.getElementById('checkout-modal-root');
    if (!modalRoot) return;

    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.085;
    const total = subtotal + tax;

    modalRoot.innerHTML = `
      <div id="checkout-modal-backdrop" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div class="relative w-full max-w-lg glass-panel-deep p-8 rounded-3xl border-2 border-gold-500/40 shadow-2xl modal-enter modal-enter-active">
          <!-- Close -->
          <button type="button" id="btn-close-checkout" class="absolute top-5 right-5 text-stone-400 hover:text-gold-300 transition-colors cursor-pointer">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          <div class="text-center mb-6">
            <div class="text-xs uppercase tracking-widest text-gold-400 font-cinzel">Curated Tasting Order</div>
            <h3 class="text-2xl font-cinzel font-bold text-amber-50 mt-1">Pre-order for Sanctuary Arrival</h3>
            <p class="text-xs text-stone-300 mt-1">Your items will be freshly extracted upon your table seating.</p>
          </div>

          <div class="bg-stone-950/70 p-4 rounded-xl border border-gold-500/20 mb-6 max-h-48 overflow-y-auto space-y-2">
            ${this.cart.map(i => `
              <div class="flex justify-between text-xs">
                <span class="text-stone-300">${i.quantity}x ${i.name}</span>
                <span class="text-gold-400 font-mono">$${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
            <div class="pt-2 border-t border-stone-800 flex justify-between font-bold text-sm">
              <span class="text-amber-100 font-cinzel">Total Sanctuary Bill</span>
              <span class="text-gold-400 font-mono">$${total.toFixed(2)}</span>
            </div>
          </div>

          <form id="checkout-contact-form" class="space-y-4 mb-6">
            <div>
              <label for="checkout-name" class="block text-[11px] uppercase tracking-wider text-stone-300 font-cinzel mb-1">Your Name</label>
              <input id="checkout-name" name="checkoutName" type="text" required placeholder="Lord / Lady Montgomery" class="w-full bg-stone-900 border border-gold-500/25 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-gold-400" />
            </div>
            <div>
              <label for="checkout-arrival" class="block text-[11px] uppercase tracking-wider text-stone-300 font-cinzel mb-1">Estimated Arrival Time Today</label>
              <select id="checkout-arrival" name="checkoutArrival" class="w-full bg-stone-900 border border-gold-500/25 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-gold-400">
                <option>In 15 - 20 minutes</option>
                <option>In 30 - 45 minutes</option>
                <option>This Afternoon (2:00 PM - 5:00 PM)</option>
                <option>This Evening (6:00 PM - 9:00 PM)</option>
              </select>
            </div>
            <button type="submit" class="w-full btn-gold py-3 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer shadow-xl">
              Confirm Pre-Order Experience ($${total.toFixed(2)})
            </button>
          </form>
        </div>
      </div>
    `;

    const closeBtn = modalRoot.querySelector('#btn-close-checkout');
    if (closeBtn) closeBtn.addEventListener('click', () => { modalRoot.innerHTML = ''; });

    const backdrop = modalRoot.querySelector('#checkout-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) modalRoot.innerHTML = '';
      });
    }

    const form = modalRoot.querySelector('#checkout-contact-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const guestName = form.querySelector('#checkout-name')?.value.trim() || 'Distinguished Guest';
        const arrivalTime = form.querySelector('#checkout-arrival')?.value || 'Today';
        const orderSummary = [...this.cart];
        const subtotal = orderSummary.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.085;
        const total = subtotal + tax;
        const orderCode = `AUR-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

        // Clear cart silently
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
        this.toggleCartDrawer(false);

        // Render elegant in-modal confirmation card (no floating toast popups!)
        modalRoot.innerHTML = `
          <div id="checkout-modal-backdrop" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div class="relative w-full max-w-lg glass-panel-deep p-8 rounded-3xl border-2 border-gold-500/40 shadow-2xl modal-enter modal-enter-active text-center">
              <button type="button" id="btn-close-checkout-confirmed" class="absolute top-5 right-5 text-stone-400 hover:text-gold-300 transition-colors cursor-pointer">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>

              <div class="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto mb-4 text-gold-400 shadow-lg shadow-gold-500/10">
                <svg class="w-8 h-8 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              </div>

              <div class="text-[11px] uppercase tracking-widest text-gold-400 font-cinzel">Sanctuary Pre-Order Confirmed</div>
              <h3 class="text-2xl font-cinzel font-bold text-amber-50 mt-1 mb-2">Extraction Scheduled</h3>
              <p class="text-xs text-stone-300 mb-6">Our baristas have recorded your bespoke order. Your coffee will be hand-extracted to perfection when you arrive.</p>

              <div class="bg-stone-950/80 p-5 rounded-2xl border border-gold-500/25 text-left mb-6 space-y-2.5 text-xs">
                <div class="flex justify-between items-center pb-2 border-b border-stone-800">
                  <span class="text-stone-400 font-cinzel text-[10px] uppercase">Order Identifier</span>
                  <span class="font-mono font-bold text-gold-400">${orderCode}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-stone-400">Guest of Honor</span>
                  <span class="font-medium text-stone-200">${guestName}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-stone-400">Estimated Arrival</span>
                  <span class="font-medium text-amber-200">${arrivalTime}</span>
                </div>
                <div class="flex justify-between items-center pt-2 border-t border-stone-800 font-bold">
                  <span class="text-amber-100 font-cinzel">Total Sanctuary Bill</span>
                  <span class="font-mono text-gold-400">$${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                id="btn-done-checkout"
                class="w-full btn-gold py-3 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer shadow-xl"
              >
                Return to Sanctuary
              </button>
            </div>
          </div>
        `;

        const doneBtn = modalRoot.querySelector('#btn-done-checkout');
        if (doneBtn) {
          doneBtn.addEventListener('click', () => {
            modalRoot.innerHTML = '';
          });
        }

        const closeBtnConfirmed = modalRoot.querySelector('#btn-close-checkout-confirmed');
        if (closeBtnConfirmed) {
          closeBtnConfirmed.addEventListener('click', () => {
            modalRoot.innerHTML = '';
          });
        }

        const confirmBackdrop = modalRoot.querySelector('#checkout-modal-backdrop');
        if (confirmBackdrop) {
          confirmBackdrop.addEventListener('click', (e) => {
            if (e.target === confirmBackdrop) modalRoot.innerHTML = '';
          });
        }
      });
    }
  }

  // GALLERY LIGHTBOX
  openLightbox(index) {
    const items = this.getActiveGalleryItems();
    if (!items || items.length === 0) return;
    this.currentLightboxIndex = ((index % items.length) + items.length) % items.length;
    const item = items[this.currentLightboxIndex];
    const root = document.getElementById('lightbox-modal-root');
    if (!root) return;

    root.innerHTML = `
      <div id="lightbox-backdrop" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg">
        <button type="button" id="btn-close-lightbox" class="absolute top-6 right-6 text-stone-300 hover:text-gold-400 transition-colors z-20 cursor-pointer p-2" title="Close (Esc)">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <button type="button" id="btn-prev-lightbox" class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-stone-300 hover:text-gold-400 transition-colors z-20 p-3 bg-stone-950/60 rounded-full border border-gold-500/20 cursor-pointer" title="Previous (Left Arrow)">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>

        <button type="button" id="btn-next-lightbox" class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-stone-300 hover:text-gold-400 transition-colors z-20 p-3 bg-stone-950/60 rounded-full border border-gold-500/20 cursor-pointer" title="Next (Right Arrow)">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>

        <div class="max-w-5xl w-full flex flex-col items-center">
          <img src="${item.src}" alt="${item.title}" class="max-h-[75vh] w-auto rounded-2xl object-contain border border-gold-500/30 shadow-2xl" />
          <div class="text-center mt-4">
            <h4 class="text-xl font-cinzel font-bold text-amber-100">${item.title}</h4>
            <p class="text-xs md:text-sm text-stone-400 mt-1 max-w-xl">${item.caption}</p>
            <span class="text-xs text-gold-500/60 font-mono mt-2 inline-block">${this.currentLightboxIndex + 1} / ${items.length}</span>
          </div>
        </div>
      </div>
    `;

    root.querySelector('#btn-close-lightbox')?.addEventListener('click', () => { root.innerHTML = ''; });
    root.querySelector('#lightbox-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'lightbox-backdrop') root.innerHTML = '';
    });
    root.querySelector('#btn-prev-lightbox')?.addEventListener('click', () => this.navigateLightbox(-1));
    root.querySelector('#btn-next-lightbox')?.addEventListener('click', () => this.navigateLightbox(1));
  }

  navigateLightbox(delta) {
    const items = this.getActiveGalleryItems();
    if (!items || items.length === 0) return;
    const newIdx = (this.currentLightboxIndex + delta + items.length) % items.length;
    this.openLightbox(newIdx);
  }

  // TOAST NOTIFICATIONS (Silenced per user requirement for serene, undisturbed luxury browsing)
  showToast(title, message, type = 'info') {
    // Intrusive floating toasts completely disabled
    return;
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.aureliaApp = new AureliaApp();
});
