// Prozedural erzeugte Sounds & Musik (Web Audio) – keine Dateien, voll offline.
const AU={c:null,
 init(){if(this.c){if(this.c.state==='suspended')this.c.resume();return}
  try{this.c=new(window.AudioContext||window.webkitAudioContext)();this.mg=this.c.createGain();this.mg.gain.value=.07;this.mg.connect(this.c.destination);this.music()}catch(e){this.c=null}},
 t(f,d,ty,v,f2,dl){const c=this.c;if(!c||!sv.sfx)return;const t=c.currentTime+(dl||0),o=c.createOscillator(),n=c.createGain();o.type=ty;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);n.gain.setValueAtTime(v,t);n.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(n);n.connect(c.destination);o.start(t);o.stop(t+d+.02)},
 n(d,v,fq){const c=this.c;if(!c||!sv.sfx)return;if(!this.nb){this.nb=c.createBuffer(1,c.sampleRate,c.sampleRate);const a=this.nb.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}
  const s=c.createBufferSource(),f=c.createBiquadFilter(),n=c.createGain(),t=c.currentTime;s.buffer=this.nb;f.type='lowpass';f.frequency.value=fq;n.gain.setValueAtTime(v,t);n.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f);f.connect(n);n.connect(c.destination);s.start();s.stop(t+d)},
 arrow(){this.n(.12,.15,3000);this.t(900,.1,'triangle',.04,300)},
 hit(k){k?this.n(.15,.25,k>1?700:300):this.t(220,.06,'square',.05,110)},
 die(){this.t(320,.25,'sawtooth',.05,90)}, oil(){this.n(.9,.3,1200)}, fire(){this.n(1.2,.2,2000)},
 thump(){this.t(90,.3,'sine',.4,40);this.n(.2,.2,400)}, boom(){this.n(.6,.5,500);this.t(60,.5,'sine',.5,30)},
 crash(){this.n(1.2,.6,300)}, click(){this.t(660,.05,'square',.04)},
 win(){[523,659,784,1046].forEach((f,i)=>this.t(f,.3,'triangle',.08,0,i*.15))},
 music(){const N=[57,60,64,62,60,57,55,57,60,62,64,67,64,62,60,57];let i=0;
  setInterval(()=>{const c=this.c;if(!c||!sv.music||document.hidden)return;const t=c.currentTime,f=440*Math.pow(2,(N[i%16]-69)/12);
   const p=(fr,ty,v,d)=>{const o=c.createOscillator(),n=c.createGain();o.type=ty;o.frequency.value=fr;n.gain.setValueAtTime(v,t);n.gain.exponentialRampToValueAtTime(.01,t+d);o.connect(n);n.connect(this.mg);o.start(t);o.stop(t+d+.02)};
   p(f,'triangle',.5,.4);if(i%4===0)p(f/4,'sine',.7,1.6);i++},450)}};
