import type {CaptionStyle,Word} from './types';
import {resolveTemplateStyles} from './template-overrides';
// Choose display tokens using real timestamps; recovered segments remain intact.
export function referenceLook(words:Word[],base:CaptionStyle,time:number){
 const resolved=resolveTemplateStyles(words,base),s=resolved.style;
 let group=words,styles=resolved.styles;
 if(!styles&&s.reveal==='single')group=words.filter(w=>time>=w.start&&time<w.end);
 if(!styles&&s.reveal==='build')group=words.filter(w=>time>=w.start);
 const rows=new Set<number>();
 if(!styles&&s.preset==='cutee'&&(s.lines??2)>=2&&group.length>=3)rows.add(Math.ceil(group.length/2));
 if(!styles&&s.preset==='reelstack'&&group.length){
  const marked=words.findIndex(w=>w.emphasis),key=marked>=0?marked:Math.floor(words.length/2);
  if((s.lines??2)>=3){rows.add(key);rows.add(key+1);}
  styles=group.map((_,i)=>({...s,font:i===key?s.font:'Great Vibes',weight:i===key?800:400,size:i===key?s.size:s.size*.65,italic:false,uppercase:i===key,color:i===key?s.accent:s.color,accent:i===key?s.accent:s.color,reveal:undefined}));
 }
 // Split the complete phrase into stable typographic runs. Future tokens do
 // not change roles as they appear, and no transcript/timestamp is rewritten.
 if(!styles&&s.preset==='reelcontrast'&&group.length){
  const intro=Math.max(1,Math.ceil(words.length/3)),last=words.length-1;
  if((s.lines??2)>=3){rows.add(intro);if(last>intro)rows.add(last);}
  styles=group.map((_,i)=>{
   const opening=i<intro,ending=!opening&&i===last&&last>intro;
   const color=opening?s.color:ending?(s.secondaryAccent??'#21bf8e'):s.accent;
   return {...s,font:opening?'Great Vibes' as const:ending?'Roboto Slab' as const:s.font,weight:opening?400:ending?700:(s.weight??800),size:s.size*(opening?1.1:ending?.85:1),italic:false,uppercase:!opening,color,accent:color,reveal:undefined};
  });
 }
 return {group,style:s,styles,rows,key:group.map(w=>w.id+':'+w.text).join('|')};
}
