
(function(){
  const shell = document.getElementById('mot-shell');
  const toggle = document.getElementById('mot-nav-toggle');
  if(!shell || !toggle) return;
  // If there's no top-level UL, bail; try to find first nav > ul
  const nav = shell.querySelector('nav');
  const topUL = nav ? nav.querySelector(':scope > ul') : null;

  toggle.addEventListener('click', function(){
    const open = shell.classList.toggle('open');
    document.documentElement.style.overflow = open ? 'hidden' : '';
    document.body.style.overflow = open ? 'hidden' : '';
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // mobile submenu open-on-tap
  if(nav){
    nav.querySelectorAll(':scope > ul > li > a').forEach(a => {
      const li = a.parentElement;
      const sub = li.querySelector(':scope > ul');
      if(!sub) return;
      a.addEventListener('click', function(e){
        if(window.matchMedia('(min-width: 1200px)').matches) return;
        e.preventDefault();
        const isOpen = li.classList.toggle('open');
        Array.from(nav.querySelectorAll(':scope > ul > li')).forEach(x=>{
          if(x!==li) x.classList.remove('open');
        });
      });
    });
  }

  // Close on resize up
  window.addEventListener('resize', function(){
    if(window.matchMedia('(min-width: 1200px)').matches){
      shell.classList.remove('open');
      document.documentElement.style.overflow='';
      document.body.style.overflow='';
      toggle.setAttribute('aria-expanded','false');
    }
  });
})();
