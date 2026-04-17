/* ============================================================
   CYBER-ORBIT PORTFOLIO — script.js
   Author: Kuldeep Singh | Brand: Cyber-Orbit
   ============================================================ */

'use strict';

/* ---- CUSTOM CURSOR ---- */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

/* hover enlarge cursor */
document.querySelectorAll('a, button, .project-card, .blog-card, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    cursorTrail.style.transform = 'translate(-50%,-50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorTrail.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ---- HAMBURGER MENU ---- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ---- SMOOTH ACTIVE NAV ---- */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navItems.forEach(n => n.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));

/* ---- TYPING ANIMATION ---- */
const phrases = [
  'AI Developer',
  'Cybersecurity Enthusiast',
  'Full Stack Builder',
  'OSINT Researcher',
  'Linux Hacker',
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIdx--);
  } else {
    typedEl.textContent = current.substring(0, charIdx++);
  }

  let delay = isDeleting ? 60 : 110;

  if (!isDeleting && charIdx > current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIdx < 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay = 400;
    charIdx = 0;
  }
  setTimeout(type, delay);
}
type();

/* ---- CANVAS PARTICLE / CYBER-GRID BG ---- */
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const PARTICLES = 90;
const particles = Array.from({length: PARTICLES}, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 0.5,
  vy: (Math.random() - 0.5) * 0.5,
  r: Math.random() * 2 + 0.5,
  alpha: Math.random() * 0.6 + 0.1,
}));

let animMouse = { x: canvas.width / 2, y: canvas.height / 2 };
window.addEventListener('mousemove', e => {
  animMouse.x = e.clientX;
  animMouse.y = e.clientY;
});

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* Draw connections */
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,255,136,${0.12 * (1 - dist / 130)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }

    /* Mouse connections */
    const mx = animMouse.x - particles[i].x;
    const my = animMouse.y - particles[i].y;
    const md = Math.sqrt(mx * mx + my * my);
    if (md < 180) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0,207,255,${0.25 * (1 - md / 180)})`;
      ctx.lineWidth = 0.8;
      ctx.moveTo(particles[i].x, particles[i].y);
      ctx.lineTo(animMouse.x, animMouse.y);
      ctx.stroke();
    }

    /* Particle dot */
    ctx.beginPath();
    ctx.arc(particles[i].x, particles[i].y, particles[i].r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,255,136,${particles[i].alpha})`;
    ctx.fill();

    /* Update */
    particles[i].x += particles[i].vx;
    particles[i].y += particles[i].vy;
    if (particles[i].x < 0 || particles[i].x > canvas.width)  particles[i].vx *= -1;
    if (particles[i].y < 0 || particles[i].y > canvas.height) particles[i].vy *= -1;
  }

  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ---- REVEAL ON SCROLL ---- */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => {
        e.target.classList.add('visible');
        triggerSkillBars(e.target);
        triggerCounters(e.target);
      }, i * 80);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObs.observe(el));

/* ---- SKILL BARS ---- */
function triggerSkillBars(container) {
  const bars = container.querySelectorAll('.bar-fill');
  bars.forEach(bar => {
    const pct = bar.getAttribute('data-pct');
    setTimeout(() => { bar.style.width = pct + '%'; }, 200);
  });
}

/* ---- COUNTER ANIMATION ---- */
function triggerCounters(container) {
  const counters = container.querySelectorAll('.stat-number[data-target]');
  counters.forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(interval);
    }, 40);
  });
}

