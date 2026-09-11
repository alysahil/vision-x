/* ==========================================================================
   BULLETPROOF GLOBAL 3-DOT DRAWER & CURRENCY ENGINE (TOP SCOPE)
   ========================================================================== */
window.activeCurrency = localStorage.getItem('activeCurrency') || 'INR';

window.toggleThreeDotsDrawer = function(e) {
  if (e) {
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
    if (typeof e.preventDefault === 'function') e.preventDefault();
  }
  const drawer = document.getElementById('three-dots-drawer');
  if (drawer) {
    const isCurrentlyOpen = drawer.classList.contains('open') || drawer.style.right === '0px';
    if (isCurrentlyOpen) {
      drawer.classList.remove('open');
      drawer.style.setProperty('right', '-420px', 'important');
    } else {
      drawer.classList.add('open');
      drawer.style.setProperty('right', '0px', 'important');
    }
  }
};

window.closeThreeDotsDrawer = function(e) {
  if (e) {
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
    if (typeof e.preventDefault === 'function') e.preventDefault();
  }
  const drawer = document.getElementById('three-dots-drawer');
  if (drawer) {
    drawer.classList.remove('open');
    drawer.style.setProperty('right', '-420px', 'important');
  }
};

window.toggleNavAccordion = function(headerEl) {
  if (!headerEl) return;
  const item = headerEl.closest('.nav-accordion-item');
  if (!item) return;
  const isOpen = item.classList.contains('open');
  
  // Close all accordion items and reset their body display & arrow rotation
  document.querySelectorAll('.nav-accordion-item').forEach(i => {
    i.classList.remove('open');
    const body = i.querySelector('.nav-accordion-body');
    if (body) body.style.setProperty('display', 'none', 'important');
    const arrow = i.querySelector('.nav-accordion-arrow');
    if (arrow) arrow.style.setProperty('transform', 'rotate(0deg)', 'important');
  });

  // Expand target accordion item if it was closed
  if (!isOpen) {
    item.classList.add('open');
    const body = item.querySelector('.nav-accordion-body');
    if (body) body.style.setProperty('display', 'flex', 'important');
    const arrow = item.querySelector('.nav-accordion-arrow');
    if (arrow) arrow.style.setProperty('transform', 'rotate(180deg)', 'important');
  }
};

