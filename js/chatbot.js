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

    // Knowledge Base — granular, specific answers so any single detail
    // (phone, email, location, a specific project, a specific internship,
    // a specific certificate, etc.) gets a precise, complete answer
    // instead of a vague catch-all category reply.
    const KB = {
      greeting: "👋 Hey! I'm Nagendra AI. Ask me anything about Nagendra — skills, projects, experience, education, certifications, achievements, or how to reach him.",

      name: "His full name is Appala Nagendra Varma.",
      role: "He's a final-year Computer Science Engineering student, and a Data Analyst & Full Stack Developer, specializing in AI, Machine Learning, and modern software development.",

      phone: 'You can call or text him at <a href="tel:+918885519886" target="_blank" rel="noopener">+91 8885519886</a>.',
      whatsapp: 'You can message him directly here: <a href="https://wa.me/918885519886" target="_blank" rel="noopener">Chat on WhatsApp</a>',
      email: 'His email is <a href="mailto:nagendravarma1315@gmail.com" target="_blank" rel="noopener">nagendravarma1315@gmail.com</a> — feel free to reach out anytime.',
      location: "He's based in India, Andhra Pradesh.",
      contact: 'Here\'s how to reach Nagendra:\n📞 Phone: <a href="tel:+918885519886" target="_blank" rel="noopener">+91 8885519886</a>\n💬 <a href="https://wa.me/918885519886" target="_blank" rel="noopener">Chat on WhatsApp</a>\n✉️ Email: <a href="mailto:nagendravarma1315@gmail.com" target="_blank" rel="noopener">nagendravarma1315@gmail.com</a>\n📍 Location: India, Andhra Pradesh\n\nYou\'ll also find GitHub, LinkedIn, Instagram and Twitter links in the Contact section below.',

      github: "GitHub: https://github.com/Nagendra14319",
      linkedin: "LinkedIn: https://www.linkedin.com/in/appala-nagendra-varma-25bbb9318",
      socials: "GitHub: https://github.com/Nagendra14319\nLinkedIn: https://www.linkedin.com/in/appala-nagendra-varma-25bbb9318",

      skills: "Nagendra works with: Python, JavaScript, React, Next.js, FastAPI, Node.js, TensorFlow, MongoDB, MySQL, SQL, Tailwind CSS, Git, Docker, and AWS. He's also worked with Gemini AI for building AI-powered applications.",

      education: "🎓 Education:\n• B.Tech, Computer Science & Engineering — Swarnandhra College of Engineering & Technology, Narsapur (2022–2026), CGPA 8.10\n• Intermediate, Computer Science — SVKP & PV Junior College (2020–2022), GPA 9.33\n• Secondary School Certificate — Bhashyam High School (2019–2020), GPA 9.99",

      experience: "💼 Internship experience:\n1. Generative AI Intern — Nivuna Labs (Sep 2025 – Mar 2026): built ML models and worked on real-world AI applications.\n2. Web Development Intern — InLighnX Global Pvt Ltd (Oct 2023 – Nov 2023): developed responsive web apps in a team setting.\n3. Python Developer Intern — CodTech (Aug 2023 – Sep 2023): worked on Python projects and automation scripts.",

      project_smart_city: "🏙️ Smart City Assistant — an AI-powered smart city platform with predictive analytics, voice assistance, and an interactive dashboard, built with Python, FastAPI, Streamlit, Google Gemini AI, and Scikit-learn.",
      project_water: "💧 Smart Water Analytics — an AI-powered water quality monitoring system with real-time analysis, visualization, and automated reporting, built with Python, Pandas, Streamlit, NumPy, and Matplotlib.",
      project_spamshield: "🛡️ SpamShield AI — an AI-powered email spam detection system using NLP and Machine Learning to classify messages, built with Python, Scikit-learn, NLP, Streamlit, and Pandas.",
      project_intellisql: "🗄️ IntelliSQL — an AI-powered SQL Query Assistant that converts natural language into SQL queries and runs them in real time, built with Python, Streamlit, SQLite, and Google Gemini AI.",
      projects: "🚀 Featured projects:\n1. Smart City Assistant — AI-powered smart city platform with predictive analytics\n2. Smart Water Analytics — water quality monitoring & reporting system\n3. SpamShield AI — NLP-based email spam classifier\n4. IntelliSQL — natural language to SQL query assistant\n\nAsk me about any one by name for more detail!",

      achievements: "🏆 Achievements:\n• 1st place — State-Level AI & Machine Learning Hackathon\n• Participant — Smart India Hackathon 2024\n• Member — Blind Coding Club (building by heart, not by sight)\n• Active NSS Volunteer\n• Chess player and problem solver",

      certificates: "📜 He holds 15+ certifications, including Python Programming (Infosys Springboard), Ethical Hacking (Eduskills), Data Structures (Great Learning), Fundamentals of Cybersecurity (Zscaler), Full Stack Developer (GrowthLink), Introduction to Generative AI (IBM), Solutions Architecture Job Simulation (AWS), and more — see the full list in the Certificates section.",

      resume: "You can view or download his resume using the 'View Resume' button in the hero section at the top of the page.",

      availability: "He's currently available for internships and full-time roles — feel free to reach out via email, phone, or WhatsApp!",

      fallback: "I'm not totally sure about that one — try asking about his skills, a specific project, his experience, education, certifications, achievements, or how to contact him (email, phone, WhatsApp)."
    };

    // Rule order matters: more specific patterns are checked first,
    // so "mobile number" or "phone number" match precisely instead of
    // falling into the broad "contact" rule below them.
    const RULES = [
      { keys: ['whatsapp', 'wa.me'], reply: KB.whatsapp },
      { keys: ['mobile number', 'mobile no', 'phone number', 'phone no', 'contact number', 'call him', 'his number', 'your number', ' mobile', ' phone'], reply: KB.phone },
      { keys: ['email', 'e-mail', 'mail id', 'gmail'], reply: KB.email },
      { keys: ['location', 'where is he', 'where does he live', 'based in', 'address', 'city', 'state'], reply: KB.location },
      { keys: ['github'], reply: KB.github },
      { keys: ['linkedin'], reply: KB.linkedin },
      { keys: ['social', 'socials'], reply: KB.socials },
      { keys: ['contact', 'reach', 'hire', 'connect', 'get in touch'], reply: KB.contact },

      { keys: ['name', 'who are you', 'who is he', 'who is nagendra'], reply: KB.name },
      { keys: ['role', 'what does he do', 'what is he', 'about him', 'about nagendra'], reply: KB.role },

      { keys: ['smart city'], reply: KB.project_smart_city },
      { keys: ['water', 'water analytics', 'water quality'], reply: KB.project_water },
      { keys: ['spamshield', 'spam shield', 'spam detect'], reply: KB.project_spamshield },
      { keys: ['intellisql', 'intelli sql', 'sql assistant'], reply: KB.project_intellisql },
      { keys: ['project', 'work', 'built', 'app', 'showcase'], reply: KB.projects },

      { keys: ['skill', 'tech stack', 'technology', 'technologies', 'language', 'stack'], reply: KB.skills },
      { keys: ['education', 'college', 'degree', 'study', 'studies', 'b.tech', 'btech', 'school', 'cgpa', 'gpa'], reply: KB.education },
      { keys: ['experience', 'intern', 'job', 'work history', 'career', 'nivuna', 'inlighnx', 'codtech'], reply: KB.experience },
      { keys: ['achieve', 'award', 'hackathon', 'win', 'nss', 'chess'], reply: KB.achievements },
      { keys: ['certif', 'certificate', 'certification'], reply: KB.certificates },
      { keys: ['resume', 'cv'], reply: KB.resume },
      { keys: ['available', 'availability', 'open to work', 'hiring', 'freelance'], reply: KB.availability },
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
          <div class="ai-msg ai-msg-bot">${text.replace(/\n/g, '<br>')}</div>
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

    // Hover-to-open/close is a desktop-only convenience — on touch
    // devices, tapping fires synthetic mouseenter then mouseleave in
    // quick succession (as the finger lifts), which was closing the
    // panel immediately after the tap opened it. Detect touch support
    // and skip attaching hover listeners entirely in that case.
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (!isTouchDevice) {
      toggleBtn.addEventListener('mouseenter', scheduleHoverOpen);
      toggleBtn.addEventListener('mouseleave', scheduleHoverClose);
      panel.addEventListener('mouseenter', scheduleHoverOpen);
      panel.addEventListener('mouseleave', scheduleHoverClose);
    }

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