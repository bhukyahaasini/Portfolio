/**
 * Haasini Bhukya - Portfolio JavaScript
 * Premium 3D & Interactive features.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initNavbarScroll();
  initThreeJSScene();
  initTiltEffect();
  initScrollAnimations();
  initContactForm();
});

/* ==========================================================================
   1. Custom Cursor Glow
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const glow = document.querySelector('.custom-cursor-glow');
  
  if (!cursor || !glow) return;

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let glowX = 0;
  let glowY = 0;

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Quick cursor position update
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Smooth lerp animation for the outer glow
  function animateCursor() {
    // Lerp formulas: current + (target - current) * speed
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Highlight cursor on interactive elements
  const interactives = document.querySelectorAll('a, button, .project-card, .profile-card, .skill-tag, input, textarea, .nav-link');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });
}

/* ==========================================================================
   2. Navbar Scroll Highlight & Mobile Close
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-glass');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const navCollapse = document.querySelector('.navbar-collapse');
  const navbarToggler = document.querySelector('.navbar-toggler');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll active link highlight
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === currentSection) {
        link.classList.add('active');
      }
    });
  });

  // Auto-close mobile hamburger menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse.classList.contains('show')) {
        navbarToggler.click();
      }
    });
  });
}

/* ==========================================================================
   3. Three.js 3D Glass Sphere Scene
   ========================================================================== */
