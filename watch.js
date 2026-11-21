/* Vimeo live-event viewer: three recurring church services.
 * Configure URLs using Pages CMS > Live Service Links (All 3 Services).
 * The separate content/livestream.json settings from the earlier release remain supported.
 */
(() => {
  'use strict';
  const player = document.getElementById('vimeo-player');
  const openButton = document.getElementById('watch-vimeo-button');
  const message = document.getElementById('watch-message');
  const picker = document.getElementById('service-picker');
  const buttons = document.getElementById('service-picker-buttons');
  const current = document.getElementById('service-current');
  const status = document.getElementById('player-status');
  if (!player || !openButton || !picker || !buttons) return;

  function parseUrl(input) {
    if (typeof input !== 'string' || !input.trim()) return null;
    let v=input.trim();
    const match=v.match(/<iframe[^>]+\bsrc\s*=\s*(["'])(.*?)\1/i);
    if (match) v=match[2].replace(/&amp;/g,'&');
    try {
      const url=new URL(v);
      if (url.protocol !== 'https:') return null;
      if (!['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(url.hostname)) return null;
      return url;
    } catch (_) {return null;}
  }
  function viewerUrl(input) {
    const u=parseUrl(input); if(!u) return null;
    if(u.hostname === 'player.vimeo.com') {
      const m=u.pathname.match(/^\/video\/(\d+)$/); return m ? 'https://vimeo.com/'+m[1] : null;
    }
    if(/^\/(event\/\d+|\d+(?:\/[a-zA-Z0-9]+)?)(?:\/embed)?\/?$/.test(u.pathname)) {
      const v=new URL(u.href);v.pathname=v.pathname.replace(/\/embed\/?$/,'');return v.href;
    }
    return u.href;
  }
  function embedUrl(input) {
    const u=parseUrl(input); if(!u) return null;
    let m;
    if(u.hostname==='player.vimeo.com'&&/^\/video\/\d+$/.test(u.pathname))return u.href;
    m=u.pathname.match(/^\/event\/(\d+)(?:\/embed)?\/?$/);
    if(m) {
      const v=new URL('https://vimeo.com/event/'+m[1]+'/embed');
      ['h','autoplay','muted'].forEach(k=>{if(u.searchParams.has(k))v.searchParams.set(k,u.searchParams.get(k));});
      return v.href;
    }
    m=u.pathname.match(/^\/(\d+)(?:\/([a-zA-Z0-9]+))?\/?$/);
    if(m) {
      const v=new URL('https://player.vimeo.com/video/'+m[1]);
      if(m[2])v.searchParams.set('h',m[2]);
      if(u.searchParams.has('h'))v.searchParams.set('h',u.searchParams.get('h'));
      return v.href;
    }
    return null;
  }
  function describe(service) {return service.label + ' on Vimeo';}
  function selectService(services, id) {
    const service=services.find(s=>s.id===id); if(!service) return;
    for(const btn of buttons.querySelectorAll('button[data-service]')) {
      btn.setAttribute('aria-pressed',String(btn.dataset.service===id));
    }
    if(current){current.hidden=false;current.textContent='Now selected: '+service.label;}
    if(message) message.textContent='Select play to watch '+service.label+'. If the video is unavailable, choose Open on Vimeo.';
    const url=viewerUrl(service.url)||viewerUrl(service.embed);
    openButton.hidden=!url;
    if(url){openButton.href=url;openButton.textContent='Open '+service.label+' on Vimeo ↗';}
    const src=embedUrl(service.embed)||embedUrl(service.url);
    if(src){
      const iframe=document.createElement('iframe');
      iframe.src=src;iframe.title=describe(service);iframe.loading='lazy';
      iframe.allow='autoplay; fullscreen; picture-in-picture; encrypted-media';
      iframe.referrerPolicy='strict-origin-when-cross-origin';
      iframe.setAttribute('allowfullscreen','');
      player.replaceChildren(iframe);
    } else {
      const div=document.createElement('div');div.className='player-placeholder';
      const h=document.createElement('h3');h.textContent='Watch '+service.label;
      const p=document.createElement('p');p.textContent='Select Open on Vimeo to view this service.';
      div.append(h,p);player.replaceChildren(div);
    }
  }
  function render(links, legacy) {
    const config=links && typeof links==='object' ? links : {};
    const old=legacy && typeof legacy==='object' ? legacy : {};
    const all=[
      {id:'school',label:'Sunday School • 9:30 AM',url:config.sunday_school_url,embed:config.sunday_school_embed},
      {id:'worship',label:'Sunday Morning Worship • 11:00 AM',url:config.sunday_worship_url||old.vimeo_url,embed:config.sunday_worship_embed||old.embed_url},
      {id:'wednesday',label:'Wednesday Night Bible Study • 6:30 PM',url:config.wednesday_url,embed:config.wednesday_embed}
    ];
    const services=all.filter(s=>viewerUrl(s.url)||embedUrl(s.embed));
    if(!services.length){if(status)status.textContent='The church Vimeo links have not been added yet.';return;}
    buttons.replaceChildren();picker.hidden=false;
    for(const service of services){
      const btn=document.createElement('button');btn.type='button';btn.className='service-choice';
      btn.dataset.service=service.id;btn.textContent=service.label;btn.setAttribute('aria-pressed','false');
      btn.addEventListener('click',()=>selectService(services,service.id));
      buttons.appendChild(btn);
    }
    // Choose the right service automatically in Eastern Time. Visitors can always switch.
    let weekday='', clockHour=0, clockMinute=0;
    try {
      const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'long',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
      const fields=Object.fromEntries(parts.map(({type,value})=>[type,value]));
      weekday=fields.weekday; clockHour=Number(fields.hour)%24; clockMinute=Number(fields.minute);
    } catch (_) { /* fall back to worship */ }
    const minutes=clockHour*60+clockMinute;
    let preferred='worship';
    if(weekday==='Wednesday') preferred='wednesday';
    if(weekday==='Sunday' && minutes<10*60+45) preferred='school';
    selectService(services,services.some(s=>s.id===preferred)?preferred:services[0].id);
  }
  async function fetchJson(path) {
    try {const r=await fetch(path,{cache:'no-cache'});if(!r.ok)return null;return await r.json();}
    catch(_){return null;}
  }
  if(window.VSCOG_LIVE_PREVIEW){render(window.VSCOG_SERVICE_LINKS_PREVIEW||null,window.VSCOG_LIVE_PREVIEW);return;}
  Promise.all([fetchJson('../content/service-links.json'),fetchJson('../content/livestream.json')])
    .then(([links,old])=>render(links,old));
})();