window.setGlobalCurrency = function(currency) {
  const currencyRates = {
    INR: { rate: 1.0, symbol: '₹', locale: 'en-IN' },
    USD: { rate: 1 / 40, symbol: '$', locale: 'en-US' },
    EUR: { rate: 1 / 45, symbol: '€', locale: 'de-DE' },
    GBP: { rate: 1 / 52, symbol: '£', locale: 'en-GB' },
    AED: { rate: 1 / 11, symbol: 'AED ', locale: 'ar-AE' }
  };
  if (!currencyRates[currency]) return;
  window.activeCurrency = currency;
  localStorage.setItem('activeCurrency', currency);

  document.querySelectorAll('.currency-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-currency') === currency);
  });

  const config = currencyRates[currency];
  document.querySelectorAll('.price-val, .calc-out-val, .sub-price, .convertible-price, [data-inr-price]').forEach(el => {
    const rawInr = el.getAttribute('data-inr') || el.getAttribute('data-inr-price') || el.textContent.replace(/[^0-9]/g, '');
    if (rawInr) {
      if (!el.getAttribute('data-inr')) el.setAttribute('data-inr', rawInr);
      const val = parseFloat(rawInr);
      if (currency === 'INR') {
        el.textContent = '₹' + Math.round(val).toLocaleString('en-IN');
      } else {
        const converted = Math.round(val * config.rate);
        el.textContent = config.symbol + converted.toLocaleString(config.locale);
      }
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
     MOTION API 60FPS SPRING ANIMATIONS, SCROLL PROGRESS & VIEWPORT REVEALS
     ========================================================================== */
  const progressBar = document.getElementById('motion-scroll-progress');
  if (progressBar) {
    progressBar.style.transformOrigin = '0% 50%';
  }
  
  const updateScrollProgress = () => {
    if (!progressBar) return;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) : 0;
    progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
  };
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  const initMotionAnimations = () => {
    const motionLib = window.Motion || window.motion;

    // Trigger initial reveal for visible elements on page load
    document.querySelectorAll('.reveal').forEach((el, idx) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        setTimeout(() => el.classList.add('active'), idx * 80);
      }
    });

    if (motionLib && motionLib.animate) {
      console.log('⚡ Motion API Engine Active');

      // Spring Hover Interactions
      const interactiveTargets = '.btn-primary, .btn-secondary, .three-dots-btn, .logo-img, .glass-card, .spotlight-card, .pricing-card, .why-card, .whatsapp-float';
      document.querySelectorAll(interactiveTargets).forEach(el => {
        el.addEventListener('mouseenter', () => {
          try {
            motionLib.animate(el, { scale: 1.03, y: -4 }, { type: 'spring', stiffness: 380, damping: 22 });
          } catch(e) { el.style.transform = 'translateY(-4px) scale(1.03)'; }
        });
        el.addEventListener('mouseleave', () => {
          try {
            motionLib.animate(el, { scale: 1.0, y: 0 }, { type: 'spring', stiffness: 380, damping: 22 });
          } catch(e) { el.style.transform = 'translateY(0) scale(1.0)'; }
        });
      });

      // Viewport Reveal InView
      if (motionLib.inView) {
        motionLib.inView('.reveal, .spotlight-card, .why-card, .testimonial-card, .pricing-card, .section-header', ({ target }) => {
          target.classList.add('active');
          try {
            motionLib.animate(
              target,
              { opacity: [0, 1], y: [35, 0] },
              { duration: 0.6, easing: [0.16, 1, 0.3, 1] }
            );
          } catch(e) {}
        });
      }
    } else {
      console.log('Fallback Standard Animations Active');
      document.querySelectorAll('.btn-primary, .btn-secondary, .three-dots-btn, .glass-card').forEach(el => {
        el.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        el.addEventListener('mouseenter', () => { el.style.transform = 'translateY(-4px) scale(1.03)'; });
        el.addEventListener('mouseleave', () => { el.style.transform = 'translateY(0) scale(1.0)'; });
      });
    }

    // Fail-safe visibility timer (1.0s max delay)
    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(r => r.classList.add('active'));
    }, 1000);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotionAnimations);
  } else {
    initMotionAnimations();
  }


  /* --- 1. Canvas Particles Backdrop --- */
  const canvas = document.getElementById('canvas-backdrop');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let points = [];
    const maxDistance = 120;
    const pointCount = 60;
    let mouse = { x: null, y: null };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Point {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse hover interaction (repulse slightly)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 100) {
            const force = (100 - dist) / 100;
            this.x += (dx / dist) * force * 2;
            this.y += (dy / dist) * force * 2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(201, 162, 39, 0.4)';
        ctx.fill();
      }
    }

    for (let i = 0; i < pointCount; i++) {
      points.push(new Point());
    }

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw points
      points.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw lines between points
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            const alpha = (maxDistance - dist) / maxDistance * 0.15;
            ctx.strokeStyle = `rgba(236, 203, 108, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };
    animate();
  }

  // Global currency syncing across all calculators and lists
    window.activeCurrency = localStorage.getItem('activeCurrency') || 'INR';

  const currencyRates = {
    INR: { rate: 1.0, symbol: '₹', locale: 'en-IN' },
    USD: { rate: 1 / 40, symbol: '$', locale: 'en-US' },
    EUR: { rate: 1 / 45, symbol: '€', locale: 'de-DE' },
    GBP: { rate: 1 / 52, symbol: '£', locale: 'en-GB' },
    AED: { rate: 1 / 11, symbol: 'AED ', locale: 'ar-AE' }
  };

  function convertPrice(priceStr, currency) {
    if (!priceStr) return priceStr;
    const config = currencyRates[currency] || currencyRates.INR;
    if (currency === 'INR') return priceStr;
    return priceStr.replace(/₹([\d,]+)/g, (match, p1) => {
      const inrVal = parseFloat(p1.replace(/,/g, ''));
      const converted = Math.round(inrVal * config.rate);
      return config.symbol + converted.toLocaleString(config.locale);
    });
  }

  window.setGlobalCurrency = function(currency) {
    window.activeCurrency = currency;
    localStorage.setItem('activeCurrency', currency);

    document.querySelectorAll('.currency-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-currency') === currency);
    });

    if (typeof renderServices === 'function') {
      try { renderServices(); } catch(e) {}
    }

    document.querySelectorAll('.convertible-price, [data-inr-price]').forEach(el => {
      const orig = el.getAttribute('data-inr-price') || el.textContent;
      if (!el.getAttribute('data-inr-price')) el.setAttribute('data-inr-price', orig);
      el.textContent = convertPrice(orig, currency);
    });

    if (typeof updateRetainerCalculator === 'function') try { updateRetainerCalculator(); } catch(e) {}
    if (typeof updateInvoiceCalculator === 'function') try { updateInvoiceCalculator(); } catch(e) {}
  };

  /* --- 2. Spotlight Hover Card Effect --- */
  const initSpotlightCard = (card) => {
    const glow = card.querySelector('.spotlight-glow');
    if (!glow) return;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
    });
  };

  // Init static cards
  document.querySelectorAll('.spotlight-card').forEach(initSpotlightCard);

  /* --- 3. Typing Subtitle Animation --- */
  const typistElement = document.getElementById('typist-role');
  if (typistElement) {
    const roles = [
      'Performance Media Studio', 
      'AI Growth Systems Builders', 
      'Conversion Engineering Studio', 
      'Revenue Velocity Analysts'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeRoles = () => {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        typistElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; 
      } else {
        typistElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 120;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000; // Hold role
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before typing next
      }

      setTimeout(typeRoles, typingSpeed);
    };
    setTimeout(typeRoles, 1000);
  }

  /* --- 4. Live Stats Mockup Incrementor & Bars --- */
  const mockupStats = document.querySelectorAll('.mockup-stat-val');
  mockupStats.forEach(stat => {
    const target = parseFloat(stat.getAttribute('data-target'));
    const isFloat = stat.getAttribute('data-target').includes('.');
    const suffix = stat.getAttribute('data-suffix') || '';
    let current = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let stepCount = 0;

    const updateVal = () => {
      current += increment;
      stepCount++;
      if (stepCount >= steps) {
        stat.textContent = (isFloat ? target.toFixed(1) : Math.round(target)) + suffix;
      } else {
        stat.textContent = (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
        setTimeout(updateVal, duration / steps);
      }
    };
    
    setTimeout(updateVal, 600);
  });

  const mockupBars = document.querySelectorAll('.mockup-bar');
  setTimeout(() => {
    mockupBars.forEach(bar => {
      const targetHeight = bar.getAttribute('data-height');
      bar.style.height = targetHeight;
    });
  }, 1000);

  /* --- 5. Services Database & Dynamic Rendering --- */
  const servicesData = [
  {
    "name": "AI Automation",
    "category": "ai",
    "categoryName": "AI Solutions",
    "emoji": "\ud83e\udd16",
    "priceStr": "\u20b915,000+",
    "price": 15000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "AI Chatbots",
    "category": "ai",
    "categoryName": "AI Solutions",
    "emoji": "\ud83e\udd16",
    "priceStr": "\u20b910,000+",
    "price": 10000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "AI Content Solutions",
    "category": "ai",
    "categoryName": "AI Solutions",
    "emoji": "\ud83e\udd16",
    "priceStr": "\u20b93,000+",
    "price": 3000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "AI Integrations",
    "category": "ai",
    "categoryName": "AI Solutions",
    "emoji": "\ud83e\udd16",
    "priceStr": "\u20b98,000+",
    "price": 8000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Custom AI Workflows",
    "category": "ai",
    "categoryName": "AI Solutions",
    "emoji": "\ud83e\udd16",
    "priceStr": "\u20b920,000+",
    "price": 20000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Short-Form Videos",
    "category": "video",
    "categoryName": "Video Production & Editing",
    "emoji": "\ud83c\udfa5",
    "priceStr": "\u20b91,500+",
    "price": 1500,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Long-Form Videos",
    "category": "video",
    "categoryName": "Video Production & Editing",
    "emoji": "\ud83c\udfa5",
    "priceStr": "\u20b93,000+",
    "price": 3000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Documentary Editing",
    "category": "video",
    "categoryName": "Video Production & Editing",
    "emoji": "\ud83c\udfa5",
    "priceStr": "\u20b98,000+",
    "price": 8000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Motion Graphics",
    "category": "video",
    "categoryName": "Video Production & Editing",
    "emoji": "\ud83c\udfa5",
    "priceStr": "\u20b95,000+",
    "price": 5000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "CGI & VFX",
    "category": "video",
    "categoryName": "Video Production & Editing",
    "emoji": "\ud83c\udfa5",
    "priceStr": "\u20b910,000+",
    "price": 10000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "2D/3D Animation",
    "category": "video",
    "categoryName": "Video Production & Editing",
    "emoji": "\ud83c\udfa5",
    "priceStr": "\u20b910,000+",
    "price": 10000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Cinematic Editing",
    "category": "video",
    "categoryName": "Video Production & Editing",
    "emoji": "\ud83c\udfa5",
    "priceStr": "\u20b95,000+",
    "price": 5000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Corporate Videos",
    "category": "video",
    "categoryName": "Video Production & Editing",
    "emoji": "\ud83c\udfa5",
    "priceStr": "\u20b96,000+",
    "price": 6000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "YouTube Content",
    "category": "video",
    "categoryName": "Video Production & Editing",
    "emoji": "\ud83c\udfa5",
    "priceStr": "\u20b92,000+",
    "price": 2000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Reels & Shorts",
    "category": "video",
    "categoryName": "Video Production & Editing",
    "emoji": "\ud83c\udfa5",
    "priceStr": "\u20b91,500+",
    "price": 1500,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Commercial Ads",
    "category": "video",
    "categoryName": "Video Production & Editing",
    "emoji": "\ud83c\udfa5",
    "priceStr": "\u20b97,000+",
    "price": 7000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Product Videos",
    "category": "video",
    "categoryName": "Video Production & Editing",
    "emoji": "\ud83c\udfa5",
    "priceStr": "\u20b93,500+",
    "price": 3500,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Color Grading",
    "category": "video",
    "categoryName": "Video Production & Editing",
    "emoji": "\ud83c\udfa5",
    "priceStr": "\u20b92,000+",
    "price": 2000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Sound Design",
    "category": "video",
    "categoryName": "Video Production & Editing",
    "emoji": "\ud83c\udfa5",
    "priceStr": "\u20b92,000+",
    "price": 2000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Visual Effects",
    "category": "video",
    "categoryName": "Video Production & Editing",
    "emoji": "\ud83c\udfa5",
    "priceStr": "\u20b94,000+",
    "price": 4000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Standard SaaS video",
    "category": "video",
    "categoryName": "Video Production & Editing",
    "emoji": "\ud83c\udfa5",
    "priceStr": "\u20b910,000\u2013\u20b915,000+",
    "price": 10000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Advance SaaS video",
    "category": "video",
    "categoryName": "Video Production & Editing",
    "emoji": "\ud83c\udfa5",
    "priceStr": "\u20b920,000\u2013\u20b950,000+",
    "price": 20000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Logo Design",
    "category": "design",
    "categoryName": "Graphic & Creative Design",
    "emoji": "\ud83c\udfa8",
    "priceStr": "\u20b91,000+",
    "price": 1000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Brand Identity",
    "category": "design",
    "categoryName": "Graphic & Creative Design",
    "emoji": "\ud83c\udfa8",
    "priceStr": "\u20b95,000+",
    "price": 5000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Social Media Creatives",
    "category": "design",
    "categoryName": "Graphic & Creative Design",
    "emoji": "\ud83c\udfa8",
    "priceStr": "\u20b9800+",
    "price": 800,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Graphic Designing",
    "category": "design",
    "categoryName": "Graphic & Creative Design",
    "emoji": "\ud83c\udfa8",
    "priceStr": "\u20b9800+",
    "price": 800,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Banners",
    "category": "design",
    "categoryName": "Graphic & Creative Design",
    "emoji": "\ud83c\udfa8",
    "priceStr": "\u20b9700+",
    "price": 700,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Thumbnails",
    "category": "design",
    "categoryName": "Graphic & Creative Design",
    "emoji": "\ud83c\udfa8",
    "priceStr": "\u20b9500+",
    "price": 500,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Brochures",
    "category": "design",
    "categoryName": "Graphic & Creative Design",
    "emoji": "\ud83c\udfa8",
    "priceStr": "\u20b92,000+",
    "price": 2000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Business Cards",
    "category": "design",
    "categoryName": "Graphic & Creative Design",
    "emoji": "\ud83c\udfa8",
    "priceStr": "\u20b9700+",
    "price": 700,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Packaging Design",
    "category": "design",
    "categoryName": "Graphic & Creative Design",
    "emoji": "\ud83c\udfa8",
    "priceStr": "\u20b93,000+",
    "price": 3000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Presentation Design",
    "category": "design",
    "categoryName": "Graphic & Creative Design",
    "emoji": "\ud83c\udfa8",
    "priceStr": "\u20b92,500+",
    "price": 2500,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Infographics",
    "category": "design",
    "categoryName": "Graphic & Creative Design",
    "emoji": "\ud83c\udfa8",
    "priceStr": "\u20b91,500+",
    "price": 1500,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Photo Editing",
    "category": "photo",
    "categoryName": "Photo Services",
    "emoji": "\ud83d\udcf8",
    "priceStr": "\u20b9600+",
    "price": 600,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Professional Retouching",
    "category": "photo",
    "categoryName": "Photo Services",
    "emoji": "\ud83d\udcf8",
    "priceStr": "\u20b91,000+",
    "price": 1000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Photo Manipulation",
    "category": "photo",
    "categoryName": "Photo Services",
    "emoji": "\ud83d\udcf8",
    "priceStr": "\u20b91,500+",
    "price": 1500,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Background Removal",
    "category": "photo",
    "categoryName": "Photo Services",
    "emoji": "\ud83d\udcf8",
    "priceStr": "\u20b9300+",
    "price": 300,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Image Enhancement",
    "category": "photo",
    "categoryName": "Photo Services",
    "emoji": "\ud83d\udcf8",
    "priceStr": "\u20b9500+",
    "price": 500,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "AI Image Generation",
    "category": "photo",
    "categoryName": "Photo Services",
    "emoji": "\ud83d\udcf8",
    "priceStr": "\u20b91,000+",
    "price": 1000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Product Photo Editing",
    "category": "photo",
    "categoryName": "Photo Services",
    "emoji": "\ud83d\udcf8",
    "priceStr": "\u20b9700+",
    "price": 700,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Meta Ads Setup",
    "category": "marketing",
    "categoryName": "Digital Marketing",
    "emoji": "\ud83d\udcb8",
    "priceStr": "\u20b95,000+",
    "price": 5000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Google Ads Setup",
    "category": "marketing",
    "categoryName": "Digital Marketing",
    "emoji": "\ud83d\udcb8",
    "priceStr": "\u20b97,000+",
    "price": 7000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Social Media Marketing",
    "category": "marketing",
    "categoryName": "Digital Marketing",
    "emoji": "\ud83d\udcb8",
    "priceStr": "\u20b98,000/month",
    "price": 8000,
    "isRecurring": true,
    "isHourly": false
  },
  {
    "name": "Performance Marketing",
    "category": "marketing",
    "categoryName": "Digital Marketing",
    "emoji": "\ud83d\udcb8",
    "priceStr": "\u20b910,000/month",
    "price": 10000,
    "isRecurring": true,
    "isHourly": false
  },
  {
    "name": "Content Marketing",
    "category": "marketing",
    "categoryName": "Digital Marketing",
    "emoji": "\ud83d\udcb8",
    "priceStr": "\u20b96,000/month",
    "price": 6000,
    "isRecurring": true,
    "isHourly": false
  },
  {
    "name": "SEO",
    "category": "marketing",
    "categoryName": "Digital Marketing",
    "emoji": "\ud83d\udcb8",
    "priceStr": "\u20b910,000/month",
    "price": 10000,
    "isRecurring": true,
    "isHourly": false
  },
  {
    "name": "Email Marketing",
    "category": "marketing",
    "categoryName": "Digital Marketing",
    "emoji": "\ud83d\udcb8",
    "priceStr": "\u20b95,000+",
    "price": 5000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Brand Growth Strategy",
    "category": "marketing",
    "categoryName": "Digital Marketing",
    "emoji": "\ud83d\udcb8",
    "priceStr": "\u20b98,000+",
    "price": 8000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Complete Social Media Handling",
    "category": "smm",
    "categoryName": "Social Media Management",
    "emoji": "\ud83c\udf10",
    "priceStr": "\u20b912,000/month",
    "price": 12000,
    "isRecurring": true,
    "isHourly": false
  },
  {
    "name": "Content Planning",
    "category": "smm",
    "categoryName": "Social Media Management",
    "emoji": "\ud83c\udf10",
    "priceStr": "\u20b93,000+",
    "price": 3000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Page Management",
    "category": "smm",
    "categoryName": "Social Media Management",
    "emoji": "\ud83c\udf10",
    "priceStr": "\u20b96,000/month",
    "price": 6000,
    "isRecurring": true,
    "isHourly": false
  },
  {
    "name": "Community Management",
    "category": "smm",
    "categoryName": "Social Media Management",
    "emoji": "\ud83c\udf10",
    "priceStr": "\u20b95,000/month",
    "price": 5000,
    "isRecurring": true,
    "isHourly": false
  },
  {
    "name": "Growth Strategy",
    "category": "smm",
    "categoryName": "Social Media Management",
    "emoji": "\ud83c\udf10",
    "priceStr": "\u20b95,000+",
    "price": 5000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Analytics & Optimization",
    "category": "smm",
    "categoryName": "Social Media Management",
    "emoji": "\ud83c\udf10",
    "priceStr": "\u20b93,000+",
    "price": 3000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Business Websites",
    "category": "dev",
    "categoryName": "Web & App Development",
    "emoji": "\ud83d\udcbb",
    "priceStr": "\u20b920,000+",
    "price": 20000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Portfolio Websites",
    "category": "dev",
    "categoryName": "Web & App Development",
    "emoji": "\ud83d\udcbb",
    "priceStr": "\u20b912,000+",
    "price": 12000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Landing Pages",
    "category": "dev",
    "categoryName": "Web & App Development",
    "emoji": "\ud83d\udcbb",
    "priceStr": "\u20b98,000+",
    "price": 8000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Custom Web Applications",
    "category": "dev",
    "categoryName": "Web & App Development",
    "emoji": "\ud83d\udcbb",
    "priceStr": "\u20b935,000+",
    "price": 35000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "E-Commerce Websites",
    "category": "dev",
    "categoryName": "Web & App Development",
    "emoji": "\ud83d\udcbb",
    "priceStr": "\u20b940,000+",
    "price": 40000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "E-Commerce Apps",
    "category": "dev",
    "categoryName": "Web & App Development",
    "emoji": "\ud83d\udcbb",
    "priceStr": "\u20b960,000+",
    "price": 60000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Dashboard Development",
    "category": "dev",
    "categoryName": "Web & App Development",
    "emoji": "\ud83d\udcbb",
    "priceStr": "\u20b920,000+",
    "price": 20000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "API Integration",
    "category": "dev",
    "categoryName": "Web & App Development",
    "emoji": "\ud83d\udcbb",
    "priceStr": "\u20b95,000+",
    "price": 5000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Standard SaaS Development",
    "category": "dev",
    "categoryName": "Web & App Development",
    "emoji": "\ud83d\udcbb",
    "priceStr": "\u20b925,000 \u2013 \u20b950,000+",
    "price": 25000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Advanced SaaS Development",
    "category": "dev",
    "categoryName": "Web & App Development",
    "emoji": "\ud83d\udcbb",
    "priceStr": "\u20b975,000 \u2013 \u20b92,00,000+",
    "price": 75000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Website UI",
    "category": "uiux",
    "categoryName": "UI/UX Design",
    "emoji": "\ud83d\udd8c",
    "priceStr": "\u20b93,000+",
    "price": 3000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Mobile App UI",
    "category": "uiux",
    "categoryName": "UI/UX Design",
    "emoji": "\ud83d\udd8c",
    "priceStr": "\u20b95,000+",
    "price": 5000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Dashboard UI",
    "category": "uiux",
    "categoryName": "UI/UX Design",
    "emoji": "\ud83d\udd8c",
    "priceStr": "\u20b94,000+",
    "price": 4000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Wireframes",
    "category": "uiux",
    "categoryName": "UI/UX Design",
    "emoji": "\ud83d\udd8c",
    "priceStr": "\u20b92,000+",
    "price": 2000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Prototypes",
    "category": "uiux",
    "categoryName": "UI/UX Design",
    "emoji": "\ud83d\udd8c",
    "priceStr": "\u20b93,000+",
    "price": 3000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "User Experience Design",
    "category": "uiux",
    "categoryName": "UI/UX Design",
    "emoji": "\ud83d\udd8c",
    "priceStr": "\u20b95,000+",
    "price": 5000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Frontend Development",
    "category": "software",
    "categoryName": "Software & Coding Solutions",
    "emoji": "\ud83d\udd17",
    "priceStr": "\u20b910,000+",
    "price": 10000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Backend Development",
    "category": "software",
    "categoryName": "Software & Coding Solutions",
    "emoji": "\ud83d\udd17",
    "priceStr": "\u20b915,000+",
    "price": 15000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Full Stack Development",
    "category": "software",
    "categoryName": "Software & Coding Solutions",
    "emoji": "\ud83d\udd17",
    "priceStr": "\u20b925,000+",
    "price": 25000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Custom Software",
    "category": "software",
    "categoryName": "Software & Coding Solutions",
    "emoji": "\ud83d\udd17",
    "priceStr": "\u20b950,000+",
    "price": 50000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Automation Scripts",
    "category": "software",
    "categoryName": "Software & Coding Solutions",
    "emoji": "\ud83d\udd17",
    "priceStr": "\u20b95,000+",
    "price": 5000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "API Development",
    "category": "software",
    "categoryName": "Software & Coding Solutions",
    "emoji": "\ud83d\udd17",
    "priceStr": "\u20b98,000+",
    "price": 8000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Bug Fixing",
    "category": "software",
    "categoryName": "Software & Coding Solutions",
    "emoji": "\ud83d\udd17",
    "priceStr": "\u20b91,500+",
    "price": 1500,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Database Solutions",
    "category": "software",
    "categoryName": "Software & Coding Solutions",
    "emoji": "\ud83d\udd17",
    "priceStr": "\u20b98,000+",
    "price": 8000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Business Automation",
    "category": "tech",
    "categoryName": "Technology Solutions",
    "emoji": "\u2699\ufe0f",
    "priceStr": "\u20b915,000+",
    "price": 15000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Cloud Solutions",
    "category": "tech",
    "categoryName": "Technology Solutions",
    "emoji": "\u2699\ufe0f",
    "priceStr": "\u20b920,000+",
    "price": 20000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Digital Transformation",
    "category": "tech",
    "categoryName": "Technology Solutions",
    "emoji": "\u2699\ufe0f",
    "priceStr": "\u20b930,000+",
    "price": 30000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "IT Consulting",
    "category": "tech",
    "categoryName": "Technology Solutions",
    "emoji": "\u2699\ufe0f",
    "priceStr": "\u20b92,000/hour",
    "price": 2000,
    "isRecurring": false,
    "isHourly": true
  },
  {
    "name": "Technical Support",
    "category": "tech",
    "categoryName": "Technology Solutions",
    "emoji": "\u2699\ufe0f",
    "priceStr": "\u20b91,000/hour",
    "price": 1000,
    "isRecurring": false,
    "isHourly": true
  },
  {
    "name": "Workflow Optimization",
    "category": "tech",
    "categoryName": "Technology Solutions",
    "emoji": "\u2699\ufe0f",
    "priceStr": "\u20b910,000+",
    "price": 10000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Branding & Rebranding",
    "category": "additional",
    "categoryName": "Additional Services",
    "emoji": "\ud83d\udcc2",
    "priceStr": "\u20b910,000+",
    "price": 10000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Creative Consultation",
    "category": "additional",
    "categoryName": "Additional Services",
    "emoji": "\ud83d\udcc2",
    "priceStr": "\u20b92,000/hour",
    "price": 2000,
    "isRecurring": false,
    "isHourly": true
  },
  {
    "name": "Business Identity Development",
    "category": "additional",
    "categoryName": "Additional Services",
    "emoji": "\ud83d\udcc2",
    "priceStr": "\u20b98,000+",
    "price": 8000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Presentation & Pitch Deck Design",
    "category": "additional",
    "categoryName": "Additional Services",
    "emoji": "\ud83d\udcc2",
    "priceStr": "\u20b93,000+",
    "price": 3000,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "NFT & Digital Art",
    "category": "additional",
    "categoryName": "Additional Services",
    "emoji": "\ud83d\udcc2",
    "priceStr": "\u20b92,500+",
    "price": 2500,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Print Design",
    "category": "additional",
    "categoryName": "Additional Services",
    "emoji": "\ud83d\udcc2",
    "priceStr": "\u20b91,500+",
    "price": 1500,
    "isRecurring": false,
    "isHourly": false
  },
  {
    "name": "Consulting & Strategy",
    "category": "additional",
    "categoryName": "Additional Services",
    "emoji": "\ud83d\udcc2",
    "priceStr": "\u20b95,000+",
    "price": 5000,
    "isRecurring": false,
    "isHourly": false
  }
];

  const gridContainer = document.getElementById('services-grid-container');
  const searchInput = document.getElementById('services-search');
  const categoryFilters = document.querySelectorAll('#services-categories-container .filter-btn');

  // Parse page category from pathname
  let activeCategory = 'all';
  const pagePath = window.location.pathname.toLowerCase();
  
  if (pagePath.includes('ai-solutions')) activeCategory = 'ai';
  else if (pagePath.includes('video-production')) activeCategory = 'video';
  else if (pagePath.includes('graphic-design')) activeCategory = 'design';
  else if (pagePath.includes('photo-services')) activeCategory = 'photo';
  else if (pagePath.includes('digital-marketing')) activeCategory = 'marketing';
  else if (pagePath.includes('social-media-management')) activeCategory = 'smm';
  else if (pagePath.includes('web-app-development')) activeCategory = 'dev';
  else if (pagePath.includes('ui-ux-design')) activeCategory = 'uiux';
  else if (pagePath.includes('software-coding-solutions')) activeCategory = 'software';
  else if (pagePath.includes('technology-solutions')) activeCategory = 'tech';
  else if (pagePath.includes('additional-services')) activeCategory = 'additional';

  // Highlight active category nav filter if present
  if (categoryFilters.length > 0) {
    categoryFilters.forEach(btn => {
      const cat = btn.getAttribute('data-filter');
      if (cat === activeCategory) {
        categoryFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  }

  let searchQuery = '';
  
  // LocalStorage State Load
  let selectedServices = new Set(JSON.parse(localStorage.getItem('selectedServices') || '[]'));

  const syncNavbarBadge = () => {
    // Check both desktop and mobile drawer links
    const navLinks = document.querySelectorAll('.nav-link, .drawer-link');
    navLinks.forEach(link => {
      if (link.getAttribute('href') && link.getAttribute('href').includes('#pricing')) {
        let badge = link.querySelector('.nav-badge');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'nav-badge';
          badge.style.background = 'var(--accent-pink)';
          badge.style.color = '#fff';
          badge.style.fontSize = '10px';
          badge.style.fontWeight = '700';
          badge.style.padding = '2px 6px';
          badge.style.borderRadius = '10px';
          badge.style.marginLeft = '6px';
          link.appendChild(badge);
        }
        
        if (selectedServices.size > 0) {
          badge.textContent = selectedServices.size;
          badge.style.display = 'inline-block';
        } else {
          badge.style.display = 'none';
        }
      }
    });
  };

  /* currencyRates and convertPrice declared once at top */

    const descriptions_map = {
  "AI Automation": {
    "desc": "Custom workflow automations connecting your apps (CRM, Email, WhatsApp, Slack) using Zapier, Make, and custom Python scripts to eliminate repetitive manual tasks.",
    "deliverables": [
      "24/7 Auto Execution",
      "Multi-App Integrations",
      "Error Alert Triggers"
    ],
    "timeline": "3\u20135 Days"
  },
  "AI Chatbot": {
    "desc": "Custom AI assistant powered by GPT-4 trained on your business data, handling customer support, lead qualification, and appointment booking automatically.",
    "deliverables": [
      "GPT-4 Engine",
      "Knowledgebase Training",
      "Website & WhatsApp Embed"
    ],
    "timeline": "4\u20137 Days"
  },
  "AI Integration": {
    "desc": "Seamless REST API integration of OpenAI, Claude, Midjourney, or custom LLM endpoints directly into your existing software and mobile applications.",
    "deliverables": [
      "REST API Hooks",
      "Token Optimization",
      "Secure Key Storage"
    ],
    "timeline": "3\u20136 Days"
  },
  "Custom AI Tools": {
    "desc": "Bespoke AI-powered micro-tools and web apps built specifically for your internal team or customers to generate text, analyze documents, or process data.",
    "deliverables": [
      "Custom Web Portal",
      "User Access Control",
      "Data Export Tools"
    ],
    "timeline": "7\u201312 Days"
  },
  "AI System Setup": {
    "desc": "End-to-end deployment of enterprise AI infrastructure, vector databases (Pinecone/Weaviate), and private LLM hosting for enterprise security.",
    "deliverables": [
      "Vector DB Setup",
      "Private API Server",
      "Data Privacy Shield"
    ],
    "timeline": "10\u201315 Days"
  },
  "Short-Form Video Editing": {
    "desc": "High-retention Reels, TikToks, and Shorts with dynamic captions, sound effects, B-roll transitions, and visual hooks engineered for viral engagement.",
    "deliverables": [
      "4K 9:16 Format",
      "Subtitles & SFX",
      "Viral Hook Design"
    ],
    "timeline": "1\u20133 Days"
  },
  "Long-Form Video Editing": {
    "desc": "Professional YouTube, course, or podcast video editing featuring color grading, audio cleanup, multi-cam switching, and custom intro/outro motion graphics.",
    "deliverables": [
      "Color Graded 4K",
      "Noise-Reduced Audio",
      "Chapter Markers"
    ],
    "timeline": "3\u20135 Days"
  },
  "Motion Graphics": {
    "desc": "Eye-catching 2D/3D motion graphics, animated logo reveals, lower thirds, and visual overlays to elevate your brand video production.",
    "deliverables": [
      "After Effects Source",
      "Transparent Alpha Video",
      "60fps Render"
    ],
    "timeline": "2\u20134 Days"
  },
  "2D/3D Animation": {
    "desc": "Full-narrative animated explainer videos and product visualizers built to explain complex software, physical products, or abstract services easily.",
    "deliverables": [
      "Storyboard & Script",
      "Custom Characters",
      "Professional Voiceover"
    ],
    "timeline": "7\u201314 Days"
  },
  "Video Production": {
    "desc": "End-to-end video creation from scripting, creative direction, professional voiceovers, stock footage curation, to final cinematic post-production.",
    "deliverables": [
      "Scriptwriting",
      "Licensed Audio Track",
      "Multi-Format Export"
    ],
    "timeline": "5\u201310 Days"
  },
  "Logo Design": {
    "desc": "Memorable, modern vector logo design with full brand versatility, icon mark, typography selection, and dark/light color variations.",
    "deliverables": [
      "SVG, PNG, EPS Vector",
      "Dark & Light Versions",
      "Favicon Assets"
    ],
    "timeline": "2\u20134 Days"
  },
  "Branding Package": {
    "desc": "Complete visual brand identity system including logo suite, color palette, font hierarchy, brand guidelines PDF, and social media media kit.",
    "deliverables": [
      "Brand Stylebook PDF",
      "Color Tokens (HEX/RGB)",
      "Typography Kit"
    ],
    "timeline": "5\u20138 Days"
  },
  "Posters & Banners": {
    "desc": "High-impact digital and print posters, display banners, event graphics, and ad creatives designed for maximum visual appeal.",
    "deliverables": [
      "Print-Ready PDF",
      "300 DPI High-Res",
      "Source Photoshop File"
    ],
    "timeline": "1\u20133 Days"
  },
  "Packaging Design": {
    "desc": "3D product packaging, die-line templates, label designs, and box artwork crafted for retail shelves and e-commerce unboxing experiences.",
    "deliverables": [
      "Vector Dielines",
      "3D Render Mockups",
      "Print Prep Files"
    ],
    "timeline": "4\u20137 Days"
  },
  "Infographics": {
    "desc": "Data-rich, visually captivating infographics that transform complex statistics, workflows, or research into easy-to-digest visual assets.",
    "deliverables": [
      "High-Res Vector",
      "Web & Print Specs",
      "Social Crop Versions"
    ],
    "timeline": "2\u20134 Days"
  },
  "Business Cards": {
    "desc": "Premium luxury business card designs with foil stamping, spot UV, or embossed finishes formatted for professional commercial printers.",
    "deliverables": [
      "Double-Sided Design",
      "Print Bleed Setup",
      "Editable Vector"
    ],
    "timeline": "1\u20132 Days"
  },
  "Photo Editing & Retouching": {
    "desc": "High-end portrait and commercial retouching including skin smoothing, color balancing, lighting correction, and detail enhancement.",
    "deliverables": [
      "Lossless TIFF/PNG",
      "RAW Color Grade",
      "Object Cleanup"
    ],
    "timeline": "1\u20133 Days"
  },
  "Background Removal": {
    "desc": "Pixel-perfect cutout of objects, models, or products with transparent PNG export and clean background replacement.",
    "deliverables": [
      "Transparent PNG",
      "Pure White Background",
      "Shadow Effects"
    ],
    "timeline": "1 Day"
  },
  "Photo Manipulation": {
    "desc": "Creative photo compositing, surreal artwork creation, multi-image blending, and special FX visual enhancements.",
    "deliverables": [
      "High-Res Artwork",
      "PSD Layered Source",
      "Custom Effects"
    ],
    "timeline": "2\u20134 Days"
  },
  "AI Image Generation": {
    "desc": "Custom Midjourney and Stable Diffusion prompt engineering for commercial stock images, product concepts, and digital art generation.",
    "deliverables": [
      "4K Upscaled Images",
      "Commercial Rights",
      "Prompt Templates"
    ],
    "timeline": "1\u20132 Days"
  },
  "Product Photo Editing": {
    "desc": "E-commerce product photo optimization for Amazon, Shopify, and websites featuring glare removal, ghost mannequin, and shadow tuning.",
    "deliverables": [
      "Amazon Compliant Specs",
      "Reflection Removal",
      "Bulk Image Export"
    ],
    "timeline": "1\u20133 Days"
  },
  "Meta Ads Setup": {
    "desc": "Strategic Facebook & Instagram ad campaign architecture including pixel installation, custom audience creation, ad creative copy, and bid setup.",
    "deliverables": [
      "Meta Pixel & CAPI Setup",
      "3 Ad Creative Variations",
      "Audience Targeting Matrix"
    ],
    "timeline": "2\u20134 Days"
  },
  "Google Ads Setup": {
    "desc": "Precision Google Search, Display, and Shopping campaign buildout with negative keyword lists, ad extensions, and conversion tracking.",
    "deliverables": [
      "GAds Conversion Tagging",
      "Keyword Research Sheet",
      "A/B Copy Test"
    ],
    "timeline": "3\u20135 Days"
  },
  "Social Media Marketing": {
    "desc": "Monthly multi-channel promotional campaigns across Facebook, Instagram, LinkedIn, and X designed to generate qualified business leads.",
    "deliverables": [
      "Monthly Content Strategy",
      "Ad Budget Optimization",
      "Weekly Performance Reports"
    ],
    "timeline": "Monthly Retainer"
  },
  "Performance Marketing": {
    "desc": "Data-driven full-funnel performance marketing focusing on CAC reduction, ROAS scaling, and multi-channel attribution.",
    "deliverables": [
      "ROAS Tracking Sheet",
      "Funnel Optimization",
      "Bi-Weekly Strategy Calls"
    ],
    "timeline": "Monthly Retainer"
  },
  "Content Marketing": {
    "desc": "SEO-focused article writing, lead magnets, case study copy, and thought leadership content engineered to drive organic inbound traffic.",
    "deliverables": [
      "SEO Keyword Articles",
      "Lead Magnet E-book",
      "Distribution Plan"
    ],
    "timeline": "Monthly Retainer"
  },
  "SEO": {
    "desc": "Complete technical and on-page Search Engine Optimization, backlink building, Google Business profile setup, and rank tracking.",
    "deliverables": [
      "Technical Audit Report",
      "On-Page Schema Setup",
      "Keyword Rank Dashboard"
    ],
    "timeline": "Monthly Retainer"
  },
  "Email Marketing": {
    "desc": "Automated email welcome sequences, abandoned cart flows, weekly newsletters, and list segmentation using Klaviyo, Mailchimp, or Brevo.",
    "deliverables": [
      "5-Email Flow Sequence",
      "Custom HTML Templates",
      "A/B Subject Testing"
    ],
    "timeline": "3\u20135 Days"
  },
  "Brand Growth Strategy": {
    "desc": "Comprehensive 90-day go-to-market and scaling blueprint identifying target personas, channel mix, pricing positioning, and unit economics.",
    "deliverables": [
      "90-Day Roadmap PDF",
      "Competitor Matrix",
      "Channel Budget Allocator"
    ],
    "timeline": "5\u20137 Days"
  },
  "Complete Social Media Handling": {
    "desc": "Turnkey management of your social channels: content creation, reel editing, scheduling, caption writing, community engagement, and analytics.",
    "deliverables": [
      "15\u201320 Posts/Reels Per Month",
      "Daily Story Updates",
      "Community DM Management"
    ],
    "timeline": "Monthly Retainer"
  },
  "Content Planning": {
    "desc": "Strategic monthly content calendar detailing post themes, visual assets, caption copy, hashtag strategy, and optimal posting times.",
    "deliverables": [
      "Notion Content Board",
      "Copywriting Sheet",
      "Hashtag Bank"
    ],
    "timeline": "3\u20135 Days"
  },
  "Page Management": {
    "desc": "Active daily monitoring of your brand profiles, comment responses, bio optimization, highlight icon design, and spam filtering.",
    "deliverables": [
      "Daily Profile Monitoring",
      "Custom Bio & Highlights",
      "Reputation Defense"
    ],
    "timeline": "Monthly Retainer"
  },
  "Community Management": {
    "desc": "Engaging directly with your target audience, responding to DMs, building community relationships, and participating in niche conversations.",
    "deliverables": [
      "DM Response Playbook",
      "Active Outreach",
      "Engagement Metrics"
    ],
    "timeline": "Monthly Retainer"
  },
  "Growth Strategy": {
    "desc": "Viral growth roadmap leveraging trend analysis, influencer collaborations, cross-promotions, and algorithm optimization tactics.",
    "deliverables": [
      "Growth Audit PDF",
      "Trend Spotting Sheets",
      "Influencer Outreach Brief"
    ],
    "timeline": "3\u20135 Days"
  },
  "Corporate Website": {
    "desc": "Sleek, lightning-fast corporate website with custom design, mobile responsiveness, dark/light themes, SEO optimization, and CMS integration.",
    "deliverables": [
      "5\u20138 Custom Pages",
      "SEO & Speed 95+ Score",
      "Contact Form Setup"
    ],
    "timeline": "7\u201312 Days"
  },
  "Landing Page Design": {
    "desc": "High-converting single-page sales funnel designed to convert ad traffic into paid customers with dynamic CTAs and fast load times.",
    "deliverables": [
      "Responsive Mobile Layout",
      "Copywriting Polish",
      "Analytics Tagging"
    ],
    "timeline": "3\u20136 Days"
  },
  "Custom Web Application": {
    "desc": "Full-stack web application built with React/Next.js and Node.js featuring user authentication, database management, and payment gateway.",
    "deliverables": [
      "React/Next.js Frontend",
      "Node/Database Backend",
      "Stripe/Razorpay Integration"
    ],
    "timeline": "14\u201321 Days"
  },
  "Mobile App Development": {
    "desc": "Cross-platform iOS and Android mobile app built with Flutter or React Native with push notifications, offline mode, and App Store submission.",
    "deliverables": [
      "iOS & Android Build",
      "App Store Submission",
      "Push Notification Setup"
    ],
    "timeline": "21\u201330 Days"
  },
  "Standard Website": {
    "desc": "Clean 3-5 page business website ideal for startups and local businesses looking for a professional digital presence.",
    "deliverables": [
      "Responsive Layout",
      "Google Maps & Contact",
      "Fast Hosting Deployment"
    ],
    "timeline": "4\u20137 Days"
  },
  "Advanced Website": {
    "desc": "Complex enterprise portal with multi-language support, custom interactive tools, animations, client portal, and CMS integration.",
    "deliverables": [
      "Custom CMS Portal",
      "Interactive Calculators",
      "Multi-Language Support"
    ],
    "timeline": "10\u201318 Days"
  },
  "Website Maintenance": {
    "desc": "Monthly website security monitoring, plugin updates, speed optimizations, automated cloud backups, and content updates.",
    "deliverables": [
      "24/7 Uptime Monitoring",
      "Weekly Backups",
      "2 Hours Monthly Edits"
    ],
    "timeline": "Monthly Retainer"
  },
  "Website UI Design": {
    "desc": "Modern, visual UI design system in Figma featuring desktop and mobile screens, custom icons, typography rules, and component libraries.",
    "deliverables": [
      "Figma Design System",
      "Desktop & Mobile Views",
      "Developer Handoff Specs"
    ],
    "timeline": "5\u20139 Days"
  },
  "Mobile App UI Design": {
    "desc": "Intuitive mobile user interface design following Apple Human Interface & Google Material guidelines for iOS and Android.",
    "deliverables": [
      "10\u201315 App Screens",
      "Figma Components",
      "Interactive Prototype"
    ],
    "timeline": "6\u201310 Days"
  },
  "UI/UX Audit": {
    "desc": "Deep UX analysis of your existing website or app identifying friction points, usability issues, accessibility bugs, and conversion bottlenecks.",
    "deliverables": [
      "Heuristic Evaluation PDF",
      "Loom Video Walkthrough",
      "Wireframe Fix Suggestions"
    ],
    "timeline": "2\u20134 Days"
  },
  "Wireframing & Prototyping": {
    "desc": "Low-fidelity structural wireframes and clickable high-fidelity prototypes to test user flows before writing any code.",
    "deliverables": [
      "Interactive Clickable Prototype",
      "User Journey Map",
      "Screen Flow Diagrams"
    ],
    "timeline": "4\u20137 Days"
  },
  "Frontend Development": {
    "desc": "Pixel-perfect HTML5/CSS3/JavaScript or React component development built strictly matching Figma designs with smooth micro-animations.",
    "deliverables": [
      "Clean Code Standard",
      "Cross-Browser Compatible",
      "Speed Optimized"
    ],
    "timeline": "4\u20138 Days"
  },
  "Backend Development": {
    "desc": "Secure, scalable server architecture using Node.js, Python, or Go with PostgreSQL/MongoDB databases, authentication, and REST APIs.",
    "deliverables": [
      "REST/GraphQL API",
      "JWT Authentication",
      "Database Schema & Migrations"
    ],
    "timeline": "7\u201314 Days"
  },
  "Bug Fixing & Optimization": {
    "desc": "Rapid debugging of broken JavaScript, CSS alignment bugs, backend exceptions, database query slowness, and security vulnerabilities.",
    "deliverables": [
      "Code Patch & Refactor",
      "Speed Benchmark Test",
      "Bug Fix Summary Report"
    ],
    "timeline": "1\u20133 Days"
  },
  "API Development": {
    "desc": "Custom RESTful or GraphQL API development with comprehensive Swagger API documentation, rate limiting, and third-party webhook handlers.",
    "deliverables": [
      "Swagger API Docs",
      "Rate Limiting & Auth",
      "Webhook Dispatcher"
    ],
    "timeline": "4\u20138 Days"
  },
  "IT Consulting": {
    "desc": "Strategic technology advising for startups and enterprises on tech stack selection, system architecture, team hiring, and digital transformation.",
    "deliverables": [
      "Architecture Diagram",
      "Tech Stack Recommendations",
      "1-on-1 Consultation Call"
    ],
    "timeline": "2\u20134 Days"
  },
  "Cloud Setup": {
    "desc": "Configuration of AWS, Google Cloud, DigitalOcean, or Vercel cloud infrastructure with SSL certificates, CDN distribution, and auto-scaling.",
    "deliverables": [
      "AWS/GCP Provisioning",
      "SSL & Domain DNS",
      "CDN Edge Caching"
    ],
    "timeline": "3\u20135 Days"
  },
  "System Architecture": {
    "desc": "Enterprise software system architecture design for high-concurrency applications, microservices, and distributed cloud systems.",
    "deliverables": [
      "UML & System Diagrams",
      "Database Sharding Plan",
      "Failover Architecture"
    ],
    "timeline": "5\u20139 Days"
  },
  "Workflow Optimization": {
    "desc": "Audit and streamlining of business operational software, internal communications, CRM data flow, and tool consolidation.",
    "deliverables": [
      "Process Map PDF",
      "SaaS Cost Reduction Audit",
      "Automation Roadmap"
    ],
    "timeline": "4\u20137 Days"
  },
  "Branding & Rebranding": {
    "desc": "Complete brand overhaul for established businesses looking to modernize their visual identity, messaging, and market positioning.",
    "deliverables": [
      "New Logo Suite",
      "Rebranding Launch Guide",
      "Marketing Asset Overhaul"
    ],
    "timeline": "7\u201312 Days"
  },
  "Creative Consultation": {
    "desc": "1-on-1 strategic creative advisory session with our design directors to solve specific creative, branding, or UI/UX challenges.",
    "deliverables": [
      "60-Min Consultation Call",
      "Action Plan Summary",
      "Resource Curation"
    ],
    "timeline": "1 Day"
  },
  "Business Identity Development": {
    "desc": "Formulation of mission statement, tagline, brand voice, core values, and corporate communication persona.",
    "deliverables": [
      "Brand Identity Document",
      "Tone of Voice Matrix",
      "Tagline Proposals"
    ],
    "timeline": "3\u20135 Days"
  },
  "Presentation & Pitch Deck Design": {
    "desc": "Investor-ready 15\u201320 slide pitch deck design with custom graphics, data charts, financial layouts, and PowerPoint/Keynote source files.",
    "deliverables": [
      "Investor Pitch Deck PDF",
      "Editable PPTX/Keynote",
      "Custom Data Graphics"
    ],
    "timeline": "3\u20136 Days"
  },
  "NFT & Digital Art": {
    "desc": "High-end 2D/3D digital artwork, generative collection assets, metadata setup, and smart contract design for Web3 projects.",
    "deliverables": [
      "High-Res Digital Art",
      "Rarity Traits Setup",
      "IPFS Metadata Setup"
    ],
    "timeline": "5\u201310 Days"
  },
  "Print Design": {
    "desc": "Professional print collateral design including brochures, flyers, trade show banners, letterheads, and corporate folders.",
    "deliverables": [
      "CMYK Print-Ready Files",
      "Vector Graphics",
      "Mockup Previews"
    ],
    "timeline": "2\u20134 Days"
  },
  "Consulting & Strategy": {
    "desc": "High-level growth and technology advisory package providing strategic direction, team training, and quarterly roadmap reviews.",
    "deliverables": [
      "Quarterly Roadmap",
      "Monthly Review Calls",
      "Direct Team Access"
    ],
    "timeline": "Ongoing Advisory"
  }
};

  const renderServices = () => {
    if (!gridContainer) return;
    gridContainer.innerHTML = '';

    const filtered = servicesData.filter((service) => {
      const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            service.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748b;">
          <i class="fa-solid fa-folder-open" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
          No services matching search. Try typing another term.
        </div>
      `;
      return;
    }

    filtered.forEach((service) => {
      const globalIndex = servicesData.findIndex(s => s.name === service.name && s.category === service.category);
      const isSelected = selectedServices.has(globalIndex);

      const card = document.createElement('div');
      card.className = `service-item-wrapper reveal active`;
      card.setAttribute('data-category', service.category);

      let iconStyle = "background: rgba(0, 240, 255, 0.08); border: 1px solid rgba(0, 240, 255, 0.15); color: var(--accent-cyan);";
      let iconClass = "fa-solid fa-code";

      if (service.category === 'ai') {
        iconStyle = "background: rgba(0, 255, 102, 0.08); border: 1px solid rgba(0, 255, 102, 0.15); color: var(--accent-emerald);";
        iconClass = "fa-solid fa-robot";
      } else if (service.category === 'video') {
        iconStyle = "background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.15); color: var(--accent-blue);";
        iconClass = "fa-solid fa-video";
      } else if (service.category === 'design') {
        iconStyle = "background: rgba(255, 0, 229, 0.08); border: 1px solid rgba(255, 0, 229, 0.15); color: var(--accent-pink);";
        iconClass = "fa-solid fa-palette";
      } else if (service.category === 'photo') {
        iconStyle = "background: rgba(139, 92, 246, 0.08); border: 1px solid rgba(139, 92, 246, 0.15); color: var(--accent-violet);";
        iconClass = "fa-solid fa-camera-retro";
      } else if (service.category === 'marketing') {
        iconStyle = "background: rgba(0, 240, 255, 0.08); border: 1px solid rgba(0, 240, 255, 0.15); color: var(--accent-cyan);";
        iconClass = "fa-solid fa-chart-line";
      } else if (service.category === 'smm') {
        iconStyle = "background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.15); color: var(--accent-blue);";
        iconClass = "fa-solid fa-globe";
      } else if (service.category === 'dev') {
        iconStyle = "background: rgba(0, 240, 255, 0.08); border: 1px solid rgba(0, 240, 255, 0.15); color: var(--accent-cyan);";
        iconClass = "fa-solid fa-laptop-code";
      } else if (service.category === 'uiux') {
        iconStyle = "background: rgba(255, 0, 229, 0.08); border: 1px solid rgba(255, 0, 229, 0.15); color: var(--accent-pink);";
        iconClass = "fa-solid fa-compass-drafting";
      } else if (service.category === 'software') {
        iconStyle = "background: rgba(139, 92, 246, 0.08); border: 1px solid rgba(139, 92, 246, 0.15); color: var(--accent-violet);";
        iconClass = "fa-solid fa-cubes";
      } else if (service.category === 'tech') {
        iconStyle = "background: rgba(0, 255, 102, 0.08); border: 1px solid rgba(0, 255, 102, 0.15); color: var(--accent-emerald);";
        iconClass = "fa-solid fa-sliders";
      } else {
        iconStyle = "background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); color: #94a3b8;";
        iconClass = "fa-solid fa-folder-open";
      }

      const extraInfo = descriptions_map[service.name] || {
        desc: `High-quality ${service.name} tailored for scale and measurable impact.`,
        deliverables: ['Custom Setup', 'Quality Assurance', 'Dedicated Support'],
        timeline: '3-7 Days'
      };

      const deliverablesHtml = extraInfo.deliverables.map(d => `<span class="deliverable-badge" style="font-size: 10px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); color: #cbd5e1; padding: 4px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-check" style="color: var(--accent-gold); font-size: 9px;"></i> ${d}</span>`).join('');

      card.innerHTML = `
        <div class="glass-card spotlight-card ${isSelected ? 'selected' : ''}" style="${isSelected ? 'border-color: var(--accent-pink) !important; box-shadow: 0 0 20px rgba(255, 0, 229, 0.2);' : ''}">
          <div class="spotlight-glow"></div>
          <div class="card-content service-card" style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; gap: 16px; padding: 22px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
              <div class="service-icon" style="${iconStyle}"><i class="${iconClass}"></i></div>
              <button class="btn btn-secondary btn-sm select-service-btn" data-index="${globalIndex}" style="padding: 6px 12px; font-size: 11px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; ${isSelected ? 'background: rgba(255,0,229,0.12); border-color: var(--accent-pink); color: var(--accent-pink);' : ''}">
                ${isSelected ? '<i class="fa-solid fa-check"></i> Added' : '<i class="fa-solid fa-plus"></i> Add to Calc'}
              </button>
            </div>
            
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: var(--accent-gold-bright); letter-spacing: 0.05em;">${service.categoryName}</span>
                <span style="font-size: 11px; color: #94a3b8;"><i class="fa-regular fa-clock"></i> ${extraInfo.timeline}</span>
              </div>
              <h3 class="service-title" style="font-size: 19px; font-weight: 700; margin-bottom: 8px; color: #fff;">${service.name}</h3>
              <p class="service-desc" style="font-size: 13px; color: #94a3b8; line-height: 1.55; margin-bottom: 14px;">${extraInfo.desc}</p>
              
              <div class="deliverables-container" style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px;">
                ${deliverablesHtml}
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; border-top: 1px solid var(--border-color); padding-top: 14px; margin-top: auto;">
              <div>
                <div style="font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700;">Starting Cost</div>
                <div style="font-size: 17px; font-weight: 800; color: var(--accent-cyan); font-family: var(--font-headings);">${convertPrice(service.priceStr, activeCurrency)}</div>
              </div>
              <a href="contact.html?service=${encodeURIComponent(service.name)}" class="btn btn-primary btn-sm" style="padding: 6px 14px; font-size: 12px;">Inquire Now →</a>
            </div>
          </div>
        </div>
      `;

      const spotlightCard = card.querySelector('.spotlight-card');
      initSpotlightCard(spotlightCard);

      const selectBtn = card.querySelector('.select-service-btn');
      selectBtn.addEventListener('click', () => {
        toggleServiceSelection(globalIndex);
      });

      gridContainer.appendChild(card);
    });
  };

  const toggleServiceSelection = (index) => {
    if (selectedServices.has(index)) {
      selectedServices.delete(index);
    } else {
      selectedServices.add(index);
    }
    
    // Save to LocalStorage
    localStorage.setItem('selectedServices', JSON.stringify(Array.from(selectedServices)));
    
    renderServices();
    updateInvoiceCalculator();
    syncNavbarBadge();
    
    const badge = document.getElementById('selected-count-badge');
    if (badge) {
      if (selectedServices.size > 0) {
        badge.textContent = selectedServices.size;
        badge.style.display = 'inline-block';
      } else {
        badge.style.display = 'none';
      }
    }
  };

  // Category Filtering (If filters are present on sub-pages)
  if (categoryFilters.length > 0) {
    categoryFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-filter');
        renderServices();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderServices();
    });
  }

  // Load initial grid
  renderServices();
  syncNavbarBadge();

  /* --- 6. Results Case Study Animations --- */
  const animateResults = () => {
    const resultBars = document.querySelectorAll('.result-bar-fill');
    resultBars.forEach(bar => {
      const height = bar.getAttribute('data-height');
      bar.style.height = height;
    });
  };

  /* --- 7. Viewport Reveal Animations --- */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        if (entry.target.id === 'results') {
          animateResults();
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(r => revealObserver.observe(r));

  /* --- 8. Testimonials Track Slider --- */
  const track = document.getElementById('testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  let currentSlideIndex = 0;

  if (track && slides.length > 0) {
    const updateSlider = () => {
      track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlideIndex);
      });
    };

    nextBtn.addEventListener('click', () => {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      updateSlider();
    });

    prevBtn.addEventListener('click', () => {
      currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
      updateSlider();
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        currentSlideIndex = idx;
        updateSlider();
      });
    });
  }

  /* --- 9. Interactive ROI / Pricing Calculator --- */
  let calculatorMode = 'retainer'; 
  
  const budgetSlider = document.getElementById('budget-slider');
  const budgetValue = document.getElementById('budget-value');
  const channelButtons = document.querySelectorAll('.channel-btn');
  
  const calcTabRetainerBtn = document.getElementById('calc-tab-retainer-btn');
  const calcTabInvoiceBtn = document.getElementById('calc-tab-invoice-btn');
  const retainerInputsSection = document.getElementById('calc-retainer-inputs');
  const invoiceInputsSection = document.getElementById('calc-invoice-inputs');
  const invoiceItemsList = document.getElementById('invoice-items-list');

  const outTierLbl = document.getElementById('calc-tier-lbl');
  const outPriceLbl = document.getElementById('calc-price-lbl');
  const outRoiLbl = document.getElementById('calc-roi-lbl');
  const outRevenueLbl = document.getElementById('calc-revenue-lbl');

  const outPlan = document.getElementById('calc-out-plan');
  const outPrice = document.getElementById('calc-out-price');
  const outRoi = document.getElementById('calc-out-roi');
  const outRevenue = document.getElementById('calc-out-revenue');
  const featureList = document.getElementById('calc-features');

  const formatCurrency = (val, currency) => {
    const config = currencyRates[currency] || currencyRates.INR;
    if (currency === 'INR') {
      return '₹' + parseInt(val).toLocaleString('en-IN');
    }
    const converted = Math.round(val * config.rate);
    return config.symbol + converted.toLocaleString(config.locale);
  };

  const updateRetainerCalculator = () => {
    if (!budgetSlider || calculatorMode !== 'retainer') return;
    
    const budget = parseInt(budgetSlider.value);
    budgetValue.textContent = formatCurrency(budget, activeCurrency);

    let activeCount = 0;
    let channelMultiplier = 1.0;
    channelButtons.forEach(btn => {
      if (btn.classList.contains('active')) {
        activeCount++;
        const rate = parseFloat(btn.getAttribute('data-multiplier'));
        channelMultiplier += rate;
      }
    });

    let roas = 2.5; 
    if (budget < 50000) {
      roas = 3.4;
    } else if (budget < 150000) {
      roas = 4.8;
    } else {
      roas = 7.6;
    }

    roas *= channelMultiplier;
    if (activeCount === 0) roas = 0;

    const addedValue = budget * roas;

    outPlan.textContent = budget < 50000 ? 'Starter Growth Plan' : (budget < 150000 ? 'Scale Accelerator Plan' : 'Enterprise Dominance Plan');
    outPrice.textContent = formatCurrency(budget, activeCurrency) + '/mo';
    outRoi.textContent = roas > 0 ? roas.toFixed(1) + 'x ROAS' : '0.0x';
    outRevenue.textContent = formatCurrency(addedValue, activeCurrency) + '/mo';

    let features = [];
    if (budget < 50000) {
      features = [
        'Dedicated Campaign Strategist',
        'Bi-weekly performance audit reports',
        'Advanced competitor keyphrase targeting',
        'Weekly email reporting logs'
      ];
    } else if (budget < 150000) {
      features = [
        'Weekly video consultation logs',
        'Advanced performance reporting dashboard',
        'A/B landing page creative cycles',
        'Custom ad copy audit iterations',
        'Slack client-comms channel setup'
      ];
    } else {
      features = [
        'Full Retainer Suite Integration',
        '24/7 dedicated lead support',
        'Custom AI marketing workflows deployed',
        'Unlimited audit and speed optimizations',
        '100% money-back ROAS guarantees'
      ];
    }

    if (featureList) {
      featureList.innerHTML = '';
      features.forEach(f => {
        const li = document.createElement('div');
        li.className = 'calc-feature-item';
        li.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-gold-bright); margin-right: 8px;"></i> ${f}`;
        featureList.appendChild(li);
      });
    }
  };

  const updateInvoiceCalculator = () => {
    if (!invoiceItemsList || calculatorMode !== 'invoice') return;

    invoiceItemsList.innerHTML = '';
    let totalSum = 0;

    if (selectedServices.size === 0) {
      invoiceItemsList.innerHTML = `
        <p style="font-size: 13px; color: #64748b; text-align: center; padding: 20px 0;">No services selected. Click "Add to Calculator" on any service card in the sub-pages to build your custom invoice.</p>
      `;
      outPlan.textContent = 'Custom Retainer';
      outPrice.textContent = formatCurrency(0, activeCurrency);
      outRoi.textContent = '0.0x';
      outRevenue.textContent = formatCurrency(0, activeCurrency);
      if (featureList) featureList.innerHTML = '';
      return;
    }

    selectedServices.forEach(index => {
      const service = servicesData[index];
      totalSum += service.price;

      const itemRow = document.createElement('div');
      itemRow.style.display = 'flex';
      itemRow.style.justify = 'space-between';
      itemRow.style.alignItems = 'center';
      itemRow.style.padding = '10px 14px';
      itemRow.style.background = 'rgba(255, 255, 255, 0.02)';
      itemRow.style.border = '1px solid var(--border-color)';
      itemRow.style.borderRadius = '10px';
      itemRow.style.fontSize = '12px';

      itemRow.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <span>${service.emoji}</span>
          <span style="color:#fff; font-weight:600;">${service.name}</span>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="color: var(--accent-gold-bright); font-weight:700;">${convertPrice(service.priceStr, activeCurrency)}</span>
          <button type="button" style="background:transparent; border:none; color:#ef4444; cursor:pointer;" onclick="window.removeInvoiceItem(${index})">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
      invoiceItemsList.appendChild(itemRow);
    });

    let efficiencyRate = 1.0;
    if (selectedServices.size > 2) efficiencyRate += 0.15;
    if (selectedServices.size > 5) efficiencyRate += 0.25;

    let baseRoiVal = 3.5;
    let expectedRevenueLift = totalSum * baseRoiVal * efficiencyRate;

    outPlan.textContent = `Custom Package (${selectedServices.size} Items)`;
    outPrice.textContent = formatCurrency(totalSum, activeCurrency);
    outRoi.textContent = (baseRoiVal * efficiencyRate).toFixed(1) + 'x ROI';
    outRevenue.textContent = formatCurrency(expectedRevenueLift, activeCurrency) + ' est.';

    const activeCategories = Array.from(selectedServices).map(idx => servicesData[idx].categoryName);
    const uniqueCategories = Array.from(new Set(activeCategories));

    if (featureList) {
      featureList.innerHTML = '';
      const labelHeader = document.createElement('div');
      labelHeader.style.fontSize = '11px';
      labelHeader.style.color = '#64748b';
      labelHeader.style.textTransform = 'uppercase';
      labelHeader.style.fontWeight = '700';
      labelHeader.style.marginBottom = '8px';
      labelHeader.textContent = "Services Included Across:";
      featureList.appendChild(labelHeader);

      uniqueCategories.slice(0, 5).forEach(cat => {
        const li = document.createElement('div');
        li.className = 'calc-feature-item';
        li.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-pink); margin-right: 8px;"></i> ${cat} Segment`;
        featureList.appendChild(li);
      });
    }
  };

  window.removeInvoiceItem = (index) => {
    toggleServiceSelection(index);
  };

  if (calcTabRetainerBtn && calcTabInvoiceBtn) {
    calcTabRetainerBtn.addEventListener('click', () => {
      calcTabRetainerBtn.classList.add('active');
      calcTabInvoiceBtn.classList.remove('active');
      
      retainerInputsSection.style.display = 'flex';
      invoiceInputsSection.style.display = 'none';

      calculatorMode = 'retainer';
      
      outTierLbl.textContent = 'Retainer Tier';
      outPriceLbl.textContent = 'Estimated Monthly Retainer';
      outRoiLbl.textContent = 'Expected ROAS';
      outRevenueLbl.textContent = 'Estimated Added Value';
      
      updateRetainerCalculator();
    });

    calcTabInvoiceBtn.addEventListener('click', () => {
      calcTabInvoiceBtn.classList.add('active');
      calcTabRetainerBtn.classList.remove('active');
      
      retainerInputsSection.style.display = 'none';
      invoiceInputsSection.style.display = 'flex';

      calculatorMode = 'invoice';

      outTierLbl.textContent = 'Custom Package';
      outPriceLbl.textContent = 'Total Project Invoice';
      outRoiLbl.textContent = 'Aggregated ROI Rate';
      outRevenueLbl.textContent = 'Estimated Revenue Growth';

      updateInvoiceCalculator();
    });
  }

  // Slider budget bindings
  if (budgetSlider) {
    budgetSlider.addEventListener('input', updateRetainerCalculator);
    channelButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        updateRetainerCalculator();
      });
    });

    updateRetainerCalculator();
  }

  // Load calculator initial selection state
  if (selectedServices.size > 0) {
    const badge = document.getElementById('selected-count-badge');
    if (badge) {
      badge.textContent = selectedServices.size;
      badge.style.display = 'inline-block';
    }
    
    // Automatically switch calculator to Custom Invoice Builder mode if items are present!
    if (calcTabInvoiceBtn) {
      calcTabInvoiceBtn.click();
    }
  }

  /* --- 10. Interactive Calendar Booking Widget --- */
  const calendarGrid = document.getElementById('calendar-grid');
  const timeSlotsContainer = document.getElementById('time-slots');
  const dateInputHidden = document.getElementById('booking-date-hidden');
  const timeInputHidden = document.getElementById('booking-time-hidden');

  if (calendarGrid) {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    calendarGrid.innerHTML = '';
    
    daysOfWeek.forEach(day => {
      const header = document.createElement('div');
      header.className = 'calendar-header-day';
      header.textContent = day;
      calendarGrid.appendChild(header);
    });

    const firstDayIndex = tomorrow.getDay();
    for (let i = 0; i < firstDayIndex; i++) {
      const pad = document.createElement('div');
      pad.className = 'calendar-day disabled';
      calendarGrid.appendChild(pad);
    }

    for (let i = 0; i < 7; i++) {
      const dateObj = new Date(tomorrow);
      dateObj.setDate(tomorrow.getDate() + i);

      const dayBtn = document.createElement('div');
      dayBtn.className = 'calendar-day';
      dayBtn.textContent = dateObj.getDate();
      dayBtn.setAttribute('data-date', `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`);
      dayBtn.setAttribute('data-formatted', `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`);

      if (dateObj.getDay() === 0) {
        dayBtn.classList.add('disabled');
      } else {
        dayBtn.addEventListener('click', () => {
          document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
          dayBtn.classList.add('active');
          dateInputHidden.value = dayBtn.getAttribute('data-formatted');
          
          timeSlotsContainer.style.display = 'grid';
          generateTimeSlots();
        });
      }
      calendarGrid.appendChild(dayBtn);
    }

    const generateTimeSlots = () => {
      timeSlotsContainer.innerHTML = '';
      const slots = ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];
      slots.forEach(slot => {
        const slotBtn = document.createElement('div');
        slotBtn.className = 'time-slot';
        slotBtn.textContent = slot;
        slotBtn.addEventListener('click', () => {
          document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
          slotBtn.classList.add('active');
          timeInputHidden.value = slot;
        });
        timeSlotsContainer.appendChild(slotBtn);
      });
    };
  }

  /* --- 11. Navigation Scroll Spy & Header styling --- */
  const navbar = document.getElementById('header-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const scrollSpy = () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', scrollSpy);

  /* --- 12. Form Validation & Submission with local storage log --- */
  const contactForm = document.getElementById('contact-form-widget');
  
  // Save original form HTML for reset function
  let originalFormHTML = "";
  if (contactForm) {
    originalFormHTML = contactForm.innerHTML;
  }

  window.resetContactForm = function() {
    if (contactForm) {
      contactForm.innerHTML = originalFormHTML;
      attachFormSubmitListener();
      
      // Re-initialize calendar grid variables and rebuild it
      const calendarGrid = document.getElementById('calendar-grid');
      const timeSlotsContainer = document.getElementById('time-slots');
      const dateInputHidden = document.getElementById('booking-date-hidden');
      const timeInputHidden = document.getElementById('booking-time-hidden');
      
      if (calendarGrid) {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        calendarGrid.innerHTML = '';
        daysOfWeek.forEach(day => {
          const header = document.createElement('div');
          header.className = 'calendar-header-day';
          header.textContent = day;
          calendarGrid.appendChild(header);
        });

        const firstDayIndex = tomorrow.getDay();
        for (let i = 0; i < firstDayIndex; i++) {
          const pad = document.createElement('div');
          pad.className = 'calendar-day disabled';
          calendarGrid.appendChild(pad);
        }

        for (let i = 0; i < 7; i++) {
          const dateObj = new Date(tomorrow);
          dateObj.setDate(tomorrow.getDate() + i);

          const dayBtn = document.createElement('div');
          dayBtn.className = 'calendar-day';
          dayBtn.textContent = dateObj.getDate();
          dayBtn.setAttribute('data-date', `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`);
          dayBtn.setAttribute('data-formatted', `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`);

          if (dateObj.getDay() === 0) {
            dayBtn.classList.add('disabled');
          } else {
            dayBtn.addEventListener('click', () => {
              document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
              dayBtn.classList.add('active');
              dateInputHidden.value = dayBtn.getAttribute('data-formatted');
              timeSlotsContainer.style.display = 'grid';
              
              timeSlotsContainer.innerHTML = '';
              const slots = ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];
              slots.forEach(slot => {
                const slotBtn = document.createElement('div');
                slotBtn.className = 'time-slot';
                slotBtn.textContent = slot;
                slotBtn.addEventListener('click', () => {
                  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
                  slotBtn.classList.add('active');
                  timeInputHidden.value = slot;
                });
                timeSlotsContainer.appendChild(slotBtn);
              });
            });
          }
          calendarGrid.appendChild(dayBtn);
        }
      }
    }
  };

  function attachFormSubmitListener() {
    const contactForm = document.getElementById('contact-form-widget');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const company = document.getElementById('form-company') ? document.getElementById('form-company').value.trim() : '';
      const message = document.getElementById('form-msg') ? document.getElementById('form-msg').value.trim() : '';
      const date = document.getElementById('booking-date-hidden').value;
      const time = document.getElementById('booking-time-hidden').value;

      if (!name || !email) {
        alert('Please fill out all required fields.');
        return;
      }

      if (!date || !time) {
        alert('Please select a preferred date and time on the calendar.');
        return;
      }

      // Save submission to local storage
      const submission = {
        name,
        email,
        company,
        message,
        service: `Strategy Call (${date} at ${time})`,
        timestamp: new Date().toISOString()
      };
      
      const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
      quotes.push(submission);
      localStorage.setItem('quotes', JSON.stringify(quotes));

      // Render success screen
      contactForm.innerHTML = `
        <div class="submission-success-card">
          <div class="success-icon">✓</div>
          <h3>Strategy Call Booked!</h3>
          <p>Thank you, <strong>${name}</strong>. We have scheduled your briefing session.</p>
          <p class="sub-detail">Preferred Slot: <strong>${date} at ${time}</strong>.</p>
          <p class="sub-detail">A calendar invitation and meet link have been sent to <strong>${email}</strong>.</p>
          <button class="btn btn-primary" onclick="resetContactForm()" style="margin-top:20px; font-size:12px; padding:10px 20px; width:auto; border-radius:100px;">Book Another Slot</button>
        </div>
      `;

      // Update developer log
      const submissionCount = document.getElementById('submissionCount');
      if (submissionCount) submissionCount.textContent = quotes.length;
      updateSubmissionsLog();
    });
  }

  // Developer Submissions Log
  const demoLogToggle = document.getElementById('demoLogToggle');
  const demoLogContent = document.getElementById('demoLogContent');
  const demoLogList = document.getElementById('demoLogList');
  const submissionCount = document.getElementById('submissionCount');
  const noSubmissionsMsg = document.getElementById('noSubmissionsMsg');

  if (demoLogToggle) {
    demoLogToggle.addEventListener('click', () => {
      demoLogContent.classList.toggle('show');
      updateSubmissionsLog();
    });
  }

  function updateSubmissionsLog() {
    if (!demoLogList) return;
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    if (submissionCount) submissionCount.textContent = quotes.length;
    
    if (quotes.length === 0) {
      if (noSubmissionsMsg) noSubmissionsMsg.style.display = 'block';
      demoLogList.innerHTML = '';
      return;
    }
    
    if (noSubmissionsMsg) noSubmissionsMsg.style.display = 'none';
    demoLogList.innerHTML = quotes.map(q => `
      <div class="demo-submission-item">
        <div class="demo-sub-header">
          <span>${new Date(q.timestamp).toLocaleString()}</span>
          <span>${q.service}</span>
        </div>
        <div class="demo-sub-meta">
          <strong>${q.name}</strong> (${q.email}) ${q.company ? `at <em>${q.company}</em>` : ''}
        </div>
        <div class="demo-sub-msg">${q.message || 'No extra goals specified.'}</div>
      </div>
    `).reverse().join('');
  }

  // Init
  attachFormSubmitListener();
  const initialQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');
  if (submissionCount) submissionCount.textContent = initialQuotes.length;

  /* --- 13. Mobile Drawer Navigation toggle --- */
  const mobileToggle = document.getElementById('mobile-drawer-toggle');
  const drawerMenu = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = drawerMenu.classList.contains('open');
      drawerMenu.classList.toggle('open', !isOpen);
      mobileToggle.innerHTML = isOpen ? '<i class="fa-solid fa-bars"></i>' : '<i class="fa-solid fa-xmark"></i>';
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawerMenu.classList.remove('open');
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

    /* ==========================================================================
     UNIFIED MOBILE CARD ACCORDION & DRAWER ACCORDION ENGINE
     ========================================================================== */
  const initAllAccordions = () => {
    // 1. Mobile Service Card Accordion Toggle
    const cards = document.querySelectorAll('.accordion-card, .spotlight-card');
    
    // Auto-expand 1st card on mobile for visual guide
    if (window.innerWidth <= 768 && cards.length > 0) {
      cards[0].classList.add('active', 'mobile-expanded');
    }

    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        // If user explicitly clicked the subpage link button inside the body, allow navigation
        if (e.target.tagName === 'A' || e.target.closest('a') || e.target.classList.contains('btn') || e.target.closest('.btn')) {
          const btnLink = e.target.tagName === 'A' ? e.target : e.target.closest('a');
          if (btnLink && btnLink.getAttribute('href')) {
            window.location.href = btnLink.getAttribute('href');
          }
          return;
        }

        // On mobile viewports (<= 768px), toggle expand/collapse state
        if (window.innerWidth <= 768) {
          const isCurrentlyActive = card.classList.contains('active') || card.classList.contains('mobile-expanded');

          // Close other cards for clean single-accordion behavior
          cards.forEach(c => {
            if (c !== card) {
              c.classList.remove('active', 'mobile-expanded');
            }
          });

          // Toggle current card
          card.classList.toggle('active', !isCurrentlyActive);
          card.classList.toggle('mobile-expanded', !isCurrentlyActive);
        }
      });
    });

    // 2. 3-Dot Drawer Accordion Toggle
    const navAccordionHeaders = document.querySelectorAll('.nav-accordion-header');
    navAccordionHeaders.forEach(header => {
      header.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = header.closest('.nav-accordion-item');
        if (!item) return;
        
        const isOpen = item.classList.contains('open');
        
        document.querySelectorAll('.nav-accordion-item').forEach(i => {
          if (i !== item) i.classList.remove('open');
        });

        item.classList.toggle('open', !isOpen);
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllAccordions);
  } else {
    initAllAccordions();
  }



