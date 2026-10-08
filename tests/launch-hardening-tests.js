/* Maker Calculator™ launch-hardening regression tests.
   Run with: node tests/launch-hardening-tests.js
   Tests the actual hardening engine so the launch rules cannot drift from production logic. */
const assert=require('assert');
const H=require('../src/launch-hardening-engine.js');
const tests=[];
function test(name,fn){tests.push([name,fn]);}

test('Keep in Stock is protected when inventory is above cushion',()=>{
  const p=H.planProduction({orderQty:100,finishedOnHand:40,keepInStock:15,sellableYield:24});
  assert.equal(p.availableForOrder,25);assert.equal(p.unitsRequired,75);assert.equal(p.batchesRequired,4);assert.equal(p.unitsProduced,96);assert.equal(p.finishedAfterOrder,36);
});

test('Keep in Stock is restored when inventory starts below cushion',()=>{
  const p=H.planProduction({orderQty:20,finishedOnHand:10,keepInStock:15,sellableYield:12});
  assert.equal(p.stockShortfall,5);assert.equal(p.unitsRequired,25);assert.equal(p.batchesRequired,3);assert.equal(p.unitsProduced,36);assert.equal(p.finishedAfterOrder,26);
});

test('No production is needed when order fits inventory above cushion',()=>{
  const p=H.planProduction({orderQty:10,finishedOnHand:40,keepInStock:15,sellableYield:24});
  assert.equal(p.batchesRequired,0);assert.equal(p.finishedAfterOrder,30);
});

test('Whole-batch excess remains finished inventory',()=>{
  const p=H.planProduction({orderQty:12,finishedOnHand:5,keepInStock:5,sellableYield:10});
  assert.equal(p.batchesRequired,2);assert.equal(p.unitsProduced,20);assert.equal(p.excessAfterRequirements,8);assert.equal(p.finishedAfterOrder,13);
});

test('Material units and decimal quantities are preserved',()=>{
  const ml=H.purchaseNeedForWholeBatches([{name:'Oil',unit:'mL',usedPerBatch:250.5,onHand:400.25}],3)[0];
  assert.deepStrictEqual(ml,{name:'Oil',unit:'mL',usedPerBatch:250.5,onHand:400.25,required:751.5,short:351.25});
  const g=H.purchaseNeedForWholeBatches([{name:'Wax',unit:'g',usedPerBatch:125.25,onHand:200.5}],2)[0];
  assert.deepStrictEqual(g,{name:'Wax',unit:'g',usedPerBatch:125.25,onHand:200.5,required:250.5,short:50});
});

test('Loss-making order is NO',()=>assert.equal(H.orderDecision({orderQty:100,orderSales:1400,orderLeft:-70,newCashNeeded:0,paymentDays:0}).status,'NO'));
test('Supply shortage prevents YES',()=>assert.equal(H.orderDecision({orderQty:100,orderSales:1400,orderLeft:420,newCashNeeded:0,paymentDays:0,physicalShortage:true}).status,'MAYBE'));
test('Thin economics is MAYBE',()=>assert.equal(H.orderDecision({orderQty:100,orderSales:1400,orderLeft:100,newCashNeeded:0,paymentDays:0}).status,'MAYBE'));
test('Heavy up-front cash need is MAYBE',()=>assert.equal(H.orderDecision({orderQty:100,orderSales:1400,orderLeft:420,newCashNeeded:800,paymentDays:0}).status,'MAYBE'));
test('Net 30 plus new cash exposure is MAYBE',()=>assert.equal(H.orderDecision({orderQty:100,orderSales:1400,orderLeft:420,newCashNeeded:185,paymentDays:30}).status,'MAYBE'));
test('Healthy immediate-pay order can be YES',()=>assert.equal(H.orderDecision({orderQty:100,orderSales:1400,orderLeft:420,newCashNeeded:185,paymentDays:0}).status,'YES'));

test('Currency defaults to two decimals with optional whole-number rounding',()=>{
  const precise=185.49;
  assert.equal(H.currencyDisplay(precise,{symbol:'$'}),'$185.49');
  assert.equal(H.currencyDisplay(185.5,{symbol:'$'}),'$185.50');
  assert.equal(H.currencyDisplay(185,{symbol:'$'}),'$185.00');
  assert.equal(H.currencyDisplay(precise,{round:true,symbol:'$'}),'$185');
  assert.equal(H.currencyDisplay(185.5,{round:true,symbol:'$'}),'$186');
  assert.equal(precise,185.49);
});
let passed=0;
for(const [name,fn] of tests){try{fn();console.log('PASS',name);passed++;}catch(e){console.error('FAIL',name);console.error(e.stack||e.message);process.exitCode=1;}}
console.log(`\n${passed}/${tests.length} tests passed`);
