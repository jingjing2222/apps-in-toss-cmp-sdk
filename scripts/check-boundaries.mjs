import { readdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { join } from 'node:path';
async function files(dir) {
  const result=[];
  for(const e of await readdir(dir,{withFileTypes:true})) {
    if(['build','node_modules','.gradle'].includes(e.name))continue;
    const p=join(dir,e.name); if(e.isDirectory())result.push(...await files(p));else result.push(p);
  }
  return result;
}
for(const dir of ['sample/shared-core','sample/shared-ui','sample/webApp']) {
  for(const p of await files(dir)) {
    if(!/\.(kt|kts|html)$/.test(p))continue;
    const content=await readFile(p,'utf8');
    assert(!/@apps-in-toss|@toss\/tds|io\.github\.l2hyunwoo\.ait\.(?!sample)/.test(content),`Host dependency leaked into ${p}`);
  }
}
for(const p of await files('sample/shared-core')) {
  if(p.endsWith('.kt'))assert(!/import androidx\.compose/.test(await readFile(p,'utf8')),`UI dependency in core: ${p}`);
}
console.log('Shared core/UI and standalone web are independent of Toss and TDS.');
