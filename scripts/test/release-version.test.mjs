import {test} from 'node:test';
import assert from 'node:assert/strict';
import { getNpmTag } from '../release-version.mjs';

test('stable releases use latest; prereleases stay on their own npm channel',()=>{
  for (const [version,channel] of [['1.0.0','latest'],['1.0.0-alpha01','alpha'],['1.0.0-beta02','beta'],['1.0.0-rc01','rc']]) assert.equal(getNpmTag(version),channel);
});
test('invalid versions cannot reach release paths or shell commands',()=>{
  for (const version of [undefined,'','v1.0.0','01.0.0','1.0.0-SNAPSHOT','1.0.0-alpha','1.0.0-alpha01/other','1.0.0;echo invalid','1.0.0\n']) assert.throws(()=>getNpmTag(version));
});
