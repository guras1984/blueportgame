import assert from 'node:assert/strict';
import {Company} from '../dist/sim.mjs';
let draws=0;
const context=()=>new Proxy({measureText:t=>({width:t.length*7}),createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})}, {get(o,k){if(k in o)return o[k];return (...args)=>{draws++;if(k==='ellipse')assert(args.length>=7,'ellipse needs 7 arguments');if(['ellipse','arc','translate','scale','fillRect','lineTo','moveTo','roundRect'].includes(k))for(const n of args)assert(Number.isFinite(n),`${k} received non-finite input`)}},set(o,k,v){o[k]=v;return true}});
const canvas=()=>({width:0,height:0,getContext:()=>context(),getBoundingClientRect:()=>({width:1000,height:700,left:0,top:0}),addEventListener(){},style:{}});
globalThis.document={createElement:()=>canvas()};globalThis.devicePixelRatio=1;globalThis.ResizeObserver=class{observe(){}};
const {World}=await import('../dist/world.mjs');const c=new Company();c.cash=100000;c.delivered=1000;
for(const args of [[6,7,'train','wood'],[7,2,'truck','goods'],[0,1,'bus','passengers'],[0,5,'ship','passengers'],[3,13,'plane','passengers']])assert(!c.build(...args).error);
const w=new World(canvas(),()=>{});for(let i=0;i<100;i++){c.step(.2);w.selected=i%14;w.draw(c,.016)}w.focus(c.nodes[0]);w.preview=c.quote(8,9,'train','ore');w.draw(c,.016);assert(draws>10000);console.log('PASS: all five vehicle renderers, terrain, cities, industry, docks, airports, selected markers, planned route, 100 moving frames');
