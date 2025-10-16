
// Minimal, conflict-safe autoplay for .mot-carousel (4s).
// Does not override global CSS; sets only inline styles on the target nodes.
(function(){
  function init(root){
    if(!root) return;
    const track = root.querySelector('.track');
    if(!track) return;
    const slides = Array.from(track.querySelectorAll('img'));
    if(slides.length === 0) return;
    if(root.dataset.autoplayInit === "1") return; // prevent double init
    root.dataset.autoplayInit = "1";

    // Inline-only layout (avoid CSS conflicts)
    track.style.display = 'flex';
    track.style.transition = 'transform 480ms ease';
    track.style.transform = 'translateX(0%)';
    slides.forEach(function(s){
      s.style.flex = '0 0 100%';
      s.style.width = '100%';
      s.style.height = 'auto';
      s.style.display = 'block';
      // Avoid object-fit override conflicts: only set if not defined
      if(!s.style.objectFit) s.style.objectFit = 'cover';
    });

    let idx = 0;
    function go(i){
      idx = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-idx*100) + '%)';
    }

    // 4s autoplay
    let timer = setInterval(function(){ go(idx + 1); }, 4000);

    // Pause on hover/focus (optional, safe)
    function pause(){ if(timer){ clearInterval(timer); timer = null; } }
    function play(){ if(!timer){ timer = setInterval(function(){ go(idx + 1); }, 4000); } }
    root.addEventListener('mouseenter', pause);
    root.addEventListener('mouseleave', play);
    root.addEventListener('focusin', pause);
    root.addEventListener('focusout', play);

    // Start
    go(0);
  }

  function boot(){
    document.querySelectorAll('.mot-carousel').forEach(init);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