/* ---- PROJECT FILTER ---- */
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      if (filter === 'all' || card.dataset.cat.includes(filter)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ---- TERMINAL INTERACTIVITY ---- */
const termInput = document.getElementById('termInput');
const termBody  = document.getElementById('terminalBody');

const commands = {
  help: `Available commands:<br>
  <span style="color:var(--neon-green)">whoami</span>     — display identity<br>
  <span style="color:var(--neon-green)">projects</span>   — list all projects<br>
  <span style="color:var(--neon-green)">skills</span>     — show tech stack<br>
  <span style="color:var(--neon-green)">contact</span>    — get contact info<br>
  <span style="color:var(--neon-green)">clear</span>      — clear terminal<br>
  <span style="color:var(--neon-green)">github</span>     — open GitHub profile`,
  whoami: 'Kuldeep Singh — AI Developer · Cybersecurity Researcher · Full Stack Builder<br>Location: Punjab, India | Status: <span style="color:var(--neon-green)">ONLINE</span>',
  projects: 'KAI_CYBER_AI | aegis_ai | Kai_cli | CyberForge | ReportX | OrbitTrace',
  skills: 'Python · Bash · JavaScript · C | Nmap · Wireshark · Burp Suite · Aircrack-ng | Kali Linux',
  contact: 'Email: <span style="color:var(--neon-cyan)">ks8124708@gmail.com</span> | Phone: +91 7681903497 | GitHub: cyber-orbit',
  github: 'Opening GitHub... → <a href="https://github.com/cyber-orbit" target="_blank" style="color:var(--neon-cyan)">github.com/cyber-orbit</a>',
};

function appendTermLine(cmd, output) {
  const cmdLine = document.createElement('div');
  cmdLine.className = 'term-line';
  cmdLine.innerHTML = `<span class="prompt">kai@cyber-orbit:~$</span> <span class="t-cmd">${cmd}</span>`;
  termBody.appendChild(cmdLine);

  if (output) {
    const outEl = document.createElement('div');
    outEl.className = 'term-output';
    outEl.innerHTML = output;
    termBody.appendChild(outEl);
  }
  termBody.scrollTop = termBody.scrollHeight;
}

termInput.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const raw = termInput.value.trim().toLowerCase();
  termInput.value = '';
  if (!raw) return;

  if (raw === 'clear') {
    termBody.innerHTML = '';
    return;
  }

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kuldeep Singh | Cyber-Orbit</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  
  <!-- OPTIONAL: EmailJS (uncomment to use EmailJS instead of Formspree) -->
  <!-- <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/index.min.js"></script>
  <script>
    emailjs.init({
      publicKey: 'YOUR_PUBLIC_KEY_HERE', // Get from https://www.emailjs.com
    });
  </script> -->
</head>
<body>

<!-- ========== CURSOR ========== -->
<div class="cursor" id="cursor"></div>
<div class="cursor-trail" id="cursorTrail"></div>

<!-- ========== NAV ========== -->
<nav class="navbar" id="navbar">
  <div class="nav-brand">
    <span class="brand-icon">⬡</span>
    <span class="brand-text">CYBER<span class="neon-green">ORBIT</span></span>
  </div>
  <ul class="nav-links" id="navLinks">
    <li><a href="#home" class="nav-link">Home</a></li>
    <li><a href="#about" class="nav-link">About</a></li>
    <li><a href="#skills" class="nav-link">Skills</a></li>
    <li><a href="#projects" class="nav-link">Projects</a></li>
    <li><a href="#terminal" class="nav-link">Terminal</a></li>
    <li><a href="#blog" class="nav-link">Blog</a></li>
    <li><a href="#contact" class="nav-link">Contact</a></li>
  </ul>
  <button class="theme-toggle" id="themeToggle" title="Toggle Light/Dark">
    <i class="fas fa-sun"></i>
  </button>
  <div class="hamburger" id="hamburger">
    <span></span><span></span><span></span>
  </div>
</nav>

<!-- ========== HERO ========== -->
<section class="hero" id="home">
  <canvas id="bgCanvas"></canvas>
  <div class="scanlines"></div>

  <div class="hero-content">
    <div class="glitch-wrapper">
      <h1 class="glitch" data-text="KULDEEP SINGH">KULDEEP SINGH</h1>
    </div>
    <div class="hero-subtitle">
      <span class="prefix">&gt;&gt; </span>
      <span class="typed-text" id="typedText"></span>
      <span class="cursor-blink">_</span>
    </div>
    <p class="hero-tagline">Building AI-powered tools and cybersecurity solutions for the future</p>
    <div class="hero-btns">
      <a href="#projects" class="btn btn-primary">
        <i class="fas fa-code"></i> View Projects
      </a>
      <a href="Kuldeep_singh.pdf" download class="btn btn-outline">
        <i class="fas fa-download"></i> Download Resume
      </a>
    </div>
    <div class="hero-badges">
      <span class="badge">AI Developer</span>
      <span class="badge">Cybersecurity</span>
      <span class="badge">Full Stack</span>
    </div>
  </div>

  <div class="scroll-indicator">
    <div class="scroll-arrow"></div>
    <span>SCROLL</span>
  </div>
</section>

<!-- ========== ABOUT ========== -->
<section class="section about" id="about">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">// ABOUT</span>
      <h2>Who Am I<span class="neon-green">?</span></h2>
    </div>
    <div class="about-grid">
      <div class="about-img-wrap reveal">
        <div class="img-frame">
          <img src="photo.jpg" alt="Kuldeep Singh" class="profile-img" />
          <div class="img-overlay"></div>
          <div class="img-corner tl"></div>
          <div class="img-corner tr"></div>
          <div class="img-corner bl"></div>
          <div class="img-corner br"></div>
        </div>
        <div class="img-stats">
          <div class="img-stat"><span class="stat-num neon-green">6+</span><span>Projects</span></div>
          <div class="img-stat"><span class="stat-num neon-cyan">4+</span><span>Tech Areas</span></div>
        </div>
      </div>
      <div class="about-text reveal">
        <p class="about-intro">I'm a self-driven developer operating at the intersection of <span class="highlight">Artificial Intelligence</span> and <span class="highlight">Cybersecurity</span> — building tools that push the boundaries of what's possible in digital defense and automation.</p>
        <p>With hands-on experience in Linux environments, AI-driven security workflows, and full-stack development, I architect real-world solutions rather than just theoretical projects. Every tool I build is battle-tested and purpose-built.</p>
        <div class="about-details">
          <div class="detail-item">
            <i class="fas fa-graduation-cap neon-green"></i>
            <div>
              <strong>Education</strong>
              <span>12th Non-Medical — PSEB (2024–25) · 58%</span>
            </div>
          </div>
          <div class="detail-item">
            <i class="fas fa-certificate neon-cyan"></i>
            <div>
              <strong>Certification (Completed)</strong>
              <a href="https://skill-india-dev.s3.ap-south-1.amazonaws.com/certificate_generic/uploaded_elements/2025060846956382/certificate_9390e20a-9cac-48f7-9fb4-35eddca4aeae.pdf?response-content-disposition=inline&response-content-type=application%2Fpdf&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260417T134255Z&X-Amz-SignedHeaders=host&X-Amz-Expires=2000&X-Amz-Credential=AKIA3OJCFBJTPLAN4OGU%2F20260417%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=0bd7ad24f0ed3c3ac1948243f4fcc81ada4a9748db860dd8072c8f5a2e22032b" target="_blank" class="cert-link">Skill India · View Certificate ↗</a>
            </div>
          </div>
          <div class="detail-item">
            <i class="fas fa-shield-alt neon-green"></i>
            <div>
              <strong>Currently Enrolled</strong>
              <span>AI-Powered Cybersecurity Master — Simplilearn (PGP)</span>
            </div>
          </div>
          <div class="detail-item">
            <i class="fas fa-map-marker-alt neon-cyan"></i>
            <div>
              <strong>Location</strong>
              <span>Punjab, India</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ========== SKILLS ========== -->
<section class="section skills" id="skills">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">// SKILLS</span>
      <h2>Tech Arsenal<span class="neon-green">.</span></h2>
    </div>
    <div class="skills-grid">

      <div class="skill-category reveal">
        <div class="cat-header">
          <i class="fas fa-terminal neon-green"></i>
          <h3>Programming</h3>
        </div>
        <div class="skill-bars">
          <div class="skill-bar-item">
            <div class="skill-label"><span>Python</span><span class="skill-pct">85%</span></div>
            <div class="bar-track"><div class="bar-fill" data-pct="85"></div></div>
          </div>
          <div class="skill-bar-item">
            <div class="skill-label"><span>Bash / Shell</span><span class="skill-pct">78%</span></div>
            <div class="bar-track"><div class="bar-fill" data-pct="78"></div></div>
          </div>
          <div class="skill-bar-item">
            <div class="skill-label"><span>JavaScript</span><span class="skill-pct">65%</span></div>
            <div class="bar-track"><div class="bar-fill" data-pct="65"></div></div>
          </div>
          <div class="skill-bar-item">
            <div class="skill-label"><span>C (Language)</span><span class="skill-pct">55%</span></div>
            <div class="bar-track"><div class="bar-fill" data-pct="55"></div></div>
          </div>
        </div>
      </div>

      <div class="skill-category reveal">
        <div class="cat-header">
          <i class="fas fa-shield-virus neon-cyan"></i>
          <h3>Cybersecurity Tools</h3>
        </div>
        <div class="skill-tags">
          <span class="stag">Nmap</span>
          <span class="stag">Wireshark</span>
          <span class="stag">Burp Suite</span>
          <span class="stag">Aircrack-ng</span>
          <span class="stag">Wifite</span>
          <span class="stag">Metasploit</span>
          <span class="stag">Kali Linux</span>
          <span class="stag">Hashcat</span>
          <span class="stag">SQLMap</span>
        </div>
      </div>

      <div class="skill-category reveal">
        <div class="cat-header">
          <i class="fas fa-brain neon-green"></i>
          <h3>AI / ML</h3>
        </div>
        <div class="skill-tags">
          <span class="stag">LLM Integration</span>
          <span class="stag">Claude API</span>
          <span class="stag">OpenAI</span>
          <span class="stag">Prompt Engineering</span>
          <span class="stag">Data Analysis</span>
          <span class="stag">Automation</span>
        </div>
      </div>

      <div class="skill-category reveal">
        <div class="cat-header">
          <i class="fas fa-code neon-cyan"></i>
          <h3>Frameworks & Tools</h3>
        </div>
        <div class="skill-tags">
          <span class="stag">Git / GitHub</span>
          <span class="stag">Linux</span>
          <span class="stag">Docker</span>
          <span class="stag">Web Dev</span>
          <span class="stag">APIs</span>
          <span class="stag">Databases</span>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ========== PROJECTS ========== -->
<section class="section projects" id="projects">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">// PROJECTS</span>
      <h2>Digital Arsenal<span class="neon-green">.</span></h2>
    </div>

    <div class="filter-buttons reveal">
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="ai">AI</button>
      <button class="filter-btn" data-filter="security">Security</button>
      <button class="filter-btn" data-filter="tools">Tools</button>
    </div>

    <div class="projects-grid">

      <div class="project-card reveal" data-cat="ai,tools">
        <div class="card-img">
          <div class="img-placeholder">
            <i class="fas fa-robot"></i>
          </div>
        </div>
        <div class="card-content">
          <h3>KAI_CYBER_AI</h3>
          <p class="card-desc">An AI-powered cybersecurity assistant integrating Claude API with real-time threat analysis, OSINT automation, and security report generation.</p>
          <div class="card-tech">
            <span class="tech-tag">Python</span>
            <span class="tech-tag">Claude API</span>
            <span class="tech-tag">Security</span>
          </div>
        </div>
        <div class="card-links">
          <a href="https://github.com/cyber-orbit/KAI_CYBER_AI" target="_blank" class="card-btn">
            <i class="fab fa-github"></i> GitHub
          </a>
          <span class="card-btn demo-btn disabled"><i class="fas fa-external-link-alt"></i> Demo</span>
        </div>
      </div>

      <div class="project-card reveal" data-cat="security">
        <div class="card-img">
          <div class="img-placeholder">
            <i class="fas fa-shield-alt"></i>
          </div>
        </div>
        <div class="card-content">
          <h3>Aegis AI</h3>
          <p class="card-desc">Intelligent vulnerability scanner combining static analysis with AI-driven risk assessment for web applications and network infrastructure.</p>
          <div class="card-tech">
            <span class="tech-tag">Python</span>
            <span class="tech-tag">Security</span>
            <span class="tech-tag">AI</span>
          </div>
        </div>
        <div class="card-links">
          <a href="https://github.com/cyber-orbit/aegis_ai" target="_blank" class="card-btn">
            <i class="fab fa-github"></i> GitHub
          </a>
          <span class="card-btn demo-btn disabled"><i class="fas fa-external-link-alt"></i> Demo</span>
        </div>
      </div>

      <div class="project-card reveal" data-cat="tools">
        <div class="card-img">
          <div class="img-placeholder">
            <i class="fas fa-terminal"></i>
          </div>
        </div>
        <div class="card-content">
          <h3>Kai CLI</h3>
          <p class="card-desc">Command-line toolkit for penetration testing and OSINT operations. Features Nmap integration, whois lookups, and automated reconnaissance workflows.</p>
          <div class="card-tech">
            <span class="tech-tag">Bash</span>
            <span class="tech-tag">Python</span>
            <span class="tech-tag">CLI</span>
          </div>
        </div>
        <div class="card-links">
          <a href="https://github.com/cyber-orbit/Kai_cli" target="_blank" class="card-btn">
            <i class="fab fa-github"></i> GitHub
          </a>
          <span class="card-btn demo-btn disabled"><i class="fas fa-external-link-alt"></i> Demo</span>
        </div>
      </div>

      <div class="project-card reveal" data-cat="security,tools">
        <div class="card-img">
          <div class="img-placeholder">
            <i class="fas fa-fire"></i>
          </div>
        </div>
        <div class="card-content">
          <h3>CyberForge</h3>
          <p class="card-desc">Security payload generator and exploitation framework. Automates common attack vectors for authorized penetration testing and red team operations.</p>
          <div class="card-tech">
            <span class="tech-tag">Python</span>
            <span class="tech-tag">Security</span>
            <span class="tech-tag">Exploit</span>
          </div>
        </div>
        <div class="card-links">
          <a href="https://github.com/cyber-orbit/CyberForge" target="_blank" class="card-btn">
            <i class="fab fa-github"></i> GitHub
          </a>
          <span class="card-btn demo-btn disabled"><i class="fas fa-external-link-alt"></i> Demo</span>
        </div>
      </div>

      <div class="project-card reveal" data-cat="tools">
        <div class="card-img">
          <div class="img-placeholder">
            <i class="fas fa-file-pdf"></i>
          </div>
        </div>
        <div class="card-content">
          <h3>ReportX</h3>
          <p class="card-desc">Automated security report generator for penetration test findings. Converts raw scan data into professional, client-ready PDF documentation.</p>
          <div class="card-tech">
            <span class="tech-tag">Python</span>
            <span class="tech-tag">Automation</span>
            <span class="tech-tag">Reporting</span>
          </div>
        </div>
        <div class="card-links">
          <a href="https://github.com/cyber-orbit/ReportX" target="_blank" class="card-btn">
            <i class="fab fa-github"></i> GitHub
          </a>
          <span class="card-btn demo-btn disabled"><i class="fas fa-external-link-alt"></i> Demo</span>
        </div>
      </div>

      <div class="project-card reveal" data-cat="tools,security">
        <div class="card-img">
          <div class="img-placeholder">
            <i class="fas fa-magnifying-glass"></i>
          </div>
        </div>
        <div class="card-content">
          <h3>OrbitTrace</h3>
          <p class="card-desc">Python-based OSINT reconnaissance tool for comprehensive target profiling. Gathers intelligence from multiple sources and formats for analysis.</p>
          <div class="card-tech">
            <span class="tech-tag">Python</span>
            <span class="tech-tag">OSINT</span>
            <span class="tech-tag">Recon</span>
          </div>
        </div>
        <div class="card-links">
          <a href="https://github.com/cyber-orbit/OrbitTrace" target="_blank" class="card-btn">
            <i class="fab fa-github"></i> GitHub
          </a>
          <span class="card-btn demo-btn disabled"><i class="fas fa-external-link-alt"></i> Demo</span>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ========== TERMINAL ========== -->
<section class="section terminal-section" id="terminal">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">// TERMINAL</span>
      <h2>Live Shell<span class="neon-green">.</span></h2>
    </div>
    <div class="terminal-wrap reveal">
      <div class="terminal-bar">
        <span class="t-dot red"></span>
        <span class="t-dot yellow"></span>
        <span class="t-dot green"></span>
        <span class="t-title">kai@cyber-orbit: ~</span>
      </div>
      <div class="terminal-body" id="terminalBody">
        <div class="term-line"><span class="prompt">kai@cyber-orbit:~$</span> <span class="t-cmd">whoami</span></div>
        <div class="term-output">Kuldeep Singh — AI Developer · Cybersecurity Researcher · Full Stack Builder</div>
        <div class="term-line"><span class="prompt">kai@cyber-orbit:~$</span> <span class="t-cmd">cat skills.txt</span></div>
        <div class="term-output">[+] Python, Bash, JavaScript, C<br>[+] Nmap, Wireshark, Burp Suite, Aircrack-ng<br>[+] AI/LLM Integration<br>[+] OSINT &amp; Reconnaissance</div>
        <div class="term-line"><span class="prompt">kai@cyber-orbit:~$</span> <span class="t-cmd">ls projects/</span></div>
        <div class="term-output">KAI_CYBER_AI/  aegis_ai/  Kai_cli/  CyberForge/  ReportX/  OrbitTrace/</div>
        <div class="term-line"><span class="prompt">kai@cyber-orbit:~$</span> <span class="t-cmd">cat mission.txt</span></div>
        <div class="term-output">Building AI-powered tools and cybersecurity solutions for the future.<br>Status: <span class="neon-green">ONLINE</span> | Mode: <span class="neon-cyan">HACKER</span></div>
        <div class="term-line"><span class="prompt">kai@cyber-orbit:~$</span> <span class="t-cmd" id="userInput"></span><span class="cursor-blink">█</span></div>
      </div>
      <div class="terminal-input-row">
        <span class="prompt">kai@cyber-orbit:~$</span>
        <input type="text" id="termInput" class="term-input" placeholder="Type a command (try: help, contact, projects)" autocomplete="off" />
      </div>
    </div>
  </div>
</section>

<!-- ========== STATS ========== -->
<section class="section stats-section">
  <div class="container">
    <div class="stats-grid">
      <div class="stat-card reveal">
        <div class="stat-icon"><i class="fas fa-code-branch neon-green"></i></div>
        <div class="stat-number" data-target="6">0</div>
        <div class="stat-label">Projects Built</div>
      </div>
      <div class="stat-card reveal">
        <div class="stat-icon"><i class="fas fa-tools neon-cyan"></i></div>
        <div class="stat-number" data-target="15">0</div>
        <div class="stat-label">Technologies</div>
      </div>
      <div class="stat-card reveal">
        <div class="stat-icon"><i class="fas fa-shield-alt neon-green"></i></div>
        <div class="stat-number" data-target="9">0</div>
        <div class="stat-label">Security Tools</div>
      </div>
      <div class="stat-card reveal">
        <div class="stat-icon"><i class="fas fa-certificate neon-cyan"></i></div>
        <div class="stat-number" data-target="2">0</div>
        <div class="stat-label">Certifications</div>
      </div>
    </div>
  </div>
</section>

<!-- ========== BLOG ========== -->
<section class="section blog" id="blog">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">// BLOG</span>
      <h2>Dispatch Log<span class="neon-green">.</span></h2>
    </div>
    <div class="blog-grid">

      <div class="blog-card reveal">
        <div class="blog-date">APR 2026</div>
        <div class="blog-tag cyber-tag">OSINT</div>
        <h3>How I Built OrbitTrace</h3>
        <p>A deep-dive into the architecture and methodology behind building a Python-based OSINT recon tool from scratch — from data sources to output formoriginal;
    }
    iterations += 1.5;
  }, 40);
}

setInterval(triggerGlitchText, 6000);

/* ---- ACTIVE NAV STYLE ---- */
const style = document.createElement('style');
style.textContent = `.nav-link.active { color: var(--neon-green); }
.nav-link.active::after { width: 100%; }`;
document.head.appendChild(style);

console.log('%c CYBER-ORBIT :: SYSTEM ONLINE ', 'background:#00ff88;color:#050a0f;font-family:monospace;font-size:14px;font-weight:bold;padding:8px 16px;border-radius:4px;');
console.log('%c Kuldeep Singh | AI + Cybersecurity + Full Stack ', 'color:#00cfff;font-family:monospace;');
