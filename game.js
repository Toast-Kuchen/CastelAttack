'use strict';
const C=CFG,$=id=>document.getElementById(id),cv=$('c'),g=cv.getContext('2d'),R=Math.random,PI=Math.PI;
const W=960,H=540,GY=440,KX0=40,KX1=160,WX0=180,WX1=270,SWV='ca2-v2';
// Drei Mauerabschnitte, Index 0 = vorderster (niedrigster), nach hinten höher
const SEG=[{x0:236,x1:270,top:GY-76},{x0:208,x1:236,top:GY-102},{x0:180,x1:208,top:GY-128}];
const sv=Object.assign({hi:0,best:1,kills:0,music:1,sfx:1,q:2,lvl:1,score:0,rk:0},(()=>{try{return JSON.parse(localStorage.getItem('ca2'))||{}}catch(e){return{}}})());
const save=()=>{try{localStorage.setItem('ca2',JSON.stringify(sv))}catch(e){}};
let S=null,mode='menu',last=0,bg=null,offTxt='⏳ Wird für die Offline-Nutzung vorbereitet – bitte einmal online vollständig laden.';
const DEMO={t:0,build:100,seg:[1,1,1],segMax:1,ga:[35,35,35],wall:1,wallMax:1,arch:2,ang:35,en:[],ar:[],fx:[],rk:[],lg:[],shake:0};
const front=s=>{for(let k=0;k<3;k++)if(s.seg[k]>0)return SEG[k];return null};
const ay=s=>{const f=front(s);return f?f.top:GY-28},fx1=s=>{const f=front(s);return f?f.x1:KX1+10};
function apos(s,i){let k=2-i;while(k<3&&s.seg[k]<=0)k++;if(k>2)return{x:196+i*20,y:GY-28};const q=SEG[k];return{x:(q.x0+q.x1)/2-(k-(2-i))*9,y:q.top}}
function aimAng(ox,oy,m){const v=C.arrow.v,G=C.arrow.g,dx=Math.max(4,m.x-ox),dy=oy-m.y,d=v**4-G*(G*dx*dx+2*dy*v*v);
 const a=d<0?45:Math.atan((v*v-Math.sqrt(d))/(G*dx))*180/PI;return Math.max(C.arrow.minAng,Math.min(C.arrow.maxAng,a))}

function resize(){const k=Math.min(innerWidth/W,innerHeight/H),d=Math.min(devicePixelRatio||1,sv.q);cv.style.width=W*k+'px';cv.style.height=H*k+'px';cv.width=Math.round(W*k*d);cv.height=Math.round(H*k*d);bg=null}
function hill(c,y,a,f){c.beginPath();c.moveTo(0,GY);for(let i=0;i<=W;i+=10)c.lineTo(i,y-Math.sin(i*f)*a-Math.sin(i*f*2.7)*a*.4);c.lineTo(W,GY);c.fill()}
function mkBg(){const o=document.createElement('canvas');o.width=cv.width;o.height=cv.height;const c=o.getContext('2d');c.setTransform(cv.width/W,0,0,cv.height/H,0,0);
 const gr=c.createLinearGradient(0,0,0,GY);gr.addColorStop(0,'#46648a');gr.addColorStop(1,'#dcb784');c.fillStyle=gr;c.fillRect(0,0,W,GY);
 c.fillStyle='#6d7f5a';hill(c,GY-70,40,.006);c.fillStyle='#55683f';hill(c,GY-25,22,.011);
 c.fillStyle='#4b3a26';c.fillRect(0,GY,W,H-GY);c.fillStyle='#5d4a30';for(let i=0;i<140;i++)c.fillRect((i*137)%W,GY+4+(i*53)%95,6,2);return o}

