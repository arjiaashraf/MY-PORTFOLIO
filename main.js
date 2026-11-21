/* ============================================================
   ARJIA ASHRAF — PORTFOLIO JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── TERMINAL TYPING ANIMATION ──
  const typedName  = document.getElementById('typedName');
  const cursor     = document.getElementById('cursor');
  const termOutput = document.getElementById('terminalOutput');

  const command  = 'whoami';
  const response = 'arjia-ashraf  →  CS Student · Full-Stack Dev · AI Builder';

  let charIndex = 0;

  function typeCommand() {
    if (typedName && charIndex < command.length) {
      typedName.textContent += command[charIndex];
      charIndex++;
      setTimeout(typeCommand, 90 + Math.random() * 50);
    } else {
      setTimeout(typeOutput, 300);
    }
  }

  let outIndex = 0;
  function typeOutput() {
    if (termOutput && outIndex < response.length) {
      termOutput.textContent += response[outIndex];
      outIndex++;
      setTimeout(typeOutput, 22);
    } else if (cursor) {
      cursor.style.display = 'none';
    }
  }

  setTimeout(typeCommand, 500);


  // ── NAV SCROLL EFFECT ──
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  });


  // ── MOBILE MENU ──
  const burger      = document.getElementById('burger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (burger && mobileMenu) {
    burger.addEventListener('click', toggleMenu);
  }
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    burger.classList.toggle('active', isOpen);

    const spans = burger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    const spans = burger ? burger.querySelectorAll('span') : [];
    if (spans.length === 3) {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  }


  // ── BOOK PAGE SWAP NAVIGATION + KEYBOARD + SWIPE + HASH SYNC ──
  const pageSections  = Array.from(document.querySelectorAll('.page-section'));
  const pageTriggers  = document.querySelectorAll('[data-page]');
  const navLinks      = document.querySelectorAll('.nav__links a');
  const prevPageBtn   = document.getElementById('prevPageBtn');
  const nextPageBtn   = document.getElementById('nextPageBtn');
  const pageIndicator = document.getElementById('pageIndicator');
  const bookStage     = document.getElementById('bookStage');

  const pageLabels = {
    hero: 'Home',
    about: 'About',
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Skills',
    certificates: 'Certificates',
    contact: 'Contact'
  };

  let currentPageIndex = Math.max(0, pageSections.findIndex(sec => sec.classList.contains('is-active')));

  function updatePagerUI(syncHash = false) {
    const activeId = pageSections[currentPageIndex]?.id || 'hero';
    if (pageIndicator) {
      pageIndicator.textContent = `Page ${currentPageIndex + 1} of ${pageSections.length} — ${pageLabels[activeId] || activeId}`;
    }
    if (prevPageBtn) prevPageBtn.disabled = currentPageIndex === 0;
    if (nextPageBtn) nextPageBtn.disabled = currentPageIndex === pageSections.length - 1;

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    });

    if (syncHash) {
      const nextHash = activeId === 'hero' ? '#hero' : `#${activeId}`;
      if (window.location.hash !== nextHash) {
        history.replaceState(null, '', nextHash);
      }
    }
  }

  function swapToPage(targetId, direction = 'next', syncHash = true) {
    const nextIndex = pageSections.findIndex(sec => sec.id === targetId);
    if (nextIndex === -1) return;

    const actualDirection = nextIndex < currentPageIndex ? 'prev' : direction;
    currentPageIndex = nextIndex;

    pageSections.forEach((sec, idx) => {
      sec.classList.remove('is-active', 'flip-prev');
      if (idx === currentPageIndex) {
        void sec.offsetWidth;
        sec.classList.add('is-active');
        if (actualDirection === 'prev') {
          sec.classList.add('flip-prev');
        }
      }
    });

    updatePagerUI(syncHash);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  pageTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const targetId = trigger.dataset.page;
      if (targetId && document.getElementById(targetId)) {
        e.preventDefault();
        swapToPage(targetId);
      }
    });
  });

  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPageIndex > 0) {
        swapToPage(pageSections[currentPageIndex - 1].id, 'prev');
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      if (currentPageIndex < pageSections.length - 1) {
        swapToPage(pageSections[currentPageIndex + 1].id, 'next');
      }
    });
  }

  // Keyboard Left/Right arrows for page flip (when modal/input is not focused)
  document.addEventListener('keydown', (e) => {
    const activeTag = document.activeElement?.tagName?.toLowerCase();
    const isTyping = activeTag === 'input' || activeTag === 'textarea';
    const modalOpen = document.getElementById('certModal')?.classList.contains('open');
    if (isTyping || modalOpen) return;

    if (e.key === 'ArrowRight' && currentPageIndex < pageSections.length - 1) {
      swapToPage(pageSections[currentPageIndex + 1].id, 'next');
    } else if (e.key === 'ArrowLeft' && currentPageIndex > 0) {
      swapToPage(pageSections[currentPageIndex - 1].id, 'prev');
    }
  });

  // Touch swipe left/right for mobile book flip
  let touchStartX = 0;
  let touchStartY = 0;

  if (bookStage) {
    bookStage.addEventListener('touchstart', (e) => {
      if (!e.touches.length) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    bookStage.addEventListener('touchend', (e) => {
      if (!e.changedTouches.length) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0 && currentPageIndex < pageSections.length - 1) {
          swapToPage(pageSections[currentPageIndex + 1].id, 'next');
        } else if (dx > 0 && currentPageIndex > 0) {
          swapToPage(pageSections[currentPageIndex - 1].id, 'prev');
        }
      }
    }, { passive: true });
  }

  // Restore page from initial URL hash if present
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && document.getElementById(initialHash)) {
    swapToPage(initialHash, 'next', false);
  } else {
    updatePagerUI(false);
  }


  // ── PROJECT CATEGORY FILTER ──
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards  = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.dataset.filter;

      filterButtons.forEach(b => b.classList.toggle('is-active', b === btn));

      projectCards.forEach(card => {
        const match = selected === 'all' || card.dataset.category === selected;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });

  // Hide missing project thumbnails cleanly if image file is not added yet
  document.querySelectorAll('.project-card__thumb img').forEach(img => {
    img.addEventListener('error', () => {
      img.closest('.project-card__thumb')?.classList.add('is-missing');
    });
  });


  // ── CERTIFICATE & INTERNSHIP PREVIEW MODAL ──
  const certModal         = document.getElementById('certModal');
  const certModalBackdrop = document.getElementById('certModalBackdrop');
  const certModalClose    = document.getElementById('certModalClose');
  const certModalTitle    = document.getElementById('certModalTitle');
  const certModalImg      = document.getElementById('certModalImg');
  const certModalNote     = document.getElementById('certModalNote');
  const previewTriggers   = document.querySelectorAll('.preview-trigger');

  function openPreviewModal(title, imgSrc) {
    if (!certModal) return;
    certModalTitle.textContent = title;
    certModalImg.style.display = 'none';
    certModalNote.textContent  = 'Loading preview...';
    certModalImg.alt = title;

    certModalImg.onerror = () => {
      certModalImg.style.display = 'none';
      certModalNote.textContent = `Image (${imgSrc}) load nahi hui — check karein ke file aapke "images" folder mein isi naam se mojood hai ya nahi.`;
    };
    certModalImg.onload = () => {
      certModalImg.style.display = 'block';
      certModalNote.textContent = '';
    };

    certModalImg.src = imgSrc;
    certModal.classList.add('open');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePreviewModal() {
    if (!certModal) return;
    certModal.classList.remove('open');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  previewTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      openPreviewModal(btn.dataset.title, btn.dataset.img);
    });
  });

  if (certModalClose) certModalClose.addEventListener('click', closePreviewModal);
  if (certModalBackdrop) certModalBackdrop.addEventListener('click', closePreviewModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('open')) {
      closePreviewModal();
    }
  });


  // ── COPY EMAIL BUTTON ──
  const copyEmailBtn = document.getElementById('copyEmailBtn');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const emailText = copyEmailBtn.dataset.email;

      try {
        await navigator.clipboard.writeText(emailText);
        copyEmailBtn.textContent = 'Copied ✓';
      } catch (err) {
        const tempInput = document.createElement('input');
        tempInput.value = emailText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        copyEmailBtn.textContent = 'Copied ✓';
      }

      setTimeout(() => {
        copyEmailBtn.textContent = 'Copy';
      }, 2500);
    });
  }


  // ── CONTACT FORM (Formspree) ──
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      const formData = new FormData(contactForm);

      btn.textContent = 'Sending...';
      btn.disabled = true;

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          btn.textContent = 'Message Sent ✓';
          btn.style.background  = 'var(--accent-dk)';
          btn.style.color       = '#ffffff';
          btn.style.borderColor = 'var(--accent-dk)';
          contactForm.reset();
        } else {
          btn.textContent = 'Failed — Try Again';
          btn.disabled = false;
        }
      } catch (error) {
        btn.textContent = 'Network Error — Try Again';
        btn.disabled = false;
      }

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background  = '';
        btn.style.color       = '';
        btn.style.borderColor = '';
        btn.disabled = false;
      }, 3500);
    });
  }

});