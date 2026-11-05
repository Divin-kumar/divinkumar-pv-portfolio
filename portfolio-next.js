
/* Personal PV portfolio. Static, read-only, no analytics or external data requests. */
(() => {
 'use strict';
 const $=(selector,scope=document)=>scope.querySelector(selector);
 const $$=(selector,scope=document)=>[...scope.querySelectorAll(selector)];
 const root=document.documentElement;
 const storage={get:key=>{try{return localStorage.getItem(key)}catch{return null}},set:(key,value)=>{try{localStorage.setItem(key,value)}catch{}}};
 const systemReduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const motionAllowed=()=>root.dataset.motion!=='off'&&!systemReduced.matches;
 const copy=async value=>{
   if(!navigator.clipboard?.writeText){toast('Clipboard is unavailable');return}
   try{await navigator.clipboard.writeText(value);toast('Copied to clipboard')}
   catch{toast('Clipboard permission was not granted')}
 };
 let toastTimer=0;
 const toast=message=>{
   const node=$('#toast');if(!node)return;
   node.textContent=message;node.classList.add('show');
   clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('show'),2800);
 };
 // Theme & motion preferences.
 function setTheme(value){
   const theme=value==='light'?'light':'dark';
   root.dataset.theme=theme;
   const btn=$('#themeToggle');
   if(btn){
     btn.setAttribute('aria-label',theme==='dark'?'Switch to light theme':'Switch to dark theme');
     btn.title=btn.getAttribute('aria-label');
     const graphic=$('svg',btn);
     if(graphic)graphic.innerHTML=theme==='dark'
       ? '<path d="M20.5 15A9 9 0 0 1 9 3.5 9 9 0 1 0 20.5 15Z"/>'
       : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>';
   }
 }
 setTheme(storage.get('pv-studio-theme')==='light'?'light':'dark');
 $('#themeToggle')?.addEventListener('click',()=>{const next=root.dataset.theme==='dark'?'light':'dark';setTheme(next);storage.set('pv-studio-theme',next)});
 function setMotion(off){
   root.dataset.motion=off?'off':'on';
   const btn=$('#motionToggle');
   if(btn){btn.setAttribute('aria-pressed',String(off));btn.setAttribute('aria-label',off?'Enable animations':'Reduce animations');btn.title=btn.getAttribute('aria-label')}
 }
 setMotion(storage.get('pv-studio-motion')==='off'||(storage.get('pv-studio-motion')!=='on'&&systemReduced.matches));
 $('#motionToggle')?.addEventListener('click',()=>{const off=root.dataset.motion!=='off';setMotion(off);storage.set('pv-studio-motion',off?'off':'on');toast(off?'Reduced motion enabled':'Animations enabled')});
 // Navigation & progress.
 const nav=$('#navLinks');const menu=$('#menuToggle');
 const closeMenu=()=>{nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false')};
 menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
 $$('#navLinks a').forEach(a=>a.addEventListener('click',closeMenu));
 const sections=$$('main section[id]');
 const anchors=$$('#navLinks a[href^="#"]');
 let ticking=false;
 function reading(){
   ticking=false;
   const p=window.scrollY+window.innerHeight*.35;
   let active=sections[0];
   sections.forEach(s=>{if(s.offsetTop<=p)active=s});
   anchors.forEach(a=>{
     if(active&&a.hash==='#'+active.id)a.setAttribute('aria-current','location');
     else a.removeAttribute('aria-current');
   });
   const max=document.documentElement.scrollHeight-window.innerHeight;
   const line=$('#scrollLine');
   if(line)line.style.width=(max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0)+'%';
 }
 window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(reading)}},{passive:true});
 window.addEventListener('resize',reading,{passive:true});
 reading();
 // Reveal only once, with a fully readable no-JavaScript fallback.
 root.classList.add('js-enabled');
 if('IntersectionObserver' in window){
   const observer=new IntersectionObserver(entries=>{
     entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');observer.unobserve(e.target)}})
   },{threshold:.08,rootMargin:'0px 0px 40px 0px'});
   $$('.reveal').forEach(el=>observer.observe(el));
 }else $$('.reveal').forEach(el=>el.classList.add('in'));
 if(!motionAllowed())$$('.reveal').forEach(el=>el.classList.add('in'));
 // Workstream filters and evidence disclosures.
 const filterButtons=$$('.filter[data-filter]');
 const cards=$$('.work-card[data-category]');
 function applyFilter(category){
   let count=0;
   cards.forEach(card=>{
     const match=category==='all'||card.dataset.category.split(' ').includes(category);
     card.hidden=!match;
     if(match)count++;
   });
   filterButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===category)));
   const result=$('#filterCount');
   if(result)result.textContent=String(count).padStart(2,'0')+' practice areas';
 }
 filterButtons.forEach(button=>button.addEventListener('click',()=>applyFilter(button.dataset.filter)));
 applyFilter('all');
 $$('.detail-toggle').forEach(button=>{
   const target=document.getElementById(button.getAttribute('aria-controls'));
   if(!target)return;
   button.addEventListener('click',()=>{
     const opening=target.hidden;
     target.hidden=!opening;
     button.setAttribute('aria-expanded',String(opening));
   });
 });
 // Selectable expertise explorer, with explicit level labels.
 const capabilities={
  argus:{index:'01 / 06',name:'Oracle Argus Safety',description:'L2 application support with backend checks around case lifecycle and E2B report generation. Investigation has included failed or stalled transmissions and the validation of reporting metadata.',tags:['E2B R2/R3','Case lifecycle','SQL checks','Reporting'],example:'Representative approach: inspect the transmission symptom, compare permitted records and statuses, identify missing context, then document a verified next action.'},
  axway:{index:'02 / 06',name:'Axway Gateway',description:'Operational support for safety-data exchange, acknowledgments and integration troubleshooting alongside Oracle Argus Safety.',tags:['XML','ACK','Gateway support','Technical follow-up'],example:'Representative approach: distinguish a generation problem from a transport or acknowledgment issue before escalating with evidence.'},
  halopv:{index:'03 / 06',name:'HaloPV',description:'Lead-support experience across PV workflows and current involvement in service requests, access administration, workflow support and reconciliation-related operations.',tags:['Workflow support','User access','Reconciliation','Operations'],example:'Representative approach: understand the business stage, confirm the authorized request, review current state and coordinate the appropriate follow-up.'},
  empirica:{index:'04 / 06',name:'Empirica Signal / Topics',description:'Production-support experience with pharmacovigilance signal-management applications, including operational troubleshooting and coordination.',tags:['Signal workflows','Application support','Incident triage'],example:'Representative approach: understand the reported workflow behavior, review approved evidence and coordinate with the relevant technical and business owners.'},
  dictionary:{index:'05 / 06',name:'Dictionaries & validation',description:'Experience supporting MedDRA, WHO-Drug and JDrug dictionary updates in Argus, with test-case execution and case recoding during upgrade activities.',tags:['MedDRA','WHO-Drug','JDrug','TCQ','Upgrades'],example:'Representative approach: evaluate change impact, check approved test evidence and validate expected behavior following dictionary or application updates.'},
  sql:{index:'06 / 06',name:'SQL, quality & documentation',description:'SQL-backed troubleshooting, GxP-controlled documentation and supporting validation processes. PL/SQL and reporting automation remain areas of continuing development.',tags:['SQL','GDRS','CodeBeamer','TCQ','PL/SQL learning'],example:'Representative approach: use approved read-only data checks, describe findings clearly and preserve traceability in supporting technical documents.'}
 };
 const domainButtons=$$('.domain-button[data-domain]');
 const display=$('#domainDisplay');
 function renderDomain(key){
   const item=capabilities[key];
   if(!item||!display)return;
   domainButtons.forEach(button=>{
     const active=button.dataset.domain===key;
     button.setAttribute('aria-selected',String(active));
     button.tabIndex=active?0:-1;
     if(active)display.setAttribute('aria-labelledby',button.id);
   });
   $('#domainIndex').textContent=item.index;
   $('#domainName').textContent=item.name;
   $('#domainDescription').textContent=item.description;
   $('#domainExample').textContent=item.example;
   $('#domainWatermark').textContent=item.index.slice(0,2);
   const tags=$('#domainTags');tags.replaceChildren();
   item.tags.forEach(label=>{const span=document.createElement('span');span.className='tag';span.textContent=label;tags.append(span)});
   if(motionAllowed()){
     display.classList.remove('is-changing');
     void display.offsetWidth;
     display.classList.add('is-changing');
   }
 }
 domainButtons.forEach((button,i)=>{
   button.addEventListener('click',()=>renderDomain(button.dataset.domain));
   button.addEventListener('keydown',event=>{
     const next=event.key==='ArrowDown'?(i+1)%domainButtons.length:event.key==='ArrowUp'?(i+domainButtons.length-1)%domainButtons.length:null;
     if(next!==null){event.preventDefault();domainButtons[next].focus();renderDomain(domainButtons[next].dataset.domain)}
   });
 });
 renderDomain('argus');
 // Copy professional summary, no internal ticket details.
 $('#copyIntro')?.addEventListener('click',()=>copy('Divinkumar Sundaramoorthi | Pharmacovigilance Techno-Functional Analyst | PV application operations, Oracle Argus Safety, HaloPV, Empirica, Axway, SQL, E2B/XML troubleshooting, validation and IT service management.'));
 $('#copyEmail')?.addEventListener('click',()=>copy('divinkumar67@gmail.com'));
 $('#printProfile')?.addEventListener('click',()=>window.print());
 // Command palette. Keyboard-first, no invisible focusable controls.
 const dialog=$('#commandPalette');
 const search=$('#commandSearch');
 const commands=$$('.palette-link[data-target]');
 function filterCommands(value){
   const q=value.trim().toLowerCase();
   let visible=0;
   commands.forEach(item=>{item.hidden=!item.textContent.toLowerCase().includes(q);if(!item.hidden)visible++});
   const empty=$('#paletteEmpty');if(empty)empty.hidden=visible>0;
 }
 function openPalette(){
   if(!dialog)return;
   if(typeof dialog.showModal==='function'&&!dialog.open)dialog.showModal();
   else dialog.setAttribute('open','');
   if(search){search.value='';filterCommands('');search.focus()}
 }
 function closePalette(){
   if(!dialog)return;
   if(typeof dialog.close==='function'&&dialog.open)dialog.close();
   else dialog.removeAttribute('open');
 }
 $('#commandOpen')?.addEventListener('click',openPalette);
 $('#commandClose')?.addEventListener('click',closePalette);
 search?.addEventListener('input',()=>filterCommands(search.value));
 search?.addEventListener('keydown',event=>{
   if(event.key==='Enter'){const first=commands.find(item=>!item.hidden);if(first){event.preventDefault();first.click()}}
   if(event.key==='ArrowDown'){const first=commands.find(item=>!item.hidden);if(first){event.preventDefault();first.focus()}}
 });
 commands.forEach(item=>{
   item.addEventListener('click',()=>{
     closePalette();
     const target=document.querySelector(item.dataset.target);
     if(target)target.scrollIntoView({behavior:motionAllowed()?'smooth':'auto',block:'start'});
   });
   item.addEventListener('keydown',event=>{
     if(event.key!=='ArrowDown'&&event.key!=='ArrowUp')return;
     event.preventDefault();
     const eligible=commands.filter(node=>!node.hidden);
     const index=eligible.indexOf(item);
     eligible[(index+(event.key==='ArrowDown'?1:-1)+eligible.length)%eligible.length]?.focus();
   });
 });
 dialog?.addEventListener('click',event=>{if(event.target===dialog)closePalette()});
 document.addEventListener('keydown',event=>{
   const editable=event.target instanceof HTMLElement&&event.target.matches('input,textarea,select,[contenteditable=true]');
   if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();dialog?.open?closePalette():openPalette()}
   else if(event.key==='/'&&!editable&&!dialog?.open){event.preventDefault();openPalette()}
   else if(event.key==='Escape'){closePalette();closeMenu()}
 });
})();
