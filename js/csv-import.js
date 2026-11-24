'use strict';
// Small RFC 4180-style CSV reader for offline spreadsheet imports.
window.ToolkitCSV={
 parse(text,maxRows=5000){
  if(typeof text!=='string')throw Error('The file could not be read as text.');
  const input=text.replace(/^\uFEFF/,'');
  const rows=[];let row=[],field='',quoted=false,closedQuote=false;
  for(let i=0;i<input.length;i++){
   const c=input[i];
   if(quoted){
    if(c==='"'){if(input[i+1]==='"'){field+='"';i++}else{quoted=false;closedQuote=true}}
    else field+=c;
    continue;
   }
   if(closedQuote&&c!==','&&c!=='\r'&&c!=='\n'&&c!==' '&&c!=='\t')throw Error(`Unexpected character after a quoted field near row ${rows.length+1}.`);
   if(c==='"'){
    if(field.trim())throw Error(`Unexpected quote in an unquoted field near row ${rows.length+1}.`);
    field='';quoted=true;closedQuote=false;
   }else if(c===','){row.push(field);field='';closedQuote=false}
   else if(c==='\n'||c==='\r'){
    if(c==='\r'&&input[i+1]==='\n')i++;
    row.push(field);field='';closedQuote=false;
    if(row.some(x=>String(x).trim()!==''))rows.push(row);
    row=[];
    if(rows.length>maxRows+1)throw Error(`This file has more than ${maxRows} data rows. Split it into smaller CSV files and import them separately.`);
   }else{field+=c;if(c!==' '&&c!=='\t')closedQuote=false}
  }
  if(quoted)throw Error('The CSV ends inside a quoted field. Check the spreadsheet export and try again.');
  row.push(field);if(row.some(x=>String(x).trim()!==''))rows.push(row);
  if(rows.length>maxRows+1)throw Error(`This file has more than ${maxRows} data rows. Split it into smaller CSV files and import them separately.`);
  if(rows.length<2)throw Error('The CSV needs a header row and at least one data row.');
  const headers=rows.shift().map(x=>String(x).trim());
  if(headers.some(x=>!x))throw Error('Every column needs a heading in the first row.');
  const seen=new Set();for(const h of headers){const k=h.toLocaleLowerCase();if(seen.has(k))throw Error(`The column heading “${h}” appears more than once. Rename duplicate headings and try again.`);seen.add(k)}
  return {headers,rows:rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,String(r[i]??'').trim()]))) };
 }
};
