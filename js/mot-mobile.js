/* =======================
   1) Navigation (drawer + accordion) — deterministic visibility
   ======================= */
(function () {
  var root = document.getElementById('mot-app');
  if (!root) return;

  var nav = root.querySelector('#mot-nav') || root.querySelector('.mot-nav');
  var toggle = root.querySelector('.nav-toggle');
  if (!nav) return;

  var items = Array.prototype.slice.call(nav.querySelectorAll('.menu-item'));

  function hideAll(){
    items.forEach(function(li){
      li.classList.remove('open');
      var b = li.querySelector('.menu-btn');
      if (b) b.setAttribute('aria-expanded','false');
      var sub = li.querySelector('.submenu');
      if (sub){ sub.style.display = 'none'; }
    });
  }

  function show(li){
    var b = li.querySelector('.menu-btn');
    var sub = li.querySelector('.submenu');
    if (b) b.setAttribute('aria-expanded','true');
    if (sub){ sub.style.display = 'block'; }
    li.classList.add('open');
  }

  // Initial state: collapse all
  hideAll();

  // Drawer (hamburger) toggle
  var drawer = nav;
  if (drawer && toggle) {
    toggle.addEventListener('click', function () {
      var open = drawer.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Button clicks
  nav.addEventListener('click', function(e){
    // Let submenu anchors navigate
    if (e.target && e.target.closest('.submenu a')) return;

    var btn = e.target && e.target.closest('.menu-btn');
    if (!btn || !nav.contains(btn)) return;
    e.preventDefault();
    e.stopPropagation();

    var li = btn.closest('.menu-item');
    if (!li) return;
    var isOpen = li.classList.contains('open');

    hideAll();
    if (!isOpen) show(li);
  });

  // Click outside = collapse & close drawer
  document.addEventListener('click', function(e){
    if (!nav.contains(e.target) && (!toggle || !toggle.contains(e.target))) {
      hideAll();
      if (toggle) toggle.setAttribute('aria-expanded','false');
      drawer.classList.remove('open');
    }
  });
})(); // end navigation IIFE

/* =======================
   2) Carousel (container-width layout + forced autoplay w/ pause on hover & tab hidden)
   ======================= */
(function () {
  var root = document.getElementById('mot-app');
  if (!root) return;

  var carousels = root.querySelectorAll('.mot-carousel');
  carousels.forEach(function (section) {
    var track = section.querySelector('.hc-track, .track');
    if (!track || track.dataset.inited) return;
    track.dataset.inited = '1';

    var slides = Array.prototype.slice.call(track.children);
    var prev = section.querySelector('.prev');
    var next = section.querySelector('.next');
    var idx = 0;

    function viewW() {
      var w = section.getBoundingClientRect().width || 0;
      return Math.max(320, Math.round(w));
    }

    function layout(){
      var w = viewW();
      slides.forEach(function (s) { s.style.minWidth = w + 'px'; });
      track.style.transition = 'none';
      track.style.transform  = 'translateX(' + (-idx * w) + 'px)';
      requestAnimationFrame(function(){ track.style.transition = 'transform .5s ease'; });
    }

    function go(n, animate){
      idx = (n + slides.length) % slides.length;
      if (animate === false) track.style.transition = 'none';
      track.style.transform = 'translateX(' + (-idx * viewW()) + 'px)';
      if (animate === false) requestAnimationFrame(function(){ track.style.transition = 'transform .5s ease'; });
    }

    // Buttons
    if (prev) prev.addEventListener('click', function(){ go(idx - 1); });
    if (next) next.addEventListener('click', function(){ go(idx + 1); });

    // Layout bindings
    window.addEventListener('resize', layout, { passive:true });
    window.addEventListener('load',   layout);
    layout();

    // ---- Autoplay: force ON unless explicitly disabled via data-autoplay="false" ----
    var allowAuto = section.getAttribute('data-autoplay') !== 'false';
    if (allowAuto) {
      var timer = null;

      function start(){
        stop();
        timer = setInterval(function(){ go(idx + 1); }, 3000);
      }
      function stop(){
        if (timer) { clearInterval(timer); timer = null; }
      }

      // Start after a tiny delay in case pointer is initially over the carousel
      setTimeout(start, 100);

      // Pause on user interaction; resume when pointer leaves
      section.addEventListener('pointerenter', stop,  { passive:true });
      section.addEventListener('pointerleave', start, { passive:true });

      // Pause when tab is hidden; resume when visible
      document.addEventListener('visibilitychange', function(){
        if (document.hidden) stop(); else start();
      });
    }
  });
})(); // end carousel IIFE
