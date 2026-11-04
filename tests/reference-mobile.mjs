// New reference presets in actual mobile sheets; no recognition model is loaded.
import {chromium,devices} from 'playwright-core';
import {spawn} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url).pathname,base='http://127.0.0.1:4355';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4355','--strictPort'],{cwd:root,stdio:'pipe'});let browser;
try{
 for(let i=0;i<100;i++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(r=>setTimeout(r,200));}
 browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});const errors=[];
 for(const viewport of [devices['Pixel 7'],{viewport:{width:360,height:740},isMobile:true,hasTouch:true,deviceScaleFactor:1}]){
  const context=await browser.newContext(viewport),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>document.querySelector('video')?.readyState>=2);
  await page.getByRole('button',{name:'Templates',exact:true}).first().click();
  for(const name of ['Tall Paper','Frost Punch','Scarlet Script']){
   const card=page.getByRole('button',{name:new RegExp('^'+name)});await card.click();assert.equal(await card.getAttribute('aria-pressed'),'true');
   await page.getByRole('button',{name:'Use template layout',exact:true}).click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  }
  await page.getByRole('button',{name:'Close editing panel',exact:true}).last().click();await page.getByRole('button',{name:'Text',exact:true}).first().click();
  const color=page.getByLabel('Secondary accent color',{exact:true});assert.equal(await color.inputValue(),'#21bf8e');await color.fill('#ffee00');await page.waitForTimeout(650);
  await page.getByRole('button',{name:'Close editing panel',exact:true}).last().click();await page.getByRole('button',{name:'Undo',exact:true}).click();await page.getByRole('button',{name:'Text',exact:true}).first().click();assert.equal(await color.inputValue(),'#21bf8e');
  await page.getByRole('button',{name:'Close editing panel',exact:true}).last().click();await page.getByRole('button',{name:'Redo',exact:true}).click();await page.waitForTimeout(650);await page.reload();await page.getByRole('button',{name:'Text',exact:true}).first().click();assert.equal(await color.inputValue(),'#ffee00');
  assert.equal(await page.getByLabel('Font family',{exact:true}).locator('option').filter({hasText:'Six Caps'}).count(),1);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);mkdirSync(root+'test-results',{recursive:true});await page.screenshot({path:root+`test-results/reference-mobile-${viewport.viewport.width}.png`});await context.close();
 }
 assert.deepEqual(errors,[]);console.log('REFERENCE_MOBILE_PASS: templates, layout, secondary color, undo/redo, reload, 360px and Pixel 7');
}finally{await browser?.close();server.kill('SIGTERM');}
