'use strict';
window.ToolkitEngine={
 evaluateFormula(expression,values){
  // Strict arithmetic parser. No eval, functions, property access, or executable JavaScript.
  const src=String(expression||'').trim();
  if(src.length>160)throw Error('Formula is too long (maximum 160 characters).');
  const tokens=(src.match(/\s*(?:\d+(?:\.\d+)?|\.\d+|amount|quantity|[()+*/-])\s*/gy)||[]).map(x=>x.trim());
  if(tokens.join('').replace(/\s/g,'')!==src.replace(/\s/g,''))throw Error('Formula contains an unsupported character or name.');
  let i=0;
  const atom=()=>{const t=tokens[i++];if(t==='-')return -atom();if(t==='+')return atom();if(t==='('){const v=expr();if(tokens[i++]!==')')throw Error('Missing closing parenthesis.');return v}if(t==='amount'||t==='quantity')return values[t];if(t!==undefined&&/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(t))return Number(t);throw Error('Invalid formula expression.')};
  const mul=()=>{let v=atom();while(tokens[i]==='*'||tokens[i]==='/'){const op=tokens[i++],rhs=atom();if(op==='/'&&rhs===0)throw Error('Formula cannot divide by zero.');v=op==='*'?v*rhs:v/rhs}return v};
  const expr=()=>{let v=mul();while(tokens[i]==='+'||tokens[i]==='-'){const op=tokens[i++],rhs=mul();v=op==='+'?v+rhs:v-rhs}return v};
  const result=expr();if(i!==tokens.length||!Number.isFinite(result)||result<0)throw Error('Formula must produce a finite nonnegative cost.');return result;
 },
 customCost(rows){return (rows||[]).reduce((sum,x)=>{const amount=Number(x.amount),qty=Number(x.quantity??1);if(!Number.isFinite(amount)||amount<0||!Number.isFinite(qty)||qty<=0)throw Error('Enter valid nonnegative cost amounts and positive quantities.');return sum+(x.formula?this.evaluateFormula(x.formula,{amount,quantity:qty}):amount*qty)},0)},
 analyze(r,base){const direct=base(r),custom=this.customCost(r.customCosts),waste=Number(r.wastePercent||0),overhead=Number(r.overhead||0);if(!Number.isFinite(waste)||waste<0||waste>=100)throw Error('Waste percentage must be from 0 to less than 100.');if(!Number.isFinite(overhead)||overhead<0)throw Error('Overhead must not be negative.');if(!Number.isFinite(Number(r.yield))||Number(r.yield)<=0)throw Error('Yield must be positive.');const adjusted=(direct.materials+direct.packaging+custom)/(1-waste/100),total=adjusted+direct.labor+direct.other+overhead,unit=total/Number(r.yield);return {...direct,custom,wasteAllowance:adjusted-(direct.materials+direct.packaging+custom),overhead,total,unit,remaining:Number(r.price||0)-unit,margin:Number(r.price)>0?(Number(r.price)-unit)/Number(r.price)*100:0}},
 breakEven({price,variableCost,fixedCosts}){const contribution=Number(price)-Number(variableCost);if(!Number.isFinite(contribution)||!Number.isFinite(Number(fixedCosts))||Number(fixedCosts)<0)return null;return contribution>0?Math.ceil(Number(fixedCosts)/contribution):null},
 salesTarget({price,variableCost,fixedCosts,goal}){const contribution=Number(price)-Number(variableCost);return contribution>0?Math.ceil((Number(fixedCosts)+Number(goal))/contribution):null}
};
