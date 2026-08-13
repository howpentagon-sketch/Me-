// JS controlling scenes and animations
const toScene2 = document.getElementById('toScene2');
const toScene3 = document.getElementById('toScene3');
const openLetterBtn = document.getElementById('openLetterBtn');
const envelope = document.getElementById('envelope');
const letter = document.getElementById('letter');
const acceptBtn = document.getElementById('acceptBtn');
const scene1 = document.getElementById('scene1');
const scene2 = document.getElementById('scene2');
const scene3 = document.getElementById('scene3');
const final = document.getElementById('final');
const floatingHearts = document.getElementById('floating-hearts');
const typeText = document.getElementById('typeText');

// Helper: switch scenes with gentle animation
function switchScene(from, to){
  from.classList.remove('active');
  // small delay to let CSS transition
  setTimeout(()=> to.classList.add('active'),120);
}

// seed some floating hearts (background subtle)
function seedFloatingHearts(){
  const count = 8;
  for(let i=0;i<count;i++){
    const h = document.createElement('div');
    h.className = 'heart';
    const size = 10 + Math.random()*30;
    h.style.width = `${size}px`;
    h.style.height = `${size}px`;
    h.style.left = `${Math.random()*100}vw`;
    h.style.top = `${60+Math.random()*40}vh`;
    h.style.opacity = (0.3+Math.random()*0.7).toFixed(2);
    h.style.transform = 'rotate(-45deg)';
    const dur = 18 + Math.random()*22;
    h.style.animation = `floatUp ${dur}s linear ${-Math.random()*10}s infinite`;
    floatingHearts.appendChild(h);
  }
}
seedFloatingHearts();

// Scene1: initial animations already handled by CSS. Button to go to scene2
toScene2.addEventListener('click', ()=>{
  // gentle pop animation
  toScene2.animate([{transform:'scale(1)'},{transform:'scale(0.98)'},{transform:'scale(1)'}],{duration:280});
  switchScene(scene1, scene2);
  startTyping();
});

// Typewriter effect for scene2 text
const phrase = 'Все 217 дней моя любовь к тебе становилась только сильнее.';
function startTyping(){
  typeText.classList.add('show');
  typeText.textContent = '';
  let i=0;
  const speed = 40;
  const typed = setInterval(()=>{
    if(i<phrase.length){
      typeText.textContent += phrase[i++];
      // occasionally create tiny hearts near text
      if(Math.random() < 0.04){floatingHeartBurst(typeText)}
    } else {
      clearInterval(typed);
      // reveal button after pause
      setTimeout(()=>{
        toScene3.classList.add('visible');
        toScene3.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:700,fill:'forwards'});
      },600);
    }
  },speed);
}

// small floating heart near element
function floatingHeartBurst(anchor){
  const rect = anchor.getBoundingClientRect();
  const h = document.createElement('div');
  h.className = 'heart';
  h.style.left = `${rect.left + rect.width/2 + (Math.random()*40-20)}px`;
  h.style.top = `${rect.top + (Math.random()*20-10)}px`;
  const size = 8 + Math.random()*16;
  h.style.width = `${size}px`;
  h.style.height = `${size}px`;
  h.style.opacity = 1;
  document.body.appendChild(h);
  const dur = 2000 + Math.random()*1500;
  h.animate([
    {transform:'translateY(0) scale(1) rotate(-45deg)',opacity:1},
    {transform:`translateY(-120px) scale(.8) rotate(-10deg)`,opacity:0}
  ],{duration:dur,easing:'ease-out'});
  setTimeout(()=>h.remove(),dur+100);
}

// toScene3 click handler
toScene3.addEventListener('click', ()=>{
  toScene3.animate([{transform:'translateY(0)'},{transform:'translateY(-6px)'},{transform:'translateY(0)'}],{duration:260});
  switchScene(scene2, scene3);
  // small delay for envelope reveal
  setTimeout(()=>{
    // show envelope with subtle bounce
    const env = document.getElementById('envelope');
    env.animate([{transform:'translateY(14px)'},{transform:'translateY(0)'}],{duration:600,easing:'cubic-bezier(.2,.9,.2,1)'});
  },360);
});

// Open letter flow
openLetterBtn.addEventListener('click', ()=>{
  // reveal envelope area
  scene3.querySelector('.envelope-wrap').scrollIntoView({behavior:'smooth',block:'center'});
  // little attention animation
  envelope.animate([{transform:'scale(1)'},{transform:'scale(1.04)'},{transform:'scale(1)'}],{duration:480});
  setTimeout(()=> envelope.classList.add('pulse'),120);
  setTimeout(()=>{
    envelope.classList.add('open');
    // reveal letter
    setTimeout(()=>{
      letter.classList.add('visible');
      // add tiny hearts
      for(let i=0;i<6;i++)floatingHeartBurst(letter);
    },600);
  },420);
});

// Also allow clicking the envelope directly
envelope.addEventListener('click', ()=>{
  if(!envelope.classList.contains('open')){
    envelope.classList.add('open');
    setTimeout(()=>{
      letter.classList.add('visible');
      for(let i=0;i<6;i++)floatingHeartBurst(letter);
    },520);
  }
});

// Accept button
acceptBtn.addEventListener('click', ()=>{
  acceptBtn.animate([{transform:'scale(1)'},{transform:'scale(.98)'},{transform:'scale(1)'}],{duration:240});
  // final celebration
  final.classList.add('show');
  // small heart shower
  showerHearts();
  // lighten background
  document.body.animate([{filter:'brightness(1)'},{filter:'brightness(1.05)'}],{duration:800,fill:'forwards'});
});

// Heart shower
function showerHearts(){
  const total = 24;
  for(let i=0;i<total;i++){
    const h = document.createElement('div');
    h.className = 'heart';
    const size = 8 + Math.random()*36;
    h.style.width = `${size}px`;
    h.style.height = `${size}px`;
    h.style.left = `${20 + Math.random()*60}vw`;
    h.style.top = `${80 + Math.random()*20}vh`;
    h.style.opacity = 0.95;
    document.body.appendChild(h);
    const duration = 2500 + Math.random()*2000;
    h.animate([
      {transform:`translateY(0) rotate(-45deg) scale(1)`, opacity:1},
      {transform:`translateY(-200vh) rotate(-10deg) scale(.9)`, opacity:0}
    ],{duration, easing:'cubic-bezier(.2,.9,.2,1)'});
    setTimeout(()=>h.remove(), duration+120);
  }
}

// small continuous drift hearts added near important elements
function seedTinyHearts(){
  const anchor = document.querySelector('.center-card');
  for(let i=0;i<3;i++){
    setTimeout(()=>floatingHeartBurst(anchor), 600*i + 300);
  }
}
seedTinyHearts();

// Accessibility: allow Enter to open envelope when focused
envelope.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') envelope.click(); });

// ensure typewriter doesn't start immediately if scene2 not active
// When loaded, keep scene1 active; subtitle animation
window.addEventListener('load', ()=>{
  // reveal subtitle after title animation
  const subtitle = scene1.querySelector('.subtitle');
  setTimeout(()=>{subtitle.style.opacity = '1'; subtitle.style.transform = 'none';},700);
});
