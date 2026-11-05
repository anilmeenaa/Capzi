import {it,expect} from 'vitest';
import {referenceLook} from '../src/reference-looks';
import {PRESETS} from '../src/presets';
import {validateWords} from '../src/captions';
const style=(id:string)=>PRESETS.find(p=>p.id===id)!.style;
const words=['the','strongest','idea'].map((text,i)=>({id:String(i),text,start:i,end:i+.8}));
it('single-word cuts respect speech and actual gaps',()=>{
 expect(referenceLook(words,style('reelice'),.5).group.map(w=>w.text)).toEqual(['the']);
 expect(referenceLook(words,style('reelice'),.9).group).toEqual([]);
 expect(referenceLook(words,style('reelice'),1.2).group.map(w=>w.text)).toEqual(['strongest']);
});
it('build reveals only spoken words, without changing timing',()=>{
 expect(referenceLook(words,style('reelbuild'),1.2).group).toEqual(words.slice(0,2));
 expect(referenceLook(words,style('reelserif'),.1).group).toEqual(words);
});
it('editorial keyword remains stable as the phrase builds',()=>{
 const early=referenceLook(words,style('reelstack'),.2),late=referenceLook(words,style('reelstack'),1.2);
 expect(early.styles![0].font).toBe('Great Vibes');expect(late.styles![0].font).toBe('Great Vibes');expect(late.styles![1].font).toBe('Barlow Condensed');
 expect(late.styles![1].color).toBe('#65ff24');
});
it('explicit emphasis chooses the stack keyword and line preference is respected',()=>{
 const w=words.map((w,i)=>({...w,emphasis:i===2}));const look=referenceLook(w,style('reelstack'),2.3);
 expect(look.styles![2].font).toBe('Barlow Condensed');expect([...look.rows]).toEqual([2,3]);
 expect(referenceLook(w,{...style('reelstack'),lines:1},2.3).rows.size).toBe(0);
});
it('recovered phrase timings are not split into guessed word times',()=>{
 const w=[{id:'segment',text:'a real phrase',start:0,end:2,timing:'segment' as const}];
 expect(referenceLook(w,style('reelice'),1).group).toEqual(w);
});
it('all new fonts and reference flags survive project validation',()=>{
 for(const id of ['reelserif','reelice','reelbuild','reelstack','reelpaper','reelcontrast','reelfrost','cutee','sitam','junoon'])expect(validateWords([{...words[0],styleOverride:style(id)}])[0].styleOverride).toMatchObject(style(id));
});

it('scarlet stack roles stay stable across progressive reveal',()=>{
 const full=referenceLook(words,style('reelcontrast'),2.3),early=referenceLook(words,style('reelcontrast'),.2);
 expect(early.styles![0]).toEqual(full.styles![0]);
 expect(full.styles!.map(s=>s.font)).toEqual(['Great Vibes','Barlow Condensed','Roboto Slab']);
 expect(full.styles!.map(s=>s.color)).toEqual(['#faf9f4','#ed1235','#21bf8e']);
 expect([...full.rows]).toEqual([1,2]);
 expect(referenceLook(words,{...style('reelcontrast'),lines:1},2.3).rows.size).toBe(0);
});
it('scarlet custom colors survive validation without changing words or times',()=>{
 const s={...style('reelcontrast'),secondaryAccent:'#ffee00'};
 expect(referenceLook(words,s,2.3).styles![2].color).toBe('#ffee00');
 expect(validateWords([{...words[0],styleOverride:s}])[0].styleOverride!.secondaryAccent).toBe('#ffee00');
 expect(()=>validateWords([{...words[0],styleOverride:{...s,secondaryAccent:'invalid'}}])).toThrow();
 expect(referenceLook(words,s,2.3).group).toEqual(words);
});
it('the second icy look respects real gaps and tall phrases build without rewriting',()=>{
 expect(referenceLook(words,style('reelfrost'),.9).group).toEqual([]);
 expect(referenceLook(words,style('reelfrost'),1.2).group).toEqual([words[1]]);
 expect(referenceLook(words,style('reelpaper'),1.2).group).toEqual(words.slice(0,2));
});

it('cutee balances two rows and respects a single-line override without changing timing',()=>{
 const look=referenceLook(words,style('cutee'),1.2);
 expect([...look.rows]).toEqual([2]);expect(look.group).toEqual(words);
 expect(referenceLook(words,{...style('cutee'),lines:1},1.2).rows.size).toBe(0);
});

it('Hindi lyric stacks keep whole Unicode words and stable rows at actual times',()=>{
 const w=['जिसे','पाना','था'].map((text,i)=>({...words[i],text}));
 const look=referenceLook(w,style('sitam'),1.2);
 expect(look.group).toEqual(w.slice(0,2));expect([...look.rows]).toEqual([1]);
 expect(referenceLook(w,{...style('sitam'),lines:1},2.3).rows.size).toBe(0);
 expect(referenceLook(w,style('junoon'),1.2).group).toEqual([w[1]]);
 expect(referenceLook(w,style('junoon'),.9).group).toEqual([]);
});
it('lyric stacking never forces more rows than requested for longer groups',()=>{
 const w=Array.from({length:8},(_,i)=>({id:String(i),text:'कहानी',start:i,end:i+1}));
 expect([...referenceLook(w,{...style('sitam'),lines:3},7.5).rows]).toEqual([3,6]);
});
