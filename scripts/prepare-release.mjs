import assert from 'node:assert/strict';
import { getNpmTag } from './release-version.mjs';
import {readFile, writeFile, access, readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {join, resolve} from 'node:path';

const version = process.argv[2];
getNpmTag(version);
function run(command, args, env = process.env) {
  const result = spawnSync(command, args, {stdio:'inherit', env, shell:process.platform === 'win32'});
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${command} failed`);
}
run(process.execPath, ['scripts/template.mjs'], {...process.env, RELEASE_VERSION:version});
const template = 'packages/create-ait-cmp-app/templates/app';
assert.equal(await access(join(template, 'vendor')).then(()=>true, ()=>false), false);
const app = JSON.parse(await readFile(join(template, 'package.json'), 'utf8'));
assert.deepEqual(Object.keys(app.dependencies), ['@apps-in-toss/web-framework']);
const host = await readFile(join(template, 'appsInTossApp/build.gradle.kts'), 'utf8');
assert.ok(host.includes(`implementation("io.github.l2hyunwoo:apps-in-toss-sdk:${version}")`));
assert.ok(host.includes(`"io.github.l2hyunwoo:apps-in-toss-sdk:${version}:web-resources@jar"`));
const settings = await readFile(join(template, 'settings.gradle.kts'), 'utf8');
assert.ok(settings.includes('mavenCentral()') && !settings.includes('vendor'));
for (const artifact of ['apps-in-toss-sdk', 'apps-in-toss-sdk-js', 'apps-in-toss-sdk-wasmjs', 'apps-in-toss-sdk-jvm']) {
  const dir = `build/template-maven/io/github/l2hyunwoo/${artifact}/${version}`;
  const pom = await readFile(`${dir}/${artifact}-${version}.pom`, 'utf8');
  for (const element of ['name','description','url','licenses','developers','scm']) assert.ok(pom.includes(`<${element}>`), `${artifact}: ${element}`);
  const files = await readdir(dir);
  assert.ok(files.includes(`${artifact}-${version}-sources.jar`));
  assert.ok(files.includes(`${artifact}-${version}-javadoc.jar`));
}
await access(`build/template-maven/io/github/l2hyunwoo/apps-in-toss-sdk/${version}/apps-in-toss-sdk-${version}-web-resources.jar`);
const manifest = 'packages/create-ait-cmp-app/package.json';
const original = await readFile(manifest, 'utf8');
try {
  await writeFile(manifest, JSON.stringify({...JSON.parse(original), version}, null, 2)+'\n');
  run('corepack', ['yarn','workspace','create-ait-cmp-app','pack','--out',resolve(`build/create-ait-cmp-app-${version}.tgz`)]);
  await access(`build/create-ait-cmp-app-${version}.tgz`);
} finally {
  await writeFile(manifest, original);
}
console.log(`Release ${version}: Maven publications and CLI archive prepared; nothing uploaded.`);
