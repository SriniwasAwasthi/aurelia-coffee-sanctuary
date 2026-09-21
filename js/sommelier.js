/* ==========================================================================
   AURELIA — Haute Roastery & Coffee Sanctuary
   Interactive Coffee Sommelier Matchmaker
   ========================================================================== */

import { MENU_ITEMS } from './menu-data.js';

export class CoffeeSommelier {
  constructor(options = {}) {
    this.container = document.getElementById('sommelier-quiz-container');
    this.currentStep = 0;
    this.answers = {
      timeOfDay: null,
      flavorPreference: null,
      texture: null
    };

    this.questions = [
      {
        id: 'timeOfDay',
        title: 'Step I: The Ritual of Moment',
        subtitle: 'At what hour and with what spirit does your journey begin?',
        options: [
          {
            label: 'The Golden Hour (Morning Awakening)',
            desc: 'Vibrant, luminous, high clarity to ignite your senses for the day ahead.',
            value: 'morning',
            icon: 'sun'
          },
          {
            label: 'The Midday Zenith (Focus & Power)',
            desc: 'Rich, profound, deep body to anchor and elevate your afternoon.',
            value: 'afternoon',
            icon: 'compass'
          },
          {
            label: 'Twilight Serenade (Leisure & Unwind)',
            desc: 'Aromatic, indulgent, lingering complexity to savor without rush.',
            value: 'evening',
            icon: 'moon'
          }
        ]
      },
      {
        id: 'flavorPreference',
        title: 'Step II: Your Sensory Palette',
        subtitle: 'Which notes evoke pure delight upon your palate?',
        options: [
          {
            label: 'Floral, White Jasmine & Vibrant Bergamot',
            desc: 'Delicate tea-like elegance with bright citrus vibrancy and honey nectar.',
            value: 'floral_citrus',
            icon: 'sparkles'
          },
          {
            label: '85% Venezuelan Cacao & Toasted Hazelnut',
            desc: 'Deep, decadent, dark cocoa intensity with caramelized crema sweetness.',
            value: 'chocolate_nut',
            icon: 'coffee'
          },
          {
            label: 'Persian Saffron, Tahitian Vanilla & Spices',
            desc: 'Exotic aromatics, sweet golden syrup, and warm luxurious spices.',
            value: 'sweet_spiced',
            icon: 'flame'
          }
        ]
      },
      {
        id: 'texture',
        title: 'Step III: Tactile Mouthfeel',
        subtitle: 'How do you envision the physical touch of your cup?',
        options: [
          {
            label: 'Pristine Pour-Over Clarity (Silky Black)',
            desc: 'Pure, untouched, wine-like clarity extracted via copper drippers.',
            value: 'pure_black',
            icon: 'droplets'
          },
          {
            label: 'Velvety Microfoam & Warm Jersey Milk',
            desc: 'Silken, cushiony micro-foam caressing the palate with subtle sweetness.',
            value: 'velvet_milk',
            icon: 'cup-soda'
          },
          {
            label: 'Glacial Chill or Cascading Nitro Sphere',
            desc: 'Ultra-smooth, refreshing nitrogen head or 18-hour cold crystal drip.',
            value: 'cold_nitro',
            icon: 'snowflake'
          }
        ]
      }
    ];

    this.onRecommendationSelected = options.onSelect || null;
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;

    if (this.currentStep < this.questions.length) {
      this.renderQuestion(this.questions[this.currentStep]);
    } else {
      this.renderResult();
    }
  }

