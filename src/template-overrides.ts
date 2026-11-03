import type { CaptionStyle, Word } from './types';
export type TemplateScope='all'|'captions'|'words';
export function templateTargets(words:Word[],groups:Word[][],selected:string[],scope:TemplateScope){
 const ids=new Set(selected);
 return (scope==='captions'?groups.filter(g=>g.some(w=>ids.has(w.id))).flat():words.filter(w=>ids.has(w.id))).map(w=>w.id);
}
export function applyTemplate(words:Word[],style:CaptionStyle,ids:string[],scope:TemplateScope,template:CaptionStyle){
 // Grouping, placement and masking belong to the project. Choosing a visual
 // template must not move words into different captions or relocate the frame.
 const next={...template,grouping:style.grouping,maxChars:style.maxChars,lines:style.lines,position:style.position,positionX:style.positionX,mask:style.mask};
 if(scope==='all')return {words,style:next};
 const targets=new Set(ids);
 return {style,words:words.map(w=>targets.has(w.id)?{...w,styleOverride:next}:w)};
}
export function wordStyle(base:CaptionStyle,override:CaptionStyle):CaptionStyle{
 return {...override,grouping:base.grouping,maxChars:base.maxChars,lines:base.lines,position:base.position,positionX:base.positionX,mask:base.mask,transitions:override.transitions??base.transitions};
}
export function resolveTemplateStyles(group:Word[],base:CaptionStyle){
 const overrides=group.map(w=>w.styleOverride);
 if(!overrides.some(Boolean))return {style:base,styles:undefined};
 // JSON projects need not preserve shared object identity.
 const first=overrides[0],key=JSON.stringify(first);
 if(first&&overrides.every(s=>JSON.stringify(s)===key))return {style:wordStyle(base,first),styles:undefined};
 return {style:base,styles:overrides.map(s=>s?wordStyle(base,s):base)};
}
