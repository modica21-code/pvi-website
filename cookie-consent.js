(function () {
  function pviCookieChoice(choice) {
    localStorage.setItem('pvi_cookie_consent', choice);
    var b = document.getElementById('cookie-banner');
    if (b) {
      b.style.transition = 'opacity 0.3s';
      b.style.opacity = '0';
      setTimeout(function () { b.style.display = 'none'; }, 300);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var consent = localStorage.getItem('pvi_cookie_consent');
    if (!consent) {
      var b = document.getElementById('cookie-banner');
      if (b) {
        b.style.display = 'flex';
        b.style.opacity = '0';
        setTimeout(function () {
          b.style.transition = 'opacity 0.4s';
          b.style.opacity = '1';
        }, 100);
      }
    }

    var declineBtn = document.getElementById('pvi-cookie-decline');
    if (declineBtn) {
      declineBtn.addEventListener('click', function () { pviCookieChoice('decline'); });
      declineBtn.addEventListener('mouseover', function () {
        this.style.borderColor = 'rgba(186,186,185,0.6)';
        this.style.color = '#fff';
      });
      declineBtn.addEventListener('mouseout', function () {
        this.style.borderColor = 'rgba(186,186,185,0.3)';
        this.style.color = 'rgba(186,186,185,0.7)';
      });
    }

    var acceptBtn = document.getElementById('pvi-cookie-accept');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () { pviCookieChoice('accept'); });
      acceptBtn.addEventListener('mouseover', function () { this.style.opacity = '0.88'; });
      acceptBtn.addEventListener('mouseout', function () { this.style.opacity = '1'; });
    }
  });
})();
