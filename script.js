// Simple shared JS: year, navbar active, lightbox, contact form, smooth scrolling
(function(){
  // Insert current year in all pages
  var ys = new Date().getFullYear();
  var els = document.querySelectorAll('[id^=year]');
  els.forEach(function(e){ e.textContent = ys; });

  // Add simple focus ring to active nav (best-effort)
  var navs = document.querySelectorAll('.main-nav a');
  navs.forEach(function(a){
    // if the href exactly matches current pathname, mark active
    var href = a.getAttribute('href');
    if(href && (location.pathname.endsWith(href) || (location.pathname.endsWith('/') && href==='index.html'))){
      a.classList.add('active');
    }
  });

  // Lightbox for gallery
  var thumbs = document.querySelectorAll('.thumb');
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImage');
  var lbClose = document.getElementById('lbClose');
  if(thumbs && lb){
    thumbs.forEach(function(btn){
      btn.addEventListener('click', function(){
        var src = btn.getAttribute('data-src');
        lbImg.src = src;
        lb.style.display = 'flex';
        lb.setAttribute('aria-hidden','false');
      });
    });
    lbClose.addEventListener('click', function(){ lb.style.display='none'; lb.setAttribute('aria-hidden','true'); lbImg.src=''; });
    lb.addEventListener('click', function(e){ if(e.target===lb){ lb.style.display='none'; lb.setAttribute('aria-hidden','true'); lbImg.src=''; } });
  }

  // Smooth scroll and highlight for anchored sections on homepage
  function scrollAndHighlight(hash){
    if(!hash) return;
    var id = hash.replace('#','');
    var el = document.getElementById(id);
    if(!el) return;
    // small delay for page load / layout
    setTimeout(function(){
      el.scrollIntoView({behavior:'smooth', block:'start'});
      el.classList.add('highlight');
      setTimeout(function(){ el.classList.remove('highlight'); }, 2000);
    }, 40);
  }

  // If page loads with a hash, scroll to it
  window.addEventListener('load', function(){ if(location.hash){ scrollAndHighlight(location.hash); } });

  // If user navigates history to a hash
  window.addEventListener('hashchange', function(){ if(location.hash){ scrollAndHighlight(location.hash); } });

  // Intercept same-page anchor clicks to avoid reload and animate
  document.addEventListener('click', function(e){
    var a = e.target.closest('a');
    if(!a || a.target === '_blank') return;
    var href = a.getAttribute('href') || '';
    try{
      var url = new URL(href, location.href);
      if(url.hash && url.pathname === location.pathname){
        e.preventDefault();
        history.replaceState(null,'', url.hash);
        scrollAndHighlight(url.hash);
      }
    }catch(err){ /* ignore invalid URLs */ }
  });

  // Contact form handling (client-side only)
  var form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = form.elements['name'].value.trim();
      var email = form.elements['email'].value.trim();
      var message = form.elements['message'].value.trim();
      var msgEl = document.getElementById('formMsg');
      if(!name || !email || !message){
        msgEl.textContent = 'Please complete all required fields.';
        msgEl.style.color = '#ffb3b3';
        return;
      }
      // very simple email check
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
        msgEl.textContent = 'Please enter a valid email address.';
        msgEl.style.color = '#ffb3b3';
        return;
      }
      // Mock submit
      msgEl.textContent = 'Sending...';
      setTimeout(function(){
        msgEl.textContent = 'Message sent. Thank you!';
        msgEl.style.color = '#9ae6b4';
        form.reset();
      },900);
    });
  }
})();