function waves(l,t0){const q=[];let t=t0+2;for(let i=0;i<C.count(l);i++){t+=i&&i%C.waveSize===0?C.waveGap:C.spacing*(.7+(i*7%5)/10);q.push({t,type:C.pick(l,i)})}return q}
function spawn(t){const T=C.types[t],l=S.l,hp=T.hp*C.hpMul(l);S.en.push({type:t,x:W+30,hp,max:hp,spd:T.spd*C.spdMul(l)*(.9+R()*.2),dmg:T.dmg*C.dmgMul(l),pts:T.pts,w:T.w,h:T.h,col:T.col,ph:0,atk:0,dead:0,flash:0,off:R()*30})}
function start(l,score,kills){const sm=Math.round(C.wallHp(l)/3);S={l,score,s0:score,kills,k0:kills,t:0,build:0,seg:[sm,sm,sm],segMax:sm,ga:[35,35,35],aim:null,wall:sm*3,wallMax:sm*3,lord:C.lordHp,arch:1,ang:35,cd:[0,0,0],fire:false,en:[],ar:[],fx:[],rk:[],lg:[],
 sp:{oil:C.oil.n,mang:C.mang.n,logs:C.logs.n},shots:0,hits:0,q:waves(l,0),shake:0};Object.assign(sv,{lvl:l,score,rk:kills});save();$('ov').hidden=true;$('ctl').hidden=false;mode='play'}

function puff(x,y,c,k){for(let i=0;i<(k||1);i++)S.fx.push({x,y,vx:(R()-.5)*80,vy:-R()*80-(k?0:20),life:.6+R()*.5,c,s:2+R()*4})}
function hurt(e,d){e.hp-=d;e.flash=.1;AU.hit(0);puff(e.x,GY-e.h*.6,'#a00',3);
 if(e.hp<=0){S.kills++;sv.kills++;const p=Math.round(e.pts*C.score.levelMul(S.l));S.score+=p;S.fx.push({x:e.x,y:GY-e.h-10,vx:0,vy:-30,life:1,txt:'+'+p,c:'#fe6'});AU.die()}}
function shoot(i){const s=S,a=(s.ga[i]+(R()-.5)*C.arrow.spread)*PI/180,v=C.arrow.v*(.97+R()*.06);s.ar.push({x:apos(s,i).x,y:apos(s,i).y-16,vx:Math.cos(a)*v,vy:-Math.sin(a)*v,life:1});s.shots++;AU.arrow()}
function special(k){const s=S;if(s.sp[k]<=0)return;s.sp[k]--;s.score=Math.max(0,s.score-C[k].pen);
 s.fx.push({x:fx1(s)+30,y:ay(s)-40,vx:0,vy:-25,life:1.2,txt:'−'+C[k].pen,c:'#f88'});
 if(k==='oil'){AU.oil();for(let i=0;i<40;i++)s.fx.push({x:fx1(s)+R()*C.oil.r,y:ay(s)+R()*20,vx:(R()-.2)*30,vy:R()*60+80,life:1,c:i%3?'#3a2a10':'#e90',s:4});for(const e of s.en)if(e.hp>0&&e.x<fx1(s)+C.oil.r)hurt(e,C.oil.dmg)}
 if(k==='mang'){const t=s.en.filter(e=>e.hp>0&&e.x>WX1+40).sort((a,b)=>a.x-b.x)[0];s.rk.push({x0:20,y0:GY-60,x1:Math.max(WX1+60,t?t.x-t.spd*1.3:600),t:0,T:1.3,x:20,y:GY-60});AU.thump()}
 if(k==='logs'){s.lg.push({x:fx1(s),rot:0,hit:new Set()});AU.fire()}}

