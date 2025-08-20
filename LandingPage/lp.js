// Smooth behavior and nav interactions
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('mainHeader');
  const links = document.querySelectorAll('.nav-link');

  // Add smooth scroll for nav links
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector(link.getAttribute('href')).scrollIntoView({behavior: 'smooth', block: 'start'});
      // set active visually on click
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });

    // hover effect (also CSS handles it) — small JS accent for fun
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateY(-3px) scale(1.02)';
    });
    link.addEventListener('mouseleave', () => {
      link.style.transform = '';
    });
  });

  // On scroll — change nav background when scrolled past hero
  const changeNavOn = 60;
  const onScroll = () => {
    if (window.scrollY > changeNavOn) {
      header.classList.remove('nav-transparent');
      header.classList.add('nav-solid');
    } else {
      header.classList.remove('nav-solid');
      header.classList.add('nav-transparent');
    }

    // highlight active link based on sections in viewport
    const sections = document.querySelectorAll('main > section');
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      const id = sec.id;
      const link = document.querySelector(a[href="#${id}"]);
      if (!link) return;
      if (rect.top <= 120 && rect.bottom >= 120) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll(); // initial
});