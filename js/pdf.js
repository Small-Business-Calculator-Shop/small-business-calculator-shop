'use strict';
/* Offline, selectable Unicode PDF text. Embedded TrueType subset and CID->GID mapping.
   Unsupported characters produce a visible warning instead of silent replacement. */
window.ToolkitPDF = {
 async download(title, lines, filename) {
  if(!window.ToolkitFontMap) throw Error('The PDF font mapping is missing. Please reinstall the complete application.');
  const fontResponse=await fetch('./js/report-font.ttf');
  if(!fontResponse.ok)throw Error('The embedded PDF font is unavailable. Reopen the installed application and retry.');
  const fontBytes=new Uint8Array(await fontResponse.arrayBuffer());
  const map=window.ToolkitFontMap;
  const codepoints=new Set();let missing=new Set();
  function normalize(s){return String(s??'').normalize('NFC').replace(/\r\n?/g,'\n')}
  function safe(s){let out='';for(const ch of normalize(s)){const cp=ch.codePointAt(0);if(cp>65535||!map[cp]){missing.add(ch);out+='□'}else{out+=ch;codepoints.add(cp)}}return out}
  const heading=safe(title), paragraphs=lines.map(safe);
  safe('Business Numbers Toolkit • Page 0123456789');
  if(missing.size){const chars=[...missing].slice(0,12).join(' ');throw Error('This report includes characters not supported by the embedded PDF font: '+chars+'. Replace them or use the printable HTML report. No characters were silently changed.');}
  const width=s=>Array.from(s).reduce((sum,ch)=>sum+(map[ch.codePointAt(0)]?.[1]||500),0);
  function wrap(str,maxUnits){const result=[];for(const p of str.split('\n')){let row='';for(const word of (p.match(/\S+\s*/gu)||[''])){if(row&&width(row+word)>maxUnits){result.push(row.trimEnd());row=''}for(const ch of word){if(row&&width(row+ch)>maxUnits){result.push(row.trimEnd());row=''}row+=ch}}result.push(row.trimEnd())}return result}
  const PAGE_W=595,PAGE_H=842,M=54,BOTTOM=74;
  const pages=[[]];let y=PAGE_H-72;
  function line(t,size,kind='body'){if(y<BOTTOM){pages.push([]);y=PAGE_H-64}pages[pages.length-1].push({t,y,size,kind});y-=size*1.52}
  for(const l of wrap(heading,(PAGE_W-2*M)/17*1000)){line(l,17,'title')}
  y-=20;
  for(const p of paragraphs){for(const l of wrap(p,(PAGE_W-2*M)/10.5*1000))line(l,10.5);y-=8}
  const encoder=new TextEncoder(), objects=[null], add=x=>(objects.push(x),objects.length-1);
  const fontFileId=add({dict:'/Length1 '+fontBytes.length,bytes:fontBytes});
  const gidBytes=new Uint8Array(65536*2);let widths=[];
  for(const cp of codepoints){const [gid,w]=map[cp];gidBytes[cp*2]=gid>>8;gidBytes[cp*2+1]=gid&255;widths.push(`${cp} [${w}]`)}
  const gidId=add({dict:'',bytes:gidBytes});
  const descriptorId=add(`<< /Type /FontDescriptor /FontName /DejaVuSansSubset /Flags 32 /FontBBox [-1021 -463 1794 1233] /ItalicAngle 0 /Ascent 928 /Descent -236 /CapHeight 729 /StemV 80 /FontFile2 ${fontFileId} 0 R >>`);
  const cidId=add(`<< /Type /Font /Subtype /CIDFontType2 /BaseFont /DejaVuSansSubset /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> /FontDescriptor ${descriptorId} 0 R /DW 500 /W [${widths.join(' ')}] /CIDToGIDMap ${gidId} 0 R >>`);
  const ranges=[...codepoints].sort((a,b)=>a-b).map(cp=>`<${cp.toString(16).padStart(4,'0').toUpperCase()}> <${cp.toString(16).padStart(4,'0').toUpperCase()}>`);
  const cmap=`/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def\n/CMapName /ToolkitUnicode def\n/CMapType 2 def\n1 begincodespacerange\n<0000> <FFFF>\nendcodespacerange\n${ranges.length} beginbfchar\n${ranges.join('\n')}\nendbfchar\nendcmap\nCMapName currentdict /CMap defineresource pop\nend\nend`;
  const cmapId=add({dict:'',bytes:encoder.encode(cmap)});
  const fontId=add(`<< /Type /Font /Subtype /Type0 /BaseFont /DejaVuSansSubset /Encoding /Identity-H /DescendantFonts [${cidId} 0 R] /ToUnicode ${cmapId} 0 R >>`);
  const pageTreeId=add(null),pageIds=[];
  const hex=t=>Array.from(t).map(ch=>ch.codePointAt(0).toString(16).padStart(4,'0')).join('').toUpperCase();
  for(let i=0;i<pages.length;i++){
   let commands=`0.12 0.27 0.23 rg\n54 797 487 2 re f\n`;
   for(const item of pages[i])commands+=`BT /F1 ${item.size} Tf 0.13 0.19 0.17 rg 1 0 0 1 ${M} ${item.y.toFixed(2)} Tm <${hex(item.t)}> Tj ET\n`;
   commands+=`BT /F1 8 Tf 0.4 0.45 0.43 rg 1 0 0 1 ${M} 39 Tm <${hex('Business Numbers Toolkit • Page '+(i+1))}> Tj ET\n`;
   // Footer characters must also be present in font width and CID maps.
   const contentId=add({dict:'',bytes:encoder.encode(commands)});
   const pageId=add(`<< /Type /Page /Parent ${pageTreeId} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`);pageIds.push(pageId);
  }
  objects[pageTreeId]=`<< /Type /Pages /Kids [${pageIds.map(id=>id+' 0 R').join(' ')}] /Count ${pageIds.length} >>`;
  const catalogId=add(`<< /Type /Catalog /Pages ${pageTreeId} 0 R >>`);
  let parts=[],offsets=[0],length=0;function append(data){const b=typeof data==='string'?encoder.encode(data):data;parts.push(b);length+=b.length}
  append('%PDF-1.7\n%\xE2\xE3\xCF\xD3\n');
  for(let i=1;i<objects.length;i++){offsets[i]=length;append(i+' 0 obj\n');const ob=objects[i];if(typeof ob==='string')append(ob);else{append(`<< ${ob.dict} /Length ${ob.bytes.length} >>\nstream\n`);append(ob.bytes);append('\nendstream')}append('\nendobj\n')}
  const xref=length;append(`xref\n0 ${objects.length}\n0000000000 65535 f \n`);for(let i=1;i<objects.length;i++)append(String(offsets[i]).padStart(10,'0')+' 00000 n \n');append(`trailer\n<< /Size ${objects.length} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF`);
  const blob=new Blob(parts,{type:'application/pdf'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename||'business-report.pdf';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
 }
};