function update(dt){const s=S;s.t+=dt;s.shake=Math.max(0,s.shake-dt);
 s.build=Math.min(100,s.build+(C.workers-s.arch)*C.buildRate(s.l)*dt);
 while(s.q.length&&s.q[0].t<=s.t)spawn(s.q.shift().type);
 if(!s.q.length&&s.en.filter(e=>e.hp>0).length<2)s.q=waves(s.l,s.t);
 for(let i=0;i<s.arch;i++){const o=apos(s,i);s.ga[i]=s.aim?aimAng(o.x,o.y-16,s.aim):s.ang;s.cd[i]-=dt;if(s.fire&&s.cd[i]<=0){s.cd[i]=C.arrow.cd*(.9+R()*.2);shoot(i)}}
 for(const a of s.ar){if(a.stuck){a.life-=dt;continue}a.vy+=C.arrow.g*dt;a.x+=a.vx*dt;a.y+=a.vy*dt;
  for(const e of s.en)if(e.hp>0&&Math.abs(a.x-e.x)<e.w/2&&a.y>GY-e.h&&a.y<GY){s.hits++;hurt(e,C.arrow.dmg);a.life=0;break}
  if(a.life>0&&a.y>=GY){a.y=GY;a.stuck=1;a.life=2;puff(a.x,GY,'#7a6040',2)}else if(a.x>W+50)a.life=0}
 s.ar=s.ar.filter(a=>a.life>0);
 for(const e of s.en){e.flash-=dt;if(e.hp<=0){e.dead+=dt;continue}e.ph+=dt*e.spd*.15;
  const f=front(s),tx=f?f.x1+e.w/2+e.off:KX1+e.off*.3;
  if(e.x>tx){e.x-=e.spd*dt;e.atk=0}else if((e.atk+=dt)>=C.atkRate){e.atk=.001;
   if(f){const k=SEG.indexOf(f);s.seg[k]=Math.max(0,s.seg[k]-e.dmg);s.wall=s.seg[0]+s.seg[1]+s.seg[2];s.shake=.15;AU.hit(1);puff(f.x1,GY-10-R()*(GY-f.top-10),'#999',3);
    if(s.seg[k]<=0){AU.crash();s.shake=.4;for(let i=0;i<30;i++)puff(f.x0+R()*(f.x1-f.x0),GY-R()*(GY-f.top),'#888',1)}}
   else{s.lord-=e.dmg*.5;AU.hit(2);puff(100,GY-15,'#a00',4);if(s.lord<=0)return lose()}}}
 s.en=s.en.filter(e=>e.dead<1.2);
 for(const r of s.rk){r.t+=dt;const p=Math.min(1,r.t/r.T);r.x=r.x0+(r.x1-r.x0)*p;r.y=r.y0+(GY-r.y0)*p-Math.sin(p*PI)*240;
  if(p>=1){r.done=1;AU.boom();s.shake=.3;for(let i=0;i<25;i++)puff(r.x,GY-5,i%2?'#a55':'#776',1);for(const e of s.en)if(e.hp>0&&Math.abs(e.x-r.x)<C.mang.r)hurt(e,C.mang.dmg)}}
 s.rk=s.rk.filter(r=>!r.done);
 for(const l of s.lg){l.x+=C.logs.spd*dt;l.rot+=dt*8;if(R()<.6)puff(l.x,GY-14,R()<.5?'#f80':'#fc3',0);
  for(const e of s.en)if(e.hp>0&&!l.hit.has(e)&&Math.abs(e.x-l.x)<e.w/2+12){l.hit.add(e);hurt(e,C.logs.dmg)}}
 s.lg=s.lg.filter(l=>l.x<W+40);
 for(const f of s.fx){f.x+=f.vx*dt;f.y+=f.vy*dt;if(!f.txt)f.vy+=120*dt;f.life-=dt}
 s.fx=s.fx.filter(f=>f.life>0);if(s.fx.length>400)s.fx.splice(0,s.fx.length-400);
 if(s.build>=100)win()}

