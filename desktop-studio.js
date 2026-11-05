
/* Desktop Studio: public-safe interactions, activated at 1100px+ only. */
(() => {
  'use strict';
  const desktop = window.matchMedia('(min-width: 1100px)');
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)');
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)');
  const root = document.documentElement;
  const $ = (q, scope = document) => scope.querySelector(q);
  const $$ = (q, scope = document) => [...scope.querySelectorAll(q)];
  let started = false;
  let cleanups = [];
  const focusData = {
    operations: {title:'Keep PV operations moving.',copy:'Service requests, access support, workflow administration and clear ownership across the support lifecycle.',destination:'#work',filter:'operations'},
    investigation: {title:'Find the reason behind the symptom.',copy:'Combine application context, SQL-backed analysis and structured incident investigation with evidence-led communication.',destination:'#work',filter:'data'},
    quality: {title:'Make change safe and traceable.',copy:'Support validation, UAT evidence review and controlled change coordination within established quality processes.',destination:'#lab',filter:'validation'}
  };
  const focusNames=Object.keys(focusData);
  const listen=(target,event,callback,options)=>{
    target.addEventListener(event,callback,options);
    cleanups.push(()=>target.removeEventListener(event,callback,options));
  };
  const motionAllowed=()=>desktop.matches&&!reduced.matches&&root.dataset.motion!=='off';
  function scrollToSection(id){
    const section=$(id);
    if(section)section.scrollIntoView({behavior:motionAllowed()?'smooth':'auto',block:'start'});
  }
  function activate(){
    if(started||!desktop.matches)return;
    started=true;
    const focus=$('#studioFocus');
    const tabs=$$('.studio-focus-tab',focus||document);
    const title=$('#studioFocusTitle'),copy=$('#studioFocusCopy'),link=$('#studioFocusLink');
    const number=$('#studioFocusCount'),pane=$('#studioFocusPanel');
    let currentFocus='operations';
    function setFocus(key,animate=true){
      const info=focusData[key];
      if(!info||!title||!copy||!link||!pane||!number)return;
      currentFocus=key;
      tabs.forEach(tab=>{
        const selected=tab.dataset.focus===key;
        tab.setAttribute('aria-selected',String(selected));
        tab.tabIndex=selected?0:-1;
        if(selected)pane.setAttribute('aria-labelledby',tab.id);
      });
      number.textContent=String(focusNames.indexOf(key)+1).padStart(2,'0')+' / 03';
      title.textContent=info.title;
      copy.textContent=info.copy;
      link.href=info.destination;
      link.setAttribute('aria-label','Explore '+key+' work');
      if(animate&&motionAllowed()){
        pane.classList.remove('is-updating');
        void pane.offsetWidth;
        pane.classList.add('is-updating');
      }
    }
    tabs.forEach((tab,index)=>{
      listen(tab,'click',()=>setFocus(tab.dataset.focus));
      listen(tab,'keydown',event=>{
        if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
        event.preventDefault();
        let next=index;
        if(event.key==='ArrowRight')next=(index+1)%tabs.length;
        if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
        if(event.key==='Home')next=0;
        if(event.key==='End')next=tabs.length-1;
        tabs[next].focus();
        setFocus(tabs[next].dataset.focus);
      });
    });
    setFocus(currentFocus,false);
    if(link)listen(link,'click',()=>{
      const info=focusData[currentFocus];
      if(info&&info.destination==='#work'){
        const btn=$('.work-bar [data-filter="'+info.filter+'"]');
        if(btn)btn.click();
      }
    });
    const quickOptions=$$('.studio-discipline');
    quickOptions.forEach(button=>{
      listen(button,'click',()=>{
        const category=button.dataset.studioFilter;
        const target=$('.work-bar [data-filter="'+category+'"]');
        if(!target)return;
        target.click();
        quickOptions.forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
        scrollToSection('#work');
      });
    });
    $$('.work-bar .filter').forEach(button=>{
      listen(button,'click',()=>{
        quickOptions.forEach(other=>other.setAttribute('aria-pressed',String(other.dataset.studioFilter===button.dataset.filter)));
      });
    });
    const railLinks=$$('.studio-rail-link');
    const sections=$$('main section[id]');
    let ticking=false;
    function refreshRail(){
      ticking=false;
      const offset=window.scrollY+window.innerHeight*.36;
      let current='home';
      sections.forEach(section=>{if(section.offsetTop<=offset)current=section.id;});
      railLinks.forEach(anchor=>{
        if(anchor.hash==='#'+current)anchor.setAttribute('aria-current','location');
        else anchor.removeAttribute('aria-current');
      });
    }
    const onScroll=()=>{if(!ticking){ticking=true;requestAnimationFrame(refreshRail);}};
    listen(window,'scroll',onScroll,{passive:true});
    listen(window,'resize',onScroll,{passive:true});
    refreshRail();
    // Subtle depth only for precise-pointer desktop devices.
    const hero=$('#home'),visual=$('.visual',hero||document);
    if(hero&&visual&&finePointer.matches){
      let lastPointer=null,pending=false;
      const move=event=>{
        if(!motionAllowed())return;
        const bounds=hero.getBoundingClientRect();
        lastPointer={x:(event.clientX-bounds.left)/bounds.width-.5,y:(event.clientY-bounds.top)/bounds.height-.5};
        if(pending)return;
        pending=true;
        requestAnimationFrame(()=>{
          pending=false;
          if(!lastPointer)return;
          visual.style.setProperty('--portrait-shift-x',Math.max(-9,Math.min(9,lastPointer.x*18)).toFixed(1)+'px');
          visual.style.setProperty('--portrait-shift-y',Math.max(-8,Math.min(8,lastPointer.y*14)).toFixed(1)+'px');
          visual.style.setProperty('--float-lift',Math.max(-4,Math.min(4,-lastPointer.y*8)).toFixed(1)+'px');
        });
      };
      const reset=()=>{
        visual.style.removeProperty('--portrait-shift-x');
        visual.style.removeProperty('--portrait-shift-y');
        visual.style.removeProperty('--float-lift');
      };
      listen(hero,'pointermove',move,{passive:true});
      listen(hero,'pointerleave',reset,{passive:true});
      cleanups.push(reset);
    }
    if(finePointer.matches){
      $$('.work-card').forEach(card=>{
        listen(card,'pointermove',event=>{
          if(!motionAllowed())return;
          const rect=card.getBoundingClientRect();
          card.style.setProperty('--spotlight-x',(event.clientX-rect.left)+'px');
          card.style.setProperty('--spotlight-y',(event.clientY-rect.top)+'px');
        },{passive:true});
        listen(card,'pointerleave',()=>{
          card.style.removeProperty('--spotlight-x');
          card.style.removeProperty('--spotlight-y');
        },{passive:true});
      });
    }
  }
  function deactivate(){
    if(!started)return;
    cleanups.forEach(fn=>fn());
    cleanups=[];
    started=false;
  }
  const update=()=>desktop.matches?activate():deactivate();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update,{once:true});
  else update();
  if(desktop.addEventListener)desktop.addEventListener('change',update);
})();
