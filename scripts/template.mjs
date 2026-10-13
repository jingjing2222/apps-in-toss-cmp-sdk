import { cp, mkdir, readFile, writeFile, rm, readdir, chmod, rename } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
const root = process.cwd();
function run(command,args) {
  const r=spawnSync(command,args,{cwd:root,stdio:'inherit',shell:process.platform==='win32'});
  if(r.error)throw r.error;if(r.status!==0)process.exit(r.status??1);
}
await rm(join(root,'build/template-maven'),{recursive:true,force:true});
run(process.platform==='win32'?'gradlew.bat':'./gradlew',[':sdk:publishAllPublicationsToTemplateRepository','--console=plain']);
const dest=join(root,'packages/create-ait-cmp-app/templates/app');
await rm(dest,{recursive:true,force:true});await mkdir(dest,{recursive:true});
for(const file of ['LICENSE','.editorconfig','eslint.config.mjs','scripts/lint-kotlin.mjs','.yarnrc.yml','licenses','gradlew','gradlew.bat','gradle','gradle.properties','build.gradle.kts','scripts/web.mjs']) {
  await cp(join(root,file),join(dest,file),{recursive:true});
}
await cp('.gitignore',join(dest,'_gitignore'));
// Yarn pack omits .github; restore the directory name when scaffolding.
await mkdir(join(dest,'_github/workflows'),{recursive:true});
const ci=(await readFile('.github/workflows/ci.yml','utf8'))
  .replace('      - name: JS 테스트\n        run: yarn test\n','')
  .replace('name: JS 린트·테스트','name: JS 린트')
  .replace(':sdk:jvmTest :sample:shared-core:jvmTest',':shared-core:jvmTest');
