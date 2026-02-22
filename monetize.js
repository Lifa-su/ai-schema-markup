/**
 * Feifei's AI Tools — Universal Monetization Component
 * 
 * 自动为所有AI工具页面添加变现组件：
 * - ☕ Support / Buy me a coffee 按钮 → Gumroad
 * - 🔄 工具间交叉推广横幅
 * - 📧 邮件订阅收集框
 * - ⭐ Pro版升级提示
 * - 📤 社交分享按钮
 * 
 * 使用方式：在任意页面 </body> 前引入此脚本
 * <script src="monetize.js"></script>
 * 
 * 配置（可选）：
 * <script>
 *   window.MONETIZE_CONFIG = {
 *     gumroadUrl: 'https://lifa-su.gumroad.com/',
 *     toolName: 'AI Toolbox',
 *     showSupport: true,
 *     showCrossPromo: true,
 *     showNewsletter: true,
 *     showProUpgrade: true,
 *     showShare: true,
 *   };
 * </script>
 */
(function() {
  'use strict';

  // ─── Config ───────────────────────────────────────────────────
  const DEFAULT_CONFIG = {
    gumroadUrl: 'https://lifa-su.gumroad.com/',
    gumroadProUrl: 'https://lifa-su.gumroad.com/',
    toolName: document.title || 'AI Tool',
    showSupport: true,
    showCrossPromo: true,
    showNewsletter: true,
    showProUpgrade: true,
    showShare: true,
    newsletterEndpoint: '', // formspree/formsubmit URL, empty = localStorage mode
    proDelay: 60000, // show pro banner after 60s of usage
    supportPosition: 'bottom-right', // bottom-right | bottom-left
  };

  const CFG = Object.assign({}, DEFAULT_CONFIG, window.MONETIZE_CONFIG || {});

  // ─── Tool Registry (for cross-promotion) ──────────────────────
  const ALL_TOOLS = [
    { name:"AI Toolbox", icon:"🧰", desc:"多功能AI工具箱", link:"/ai-tools-hub/#ai-toolbox", cat:"business" },
    { name:"AI ID Photo", icon:"📸", desc:"智能证件照生成", link:"/ai-tools-hub/#ai-id-photo", cat:"design" },
    { name:"AI Translator", icon:"🌐", desc:"多语言智能翻译", link:"/ai-tools-hub/#ai-translator", cat:"writing" },
    { name:"AI Resume", icon:"📄", desc:"一键生成专业简历", link:"/ai-tools-hub/#ai-resume", cat:"business" },
    { name:"AI Copywriter", icon:"✏️", desc:"智能营销文案生成", link:"/ai-tools-hub/#ai-copywriter", cat:"writing" },
    { name:"QRCode Art", icon:"🎭", desc:"艺术二维码生成", link:"/ai-tools-hub/#qrcode-art", cat:"design" },
    { name:"SEOPilot", icon:"🚀", desc:"智能SEO优化", link:"/ai-tools-hub/#seopilot", cat:"business" },
    { name:"AI PPT Generator", icon:"🖥️", desc:"自动生成精美PPT", link:"/ai-tools-hub/#ai-ppt", cat:"business" },
    { name:"AI Diagram Generator", icon:"📐", desc:"自然语言生成图表", link:"/ai-tools-hub/#ai-diagram", cat:"design" },
    { name:"AI Code Reviewer", icon:"🔍", desc:"智能代码审查", link:"/ai-tools-hub/#ai-code-reviewer", cat:"dev" },
    { name:"AI Logo Generator", icon:"💎", desc:"AI品牌Logo设计", link:"/ai-tools-hub/#ai-logo", cat:"design" },
    { name:"AI Invoice Generator", icon:"🧾", desc:"快速创建专业发票", link:"/ai-tools-hub/#ai-invoice", cat:"business" },
    { name:"AI Cold Email", icon:"💌", desc:"高转化商务邮件", link:"/ai-tools-hub/#ai-cold-email", cat:"business" },
    { name:"AI JSON Toolkit", icon:"🔧", desc:"一站式JSON处理", link:"/ai-tools-hub/#ai-json", cat:"dev" },
    { name:"AI SQL Generator", icon:"🗃️", desc:"自然语言生成SQL", link:"/ai-tools-hub/#ai-sql", cat:"dev" },
  ];

  // ─── Styles ───────────────────────────────────────────────────
  const STYLES = `
    /* Monetize Component Styles */
    .mtz-reset,.mtz-reset *{margin:0;padding:0;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans SC',sans-serif}

    /* ☕ Support Button (Floating) */
    .mtz-support-btn{
      position:fixed;z-index:9999;
      ${CFG.supportPosition === 'bottom-left' ? 'left:20px' : 'right:20px'};
      bottom:20px;display:flex;align-items:center;gap:8px;
      padding:12px 20px;border-radius:50px;border:none;cursor:pointer;
      background:linear-gradient(135deg,#6c5ce7,#a855f7);color:#fff;
      font-size:14px;font-weight:600;text-decoration:none;
      box-shadow:0 4px 20px rgba(108,92,231,.4);
      transition:all .3s ease;animation:mtz-float-in .5s ease-out;
    }
    .mtz-support-btn:hover{transform:translateY(-2px) scale(1.03);box-shadow:0 6px 28px rgba(108,92,231,.55)}
    .mtz-support-btn .mtz-heart{font-size:18px;animation:mtz-beat 1.5s ease-in-out infinite}
    @keyframes mtz-beat{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
    @keyframes mtz-float-in{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

    /* 📤 Share Buttons */
    .mtz-share-bar{
      position:fixed;z-index:9998;
      ${CFG.supportPosition === 'bottom-left' ? 'left:20px' : 'right:20px'};
      bottom:72px;display:flex;flex-direction:column;gap:8px;
      animation:mtz-float-in .5s ease-out .2s both;
    }
    .mtz-share-btn{
      width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.1);
      background:rgba(18,18,26,.9);backdrop-filter:blur(10px);
      color:#e0e0e8;font-size:16px;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      transition:all .25s;text-decoration:none;
    }
    .mtz-share-btn:hover{background:rgba(108,92,231,.3);border-color:rgba(108,92,231,.5);transform:scale(1.1)}

    /* 🔄 Cross-Promotion Banner */
    .mtz-cross-promo{
      background:linear-gradient(135deg,rgba(18,18,26,.95),rgba(26,26,46,.95));
      backdrop-filter:blur(10px);
      border:1px solid rgba(108,92,231,.2);border-radius:16px;
      padding:28px;margin:40px auto;max-width:900px;
    }
    .mtz-cross-promo h3{font-size:16px;color:#a855f7;margin-bottom:16px;display:flex;align-items:center;gap:8px}
    .mtz-cross-promo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
    .mtz-promo-card{
      display:flex;align-items:center;gap:10px;padding:12px 14px;
      border-radius:10px;background:rgba(42,42,62,.5);border:1px solid rgba(42,42,62,.8);
      text-decoration:none;color:#e0e0e8;transition:all .25s;
    }
    .mtz-promo-card:hover{background:rgba(108,92,231,.15);border-color:rgba(108,92,231,.3);transform:translateY(-1px)}
    .mtz-promo-card .mtz-pi{font-size:1.4rem}
    .mtz-promo-card .mtz-pn{font-size:13px;font-weight:600}
    .mtz-promo-card .mtz-pd{font-size:11px;color:#8888a0}

    /* 📧 Newsletter */
    .mtz-newsletter{
      background:linear-gradient(135deg,rgba(18,18,26,.95),rgba(26,26,46,.95));
      backdrop-filter:blur(10px);
      border:1px solid rgba(6,182,212,.2);border-radius:16px;
      padding:32px;margin:24px auto;max-width:600px;text-align:center;
    }
    .mtz-newsletter h3{font-size:18px;color:#06b6d4;margin-bottom:8px}
    .mtz-newsletter p{font-size:13px;color:#8888a0;margin-bottom:18px}
    .mtz-newsletter-form{display:flex;gap:8px;max-width:420px;margin:0 auto}
    .mtz-newsletter-form input{
      flex:1;padding:12px 16px;border-radius:10px;border:1px solid rgba(42,42,62,.8);
      background:rgba(10,10,15,.6);color:#e0e0e8;font-size:14px;outline:none;
      transition:border-color .2s;
    }
    .mtz-newsletter-form input::placeholder{color:#555568}
    .mtz-newsletter-form input:focus{border-color:#06b6d4}
    .mtz-newsletter-form button{
      padding:12px 24px;border-radius:10px;border:none;
      background:linear-gradient(135deg,#06b6d4,#6c5ce7);color:#fff;
      font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;
      transition:all .25s;
    }
    .mtz-newsletter-form button:hover{opacity:.9;transform:scale(1.02)}
    .mtz-newsletter .mtz-success{color:#22c55e;font-size:14px;margin-top:12px;display:none}
    .mtz-newsletter .mtz-privacy{font-size:11px;color:#555568;margin-top:12px}

    /* ⭐ Pro Upgrade Banner */
    .mtz-pro-banner{
      position:fixed;z-index:9997;bottom:0;left:0;right:0;
      background:linear-gradient(135deg,rgba(108,92,231,.95),rgba(168,85,247,.95));
      backdrop-filter:blur(10px);
      padding:14px 24px;display:flex;align-items:center;justify-content:center;gap:16px;
      transform:translateY(100%);transition:transform .4s ease;
    }
    .mtz-pro-banner.mtz-visible{transform:translateY(0)}
    .mtz-pro-banner p{color:#fff;font-size:14px;font-weight:500}
    .mtz-pro-banner p strong{font-weight:700}
    .mtz-pro-banner a{
      padding:8px 20px;border-radius:8px;background:#fff;color:#6c5ce7;
      font-size:13px;font-weight:700;text-decoration:none;white-space:nowrap;
      transition:all .2s;
    }
    .mtz-pro-banner a:hover{background:#f0f0f0;transform:scale(1.03)}
    .mtz-pro-banner .mtz-close{
      position:absolute;right:16px;top:50%;transform:translateY(-50%);
      background:none;border:none;color:rgba(255,255,255,.7);font-size:20px;
      cursor:pointer;padding:4px 8px;
    }
    .mtz-pro-banner .mtz-close:hover{color:#fff}

    /* Responsive */
    @media(max-width:640px){
      .mtz-support-btn{padding:10px 16px;font-size:13px;bottom:16px;right:16px}
      .mtz-share-bar{bottom:64px;right:16px}
      .mtz-cross-promo{margin:24px 16px;padding:20px}
      .mtz-cross-promo-grid{grid-template-columns:1fr}
      .mtz-newsletter{margin:16px;padding:24px}
      .mtz-newsletter-form{flex-direction:column}
      .mtz-pro-banner{flex-wrap:wrap;padding:12px 40px 12px 16px;gap:10px}
    }
  `;

  // ─── Inject Styles ────────────────────────────────────────────
  function injectStyles() {
    const style = document.createElement('style');
    style.id = 'mtz-styles';
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  // ─── ☕ Support Button ────────────────────────────────────────
  function createSupportButton() {
    if (!CFG.showSupport) return;
    const btn = document.createElement('a');
    btn.className = 'mtz-support-btn mtz-reset';
    btn.href = CFG.gumroadUrl;
    btn.target = '_blank';
    btn.rel = 'noopener';
    btn.innerHTML = '<span class="mtz-heart">☕</span> Support this project';
    btn.setAttribute('aria-label', 'Support this project on Gumroad');
    document.body.appendChild(btn);
  }

  // ─── 📤 Share Buttons ────────────────────────────────────────
  function createShareButtons() {
    if (!CFG.showShare) return;
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(CFG.toolName + ' — Free AI Tool');
    const bar = document.createElement('div');
    bar.className = 'mtz-share-bar mtz-reset';
    bar.innerHTML = `
      <a class="mtz-share-btn" href="https://twitter.com/intent/tweet?url=${url}&text=${title}" target="_blank" rel="noopener" aria-label="Share on Twitter" title="Share on X/Twitter">𝕏</a>
      <a class="mtz-share-btn" href="https://www.linkedin.com/sharing/share-offsite/?url=${url}" target="_blank" rel="noopener" aria-label="Share on LinkedIn" title="Share on LinkedIn">in</a>
      <a class="mtz-share-btn" href="https://www.reddit.com/submit?url=${url}&title=${title}" target="_blank" rel="noopener" aria-label="Share on Reddit" title="Share on Reddit">📣</a>
      <button class="mtz-share-btn" onclick="navigator.clipboard.writeText(window.location.href).then(()=>{this.textContent='✓';setTimeout(()=>this.textContent='🔗',1500)})" aria-label="Copy link" title="Copy link">🔗</button>
    `;
    document.body.appendChild(bar);
  }

  // ─── 🔄 Cross-Promotion ──────────────────────────────────────
  function createCrossPromo() {
    if (!CFG.showCrossPromo) return;
    // Pick 4 random tools, excluding current
    const currentName = CFG.toolName;
    const others = ALL_TOOLS.filter(t => !currentName.includes(t.name));
    const picks = shuffle(others).slice(0, 4);
    if (picks.length === 0) return;

    const section = document.createElement('div');
    section.className = 'mtz-cross-promo mtz-reset';
    section.innerHTML = `
      <h3>✨ Discover More AI Tools</h3>
      <div class="mtz-cross-promo-grid">
        ${picks.map(t => `
          <a class="mtz-promo-card" href="${t.link}">
            <span class="mtz-pi">${t.icon}</span>
            <div>
              <div class="mtz-pn">${t.name}</div>
              <div class="mtz-pd">${t.desc}</div>
            </div>
          </a>
        `).join('')}
      </div>
    `;

    // Insert before footer, or append to body
    const footer = document.querySelector('footer');
    if (footer) {
      footer.parentNode.insertBefore(section, footer);
    } else {
      document.body.appendChild(section);
    }
  }

  // ─── 📧 Newsletter ───────────────────────────────────────────
  function createNewsletter() {
    if (!CFG.showNewsletter) return;
    // Don't show if already subscribed
    if (localStorage.getItem('mtz-subscribed')) return;

    const section = document.createElement('div');
    section.className = 'mtz-newsletter mtz-reset';
    section.innerHTML = `
      <h3>🚀 Get New AI Tools First</h3>
      <p>Subscribe to get notified when we launch new free AI tools. No spam, unsubscribe anytime.</p>
      <form class="mtz-newsletter-form" onsubmit="return false;">
        <input type="email" placeholder="your@email.com" required aria-label="Email address" />
        <button type="submit">Subscribe</button>
      </form>
      <div class="mtz-success">✅ Thanks for subscribing! We'll keep you posted.</div>
      <div class="mtz-privacy">🔒 We respect your privacy. No spam, ever.</div>
    `;

    const form = section.querySelector('form');
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = form.querySelector('input').value.trim();
      if (!email) return;

      // Store subscriber
      const subs = JSON.parse(localStorage.getItem('mtz-subscribers') || '[]');
      if (!subs.includes(email)) {
        subs.push(email);
        localStorage.setItem('mtz-subscribers', JSON.stringify(subs));
      }
      localStorage.setItem('mtz-subscribed', '1');

      // If external endpoint configured, send there too
      if (CFG.newsletterEndpoint) {
        fetch(CFG.newsletterEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, source: CFG.toolName, timestamp: new Date().toISOString() }),
        }).catch(() => {}); // silent fail
      }

      // Show success
      form.style.display = 'none';
      section.querySelector('.mtz-success').style.display = 'block';
    });

    // Insert before footer or cross-promo
    const crossPromo = document.querySelector('.mtz-cross-promo');
    const footer = document.querySelector('footer');
    const ref = crossPromo || footer;
    if (ref) {
      ref.parentNode.insertBefore(section, ref);
    } else {
      document.body.appendChild(section);
    }
  }

  // ─── ⭐ Pro Upgrade Banner ───────────────────────────────────
  function createProBanner() {
    if (!CFG.showProUpgrade) return;
    // Don't show if dismissed recently (7 days)
    const dismissed = localStorage.getItem('mtz-pro-dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 86400000) return;

    const banner = document.createElement('div');
    banner.className = 'mtz-pro-banner mtz-reset';
    banner.innerHTML = `
      <p>⚡ <strong>Unlock Pro Features</strong> — Batch processing, API access, priority support & more</p>
      <a href="${CFG.gumroadProUrl}" target="_blank" rel="noopener">Upgrade to Pro →</a>
      <button class="mtz-close" aria-label="Close">&times;</button>
    `;

    banner.querySelector('.mtz-close').addEventListener('click', () => {
      banner.classList.remove('mtz-visible');
      localStorage.setItem('mtz-pro-dismissed', Date.now().toString());
      setTimeout(() => banner.remove(), 400);
    });

    document.body.appendChild(banner);

    // Show after configured delay
    setTimeout(() => {
      banner.classList.add('mtz-visible');
    }, CFG.proDelay);
  }

  // ─── Helpers ──────────────────────────────────────────────────
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ─── Admin: Export Subscribers (console utility) ──────────────
  window.mtzExportSubscribers = function() {
    const subs = JSON.parse(localStorage.getItem('mtz-subscribers') || '[]');
    console.log('📧 Subscribers (' + subs.length + '):');
    console.log(subs.join('\n'));
    console.log('\nCSV: ' + subs.join(','));
    return subs;
  };

  // ─── Init ─────────────────────────────────────────────────────
  function init() {
    // Avoid double-init
    if (document.getElementById('mtz-styles')) return;

    injectStyles();
    createSupportButton();
    createShareButtons();
    createCrossPromo();
    createNewsletter();
    createProBanner();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
