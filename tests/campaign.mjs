import assert from 'node:assert/strict';
import {Company,land,atPath,pathFor,PLACES,MODES} from '../dist/sim.mjs';
assert.equal(atPath([{x:0,y:0},{x:2,y:0},{x:2,y:2}],.75).y,1);
for(const a of PLACES.filter(n=>n.coast))for(const b of PLACES.filter(n=>n.coast&&n.id!==a.id)){const p=pathFor(a,b,'ship');assert(p&&p.length>1);assert(p.every(p=>!land(p.x,p.y)));}
const c=new Company();const build=(a,b,m,cargo)=>{const r=c.build(a,b,m,cargo);assert(!r.error,r.error);return r};
assert(c.quote(6,7,'bus','wood').error);assert(c.quote(0,1,'plane','passengers').error);
assert.equal(c.nodes[7].stock.goods,0);
const timber=build(6,7,'train','wood');const goods=build(7,2,'truck','goods');const bus=build(0,1,'bus','passengers');
const contract=c.contracts.find(x=>x.a===6);assert(c.acceptContract(contract.id));
for(let i=0;i<400;i++)c.step(.5);
assert(c.delivered>220);assert(goods.deliveries>0);assert(c.nodes[2].pop>1100);assert(c.routes.every(r=>r.revenue>0));assert(c.cash>10000);assert.equal(c.activeContract,null);assert(c.history.length>0);
build(0,5,'ship','passengers');build(3,13,'plane','passengers');build(2,4,'bus','passengers');build(11,12,'truck','grain');build(12,0,'truck','food');build(8,9,'train','ore');build(9,10,'truck','steel');build(10,4,'truck','goods');
for(let i=0;i<4000&&!c.won;i++)c.step(.5);
assert(c.won,'Campaign final goal must be reachable');assert.equal(c.milestones.length,5);assert(c.routes.every(r=>r.deliveries>0));const loaded=Company.restore(JSON.parse(JSON.stringify(c)));assert.equal(loaded.routes.length,c.routes.length);assert.equal(loaded.cash,c.cash);for(let i=0;i<10;i++)loaded.step(.1);assert(loaded.day>c.day);
const r=c.routes[0],v=r.vehicles[0];assert(c.addVehicle(r.id));assert(c.upgradeVehicle(r.id,v.id));assert(c.replaceVehicle(r.id,v.id));assert(c.sellVehicle(r.id,r.vehicles[1].id));const old=c.cash;assert(c.upgradeFacility(r.a,'rail'));assert(c.cash<old);assert(c.borrow());assert(c.repay());assert(c.removeRoute(r.id));
console.log(JSON.stringify({result:'PASS',day:Math.floor(c.day),cash:Math.floor(c.cash),delivered:c.delivered,milestones:c.milestones,allModes:[...new Set(c.routes.map(r=>r.mode))],checks:'sea paths, cargo compatibility, unlocks, production chains, income, growth, contracts, endgame, save/load, fleet management, facility upgrades, loans'},null,2));
