/* Maker Calculator™ launch-hardening engine
 * Conservative rules: preserve measurement units, plan whole batches,
 * restore Keep in Stock, retain excess production as finished inventory,
 * and keep currency rounding as display-only.
 */
(function(root){
  'use strict';

  function num(v){ const x=Number(v); return Number.isFinite(x)?x:0; }
  function whole(v){ return Math.max(0,Math.floor(num(v))); }

  function planProduction(input){
    const order=whole(input.orderQty);
    const finished=whole(input.finishedOnHand);
    const keep=whole(input.keepInStock);
    const yieldPerBatch=whole(input.sellableYield);
    if(yieldPerBatch<1) throw new Error('Sellable yield must be at least 1 product per batch.');

    const availableForOrder=Math.max(0,finished-keep);
    const usedFromFinished=Math.min(order,availableForOrder);
    const orderStillToMake=order-usedFromFinished;
    const stockShortfall=Math.max(0,keep-finished);
    const unitsRequired=orderStillToMake+stockShortfall;
    const batchesRequired=unitsRequired>0?Math.ceil(unitsRequired/yieldPerBatch):0;
    const unitsProduced=batchesRequired*yieldPerBatch;
    const excessAfterRequirements=Math.max(0,unitsProduced-unitsRequired);
    const finishedAfterOrder=keep+excessAfterRequirements;

    return {order,finished,keep,yieldPerBatch,availableForOrder,usedFromFinished,orderStillToMake,stockShortfall,unitsRequired,batchesRequired,unitsProduced,excessAfterRequirements,finishedAfterOrder};
  }

  // Rows are deliberately unit-agnostic here. `usedPerBatch` and `onHand`
  // MUST already be expressed in the same preserved unit by the existing
  // same-dimension conversion layer. This function never converts units.
  function purchaseNeedForWholeBatches(rows,batchesRequired){
    return (rows||[]).map(function(row){
      const usedPerBatch=num(row.usedPerBatch);
      const onHand=num(row.onHand);
      const required=usedPerBatch*whole(batchesRequired);
      const short=Math.max(0,required-onHand);
      return {name:row.name||'',unit:row.unit||'',usedPerBatch,onHand,required,short};
    });
  }

  function orderDecision(input){
    const sales=num(input.orderSales), left=num(input.orderLeft), cash=num(input.newCashNeeded), days=whole(input.paymentDays);
    const shortage=!!input.physicalShortage;
    if(whole(input.orderQty)===0) return {status:'MAYBE',reason:'Enter an order quantity to test an order.'};
    if(left<0) return {status:'NO',reason:'The order does not cover the costs entered.'};
    if(shortage) return {status:'MAYBE',reason:'The order leaves money after costs, but current materials or packaging are not enough for the required whole batches.'};
    if(sales>0 && left/sales<0.10) return {status:'MAYBE',reason:'The order leaves money after costs, but the amount left is thin.'};
    if(sales>0 && cash>sales*0.50) return {status:'MAYBE',reason:'The order requires substantial new money up front.'};
    if(days>=30 && cash>0) return {status:'MAYBE',reason:'The order leaves money after costs, but you must spend money now and wait '+days+' days to be paid.'};
    return {status:'YES',reason:'Based on the numbers entered, the order covers its entered costs while preserving Keep in Stock.'};
  }

  function currencyDisplay(value,options){
    const opts=options||{};
    const round=!!opts.round;
    const decimals=round?0:Math.max(0,Math.min(6,Number.isInteger(opts.decimals)?opts.decimals:2));
    const symbol=typeof opts.symbol==='string'?opts.symbol:'$';
    const shown=round?Math.round(num(value)):num(value);
    return symbol+shown.toLocaleString(undefined,{minimumFractionDigits:decimals,maximumFractionDigits:decimals});
  }

  // Currency rounding is intentionally display-only. Never feed the formatted
  // or rounded value back into product, order, inventory, or promotion math.
  root.MakerHardening={planProduction,purchaseNeedForWholeBatches,orderDecision,currencyDisplay};
  if(typeof module!=='undefined'&&module.exports) module.exports=root.MakerHardening;
})(typeof globalThis!=='undefined'?globalThis:this);
