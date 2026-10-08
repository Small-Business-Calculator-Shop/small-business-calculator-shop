const assert=require('assert');
const H=require('../src/launch-hardening-engine.js');

function eq(actual,expected,msg){assert.deepStrictEqual(actual,expected,msg)}

// Keep in Stock is protected.
let p=H.planProduction({orderQty:20,finishedOnHand:40,keepInStock:15,sellableYield:10});
eq({used:p.usedFromFinished,required:p.unitsRequired,batches:p.batchesRequired,ending:p.finishedAfterOrder},{used:20,required:0,batches:0,ending:20},'available finished goods should fill order without touching cushion');

// Existing stock shortfall is restored as part of production planning.
p=H.planProduction({orderQty:20,finishedOnHand:10,keepInStock:15,sellableYield:10});
eq({shortfall:p.stockShortfall,required:p.unitsRequired,batches:p.batchesRequired,produced:p.unitsProduced,excess:p.excessAfterRequirements,ending:p.finishedAfterOrder},{shortfall:5,required:25,batches:3,produced:30,excess:5,ending:20},'order plus cushion restoration must use whole batches');

// Whole-batch excess becomes finished inventory, never waste.
p=H.planProduction({orderQty:12,finishedOnHand:5,keepInStock:5,sellableYield:10});
eq({required:p.unitsRequired,batches:p.batchesRequired,produced:p.unitsProduced,excess:p.excessAfterRequirements,ending:p.finishedAfterOrder},{required:12,batches:2,produced:20,excess:8,ending:13},'excess from final batch must remain finished inventory');

// Physical material units are preserved; no conversion occurs here.
let needs=H.purchaseNeedForWholeBatches([{name:'Oil',unit:'mL',usedPerBatch:250.5,onHand:400.25}],3)[0];
eq(needs,{name:'Oil',unit:'mL',usedPerBatch:250.5,onHand:400.25,required:751.5,short:351.25},'mL and decimal quantities must remain unchanged');
needs=H.purchaseNeedForWholeBatches([{name:'Wax',unit:'g',usedPerBatch:125.25,onHand:200.5}],2)[0];
eq(needs,{name:'Wax',unit:'g',usedPerBatch:125.25,onHand:200.5,required:250.5,short:50},'g and decimal quantities must remain unchanged');

// Payment delay affects the answer when new cash is tied up.
eq(H.orderDecision({orderQty:100,orderSales:1400,orderLeft:420,newCashNeeded:185,paymentDays:30,physicalShortage:false}).status,'MAYBE','Net 30 plus new cash should surface timing exposure');
eq(H.orderDecision({orderQty:100,orderSales:1400,orderLeft:420,newCashNeeded:0,paymentDays:30,physicalShortage:false}).status,'YES','delay alone should not change economics when no new cash is required');
eq(H.orderDecision({orderQty:100,orderSales:1400,orderLeft:-70,newCashNeeded:0,paymentDays:0,physicalShortage:false}).status,'NO','loss-making order must be NO');

// Currency defaults to two decimal places; whole-number rounding is optional.
eq(H.currencyDisplay(185.49,{symbol:'$'}),'$185.49');
eq(H.currencyDisplay(185.5,{symbol:'$'}),'$185.50');
eq(H.currencyDisplay(185,{symbol:'$'}),'$185.00');
eq(H.currencyDisplay(185.49,{symbol:'$',round:true}),'$185');
eq(H.currencyDisplay(185.5,{symbol:'$',round:true}),'$186');
const precise=185.49; H.currencyDisplay(precise,{symbol:'$',round:true});
eq(precise,185.49,'formatting must not mutate calculation value');
console.log('Maker Calculator launch-hardening engine tests passed.');
