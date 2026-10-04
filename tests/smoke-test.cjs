const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('app-v13.js','utf8');
new vm.Script(source,{filename:'app-v13.js'});
let modal='';
const app={innerHTML:''};
const store={getItem:()=>null,setItem(){},removeItem(){}};
const document={
 documentElement:{style:{setProperty(){}}},
 getElementById(id){return id==='app'?app:null},
 body:{insertAdjacentHTML(_position,html){modal=html}}
};
const env=vm.createContext({document,localStorage:store,window:{},console,Date,Intl,setTimeout(){}});
vm.runInContext(source,env,{timeout:10000});
assert.match(app.innerHTML,/studio-shell/,'landing renders');
vm.runInContext('openVisualStudio()',env);
assert.match(modal,/Chế độ · Mode/,'mode selector');
assert.match(modal,/Trang phục · Wardrobe/,'wardrobe selector');
assert.match(modal,/refreshWardrobeByMode\(\)/,'mode changes wardrobe');
const sample={mode:'Black',scene:'Khách sạn',activity:'Mỡ quyết định',wardrobe:'Mỡ quyết định',color:'Tự động · tránh lặp',lighting:'Mỡ quyết định theo thực tế',camera:'50mm',notes:'',platform:'Grok Imagine',history:[],canonicalImage:''};
env.sample=sample;
const black=vm.runInContext('compileVisualPrompt(sample)',env);
assert.equal(black.resolved.scene,'Khách sạn');
assert.match(black.resolved.activity,/đang/);
env.chosen=black.resolved.wardrobe;
assert.equal(vm.runInContext('wardrobeOptions("Black").includes(chosen)',env),true);
assert.match(black.prompt,/PLATFORM GUIDANCE/);
env.sample={...sample,platform:'Midjourney',wardrobe:'Backless evening dress — silk'};
const strict=vm.runInContext('compileVisualPrompt(sample)',env);
assert.doesNotMatch(strict.resolved.wardrobe,/backless/i);
env.sample={...sample,mode:'Diary',scene:'Phòng khách ở Nhà',platform:'ChatGPT Images'};
const diary=vm.runInContext('compileVisualPrompt(sample)',env);
assert.match(diary.prompt,/Single-image visual diary/);
console.log('PASS: parse, landing, studio, mode/wardrobe, Black hotel, compliance, diary');
