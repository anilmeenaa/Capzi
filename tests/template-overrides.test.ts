import { describe,it,expect } from 'vitest';
import { applyTemplate,templateTargets,resolveTemplateStyles } from '../src/template-overrides';
import { PRESETS } from '../src/presets';
import { validateWords,groupWords } from '../src/captions';
import { playbackFailure } from '../src/playback';
const base=PRESETS[0].style,alternate=PRESETS.find(p=>p.id==='harabox')!.style;
const words=['Bhai','AI','tool','aaya'].map((text,i)=>({id:String(i),text,start:i,end:i+1}));
describe('scoped templates',()=>{
 it('expands caption selection but leaves individual word selection exact',()=>{
  const groups=[words.slice(0,2),words.slice(2)];
  expect(templateTargets(words,groups,['1'],'captions')).toEqual(['0','1']);
  expect(templateTargets(words,groups,['1'],'words')).toEqual(['1']);
  expect(templateTargets(words,groups,['deleted'],'words')).toEqual([]);
 });
 it('preserves transcript, timing, grouping and the global default',()=>{
  const next=applyTemplate(words,base,['1'],'words',alternate);
  expect(next.style).toBe(base);expect(next.words[0]).toBe(words[0]);
  expect(next.words[1].styleOverride?.preset).toBe('harabox');
  expect(next.words.map(({styleOverride,...w})=>w)).toEqual(words);
  expect(groupWords(next.words,base.grouping)).toEqual(groupWords(words,base.grouping).map(g=>g.map(w=>next.words.find(n=>n.id===w.id))));
 });
 it('retains exceptions when changing the default; does not regroup captions',()=>{
  const overridden=applyTemplate(words,base,['1'],'words',alternate);
  const next=applyTemplate(overridden.words,base,[],'all',PRESETS[5].style);
  expect(next.words).toBe(overridden.words);expect(next.style.grouping).toBe(base.grouping);
  expect(next.words[1].styleOverride?.preset).toBe('harabox');
 });
 it('validates and round-trips overrides in existing project format',()=>{
  const next=applyTemplate(words,base,['0','1'],'captions',alternate);
  expect(validateWords(JSON.parse(JSON.stringify(next.words))).map(w=>w.styleOverride?.preset)).toEqual(['harabox','harabox',undefined,undefined]);
  expect(()=>validateWords([{...words[0],styleOverride:{...alternate,preset:'bogus'}}])).toThrow();
 });
 it('resolves a uniform caption override and mixed styles with global placement',()=>{
  const next=applyTemplate(words,base,['0','1'],'captions',alternate);
  const global={...base,positionX:35,position:60};
  expect(resolveTemplateStyles(next.words.slice(0,2),global).style).toMatchObject({preset:'harabox',positionX:35,position:60});
  expect(resolveTemplateStyles(next.words,global).styles?.map(s=>s.preset)).toEqual(['harabox','harabox',base.preset,base.preset]);
 });
});
describe('playback errors',()=>{
 it('ignores interrupted playback but reports real decoder and permission failures',()=>{
  expect(playbackFailure(new DOMException('paused','AbortError'))).toBe('');
  expect(playbackFailure({code:1})).toBe('');
  expect(playbackFailure({code:3})).toContain('decoder');
  expect(playbackFailure({name:'NotAllowedError'})).toContain('tap');
  expect(playbackFailure({code:4})).toContain('H.264');
 });
});
