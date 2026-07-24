/**
 * Nagendra AI — chatbot implementation
 * Handles open/close, messaging, typing indicator, quick replies, and rule-based answers.
 * Designed to align with the premium floating robot styling in style.css.
 */
(function () {
  function initChatbot() {
    const widget = document.getElementById('aiChatWidget');
    const toggleBtn = document.getElementById('aiChatToggle');
    const panel = document.getElementById('aiChatPanel');
    const closeBtn = document.getElementById('aiChatClose');
    const hero = document.getElementById('aiChatHero');
    const messages = document.getElementById('aiChatMessages');
    const typingRow = document.getElementById('aiTypingRow');
    const quickRow = document.getElementById('aiChatQuick');
    const form = document.getElementById('aiChatForm');
    const input = document.getElementById('aiChatInput');

    if (!widget || !toggleBtn || !panel || !form || !input) return;

    // To prevent double initialization
    if (window.nagendraChatbotInitialized) return;
    window.nagendraChatbotInitialized = true;

    // Knowledge Base
    const KB = {
      greeting: "👋 Hey! I'm Nagendra AI. Ask me about his skills, projects, experience, or how to get in touch.",
      skills: "Nagendra works mainly with Python, JavaScript, React, Next.js, FastAPI, Node.js, TensorFlow, MongoDB and SQL. He's also comfortable with Git, Docker and AWS.",
      projects: "Some featured projects: an AI Chatbot Assistant (Python, FastAPI, OpenAI), this Portfolio Website (Next.js, Tailwind, Framer Motion), a full-stack Task Manager App (React, Node.js, MongoDB), and an ML Disease Predictor (Python, scikit-learn).",
      experience: "He's interned as a Generative AI Intern at Nivuna Labs, a Web Development Intern at InLighnX Global, and a Python Developer Intern at CodTech.",
      education: "He's currently pursuing a B.Tech in CSE (2022–2026).",
      contact: "You can reach Nagendra at nagendravarma1315@gmail.com or +91 8885519886. Links to GitHub, LinkedIn and other socials are in the Contact section below.",
      achievements: "He won 1st place in a State-Level AI & ML Hackathon, participated in Smart India Hackathon 2024, and is part of the Blind Coding Club.",
      resume: "You can view/download his resume using the 'View Resume' button in the hero section at the top of the page.",
      fallback: "I'm not totally sure about that one — but feel free to ask about Nagendra's skills, projects, experience, or how to contact him!"
    };

    const RULES = [
      { keys: ['skill', 'tech', 'stack', 'language', 'technolog'], reply: KB.skills },
      { keys: ['project', 'work', 'built', 'portfolio site', 'app'], reply: KB.projects },
      { keys: ['experience', 'intern', 'job', 'work history', 'career'], reply: KB.experience },
      { keys: ['education', 'college', 'degree', 'study', 'b.tech', 'btech'], reply: KB.education },
      { keys: ['contact', 'email', 'phone', 'reach', 'hire', 'connect'], reply: KB.contact },
      { keys: ['achieve', 'award', 'hackathon', 'win', 'certif'], reply: KB.achievements },
      { keys: ['resume', 'cv'], reply: KB.resume },
      { keys: ['hi', 'hello', 'hey', 'yo'], reply: KB.greeting },
    ];

    function getReply(text) {
      const t = text.toLowerCase();
      for (const rule of RULES) {
        if (rule.keys.some(k => t.includes(k))) return rule.reply;
      }
      return KB.fallback;
    }

    const QUICK_REPLIES = ['Skills', 'Projects', 'Experience', 'Contact'];

    function renderQuickReplies() {
      if (!quickRow) return;
      quickRow.innerHTML = '';
      QUICK_REPLIES.forEach((label) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ai-chat-chip';
        btn.textContent = label;
        btn.addEventListener('click', () => {
          addMessage(label, 'user');
          respondTo(label);
        });
        quickRow.appendChild(btn);
      });
    }

    function addMessage(text, sender) {
      if (!messages) return;
      
      if (sender === 'bot') {
        const row = document.createElement('div');
        row.className = 'ai-msg-row';
        row.innerHTML = `
          <div class="ai-msg-avatar-mini">
            <svg class="ai-robot-icon" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="6" r="2" fill="#00E5FF"/>
              <line x1="20" y1="8" x2="20" y2="12" stroke="#00E5FF" stroke-width="2"/>
              <rect x="1" y="20" width="4" height="8" rx="2" fill="#EDF1F7"/>
              <rect x="35" y="20" width="4" height="8" rx="2" fill="#EDF1F7"/>
              <rect x="6" y="12" width="28" height="22" rx="10" fill="#EDF1F7"/>
              <rect x="6" y="12" width="28" height="22" rx="10" fill="none" stroke="#00E5FF" stroke-width="1.4" opacity=".55"/>
              <circle cx="15" cy="23" r="3" fill="#0B0F1E"/>
              <circle cx="15" cy="23" r="1.4" fill="#00E5FF"/>
              <circle cx="25" cy="23" r="3" fill="#0B0F1E"/>
              <circle cx="25" cy="23" r="1.4" fill="#00E5FF"/>
            </svg>
          </div>
          <div class="ai-msg ai-msg-bot">${text}</div>
        `;
        messages.appendChild(row);
      } else {
        const div = document.createElement('div');
        div.className = 'ai-msg ai-msg-user';
        div.textContent = text;
        messages.appendChild(div);
      }
      messages.scrollTop = messages.scrollHeight;
    }

    function showTyping(show) {
      if (!typingRow) return;
      typingRow.classList.toggle('show', show);
      if (show && messages) messages.scrollTop = messages.scrollHeight;
    }

    function respondTo(userText) {
      showTyping(true);
      const delay = 600 + Math.random() * 600;
      setTimeout(() => {
        showTyping(false);
        addMessage(getReply(userText), 'bot');
      }, delay);
    }

    function openPanel(focusInput) {
      widget.classList.add('open');
      panel.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      if (focusInput) input.focus();
    }

    function closePanel() {
      widget.classList.remove('open');
      panel.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (panel.classList.contains('open')) {
        closePanel();
      } else {
        openPanel(true);
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closePanel();
      });
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!panel.classList.contains('open')) return;
      if (panel.contains(e.target) || toggleBtn.contains(e.target)) return;
      closePanel();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('open')) {
        closePanel();
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      if (hero) hero.style.display = 'none';
      addMessage(text, 'user');
      input.value = '';
      respondTo(text);
    });

    // ---- Hover-to-open / hover-to-close (added, everything above is unchanged) ----
    // Listens on the toggle button and the panel directly (not the wrapper),
    // since the wrapper may also contain oversized decorative elements
    // (e.g. particle effects) that would otherwise block "leave" detection.
    let hoverCloseTimer = null;
    let lastPointerX = 0;
    let lastPointerY = 0;

    // Track real cursor position continuously — during the chatbot's slide
    // animation, :hover state on a moving element can briefly desync from
    // where the cursor actually is, causing inconsistent close behavior.
    document.addEventListener('mousemove', (e) => {
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
    });

    function isPointerOverWidget() {
      const el = document.elementFromPoint(lastPointerX, lastPointerY);
      if (!el) return false;
      return toggleBtn.contains(el) || panel.contains(el) || el === toggleBtn || el === panel;
    }

    function scheduleHoverClose() {
      clearTimeout(hoverCloseTimer);
      hoverCloseTimer = setTimeout(() => {
        // Don't close if the cursor is actually still over either element,
        // or if the user is actively typing in the input
        if (isPointerOverWidget()) return;
        if (document.activeElement === input) return;
        closePanel();
      }, 300);
    }

    function scheduleHoverOpen() {
      clearTimeout(hoverCloseTimer);
      openPanel();
    }

    toggleBtn.addEventListener('mouseenter', scheduleHoverOpen);
    toggleBtn.addEventListener('mouseleave', scheduleHoverClose);
    panel.addEventListener('mouseenter', scheduleHoverOpen);
    panel.addEventListener('mouseleave', scheduleHoverClose);

    // If focus leaves the input (e.g. user clicks elsewhere), re-check hover state
    input.addEventListener('blur', () => {
      if (!toggleBtn.matches(':hover') && !panel.matches(':hover')) {
        scheduleHoverClose();
      }
    });

    // Check if there was a pending open request
    if (toggleBtn.dataset.pendingOpen === '1') {
      toggleBtn.dataset.pendingOpen = '';
      openPanel(true);
    }

    renderQuickReplies();
  }

  window.initNagendraChatbot = initChatbot;

  // Auto-init if loaded statically (fallback)
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initChatbot();
  } else {
    document.addEventListener('DOMContentLoaded', initChatbot);
  }

  // ---- Slide chatbot to bottom-left while the Contact section is visible ----
  // Purely additive: does not touch open/close/typing/message logic above.
  function initContactAvoidance() {
    const widget = document.getElementById('aiChatWidget');
    const contactSection = document.getElementById('contact');
    if (!widget || !contactSection) return;
    if (window.nagendraContactObserverInitialized) return;
    window.nagendraContactObserverInitialized = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            widget.classList.add('move-left');
          } else {
            widget.classList.remove('move-left');
          }
        });
      },
      { threshold: 0.55 } // ~55% visibility, within the requested 50-60% range
    );

    observer.observe(contactSection);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initContactAvoidance();
  } else {
    document.addEventListener('DOMContentLoaded', initContactAvoidance);
  }
})();