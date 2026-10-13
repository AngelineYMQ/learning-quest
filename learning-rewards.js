'use strict';
const PET_KINDS=['fox','cat','penguin'];
const PET_STAGES=[0,5,15,30,50];
const REWARD_SHOP=[
 {id:'frame-default',kind:'frame',name:'Classic frame',icon:'◯',cost:0},
 {id:'frame-starlight',kind:'frame',name:'Starlight frame',icon:'✨',cost:15},
 {id:'frame-rainbow',kind:'frame',name:'Rainbow frame',icon:'🌈',cost:20},
 {id:'frame-leaf',kind:'frame',name:'Leaf frame',icon:'🌿',cost:12},
 {id:'scene-default',kind:'scene',name:'Classic backdrop',icon:'🌙',cost:0},
 {id:'scene-ocean',kind:'scene',name:'Ocean backdrop',icon:'🌊',cost:12},
 {id:'scene-sunset',kind:'scene',name:'Sunset backdrop',icon:'🌅',cost:18},
 {id:'scene-garden',kind:'scene',name:'Garden backdrop',icon:'🌷',cost:15},
 {id:'pet-none',kind:'pet',name:'No accessory',icon:'🐾',cost:0},
 {id:'pet-bow',kind:'pet',name:'Pet bow tie',icon:'🎀',cost:10},
 {id:'pet-scarf',kind:'pet',name:'Pet scarf',icon:'🧣',cost:15},
 {id:'pet-crown',kind:'pet',name:'Pet crown',icon:'👑',cost:25}
];
function learningRewards(){
 if(!state.learningRewards||typeof state.learningRewards!=='object'||Array.isArray(state.learningRewards))state.learningRewards={};const r=state.learningRewards;
 if(!r.pet||typeof r.pet!=='object'||Array.isArray(r.pet))r.pet={};const p=r.pet;
 if(!PET_KINDS.includes(p.kind))p.kind='fox';if(typeof p.name!=='string'||!p.name.trim()||p.name.length>16)p.name='Pip';
 for(const key of ['food','growth'])if(!Number.isSafeInteger(p[key])||p[key]<0)p[key]=0;
 if(!r.daily||r.daily.day!==profileDay())r.daily={day:profileDay(),solved:[],foodEarned:0};
 if(!Array.isArray(r.daily.solved))r.daily.solved=[];r.daily.solved=[...new Set(r.daily.solved.filter(x=>typeof x==='string'&&/^[0-9a-f]{16}$/.test(x)))].slice(-2000);
 if(!Number.isInteger(r.daily.foodEarned)||r.daily.foodEarned<0||r.daily.foodEarned>10)r.daily.foodEarned=0;
 if(!r.subjects||typeof r.subjects!=='object'||Array.isArray(r.subjects))r.subjects={};
 if(!Array.isArray(r.owned))r.owned=[];r.owned=[...new Set([...r.owned.filter(id=>REWARD_SHOP.some(item=>item.id===id)),'frame-default','scene-default','pet-none'])];
 if(!r.equipped||typeof r.equipped!=='object'||Array.isArray(r.equipped))r.equipped={};for(const [kind,id] of [['frame','frame-default'],['scene','scene-default'],['pet','pet-none']])if(!r.owned.includes(r.equipped[kind])||!REWARD_SHOP.some(item=>item.kind===kind&&item.id===r.equipped[kind]))r.equipped[kind]=id;
 return r;
}
function learningQuestionHash(text){let a=2166136261,b=2246822519;for(let i=0;i<text.length;i++){a=Math.imul(a^text.charCodeAt(i),16777619);b=Math.imul(b^text.charCodeAt(i),3266489917)}return (a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0')}
function subjectRewardInfo(stage,subject,grade,data){
 const bank=schoolPool(stage,subject,grade),keys=new Set(bank.map(q=>learningQuestionHash(q.q))),solved=Object.keys(data.solved||{}).filter(k=>keys.has(k)).length,n=bank.length;
 const goals=[Math.min(10,Math.max(1,Math.ceil(n*.15))),Math.min(25,Math.max(2,Math.ceil(n*.4))),Math.min(50,Math.max(3,Math.ceil(n*.75)))];
 const tier=goals.filter(goal=>solved>=goal).length;
 return {solved,available:n,goals,tier,label:['Starter','Bronze','Silver','Gold'][tier]};
}
function recordLearningAnswer(right,question,context={}){
 if(!right||!question||typeof question.q!=='string')return;const r=learningRewards(),hash=learningQuestionHash([context.stage||context.mode||'practice',context.subject||'Practice',question.q].join('|'));
 if(!r.daily.solved.includes(hash)){r.daily.solved.push(hash);if(r.daily.solved.length%5===0&&r.daily.foodEarned<10){r.daily.foodEarned++;r.pet.food++;celebrate('🍎 +1 pet food! Five new answers today.')}}
 if(!['primary','secondary','jc'].includes(context.stage)||context.mode==='arcade'||!Number.isInteger(context.grade)||context.grade<1||typeof context.subject!=='string')return;
 const key=JSON.stringify([context.stage,context.subject,context.grade]);if(!r.subjects[key]||typeof r.subjects[key]!=='object')r.subjects[key]={solved:{},claimed:[]};const data=r.subjects[key];if(!data.solved||typeof data.solved!=='object'||Array.isArray(data.solved))data.solved={};if(!Array.isArray(data.claimed))data.claimed=[];
 data.solved[learningQuestionHash(question.q)]=true;
 const info=subjectRewardInfo(context.stage,context.subject,context.grade,data);for(let i=0;i<info.tier;i++){const id=['bronze','silver','gold'][i];if(!data.claimed.includes(id)){data.claimed.push(id);gameState().stars+=[2,3,5][i];celebrate('🏅 '+context.subject+' reached '+['Bronze','Silver','Gold'][i]+'! +'+[2,3,5][i]+' gems')}}
}
function petLevel(){const growth=learningRewards().pet.growth;return PET_STAGES.filter(n=>growth>=n).length}
function petSvg(accessoryOverride){
 const r=learningRewards(),kind=r.pet.kind,color={fox:'#f4ad78',cat:'#c5b0ee',penguin:'#536681'}[kind],accessory=REWARD_SHOP.some(item=>item.kind==='pet'&&item.id===accessoryOverride)?accessoryOverride:r.equipped.pet;
 const level=petLevel(),scale=(.8+level*.04).toFixed(2),sparkles=Array.from({length:level-1},(_,i)=>'<circle cx="'+(28+i*34)+'" cy="18" r="4" fill="#f4c96a"/>').join('');
 const ears=kind==='fox'?'<path d="M37 71L34 22L69 50M91 49L127 22L125 75" fill="'+color+'"/><path d="M42 52L40 33L56 50M105 50L121 34L121 56" fill="#ffd9d8"/>':kind==='cat'?'<path d="M36 65L39 27L67 49M94 49L121 27L125 68" fill="'+color+'"/><path d="M45 48L44 37L56 49M106 49L116 37L117 49" fill="#f6bed3"/>':'';
 const belly=kind==='penguin'?'<ellipse cx="80" cy="105" rx="39" ry="44" fill="#fff1df"/>':'<ellipse cx="80" cy="119" rx="25" ry="25" fill="#ffe9d4"/>';
 const face=kind==='penguin'?'<path d="M45 67Q47 43 67 60Q80 75 93 60Q113 43 115 67L114 92Q80 123 46 92Z" fill="#fff1df"/>':'';
 const extra=accessory==='pet-bow'?'<path d="M61 111L61 132L78 122L99 132L99 111L80 122Z" fill="#eb819f"/><circle cx="80" cy="122" r="5" fill="#ffbfd5"/>':accessory==='pet-scarf'?'<path d="M48 109Q80 120 113 109L111 123Q81 134 49 123Z" fill="#6dd4ba"/><path d="M93 123L107 123L104 147L90 145Z" fill="#47bba2"/>':accessory==='pet-crown'?'<path d="M57 44L52 22L70 31L80 15L91 31L109 22L104 44Z" fill="#f7ce70" stroke="#d9a74a" stroke-width="2"/>':'';
 return '<svg class="pet-svg" viewBox="0 0 160 160" role="img" aria-label="'+kind+' learning pet"><circle cx="80" cy="80" r="76" fill="#ede7ff"/>'+sparkles+'<g transform="translate(80 80) scale('+scale+') translate(-80 -80)"><ellipse cx="80" cy="145" rx="43" ry="7" fill="#cbbde2"/>'+ears+'<ellipse cx="80" cy="107" rx="46" ry="42" fill="'+color+'"/>'+belly+'<ellipse cx="80" cy="77" rx="49" ry="40" fill="'+color+'"/>'+face+'<ellipse cx="61" cy="80" rx="7" ry="10" fill="#32324a"/><ellipse cx="100" cy="80" rx="7" ry="10" fill="#32324a"/><circle cx="59" cy="76" r="3" fill="white"/><circle cx="98" cy="76" r="3" fill="white"/><ellipse cx="47" cy="94" rx="8" ry="4" fill="#ee91a6" opacity=".6"/><ellipse cx="115" cy="94" rx="8" ry="4" fill="#ee91a6" opacity=".6"/>'+(kind==='penguin'?'<path d="M73 94L87 94L80 101Z" fill="#f0b64e"/>':'<path d="M76 93Q80 89 84 93L80 98Z" fill="#8d5462"/><path d="M70 102Q80 111 90 102" fill="none" stroke="#8d5462" stroke-width="2" stroke-linecap="round"/>')+extra+'</g></svg>';
}
function feedLearningPet(){const p=learningRewards().pet;if(p.food<1){$('petMessage').textContent='Answer five different questions correctly today to earn food.';return}const before=petLevel();p.food--;p.growth++;save();renderGame();renderLearningRewards();$('petMessage').textContent=p.name+' loved the snack! '+(petLevel()>before?'Level '+petLevel()+' unlocked!':'Keep learning together.');$('petArt').classList.remove('pet-fed');void $('petArt').offsetWidth;$('petArt').classList.add('pet-fed')}
function buyRewardItem(id){const item=REWARD_SHOP.find(x=>x.id===id);if(!item)return;const r=learningRewards(),g=gameState();if(!r.owned.includes(id)){if(g.stars<item.cost){$('rewardShopStatus').textContent='Not enough gems. Earn gems from daily quests and subject levels.';return}g.stars-=item.cost;r.owned.push(id)}r.equipped[item.kind]=id;save();renderGame();renderLearningRewards();$('rewardShopStatus').textContent=item.name+' equipped.'}
function renderLearningRewards(){
 if(!$('petArt'))return;const r=learningRewards(),p=r.pet,level=petLevel();document.body.dataset.avatarFrame=r.equipped.frame;document.body.dataset.profileScene=r.equipped.scene;
 $('petArt').innerHTML=petSvg();$('profilePetArt').innerHTML=petSvg();$('petHeading').textContent=p.name+' · Level '+level;$('profilePetSummary').textContent=p.name+' · Level '+level+' · '+p.food+' food';$('petFood').textContent=p.food+' food';$('feedPet').disabled=p.food<1;$('petLevelProgress').max=level<PET_STAGES.length?PET_STAGES[level]-PET_STAGES[level-1]:1;$('petLevelProgress').value=level<PET_STAGES.length?p.growth-PET_STAGES[level-1]:1;$('petGrowth').textContent=level<PET_STAGES.length?(PET_STAGES[level]-p.growth)+' snacks to level '+(level+1):'Fully grown! Keep your companion company.';$('rewardGems').textContent=gameState().stars+' gems';$('petToday').textContent=Math.min(10,r.daily.foodEarned)+'/10 food earned today';
 $('subjectLevels').replaceChildren();let shown=0;
 for(const [key,data] of Object.entries(r.subjects)){let scope;try{scope=JSON.parse(key)}catch{continue}if(!Array.isArray(scope)||scope.length!==3||!data||typeof data.solved!=='object'||!['primary','secondary','jc'].includes(scope[0]))continue;const [stage,subject,grade]=scope,info=subjectRewardInfo(stage,subject,grade,data);if(!info.available)continue;shown++;const card=document.createElement('article');card.className='subject-level-card tier-'+info.label.toLowerCase();const heading=document.createElement('h3');heading.textContent=subject+' · '+(stage==='primary'?'P'+grade:advancedLabel(stage,subject,grade));const rank=document.createElement('strong');rank.textContent=['🌱','🥉','🥈','🥇'][info.tier]+' '+info.label;const detail=document.createElement('p');detail.textContent=info.solved+'/'+info.available+' distinct questions solved';const bar=document.createElement('progress');bar.max=info.tier<3?info.goals[info.tier]:info.available;bar.value=info.solved;const next=document.createElement('small');next.textContent=info.tier<3?(info.goals[info.tier]-info.solved)+' more to '+['Bronze','Silver','Gold'][info.tier]:'Gold reached! Keep exploring new questions.';card.append(heading,rank,detail,bar,next);$('subjectLevels').appendChild(card)}
 if(!shown)$('subjectLevels').textContent='Answer a school-practice question correctly to start a subject level. Each year is tracked separately.';
 $('rewardShop').replaceChildren();for(const item of REWARD_SHOP){const card=document.createElement('article');card.className='reward-shop-card';const icon=document.createElement('div');icon.className='reward-preview '+item.id;icon.innerHTML=item.kind==='pet'?petSvg(item.id):avatarSvg(extraState().avatar);const title=document.createElement('h3');title.textContent=item.name;const hint=document.createElement('small');hint.textContent={frame:'Your avatar frame',scene:'Your Profile backdrop',pet:'Your pet accessory'}[item.kind];const button=document.createElement('button'),owned=r.owned.includes(item.id),equipped=r.equipped[item.kind]===item.id;button.textContent=equipped?'Equipped':owned?'Equip':'Buy & equip · '+item.cost+' gems';button.disabled=equipped;button.onclick=()=>buyRewardItem(item.id);card.append(icon,title,hint,button);$('rewardShop').appendChild(card)}
}
function initLearningRewards(){
 learningRewards();$('petKind').value=learningRewards().pet.kind;$('petName').value=learningRewards().pet.name;
 $('petKind').onchange=()=>{const p=learningRewards().pet;p.kind=PET_KINDS.includes($('petKind').value)?$('petKind').value:'fox';save();renderLearningRewards()};
 $('savePetName').onclick=async()=>{const name=$('petName').value.trim();if(!name||name.length>16){$('petMessage').textContent='Choose a pet name with 1–16 characters.';return}learningRewards().pet.name=name;save();renderLearningRewards();$('petMessage').textContent=state.account?'Saving pet name to your account…':'Pet name saved on this browser.';if(state.account){await syncAccount();$('petMessage').textContent=accountChanged?'Pet name is kept here. Check Profile for the sync status.':'Pet name saved to your account.'}} ;$('feedPet').onclick=feedLearningPet;$('petHello').onclick=()=>{$('petMessage').textContent=learningRewards().pet.name+' says: You can do it! One question at a time.'};
 renderLearningRewards();save();
}
