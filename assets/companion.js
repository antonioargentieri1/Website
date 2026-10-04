'use strict';
document.querySelectorAll('audio').forEach(audio=>{
  const title=audio.closest('.card,.morph-card')?.querySelector('h3')?.textContent.trim();
  if(title)audio.setAttribute('aria-label',`Audio example: ${title}`);
});
document.addEventListener('play',event=>{
  if(event.target instanceof HTMLMediaElement)document.querySelectorAll('audio').forEach(audio=>{if(audio!==event.target)audio.pause();});
},true);
