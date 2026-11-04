// Real preview/export regression for the new template family. Generates local test media; no ASR or network models.
import {chromium} from 'playwright-core';
import {spawn,execFileSync} from 'node:child_process';
import {writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const reference=process.env.FRAME_REFERENCE_TEMPLATES==='1',width=reference?720:360,height=reference?1280:640;
const root=new URL('../',import.meta.url).pathname,out=root+'test-results/new-template-exports';mkdirSync(out,{recursive:true});
execFileSync('ffmpeg',['-y','-v','error','-f','lavfi','-i',`color=c=0x202020:s=${width}x${height}:r=30:d=2`,'-f','lavfi','-i','sine=frequency=440:sample_rate=48000:duration=2','-c:v','libx264','-pix_fmt','yuv420p','-c:a','aac','-shortest',out+'/source.mp4']);
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4322'],{stdio:'pipe'});let browser;
const names=reference?['Film Diary','Ice Word','Momentum White','Neon Editorial']:['Uthta Glow','Bada Scale','Gradient Keyword','Haath Orange','Hara Box','Peela Marker','Gulabi Dabba','Lal Outline','Narangi Chhaya','Neon Neela','Typewriter Akshar','Dheere Glow'];
try{
 for(let i=0;i<60;i++){try{if((await fetch('http://127.0.0.1:4322')).ok)break;}catch{}await new Promise(r=>setTimeout(r,200));}
 browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});const page=await browser.newPage({viewport:{width:1440,height:1000},acceptDownloads:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4322');await page.waitForFunction(()=>document.querySelector('video')?.readyState>=2);
 let pick=page.waitForEvent('filechooser');await page.getByRole('button',{name:'Import video',exact:true}).click();await(await pick).setFiles(out+'/source.mp4');await page.getByRole('button',{name:'Close dialog',exact:true}).click();
 pick=page.waitForEvent('filechooser');await page.getByRole('button',{name:'Import SRT / VTT',exact:true}).click();await(await pick).setFiles({name:'captions.srt',mimeType:'text/plain',buffer:Buffer.from('1\n00:00:00,100 --> 00:00:01,900\nAlpha Beta Gamma\n')});await page.getByRole('textbox',{name:'Word text',exact:true}).first().waitFor();
 await page.getByRole('button',{name:'Templates',exact:true}).first().click();const results=[];
 for(const name of names.filter(n=>!process.env.FRAME_TEMPLATE_ONLY||n===process.env.FRAME_TEMPLATE_ONLY)){
  const card=page.getByRole('button',{name:new RegExp('^'+name)});await card.click();if(reference)await page.getByRole('button',{name:'Use template layout',exact:true}).click();assert.equal(await card.getAttribute('aria-pressed'),'true');
  const previews=[];
  for(const time of reference?[.3,.9,1.2,1.7]:[1.2]){
   await page.getByRole('slider',{name:'Seek video',exact:true}).fill(String(time));await page.waitForFunction(t=>{const v=document.querySelector('video');return !v.seeking&&Math.abs(v.currentTime-t)<.01;},time);await page.waitForTimeout(150);
   const canvas=page.locator('.video-frame canvas');
   if(time===1.2)writeFileSync(out+'/'+name.replaceAll(' ','-')+'-preview.png',Buffer.from(await canvas.evaluate(c=>c.toDataURL().split(',')[1]),'base64'));
   const preview=await canvas.evaluate(c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data,mask=[];for(let i=0;i<d.length;i+=4)if(Math.abs(d[i]-32)+Math.abs(d[i+1]-32)+Math.abs(d[i+2]-32)>100)mask.push(i/4);return {width:c.width,height:c.height,mask};});assert.ok(preview.mask.length>100,'empty preview '+name+' '+time);previews.push({time,...preview});
  }
  await page.getByRole('button',{name:'Export video',exact:true}).click();await page.getByRole('button',{name:'Render MP4',exact:true}).click();await page.getByRole('button',{name:'Download video',exact:true}).waitFor({timeout:180000});const event=page.waitForEvent('download');await page.getByRole('button',{name:'Download video',exact:true}).click();const path=out+'/'+name.replaceAll(' ','-')+'.mp4';await(await event).saveAs(path);
  const p=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',path],{encoding:'utf8'})),v=p.streams.find(s=>s.codec_type==='video');assert.equal(v.width,width);assert.equal(v.height,height);assert.ok(p.streams.some(s=>s.codec_type==='audio'));assert.ok(Math.abs(Number(p.format.duration)-2)<.1);execFileSync('ffmpeg',['-v','error','-i',path,'-f','null','-']);
  execFileSync('ffmpeg',['-y','-v','error','-ss','1.2','-i',path,'-frames:v','1',out+'/'+name.replaceAll(' ','-')+'-export.png']);
  const parity=[];
  for(const preview of previews){
   assert.equal(preview.width,width);assert.equal(preview.height,height);
   const rgb=execFileSync('ffmpeg',['-v','error','-ss',String(preview.time),'-i',path,'-frames:v','1','-f','rawvideo','-pix_fmt','rgb24','-'],{maxBuffer:8*1024*1024}),exportMask=new Set();for(let i=0;i<rgb.length;i+=3)if(Math.abs(rgb[i]-32)+Math.abs(rgb[i+1]-32)+Math.abs(rgb[i+2]-32)>100)exportMask.add(i/3);
   let intersection=0;for(const i of preview.mask)if(exportMask.has(i))intersection++;const union=preview.mask.length+exportMask.size-intersection,iou=intersection/union;assert.ok(iou>.8,'preview/export mismatch '+name+' '+preview.time+' '+iou);parity.push({time:preview.time,previewPixels:preview.mask.length,exportPixels:exportMask.size,iou});
  }
  results.push({name,dimensions:[v.width,v.height],audio:true,duration:Number(p.format.duration),fullyDecoded:true,parity});console.log('NEW_TEMPLATE_PASS',JSON.stringify(results.at(-1)));await page.getByRole('button',{name:'Close dialog',exact:true}).click();
 }
 assert.deepEqual(errors,[]);writeFileSync(out+'/new-template-exports.json',JSON.stringify(results,null,2));console.log('NEW_TEMPLATES_ALL_PASS');
}finally{await browser?.close();server.kill('SIGTERM');}
