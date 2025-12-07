
/* =================== script.js =================== */

document.addEventListener('DOMContentLoaded', function(){
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMenu = document.getElementById('close-menu');
  
  // Open Menu
  if(navToggle) {
      navToggle.addEventListener('click', () => {
          mobileMenu.classList.add('open');
          document.body.style.overflow = 'hidden'; // Prevent scrolling
      });
  }

  // Close Menu
  function closeMobileMenu() {
      if(mobileMenu) mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
  }

  if(closeMenu) closeMenu.addEventListener('click', closeMobileMenu);

  // Close when clicking a link
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Active nav link while scrolling
  const sections = document.querySelectorAll('main section');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll(){
    const scrollPos = window.scrollY + 120; // offset
    sections.forEach(sec => {
      if(scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight){
        const id = sec.id;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
      }
    });
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Reveal elements when they appear
  const revealElems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('is-visible'); } });
  }, {threshold:0.12});
  revealElems.forEach(e => observer.observe(e));

  // Set copyright year
  const yearElem = document.getElementById('year');
  if(yearElem) yearElem.textContent = new Date().getFullYear();

  // Contact form handling (front-end only)
  const form = document.getElementById('contact-form');
  if(form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      
      const firstname = document.getElementById('firstname').value.trim();
      const lastname = document.getElementById('lastname').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      
      // Create status element if missing
      let statusDisplay = document.getElementById('form-status');
      if (!statusDisplay) {
          statusDisplay = document.createElement('p');
          statusDisplay.id = 'form-status';
          statusDisplay.style.marginTop = '1rem';
          statusDisplay.style.color = 'var(--accent)';
          statusDisplay.style.textAlign = 'center';
          form.appendChild(statusDisplay);
      }

      if(!firstname || !lastname || !email || !message){
        statusDisplay.textContent = 'Please complete all fields.';
        statusDisplay.style.color = '#ef4444'; // Red for error
        return;
      }
      
      // Simulate send
      statusDisplay.style.color = '#22c55e'; // Green for success
      statusDisplay.textContent = `Thanks ${firstname}! We'll be in touch soon.`;
      form.reset();
      setTimeout(()=> statusDisplay.textContent = '', 4000);
    });
  }

  // Tracing Beam Logic
  const tracingBeam = document.querySelector('.tracing-beam');
  const contentDiv = document.getElementById('projects-content');
  const svgPath = tracingBeam ? tracingBeam.querySelector('.motion-path') : null;
  const dot = tracingBeam ? tracingBeam.querySelector('.dot') : null;

  if (tracingBeam && contentDiv && svgPath && dot) {
    // Calculate content height and set SVG height
    function updateBeam() {
      const contentRect = contentDiv.getBoundingClientRect();
      
      // The beam should cover the content height
      const contentHeight = contentDiv.offsetHeight;
      const svgHeight = contentHeight; 
      
      // Update SVG viewBox and path
      const svg = tracingBeam.querySelector('svg');
      svg.setAttribute('viewBox', `0 0 20 ${svgHeight}`);
      svg.style.height = `${svgHeight}px`;
      
      // Update both paths (background and motion)
      const paths = tracingBeam.querySelectorAll('path');
      paths.forEach(path => {
        path.setAttribute('d', `M 10 0 V ${svgHeight}`);
      });

      // Calculate scroll progress relative to the content
      const windowHeight = window.innerHeight;
      
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const elementOffsetTop = contentDiv.getBoundingClientRect().top + scrollTop;
      
      // Alternative logic: map scroll position to the height of the SVG
      const scrollY = window.scrollY;
      const rect = contentDiv.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const elementHeight = rect.height;
      
      // Calculate the position of the scroll relative to the element
      const viewportCenter = window.innerHeight / 2;
      
      let currentPos = scrollY + viewportCenter - elementTop;
      
      // Clamp values
      if (currentPos < 0) currentPos = 0;
      if (currentPos > elementHeight) currentPos = elementHeight;
      
      const percentage = currentPos / elementHeight;
      
      // Update gradient path
      const pathLength = svgPath.getTotalLength();
      
      svgPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
      svgPath.style.strokeDashoffset = pathLength - (pathLength * percentage);
      
      // Move the dot
      dot.style.transform = `translateY(${currentPos}px) translateX(-50%)`;
      
      // Adjust opacity based on whether we are in the section
      if (scrollY + window.innerHeight < elementTop || scrollY > elementTop + elementHeight) {
         tracingBeam.style.opacity = '0';
      } else {
         tracingBeam.style.opacity = '1';
      }
      tracingBeam.style.transition = 'opacity 0.3s ease';

      // Popup Animation Logic
      const cards = contentDiv.querySelectorAll('.card');
      const beamHeadY = currentPos + elementTop; // Absolute Y position of the beam head

      cards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const cardTop = cardRect.top + scrollY;
        
        // Trigger when the beam head is within the card's vertical range (or slightly before)
        if (beamHeadY > cardTop - 100) { // 100px buffer
             card.classList.add('card-visible');
        } else {
             card.classList.remove('card-visible');
        }
      });
    }

    window.addEventListener('scroll', updateBeam);
    window.addEventListener('resize', updateBeam);
    // Initial call
    updateBeam();
  }

  // Skills Hover Effect
  const skillsGrid = document.getElementById('skills-grid');
  const highlight = document.getElementById('hover-highlight');
  const skillCards = document.querySelectorAll('.skill-card');

  if (skillsGrid && highlight) {
    skillCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        const rect = this.getBoundingClientRect();
        const gridRect = skillsGrid.getBoundingClientRect();
        
        // Calculate position relative to the grid
        const left = rect.left - gridRect.left;
        const top = rect.top - gridRect.top;
        const width = rect.width;
        const height = rect.height;

        highlight.style.width = `${width}px`;
        highlight.style.height = `${height}px`;
        highlight.style.transform = `translate(${left}px, ${top}px)`;
        highlight.style.opacity = '1';
      });
    });

    skillsGrid.addEventListener('mouseleave', function() {
      highlight.style.opacity = '0';
    });
  }

  // Typewriter Effect
  const textElement = document.getElementById('typewriter-text');
  const textToType = "CHANDRADAS.PV";
  let charIndex = 0;

  function typeWriter() {
    if (charIndex < textToType.length) {
      textElement.textContent += textToType.charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, 100); // Typing speed
    }
  }

  if (textElement) {
    // Start typing after a small delay
    setTimeout(typeWriter, 500);
  }

  // Text Generate Effect
  const heroIntro = document.getElementById('hero-intro');
  if (heroIntro) {
    const text = heroIntro.textContent;
    heroIntro.textContent = ''; // Clear original text
    
    const words = text.split(' ');
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word;
      span.className = 'generated-word';
      heroIntro.appendChild(span);
      
      // Animate word by word
      setTimeout(() => {
        span.classList.add('visible');
      }, index * 200 + 1500); // Start after typewriter finishes (approx)
    });
  }
});