function initThreeJSScene() {
  const container = document.getElementById('canvas-container');
  const canvas = document.getElementById('three-canvas');
  if (!container || !canvas) return;

  // Graceful degradation fallback check
  if (typeof THREE === 'undefined') {
    console.warn('Three.js is not loaded. Falling back to background gradients.');
    canvas.style.display = 'none';
    return;
  }

  // Scene setup
  const scene = new THREE.Scene();
  
  // Camera
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.z = 8;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 1. Refractive Glass Sphere Geometry
  const sphereGeo = new THREE.SphereGeometry(1.8, 64, 64);
  
  // Glass Material with Physical properties
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.05,
    roughness: 0.05,
    transmission: 0.92, // High transmission for transparency
    ior: 1.52,         // Index of Refraction (glass is 1.52)
    thickness: 1.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    opacity: 1,
    transparent: true,
    side: THREE.DoubleSide
  });

  const glassSphere = new THREE.Mesh(sphereGeo, glassMat);
  scene.add(glassSphere);

  // 2. Inner floating ring / wireframe for technical look
  const torusGeo = new THREE.TorusGeometry(2.3, 0.03, 16, 100);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  });
  const techRing = new THREE.Mesh(torusGeo, ringMat);
  techRing.rotation.x = Math.PI / 2;
  scene.add(techRing);

  const torusGeo2 = new THREE.TorusGeometry(2.6, 0.02, 8, 80);
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0x9b51e0,
    wireframe: true,
    transparent: true,
    opacity: 0.2
  });
  const techRing2 = new THREE.Mesh(torusGeo2, ringMat2);
  techRing2.rotation.y = Math.PI / 4;
  scene.add(techRing2);

  // 3. Floating Particles Orbit
  const particleCount = 120;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    // Generate spherical coordinates around the sphere
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 2.4 + Math.random() * 2.0; // orbit radius 2.4 to 4.4

    particlePositions[i] = r * Math.sin(phi) * Math.cos(theta);
    particlePositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
    particlePositions[i + 2] = r * Math.cos(phi);
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  
  // Custom circular canvas texture for smooth particle glow
  const createCircleTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    return new THREE.CanvasTexture(canvas);
  };

  const particleMat = new THREE.PointsMaterial({
    color: 0x00f2fe,
    size: 0.12,
    transparent: true,
    opacity: 0.7,
    map: createCircleTexture(),
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
  mainLight.position.set(5, 5, 5);
  scene.add(mainLight);

  // Colored point lights to give neon reflections to glass sphere
  const blueLight = new THREE.PointLight(0x0072ff, 3, 15);
  blueLight.position.set(-4, 3, 2);
  scene.add(blueLight);

  const purpleLight = new THREE.PointLight(0x9b51e0, 4, 15);
  purpleLight.position.set(4, -3, 2);
  scene.add(purpleLight);

  const cyanLight = new THREE.PointLight(0x00f2fe, 2, 10);
  cyanLight.position.set(-2, -4, -3);
  scene.add(cyanLight);

  // Mouse Interaction (Parallax)
  let targetX = 0;
  let targetY = 0;
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (event) => {
    // Normalise to [-0.5, 0.5]
    mouseX = (event.clientX / window.innerWidth) - 0.5;
    mouseY = (event.clientY / window.innerHeight) - 0.5;
  });

  // Render Loop
  const clock = new THREE.Clock();

  function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Auto rotate elements
    glassSphere.rotation.y = elapsedTime * 0.15;
    glassSphere.rotation.x = elapsedTime * 0.08;

    techRing.rotation.z = -elapsedTime * 0.2;
    techRing2.rotation.z = elapsedTime * 0.1;

    particleSystem.rotation.y = elapsedTime * 0.05;
    particleSystem.rotation.x = elapsedTime * 0.02;

    // Follow mouse coordinates with easing
    targetX += (mouseX - targetX) * 0.08;
    targetY += (mouseY - targetY) * 0.08;

    // Apply parallax
    scene.rotation.y = targetX * 0.8;
    scene.rotation.x = targetY * 0.8;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

/* ==========================================================================
   4. Native 3D Card Tilt Effect
   ========================================================================== */
function initTiltEffect() {
  const cards = document.querySelectorAll('.project-card, .about-card, .cert-card, .profile-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position inside the element.
      const y = e.clientY - rect.top;  // y position inside the element.
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate tilt degrees (Max 8 degrees for clean premium feel)
      const rotateX = ((centerY - y) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });
}

/* ==========================================================================
   5. Intersection Observer Scroll Animations
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-element');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, no need to keep observing
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      observer.observe(el);
    });
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(el => {
      el.classList.add('active');
    });
  }
}

/* ==========================================================================
   6. Contact Form Validation & Success Animation
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successOverlay = document.querySelector('.form-success-overlay');
  
  if (!form) return;

  const fields = [
    { id: 'contactName', validate: val => val.trim().length > 0 },
    { id: 'contactEmail', validate: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) },
    { id: 'contactSubject', validate: val => val.trim().length > 0 },
    { id: 'contactMessage', validate: val => val.trim().length >= 10 }
  ];

  // Live input validation listeners
  fields.forEach(fieldInfo => {
    const input = document.getElementById(fieldInfo.id);
    if (!input) return;

    input.addEventListener('input', () => {
      validateField(input, fieldInfo.validate);
    });
  });

  function validateField(input, validationFn) {
    if (validationFn(input.value)) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      return true;
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      return false;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;
    
    // Validate all fields on submit
    fields.forEach(fieldInfo => {
      const input = document.getElementById(fieldInfo.id);
      if (input) {
        const isValid = validateField(input, fieldInfo.validate);
        if (!isValid) {
          isFormValid = false;
        }
      }
    });

    if (isFormValid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Loading State Visual
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
      
      // Simulate API submit delay (e.g. Formspree / Web3Forms simulation)
      setTimeout(() => {
        // Clear inputs and validate success state overlay
        form.reset();
        fields.forEach(fieldInfo => {
          const input = document.getElementById(fieldInfo.id);
          if (input) {
            input.classList.remove('is-valid', 'is-invalid');
          }
        });
        
        // Show success animation overlay
        if (successOverlay) {
          successOverlay.classList.add('active');
          
          // Re-enable and reset button after overlay shows
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }, 500);

          // Auto hide success overlay after 4 seconds
          setTimeout(() => {
            successOverlay.classList.remove('active');
          }, 4500);
        }
      }, 1500);
    }
  });

  // Success overlay close handler
  const closeSuccessBtn = document.getElementById('closeSuccessOverlay');
  if (closeSuccessBtn && successOverlay) {
    closeSuccessBtn.addEventListener('click', () => {
      successOverlay.classList.remove('active');
    });
  }
}
