/* Valley Station Church of God, public archive. Reads the SAME Pages CMS sermons list. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const search = $('sermon-search');
  const year = $('year-filter');
  const order = $('sort-filter');
  const results = $('sermon-results');
  const count = $('result-count');
  const total = $('library-total');
  const more = $('load-more');
  const PAGE = 12;
  let all = [];
  let shown = PAGE;

  function node(tag, cls, value) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (value !== undefined) el.textContent = String(value);
    return el;
  }
  function dateTime(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const d = new Date(value + 'T12:00:00');
    return Number.isNaN(d.getTime()) ? null : d;
  }
  function niceDate(value) {
    const date = dateTime(value);
    return date ? new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(date) : 'Date not listed';
  }
  function yearName(item) {
    return dateTime(item.date) ? item.date.slice(0,4) : 'Undated';
  }
  function videoUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value, location.href);
      return (url.protocol === 'https:' || url.protocol === 'http:') ? url.href : null;
    } catch (_) { return null; }
  }
  function sermonCard(s) {
    const card = node('article','sermon-card');
    card.append(node('div','sermon-date',niceDate(s.date)));
    card.append(node('h3','',s.title));
    if (s.scripture) card.append(node('p','scripture',s.scripture));
    if (s.summary) card.append(node('p','sermon-summary',s.summary));
    const url = videoUrl(s.link);
    if (url) {
      const a = node('a','sermon-cta','▶  Watch or Listen');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label','Watch or listen to ' + s.title);
      card.append(a);
    } else {
      card.append(node('p','no-video','Recording link coming soon'));
    }
    return card;
  }
  function filtered() {
    const term = search.value.trim().toLowerCase();
    const selectedYear = year.value;
    return all.filter(s => {
      if (selectedYear !== 'all' && yearName(s) !== selectedYear) return false;
      return !term || [s.title,s.scripture,s.summary].some(v => typeof v === 'string' && v.toLowerCase().includes(term));
    }).sort((a,b) => order.value === 'oldest' ? String(a.date || '9999').localeCompare(String(b.date || '9999')) : String(b.date || '').localeCompare(String(a.date || '')));
  }
  function render() {
    const list = filtered();
    count.textContent = list.length === all.length ? `Showing ${Math.min(shown,list.length)} of ${all.length} messages` : `${list.length} matching message${list.length === 1 ? '' : 's'} · Showing ${Math.min(shown,list.length)}`;
    results.replaceChildren();
    more.hidden = shown >= list.length;
    if (!list.length) {
      results.append(node('div','placeholder',all.length ? 'No sermons match your search. Try another title, year or scripture.' : 'Our sermon library is being prepared. Please check back soon for new messages and recordings.'));
      return;
    }
    const sections = new Map();
    list.slice(0,shown).forEach(item => {
      const yr = yearName(item);
      let grid = sections.get(yr);
      if (!grid) {
        const heading = node('h3','year-heading',yr);
        const section = node('section','archive-year');
        section.setAttribute('aria-label',yr + ' sermons');
        grid = node('div','sermon-grid');
        section.append(heading, grid);
        results.append(section);
        sections.set(yr,grid);
      }
      grid.append(sermonCard(item));
    });
  }
  function showError() {
    count.textContent = '';
    total.textContent = 'Library currently unavailable';
    more.hidden = true;
    results.replaceChildren();
    const p = node('div','placeholder','We could not load the sermons at this moment. Please refresh the page, or visit our Watch Live page for current services.');
    results.append(p);
  }
  async function init() {
    try {
      const res = await fetch('../content/sermons.json',{cache:'no-cache'});
      if (!res.ok) throw Error('Could not read sermons file');
      const data = await res.json();
      if (!Array.isArray(data)) throw Error('Invalid sermons data');
      all = data.filter(s => s && typeof s.title === 'string' && s.title.trim());
      const years = [...new Set(all.map(yearName))].sort((a,b)=>b.localeCompare(a));
      for (const y of years) { const option=node('option','',y); option.value=y; year.append(option); }
      total.textContent = `${all.length} message${all.length === 1 ? '' : 's'} in the library`;
      render();
    } catch (_) {showError();}
  }
  for (const e of [search,year,order]) e.addEventListener(e === search ? 'input' : 'change',()=>{shown=PAGE;render();});
  more.addEventListener('click',()=>{shown+=PAGE;render();});
  init();
})();
