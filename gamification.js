'use strict';
const GAME_BADGES=[
['first','🌱','First steps','Complete your first test',()=>state.completed>=1],
['perfect','🏆','Perfect round','Complete a test with every answer correct',g=>g.perfectTests>=1],
['streak','🔥','Three-day flame','Reach a 3-day streak',()=>state.streak>=3],
['ten','🧭','Explorer','Complete 10 tests',()=>state.completed>=10],
['combo','⚡','On a roll','Answer 5 questions correctly in a row',g=>g.bestCombo>=5],
['goal','🎯','Goal getter','Claim a daily-goal reward',g=>g.goalsClaimed>=1]
];
function gameState(){
  if(!state.game||typeof state.game!=='object'||Array.isArray(state.game))state.game={};
  const g=state.game;
  for(const key of ['stars','perfectTests','bestCombo','goalsClaimed'])if(!Number.isSafeInteger(g[key])||g[key]<0)g[key]=0;
  if(![5,10,20,30].includes(g.goal))g.goal=10;
  if(!['violet','mint','gold'].includes(g.theme))g.theme='violet';
  if(!g.badges||typeof g.badges!=='object'||Array.isArray(g.badges))g.badges={};
  if(!g.paths||typeof g.paths!=='object'||Array.isArray(g.paths))g.paths={};
  if(!Array.isArray(g.skins))g.skins=['violet'];
  if(!g.daily||g.daily.day!==today())g.daily={day:today(),correct:0,completed:0,perfect:0,claimed:{}};
  for(const key of ['correct','completed','perfect'])if(!Number.isSafeInteger(g.daily[key])||g.daily[key]<0)g.daily[key]=0;
  if(!g.daily.claimed||typeof g.daily.claimed!=='object'||Array.isArray(g.daily.claimed))g.daily.claimed={};
  return g;
}
function celebrate(message){
  $('gameToast').textContent=message;$('gameToast').hidden=false;
  $('gameToast').classList.remove('pop');void $('gameToast').offsetWidth;$('gameToast').classList.add('pop');
  setTimeout(()=>{$('gameToast').hidden=true},3500);
}
function earnBadges(notify=false){const g=gameState();for(const [id,icon,title,description,eligible] of GAME_BADGES){if(eligible(g)&&!Object.hasOwn(g.badges,id)){g.badges[id]=Date.now();if(notify)celebrate(icon+' Badge unlocked: '+title)}}}
function recordGameAnswer(right,question){
  const g=gameState();test.combo=right?(test.combo||0)+1:0;
  if(right){g.daily.correct++;g.bestCombo=Math.max(g.bestCombo,test.combo);if(test.combo>=3)celebrate('⚡ '+test.combo+' correct in a row!')}
  else if(test.heartMode)test.hearts=Math.max(0,(test.hearts??5)-1);
  if(!Array.isArray(test.answerResults))test.answerResults=[];
  if(!test.answerResults.some(answer=>answer.index===test.i))test.answerResults.push({index:test.i,right,topic:question.topic||'Arcade'});
  earnBadges(true);renderGame();
}
function recordGameFinish(){
  const g=gameState();g.daily.completed++;
  if(test.correct===test.count){g.daily.perfect++;g.perfectTests++;celebrate('🏆 Perfect round! Every answer correct!')}
  else celebrate('🎉 Lesson complete! Keep exploring!');
  if(test.mode==='moe'){
    const groups=new Map();for(const answer of test.answerResults||[]){const totals=groups.get(answer.topic)||{correct:0,total:0};totals.total++;if(answer.right)totals.correct++;groups.set(answer.topic,totals)}
    for(const [topic,totals] of groups)if(totals.correct/totals.total>=0.8){const key=JSON.stringify([test.stage,test.subject,test.grade,topic]);g.paths[key]=(Number(g.paths[key])||0)+1}
  }
  earnBadges(true);renderGame();
}
function claimDaily(kind){
  const g=gameState(),quests={goal:[g.daily.correct,g.goal,5],lessons:[g.daily.completed,2,5],perfect:[g.daily.perfect,1,5]};
  const quest=quests[kind];if(!quest||quest[0]<quest[1]||g.daily.claimed[kind])return;
  g.daily.claimed[kind]=true;g.stars+=quest[2];if(kind==='goal')g.goalsClaimed++;earnBadges(true);save();renderGame();celebrate('💎 +5 gems! Daily quest complete!');
}
function renderGame(){
  if(!$('dailyQuests'))return;const g=gameState();earnBadges();
  document.body.dataset.theme=g.theme;$('gems').textContent=g.stars+' gems';
  const level=Math.floor(state.completed/5)+1;$('journeyLevel').textContent='Explorer level '+level;$('journeyProgress').value=state.completed%5;$('journeyText').textContent=(state.completed%5)+'/5 tests towards the next level';
  $('dailyGoal').value=g.goal;$('dailyQuests').replaceChildren();
  for(const [id,title,value,target] of [['goal','Answer '+g.goal+' questions correctly',g.daily.correct,g.goal],['lessons','Complete 2 tests',g.daily.completed,2],['perfect','Complete 1 perfect test',g.daily.perfect,1]]){
    const card=document.createElement('div');card.className='quest-card';const label=document.createElement('p');label.textContent=title+' · '+Math.min(value,target)+'/'+target;const progress=document.createElement('progress');progress.max=target;progress.value=Math.min(value,target);const button=document.createElement('button');button.textContent=g.daily.claimed[id]?'✓ Reward claimed':'Claim 5 gems';button.disabled=value<target||Boolean(g.daily.claimed[id]);button.onclick=()=>claimDaily(id);card.append(label,progress,button);$('dailyQuests').appendChild(card)
  }
  $('badgeShelf').replaceChildren();for(const [id,icon,title,description] of GAME_BADGES){const badge=document.createElement('div');const earned=Object.hasOwn(g.badges,id);badge.className='badge '+(earned?'earned':'locked');badge.textContent=(earned?icon:'🔒')+' '+title;badge.title=description;const small=document.createElement('small');small.textContent=description;badge.appendChild(small);$('badgeShelf').appendChild(badge)}
  const active=test&&!test.finished;const blocked=active&&test.heartMode&&test.hearts<=0;
  $('heartStatus').textContent=active?(test.heartMode?'♥'.repeat(test.hearts??5)+'♡'.repeat(5-(test.hearts??5))+' · '+(test.hearts??5)+' hearts':'∞ Relaxed practice'):'Choose relaxed practice or a 5-heart challenge';
  $('comboStatus').textContent=active?'⚡ Combo: '+(test.combo||0):'⚡ Best combo: '+g.bestCombo;
  $('heartHelp').hidden=!blocked;if(active)$('next').disabled=Boolean(blocked);
  $('learningTrail').replaceChildren();
  if($('practiceMode').value!=='moe'){$('trailNote').textContent='Choose School syllabus practice to explore a topic trail.';return}
  const stage=$('schoolStage').value,subject=$('subject').value,grade=Number($('primaryGrade').value);
  const topics=[...new Set(schoolPool(stage,subject,grade).map(question=>question.topic))];
  $('trailNote').textContent='Choose a topic for a short lesson. A tested topic earns a star at 80% accuracy or above. This trail tracks practice, not full syllabus mastery.';
  topics.forEach((topic,index)=>{const key=JSON.stringify([stage,subject,grade,topic]),done=Number(g.paths[key])>0;const button=document.createElement('button');button.className='trail-node '+(done?'done':'');button.textContent=(done?'★':'▶')+' '+(index+1)+'. '+topic;button.onclick=()=>{$('moeTopic').value=topic;configureMoe(false,false);const options=[...$('count').options].map(option=>Number(option.value));$('count').value=options.includes(5)?5:options[0];$('start').onclick()};$('learningTrail').appendChild(button)})
}
function initGame(){
  $('dailyGoal').onchange=()=>{gameState().goal=Number($('dailyGoal').value);save();renderGame()};
  $('relaxChallenge').onclick=()=>{if(!test)return;test.heartMode=false;save();renderGame();celebrate('🌱 Continue learning in relaxed mode!')};
  for(const [id,theme,cost] of [['skinViolet','violet',0],['skinMint','mint',10],['skinGold','gold',20]])$(id).onclick=()=>{const g=gameState();if(!g.skins.includes(theme)){if(g.stars<cost){$('skinMessage').textContent='Complete daily quests to earn more gems.';return}g.stars-=cost;g.skins.push(theme)}g.theme=theme;$('skinMessage').textContent='Theme selected: '+theme;save();renderGame()};
  renderGame();save();
}
