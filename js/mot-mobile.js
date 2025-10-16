// MOT navigation (drawer + accordion) — deterministic visibility
(function () {
  var root = document.getElementById('mot-app');
  if (!root) return;

  var nav = root.querySelector('#mot-nav') || root.querySelector('.mot-nav');
  var toggle = root.querySelector('.nav-toggle');
  if (!nav) return;

  var items = Array.prototype.slice.call(nav.querySelectorAll('.menu-item'));
  var buttons = Array.prototype.slice.call(nav.querySelectorAll('.menu-btn'));

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
})();