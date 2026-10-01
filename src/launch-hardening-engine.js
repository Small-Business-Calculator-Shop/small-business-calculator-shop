/* Maker Calculator™ launch-hardening engine
 * Conservative rules: preserve measurement units, plan whole batches,
 * restore Keep in Stock, retain excess production as finished inventory,
 * and preserve currency values as calculated.
 */
(function(root){
  'use strict';
  function num(v){ const x=Number(v); return Number.isFinite(x)?x:0; }
  function whole(v){ return Math.max(0,Math.floor(num(v))); }
  function planProduction(input){
    const order=whole(input.orderQty), finished=whole(input.finishedOnHand), keep=whole(input.keepInStock), yieldPerBatch=whole(input.sellableYield);
    if(yieldPerBatch<1) throw new Error('Sellable yield must be at least 1 product per batch.');
    const availableForOrder=Math.max(0,finished-keep);
    const usedFromFinished=Math.min(order,availableForOrder);
    const orderStillToMake=order-usedFromFinished;
    const stockShortfall=Math.max(0,keep-finished);
    const unitsRequired=orderStillToMake+stockShortfall;
    const batchesRequired=unitsRequired>0?Math.ceil(unitsRequired/yieldPerBatch):0;
    const unitsProduced=batchesRequired*yieldPerBatch;
    const excessAfterRequirements=Math.max(0,unitsProduced-unitsRequired);
    // Preserve every physical finished unit: starting stock - units shipped from stock
    // + newly produced units - order units fulfilled from new production.
    const finishedAfterOrder=finished-usedFromFinished+unitsProduced-orderStillToMake;
    return {order,finished,keep,yieldPerBatch,availableForOrder,usedFromFinished,orderStillToMake,stockShortfall,unitsRequired,batchesRequired,unitsProduced,excessAfterRequirements,finishedAfterOrder};
  }
  // Rows are unit-agnostic here. usedPerBatch and onHand MUST already share the
  // same preserved unit via the existing same-dimension conversion layer.
  function purchaseNeedForWholeBatches(rows,batchesRequired){
    return (rows||[]).map(function(row){
      const usedPerBatch=num(row.usedPerBatch), onHand=num(row.onHand), required=usedPerBatch*whole(batchesRequired), short=Math.max(0,required-onHand);
      return {name:row.name||'',unit:row.unit||'',usedPerBatch,onHand,required,short};
    });
  }
  function orderDecision(input){
    const sales=num(input.orderSales), left=num(input.orderLeft), cash=num(input.newCashNeeded), days=whole(input.paymentDays), shortage=!!input.physicalShortage;
    if(whole(input.orderQty)===0) return {status:'MAYBE',reason:'Enter an order quantity to test an order.'};
    if(left<0) return {status:'NO',reason:'The order does not cover the costs entered.'};
    if(shortage) return {status:'MAYBE',reason:'The order leaves money after costs, but current materials or packaging are not enough for the required whole batches.'};
    if(sales>0 && left/sales<0.10) return {status:'MAYBE',reason:'The order leaves money after costs, but the amount left is thin.'};
    if(sales>0 && cash>sales*0.50) return {status:'MAYBE',reason:'The order requires substantial new money up front.'};
    if(days>=30 && cash>0) return {status:'MAYBE',reason:'The order leaves money after costs, but you must spend money now and wait '+days+' days to be paid.'};
    return {status:'YES',reason:'Based on the numbers entered, the order covers its entered costs while preserving Keep in Stock.'};
  }
  function currencyDisplay(value,options){
    const opts=options||{}, symbol=typeof opts.symbol==='string'?opts.symbol:'$', shown=num(value);
    return symbol+shown.toLocaleString(undefined,{maximumFractionDigits:20,useGrouping:true});
  }
  root.MakerHardening={planProduction,purchaseNeedForWholeBatches,orderDecision,currencyDisplay};
  if(typeof module!=='undefined'&&module.exports) module.exports=root.MakerHardening;
})(typeof globalThis!=='undefined'?globalThis:this);
