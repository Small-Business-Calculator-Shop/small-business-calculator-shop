'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let blob;const anchor={click(){},remove(){}};
const font=fs.readFileSync('js/report-font.ttf');
const ctx={window:{},TextEncoder,Blob,Uint8Array,URL:{createObjectURL(b){blob=b;return 'blob:test'},revokeObjectURL(){}},fetch:async()=>({ok:true,arrayBuffer:async()=>font.buffer.slice(font.byteOffset,font.byteOffset+font.byteLength)}),document:{createElement(){return anchor},body:{appendChild(){}}},setTimeout(){}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('js/report-font-map.js','utf8'),ctx);vm.runInContext(fs.readFileSync('js/pdf.js','utf8'),ctx);
(async()=>{await ctx.window.ToolkitPDF.download('Business Cost Report', ['J$3,650 — café, Ελληνικά, Кириллица, € £ ₦', ...Array.from({length:75},(_,i)=>`Cost line ${i+1}: $25.00`)],'test.pdf');assert(blob);const buf=await blob.arrayBuffer();fs.writeFileSync('/tmp/bnt-test.pdf',Buffer.from(buf));await assert.rejects(ctx.window.ToolkitPDF.download('Unsupported glyphs',['日本語']),/not supported by the embedded PDF font/);console.log('PASS: selectable Unicode PDF generated; unsupported glyphs rejected',buf.byteLength,'bytes')})().catch(e=>{console.error(e);process.exitCode=1});