function person(x,y,c,arm,sc,ph){sc=sc||1;const l=Math.sin(ph||0)*3*sc;g.fillStyle=c;g.fillRect(x-3*sc+l,y-8*sc,2*sc,8*sc);g.fillRect(x+sc-l,y-8*sc,2*sc,8*sc);g.fillRect(x-4*sc,y-18*sc,8*sc,11*sc);
 g.fillStyle='#e0b08a';g.beginPath();g.arc(x,y-21*sc,3.5*sc,0,7);g.fill();g.strokeStyle=c;g.lineWidth=2*sc;g.beginPath();g.moveTo(x,y-15*sc);g.lineTo(x+6*sc,y-15*sc+(arm||0));g.stroke();g.lineWidth=1}
function drawKeep(s){const h=200*s.build/100,top=GY-h;g.fillStyle='#7d766b';g.fillRect(KX0,top,KX1-KX0,h);g.strokeStyle='rgba(0,0,0,.25)';g.beginPath();
 for(let y=GY,r=0;y>top;y-=14,r++){g.moveTo(KX0,y);g.lineTo(KX1,y);for(let x=KX0+(r%2?12:0);x<KX1;x+=24){g.moveTo(x,y);g.lineTo(x,Math.max(top,y-14))}}g.stroke();
 g.fillStyle='#3b2412';g.beginPath();g.moveTo(86,GY);g.lineTo(86,GY-26);g.arc(100,GY-26,14,PI,0);g.lineTo(114,GY);g.fill();
 if(s.build<100){g.strokeStyle='#8b5a2b';g.lineWidth=3;g.beginPath();for(const x of[KX0-8,KX1+8]){g.moveTo(x,GY);g.lineTo(x,GY-210)}for(let y=GY-30;y>GY-210;y-=40){g.moveTo(KX0-8,y);g.lineTo(KX1+8,y)}g.stroke();g.lineWidth=1;
  const n=C.workers-s.arch;for(let i=0;i<n;i++)person(KX0+8+i*(KX1-KX0-16)/Math.max(1,n-1),top,'#a87c4f',Math.sin(s.t*10+i)*4,.8)}
 else{g.fillStyle='#7d766b';for(let x=KX0;x<KX1;x+=20)g.fillRect(x,top-10,12,10);g.fillStyle='#ddd';g.fillRect(99,top-44,2,34);g.fillStyle='#b22';g.beginPath();g.moveTo(101,top-44);g.lineTo(124,top-38+Math.sin(s.t*4)*3);g.lineTo(101,top-31);g.fill()}
 person(100,GY,'#6a2c8a',0,1.1);g.fillStyle='#ffd23f';g.fillRect(96,GY-28,8,3);
 g.strokeStyle='#5a3a1a';g.lineWidth=3;g.beginPath();g.moveTo(8,GY);g.lineTo(20,GY-30);g.lineTo(32,GY);g.moveTo(20,GY-30);g.lineTo(6,GY-58);g.stroke();g.lineWidth=1}
function drawWall(s){for(let k=2;k>=0;k--){const q=SEG[k];
  if(s.seg[k]<=0){g.fillStyle='#6f685d';g.beginPath();g.moveTo(q.x0-4,GY);g.lineTo(q.x0+10,GY-22);g.lineTo(q.x1-6,GY-14);g.lineTo(q.x1+6,GY);g.fill();continue}
  const r=s.seg[k]/s.segMax;g.fillStyle=['#958d80','#8a8275','#7f776b'][k];g.fillRect(q.x0,q.top,q.x1-q.x0,GY-q.top);for(let x=q.x0;x<q.x1;x+=14)g.fillRect(x,q.top-9,8,9);
  g.strokeStyle='rgba(0,0,0,.25)';g.beginPath();for(let y=GY;y>q.top;y-=12){g.moveTo(q.x0,y);g.lineTo(q.x1,y)}g.moveTo(q.x1,q.top);g.lineTo(q.x1,GY);g.stroke();
  if(r<.66){g.strokeStyle='#2a2620';g.lineWidth=2;g.beginPath();g.moveTo(q.x1-6,q.top+6);g.lineTo(q.x1-16,q.top+30);g.lineTo(q.x1-8,q.top+52);if(r<.33){g.moveTo(q.x0+6,q.top+4);g.lineTo(q.x0+18,q.top+40)}g.stroke();g.lineWidth=1}}
 const f=front(s);if(f){const cx=(f.x0+f.x1)/2;g.fillStyle='#5a3618';g.beginPath();g.moveTo(cx-11,GY);g.lineTo(cx-11,GY-26);g.arc(cx,GY-26,11,PI,0);g.lineTo(cx+11,GY);g.fill();
  g.strokeStyle='#2e1b0b';g.beginPath();for(let x=cx-7;x<cx+11;x+=6){g.moveTo(x,GY);g.lineTo(x,GY-34)}g.stroke()}
 for(let i=0;i<s.arch;i++){const p=apos(s,i),a=-(s.ga[i]||35)*PI/180;person(p.x,p.y,'#2f5a2a');g.strokeStyle='#5b3a1a';g.lineWidth=2;g.beginPath();g.arc(p.x+4,p.y-15,8,a-1.1,a+1.1);g.stroke();g.lineWidth=1}}
