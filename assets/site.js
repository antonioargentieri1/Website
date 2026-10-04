'use strict';
const labels = {
  "audioLabel": "Audio example:",
  "plotLabel": "Spectrogram:",
  "triangleFull": "equilateral triangle",
  "squareFull": "square",
  "pentagonFull": "pentagon",
  "menuOpen": "Open navigation",
  "menuClose": "Close navigation",
  "copied": "Link copied to clipboard.",
  "copyFailed": "Copy this link:"
};
let selectedSample = 'triangle';
const samples = {triangle:{audio:'triangle_equilateral.wav',image:'triangle_equilateral.png',label:'triangleFull'},square:{audio:'square.wav',image:'square.png',label:'squareFull'},pentagon:{audio:'pentagon.wav',image:'pentagon.png',label:'pentagonFull'}};
const nav = document.querySelector('#main-nav');
const menu = document.querySelector('.menu-toggle');
const audio = document.querySelector('#sample-audio');
const plot = document.querySelector('#sample-plot');
const dialog = document.querySelector('#player-dialog');
let returnFocus;
let notificationTimer;
function sampleLabels(){if(!audio||!plot)return;const name=labels[samples[selectedSample].label];audio.setAttribute('aria-label',`${labels.audioLabel} ${name}`);plot.alt=`${labels.plotLabel} ${name}`;}
function closeMenu(){nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',labels.menuOpen);}
menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',expanded);menu.setAttribute('aria-expanded',String(expanded));menu.setAttribute('aria-label',labels[expanded?'menuClose':'menuOpen']);});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
window.matchMedia('(min-width:781px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
document.querySelectorAll('[data-sample]').forEach(button=>button.addEventListener('click',()=>{audio.pause();selectedSample=button.dataset.sample;const sample=samples[selectedSample];audio.src=`polygon_demo/${sample.audio}`;plot.src=`polygon_demo/Graphs/${sample.image}`;document.querySelectorAll('[data-sample]').forEach(choice=>choice.setAttribute('aria-pressed',String(choice===button)));sampleLabels();}));
document.addEventListener('play',event=>{if(event.target instanceof HTMLMediaElement)document.querySelectorAll('audio,video').forEach(media=>{if(media!==event.target)media.pause();});},true);
document.querySelectorAll('[data-open-player]').forEach(button=>button.addEventListener('click',()=>{
  returnFocus=button;audio.pause();const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/ixNxX3ZA22g?autoplay=1&rel=0';frame.title='Hammerklavier — Antonio Argentieri';frame.allow='autoplay; encrypted-media; fullscreen; picture-in-picture';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';document.querySelector('#video-container').replaceChildren(frame);dialog.showModal();document.body.classList.add('dialog-open');
}));
document.querySelector('.close-player')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
dialog?.addEventListener('close',()=>{document.querySelector('#video-container').replaceChildren();document.body.classList.remove('dialog-open');returnFocus?.focus();});
function notify(text){const element=document.querySelector('#notification');clearTimeout(notificationTimer);element.textContent=text;element.hidden=false;notificationTimer=setTimeout(()=>element.hidden=true,4500);}
document.querySelectorAll('[data-share]').forEach(button=>button.addEventListener('click',async()=>{
  const url=new URL(location.href);url.hash=button.dataset.share;
  try{await navigator.clipboard.writeText(url.href);notify(labels.copied);}catch{notify(`${labels.copyFailed} ${url.href}`);}
}));

sampleLabels();
