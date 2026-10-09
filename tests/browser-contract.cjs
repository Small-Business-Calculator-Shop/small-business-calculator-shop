const fs=require('node:fs');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).filter(Boolean);
assert.ok(scripts.length,'Calculator must have inline JavaScript');
for(const script of scripts)new Function(script);
for(const id of ['sellableYield','expectedYield','samples','rejects','finishedOnHand','keepInStock','orderQty','normalSales','scenarioYield','orderPrice','scenarioPrice','orderSales','results','error']){
 assert.ok(html.includes('id="'+id+'"'),'Missing calculator control: '+id);
}
assert.match(html,/Number\.isInteger\(Number\(raw\)\)/,'Whole-count validation missing');
assert.match(html,/orderPrice\.value\.trim\(\)===''\?price:n\(orderPrice\.value\)/,'Zero order price fallback regression');
assert.match(html,/scenarioPrice\.value\.trim\(\)===''\?price:n\(scenarioPrice\.value\)/,'Zero scenario price fallback regression');
assert.match(html,/scenarioYield\.value\.trim\(\)===''\?sellable:n\(scenarioYield\.value\)/,'Scenario yield fallback regression');
assert.match(html,/document\.getElementById\('orderSales'\)\.textContent=money\(orderSales\)/,'Order sales display regression');
console.log('Browser code and DOM contract checks passed');
