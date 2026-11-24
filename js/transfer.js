'use strict';
// Portable exchange format. This parser does not claim to import into a separate FyscalOS application.
window.ToolkitTransfer={
 parse(input){
  if(!input||typeof input!=='object'||Array.isArray(input)||input.format!=='fyscalos-toolkit-transfer'||input.schemaVersion!==1)throw Error('Unsupported transfer format or version.');
  const obj=(v,name)=>{if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Invalid '+name);return v};
  const array=(value,name)=>{if(!Array.isArray(value)||value.length>100000)throw Error('Invalid '+name+' records.');value.forEach((v,i)=>{if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Invalid '+name+' record '+(i+1))});return value};
  const money=(v,name)=>{const n=Number(v??0);if(!Number.isFinite(n)||n<0||n>1e12)throw Error('Invalid '+name);return n};
  const profile=obj(input.business,'business profile');
  const clean={profile,records:array(input.activities,'activities'),prices:array(input.pricingDecisions,'pricing'),offers:array(input.sellingDecisions,'selling'),scenarios:array(input.planningScenarios,'planning'),contacts:array(input.contacts||[],'contacts'),customCategories:array(input.customCostCategories||[],'custom categories'),monthlyFixedCosts:money(input.monthlyFixedCosts,'monthly fixed costs'),monthlyGoal:money(input.monthlyGoal,'monthly goal')};
  if(JSON.stringify(clean).length>15e6)throw Error('Transfer file exceeds the safe import size.');
  return clean;
 }
};
