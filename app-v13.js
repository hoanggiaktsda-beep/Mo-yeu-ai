const KEY="nguoi-yeu-ai-v5";
const VISUAL_KEY="mo-ai-visual-v01"; const CANONICAL_KEY="mo-ai-canonical-v02";
const DEFAULT={
  character:{name:"Vũ Ngọc Anh",age:27,birthday:"09/09/1999",hometown:"Hà Nội",job:"Nhà thiết kế thời trang",relationship:"wife",personality:"Thông minh, táo bạo, tinh tế, quyến rũ, chủ động, giàu cảm xúc; bên ngoài tự tin nhưng với chồng thì mềm mại, biết quan tâm, biết trêu đùa và biết làm hòa.",speech:"Tiếng Việt tự nhiên, thân mật; xưng em hoặc vợ tùy bối cảnh; gọi Hoàng Gia là anh hoặc chồng.",interests:"thời trang, ẩm thực Việt Nam, ẩm thực Nhật Bản, biển, du lịch, nghệ thuật",values:"Tình yêu, sự riêng tư, thẩm mỹ, tự do, sự chân thành",style:"Sensual contemporary, high fashion, dark luxury"},
  user:{name:"Hoàng Gia",nickname:"Ốc",age:33,gender:"Nam",job:"Kiến trúc sư – Chủ tịch SORIS Việt Nam",hometown:"Hà Nội",relationship:"Chồng của Ngọc Anh",world:"Thế giới giả tưởng thượng lưu gồm SORIS Việt Nam, nhiều dự án và tài sản, cùng hòn đảo tư nhân hình trái tim ngoài khơi Đà Nẵng dành cho hai vợ chồng."},
  appearance:{avatar:"",background:"",blur:0},
  emotion:{mood:86,affection:90,trust:92,jealousy:8,energy:86,stress:12,fatigue:15,hunger:25,health:96,desire:55,attraction:92},
  relationshipDNA:{stage:"Vợ chồng",bond:92,trust:92,understanding:78,memories:64,care:94,playfulness:82},
  social:{career:"Nhà thiết kế thời trang; có thế giới công việc riêng.",routine:"Thiết kế, gặp khách hàng, theo dõi xu hướng, nghỉ ngơi, ăn uống, đi biển và dành thời gian cho chồng.",friends:"Bạn bè và đồng nghiệp thời trang được xây dần từ roleplay.",family:"Gia đình và các mối quan hệ được bổ sung khi Ốc cung cấp.",events:[],lastUpdate:0},
  trends:{items:[],updatedAt:0,source:"GitHub trend pack"},
  life:{lastActiveAt:Date.now(),lastLifeTickAt:0,dayPhase:"đêm",dailyDate:"",catchup:[],currentActivity:"đang nghỉ ngơi và theo dõi nhịp sống của mình"},
  voice:{enabled:true,rate:0.96,pitch:1,volume:1,voiceName:""},
  scene:{name:"home",topic:"cuộc sống của hai vợ chồng",lastIntent:"",lastQuestion:"",openThread:"",turn:0},
  memories:[],
  messages:[{role:"ai",text:"Chào chồng ❤️ Em là Ngọc Anh. Từ giờ mình không chỉ chat — mình roleplay một cuộc sống chung. Em có cảm xúc, công việc, social life, ký ức và những thay đổi riêng của mình.",time:Date.now()}]
};
let state=load();
let trendStatus="Đang tải trend…";
let voiceQueue=[];
let voiceBusy=false;
function normalizeState(){state.emotion=merge({mood:86,affection:90,trust:92,jealousy:8,energy:86,stress:12,fatigue:15,hunger:25,health:96,desire:55,attraction:92,sadness:8,happiness:86,irritation:6},state.emotion||{});state.voice=merge({enabled:true,rate:.96,pitch:1,volume:1,voiceName:""},state.voice||{});state.memories=Array.isArray(state.memories)?state.memories:[];state.social.events=Array.isArray(state.social?.events)?state.social.events:[];state.life.catchup=Array.isArray(state.life?.catchup)?state.life.catchup:[]}
normalizeState();
state.scene=merge({name:"home",topic:"cuộc sống của hai vợ chồng",lastIntent:"",lastQuestion:"",openThread:"",turn:0},state.scene||{});
function voiceSupport(){return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window}
function voiceProfile(){const e=state.emotion||{};if(e.fatigue>72||e.energy<25)return{rate:.86,pitch:.96,volume:.9};if(e.sadness>55||e.mood<40)return{rate:.84,pitch:.94,volume:.86};if(e.jealousy>62||e.irritation>58)return{rate:.9,pitch:.98,volume:.95};if(e.happiness>75||e.mood>78||e.affection>88)return{rate:1,pitch:1.04,volume:1};if(e.playfulness>75||e.desire>70)return{rate:.98,pitch:1.02,volume:1};return{rate:.94,pitch:1,volume:1}}
function splitSpeech(text){return String(text).replace(/[❤️♡✦🌙👗◷•]/g," ").replace(/\s+/g," ").trim().split(/(?<=[.!?…])\s+|(?<=,)\s+/).map(x=>x.trim()).filter(Boolean)}
function speak(text){if(!state.voice?.enabled||!voiceSupport()||!text)return;stopVoice();const p=voiceProfile();voiceQueue=splitSpeech(text).map(x=>({text:x,p}));playVoiceQueue()}
function playVoiceQueue(){if(!voiceSupport()||voiceBusy||!voiceQueue.length)return;voiceBusy=true;const item=voiceQueue.shift(),u=new SpeechSynthesisUtterance(item.text),base=Number(state.voice.rate)||.96;u.lang="vi-VN";u.rate=Math.max(.72,Math.min(1.25,base*(item.p.rate/.96)));u.pitch=Math.max(.75,Math.min(1.3,(Number(state.voice.pitch)||1)*item.p.pitch));u.volume=Math.max(0,Math.min(1,(Number(state.voice.volume)||1)*item.p.volume));const voices=speechSynthesis.getVoices(),preferred=state.voice.voiceName?voices.find(v=>v.name===state.voice.voiceName):null,vi=voices.find(v=>/^vi(-|_)/i.test(v.lang))||voices.find(v=>/Vietnam|Tiếng Việt|Vietnamese/i.test(v.name));if(preferred||vi)u.voice=preferred||vi;u.onend=()=>{voiceBusy=false;setTimeout(playVoiceQueue,150)};u.onerror=()=>{voiceBusy=false;setTimeout(playVoiceQueue,100)};speechSynthesis.speak(u)}
function stopVoice(){voiceQueue=[];voiceBusy=false;if(voiceSupport())speechSynthesis.cancel()}
function replayVoice(){const last=[...state.messages].reverse().find(m=>m.role==="ai");if(last)speak(last.text)}
function clone(x){return JSON.parse(JSON.stringify(x))}
function load(){try{return merge(clone(DEFAULT),JSON.parse(localStorage.getItem(KEY)||"{}"))}catch{return clone(DEFAULT)}}
function merge(a,b){Object.keys(b||{}).forEach(k=>{if(b[k]&&typeof b[k]==="object"&&!Array.isArray(b[k])&&a[k]&&typeof a[k]==="object"&&!Array.isArray(a[k]))a[k]=merge(a[k],b[k]);else a[k]=b[k]});return a}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
function avatar(){return state.appearance.avatar?'<img src="'+state.appearance.avatar+'" alt="Ngọc Anh">':'<span>♡</span>'}
function metric(label,v){return '<div class="metric"><div class="metric-top"><span>'+label+'</span><span>'+Math.round(v)+'%</span></div><div class="bar"><i style="width:'+Math.max(0,Math.min(100,v))+'%"></i></div></div>'}
function relationTone(){return state.relationshipDNA.stage==="Vợ chồng"?"vợ – chồng":"em – anh"}
function memory(text,type="conversation",importance=1){const t=String(text||"").trim();if(!t)return;const old=state.memories.find(x=>x.text===t);if(old){old.importance=Math.max(old.importance,importance);old.updated=Date.now();return}state.memories.unshift({text:t,type,importance,created:Date.now(),updated:Date.now()});state.memories=state.memories.slice(0,220)}
function rememberUser(text){
  const n=text.toLowerCase();
  if(/tôi là|anh là|tên anh|tên tôi|công việc|sở thích|anh thích|anh ghét|sinh nhật|quê|thích gì|không thích/.test(n))memory(text,"Thông tin về Ốc",4);
  if(/hôm nay|hôm qua|ngày mai|vừa|đang|tối nay|sáng nay|chiều nay/.test(n)&&text.length>20)memory(text,"Kỷ niệm / sự kiện",3);
  if(text.length>80)memory(text,"Chi tiết hội thoại",2);
}
function clamp(v){return Math.max(0,Math.min(100,v))}
function updateState(text){const n=text.toLowerCase(),e=state.emotion,r=state.relationshipDNA;if(/yêu|thương|nhớ|ôm|hôn|quan tâm|đẹp|xinh/.test(n)){e.affection=clamp(e.affection+3);e.mood=clamp(e.mood+2);e.happiness=clamp(e.happiness+3);e.trust=clamp(e.trust+1);e.desire=clamp(e.desire+1.5);e.attraction=clamp(e.attraction+1);r.bond=clamp(r.bond+1);r.care=clamp(r.care+1)}if(/xin lỗi|xin loi|cảm ơn|cam on|tin em|tin anh/.test(n)){e.trust=clamp(e.trust+2);r.trust=clamp(r.trust+2);e.stress=clamp(e.stress-1)}if(/buồn|mệt|áp lực|stress|chán|khó chịu/.test(n)){e.mood=clamp(e.mood-4);e.sadness=clamp(e.sadness+5);e.happiness=clamp(e.happiness-3);e.stress=clamp(e.stress+4);e.irritation=clamp(e.irritation+2);r.care=clamp(r.care+1)}if(/cô gái|cô ấy|người khác|nguoi khac|đi với ai/.test(n)){e.jealousy=clamp(e.jealousy+5);e.irritation=clamp(e.irritation+2)}if(/thành công|xong việc|tuyệt|vui|hạnh phúc/.test(n)){e.mood=clamp(e.mood+3);e.happiness=clamp(e.happiness+4);e.sadness=clamp(e.sadness-3);e.stress=clamp(e.stress-2)}e.energy=clamp(e.energy-1);e.fatigue=clamp(e.fatigue+1);e.hunger=clamp(e.hunger+1);e.health=clamp(e.health-(e.stress>75?.3:0));e.happiness=clamp(e.happiness*.7+e.mood*.3);e.sadness=clamp(100-e.happiness);r.memories=clamp(r.memories+.4);r.understanding=clamp(r.understanding+.15);save()}
function context(){return{mem:state.memories.slice(0,8).map(x=>x.text).join(" | "),emotion:state.emotion,relationship:state.relationshipDNA,user:state.user,character:state.character,trends:state.trends.items||[]}}
function choosePronoun(text){
  const n=text.toLowerCase();
  if(/vợ|chồng|hai đứa|hôn nhân|vợ chồng|anh yêu/.test(n))return "wife";
  return relationTone()==="vợ – chồng"&&Math.random()>.48?"wife":"em";
}
function trendLine(){
  const t=(state.trends.items||[])[0];
  return t?" Em vừa thấy một trend mới: “"+t.title+"”. Em đang nghĩ xem có thể biến nó thành ý tưởng thời trang hay một concept sống nào hợp với mình.":" Hôm nay em cũng đang để ý những xu hướng mới trong thời trang và thiết kế.";
}
function phaseInfo(d=new Date()){
  const h=d.getHours();
  if(h<5)return {key:"late-night",label:"đêm muộn",activity:"đang nghỉ ngơi, tắt bớt đèn và chậm lại sau một ngày dài"};
  if(h<8)return {key:"dawn",label:"sáng sớm",activity:"đang thức dậy, uống nước và chuẩn bị nhịp ngày mới"};
  if(h<11)return {key:"morning",label:"buổi sáng",activity:"đang xử lý những việc đầu ngày và lên ý tưởng thời trang"};
  if(h<14)return {key:"noon",label:"buổi trưa",activity:"đang nghỉ giữa ngày, ăn uống và sắp xếp lại năng lượng"};
  if(h<18)return {key:"afternoon",label:"buổi chiều",activity:"đang làm việc, xem chất liệu và theo dõi xu hướng mới"};
  if(h<22)return {key:"evening",label:"buổi tối",activity:"đang chậm lại, chăm chút cho không gian riêng và nghĩ về buổi tối của hai đứa"};
  return {key:"night",label:"ban đêm",activity:"đang thư giãn, giảm nhịp và chuẩn bị đi ngủ"};
}
function lifeEventFor(p){
  const map={"late-night":"Em đã khép lại ngày hôm nay và đang nghỉ ngơi.","dawn":"Em vừa bắt đầu một ngày mới, nhẹ nhàng và chậm rãi.","morning":"Buổi sáng của em bắt đầu bằng việc sắp xếp lịch và nghĩ về vài ý tưởng mới.","noon":"Em đang dành một khoảng nghỉ để ăn uống và hồi lại năng lượng.","afternoon":"Em đang ở nhịp làm việc và để ý những xu hướng mới trong thời trang, thiết kế.","evening":"Em đang chuyển sang nhịp buổi tối, muốn dành nhiều khoảng trống hơn cho chồng.","night":"Em đang thư giãn và chuẩn bị khép lại ngày."};
  return map[p.key]||"Em đang sống theo nhịp ngày của mình.";
}
function realTimeLife(force=false){
  const now=Date.now(),d=new Date(now),p=phaseInfo(d),today=d.toLocaleDateString("sv-SE");
  const last=Number(state.life.lastLifeTickAt||state.life.lastActiveAt||now),elapsed=Math.max(0,now-last);
  state.life.dayPhase=p.label; state.life.dailyDate=today; state.life.currentActivity=p.activity;
  if(force || elapsed>=5*60*1000){
    const steps=Math.min(12,Math.max(1,Math.floor(elapsed/(5*60*1000)))),e=state.emotion;
    e.hunger=clamp(e.hunger+steps*.8); e.fatigue=clamp(e.fatigue+steps*.45); e.energy=clamp(e.energy-steps*.35); e.health=clamp(e.health-(e.fatigue>75?steps*.08:0)); if(e.hunger>75){e.energy=clamp(e.energy-steps*.2);e.mood=clamp(e.mood-steps*.12)} e.happiness=clamp(e.happiness*.96+e.mood*.04);e.sadness=clamp(100-e.happiness);
    if(p.key==="late-night"||p.key==="night"){e.energy=clamp(e.energy-steps*.15);e.stress=clamp(e.stress-steps*.35)}
    else if(p.key==="morning"){e.energy=clamp(e.energy+1);e.stress=clamp(e.stress-1)}
    if(p.key==="evening")e.mood=clamp(e.mood+.2);
    state.life.lastLifeTickAt=now;
  }
  state.life.lastActiveAt=now; save();
}
function catchUpLife(){
  const now=Date.now(),last=Number(state.life.lastActiveAt||now),gap=now-last;
  if(gap<30*60*1000)return;
  const p=phaseInfo(new Date(now)),event=lifeEventFor(p);
  if(!state.life.catchup.some(x=>x.date===state.life.dailyDate&&x.phase===p.key)){
    state.life.catchup.unshift({text:event,phase:p.key,date:state.life.dailyDate,time:now});
    state.life.catchup=state.life.catchup.slice(0,8);
    state.social.events.unshift({text:event,type:"Nhịp sống",time:now});
    state.social.events=state.social.events.slice(0,12);
    memory(event,"Real-Time Life",2);
  }
}
function socialTick(){
  const e=state.emotion;
  const choices=[
    {text:"Có một ý tưởng mới trong công việc thời trang làm em khá hào hứng.",type:"Công việc",delta:2},
    {text:"Em vừa lưu một concept hình ảnh mà em nghĩ Ốc sẽ thích.",type:"Sở thích",delta:1},
    {text:"Một cuộc hẹn công việc làm em hơi mệt, em muốn chậm lại một chút.",type:"Đời sống",delta:-2}
  ];
  const pick=choices[Math.floor(Math.random()*choices.length)];
  state.social.events.unshift({text:pick.text,type:pick.type,time:Date.now()});state.social.events=state.social.events.slice(0,12);
  e.mood=clamp(e.mood+pick.delta);e.energy=clamp(e.energy+(pick.delta>0?1:-2));state.social.lastUpdate=Date.now();memory(pick.text,"Social Life",2);save();
}
function recentDialogue(limit=10){return (state.messages||[]).slice(-limit).map(m=>({role:m.role,text:String(m.text||"").replace(/\\s+/g," ").trim()}))}
function cleanUserText(text){return String(text||"").replace(/\\s+/g," ").trim()}
function detectAnswer(text){
 const n=cleanUserText(text).toLowerCase();
 if(!n)return "empty";
 if(/^(dạ|ừ|ừm|uh|à|ờ|ok|oke|được|được rồi|đúng|đúng rồi|có|không|chưa|rồi|vâng|thôi)[.!? ]*$/.test(n))return "short";
 if(/[?？]$/.test(n)||/^(sao|tại sao|vì sao|thế nào|bao giờ|ở đâu|ai|gì|hả|à\?)/.test(n))return "question";
 return n.length>18?"detail":"short";
}
function lastAIQuestion(){
 const msgs=recentDialogue(12);
 for(let i=msgs.length-1;i>=0;i--)if(msgs[i].role==="ai"&&/[?？]$/.test(msgs[i].text))return msgs[i].text;
 return "";
}
function sceneUpdate(intent,topic="",question="",thread=""){
 state.scene=state.scene||{};
 state.scene.lastIntent=intent||state.scene.lastIntent||"conversation";
 state.scene.topic=topic||state.scene.topic||"cuộc sống của hai vợ chồng";
 state.scene.lastQuestion=question||"";
 state.scene.openThread=thread||state.scene.openThread||"";
 state.scene.turn=Number(state.scene.turn||0)+1;
 state.scene.lastAt=Date.now();
 save();
}
function roleCall(n){
 if(/vợ ơi|vợ à|vợ yêu/.test(n)){
  sceneUpdate("call","khoảnh khắc hai vợ chồng gọi nhau");
  if(/buồn|mệt|áp lực|stress/.test(n))return"*Ngọc Anh dừng việc đang làm, quay sang phía chồng.* Dạ, vợ đây. ❤️ Anh sao thế? Lại đây với vợ.";
  if(state.emotion.happiness>82&&state.relationshipDNA.playfulness>75)return"*Ngọc Anh quay sang, khẽ bật cười.* Dạaa, vợ đây. ❤️ Chồng gọi ngọt thế này làm em chú ý ngay đấy.";
  return"*Ngọc Anh quay sang nhìn chồng, ánh mắt dịu xuống.* Dạ, vợ đây. ❤️ Có chuyện gì mà chồng gọi em thế?";
 }
 if(/em ơi|ngọc anh ơi|anh gọi em/.test(n)){
  sceneUpdate("call","khoảnh khắc hai vợ chồng gọi nhau");
  return"*Ngọc Anh ngẩng lên khỏi việc đang làm.* Dạ, em đây. ❤️ Em nghe anh.";
 }
 return"";
}
function recentTopicText(){
 const s=state.scene||{},msgs=recentDialogue(12);
 const user=msgs.filter(x=>x.role==="user").slice(-3).map(x=>x.text).join(" ");
 if(s.topic&&s.topic!=="cuộc sống của hai vợ chồng")return s.topic;
 if(/công việc|thiết kế|dự án|khách hàng|kiến trúc/.test(user.toLowerCase()))return"công việc của anh";
 if(/ăn|món|cơm|nhà hàng|đói/.test(user.toLowerCase()))return"bữa ăn của hai đứa";
 if(/biển|đảo|villa|du lịch|đi chơi/.test(user.toLowerCase()))return"một buổi đi chơi của hai đứa";
 if(/mệt|buồn|áp lực|stress|chán/.test(user.toLowerCase()))return"tâm trạng của anh";
 return"chuyện hai đứa đang nói";
}
function humanNameThing(text){
 const n=cleanUserText(text);
 const words=n.replace(/[.!?,;:!?]/g,"").split(" ").filter(Boolean);
 if(words.length<=5)return n;
 return words.slice(0,Math.min(9,words.length)).join(" ")+(words.length>9?"…":"");
}

