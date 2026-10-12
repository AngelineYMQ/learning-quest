'use strict';
const PROFILE_PAGES=['play','challenges','profile','shop','shield','leaderboard','inventory'];
let profilePage='play';
function openLearningPage(page,push=true){
 if(!PROFILE_PAGES.includes(page))page='play';profilePage=page;
 if(push&&location.hash!=='#/'+page)history.pushState({page},'','#/'+page);
 document.body.dataset.page=page;
 document.querySelectorAll('[data-tab]').forEach(button=>button.classList.toggle('active',button.dataset.tab===page));
 document.querySelectorAll('main>section.panel').forEach(panel=>panel.hidden=panel.id!==page);
 document.title=(page==='profile'?'Profile · ':'')+'Learning Quest';render();extraTabChanged(page);
 if(page==='leaderboard')loadLeaderboard();
 if(page==='profile'){renderProfileDashboard();loadLeague();loadFriends()}
 if(page==='play'&&test&&!test.finished)$('quiz').scrollIntoView?.({block:'start'});else window.scrollTo?.({top:0,left:0,behavior:'instant'});
}
function profileDay(date=Date.now()){return new Date(date+8*3600000).toISOString().slice(0,10)}
function profileProgress(){
 if(!state.profileProgress||typeof state.profileProgress!=='object'||Array.isArray(state.profileProgress))state.profileProgress={};const p=state.profileProgress;
 if(!Number.isFinite(p.started))p.started=Date.now();
 if(!p.days||typeof p.days!=='object'||Array.isArray(p.days))p.days={};
 if(!Array.isArray(p.rounds))p.rounds=[];p.rounds=p.rounds.filter(r=>r&&typeof r.id==='string'&&['quiz','review','match'].includes(r.kind)&&Number.isInteger(r.correct)&&Number.isInteger(r.total)&&r.total>0&&r.total<=50&&r.correct>=0&&r.correct<=r.total&&Number.isFinite(r.at)).slice(-30);
 if(!Array.isArray(p.pins))p.pins=GAME_BADGES.filter(b=>Object.hasOwn(gameState().badges,b[0])).slice(-3).map(b=>b[0]);p.pins=[...new Set(p.pins.filter(id=>GAME_BADGES.some(b=>b[0]===id)))].slice(0,3);
 return p;
}
function profileDaily(){const p=profileProgress(),day=profileDay();if(!p.days[day]||typeof p.days[day]!=='object')p.days[day]={correct:0,total:0,xp:'0'};const d=p.days[day];for(const key of ['correct','total'])if(!Number.isSafeInteger(d[key])||d[key]<0)d[key]=0;if(typeof d.xp!=='string'||!/^\d{1,1000}$/.test(d.xp))d.xp='0';for(const date of Object.keys(p.days))if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||date<profileDay(Date.now()-365*86400000))delete p.days[date];return d}
function recordProfileAnswer(right){const d=profileDaily();d.total++;if(right)d.correct++}
function recordProfileXp(xp){const d=profileDaily();d.xp=(BigInt(d.xp)+BigInt(xp)).toString()}
function recordProfileRound(round){const p=profileProgress();if(p.rounds.some(r=>r.id===round.id))return;p.rounds.push({id:round.id,kind:round.kind,subject:round.subject||'Mixed practice',correct:round.correct,total:round.total,at:Date.now()});p.rounds=p.rounds.slice(-30)}
function pinProfileBadge(id){const p=profileProgress();if(!Object.hasOwn(gameState().badges,id))return;if(p.pins.includes(id))p.pins=p.pins.filter(x=>x!==id);else{if(p.pins.length>=3){$('profilePinStatus').textContent='Unpin a badge first. You can showcase up to 3.';return}p.pins.push(id)}save();$('profilePinStatus').textContent='Badge showcase saved.';renderProfileDashboard()}
function renderProfileDashboard(){
 if(!$('profileHeroName'))return;const p=profileProgress(),g=gameState(),s=extraState();
 $('profileHeroName').textContent=state.username;$('profileHeroAvatar').innerHTML=avatarSvg(s.avatar);$('profileExplorer').textContent='Explorer level '+(Math.floor(state.completed/5)+1);$('profileCloudStatus').textContent=s.registered?'Online profile connected':'Save your profile to join leagues and friend quests';
 const values={profileLifetime:sci(state.lifetime),profileStreak:state.streak+(state.streak===1?' day':' days'),profileTests:state.completed,profileCombo:g.bestCombo,profileGems:g.stars,profileMinutes:Math.floor(state.playSeconds/60)+' min'};for(const [id,value] of Object.entries(values))$(id).textContent=value;
 $('profilePinned').replaceChildren();const earned=GAME_BADGES.filter(b=>Object.hasOwn(g.badges,b[0]));const featured=p.pins.filter(id=>Object.hasOwn(g.badges,id));for(const id of featured){const badge=GAME_BADGES.find(b=>b[0]===id),item=document.createElement('span');item.className='profile-pin';item.textContent=badge[1]+' '+badge[2];$('profilePinned').appendChild(item)}if(!featured.length)$('profilePinned').textContent=earned.length?'Pin your favourite badges below.':'Your first badge is waiting. Complete a test to earn it!';
 $('profileBadgeGrid').replaceChildren();for(const [id,icon,title,description] of GAME_BADGES){const unlocked=Object.hasOwn(g.badges,id),card=document.createElement('article');card.className='badge '+(unlocked?'earned':'locked');const heading=document.createElement('strong');heading.textContent=(unlocked?icon:'🔒')+' '+title;const text=document.createElement('small');text.textContent=description;card.append(heading,text);if(unlocked){const button=document.createElement('button');button.textContent=p.pins.includes(id)?'Unpin badge':'Pin badge';button.setAttribute?.('aria-pressed',String(p.pins.includes(id)));button.onclick=()=>pinProfileBadge(id);card.appendChild(button)}$('profileBadgeGrid').appendChild(card)}
 $('profileWeek').replaceChildren();let total=0,correct=0;
 for(let i=6;i>=0;i--){const date=Date.now()-i*86400000,key=profileDay(date),entry=p.days[key],count=Number.isSafeInteger(entry?.correct)?entry.correct:0,attempts=Number.isSafeInteger(entry?.total)?entry.total:0;total+=attempts;correct+=count;const day=document.createElement('div');day.className='profile-day'+(count?' practiced':'');const name=document.createElement('span');name.textContent=new Date(date).toLocaleDateString('en-SG',{weekday:'short',timeZone:'Asia/Singapore'});const number=document.createElement('strong');number.textContent=count;const label=document.createElement('small');label.textContent='correct';day.append(name,number,label);$('profileWeek').appendChild(day)}
 $('profileWeekSummary').textContent=correct+' correct answers · '+total+' attempts'+(total?' · '+Math.round(correct/total*100)+'% accuracy':'');$('profileTracking').textContent='Tracking on this browser since '+new Date(p.started).toLocaleDateString('en-SG',{timeZone:'Asia/Singapore'})+'. Earlier activity is not reconstructed.';
 $('profileRecent').replaceChildren();for(const round of [...p.rounds].reverse().slice(0,8)){const card=document.createElement('li'),title=document.createElement('strong'),info=document.createElement('small');title.textContent=(round.kind==='match'?'⏱️ Matching':round.kind==='review'?'📚 Mistake review':'📝 '+round.subject)+' · '+round.correct+'/'+round.total;info.textContent=new Date(round.at).toLocaleString('en-SG',{timeZone:'Asia/Singapore'});card.append(title,info);$('profileRecent').appendChild(card)}if(!p.rounds.length){const li=document.createElement('li');li.textContent='Complete a round to start your activity feed.';$('profileRecent').appendChild(li)}
 $('profileGoal').value=g.goal;
 if(!s.registered){$('profileLeagueSummary').textContent='Save your profile to enter the weekly league.';$('profileTeamSummary').textContent='Save your profile, then team up with a friend.'}
 else if(displayedTeam){$('profileTeamSummary').textContent=displayedTeam.members.map(m=>m.name).join(' + ')+' · '+displayedTeam.total+'/'+displayedTeam.target+' correct'}else $('profileTeamSummary').textContent='Create or join a team in Challenges.';
}
async function copyProfileProgress(){const text=state.username+' · Learning Quest\nExplorer level '+(Math.floor(state.completed/5)+1)+' · '+state.streak+'-day streak\n'+state.completed+' tests completed · '+sci(state.lifetime)+' lifetime XP\nhttps://cyrusli.space/';try{await navigator.clipboard.writeText(text);$('profileShareStatus').textContent='Progress card copied. Share it wherever you like.'}catch{$('profileShareText').hidden=false;$('profileShareText').value=text;$('profileShareStatus').textContent='Select and copy your progress card below.'}}
function initProfilePage(){
 document.querySelectorAll('[data-tab]').forEach(button=>button.onclick=()=>openLearningPage(button.dataset.tab));
 $('profileGoal').onchange=()=>{gameState().goal=Number($('profileGoal').value);save();renderGame();renderProfileDashboard()};$('profileShare').onclick=copyProfileProgress;
 const restore=()=>{const page=location.hash?.replace(/^#\//,'')||'play';if(profilePage!==page||document.body.dataset.page!==page)openLearningPage(page,false)};window.addEventListener('popstate',restore);window.addEventListener('hashchange',restore);profileProgress();save();restore();
}