function drawEnemy(e){g.save();if(e.hp<=0){g.globalAlpha=Math.max(0,1-e.dead);g.translate(e.x,GY);g.rotate(Math.min(1.5,e.dead*4));g.translate(-e.x,-GY)}
 const fl=e.flash>0?'#fff':e.col;
 if(e.type==='ram'){const x=e.x,y=GY,b=e.atk?Math.sin(e.atk*PI)*6:0;g.fillStyle=fl;g.fillRect(x-30,y-24,60,14);g.fillStyle='#4a2e14';g.beginPath();g.moveTo(x-32,y-24);g.lineTo(x,y-42);g.lineTo(x+32,y-24);g.fill();
  g.fillStyle='#3a3a3a';g.fillRect(x-46-b,y-21,18,8);g.fillStyle='#2b1a0b';for(const wx of[x-20,x+20]){g.beginPath();g.arc(wx,y-7,7,0,7);g.fill()}}
 else{const sc=e.h/30;g.translate(2*e.x,0);g.scale(-1,1);person(e.x,GY,fl,e.atk?Math.sin(e.atk*12)*5:0,sc,e.ph);g.fillStyle='#777';g.fillRect(e.x-4*sc,GY-26*sc,8*sc,3*sc);
  g.strokeStyle='#5a4630';g.beginPath();g.moveTo(e.x+2*sc,GY-4*sc);g.lineTo(e.x+12*sc,GY-30*sc);g.stroke();if(e.type==='heavy'){g.fillStyle='#8a8f99';g.fillRect(e.x+4*sc,GY-20*sc,4*sc,12*sc)}}
 g.restore();if(e.hp>0&&e.hp<e.max){g.fillStyle='#300';g.fillRect(e.x-12,GY-e.h-14,24,3);g.fillStyle='#e33';g.fillRect(e.x-12,GY-e.h-14,24*e.hp/e.max,3)}}
function bar(x,t,p,c){g.fillStyle='#f3e2b3';g.fillText(t,x,17);const bx=x+g.measureText(t).width+6;g.fillStyle='#000';g.fillRect(bx,10,80,14);g.fillStyle=c;g.fillRect(bx+1,11,78*Math.max(0,p),12)}
const cnt={};
function hud(s){g.fillStyle='rgba(20,12,6,.72)';g.fillRect(0,0,W,34);g.font='bold 15px Georgia,serif';g.textBaseline='middle';g.fillStyle='#f3e2b3';
 g.fillText('Level '+s.l,10,17);g.fillText('Punkte '+s.score,82,17);bar(225,'Bau',s.build/100,'#d9a84a');bar(370,'Mauer',s.wall/s.wallMax,'#9ab');bar(530,'Burgherr',s.lord/C.lordHp,'#c44');
 g.fillStyle='#f3e2b3';g.fillText(`Schützen ${s.arch}  Bauer ${C.workers-s.arch}  Winkel ${Math.round(s.ga[0])}°`,712,17);
 if(s.aim){const m=s.aim;g.strokeStyle=s.fire?'#ff6a3a':'rgba(255,240,180,.7)';g.lineWidth=2;g.beginPath();g.arc(m.x,m.y,10,0,7);g.moveTo(m.x-16,m.y);g.lineTo(m.x+16,m.y);g.moveTo(m.x,m.y-16);g.lineTo(m.x,m.y+16);g.stroke();g.lineWidth=1}
 for(const k in s.sp)if(cnt[k]!==s.sp[k]){cnt[k]=s.sp[k];$('n-'+k).textContent=s.sp[k]}}
