/* Valley Station Church of God: weekly content, updated in Pages CMS.
   Public visitors never see an editing form. All text is inserted safely. */
(function () {
  'use strict';

  const sample = window.VSCOG_PREVIEW_DATA || null;
  const byId = id => document.getElementById(id);
  function elem(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined && value !== null) node.textContent = String(value);
    return node;
  }
  function localDate(iso) {
    if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
    const d = new Date(`${iso}T12:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  function niceDate(iso) {
    const d = localDate(iso);
    return d ? new Intl.DateTimeFormat('en-US', {month:'long', day:'numeric', year:'numeric'}).format(d) : '';
  }
  function churchToday() {
    const pieces = new Intl.DateTimeFormat('en-US', {timeZone:'America/New_York', year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(new Date());
    const find = name => pieces.find(p => p.type === name).value;
    return `${find('year')}-${find('month')}-${find('day')}`;
  }
  function allowedLink(raw) {
    if (typeof raw !== 'string' || !raw.trim()) return null;
    try {
      const url = new URL(raw, location.href);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
    } catch (_err) { return null; }
  }
  function safeImage(raw, title) {
    if (typeof raw !== 'string' || !raw.trim()) return null;
    const url = allowedLink(raw);
    if (!url) return null;
    const image = elem('img', 'updates-thumb');
    image.src = url;
    image.alt = title || 'Church announcement image';
    image.loading = 'lazy';
    return image;
  }
  function emptyState(message) {return elem('p','updates-empty',message);}
  function setContent(target, items) {
    const node = byId(target);
    if (!node) return;
    node.replaceChildren(...items);
  }
  function meta(parent, text) {if(text) parent.append(elem('div','updates-meta',text));}
  function renderAnnouncements(items) {
    const target=[];
    [...items].filter(x=>x&&x.title).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))).slice(0,6).forEach(item=>{
      const card=elem('article','updates-item'+(item.important?' updates-highlight':''));
      meta(card, niceDate(item.date));
      card.append(elem('h4','',item.title));
      const image=safeImage(item.image,item.title);
      if(image) card.append(image);
      if(item.message) card.append(elem('p','',item.message));
      target.push(card);
    });
    if(!target.length) target.push(emptyState('Watch this space for this week’s announcements and church news.'));
    setContent('announcements-list',target);
  }
  function renderEvents(items) {
    const today=churchToday();
    const target=[];
    [...items].filter(x=>x&&x.title&&x.date&&x.date>=today).sort((a,b)=>String(a.date).localeCompare(String(b.date))).slice(0,6).forEach(item=>{
      const date=localDate(item.date);
      const card=elem('article','updates-item');
      const row=elem('div','event-row');
      if(date){
        const b=elem('div','event-date');
        b.append(elem('span','event-month',new Intl.DateTimeFormat('en-US',{month:'short'}).format(date)));
        b.append(elem('span','event-day',date.getDate()));
        row.append(b);
      }
      const info=elem('div','event-info');
      info.append(elem('h4','',item.title));
      meta(info,[item.time,item.place].filter(Boolean).join(' · '));
      const image=safeImage(item.image,item.title);
      if(image) info.append(image);
      if(item.details) info.append(elem('p','',item.details));
      row.append(info);card.append(row);target.push(card);
    });
    if(!target.length) target.push(emptyState('Upcoming services and events will be posted here.'));
    setContent('events-list',target);
  }
  function renderSermons(items) {
    const target=[];
    [...items].filter(x=>x&&x.title).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))).slice(0,3).forEach(item=>{
      const card=elem('article','sermon-item');
      meta(card,niceDate(item.date));
      card.append(elem('h4','',item.title));
      if(item.scripture) card.append(elem('div','updates-meta',item.scripture));
      if(item.summary) card.append(elem('p','',item.summary));
      const href=allowedLink(item.link);
      if(href){const a=elem('a','sermon-link','Watch or listen to this message →');a.href=href;a.target='_blank';a.rel='noopener noreferrer';card.append(a);}
      target.push(card);
    });
    if(!target.length) target.push(emptyState('Sermon titles, scriptures and video links will appear here.'));
    setContent('sermons-list',target);
  }
  async function load(name, renderer) {
    if (sample && Array.isArray(sample[name])) {renderer(sample[name]);return;}
    try {
      const response = await fetch(`content/${name}.json`,{cache:'no-cache'});
      if (!response.ok) throw Error('Content unavailable');
      const data=await response.json();
      renderer(Array.isArray(data)?data:[]);
    } catch (_error) { renderer([]); }
  }
  load('announcements',renderAnnouncements);
  load('events',renderEvents);
  load('sermons',renderSermons);
})();