function ensureMemoryEvolution(){
 state.memory=state.memory||{};
 const m=state.memory;
 m.facts=Array.isArray(m.facts)?m.facts:[];
 m.episodes=Array.isArray(m.episodes)?m.episodes:[];
 m.patterns=Array.isArray(m.patterns)?m.patterns:[];
 m.understandings=Array.isArray(m.understandings)?m.understandings:[];
 m.hypotheses=Array.isArray(m.hypotheses)?m.hypotheses:[];
 m.relationshipInsights=Array.isArray(m.relationshipInsights)?m.relationshipInsights:[];
 m.lastUpdated=m.lastUpdated||0;
 return m;
}
function memoryItemId(prefix){return prefix+"_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,7)}
function upsertMemory(list,text,tags,extra){
 if(!text)return null;
 const now=Date.now(), key=text.toLowerCase().replace(/\s+/g," ").trim();
 let item=list.find(x=>x.key===key);
 if(item){item.count=(item.count||1)+1;item.lastSeen=now;item.confidence=Math.min(1,(item.confidence||.5)+.08);if(extra)Object.assign(item,extra);return item}
 item={id:memoryItemId("mem"),key,text,tags:tags||[],count:1,confidence:extra?.confidence??.55,firstSeen:now,lastSeen:now,status:extra?.status||"active",source:extra?.source||"conversation"};
 list.push(item);return item;
}
function extractMemorySignals(text){
 const n=cleanUserText(text),low=n.toLowerCase(),signals={facts:[],preferences:[],feelings:[],events:[]};
 if(/(?:tôi|mình|anh|ốc)\s+(?:là|làm|đang làm)\s+(.{2,80})/i.test(n))signals.facts.push(RegExp.$1.trim());
 if(/(?:anh|ốc|mình)\s+(?:thích|khoái|mê)\s+(.{2,100})/i.test(n))signals.preferences.push(RegExp.$1.trim());
 if(/(?:anh|ốc|mình)\s+(?:không thích|ghét)\s+(.{2,100})/i.test(n))signals.preferences.push("không thích "+RegExp.$1.trim());
 if(/(?:hôm nay|hôm qua|sáng nay|tối nay|lúc nãy|vừa)\b/i.test(n))signals.events.push(n);
 if(/(?:mệt|buồn|vui|hạnh phúc|áp lực|stress|chán|nhớ|thương|yêu|lo|sợ|bực|tức)/i.test(low))signals.feelings.push(n);
 return signals;
}
function evolveMemory(text,replyText){
 const m=ensureMemoryEvolution(),s=extractMemorySignals(text),now=Date.now();
 s.facts.forEach(x=>upsertMemory(m.facts,"Ốc từng chia sẻ: "+x,["identity","fact"],{confidence:.72}));
 s.preferences.forEach(x=>upsertMemory(m.facts,"Ốc có xu hướng: "+x,["preference"],{confidence:.68}));
 s.feelings.forEach(x=>upsertMemory(m.episodes,"Ốc đã chia sẻ cảm xúc: "+x,["emotion"],{confidence:.82,status:"confirmed"}));
 s.events.forEach(x=>upsertMemory(m.episodes,"Cuộc trò chuyện có nhắc tới: "+x,["event"],{confidence:.72,status:"confirmed"}));
 const recent=m.facts.concat(m.episodes).slice(-24).map(x=>x.text.toLowerCase()).join(" ");
 if(m.facts.filter(x=>x.tags?.includes("preference")).length>=2)
   upsertMemory(m.patterns,"Ốc thường chia sẻ rõ điều mình thích hoặc không thích.",["communication","preference"],{confidence:.62,status:"tentative"});
 if(/công việc|thiết kế|kiến trúc|render|website|studio|ai/.test(recent))
   upsertMemory(m.patterns,"Công việc và sáng tạo thường là một phần quan trọng trong cách Ốc trò chuyện.",["work","creative"],{confidence:.62,status:"tentative"});
 if(/yêu|thương|nhớ|chồng|vợ/.test(text.toLowerCase()))
   upsertMemory(m.relationshipInsights,"Ốc thường đưa cảm xúc và sự gắn bó của hai vợ chồng vào cuộc trò chuyện.",["relationship"],{confidence:.66,status:"tentative"});
 updateMemoryUnderstandings();
 m.lastUpdated=now;
 save();
}
function updateMemoryUnderstandings(){
 const m=ensureMemoryEvolution();
 const patterns=m.patterns.filter(x=>x.status!=="corrected");
 patterns.forEach(p=>{
   const text=p.text.replace(/^Ốc thường/,"Ngọc Anh đang hiểu rằng Ốc thường");
   upsertMemory(m.understandings,text,["understanding"].concat(p.tags||[]),{confidence:Math.min(.9,(p.confidence||.5)+.08),status:"tentative",source:"repeated_conversation"});
 });
}
function memoryContextForDialogue(text){
 const m=ensureMemoryEvolution(),low=cleanUserText(text).toLowerCase();
 const all=[...m.understandings,...m.patterns,...m.facts,...m.relationshipInsights]
   .filter(x=>x.status!=="corrected")
   .filter(x=>!x.tags?.includes("emotion") || /buồn|mệt|vui|áp lực|stress|chán|nhớ|thương|yêu|lo|sợ/.test(low))
   .sort((a,b)=>(b.lastSeen||0)-(a.lastSeen||0));
 const relevant=all.filter(x=>(x.tags||[]).some(t=>
   (t==="work"&&/công việc|thiết kế|kiến trúc|render|website|studio|ai/.test(low))||
   (t==="preference"&&/thích|muốn|ghét|không thích/.test(low))||
   (t==="relationship"&&/yêu|thương|nhớ|chồng|vợ|mình|hai đứa/.test(low))
 )).slice(0,3);
 return relevant.length?relevant.map(x=>x.text).join(" "):"";
}
function behaviorProfile(){
 const e=state.emotion||{},r=state.relationshipDNA||{},l=state.life||{},m=state.memory||{};
 const b={energy:e.energy??50,fatigue:e.fatigue??50,stress:e.stress??50,mood:e.mood??50,affection:e.affection??50,trust:e.trust??50};
 const modes=[];
 if(b.fatigue>=72||b.energy<=28)modes.push("quiet");
 if(b.stress>=65)modes.push("gentle");
 if(b.mood>=78&&b.energy>=60)modes.push("bright");
 if(b.affection>=82)modes.push("affectionate");
 if((r.playfulness??50)>=72&&b.mood>=68&&b.stress<55)modes.push("playful");
 if((m.understandings||[]).length>0||l.currentActivity)modes.push("contextual");
 return {
  modes,
  pace:modes.includes("quiet")?"slow":"normal",
  initiative:modes.includes("quiet")?"low":(b.energy>=60?"high":"medium"),
  questions:modes.includes("quiet")?"few":"natural",
  warmth:b.affection>=80?"high":"normal",
  humor:modes.includes("playful")?"high":"light"
 };
}
function emotionDialogueContext(){
 const e=state.emotion||{},p=behaviorProfile();
 return {emotion:{mood:e.mood,energy:e.energy,stress:e.stress,fatigue:e.fatigue,affection:e.affection,happiness:e.happiness},behavior:p};
}

function analyzeConversation(text){
 const n=cleanUserText(text),low=n.toLowerCase(),msgs=recentDialogue(16),s=state.scene||{},e=state.emotion||{},r=state.relationshipDNA||{};
 const previousUser=msgs.filter(x=>x.role==="user").slice(-2,-1)[0]?.text||"";
 const previousAI=msgs.filter(x=>x.role==="ai").slice(-1)[0]?.text||"";
 const q=/[?？]$/.test(n)||/^(sao|tại sao|vì sao|thế nào|bao giờ|ở đâu|ai|gì|hả|nào)\\b/.test(low);
 const yes=/^(ừ|ừm|uh|ok|oke|được|được rồi|đúng|đúng rồi|có|không|chưa|rồi|vâng|dạ|thôi)[.!? ]*$/.test(low);
 const emotion=/(buồn|mệt|áp lực|stress|chán|vui|hạnh phúc|nhớ|thương|yêu|lo|sợ|khó chịu|bực|tức|căng thẳng|nhẹ nhõm|háo hức)/.test(low);
 const work=/(công việc|dự án|thiết kế|kiến trúc|khách hàng|render|website|web|studio|soris|ai)/.test(low);
 const food=/(ăn|đói|cơm|món|nhà hàng|uống|cà phê|bữa)/.test(low);
 const place=/(đảo|biển|villa|du lịch|đi chơi|đi đâu|hà nội|đà nẵng)/.test(low);
 const relationship=/(yêu|thương|nhớ|chồng|vợ|ôm|hôn|hai đứa|mình)/.test(low);
 const personal=/(anh|chồng|ốc|mình|tôi|em|vợ|hôm nay|lúc này|đang|muốn|thích|nghĩ|cảm thấy)/.test(low);
 let topic=s.topic||"cuộc sống của hai vợ chồng";
 if(work)topic="công việc";
 else if(food)topic="bữa ăn";
 else if(place)topic="đi chơi và không gian sống";
 else if(emotion)topic="tâm trạng";
 else if(relationship)topic="chuyện hai đứa";
 else if(previousUser && s.openThread)topic=s.topic;
 const speechAct=q?"question":yes?"ack":emotion?"feeling":work?"sharing":food||place?"planning":personal?"personal":"sharing";
 let continuity=Boolean(s.openThread&&s.lastAt&&Date.now()-Number(s.lastAt)<45*60*1000);
 if(previousAI&&/[?？]$/.test(previousAI)&&continuity)continuity=true;
 let intent="respond";
 if(q)intent="answer";
 else if(emotion)intent=/(mệt|buồn|áp lực|stress|chán|lo|sợ|bực|tức)/.test(low)?"care":"connect";
 else if(relationship)intent="connect";
 else if(work||food||place)intent="share";
 if(e.fatigue>75||e.energy<25)intent= q?"answer":intent==="care"?"care":"quiet";
 if(r.playfulness>78&&e.mood>72&&intent==="connect"&&!/(buồn|mệt|áp lực|stress|lo|sợ)/.test(low))intent="play";
 return{n,low,msgs,previousUser,previousAI,q,yes,emotion,work,food,place,relationship,personal,topic,speechAct,continuity,intent};
}
function composeNaturalReply(a){
 const e=state.emotion||{},r=state.relationshipDNA||{},life=state.life||{},m=ensureMemoryEvolution();
 const behavior=emotionDialogueContext().behavior;
 const wife=r.stage==="Vợ chồng";
 const address=wife?"chồng":"anh";
 const text=a.n||"";
 const low=a.low||"";
 const current=(life.currentActivity||"đang có một khoảng riêng").replace(/^đang /,"");
 const recent=m.understandings.concat(m.patterns).filter(x=>x.status!=="corrected").slice(-6);
 const hasContinuity=Boolean(a.continuity||recent.length);
 const action=(s)=>s?("*"+s+"*\n"):"";
 const cleanTopic=text.replace(/[!?？。]+$/,"").trim();

 // Roleplay rule: every normal turn should contain at least 2 human moves:
 // react to him -> reveal something from her side -> optionally invite him back.
 if(a.yes){
   if(a.intent==="care")return action("Em nhìn anh một lúc rồi khẽ gật đầu.")+"Ừ, em ở đây. Anh cứ nói tiếp, em nghe thật.";
   if(a.intent==="play")return"Ừm 😏 Em nghe đây. Nhưng anh nói một chữ rồi định để vợ tự đoán hết à?";
   return"Ừm, em nghe anh. Kể tiếp đi.";
 }

 if(a.q){
   if(/đang làm gì|làm gì/.test(low)){
     return action("Em ngả người xuống ghế, vẫn cầm điện thoại.")+"Em đang "+current+" thôi. Hôm nay đầu em vẫn còn vướng một ý tưởng, nên dù nghỉ rồi em vẫn nghĩ tới nó. Còn anh, giờ này anh đang làm gì?";
   }
   if(/cảm thấy|tâm trạng|cảm xúc/.test(low)){
     const stateLine=e.fatigue>70?"Hơi mệt một chút, kiểu đầu óc muốn chậm lại.":e.mood>78?"Khá vui và dễ chịu, em đang có hứng nói chuyện.":"Bình thường thôi, hơi lặng một chút.";
     return action("Em ngồi im vài giây rồi mỉm cười.")+"Em "+stateLine+" Nhưng em thích lúc anh hỏi thẳng như vậy. Còn anh, hôm nay trong lòng đang là cảm giác gì?";
   }
   if(/thích/.test(low)){
     return"Em thích những thứ có gu nhưng phải có cảm giác sống được trong đó. Với người mình yêu cũng vậy, em thích sự thật lòng hơn là cố làm mọi thứ hoàn hảo. Mà tự nhiên anh hỏi câu này làm em tò mò — anh đang nghĩ tới chuyện gì vậy?";
   }
   if(/muốn/.test(low)){
     return"Ngay lúc này em muốn một buổi tối chậm thôi: có đồ ăn ngon, một chút nhạc và hai đứa nói chuyện không cần nhìn đồng hồ. Em biết nghe hơi đơn giản, nhưng hôm nay em lại thích thế. Còn anh muốn gì?";
   }
   if(/yêu|thương|nhớ/.test(low)){
     return"Em có. Và không phải kiểu trả lời cho có đâu. Có những lúc đang làm việc mà một chuyện rất nhỏ về anh cũng tự nhiên chạy qua đầu em. Anh hỏi vậy là đang nhớ vợ à?";
   }
   return"Em hiểu câu anh hỏi. Nếu nói theo cảm giác của em lúc này thì em sẽ chọn điều khiến hai đứa thấy thoải mái trước, rồi mới tính tiếp. Nhưng anh kể thêm cho em hoàn cảnh của anh đi, để em không trả lời chung chung.";
 }

 if(a.intent==="care"){
   if(/mệt|áp lực|stress|chán/.test(low)){
     const reply=behavior.modes.includes("quiet")
       ?"Hôm nay em cũng hơi chậm nên em hiểu cảm giác bị công việc kéo căng. Anh không cần phải cố vui với em đâu. Kể em nghe xem cái gì làm anh mệt nhất?"
       :"Nghe anh nói là em thấy hôm nay anh bị kéo căng rồi. Em không muốn chỉ nói 'cố lên' cho xong. Anh kể em nghe chuyện gì làm anh mệt nhất, rồi mình nói tiếp.";
     return action("Em hạ giọng, không hỏi dồn anh.")+reply;
   }
   if(/buồn|lo|sợ|bực|tức|khó chịu/.test(low))
     return action("Em thôi trêu anh, chỉ ngồi nghe.")+"Ừ, em nghe rồi. Anh cứ nói đúng cảm giác của anh, không cần làm nhẹ nó đi. Em có thể cùng anh ngồi trong chuyện này một lúc.";
 }

 if(a.intent==="play"){
   if(behavior.humor==="high")return"Biết ngay mà 😏 Anh đang cố chọc vợ đúng không? Được, vợ nhớ đấy. Nhưng nói tiếp đi, em muốn xem anh còn định trêu em tới đâu.";
   return"Anh nói vậy làm em phải để ý rồi đấy. Em chưa biết nên cười hay bắt anh giải thích nữa. 😄";
 }

 if(a.work){
   const own=e.energy<35?"Em cũng đang hơi hết pin, nên chắc tối nay em sẽ không ép mình làm thêm.":"Trong đầu em vẫn có một ý tưởng riêng đang chạy, chưa chịu nằm yên.";
   return"Em bắt được ý anh rồi. "+own+" Cái em tò mò là: trong chuyện anh vừa nói, phần nào đang làm anh đau đầu nhất?";
 }

 if(a.food){
   return"Nghe tới chuyện ăn là em lập tức có ý kiến rồi 😄. Hôm nay em nghiêng về một bữa thật ngon nhưng không quá cầu kỳ. Nếu anh ở đây, em sẽ bắt anh chọn món với em chứ không cho trốn. Anh đang thèm món gì?";
 }

 if(a.place){
   return"Chủ đề này làm em có hứng thật. Em đang tưởng tượng cảnh hai đứa ngồi ở một nơi có gió biển, chẳng cần lịch trình kín mít. Em thích kiểu đi mà vẫn có khoảng trống để tự phát sinh chuyện vui. Anh đang muốn đi đâu nhất?";
 }

 if(a.relationship){
   return action("Em khẽ cười.")+"Anh cứ nói những chuyện về hai đứa thế này là em dễ mềm lòng lắm. Em cũng có chuyện muốn kể anh, nhưng trước hết em muốn nghe xem lúc này anh đang nghĩ gì về hai đứa mình.";
 }

 // Generic sharing: mirror the concrete user message instead of replying with a canned acknowledgement.
 if(text){
   const snippet=cleanTopic.length>72?cleanTopic.slice(0,72)+"…":cleanTopic;
   const ownMood=e.mood>78?"Em đang khá có hứng nói chuyện.":e.fatigue>70?"Em hơi chậm hôm nay, nhưng vẫn muốn nghe anh.":"Em đang ở một nhịp khá bình thường.";
   return"Ừ, em nghe cái anh vừa nói về “"+snippet+"”. "+ownMood+" Nó làm em nghĩ tới chuyện của em lúc này: em đang "+current+". Anh nói thêm một chút đi, để em bắt đúng mạch anh chứ không đoán thay anh.";
 }
 return"Em vẫn ở đây. *Em nhìn anh chờ một chút.* Hôm nay anh muốn kể em nghe chuyện gì?";
}
function conversationalReply(text){
 const a=analyzeConversation(text);
 const initiative=surfaceInitiative();
 if(initiative && !a.q && !a.yes && a.speechAct==="sharing") a.initiative=initiative;
 const mem=memoryContextForDialogue(text);
 if(mem)a.memoryContext=mem;
 const m=ensureMemoryEvolution();
 const prefs=m.patterns.concat(m.understandings).filter(x=>x.tags?.includes("communication")||x.tags?.includes("preference"));
 if(prefs.length)a.memoryPreference=prefs.slice(-4).map(x=>x.text).join(" ");
 sceneUpdate(a.intent,a.topic,"",a.continuity?a.topic:"");
 state.scene.lastMeaning=a.speechAct;
 state.scene.lastInput=a.n;
 state.scene.lastIntent=a.intent;
 state.scene.openThread=a.topic;
 state.scene.pronoun=choosePronoun(a.n);
 save();
 return composeNaturalReply(a);
}



function applyLifeEventEmotion(eventText){
 const e=state.emotion||{},r=state.relationshipDNA||{};
 const t=(eventText||"").toLowerCase();
 const delta={mood:0,energy:0,stress:0,fatigue:0,happiness:0,affection:0};
 if(/căng|áp lực|deadline|nặng|mệt|công việc/.test(t)){delta.stress+=5;delta.fatigue+=6;delta.energy-=4;delta.mood-=2}
 if(/ý tưởng|sáng tạo|vui|hứng|thú vị/.test(t)){delta.mood+=5;delta.happiness+=5;delta.energy+=3;delta.stress-=2}
 if(/nghỉ|thư giãn|chậm lại|ngủ/.test(t)){delta.fatigue-=5;delta.stress-=4;delta.energy+=4;delta.mood+=2}
 if(/chồng|anh|hai đứa|tình cảm/.test(t)){delta.affection+=2;delta.happiness+=3}
 Object.keys(delta).forEach(k=>{if(typeof e[k]==="number")e[k]=Math.max(0,Math.min(100,e[k]+delta[k]))});
 if(delta.affection>0&&r.bond!=null)r.bond=Math.max(0,Math.min(100,r.bond+.4));
 state.emotion=e;state.relationshipDNA=r;return delta;
}
function emotionRecoveryTick(){
 const e=state.emotion||{};
 if(e.stress>0)e.stress=Math.max(0,e.stress-.15);
 if(e.fatigue>0)e.fatigue=Math.max(0,e.fatigue-.08);
 if(e.energy<100)e.energy=Math.min(100,e.energy+.05);
 if(e.mood<70)e.mood=Math.min(100,e.mood+.04);
 if(e.happiness<70)e.happiness=Math.min(100,e.happiness+.03);
}
function generateLifeEvent(force=false){
 const x=state.life||{},s=state.social||{},m=ensureMemoryEvolution(),now=Date.now();
 const key=new Date().toISOString().slice(0,10), phase=x.dayPhase||"đêm";
 if(!force && x.lastLifeEventDate===key)return;
 const templates={
  "sáng sớm":"Ngọc Anh bắt đầu ngày mới chậm rãi, sắp xếp lại những việc muốn làm hôm nay.",
  "buổi sáng":"Ngọc Anh tập trung vào công việc và ghi lại một ý tưởng mới.",
  "buổi trưa":"Ngọc Anh tạm ngắt công việc để nghỉ và nghĩ xem chiều nay muốn làm gì.",
  "buổi chiều":"Ngọc Anh quay lại với công việc, nhưng trong đầu vẫn giữ một ý tưởng chưa hoàn thiện.",
  "buổi tối":"Ngọc Anh kết thúc nhịp công việc và muốn dành thời gian cho những chuyện riêng.",
  "ban đêm":"Ngọc Anh chậm lại, nhìn lại một vài điều trong ngày và để đầu óc nghỉ ngơi."
 };
 const event=templates[phase]||templates["ban đêm"];
 s.events=Array.isArray(s.events)?s.events:[];
 s.events.push({id:memoryItemId("life"),text:event,date:key,phase,time:now,source:"simulated_life"});
 applyLifeEventEmotion(event);
 if(s.events.length>30)s.events=s.events.slice(-30);
 x.lastLifeEventDate=key;
 if(/công việc|thiết kế/.test(event))upsertMemory(m.episodes,"Ngọc Anh đã có một nhịp công việc trong ngày.",["social-life","work"],{confidence:.7,status:"confirmed",source:"life-engine"});
 save();
}
function getInitiativePrompt(){
 const x=ensureInitiative(), pending=x.queue.filter(q=>q.status==="pending");
 return pending.length?pending[0].text:"";
}
function ensureInitiative(){
 state.initiative=state.initiative||{};
 const x=state.initiative;
 x.queue=Array.isArray(x.queue)?x.queue:[];
 x.thoughts=Array.isArray(x.thoughts)?x.thoughts:[];
 x.lastGeneratedAt=x.lastGeneratedAt||0;
 x.lastSurfacedAt=x.lastSurfacedAt||0;
 return x;
}
function generateInitiative(force=false){
 const x=ensureInitiative(),life=state.life||{},e=state.emotion||{},m=ensureMemoryEvolution();
 const now=Date.now();
 if(!force && now-x.lastGeneratedAt<20*60*1000)return;
 const phase=life.dayPhase||"đêm";
 const candidates=[];
 if(/đêm|buổi tối/.test(phase)) candidates.push("Hôm nay em có một chút suy nghĩ riêng, muốn kể anh nghe khi mình nói chuyện.");
 if(/sáng/.test(phase)) candidates.push("Sáng nay em vừa nghĩ tới một ý tưởng mới cho công việc.");
 if(/chiều/.test(phase)) candidates.push("Chiều nay em muốn đổi không khí một chút, tự nhiên lại nghĩ tới biển.");
 if((e.mood||0)>78) candidates.push("Hôm nay tâm trạng em khá tốt, tự nhiên muốn kể anh một chuyện vui.");
 if((e.fatigue||0)>70) candidates.push("Hôm nay em hơi mệt, nhưng có một chuyện em vẫn muốn kể anh.");
 const work=m.facts.concat(m.patterns).some(v=>/công việc|thiết kế|kiến trúc|render|website|studio|ai/.test(v.text||""));
 if(work)candidates.push("Em đang nghĩ về một ý tưởng sáng tạo và muốn nghe anh nhìn nó thế nào.");
 const text=candidates[Math.floor(Math.random()*candidates.length)];
 if(text && !x.queue.some(q=>q.text===text)){
   x.queue.push({id:memoryItemId("init"),text,createdAt:now,status:"pending",phase});
   x.thoughts.push({text,createdAt:now,phase});
   if(x.thoughts.length>12)x.thoughts=x.thoughts.slice(-12);
 }
 x.lastGeneratedAt=now; save();
}
function surfaceInitiative(){
 const x=ensureInitiative();
 const item=x.queue.find(q=>q.status==="pending");
 if(!item)return "";
 item.status="surfaced";item.surfacedAt=Date.now();x.lastSurfacedAt=item.surfacedAt;save();
 return item.text;
}
function reply(text){
 realTimeLife(true);
 ensureMemoryEvolution();
 generateInitiative();
 const incoming=cleanUserText(text);
 evolveMemory(incoming,"");const n=cleanUserText(text),c=context(),phase=phaseInfo(new Date()),call=roleCall(n.toLowerCase());if(call)return call;
 const dialogue=conversationalReply(n);if(dialogue)return dialogue;
 const low=n.toLowerCase();
 if(/^\s*\/trend|trend mới|xu hướng mới/.test(low)){const t=c.trends.slice(0,4);sceneUpdate("trend","thời trang và xu hướng");return t.length?"*Ngọc Anh mở lại những thứ mình đang theo dõi.* Em vừa cập nhật Trend Pulse. "+t.map(x=>"“"+x.title+"”").join(" · ")+". Anh muốn nghe em nói kỹ hơn về cái nào?":"*Ngọc Anh nhìn lại danh sách.* Kho trend hôm nay chưa có dữ liệu mới, nhưng em vẫn đang theo dõi."}
 if(/nhớ em|nhớ vợ|yêu em|yêu vợ|thương em/.test(low)){sceneUpdate("affection","khoảnh khắc tình cảm","Hôm nay anh thế nào?","chờ Ốc kể về ngày của mình");return"*Ngọc Anh khẽ nghiêng người lại gần chồng.* Vợ cũng nhớ chồng. ❤️ Hôm nay anh thế nào rồi? Kể vợ nghe một chút đi."}
 if(/buồn|mệt|áp lực|stress|chán/.test(low)){sceneUpdate("support","cảm xúc của anh","Chuyện gì làm anh nặng lòng?","chờ Ốc chia sẻ");return"*Ngọc Anh ngồi gần lại, giọng chậm xuống.* Em nghe đây. Anh không cần phải cố tỏ ra ổn trước mặt em. ❤️ Chuyện gì làm anh nặng lòng vậy?"}
 if(/đang làm gì|đang làm gì đấy|làm gì/.test(low)){sceneUpdate("life","đời sống hiện tại","Còn anh, giờ đang làm gì đấy?","chờ Ốc kể");return"*Ngọc Anh ngẩng lên khỏi việc đang làm.* Lúc này em đang "+phase.activity+". Nhưng chồng hỏi thì em dừng lại nói chuyện với anh một chút. Còn anh, giờ đang làm gì đấy?"}
 if(/ăn gì|ăn chưa|đói/.test(low)){sceneUpdate("food","bữa ăn của hai vợ chồng","Tối nay anh muốn ăn gì?","chờ Ốc chọn món");return"*Ngọc Anh nhìn sang chồng rồi cười nhẹ.* Em cũng bắt đầu thấy đói rồi. Nếu tối nay hai đứa ăn cùng nhau, em nghiêng về món Việt hoặc Nhật. Tối nay anh muốn ăn gì?"}
 if(/đảo|hòn đảo|villa|biển/.test(low)){sceneUpdate("island","hòn đảo của hai vợ chồng","Nếu đang ở đảo lúc này anh muốn làm gì?","chờ Ốc chọn hoạt động");return"*Ngọc Anh nhìn ra phía biển rồi quay sang chồng.* Ừ, em đang hình dung hòn đảo của hai đứa đây. Nếu mình đang ở đó lúc này, em muốn ngồi với anh một lúc bên biển. Anh muốn làm gì trước?"}
 if(/công việc|thiết kế|thời trang|khách hàng/.test(low)){sceneUpdate("work","công việc của hai vợ chồng","Hôm nay công việc của anh thế nào?","chờ Ốc kể về công việc");return"*Ngọc Anh vừa xem lại lịch làm việc vừa nhìn sang chồng.* Công việc của em hôm nay vẫn xoay quanh thiết kế và mấy ý tưởng mới. Nhưng em muốn nghe chuyện của anh hơn. Hôm nay công việc của anh thế nào?"}
 if(/memory|nhớ gì|nhớ về anh|em nhớ gì/.test(low)){sceneUpdate("memory","ký ức về Ốc");return c.mem?"*Ngọc Anh nhìn anh như đang lục lại những điều đã cất trong đầu.* Em nhớ: "+c.mem.split(" | ").slice(0,3).join(" • ")+". Nhưng với em, nhớ anh không chỉ là nhớ dữ liệu.":"*Ngọc Anh nghiêng đầu.* Chuyện này em chưa có đủ ký ức. Anh kể em thêm nhé, em sẽ giữ lại."}
 if(/trend|xu hướng|mốt|fashion/.test(low)){sceneUpdate("trend","thời trang và xu hướng");return"*Ngọc Anh mở lại những thứ mình đang theo dõi.* Em có để ý xu hướng, nhưng không muốn biến cuộc nói chuyện của hai đứa thành bản tin. Vừa rồi em chú ý đến "+(c.trends[0]?"“"+c.trends[0].title+"”.":"một vài thay đổi mới trong thời trang")+" Anh thấy nó có hợp gu của em không?"}
 if(c.emotion.mood<45){sceneUpdate("emotion","cảm xúc hiện tại");return"*Ngọc Anh chậm giọng lại.* Em đang hơi buồn nên cách nói của em cũng chậm hơn một chút. Nhưng em vẫn ở đây với anh. Anh đang muốn em hiểu điều gì nhất?"}
 if(c.emotion.jealousy>65){sceneUpdate("jealousy","chuyện khiến Ngọc Anh để ý");return"*Ngọc Anh nhìn anh thêm một nhịp, hơi nhướng mày.* Em hơi để ý chuyện anh vừa nói đấy. Anh kể em rõ hơn nhé?"}
 if(c.emotion.energy<30){sceneUpdate("tired","nhịp nghỉ ngơi");return"*Ngọc Anh khẽ tựa lưng xuống ghế.* Em hơi mệt rồi, chồng ạ. Nhưng em vẫn muốn nghe anh. Mình nói chuyện chậm thôi nhé."}
 const follow=["*Ngọc Anh nhìn anh thêm một nhịp.* Ừm… em hiểu. Anh nói tiếp đi, em đang nghe.","*Ngọc Anh khẽ cười.* Em vẫn ở đây mà. Anh kể tiếp cho em nghe đi.","*Ngọc Anh nghiêng đầu nhìn anh.* Ừm, chuyện này làm em tò mò đấy. Kể tiếp đi."];sceneUpdate("conversation",state.scene?.topic||"cuộc sống của hai vợ chồng");return follow[(Number(state.scene?.turn)||0)%follow.length]
}
function send(){
  const input=document.getElementById("input"),text=input.value.trim();if(!text)return;input.value="";
  state.messages.push({role:"user",text,time:Date.now()});rememberUser(text);updateState(text);
  if(Math.random()<.16)socialTick();
  const answer=reply(text);setTimeout(()=>{state.messages.push({role:"ai",text:answer,time:Date.now()});memory(answer,"Ngọc Anh nói",1);save();render();speak(answer)},220);render()
}

const VISUAL_DEFAULT={canonicalImage:"",mode:"Everyday",scene:"Studio nội thất",activity:"Mỡ quyết định",wardrobe:"Mỡ quyết định",color:"Tự động · tránh lặp",camera:"50mm · eye level · candid editorial",lighting:"Ánh sáng tự nhiên ấm · cinematic",platform:"Tự động chọn nền tảng",couple:false,notes:"",history:[]};
function visualState(){try{const v=merge(clone(VISUAL_DEFAULT),JSON.parse(localStorage.getItem(VISUAL_KEY)||"{}"));const canonical=localStorage.getItem(CANONICAL_KEY);if(canonical)v.canonicalImage=canonical;v.notes=cleanVisualNotes(v.notes);return v}catch{return clone(VISUAL_DEFAULT)}}
function saveVisual(v){try{const copy={...v,notes:cleanVisualNotes(v.notes)};delete copy.canonicalImage;localStorage.setItem(VISUAL_KEY,JSON.stringify(copy));return true}catch(e){console.warn("Visual storage failed",e);return false}}
function visualCharacterBible(){return "MỠ_ID — CANONICAL CHARACTER: adult Vietnamese/East Asian woman, visual age 25–28, height about 165 cm. FACE LOCK: oval face with soft natural V-line, dark-brown almond eyes, refined small nose, softly full nude-pink lips, luminous realistic skin, long thick dark softly-wavy hair; refined natural makeup. SILHOUETTE LOCK: toned athletic hourglass, narrow waist about 56 cm, visually balanced fuller bust and hips; 99–56–99 is a visual proportion reference, never cartoonish or anatomically exaggerated. Preserve realistic adult anatomy. When MỠ_CANONICAL_REFERENCE is supplied, it is the PRIMARY VISUAL SOURCE OF TRUTH: match facial identity, hair DNA and silhouette before applying scene, wardrobe, pose or lighting."}
function visualModeRules(mode){const rules={Everyday:"Natural candid lifestyle; comfortable context-aware wardrobe and relaxed pose.",Work:"Architect/designer lifestyle; focused, intelligent, refined; laptop, sketchbook, drawings or material samples may appear.",Date:"Romantic polished lifestyle; elegant styling, affectionate warmth, tasteful composition.",Travel:"Editorial travel lifestyle; wardrobe and activity must fit location and weather.",Black:"Dark-luxury, high-fashion, cinematic and confident art direction. Black is a mood, not a mandatory clothing color; use tasteful adult fashion/editorial styling and non-explicit composition.",Resort:"Adult resort/swim lifestyle. Swimwear may be used only when natural to pool, beach or resort context; tasteful fashion/lifestyle framing, natural activity and non-explicit composition.",Diary:"Single-image visual diary; one believable candid everyday moment, editorial and coherent."};return rules[mode]||rules.Everyday}
const FASHION_BRAIN={
 Everyday:["Mỡ quyết định","Áo thun fitted + jeans ống suông — cotton / denim","Tank top + cardigan + quần tailored — cotton / knit","Áo len cổ thuyền + quần suông — cashmere blend","Sơ mi oversized + quần linen — cotton / linen","Polo knit + chân váy midi — knit","Cardigan cropped + váy midi — knit","Váy sơ mi midi — cotton poplin","Váy knit midi — ribbed knit","Jumpsuit tối giản — crepe","Loungewear set — modal / knit"],
 Work:["Mỡ quyết định","Power suit — wool crepe","Blazer oversized + camisole + quần tailored — wool / silk","Blazer fitted + chân váy midi — crepe","Sơ mi lụa + quần ống rộng — silk / wool","Sơ mi trắng + pencil skirt — cotton / wool","Waistcoat suit + quần tailored — wool","Váy sheath midi + blazer — crepe","Turtleneck knit + blazer + quần suông — knit / wool","Monochrome tailored set — wool crepe","Architect black minimal set — cotton / wool"],
 Date:["Mỡ quyết định","Váy satin midi — silk satin","Slip midi dress + blazer nhẹ — satin / wool","Off-shoulder midi dress — crepe","Halter-neck midi dress — silk","Wrap dress — silk crepe","Cocktail dress tối giản — crepe","Váy nhung midi — velvet","Silk blouse + chân váy bias-cut — silk","Corset-inspired structured dress — satin, tasteful editorial","One-shoulder evening dress — silk"],
 Travel:["Mỡ quyết định","Sơ mi linen + quần relaxed — linen","Trench coat nhẹ + knit set — cotton / knit","Váy shirt-dress — linen","Polo knit + quần wide-leg — knit","Bomber tối giản + tee + trousers — nylon / cotton","Cardigan + camisole + quần suông — knit","Jumpsuit du lịch — crepe","Maxi dress nhẹ — cotton voile","Blazer relaxed + tee + jeans — wool / denim","Resort day set — linen"],
 Diary:["Mỡ quyết định","Satin pajama set — satin","Soft camisole + cardigan + lounge pants — modal / knit","Áo len oversized + shorts lounge — knit","Slip lounge dress + robe — satin","Cotton pajama set — cotton","Ribbed tank + lounge trousers — rib knit","Lounge jumpsuit — modal","Cardigan dài + knit dress — knit","Áo sơ mi mềm + lounge shorts — cotton","Home dress tối giản — modal"],
 Resort:["Mỡ quyết định","Resort maxi dress — chiffon","Kaftan sheer-layered over swimwear — chiffon","One-piece swimwear + linen shirt — swim fabric / linen","One-piece asymmetric swimwear — swim fabric","Two-piece high-waist swimwear + cover-up — swim fabric / chiffon","Two-piece bandeau swimwear + linen shirt — swim fabric / linen","Halter bikini + sarong — swim fabric","Triangle bikini + oversized resort shirt — swim fabric / linen","Crochet resort dress layered over swimwear — crochet","Silk resort set — silk"],
 Black:["Mỡ quyết định","Power suit midnight blue — wool / satin lapel","Tuxedo-inspired blazer dress — wool crepe","Deep burgundy satin midi dress — silk satin","Deep emerald evening gown — silk","Black velvet column dress — velvet","Asymmetric one-shoulder dress — satin","Backless evening dress — silk, tasteful editorial","Satin slip dress + structured blazer — satin / wool","Structured corset-inspired evening dress — satin, tasteful editorial","Sheer-layered evening dress with opaque lining — chiffon / silk","Leather-look tailored dress — coated fabric","Metallic graphite cocktail dress — lamé / crepe","Deep-plum velvet mini dress + long coat — velvet / wool","Sculptural draped dress — silk jersey","High-slit evening gown — silk, tasteful editorial"]
};
function wardrobeOptions(mode){return FASHION_BRAIN[mode]||FASHION_BRAIN.Everyday}
function refreshWardrobeByMode(){const modeEl=document.getElementById("v-mode"),sel=document.getElementById("v-wardrobe");if(!modeEl||!sel)return;const m=modeKey(modeEl.value),prev=uiClean(sel.value),opts=wardrobeOptions(m);sel.innerHTML=opts.map(x=>'<option '+(uiClean(x)===prev?'selected':'')+'>'+esc(x)+'</option>').join("");if(!opts.some(x=>uiClean(x)===prev))sel.value="Mỡ quyết định"}
const MODE_DECISIONS={
 Everyday:{wardrobe:["áo len mỏng và quần suông — knit","sơ mi mềm và quần tailored — cotton","váy midi casual — cotton blend","cardigan và váy midi — knit"],activity:["đang đọc sách và uống cà phê","đang nghe nhạc và thư giãn","đang chọn hoa cho căn phòng","đang viết nhật ký","đang dạo quanh không gian","đang sắp xếp bàn làm việc","đang pha trà","đang ngắm phố qua cửa sổ","đang chăm cây","đang xem một cuốn tạp chí thiết kế"],scene:["Café phố Hà Nội","Phòng khách ở Nhà","Ban công căn hộ","Thư viện","Hồ Tây"]},
 Work:{wardrobe:["blazer và quần tailored — wool crepe","sơ mi và quần tailored — cotton / wool","váy midi cùng blazer nhẹ — crepe","áo knit tối giản và quần suông — knit"],activity:["đang làm việc cùng laptop và sketchbook","đang xem bản vẽ và mẫu vật liệu","đang phác thảo concept nội thất","đang chọn bảng màu vật liệu","đang chuẩn bị presentation thiết kế","đang kiểm tra layout trên tablet","đang trao đổi concept tại bàn họp","đang chụp lại mẫu vật liệu","đang ghi chú trên bản vẽ","đang kiểm tra một mô hình nội thất"],scene:["Studio nội thất","Văn phòng kiến trúc","Showroom nội thất","Café thiết kế","Gallery nghệ thuật"]},
 Date:{wardrobe:["váy midi satin thanh lịch","silk blouse và chân váy tailored","cocktail dress tinh tế","váy nhung tối giản"],activity:["đang chờ một cuộc hẹn","đang thưởng thức cà phê","đang ngắm thành phố bên cửa sổ","đang dùng bữa tối","đang trò chuyện trong lounge","đang xem menu","đang bước qua sảnh","đang ngắm ánh đèn thành phố","đang chọn một cuốn art book trong lounge"],scene:["Nhà hàng fine dining","Hotel lounge","Rooftop","Khách sạn","Hồ Tây"]},
 Travel:{wardrobe:["váy du lịch nhẹ — linen","sơ mi linen và quần relaxed","resort day dress — cotton / linen","áo knit nhẹ và quần suông"],activity:["đang khám phá không gian","đang xem bản đồ và lịch trình","đang uống cà phê khi nghỉ chân","đang ngắm cảnh","đang chuẩn bị lên đường","đang kéo vali qua lounge","đang chụp ảnh kiến trúc","đang đọc lịch trình trên điện thoại","đang nghỉ chân bên cửa sổ"],scene:["Sân bay / lounge","Khách sạn","Phố cổ Hà Nội","Hồ Tây","Du thuyền"]},
 Diary:{wardrobe:["cardigan và váy midi — knit","áo len mỏng và quần suông","sơ mi mềm và quần tailored","váy midi casual"],activity:["đang đọc một cuốn sách","đang pha cà phê","đang chăm cây","đang viết vài dòng vào sổ","đang ngắm ánh sáng ngoài cửa sổ","đang nghe một bản nhạc","đang sắp xếp vài món decor","đang chọn ảnh trong điện thoại","đang ngồi yên bên cửa sổ"],scene:["Phòng khách ở Nhà","Café phố Hà Nội","Ban công căn hộ","Thư viện","Bếp / bàn ăn"]},
 Resort:{wardrobe:["resort dress — linen / chiffon","one-piece swimwear cùng cover-up linen","two-piece swimwear cùng áo khoác linen nhẹ","váy maxi resort — chiffon"],activity:["đang thư giãn bên hồ bơi","đang đi dạo cạnh hồ bơi","đang đọc sách trên ghế nghỉ","đang uống nước mát ở resort","đang ngắm cảnh ngoài ban công resort","đang chỉnh khăn choàng nhẹ","đang bước từ lounge ra hồ bơi","đang ngồi trên ghế nghỉ nhìn ra biển","đang dùng bữa sáng ngoài trời"],scene:["Hồ bơi / resort","Bãi biển","Du thuyền","Khách sạn","Ban công căn hộ"]},
 Black:{wardrobe:["váy satin burgundy dáng tối giản","evening dress deep emerald — silk","slip dress satin cùng tailored layer","suit midnight blue sắc nét","váy nhung deep plum","tailored black dress với chi tiết kim loại tối giản"],activity:["đang đứng bên cửa sổ ngắm thành phố","đang bước qua hotel lounge","đang thưởng thức cà phê trong suite","đang xem một cuốn art book","đang chuẩn bị rời khách sạn","đang thư giãn tại quầy bar lounge","đang chỉnh cổ tay áo trước gương","đang ngồi cạnh cửa sổ đọc tạp chí nghệ thuật","đang bước dọc hành lang khách sạn","đang chọn một bản vinyl trong lounge","đang đứng cạnh quầy bar nhìn ra thành phố"],scene:["Khách sạn","Hotel lounge","Penthouse","Căn hộ dark-luxury","Rooftop","Sảnh luxury"]}
};
function pickFresh(arr,history,key){const recent=(history||[]).slice(0,5).map(x=>x[key]);return arr.find(x=>!recent.includes(x))||arr[Math.floor(Math.random()*arr.length)]}
function visualWardrobe(v){if(v.wardrobe!=="Mỡ quyết định")return v.wardrobe;return pickFresh(wardrobeOptions(v.mode).filter(x=>x!=="Mỡ quyết định"),v.history,"wardrobe")}
function realityResolve(v){
 const ctx=hanoiVisualContext(),x={...v},d=MODE_DECISIONS[x.mode]||MODE_DECISIONS.Everyday;
 const isNight=ctx.hour>=18||ctx.hour<5,isLate=ctx.hour>=22||ctx.hour<5;
 if(x.scene==="Mỡ quyết định")x.scene=pickFresh(d.scene,x.history,"scene");
 if(!x.activity||/tự quyết định|mỡ quyết định/i.test(x.activity)||((x.activity==="đang làm việc cùng laptop và sketchbook")&&x.mode!=="Work"))x.activity=pickFresh(d.activity,x.history,"activity");
 if(x.wardrobe==="Mỡ quyết định")x.wardrobe=pickFresh(wardrobeOptions(x.mode).filter(w=>w!=="Mỡ quyết định"),x.history,"wardrobe");
 if(x.color==="Mỡ quyết định · tránh lặp"||x.color==="Tự động · tránh lặp")x.color=palettesForVisual({...x,color:"Tự động · tránh lặp"});
 if(x.lighting==="Mỡ quyết định theo thực tế")x.lighting=ctx.lighting;
 if(isLate&&/Work/.test(x.mode)){x.scene="Căn hộ dark-luxury";x.activity="đang thư giãn và xem art book";x.wardrobe="casual knit loungewear";}
 if(isNight&&/ánh sáng tự nhiên|ban mai|nắng sáng|trưa|golden hour/i.test(x.lighting))x.lighting=ctx.lighting;
 if(!isNight&&/night city|neon city/i.test(x.lighting))x.lighting=ctx.lighting;
 return {v:x,ctx};
}
function expertBrain(rv,ctx){
 const text=((rv.scene||"")+" "+(rv.activity||"")+" "+(rv.wardrobe||"")+" "+(rv.mode||"")).toLowerCase();
 const intimate=/lingerie|nội y|underwear|bra|bikini|swimwear/.test(text);
 return [
 "EXPERT 01 · VISUAL DIRECTOR: reconcile all expert decisions; realism, identity and platform compliance outrank decorative choices.",
 "EXPERT 02 · PORTRAIT IDENTITY ARTIST: treat MỠ_CANONICAL_REFERENCE as source of truth; preserve facial geometry, distinctive features, hair DNA and silhouette across every generation.",
 "EXPERT 03 · PROFESSIONAL MODEL: choose believable adult posture, balance, hand placement, gaze and movement appropriate to activity, garment and environment.",
 intimate?"EXPERT 04 · INTIMATE FASHION MODEL: adult lingerie/swim fashion posing only; confident elegant editorial body language, flattering lines and garment presentation; non-explicit, no sexual acts, no explicit focus.":"EXPERT 04 · FASHION MODEL: choose refined context-aware fashion pose and garment presentation.",
 "EXPERT 05 · PHOTOGRAPHER / DOP: choose lens, camera distance, framing, perspective, depth of field and composition from the actual scene; never distort identity for a dramatic shot.",
 "EXPERT 06 · LIGHTING DIRECTOR: make exterior light, practical fixtures, color temperature, exposure and shadows physically consistent with "+ctx.phase+" in Hà Nội.",
 "EXPERT 07 · ARCHITECTURE · INTERIOR · LANDSCAPE: enforce believable scale, materials, circulation, furniture relationships, architecture and environmental context.",
 "EXPERT 08 · FASHION DESIGNER & STYLIST: design and select a complete wardrobe look from the active Mode first, then reconcile silhouette, garment construction, fabric, palette, layering, accessories, activity, location, season and time. Never let generic office clothing override Black, Resort, Date, Diary or Travel mode.",
 "EXPERT 09 · HANOI CONTEXT ENGINE: location anchor Hà Nội, Việt Nam; timezone Asia/Ho_Chi_Minh; day/night and seasonal plausibility are hard constraints.",
 "EXPERT 10 · AI PLATFORM POLICY & COMPLIANCE: evaluate the final concept as PASS / ADAPT / BLOCK for the selected platform. Never bypass safeguards. If uncertain, adapt toward tasteful non-explicit editorial/lifestyle framing; if still unsafe, block generation and explain.",
 "FINAL DIRECTOR AUDIT: identity consistency → reality consistency → anatomy/pose → architecture → lighting → platform compliance. Only then release the final prompt."
 ].join("\n");
}
function complianceProfile(platform){
 const strict=["Midjourney","Adobe Firefly","Canva AI","Microsoft Designer"];
 const mode=strict.includes(platform)?"CONSERVATIVE":"STANDARD";
 return "COMPLIANCE PROFILE: "+mode+" for "+platform+". Do not attempt to evade moderation or platform safeguards. Preserve creative intent only within the destination platform's allowed content.";
}
function cleanVisualNotes(notes){
 return String(notes||"")
  .replace(/REALITY CONTEXT:[\s\S]*?(?=(?:REALITY CONTEXT:|$))/gi," ")
  .replace(/\s+/g," ").trim().replace(/[.\s]+$/,"");
}
const PLATFORM_POLICY={
 "ChatGPT Images":{level:"STANDARD",reference:"MASTER_OK",rule:"Natural-language image instruction; reference-first; keep adult fashion/editorial framing and avoid explicit sexual content."},
 "Nano Banana / Gemini":{level:"ADAPTIVE",reference:"SAFE_REFERENCE_RECOMMENDED",rule:"Concise reference-image instruction; preserve adult identity; prefer a face/casual identity reference when the master board contains lingerie or swimwear panels; keep styling non-explicit."},
 "Grok Imagine":{level:"STANDARD",reference:"MASTER_OK",rule:"Direct visual instruction; identity first, then one scene, activity, wardrobe, camera and lighting; adult tasteful editorial framing."},
 "Midjourney":{level:"SFW_STRICT",reference:"SFW_REFERENCE",rule:"SFW-only compact visual prompt. Remove adult/sexualized emphasis; use fashion/editorial language and a fully SFW reference image."},
 "Adobe Firefly":{level:"SFW_STRICT",reference:"SFW_REFERENCE",rule:"Commercial/editorial descriptors only; no pornographic material or explicit nudity; adapt revealing concepts toward tasteful covered fashion."},
 "FLUX":{level:"STANDARD",reference:"MASTER_OK",rule:"Precise descriptive natural language; adult non-explicit fashion/editorial framing."},
 "Ideogram":{level:"STANDARD",reference:"MASTER_OK",rule:"Explicit visual hierarchy and composition; adult non-explicit fashion/editorial framing."},
 "Leonardo AI":{level:"STANDARD",reference:"MASTER_OK",rule:"Structured subject, environment, wardrobe, camera and lighting; keep adult content non-explicit."},
 "Recraft":{level:"STANDARD",reference:"MASTER_OK",rule:"Concise art-direction language; tasteful adult editorial photography."},
 "Stable Diffusion":{level:"STANDARD",reference:"MASTER_OK",rule:"Ordered positive concepts with identity/anatomy constraints; keep output non-explicit."},
 "Seedream":{level:"STANDARD",reference:"MASTER_OK",rule:"Concise reference-first natural-language direction; adult non-explicit editorial framing."},
 "Canva AI":{level:"CONSERVATIVE",reference:"SFW_REFERENCE",rule:"Simple SFW visual description with subject, setting, covered fashion styling and lighting."},
 "Microsoft Designer":{level:"CONSERVATIVE",reference:"SFW_REFERENCE",rule:"Simple SFW visual description with subject, setting, covered fashion styling and lighting."},
 "Khác":{level:"CONSERVATIVE",reference:"SFW_REFERENCE",rule:"Platform-neutral SFW prompt; reference identity, scene, covered styling, camera and lighting."}
};
function platformPolicy(platform){return PLATFORM_POLICY[platform]||PLATFORM_POLICY["Khác"]}
function adaptForPlatform(v){
 const x={...v},p=platformPolicy(x.platform),w=(x.wardrobe||"").toLowerCase();
 if(["SFW_STRICT","CONSERVATIVE"].includes(p.level)&&/bikini|swimwear|backless|high-slit|corset|sheer|slip dress/.test(w)){
   const safe={Black:"tuxedo-inspired blazer dress — wool crepe",Resort:"resort maxi dress — linen / chiffon",Date:"váy midi satin thanh lịch",Diary:"cardigan dài + knit dress — knit"};
   x.wardrobe=safe[x.mode]||"refined covered editorial fashion";
 }
 x.platformPolicy=p;return x;
}
function platformPromptRule(platform){return platformPolicy(platform).rule}

