
(function(){
  const nav = document.getElementById('mot-nav');
  const toggle = document.getElementById('mot-nav-toggle');
  const items = Array.from((nav && nav.querySelectorAll(':scope > ul > li')) || []);
  function closeAll(except){ items.forEach(li => { if(li!==except) li.classList.remove('open'); }); }
  if(toggle && nav){
    toggle.addEventListener('click', function(){
      const isOpen = nav.classList.toggle('open');
      if(!isOpen) closeAll();
      document.documentElement.style.overflow = isOpen ? 'hidden' : '';
      document.body.style.overflow = isOpen ? 'hidden' : '';
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
  items.forEach(li=>{
    const link = li.querySelector(':scope > a');
    const submenu = li.querySelector(':scope > .submenu');
    if(link && submenu){
      link.addEventListener('click', function(e){
        if(window.matchMedia('(min-width: 1200px)').matches) return;
        e.preventDefault();
        const opened = li.classList.toggle('open');
        if(opened) closeAll(li);
      });
    }
  });
  window.addEventListener('resize', function(){
    if(window.matchMedia('(min-width: 1200px)').matches){
      nav && nav.classList.remove('open');
      closeAll();
      document.documentElement.style.overflow='';
      document.body.style.overflow='';
      toggle && toggle.setAttribute('aria-expanded','false');
    }
  });
})();
