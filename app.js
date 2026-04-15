// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== MOBILE MENU =====
const ham = document.getElementById('ham');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');
const mmLinks = document.querySelectorAll('.mm-link');

ham.addEventListener('click', () => mobileMenu.classList.add('open'));
closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
mmLinks.forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ===== TERMINAL TYPEWRITER =====
const commands = [
  'nmap -sV -sC target.local',
  'python3 kai_cyber.py --mode hack',
  'burpsuite --project-file audit.burp',
  'aircrack-ng -w wordlist.txt cap.cap',
  'python3 reportx.py --format html',
  'bash kai_cli.sh --assist exploit',
  'wireshark -i eth0 -k',
];

let cmdIndex = 0;
let charIndex = 0;
let isDeleting = false;
const termEl = document.getElementById('terminalText');

function typeTerminal() {
  const current = commands[cmdIndex];
  if (!isDeleting) {
    termEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      setTimeout(() => { isDeleting = true; }, 2000);
      setTimeout(typeTerminal, 2100);
      return;
    }
  } else {
    termEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      cmdIndex = (cmdIndex + 1) % commands.length;
    }
  }
  setTimeout(typeTerminal, isDeleting ? 40 : 80);
}

typeTerminal();

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.section-header, .skill-card, .proj-card, .edu-item, .contact-card, .contact-right');

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

// ===== STAGGER REVEAL =====
const staggerGroups = [
  document.querySelectorAll('.skill-card'),
  document.querySelectorAll('.proj-card'),
  document.querySelectorAll('.contact-card'),
];

staggerGroups.forEach(group => {
  const groupObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        group.forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 100);
        });
        groupObs.disconnect();
      }
    });
  }, { threshold: 0.05 });

  if (group[0]) groupObs.observe(group[0]);
});

// ===== SKILL BAR ANIMATION =====
const skillBars = document.querySelectorAll('.skill-fill');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.style.width;
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
  const target = bar.style.width;
  bar.style.width = '0';
  setTimeout(() => { bar.style.width = target; }, 300);
  barObserver.observe(bar);
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) {
      current = s.getAttribute('id');
    }
  });
  navLinks.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === '#' + current) {
      a.style.color = 'var(--accent)';
    }
  });
});

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const note = document.getElementById('formNote');
  note.textContent = '✓ Message sent! I\'ll get back to you soon.';
  this.reset();
  setTimeout(() => { note.textContent = ''; }, 4000);
});

// ===== SMOOTH CURSOR GLOW (desktop only) =====
if (window.innerWidth > 900) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; width: 400px; height: 400px;
    border-radius: 50%; pointer-events: none; z-index: 0;
    background: radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%);
    transition: transform 0.15s ease;
    transform: translate(-50%, -50%);
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}