function draw(){const s=S||DEMO;if(!S)DEMO.t+=.016;if(!bg)bg=mkBg();g.setTransform(1,0,0,1,0,0);g.drawImage(bg,0,0);g.setTransform(cv.width/W,0,0,cv.height/H,0,0);
 if(s.shake>0)g.translate((R()-.5)*20*s.shake,0);drawKeep(s);drawWall(s);for(const e of s.en)drawEnemy(e);
 g.strokeStyle='#2a1c10';g.lineWidth=1.6;g.beginPath();for(const a of s.ar){const an=a.stuck?a.an:(a.an=Math.atan2(a.vy,a.vx));g.moveTo(a.x,a.y);g.lineTo(a.x-Math.cos(an)*14,a.y-Math.sin(an)*14)}g.stroke();g.lineWidth=1;
 g.fillStyle='#555';for(const r of s.rk){g.beginPath();g.arc(r.x,r.y,7,0,7);g.fill()}
 for(const l of s.lg){g.fillStyle='#5a3a1a';g.beginPath();g.arc(l.x,GY-11,11,0,7);g.fill();g.strokeStyle='#c8873a';g.beginPath();g.arc(l.x,GY-11,6,l.rot,l.rot+4);g.stroke()}
 for(const f of s.fx){g.globalAlpha=Math.min(1,f.life);g.fillStyle=f.c;if(f.txt){g.font='bold 14px Georgia,serif';g.fillText(f.txt,f.x,f.y)}else g.fillRect(f.x,f.y,f.s,f.s)}g.globalAlpha=1;
 if(S)hud(s)}

function loop(ts){const dt=Math.min(.05,(ts-last)/1000||0);last=ts;if(mode==='play'){let r=dt;while(r>0&&mode==='play'){const st=Math.min(r,1/60);update(st);r-=st}}draw();requestAnimationFrame(loop)}

const row=(a,b)=>`<tr><td>${a}</td><td>${b}</td></tr>`;
function panel(html,btns){const o=$('ov');o.innerHTML='<div class="box">'+html+'<div class="bt"></div></div>';const bt=o.querySelector('.bt');
 for(const[t,f]of btns){const b=document.createElement('button');b.textContent=t;b.onclick=()=>{AU.init();AU.click();f()};bt.appendChild(b)}o.hidden=false}
function win(){const s=S,acc=s.shots?s.hits/s.shots:0,sc=C.score,b=[['Levelbonus',sc.level*s.l],['Mauer intakt',Math.round(s.wall/s.wallMax*sc.wall)],['Übrige Spezialwaffen',(s.sp.oil+s.sp.mang+s.sp.logs)*sc.spLeft],['Bauzeit '+Math.round(s.t)+' s',Math.max(0,Math.round(sc.time-s.t*sc.timeK))],['Treffsicherheit '+Math.round(acc*100)+' %',Math.round(acc*sc.acc)]];
 for(const x of b)s.score+=x[1];mode='end';s.fire=false;sv.best=Math.max(sv.best,s.l+1);sv.hi=Math.max(sv.hi,s.score);Object.assign(sv,{lvl:s.l+1,score:s.score,rk:s.kills});save();AU.win();$('ctl').hidden=true;
 panel(`<h2>Bergfried fertig – Level ${s.l} geschafft</h2><table>${b.map(x=>row(x[0],'+'+x[1])).join('')}${row('<b>Gesamt</b>','<b>'+s.score+'</b>')}</table>`,[['Nächstes Level',()=>start(s.l+1,s.score,s.kills)],['Hauptmenü',menu]])}
