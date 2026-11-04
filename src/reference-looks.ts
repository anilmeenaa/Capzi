import type {CaptionStyle,Word} from './types';
import {resolveTemplateStyles} from './template-overrides';
// Choose display tokens using real timestamps; recovered segments remain intact.
export function referenceLook(words:Word[],base:CaptionStyle,time:number){
 const resolved=resolveTemplateStyles(words,base),s=resolved.style;
 let group=words,styles=resolved.styles;
 if(!styles&&s.reveal==='single')group=words.filter(w=>time>=w.start&&time<w.end);
 if(!styles&&s.reveal==='build')group=words.filter(w=>time>=w.start);
 const rows=new Set<number>();
 if(!styles&&s.preset==='reelstack'&&group.length){
  const marked=words.findIndex(w=>w.emphasis),key=marked>=0?marked:Math.floor(words.length/2);
  if((s.lines??2)>=3){rows.add(key);rows.add(key+1);}
  styles=group.map((_,i)=>({...s,font:i===key?s.font:'Great Vibes',weight:i===key?800:400,size:i===key?s.size:s.size*.65,italic:false,uppercase:i===key,color:i===key?s.accent:s.color,accent:i===key?s.accent:s.color,reveal:undefined}));
 }
 return {group,style:s,styles,rows,key:group.map(w=>w.id+':'+w.text).join('|')};
}
