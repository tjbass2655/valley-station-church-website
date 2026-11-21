/* Vimeo viewer configuration. Edit only through Pages CMS > Watch Live (Vimeo). */
(() => {
  'use strict';
  const player = document.getElementById('vimeo-player');
  const button = document.getElementById('watch-vimeo-button');
  const message = document.getElementById('watch-message');
  const status = document.getElementById('player-status');
  if (!player || !button) return;

  function parseUrl(input) {
    if (typeof input !== 'string' || !input.trim()) return null;
    let value = input.trim();
    // Accept a Vimeo iframe snippet pasted from the Vimeo Embed menu.
    const match = value.match(/<iframe[^>]+\bsrc\s*=\s*(["'])(.*?)\1/i);
    if (match) value = match[2].replace(/&amp;/g,'&');
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:') return null;
      if (!['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(url.hostname)) return null;
      return url;
    } catch (_error) { return null; }
  }
  function viewerUrl(input) {
    const u = parseUrl(input);
    if (!u) return null;
    if (u.hostname === 'player.vimeo.com') {
      const m=u.pathname.match(/^\/video\/(\d+)$/);
      if (m) return 'https://vimeo.com/'+m[1];
      return null;
    }
    if (/^\/(event\/\d+|\d+(?:\/[a-zA-Z0-9]+)?)(?:\/embed)?\/?$/.test(u.pathname)) {
      const v = new URL(u.href); v.pathname=v.pathname.replace(/\/embed\/?$/,''); return v.href;
    }
    // Valid Vimeo profile/showcase URLs can still work as outgoing links.
    return u.href;
  }
  function embedUrl(input) {
    const u = parseUrl(input);
    if (!u) return null;
    let match;
    if (u.hostname === 'player.vimeo.com' && /^\/video\/\d+$/.test(u.pathname)) return u.href;
    match=u.pathname.match(/^\/event\/(\d+)(?:\/embed)?\/?$/);
    if (match) {
      const link = new URL('https://vimeo.com/event/'+match[1]+'/embed');
      ['h','autoplay','muted'].forEach(k=>{if (u.searchParams.has(k)) link.searchParams.set(k,u.searchParams.get(k));});
      return link.href;
    }
    match=u.pathname.match(/^\/(\d+)(?:\/([a-zA-Z0-9]+))?\/?$/);
    if (match) {
      const link=new URL('https://player.vimeo.com/video/'+match[1]);
      if (match[2]) link.searchParams.set('h',match[2]);
      if (u.searchParams.has('h')) link.searchParams.set('h',u.searchParams.get('h'));
      return link.href;
    }
    return null;
  }
  function render(data) {
    if (!data || typeof data !== 'object') return;
    if (data.service_note && typeof data.service_note === 'string') message.textContent=data.service_note;
    const viewer = viewerUrl(data.vimeo_url) || viewerUrl(data.embed_url);
    if (viewer) {
      button.href=viewer;
      button.hidden=false;
      button.textContent='Open on Vimeo ↗';
    }
    const src = embedUrl(data.embed_url) || embedUrl(data.vimeo_url);
    if (src) {
      const frame=document.createElement('iframe');
      frame.src=src;
      frame.title='Valley Station Church of God worship service on Vimeo';
      frame.loading='lazy';
      frame.allow='autoplay; fullscreen; picture-in-picture; encrypted-media';
      frame.referrerPolicy='strict-origin-when-cross-origin';
      frame.setAttribute('allowfullscreen','');
      player.replaceChildren(frame);
    } else if (viewer && status) {
      status.textContent='Select the Open on Vimeo button below to watch the church service. A player can be added here when a Vimeo event or video embed link is supplied.';
    }
  }
  if (window.VSCOG_LIVE_PREVIEW) {render(window.VSCOG_LIVE_PREVIEW);return;}
  fetch('../content/livestream.json', {cache:'no-cache'})
    .then(response=> {if(!response.ok) throw Error('Configuration not found'); return response.json();})
    .then(render)
    .catch(()=>{});
})();
