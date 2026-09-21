/* ==========================================================================
   AURELIA — Haute Roastery & Coffee Sanctuary
   Dual Reservation Engine: Standard Table vs VIP Sanctuary Experience
   ========================================================================== */

export class ReservationManager {
  constructor(formId, modalContainerId) {
    this.form = document.getElementById(formId);
    this.modalContainer = document.getElementById(modalContainerId);
    this.currentMode = 'table'; // 'table' (Standard) or 'vip' (VIP Sanctuary)
    this.init();
  }

  init() {
    if (!this.form) return;

    // Set min date to today
    const dateInput = this.form.querySelector('#res-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    this.initModeSelector();
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  initModeSelector() {
    const tabTable = document.getElementById('tab-reserve-table');
    const tabVip = document.getElementById('tab-reserve-vip');

    if (tabTable) {
      tabTable.addEventListener('click', () => this.setMode('table'));
    }

    if (tabVip) {
      tabVip.addEventListener('click', () => this.setMode('vip'));
    }

    // Listen to header and top bar links with data-res-target
    document.querySelectorAll('[data-res-target]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = e.currentTarget.getAttribute('data-res-target');
        if (target === 'vip' || target === 'table') {
          this.setMode(target);
        }
      });
    });

    // Initial render
    this.setMode('table');
  }

  setMode(mode) {
    this.currentMode = mode;

    const tabTable = document.getElementById('tab-reserve-table');
    const tabVip = document.getElementById('tab-reserve-vip');
    const modeBadge = document.getElementById('res-mode-badge');
    const modeStatus = document.getElementById('res-mode-status');
    const modeDesc = document.getElementById('res-mode-desc');
    const zoneSelect = document.getElementById('res-zone');
    const submitBtnText = document.getElementById('btn-submit-res-text');
    const termsText = document.getElementById('res-terms-text');
    const modeIcon = document.getElementById('res-mode-icon');

    if (mode === 'table') {
      // Tab styling
      if (tabTable) {
        tabTable.className = 'w-full sm:w-1/2 py-3 px-6 rounded-full font-cinzel text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer bg-gold-500 text-stone-950 shadow-lg';
      }
      if (tabVip) {
        tabVip.className = 'w-full sm:w-1/2 py-3 px-6 rounded-full font-cinzel text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-stone-300 hover:text-gold-300';
      }

      // Mode text
      if (modeBadge) modeBadge.textContent = 'Boutique Cafe Seating';
      if (modeStatus) modeStatus.textContent = 'Complimentary Table Reservation';
      if (modeDesc) {
        modeDesc.textContent = 'Reserve a table in The Main Sanctuary or Sunlit Veranda. Perfect for daily coffee rituals, morning viennoiserie, or business meetings. Held for 15 minutes.';
      }
      if (submitBtnText) submitBtnText.textContent = 'Confirm Cafe Table Reservation';
      if (termsText) {
        termsText.textContent = 'Reservations held for 15 minutes. Complimentary guest seating with zero reservation fee.';
      }
      if (modeIcon) {
        modeIcon.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`;
      }

      // Populate Table zones
      if (zoneSelect) {
        zoneSelect.innerHTML = `
          <option value="The Main Sanctuary Salon">The Main Sanctuary Salon (Ambient Seating & Coffee)</option>
          <option value="The Sunlit Veranda">The Sunlit Veranda (Botanical Courtyard Garden)</option>
          <option value="The Barista Counter">The Barista Counter (Front-Row Extraction)</option>
          <option value="The Library Salon">The Library Salon (Quiet Reading & Single Origins)</option>
        `;
      }
    } else {
      // VIP Mode
      if (tabTable) {
        tabTable.className = 'w-full sm:w-1/2 py-3 px-6 rounded-full font-cinzel text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-stone-300 hover:text-gold-300';
      }
      if (tabVip) {
        tabVip.className = 'w-full sm:w-1/2 py-3 px-6 rounded-full font-cinzel text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer bg-gold-500 text-stone-950 shadow-lg';
      }

      if (modeBadge) modeBadge.textContent = 'Exclusive Concierge Tier';
      if (modeStatus) modeStatus.textContent = 'VIP Sanctuary Pass & Cupping Masterclass';
      if (modeDesc) {
        modeDesc.textContent = 'Private Velvet Salon or Roaster’s Chamber with personalized barista sommelier service, exclusive micro-lot cupping flight, and complimentary white-glove valet greeting.';
      }
      if (submitBtnText) submitBtnText.textContent = 'Request Sanctuary VIP Access Pass';
      if (termsText) {
        termsText.textContent = 'VIP Pass includes guaranteed private salon seating, personalized cupping notes, and front-colonnade valet service.';
      }
      if (modeIcon) {
        modeIcon.innerHTML = `<svg class="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>`;
      }

      // Populate VIP zones
      if (zoneSelect) {
        zoneSelect.innerHTML = `
          <option value="The Velvet Salon">The Velvet Salon (Plush Banquettes & Rare Flights)</option>
          <option value="Private Roaster's Salon">Private Roaster's Salon (Master Cupping Flight with Head Roaster)</option>
          <option value="The Sommelier Suite">The Sommelier Suite (Bespoke Omakase Pairing)</option>
        `;
      }
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.form);
    const guestName = formData.get('guestName')?.trim() || 'Distinguished Guest';
    const email = formData.get('email')?.trim() || 'guest@aureliacafe.com';
    const phone = formData.get('phone')?.trim() || '+1 (555) 019-2834';
    const date = formData.get('date');
    const time = formData.get('time') || '02:30 PM';
    const guests = formData.get('guests') || '2 Guests';
    const zone = formData.get('zone') || (this.currentMode === 'vip' ? 'The Velvet Salon' : 'The Main Sanctuary Salon');
    const occasion = formData.get('occasion') || (this.currentMode === 'vip' ? 'Sensory Coffee Ritual' : 'Casual Coffee & Pastry');
    const notes = formData.get('notes')?.trim() || 'None';

    // Generate prefix: TBL for Table, VIP for VIP
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const code = this.currentMode === 'vip' ? `VIP-${randomHex}` : `TBL-${randomHex}`;

    const reservationData = {
      mode: this.currentMode,
      code,
      guestName,
      email,
      phone,
      date,
      time,
      guests,
      zone,
      occasion,
      notes,
      timestamp: new Date().toISOString()
    };

    // Store in localStorage
    try {
      const past = JSON.parse(localStorage.getItem('aurelia_reservations') || '[]');
      past.unshift(reservationData);
      localStorage.setItem('aurelia_reservations', JSON.stringify(past));
    } catch (err) {
      console.warn('LocalStorage unavailable', err);
    }

    // Show VIP pass modal
    this.showVipPassModal(reservationData);

    // Reset form & restore default tomorrow date
    this.form.reset();
    const dateInput = this.form.querySelector('#res-date');
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  showVipPassModal(data) {
    if (!this.modalContainer) return;

    // Format readable date
    let formattedDate = data.date;
    try {
      const parts = data.date.split('-');
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      formattedDate = d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {}

    const isVip = data.mode === 'vip';
    const passHeader = isVip ? 'Official VIP Invitation & Pass' : 'Official Table Confirmation';
    const passTitle = isVip ? 'Aurelia Sanctuary Access' : 'Aurelia Table Reservation';
    const passPerk = isVip ? 'Guaranteed VIP Salon • Valet Included' : 'Guaranteed Table • 15-Min Hold';

    const safeName = this.escapeHtml(data.guestName);
    const safeCode = this.escapeHtml(data.code);
    const safeZone = this.escapeHtml(data.zone);
    const safeTime = this.escapeHtml(data.time);
    const safeGuests = this.escapeHtml(data.guests);
    const safeOccasion = this.escapeHtml(data.occasion);

    this.modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <!-- Single-page printable card container -->
        <div class="vip-pass-card relative w-full max-w-xl glass-panel-deep p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 shadow-2xl modal-enter modal-enter-active">
          <!-- Gold foil decorative corners -->
          <div class="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-amber-400"></div>
          <div class="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-amber-400"></div>
          <div class="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-amber-400"></div>
          <div class="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-amber-400"></div>

          <!-- Close button (Hidden during print) -->
          <button type="button" id="btn-close-vip-pass" class="print-hide absolute top-4 right-4 text-stone-400 hover:text-amber-300 transition-colors cursor-pointer p-1">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          <!-- Modal Header -->
          <div class="text-center mb-5">
            <div class="inline-flex items-center justify-center w-11 h-11 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 mb-2 font-cinzel font-bold text-lg">
              A
            </div>
            <div class="text-[10px] uppercase tracking-widest text-amber-400 font-cinzel font-semibold">${passHeader}</div>
            <h3 class="text-2xl sm:text-3xl font-cinzel font-bold text-amber-50 mt-0.5">${passTitle}</h3>
            <p class="text-[11px] text-stone-300 mt-1">Present this pass to the maître d' upon arrival</p>
          </div>

          <!-- VIP Ticket Body -->
          <div class="vip-ticket-inner bg-stone-950/80 p-5 rounded-2xl border border-amber-500/25 mb-5 relative overflow-hidden">
            <div class="flex justify-between items-start pb-3 border-b border-amber-500/20 mb-3">
              <div>
                <div class="text-[9px] uppercase tracking-widest text-stone-400 font-cinzel">Guest of Honor</div>
                <div class="text-base sm:text-lg font-cinzel font-bold text-amber-100">${safeName}</div>
              </div>
              <div class="text-right">
                <div class="text-[9px] uppercase tracking-widest text-stone-400 font-cinzel">Identifier</div>
                <div class="text-sm sm:text-base font-mono font-bold text-amber-400 tracking-wider">${safeCode}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 text-xs mb-3">
              <div>
                <div class="text-stone-400 font-cinzel text-[9px] uppercase">Reserved Date</div>
                <div class="text-stone-200 font-medium">${formattedDate}</div>
              </div>
              <div>
                <div class="text-stone-400 font-cinzel text-[9px] uppercase">Arrival Time</div>
                <div class="text-stone-200 font-medium">${safeTime}</div>
              </div>
              <div>
                <div class="text-stone-400 font-cinzel text-[9px] uppercase">Atmospheric Zone</div>
                <div class="text-amber-300 font-medium truncate">${safeZone}</div>
              </div>
              <div>
                <div class="text-stone-400 font-cinzel text-[9px] uppercase">Party Size</div>
                <div class="text-stone-200 font-medium">${safeGuests}</div>
              </div>
            </div>

            <div class="pt-2.5 border-t border-amber-500/15 flex items-center justify-between text-[10px] sm:text-[11px] text-stone-400">
              <span>Occasion: <strong class="text-stone-200">${safeOccasion}</strong></span>
              <span class="text-emerald-400 flex items-center gap-1 font-sans font-medium">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span> ${passPerk}
              </span>
            </div>
          </div>

          <!-- Actions (Hidden during print) -->
          <div class="print-hide flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              id="btn-download-ics"
              class="flex-1 btn-gold py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Add to Calendar (.ics)
            </button>
            <button
              type="button"
              id="btn-print-pass"
              class="btn-gold-outline py-2.5 px-6 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer hover:bg-gold-500 hover:text-stone-950 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              Print Pass (1 Page)
            </button>
          </div>
        </div>
      </div>
    `;

    // Attach listeners
    const closeBtn = this.modalContainer.querySelector('#btn-close-vip-pass');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.modalContainer.innerHTML = '';
      });
    }

    const backdrop = this.modalContainer.querySelector('.fixed.inset-0');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          this.modalContainer.innerHTML = '';
        }
      });
    }

    const icsBtn = this.modalContainer.querySelector('#btn-download-ics');
    if (icsBtn) {
      icsBtn.addEventListener('click', () => {
        this.downloadIcsFile(data);
      });
    }

    const printBtn = this.modalContainer.querySelector('#btn-print-pass');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  downloadIcsFile(data) {
    const isVip = data.mode === 'vip';
    const title = isVip
      ? `Aurelia VIP Sanctuary Reservation (${data.code})`
      : `Aurelia Cafe Table Reservation (${data.code})`;
    const description = `${title} for ${data.guestName} at ${data.zone}. Party of ${data.guests}. Aurelia Haute Roastery & Coffee Sanctuary.`;
    const location = `Aurelia Roastery, 742 Grand Boulevard, Suite 100`;

    // Construct .ics
    const cleanDate = data.date.replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Aurelia Coffee Sanctuary//Reservation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `DTSTART;VALUE=DATE:${cleanDate}`,
      `DTEND;VALUE=DATE:${cleanDate}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Aurelia-Reservation-${data.code}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
