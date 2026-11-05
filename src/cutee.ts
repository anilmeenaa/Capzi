import type {CaptionLayout} from './caption-layout';
import type {CaptionStyle} from './types';
type Context=CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D;
// Independent vector doodles; no images, emoji fonts or reference artwork.
export function drawCuteeDoodles(ctx:Context,layout:CaptionLayout,age:number,s:CaptionStyle){
 const fs=layout.fontSize,ink=layout.tokens;
 const left=Math.min(...ink.map(t=>t.x-t.halfWidth)),right=Math.max(...ink.map(t=>t.x+t.halfWidth));
 const top=Math.min(...ink.map(t=>t.y-t.halfHeight)),bottom=Math.max(...ink.map(t=>t.y+t.halfHeight));
 const pink=s.secondaryAccent??'#f59abe',a=Math.min(1,Math.max(0,age/.18));
 ctx.save();ctx.globalAlpha*=a;ctx.shadowColor='transparent';ctx.lineCap='round';
 // Small checked tape, deliberately within the layout's reserved envelope.
 ctx.save();ctx.translate(left+fs*.25,top-fs*.23);ctx.rotate(-.12);ctx.fillStyle=pink;ctx.fillRect(-fs*.32,-fs*.1,fs*.64,fs*.2);
 ctx.strokeStyle='#fffdf6';ctx.lineWidth=fs*.008;ctx.beginPath();for(let i=-3;i<=3;i++){ctx.moveTo(i*fs*.085,-fs*.1);ctx.lineTo(i*fs*.085,fs*.1);}ctx.moveTo(-fs*.32,0);ctx.lineTo(fs*.32,0);ctx.stroke();ctx.restore();
 const last=layout.lines.at(-1)!;ctx.strokeStyle=pink;ctx.lineWidth=fs*.055;ctx.beginPath();ctx.moveTo(last.x+last.width*.25,bottom+fs*.22);ctx.quadraticCurveTo(last.x+last.width*.5,bottom+fs*.15,last.x+last.width*.75,bottom+fs*.22);ctx.stroke();
 // Heart drawn as a filled path, plus three white motion marks.
 ctx.save();ctx.translate(right+fs*.27,bottom+fs*.16);const r=fs*.1*(1+Math.sin(age*5)*.06*s.strength/100);ctx.fillStyle=pink;ctx.strokeStyle='#fffdf6';ctx.lineWidth=fs*.018;ctx.beginPath();ctx.moveTo(0,r);ctx.bezierCurveTo(-r*2,-r*.2,-r,-r*1.5,0,-r*.45);ctx.bezierCurveTo(r,-r*1.5,r*2,-r*.2,0,r);ctx.fill();ctx.stroke();ctx.restore();
 ctx.strokeStyle='#fffdf6';ctx.lineWidth=fs*.025;const cy=(top+bottom)/2;ctx.beginPath();for(let i=-1;i<=1;i++){ctx.moveTo(right+fs*.22,cy+i*fs*.15);ctx.lineTo(right+fs*.38,cy+i*fs*.2);}ctx.stroke();ctx.restore();
}
