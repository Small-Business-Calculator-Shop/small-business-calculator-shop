const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync('js/engine.js','utf8'),context);const e=context.window.ToolkitEngine;
assert.equal(e.evaluateFormula('amount * quantity + 5',{amount:12,quantity:3}),41);
assert.equal(e.evaluateFormula('(amount + 2) * quantity',{amount:8,quantity:2}),20);
assert.equal(e.evaluateFormula('amount / quantity',{amount:10,quantity:2}),5);
assert.equal(e.customCost([{amount:'10',quantity:'2',formula:'amount * quantity + 3'}]),23);
for(const x of ['amount.constructor','alert(1)','amount / 0','amount - 100','2 ** 3','amount + foo'])assert.throws(()=>e.evaluateFormula(x,{amount:10,quantity:2}));
assert.throws(()=>e.analyze({yield:0},()=>({materials:1,packaging:0,labor:0,other:0})));console.log('PASS: safe custom formulas and invalid-input protection');
