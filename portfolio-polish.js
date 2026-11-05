
/* Resume-led desktop refinement. No network calls or client-data processing. */
(() => {
  'use strict';
  const $=(q,parent=document)=>parent.querySelector(q);
  const $$=(q,parent=document)=>[...parent.querySelectorAll(q)];
  const search=$('#workSearch');
  const cards=$$('.work-card[data-category]');
  const filters=$$('.filter[data-filter]');
  const count=$('#filterCount');
  const empty=$('#workEmpty');
  const clear=$('#clearWorkSearch');
  const related=$('#domainRelated');
  const domains=$$('.domain-button[data-domain]');
  function selectedCategory(){
    return filters.find(button=>button.getAttribute('aria-pressed')==='true')?.dataset.filter||'all';
  }
  function queryMatches(card,query){
    return !query||card.textContent.toLocaleLowerCase().includes(query);
  }
  function recompute(){
    const category=selectedCategory();
    const term=search?.value.trim().toLocaleLowerCase()||'';
    let visible=0;
    cards.forEach(card=>{
      const categoryMatches=category==='all'||card.dataset.category.split(' ').includes(category);
      const show=categoryMatches&&queryMatches(card,term);
      card.hidden=!show;
      if(show)visible++;
    });
    if(count)count.textContent=String(visible).padStart(2,'0')+' '+(term?'matching':'practice')+' area'+(visible===1?'':'s');
    if(empty)empty.hidden=visible!==0;
  }
  search?.addEventListener('input',recompute);
  filters.forEach(button=>button.addEventListener('click',recompute));
  clear?.addEventListener('click',()=>{
    if(search)search.value='';
    const all=filters.find(button=>button.dataset.filter==='all');
    all?.click();
    recompute();
    search?.focus();
  });
  recompute();
  const mapping={
    argus:'integration',
    axway:'integration',
    halopv:'operations',
    empirica:'operations',
    dictionary:'quality',
    sql:'integration'
  };
  let current='argus';
  function updateRelated(key){
    current=key in mapping?key:'argus';
    const target=related;
    if(!target)return;
    const domainButton=domains.find(d=>d.dataset.domain===current);
    const name=domainButton?.querySelector('strong')?.textContent||'related work';
    target.setAttribute('aria-label','Explore work relevant to '+name);
  }
  domains.forEach(button=>button.addEventListener('click',()=>updateRelated(button.dataset.domain)));
  updateRelated('argus');
  related?.addEventListener('click',()=>{
    if(search)search.value='';
    const filter=filters.find(button=>button.dataset.filter===mapping[current]);
    filter?.click();
    recompute();
  });
  // Low-amplitude visual movement, confined to desktop hover devices.
  const fine=window.matchMedia('(min-width: 1000px) and (hover: hover) and (pointer: fine)');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const heroArt=$('#heroArt');
  const hero=$('#home');
  let pending=false,last=null;
  const allowed=()=>fine.matches&&!reduced.matches&&document.documentElement.dataset.motion!=='off';
  function resetHero(){
    heroArt?.style.removeProperty('--pointer-x');
    heroArt?.style.removeProperty('--pointer-y');
  }
  if(hero&&heroArt){
    hero.addEventListener('pointermove',event=>{
      if(!allowed())return;
      const bounds=hero.getBoundingClientRect();
      last={
        x:(event.clientX-bounds.left)/bounds.width-.5,
        y:(event.clientY-bounds.top)/bounds.height-.5
      };
      if(pending)return;
      pending=true;
      requestAnimationFrame(()=>{
        pending=false;
        if(!last||!allowed())return;
        heroArt.style.setProperty('--pointer-x',Math.max(-8,Math.min(8,last.x*16)).toFixed(1)+'px');
        heroArt.style.setProperty('--pointer-y',Math.max(-7,Math.min(7,last.y*14)).toFixed(1)+'px');
      });
    },{passive:true});
    hero.addEventListener('pointerleave',resetHero,{passive:true});
    $('#motionToggle')?.addEventListener('click',()=>{if(!allowed())resetHero()});
    if(reduced.addEventListener)reduced.addEventListener('change',()=>{if(!allowed())resetHero()});
    if(fine.addEventListener)fine.addEventListener('change',()=>{if(!allowed())resetHero()});
  }
  cards.forEach(card=>{
    card.addEventListener('pointermove',event=>{
      if(!allowed())return;
      const rect=card.getBoundingClientRect();
      card.style.setProperty('--spot-x',(event.clientX-rect.left)+'px');
      card.style.setProperty('--spot-y',(event.clientY-rect.top)+'px');
    },{passive:true});
    card.addEventListener('pointerleave',()=>{
      card.style.removeProperty('--spot-x');
      card.style.removeProperty('--spot-y');
    },{passive:true});
  });
})();