function lose(){const s=S;mode='end';s.fire=false;sv.hi=Math.max(sv.hi,s.score);sv.best=Math.max(sv.best,s.l);Object.assign(sv,{lvl:1,score:0,rk:0});save();AU.crash();$('ctl').hidden=true;
 panel(`<h2>Der Burgherr ist gefallen</h2><table>${row('Endpunktzahl',s.score)}${row('Erreichtes Level',s.l)}${row('Besiegte Gegner',s.kills)}${row('Highscore',sv.hi)}</table>`,[['Erneut spielen',()=>start(1,0,0)],['Hauptmenü',menu]])}
function pause(){if(mode!=='play')return;mode='pause';S.fire=false;save();panel('<h2>Pause</h2>',[['Fortsetzen',()=>{$('ov').hidden=true;mode='play'}],['Level neu starten',()=>start(S.l,S.s0,S.k0)],['Hauptmenü',menu]])}
function menu(){mode='menu';S=null;$('ctl').hidden=true;const b=[['Spiel starten',()=>start(1,0,0)]];if(sv.lvl>1)b.push([`Fortsetzen (Level ${sv.lvl})`,()=>start(sv.lvl,sv.score,sv.rk)]);
 panel(`<h1>Castle Attack 2<small>Remake – Verteidige den Bergfried</small></h1><p class="st" id="off">${offTxt}</p>`,b.concat([['Anleitung',help],['Einstellungen',settings],['Highscore',scores]]))}
function help(){panel(`<h2>Anleitung</h2><ul><li>Deine ${C.workers} Arbeiter bauen den Bergfried. Ist er fertig, ist das Level gewonnen.</li><li><b>+🏹/−🏹</b>: bis zu ${C.maxArchers} Arbeiter werden Bogenschützen – bessere Abwehr, aber langsamerer Bau.</li><li><b>Finger aufs Spielfeld halten</b>: Die Schützen berechnen die Flugbahn zu dieser Stelle und schießen Salven, auch steil nach unten direkt vor die Mauer. Ziehen verschiebt das Ziel, Loslassen stoppt.</li><li>Die Mauer hat drei nach hinten höher werdende Abschnitte. Sie fallen von vorn nach hinten, die Schützen weichen dann auf den nächsten Abschnitt aus.</li><li><b>Öl</b> trifft alles direkt vor dem Tor, der <b>Mangonel</b> wirft einen Stein mit Flächenschaden auf die vorderste Gruppe, <b>Stämme</b> rollen brennend durch alle Gegner. Jeder Einsatz kostet Punkte.</li><li>Fällt die Mauer, stürmen die Gegner zum Burgherrn. Stirbt er, ist das Spiel verloren.</li></ul>`,[['Zurück',menu]])}
function settings(){const on=v=>v?'an':'aus';panel(`<h2>Einstellungen</h2>`,[[`Musik: ${on(sv.music)}`,()=>{sv.music^=1;save();settings()}],[`Soundeffekte: ${on(sv.sfx)}`,()=>{sv.sfx^=1;save();settings()}],[`Grafik: ${sv.q>1?'hoch':'sparsam'}`,()=>{sv.q=sv.q>1?1:2;save();resize();settings()}],['Zurück',menu]])}
function scores(){panel(`<h2>Highscore</h2><table>${row('Höchste Punktzahl',sv.hi)}${row('Höchstes Level',sv.best)}${row('Besiegte Gegner gesamt',sv.kills)}</table>`,[['Zurück',menu]])}

