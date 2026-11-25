/* Valley Station Church of God: monthly calendar from existing Pages CMS events.
   No new event database is needed. Uses content/events.json on the same website.
   Dates and monthly rollover follow America/New_York (Louisville) time. */
(function () {
  'use strict';
  const TZ = 'America/New_York';
  const script = document.currentScript;
  const rootURL = new URL('.', script ? script.src : location.href);
  const eventsURL = new URL('content/events.json', rootURL);
  const calendarURL = new URL('calendar/', rootURL);
  const fullRoot = document.getElementById('vscog-calendar-full');
  const eventPanel = document.querySelector('.updates-panel[aria-labelledby="events-heading"]');
  const homeRoot = eventPanel ? document.createElement('div') : null;
  if (!homeRoot && !fullRoot) return;
  if (homeRoot) { homeRoot.id = 'vscog-calendar-mini'; eventPanel.appendChild(homeRoot); }
  if (document.getElementById('vscog-monthly-calendar-style') === null) {
    const style = document.createElement('style');
    style.id = 'vscog-monthly-calendar-style';
    style.textContent = `
      .vscog-cal { --cc-navy:#0e2f45; --cc-green:#145238; --cc-gold:#c39c50; --cc-border:#d9e3e3; --cc-muted:#526776; font-family:system-ui,-apple-system,'Segoe UI',sans-serif; color:#173b4b; }
      .vscog-cal *{box-sizing:border-box}
      .vscog-cal a:focus-visible,.vscog-cal button:focus-visible{outline:3px solid #e7af3c;outline-offset:3px}
      .vscog-cal button{font:inherit;cursor:pointer}
      .vscog-cal .cc-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;flex-wrap:wrap}
      .vscog-cal .cc-month{margin:0;font-family:Georgia,serif;font-weight:700;color:var(--cc-navy);font-size:1.25rem;line-height:1.2}
      .vscog-cal .cc-actions{display:flex;align-items:center;gap:7px}
      .vscog-cal .cc-arrow,.vscog-cal .cc-today{min-width:42px;min-height:40px;background:white;color:var(--cc-navy);border:1px solid #cddada;border-radius:10px;padding:6px 10px;font-weight:700}
      .vscog-cal .cc-arrow:hover,.vscog-cal .cc-today:hover{background:#e9f3ee}
      .vscog-cal .cc-dow,.vscog-cal .cc-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px}
      .vscog-cal .cc-dow{margin-bottom:7px;color:#596b73;font-size:.73rem;font-weight:750;text-transform:uppercase;letter-spacing:.03em;text-align:center}
      .vscog-cal .cc-dow span{padding:5px 0}
      .vscog-cal .cc-day{min-width:0;min-height:40px;border:1px solid transparent;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;background:#f4f7f6;color:#304b57;text-decoration:none;font:inherit;font-weight:650;font-size:.91rem;padding:3px}
      .vscog-cal .cc-day.cc-empty{background:transparent}
      .vscog-cal .cc-day.cc-todayday{border-color:var(--cc-gold);background:#fff8e8}
      .vscog-cal .cc-day.cc-hasevent{background:#e4f1e9;color:#164f37;cursor:pointer}
      .vscog-cal .cc-day.cc-hasevent:hover{background:#cfe5d7}
      .vscog-cal .cc-dot{width:6px;height:6px;border-radius:50%;background:#bd8c39;display:inline-block}
      .vscog-cal .cc-day.cc-selected{color:white;background:#145238;border-color:#145238}
      .vscog-cal .cc-day.cc-selected .cc-dot{background:#fff0ac}
      .vscog-cal .cc-caption{margin:12px 0 0;color:var(--cc-muted);font-size:.83rem;line-height:1.5}
      .vscog-cal .cc-link{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;font-weight:750;color:white;background:var(--cc-green);padding:10px 14px;border-radius:10px;min-height:42px}
      .vscog-cal .cc-link:hover{background:#0d3b28}
      .vscog-cal .cc-mini-footer{display:flex;gap:10px;justify-content:space-between;align-items:center;margin-top:14px;flex-wrap:wrap}
      .vscog-cal.cc-mini{border-top:1px solid #dfe7e5;margin-top:16px;padding:18px 14px 3px;background:#fbfcfa;border-radius:0 0 12px 12px}
      .vscog-cal.cc-mini .cc-eyebrow{font-size:.73rem;color:#8f6d35;text-transform:uppercase;letter-spacing:.12em;font-weight:800;margin:0 0 6px}
      .vscog-cal.cc-mini .cc-grid{gap:4px}
      .vscog-cal.cc-mini .cc-day{min-height:36px;font-size:.85rem}
      .vscog-cal.cc-full{max-width:1020px;margin:0 auto;padding:26px 20px 52px}
      .vscog-cal.cc-full .cc-top{margin-bottom:18px}
      .vscog-cal.cc-full .cc-month{font-size:clamp(1.65rem,4vw,2.25rem)}
      .vscog-cal.cc-full .cc-grid{gap:8px}
      .vscog-cal.cc-full .cc-day{min-height:69px;font-size:1rem;border:1px solid #e0e7e5}
      .vscog-cal.cc-full .cc-day.cc-empty{border-color:transparent}
      .vscog-cal .cc-result{margin-top:22px;border-top:1px solid var(--cc-border);padding-top:19px}
      .vscog-cal .cc-result h2,.vscog-cal .cc-summary h2{font-family:Georgia,serif;color:var(--cc-navy);font-size:1.4rem;margin:0 0 10px}
      .vscog-cal .cc-event{background:white;border:1px solid var(--cc-border);border-left:4px solid var(--cc-gold);border-radius:12px;padding:16px;margin-top:10px;}
      .vscog-cal .cc-event h3{margin:0 0 7px;font-size:1.12rem;color:var(--cc-navy)}
      .vscog-cal .cc-event p{margin:7px 0;line-height:1.6;color:#415764}
      .vscog-cal .cc-event .cc-meta{font-size:.93rem;font-weight:650;color:#446254}
      .vscog-cal .cc-event a{color:#1a5341;font-weight:700}
      .vscog-cal .cc-summary{margin-top:26px}
      .vscog-cal .cc-summary ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}
      .vscog-cal .cc-summary li{margin:0;padding:0}
      .vscog-cal .cc-summary button{width:100%;text-align:left;display:flex;gap:12px;align-items:center;flex-wrap:wrap;background:#f4f8f6;border:1px solid var(--cc-border);border-radius:10px;padding:12px 14px;color:var(--cc-navy)}
      .vscog-cal .cc-summary button:hover{background:#e8f2eb}
      .vscog-cal .cc-summary strong{color:#125139;min-width:120px}
      .vscog-cal .cc-message{margin:8px 0;color:#526776;line-height:1.6}
      @media(max-width:500px){.vscog-cal.cc-full{padding:18px 10px 36px}.vscog-cal.cc-full .cc-grid{gap:3px}.vscog-cal.cc-full .cc-day{min-height:52px;padding:2px;font-size:.9rem}.vscog-cal .cc-dow,.vscog-cal .cc-grid{gap:3px}.vscog-cal.cc-mini{padding-left:4px;padding-right:4px}.vscog-cal.cc-mini .cc-day{min-height:31px}}
    `;
    document.head.appendChild(style);
  }

  const state = { events:[], error:false, today:churchToday(), miniView:monthOf(churchToday()), fullView:monthOf(churchToday()), selected:churchToday(), refreshedAt:0 };
  const queryDate = new URLSearchParams(location.search).get('date');
  if (fullRoot && validDate(queryDate)) { state.fullView = monthOf(queryDate);state.selected = queryDate; }
  function churchToday() {
    const p = new Intl.DateTimeFormat('en-US',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const f = k=>p.find(x=>x.type===k).value;
    return `${f('year')}-${f('month')}-${f('day')}`;
  }
  function validDate(s) {
    if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const y=Number(s.slice(0,4)), m=Number(s.slice(5,7)),d=Number(s.slice(8,10));
    const n = new Date(Date.UTC(y,m-1,d));
    return y>=1900&&y<=2200&&n.getUTCFullYear()===y&&n.getUTCMonth()===m-1&&n.getUTCDate()===d;
  }
  function monthOf(s) {return s.slice(0,7);}
  function monthLabel(s){const [y,m] = s.split('-').map(Number);return new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(y,m-1,1)));}
  function dayLabel(s){const [y,m,d] = s.split('-').map(Number);return new Intl.DateTimeFormat('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(y,m-1,d)));}
  function nextMonth(s,delta){const [y,m]=s.split('-').map(Number);const d=new Date(Date.UTC(y,m-1+delta,1));return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}`;}
  function e(tag,cls,txt){const a=document.createElement(tag);if(cls)a.className=cls;if(txt!==undefined)a.textContent=txt;return a;}
  function btn(txt,cls,onClick,label){const b=e('button',cls,txt);b.type='button';if(label)b.setAttribute('aria-label',label);b.addEventListener('click',onClick);return b;}
  function listOn(date){return state.events.filter(x=>x.date===date);}
  function eventsIn(month){return state.events.filter(x=>x.date.startsWith(month)).sort((a,b)=>a.date.localeCompare(b.date)||a.title.localeCompare(b.title));}
  function normalize(raw){
    if(!Array.isArray(raw))return [];
    return raw.filter(x=>x&&typeof x==='object'&&validDate(x.date)&&typeof x.title==='string'&&x.title.trim()).map(x=>({date:x.date,title:x.title.trim(),time:String(x.time||'').trim(),place:String(x.place||'').trim(),details:String(x.details||'').trim(),image:String(x.image||'').trim()})).sort((a,b)=>a.date.localeCompare(b.date));
  }
  const preview=window.VSCOG_CALENDAR_PREVIEW_EVENTS;
  async function load(){
    try{
      if(Array.isArray(preview)){state.events=normalize(preview);state.error=false;}
      else {const response=await fetch(eventsURL.href,{cache:'no-cache'});if(!response.ok)throw Error('Event list unavailable');state.events=normalize(await response.json());state.error=false;}
    }catch(_err){state.error=true;state.events=[];}
    state.refreshedAt=Date.now();renderAll();
  }
  function controls(root,which){
    const v=which==='mini'?state.miniView:state.fullView;
    const top=e('div','cc-top');
    const headline=e('h2','cc-month',monthLabel(v));
    headline.setAttribute('aria-live','polite');
    const nav=e('div','cc-actions');
    const change=delta=>{const now=which==='mini'?state.miniView:state.fullView;const newMonth=nextMonth(now,delta);if(which==='mini')state.miniView=newMonth;else{state.fullView=newMonth;state.selected=`${newMonth}-01`;}renderAll();};
    nav.append(btn('‹','cc-arrow',()=>change(-1),'Previous month'),btn('›','cc-arrow',()=>change(1),'Next month'));
    if(which==='full')nav.append(btn('Today','cc-today',()=>{state.fullView=monthOf(state.today);state.selected=state.today;renderAll();},'Return to current month'));
    top.append(headline,nav);root.append(top);
  }
  function calendarGrid(root,which){
    const month=which==='mini'?state.miniView:state.fullView;
    const [y,m]=month.split('-').map(Number);
    const dayHeader=e('div','cc-dow');
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(x=>dayHeader.append(e('span','',x)));
    const grid=e('div','cc-grid');
    const start=new Date(Date.UTC(y,m-1,1)).getUTCDay();
    const count=new Date(Date.UTC(y,m,0)).getUTCDate();
    for(let k=0;k<start;k++)grid.append(e('span','cc-day cc-empty'));
    for(let d=1;d<=count;d++){
      const date=`${month}-${String(d).padStart(2,'0')}`;
      const matched=listOn(date);
      const dateIsToday=date===state.today;
      const selected=which==='full'&&date===state.selected;
      const cls='cc-day'+(matched.length?' cc-hasevent':'')+(dateIsToday?' cc-todayday':'')+(selected?' cc-selected':'');
      let el;
      if(which==='mini'){
        if(matched.length){el=e('a',cls);const link=new URL(calendarURL.href);link.searchParams.set('date',date);el.href=link.href;el.setAttribute('aria-label',`${dayLabel(date)}: ${matched.length} church event${matched.length===1?'':'s'}. View details`);}
        else el=e('span',cls);
      } else {el=btn('',cls,()=>{state.selected=date;renderAll();document.getElementById('vscog-selected-events')?.scrollIntoView({block:'nearest',behavior:'auto'});}, `${dayLabel(date)}. ${matched.length} event${matched.length===1?'':'s'}.`);el.setAttribute('aria-pressed',String(selected));}
      el.append(e('span','',String(d)));
      if(matched.length)el.append(e('span','cc-dot'));
      grid.append(el);
    }
    root.append(dayHeader,grid);
  }
  function mini(){
    if(!homeRoot)return;
    homeRoot.replaceChildren();homeRoot.className='vscog-cal cc-mini';
    homeRoot.append(e('div','cc-eyebrow','Church Events Calendar'));
    controls(homeRoot,'mini');
    calendarGrid(homeRoot,'mini');
    const footer=e('div','cc-mini-footer');
    footer.append(e('span','cc-caption',state.error?'Calendar events could not be loaded.':'Gold dots mark dates with events.'));
    const a=e('a','cc-link','View Full Calendar →');a.href=calendarURL.href;footer.append(a);homeRoot.append(footer);
  }
  function addCard(target,event){
    const article=e('article','cc-event');article.append(e('h3','',event.title));
    const meta=[event.time,event.place].filter(Boolean).join(' · ');
    if(meta)article.append(e('p','cc-meta',meta));
    if(event.details)article.append(e('p','',event.details));
    if(event.image){try{const link=new URL(event.image,rootURL);if(['http:','https:'].includes(link.protocol)){const a=e('a','','View event flyer ↗');a.href=link.href;a.target='_blank';a.rel='noopener noreferrer';article.append(a);}}catch(_err){}}
    target.append(article);
  }
  function full(){
    if(!fullRoot)return;
    fullRoot.replaceChildren();fullRoot.className='vscog-cal cc-full';
    controls(fullRoot,'full');
    calendarGrid(fullRoot,'full');
    const caption=e('p','cc-caption','Choose a date to see event times and details. Events are managed through the church website editor.');fullRoot.append(caption);
    const result=e('section','cc-result');result.id='vscog-selected-events';result.setAttribute('aria-live','polite');result.append(e('h2','',dayLabel(state.selected)));
    if(state.error)result.append(e('p','cc-message','We could not load the church event list. Please refresh the page to try again.'));
    else if(!listOn(state.selected).length)result.append(e('p','cc-message','No events are currently listed for this date.'));
    else listOn(state.selected).forEach(x=>addCard(result,x));
    fullRoot.append(result);
    const summary=e('section','cc-summary');summary.append(e('h2','',`Events in ${monthLabel(state.fullView)}`));
    const thisMonth=eventsIn(state.fullView);
    if(state.error)summary.append(e('p','cc-message','Events are temporarily unavailable.'));
    else if(!thisMonth.length)summary.append(e('p','cc-message','No events have been added for this month yet.'));
    else {const ul=e('ul');thisMonth.forEach(x=>{const li=e('li');const b=btn('','',()=>{state.selected=x.date;renderAll();document.getElementById('vscog-selected-events')?.scrollIntoView({block:'start',behavior:'smooth'});});b.append(e('strong','',dayLabel(x.date).replace(/, \d{4}$/,'')),e('span','',x.title+(x.time?` · ${x.time}`:'')));li.append(b);ul.append(li);});summary.append(ul);}
    fullRoot.append(summary);
  }
  function renderAll(){mini();full();}
  function tick(){
    const now=churchToday();
    if(monthOf(now)!==monthOf(state.today)){
      state.today=now;state.miniView=monthOf(now);state.fullView=monthOf(now);state.selected=now;load();
    } else if(Date.now()-state.refreshedAt>5*60*1000 && !document.hidden) load();
  }
  load();
  window.setInterval(tick,60*1000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});
})();
