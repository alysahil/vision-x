document.addEventListener('DOMContentLoaded', () => {

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
        ctx.fillStyle = 'rgba(139, 92, 246, 0.4)';
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
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };
    animate();
  }

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
      'AI Growth Agency', 
      'SaaS Development Partners', 
      'High-converting Design Studio', 
      'Digital Marketing Experts', 
      'Automation Workflow Wizards'
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

      let iconStyle = "";
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

      card.innerHTML = `
        <div class="glass-card spotlight-card ${isSelected ? 'selected' : ''}" style="${isSelected ? 'border-color: var(--accent-pink) !important; box-shadow: 0 0 15px rgba(255, 0, 229, 0.15);' : ''}">
          <div class="spotlight-glow"></div>
          <div class="card-content service-card" style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; gap: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
              <div class="service-icon" style="${iconStyle}"><i class="${iconClass}"></i></div>
              <button class="btn btn-secondary btn-sm select-service-btn" data-index="${globalIndex}" style="padding: 6px 12px; font-size: 11px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; ${isSelected ? 'background: rgba(255,0,229,0.1); border-color: var(--accent-pink); color: var(--accent-pink);' : ''}">
                ${isSelected ? '<i class="fa-solid fa-check"></i> Added' : '<i class="fa-solid fa-plus"></i> Add to Calc'}
              </button>
            </div>
            <div>
              <h3 class="service-title" style="font-size: 18px; margin-bottom: 8px;">${service.name}</h3>
              <p class="service-desc" style="font-size: 13px; color: #94a3b8; line-height: 1.5;">Category: ${service.categoryName}</p>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: auto;">
              <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700;">Starting Cost</span>
              <span style="font-size: 16px; font-weight: 800; color: var(--accent-cyan); font-family: var(--font-headings);">${service.priceStr}</span>
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

  const formatRupees = (val) => '₹' + parseInt(val).toLocaleString('en-IN');

  const updateRetainerCalculator = () => {
    if (!budgetSlider || calculatorMode !== 'retainer') return;
    
    const budget = parseInt(budgetSlider.value);
    budgetValue.textContent = formatRupees(budget);

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
    outPrice.textContent = formatRupees(budget) + '/mo';
    outRoi.textContent = roas > 0 ? roas.toFixed(1) + 'x ROAS' : '0.0x';
    outRevenue.textContent = formatRupees(addedValue) + '/mo';

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
        li.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-emerald); margin-right: 8px;"></i> ${f}`;
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
      outPrice.textContent = formatRupees(0);
      outRoi.textContent = '0.0x';
      outRevenue.textContent = formatRupees(0);
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
          <span style="color: var(--accent-cyan); font-weight:700;">${service.priceStr}</span>
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
    outPrice.textContent = formatRupees(totalSum);
    outRoi.textContent = (baseRoiVal * efficiencyRate).toFixed(1) + 'x ROI';
    outRevenue.textContent = formatRupees(expectedRevenueLift) + ' est.';

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

  /* --- 12. Form Validation & Submission --- */
  const contactForm = document.getElementById('contact-form-widget');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const date = dateInputHidden.value;
      const time = timeInputHidden.value;

      if (!name || !email) {
        alert('Please fill out all required fields.');
        return;
      }

      if (!date || !time) {
        alert('Please select a preferred date and time on the calendar.');
        return;
      }

      alert(`Thank you, ${name}! Your Strategy Call is booked for ${date} at ${time}. We've sent a calendar invite to ${email}.`);
      contactForm.reset();
      timeSlotsContainer.style.display = 'none';
      document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
    });
  }

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
});
