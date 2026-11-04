import inter from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url';
import barlow from '@fontsource/barlow-condensed/files/barlow-condensed-latin-800-normal.woff2?url';
import nunito from '@fontsource-variable/nunito/files/nunito-latin-wght-normal.woff2?url';
import devanagari from '@fontsource-variable/noto-sans-devanagari/files/noto-sans-devanagari-devanagari-wght-normal.woff2?url';
import devanagariLatin from '@fontsource-variable/noto-sans-devanagari/files/noto-sans-devanagari-latin-wght-normal.woff2?url';
import mynerve from '@fontsource/mynerve/files/mynerve-latin-400-normal.woff2?url';
let loading:Promise<void>|undefined;
export function loadFonts(){return loading??=(async()=>{
 const set=globalThis.document?.fonts ?? (globalThis as unknown as {fonts:FontFaceSet}).fonts;
 await Promise.all([['Inter',inter,'100 900'],['Barlow Condensed',barlow,'800'],['Nunito',nunito,'200 900'],['Noto Sans Devanagari',devanagari,'100 900'],['Noto Sans Devanagari',devanagariLatin,'100 900'],['Mynerve',mynerve,'400'],['Instrument Serif','/fonts/references/instrumentserif-InstrumentSerif-Regular.ttf','400'],['Instrument Serif','/fonts/references/instrumentserif-InstrumentSerif-Italic.ttf','400','italic'],['Roboto Slab','/fonts/references/robotoslab-RobotoSlab%5Bwght%5D.ttf','100 900'],['Great Vibes','/fonts/references/greatvibes-GreatVibes-Regular.ttf','400'],['Six Caps','/fonts/references/sixcaps-SixCaps.ttf','400']].map(async([name,url,weight,style])=>{const f=new FontFace(name,`url(${url})`,{weight,style:style??'normal'});await f.load();set.add(f);}));
})();}