  renderQuestion(q) {
    const progressPercent = Math.round(((this.currentStep + 1) / this.questions.length) * 100);

    this.container.innerHTML = `
      <div class="glass-panel-deep p-8 md:p-12 rounded-3xl border border-amber-500/20 shadow-2xl relative overflow-hidden transition-all duration-500">
        <!-- Subtle Glow backdrop -->
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Progress header -->
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-amber-500/15">
          <div class="flex items-center gap-3">
            <span class="text-xs uppercase tracking-widest text-amber-300/80 font-cinzel">Sommelier Consultation</span>
            <span class="text-amber-500/40">•</span>
            <span class="text-xs text-amber-200/60">${this.currentStep + 1} of ${this.questions.length}</span>
          </div>
          <div class="w-32 bg-stone-900 h-1.5 rounded-full overflow-hidden border border-amber-500/20">
            <div class="bg-gradient-to-r from-amber-400 to-amber-600 h-full transition-all duration-500" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <!-- Question Title -->
        <h3 class="text-2xl md:text-3xl font-cinzel text-amber-100 font-bold mb-3">${q.title}</h3>
        <p class="text-stone-300 font-sans text-sm md:text-base mb-8">${q.subtitle}</p>

        <!-- Options Grid -->
        <div class="grid grid-cols-1 gap-4 mb-8">
          ${q.options.map((opt, idx) => `
            <button
              type="button"
              data-quiz-option="${opt.value}"
              class="quiz-option-btn group text-left p-5 rounded-2xl border border-amber-500/20 hover:border-amber-400 bg-stone-900/60 hover:bg-amber-950/30 transition-all duration-300 flex items-start gap-5 cursor-pointer relative"
            >
              <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 group-hover:bg-amber-500 group-hover:text-stone-950 transition-all duration-300 shrink-0 font-cinzel font-bold text-sm">
                0${idx + 1}
              </div>
              <div class="flex-1">
                <h4 class="text-lg font-cinzel font-semibold text-amber-50 group-hover:text-amber-300 transition-colors mb-1">${opt.label}</h4>
                <p class="text-stone-400 text-xs md:text-sm leading-relaxed">${opt.desc}</p>
              </div>
              <div class="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400 self-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </button>
          `).join('')}
        </div>

        ${this.currentStep > 0 ? `
          <div class="flex justify-start">
            <button type="button" id="btn-quiz-back" class="text-xs uppercase tracking-widest text-amber-400/80 hover:text-amber-300 flex items-center gap-2 transition-colors cursor-pointer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              Previous Question
            </button>
          </div>
        ` : ''}
      </div>
    `;

    // Attach listeners
    this.container.querySelectorAll('[data-quiz-option]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = e.currentTarget.getAttribute('data-quiz-option');
        this.selectAnswer(q.id, val);
      });
    });

    const backBtn = this.container.querySelector('#btn-quiz-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (this.currentStep > 0) {
          this.currentStep--;
          this.render();
        }
      });
    }
  }

  selectAnswer(questionId, value) {
    this.answers[questionId] = value;
    this.currentStep++;
    this.render();
  }

  calculateMatch() {
    const { flavorPreference, texture } = this.answers;

    // Match priority
    if (texture === 'pure_black') {
      if (flavorPreference === 'floral_citrus') return MENU_ITEMS.find(i => i.id === 'po-01') || MENU_ITEMS[4];
      if (flavorPreference === 'chocolate_nut') return MENU_ITEMS.find(i => i.id === 'po-04') || MENU_ITEMS[7];
      return MENU_ITEMS.find(i => i.id === 'po-02') || MENU_ITEMS[5];
    }

    if (texture === 'cold_nitro') {
      if (flavorPreference === 'floral_citrus') return MENU_ITEMS.find(i => i.id === 'cold-03') || MENU_ITEMS[10];
      if (flavorPreference === 'chocolate_nut') return MENU_ITEMS.find(i => i.id === 'cold-04') || MENU_ITEMS[11];
      return MENU_ITEMS.find(i => i.id === 'cold-01') || MENU_ITEMS[8];
    }

    // Default to exquisite milk / espresso creations
    if (flavorPreference === 'floral_citrus' || flavorPreference === 'sweet_spiced') {
      return MENU_ITEMS.find(i => i.id === 'sig-03') || MENU_ITEMS[2];
    }
    if (flavorPreference === 'chocolate_nut') {
      return MENU_ITEMS.find(i => i.id === 'sig-02') || MENU_ITEMS[1];
    }

    return MENU_ITEMS.find(i => i.id === 'sig-01') || MENU_ITEMS[0];
  }

  renderResult() {
    const match = this.calculateMatch();

    this.container.innerHTML = `
      <div class="glass-panel-deep p-8 md:p-12 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <!-- Glow effect -->
        <div class="absolute -top-32 -left-32 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="text-center max-w-2xl mx-auto mb-10">
          <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs uppercase tracking-widest font-cinzel mb-4">
            <svg class="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Sommelier Curated Destiny
          </span>
          <h3 class="text-3xl md:text-4xl font-cinzel text-amber-50 font-bold mb-3">Your Signature Aurelia Cup</h3>
          <p class="text-stone-300 font-sans text-sm md:text-base">
            Based on your discerning palate, our Master Roaster has hand-selected this immaculate extraction for your visit.
          </p>
        </div>

        <!-- Matched Card Hero -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-stone-900/80 p-6 md:p-8 rounded-2xl border border-amber-500/30 mb-8">
          <div class="lg:col-span-5 relative group overflow-hidden rounded-xl">
            <img src="${match.image}" alt="${match.name}" class="w-full h-64 md:h-72 object-cover rounded-xl transition-transform duration-700 group-hover:scale-105" />
            <div class="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-cinzel text-amber-300 border border-amber-500/30">
              ${match.badge}
            </div>
            <div class="absolute bottom-3 right-3 bg-amber-500 text-stone-950 font-bold px-3 py-1 rounded-full text-sm font-cinzel">
              $${match.price.toFixed(2)}
            </div>
          </div>

          <div class="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div class="text-xs uppercase tracking-widest text-amber-400 font-cinzel mb-1">${match.categoryName}</div>
              <h4 class="text-2xl md:text-3xl font-cinzel font-bold text-amber-100 mb-2">${match.name}</h4>
              <p class="text-xs text-amber-200/70 font-playfair italic mb-4">${match.subtitle}</p>
              <p class="text-stone-300 text-sm leading-relaxed mb-6">${match.description}</p>

              <!-- Flavor notes -->
              <div class="mb-6">
                <div class="text-xs font-cinzel text-amber-300/80 uppercase tracking-wider mb-2">Tasting Notes & Terroir</div>
                <div class="flex flex-wrap gap-2">
                  ${match.tastingNotes.map(note => `
                    <span class="px-3 py-1 rounded-lg bg-amber-950/50 border border-amber-500/20 text-amber-200 text-xs font-sans">
                      ${note}
                    </span>
                  `).join('')}
                </div>
              </div>

              <!-- Pairing recommendation -->
              <div class="flex items-center gap-3 p-3 rounded-xl bg-stone-950/50 border border-amber-500/15 mb-6">
                <div class="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V4a2 2 0 10-2 2h2"/></svg>
                </div>
                <div>
                  <div class="text-[11px] uppercase tracking-wider text-amber-400/80 font-cinzel">Recommended Sanctuary Pairing</div>
                  <div class="text-xs text-stone-200 font-semibold">${match.pairing}</div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-wrap gap-4 items-center pt-2">
              <button
                type="button"
                id="btn-sommelier-add-tray"
                data-item-id="${match.id}"
                class="btn-gold px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                Add to Tasting Tray
              </button>

              <a
                href="#reserve"
                class="btn-gold-outline px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer"
              >
                Reserve Table for This Cup
              </a>

              <button
                type="button"
                id="btn-sommelier-retake"
                class="text-xs text-stone-400 hover:text-amber-300 ml-auto transition-colors underline cursor-pointer"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach Action Listeners
    const addBtn = this.container.querySelector('#btn-sommelier-add-tray');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('aurelia:add-to-tray', { detail: { item: match } }));
      });
    }

    const retakeBtn = this.container.querySelector('#btn-sommelier-retake');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => {
        this.currentStep = 0;
        this.answers = { timeOfDay: null, flavorPreference: null, texture: null };
        this.render();
      });
    }
  }
}
