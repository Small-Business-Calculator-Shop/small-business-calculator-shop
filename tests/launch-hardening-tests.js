/* Maker Calculator™ launch-hardening regression tests.
   Run with: node tests/launch-hardening-tests.js
   These tests define V1 business rules independently of the UI. */
const assert = require('assert');

function orderNeed({order, finished, keep, sellablePerBatch}) {
  const available = Math.max(0, finished - keep);
  const stockShortfall = Math.max(0, keep - finished);
  const needToMake = Math.max(0, order - available) + stockShortfall;
  const batches = needToMake > 0 ? Math.ceil(needToMake / sellablePerBatch) : 0;
  return {available, stockShortfall, needToMake, batches};
}

function orderAnswer({sales, leftAfterCosts, hasSupplyShortage=false, newCash=0, paymentDays=0}) {
  if (sales <= 0) return 'MAYBE';
  if (leftAfterCosts <= 0) return 'NO';
  if (hasSupplyShortage) return 'MAYBE';
  const pctLeft = leftAfterCosts / sales;
  if (pctLeft < 0.10) return 'MAYBE';
  if (newCash > sales * 0.50) return 'MAYBE';
  if (paymentDays >= 30 && newCash > 0) return 'MAYBE';
  return 'YES';
}

function promotion({regularPrice, salePrice, unitCost, sellingPct=0, fixedPerUnit=0, normalSales=0, promoCost=0}) {
  const regularLeft = regularPrice - unitCost - regularPrice * sellingPct - fixedPerUnit;
  const saleLeft = salePrice - unitCost - salePrice * sellingPct - fixedPerUnit;
  if (saleLeft <= 0) return {answer:'NO', regularLeft, saleLeft, extraSales:Infinity};
  if (normalSales <= 0) return {answer:'MAYBE', regularLeft, saleLeft, extraSales:null};
  const normalTotal = regularLeft * normalSales;
  const neededSales = Math.ceil((normalTotal + promoCost) / saleLeft);
  const extraSales = Math.max(0, neededSales - normalSales);
  return {answer: extraSales > normalSales ? 'MAYBE' : 'YES', regularLeft, saleLeft, extraSales};
}

const tests = [];
function test(name, fn){ tests.push([name,fn]); }

test('Keep in Stock is protected when inventory is above cushion', () => {
  assert.deepStrictEqual(orderNeed({order:100,finished:40,keep:15,sellablePerBatch:24}), {available:25,stockShortfall:0,needToMake:75,batches:4});
});

test('Keep in Stock is restored when current inventory is already below cushion', () => {
  assert.deepStrictEqual(orderNeed({order:20,finished:10,keep:15,sellablePerBatch:12}), {available:0,stockShortfall:5,needToMake:25,batches:3});
});

test('No production is needed when order fits inventory above cushion', () => {
  assert.deepStrictEqual(orderNeed({order:10,finished:40,keep:15,sellablePerBatch:24}), {available:25,stockShortfall:0,needToMake:0,batches:0});
});

test('Negative order economics is NO', () => assert.equal(orderAnswer({sales:1400,leftAfterCosts:-70}), 'NO'));
test('Supply shortage prevents a YES', () => assert.equal(orderAnswer({sales:1400,leftAfterCosts:420,hasSupplyShortage:true}), 'MAYBE'));
test('Thin order economics is MAYBE', () => assert.equal(orderAnswer({sales:1400,leftAfterCosts:100}), 'MAYBE'));
test('Heavy up-front cash need is MAYBE', () => assert.equal(orderAnswer({sales:1400,leftAfterCosts:420,newCash:800}), 'MAYBE'));
test('Delayed payment plus new cash exposure is MAYBE', () => assert.equal(orderAnswer({sales:1400,leftAfterCosts:420,newCash:185,paymentDays:30}), 'MAYBE'));
test('Healthy immediate-pay order can be YES', () => assert.equal(orderAnswer({sales:1400,leftAfterCosts:420,newCash:185,paymentDays:0}), 'YES'));

test('Promotion shows extra sales needed to recover discount', () => {
  const r=promotion({regularPrice:30,salePrice:24,unitCost:10,normalSales:20});
  assert.equal(r.regularLeft,20); assert.equal(r.saleLeft,14); assert.equal(r.extraSales,9); assert.equal(r.answer,'YES');
});

test('Promotion with no money left after costs is NO', () => {
  assert.equal(promotion({regularPrice:30,salePrice:9,unitCost:10,normalSales:20}).answer,'NO');
});

let passed=0;
for(const [name,fn] of tests){try{fn();console.log('PASS',name);passed++;}catch(e){console.error('FAIL',name);console.error(e.message);process.exitCode=1;}}
console.log(`\n${passed}/${tests.length} tests passed`);
