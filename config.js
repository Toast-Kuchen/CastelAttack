// Zentrale Spielkonfiguration: alle Balancing-Werte (l = Level).
const CFG={
 workers:8, maxArchers:3, lordHp:100, atkRate:1,
 buildRate:l=>0.2/(1+0.06*(l-1)),      // % Baufortschritt pro Sekunde je Bauarbeiter
 wallHp:l=>180+30*l,                     // Mauer-LP gesamt (auf 3 Abschnitte verteilt)
 count:l=>6+3*l, waveSize:5, waveGap:6, spacing:1.4, // Gegneranzahl & Wellentakt
 hpMul:l=>1+0.2*(l-1), spdMul:l=>1+0.04*(l-1), dmgMul:l=>1+0.1*(l-1),
 types:{
  infantry:{hp:3,spd:30,dmg:4,pts:10,w:16,h:30,col:'#8b2a20'},
  runner:{hp:2,spd:58,dmg:3,pts:15,w:14,h:28,col:'#b5651d'},
  heavy:{hp:9,spd:18,dmg:8,pts:30,w:22,h:36,col:'#4a4f5a'},
  ram:{hp:22,spd:13,dmg:25,pts:60,w:64,h:34,col:'#6b4423'}},
 pick(l,i){const r=(i*37+l*11)%100;if(l>=3&&r<4+l)return'ram';if(l>=2&&r<18+3*l)return'heavy';return r<45?'runner':'infantry'},
 arrow:{v:520,g:400,cd:1.1,dmg:1,spread:3,splashR:10,splashMul:.6,step:2,minAng:-80,maxAng:75},
 oil:{n:3,dmg:12,r:90,pen:150}, mang:{n:3,dmg:10,r:70,pen:100}, logs:{n:3,dmg:6,spd:240,pen:75},
 score:{levelMul:l=>1+0.25*(l-1),level:500,wall:1000,spLeft:200,time:3000,timeK:15,acc:1500}
};
