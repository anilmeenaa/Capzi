import { PRESETS } from './presets';
import { readTransitions } from './motion';
import type { CaptionStyle } from './types';
export function safeStyle(value:unknown):CaptionStyle{
 const v=value as CaptionStyle;
 if(!v||!PRESETS.some(p=>p.id===v.preset)||!['Inter','Barlow Condensed','Nunito','Noto Sans Devanagari','Mynerve','Courier New','Instrument Serif','Roboto Slab','Great Vibes','Six Caps'].includes(v.font))throw new Error('Unknown caption style.');
 for(const k of ['color','accent','strokeColor'] as const)if(!/^#[a-f\d]{6}$/i.test(v[k]))throw new Error('Invalid color.');
 for(const [k,min,max] of [['size',24,100],['stroke',0,12],['shadow',0,100],['position',10,90],['strength',0,100],['grouping',1,8]] as const)if(!Number.isFinite(v[k])||v[k]<min||v[k]>max)throw new Error(`Invalid ${k}.`);
 if(v.positionX!==undefined&&(!Number.isFinite(v.positionX)||v.positionX<0||v.positionX>100))throw new Error('Invalid horizontal position.');
 for(const [key,min,max] of [['maxChars',8,120],['lines',1,3],['weight',100,900]] as const)if(v[key]!==undefined&&(!Number.isFinite(v[key])||v[key]! < min||v[key]! > max))throw new Error(`Invalid ${key}.`);
 if(v.secondaryAccent!==undefined&&!/^#[a-f\d]{6}$/i.test(v.secondaryAccent))throw new Error('Invalid secondary accent.');
 if(v.reveal&&!['single','build'].includes(v.reveal))throw new Error('Invalid word reveal.');
 if(v.align&&!['left','center','right'].includes(v.align))throw new Error('Invalid alignment.');
 if(v.background&&!/^#[a-f\d]{6}$/i.test(v.background))throw new Error('Invalid caption background.');
 if(v.mask){for(const key of ['x','y','width','height'] as const)if(!Number.isFinite(v.mask[key])||v.mask[key]<0||v.mask[key]>100)throw new Error('Invalid mask bounds.');if(!/^#[a-f\d]{6}$/i.test(v.mask.color))throw new Error('Invalid mask color.');}
 return {...v,transitions:readTransitions(v.transitions),grouping:Math.round(v.grouping),uppercase:!!v.uppercase};
}