const acts={up:()=>{S.aim=null;S.ang=Math.min(C.arrow.maxAng,S.ang+C.arrow.step)},down:()=>{S.aim=null;S.ang=Math.max(C.arrow.minAng,S.ang-C.arrow.step)},
 add:()=>{if(S.arch<C.maxArchers){S.arch++;S.cd[S.arch-1]=.3}},rem:()=>{if(S.arch>0)S.arch--},oil:()=>special('oil'),mang:()=>special('mang'),logs:()=>special('logs'),pause};
document.querySelectorAll('#ctl button').forEach(b=>{const a=b.dataset.a;let rep=0,lt=0;
 b.addEventListener('pointerdown',e=>{e.preventDefault();AU.init();if(mode!=='play')return;b.classList.add('on');try{b.setPointerCapture(e.pointerId)}catch(_){}
  if(a==='fire'){S.fire=true;return}const now=performance.now();if(now-lt<150)return;lt=now;acts[a]();AU.click();
  if(a==='up'||a==='down'){clearInterval(rep);rep=setInterval(()=>mode==='play'&&acts[a](),110)}});
 const end=()=>{b.classList.remove('on');clearInterval(rep);if(a==='fire'&&S)S.fire=false};['pointerup','pointercancel','lostpointercapture'].forEach(t=>b.addEventListener(t,end))});
const keys={ArrowUp:'up',ArrowDown:'down',KeyA:'add',KeyD:'rem',Digit1:'oil',Digit2:'mang',Digit3:'logs',KeyP:'pause'};
addEventListener('keydown',e=>{if(mode!=='play'||e.repeat&&e.code!=='ArrowUp'&&e.code!=='ArrowDown')return;if(e.code==='Space'){S.fire=true;e.preventDefault()}else if(keys[e.code])acts[keys[e.code]]()});
addEventListener('keyup',e=>{if(e.code==='Space'&&S)S.fire=false});
document.addEventListener('pointerdown',()=>AU.init());
document.addEventListener('touchmove',e=>{if(!e.target.closest('.box'))e.preventDefault()},{passive:false});
['gesturestart','dblclick'].forEach(t=>document.addEventListener(t,e=>e.preventDefault()));
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
addEventListener('resize',resize);
// Direktes Zielen per Touch/Maus auf dem Spielfeld
function toGame(e){const b=cv.getBoundingClientRect();return{x:(e.clientX-b.left)/b.width*W,y:Math.min(GY-8,(e.clientY-b.top)/b.height*H)}}
let aimId=null;const stopAim=e=>{if(e.pointerId===aimId){aimId=null;if(S)S.fire=false}};
document.addEventListener('pointerdown',e=>{if(mode!=='play'||e.target.closest('button'))return;aimId=e.pointerId;S.aim=toGame(e);S.fire=true});
document.addEventListener('pointermove',e=>{if(e.pointerId===aimId&&S)S.aim=toGame(e)});
document.addEventListener('pointerup',stopAim);document.addEventListener('pointercancel',stopAim);

function setOff(t){offTxt=t;const el=$('off');if(el)el.textContent=t}
if('serviceWorker'in navigator&&location.protocol.startsWith('http')){
 const upd=r=>{const u=$('upd');u.hidden=false;u.onclick=()=>{u.hidden=true;r.waiting&&r.waiting.postMessage('skip')}};
 navigator.serviceWorker.register('service-worker.js').then(r=>{if(r.waiting&&navigator.serviceWorker.controller)upd(r);r.addEventListener('updatefound',()=>{const w=r.installing;w&&w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)upd(r)})})}).catch(()=>setOff('⚠ Offline-Modus konnte nicht eingerichtet werden.'));
 navigator.serviceWorker.ready.then(()=>caches.has(SWV)).then(ok=>ok&&setOff('✓ Offline spielbereit'));
 let rl=0;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!rl&&mode!=='play'){rl=1;location.reload()}});
}else setOff('⚠ Offline-Modus braucht HTTPS-Hosting.');
resize();menu();requestAnimationFrame(loop);
