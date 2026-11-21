/* Valley Station Church of God: manually advanced Monthly Events slideshow. */
(function () {
  'use strict';
  var root = document.getElementById('event-showcase');
  if (!root) return;
  var photo = root.querySelector('#event-slide-image');
  var heading = root.querySelector('#event-slide-title');
  var details = root.querySelector('#event-slide-details');
  var month = root.querySelector('#event-slide-month');
  var counter = root.querySelector('#event-slide-count');
  var dots = root.querySelector('#event-slide-dots');
  var open = root.querySelector('#event-slide-open');
  var prev = root.querySelector('#event-slide-prev');
  var next = root.querySelector('#event-slide-next');
  var slides = [];
  var index = 0;
  var touchStartX = null;
  function safeImage(value) {
    if (typeof value !== 'string') return '';
    var path = value.trim();
    if (!path || /^(?:javascript:|data:|blob:)/i.test(path)) return '';
    try { var url = new URL(path, window.location.href); return (url.protocol === 'https:' || url.protocol === 'http:') ? url.href : ''; }
    catch (e) { return ''; }
  }
  function render() {
    if (!slides.length) return;
    var item = slides[index];
    photo.src = item.path;
    photo.alt = item.title + ', event flyer';
    heading.textContent = item.title;
    details.textContent = item.details || 'See the flyer above for more information.';
    month.textContent = item.month || 'Church Events';
    counter.textContent = (index + 1) + ' of ' + slides.length;
    open.href = item.path;
    dots.replaceChildren();
    slides.forEach(function (slide, n) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Show slide ' + (n + 1) + ': ' + slide.title);
      dot.setAttribute('aria-current', n === index ? 'true' : 'false');
      dot.addEventListener('click', function () { index = n; render(); });
      dots.appendChild(dot);
    });
    prev.disabled = next.disabled = slides.length < 2;
  }
  function go(direction) {
    if (slides.length < 2) return;
    index = (index + direction + slides.length) % slides.length;
    render();
  }
  prev.addEventListener('click', function () { go(-1); });
  next.addEventListener('click', function () { go(1); });
  root.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); go(1); }
  });
  var stage = root.querySelector('.event-showcase-stage');
  stage.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches.length ? e.changedTouches[0].clientX : null;
  }, {passive:true});
  stage.addEventListener('touchend', function (e) {
    if (touchStartX === null || !e.changedTouches.length) return;
    var distance = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(distance) > 55) go(distance < 0 ? 1 : -1);
  }, {passive:true});
  photo.addEventListener('error', function () {
    details.textContent = 'This flyer cannot be displayed. Check its image path in Pages CMS.';
  });
  function init(data) {
    slides = (Array.isArray(data) ? data : []).map(function (item) {
      return {
        title: typeof item.title === 'string' && item.title.trim() ? item.title.trim() : 'Church Announcement',
        month: typeof item.month === 'string' ? item.month.trim() : '',
        details: typeof item.details === 'string' ? item.details.trim() : '',
        path: safeImage(item.image),
        pinned: item.pinned_theme === true
      };
    }).filter(function (item) { return Boolean(item.path); }).slice(0, 60);
    // Always keep theme slides at the end, even as new monthly flyers are added in Pages CMS.
    slides = slides.filter(function (item) { return !item.pinned; }).concat(slides.filter(function (item) { return item.pinned; }));
    if (!slides.length) {
      heading.textContent = 'No event slides are posted yet';
      details.textContent = 'Check back for upcoming church announcements.';
      month.textContent = 'Church Events';
      counter.textContent = '0 of 0';
      photo.hidden = true;
      open.hidden = true;
      prev.disabled = next.disabled = true;
      return;
    }
    photo.hidden = false;
    open.hidden = false;
    index = 0;
    render();
  }
  fetch('/content/event-slides.json', { cache: 'no-store' })
    .then(function (response) { if (!response.ok) throw new Error('HTTP '+response.status); return response.json(); })
    .then(init)
    .catch(function () {
      root.querySelector('.event-showcase-image').innerHTML = '<p class="event-showcase-error">Slides are temporarily unavailable. Please try again shortly.</p>';
      heading.textContent = 'Church Events';
      details.textContent = 'Our event announcements are being updated.';
      month.textContent = 'Monthly Slideshow';
      open.hidden = true;
      prev.disabled = next.disabled = true;
    });
})();