await writeFile(join(dest,'_github/workflows/ci.yml'),ci);
for(const module of ['shared-core','shared-ui','appsInTossApp','webApp','androidApp','iosApp']) {
  await cp(join(root,'sample',module),join(dest,module),{recursive:true,filter:p=>!p.split('/').some(s=>['build','.gradle','xcuserdata'].includes(s))});
}
await mkdir(join(dest,'vendor/npm'),{recursive:true});
await cp('build/template-maven',join(dest,'vendor/maven'),{recursive:true,filter:p=>!p.includes('-sources.jar')});
run(process.platform === 'win32' ? 'corepack.cmd' : 'corepack', ['yarn','workspace','@l2hyunwoo/apps-in-toss-cmp-bridge','pack','--out',join(dest,'vendor/npm/l2hyunwoo-apps-in-toss-cmp-bridge-0.1.0.tgz')]);
// The template ships binaries only; do not advertise omitted sources to Maven consumers.
async function stripSourceMetadata(directory) {
  for (const e of await readdir(directory, {withFileTypes:true})) {
    const p = join(directory, e.name);
    if (e.isDirectory()) { await stripSourceMetadata(p); continue; }
    let content;
    if (e.name.endsWith('.module')) {
      const metadata = JSON.parse(await readFile(p, 'utf8'));
      metadata.variants = metadata.variants.filter(v => v.attributes?.['org.gradle.category'] !== 'documentation');
      content = JSON.stringify(metadata, null, 2) + '\n';
    } else if (e.name === 'maven-metadata.xml') {
      content = (await readFile(p, 'utf8')).replace(/<snapshotVersion>[\s\S]*?<\/snapshotVersion>/g,
        value => value.includes('<classifier>sources</classifier>') ? '' : value);
    }
    if (content !== undefined) {
      await writeFile(p, content);
      for (const algorithm of ['md5', 'sha1', 'sha256', 'sha512']) {
        await writeFile(`${p}.${algorithm}`, createHash(algorithm).update(content).digest('hex'));
      }
    }
  }
}
await stripSourceMetadata(join(dest, 'vendor/maven'));
const bridgeFile=(await readdir(join(dest,'vendor/npm'))).find(f=>f.endsWith('.tgz'));
const tooling=JSON.parse(await readFile('package.json','utf8'));
const lintScripts=Object.fromEntries(Object.entries(tooling.scripts).filter(([name])=>name.startsWith('lint')));
const lintDependencies=Object.fromEntries(Object.entries(tooling.devDependencies).filter(([name])=>name!=='toss-sdk-min'));
const pkg={name:'ait-cmp-template',private:true,packageManager:'yarn@4.18.1',type:'module',engines:{node:'>=24'},scripts:{dev:'node scripts/web.mjs dev','dev:toss':'node scripts/web.mjs dev:toss',build:'node scripts/web.mjs build','dev:web':'node scripts/web.mjs dev:web','build:web':'node scripts/web.mjs build:web',...lintScripts},dependencies:{'@apps-in-toss/web-framework':'3.8.0','@l2hyunwoo/apps-in-toss-cmp-bridge':`file:vendor/npm/${bridgeFile}`},devDependencies:lintDependencies};
await writeFile(join(dest,'package.json'),JSON.stringify(pkg,null,2)+'\n');
await writeFile(join(dest,'settings.gradle.kts'),`pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositories {
        maven { url = uri("vendor/maven") }
        google()
        mavenCentral()
    }
}
rootProject.name = "__PROJECT_NAME__"
include(":shared-core", ":shared-ui", ":appsInTossApp")
if (file("webApp").isDirectory) include(":webApp")
if (file("androidApp").isDirectory) include(":androidApp")
`);
await writeFile(join(dest,'apps-in-toss.config.ts'),`import { defineConfig } from '@apps-in-toss/web-framework/config';
export default defineConfig({appName:"__APP_NAME__",brand:{primaryColor:"#3469D9"},permissions:[],navigationBar:{withBackButton:true,withHomeButton:true,theme:"light"},webBundleDir:"dist/apps-in-toss"});
`);
await writeFile(join(dest,'README.md'),`# __DISPLAY_NAME__

Compose Multiplatform으로 생성한 서비스입니다. 앱인토스 appName은 \`__APP_NAME__\`입니다.

## 실행 준비

Node 24 이상, Corepack, JDK 17이 필요합니다. Yarn 4.18.1을 사용하며 \`corepack enable\`로 yarn 명령을 활성화합니다. \`corepack yarn install --immutable\` 후 \`yarn dev\`로 명시적인 mock 예제를 실행하거나, \`yarn build\`로 \`__APP_NAME__.ait\`를 생성합니다. 업로드 전에 앱인토스 콘솔의 appName과 브랜드 정보를 맞춰야 합니다. \`yarn dev:toss\`는 실제 브리지를 로컬 네트워크에 제공합니다. 콘솔에 자동 업로드하지 않습니다.

## 코드 검사

\`yarn lint\`로 JS·TS와 Kotlin·Gradle 스크립트를 검사하고, \`yarn lint:fix\`로 자동 수정합니다. Kotlin 검사에는 JDK 17이 필요합니다.

생성된 \`.github/workflows/ci.yml\`은 main 푸시와 main 대상 PR에서 JS·TS 린트, Kotlin 린트·공통 core JVM 테스트를 실행합니다.

## 선택한 플랫폼 실행

독립 웹 타깃을 선택했다면 \`yarn dev:web\`과 \`yarn build:web\`을 사용합니다. 독립 웹 배포물에는 토스 브리지와 mock을 포함하지 않습니다.

Android에는 Android SDK 37이 필요하며 \`./gradlew :androidApp:assembleDebug\`로 빌드합니다. iOS에는 macOS와 Xcode가 필요합니다. \`iosApp/ServiceSample.xcodeproj\`를 열고 서명 정보를 설정합니다. 선택하지 않은 플랫폼의 디렉터리와 실행 명령은 사용할 수 없습니다.

## 코드 공유

\`shared-core\`는 데이터 모델과 통신 함수를 주입받는 API 클라이언트를, \`shared-ui\`는 개별 화면을 제공합니다. \`appsInTossApp\`은 토스 연동을 담당합니다. TDS는 포함하지 않습니다. 예제에서 \`저장해요\`를 누른 내용은 기기에 저장하지만, 운영 서비스에는 별도의 데이터 저장소를 연결해야 합니다.

나중에 플랫폼을 추가하려면 이 CLI 버전에 포함된 템플릿에서 필요한 호스트 디렉터리만 가져와 식별자를 바꾸고 Gradle 모듈을 등록합니다. 공통 모듈은 호스트 디렉터리 유무에 따라 Android KMP 플러그인과 iOS 타깃을 활성화합니다. SDK 저장소의 네이티브 가이드에 따라 검증합니다. CLI는 기존 파일을 덮어쓰지 않습니다.
`);
async function transform(directory) {
  for(const e of await readdir(directory,{withFileTypes:true})) {
    const p=join(directory,e.name);
    if(e.isDirectory()){await transform(p);continue;}
    if(!/\.(kt|kts|swift|pbxproj|xml|html|yml|md)$/.test(p))continue;
    let s=await readFile(p,'utf8');
    s=s.replaceAll(':sample:',':').replaceAll('io.github.l2hyunwoo.ait.sample','__PACKAGE_NAME__');
    s=s.replaceAll('implementation(project(":sdk"))','implementation("io.github.l2hyunwoo:apps-in-toss-sdk:0.1.0-SNAPSHOT")');
    s=s.replaceAll('rootProject.file("sample/', 'rootProject.file("');
    if(p.endsWith('.pbxproj')) {
      s=s.replaceAll('PRODUCT_BUNDLE_IDENTIFIER = __PACKAGE_NAME__;','PRODUCT_BUNDLE_IDENTIFIER = "__PACKAGE_NAME__";');
      s=s.replaceAll('$SRCROOT/../..','$SRCROOT/..');
      s=s.replaceAll('INFOPLIST_KEY_CFBundleDisplayName = "Service sample";','INFOPLIST_KEY_CFBundleDisplayName = "__DISPLAY_NAME__";');
    }
    if(p.endsWith('project.yml')) { await rm(p);continue; } // Generated Xcode project is sufficient.
    if(p.endsWith('AndroidManifest.xml')) s=s.replace('android:label="Service sample"','android:label="__DISPLAY_NAME__"');
    if(p.endsWith('ServiceApp.kt')) s=s.replace('나의 작은 서비스','__DISPLAY_NAME__');
    if(p.endsWith('index.html'))s=s.replace('<title>CMP 서비스</title>','<title>__DISPLAY_NAME__</title>');
    await writeFile(p,s);
  }
}
await transform(dest);
await chmod(join(dest,'gradlew'),0o755);
// A nested template needs its own project boundary before Yarn resolves it.
await writeFile(join(dest,'yarn.lock'),'');
// Generate the lock without linking packages into the bundled template.
const locked=spawnSync(process.platform === 'win32' ? 'corepack.cmd' : 'corepack', ['yarn','install','--mode=update-lockfile'], {cwd:dest,stdio:'inherit',shell:process.platform==='win32'});
if(locked.error)throw locked.error;
if(locked.status!==0)process.exit(locked.status??1);
// Avoid making the bundled template a nested Yarn project during pack.
await rename(join(dest,'yarn.lock'),join(dest,'_yarn.lock'));
await rename(join(dest,'.yarnrc.yml'),join(dest,'_yarnrc.yml'));
await rm(join(dest,'.yarn'),{recursive:true,force:true});
console.log(`Prepared ${dest}`);