/* ==========================================================================
   THREE-DOT MOBILE MENU DRAWER TOGGLE ENGINE & CURRENCY SYSTEM
   ========================================================================== */
window.activeCurrency = localStorage.getItem('activeCurrency') || 'INR';

/* Using global currencyRates declared at top */

window.setGlobalCurrency = function(currency) {
  if (!currencyRates[currency]) return;
  window.activeCurrency = currency;
  localStorage.setItem('activeCurrency', currency);

  // Update active state on all currency buttons
  document.querySelectorAll('.currency-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-currency') === currency);
  });

  // Convert prices on current page
  const config = currencyRates[currency];
  document.querySelectorAll('.price-val, .calc-out-val, .sub-price').forEach(el => {
    const rawInr = el.getAttribute('data-inr') || el.textContent.replace(/[^0-9]/g, '');
    if (rawInr) {
      if (!el.getAttribute('data-inr')) el.setAttribute('data-inr', rawInr);
      const val = parseFloat(rawInr);
      if (currency === 'INR') {
        el.textContent = '₹' + Math.round(val).toLocaleString('en-IN');
      } else {
        const converted = Math.round(val * config.rate);
        el.textContent = config.symbol + converted.toLocaleString(config.locale);
      }
    }
  });
};

const initThreeDotsDrawer = () => {
  const toggleBtn = document.getElementById('three-dots-toggle');
  const drawer = document.getElementById('three-dots-drawer');
  const closeBtn = document.getElementById('three-dots-close');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      drawer.classList.toggle('open');
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      drawer.classList.remove('open');
    });
  }

  // Close drawer when tapping outside
  document.addEventListener('click', (e) => {
    if (drawer && drawer.classList.contains('open')) {
      if (!drawer.contains(e.target) && toggleBtn && !toggleBtn.contains(e.target)) {
        drawer.classList.remove('open');
      }
    }
  });

  // Sync active currency button state on load
  const savedCurrency = localStorage.getItem('activeCurrency') || 'INR';
  document.querySelectorAll('.currency-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-currency') === savedCurrency);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThreeDotsDrawer);
} else {
  initThreeDotsDrawer();
}
});
