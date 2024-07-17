document.addEventListener("DOMContentLoaded", function() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggleBtn.addEventListener('click', function() {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
  });

  const faders = document.querySelectorAll('.fade-in-section');
  const appearOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
  };
  const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
          } else {
              entry.target.classList.remove('is-visible');
          }
      });
  }, appearOptions);

  faders.forEach(fader => {
      appearOnScroll.observe(fader);
  });
});
