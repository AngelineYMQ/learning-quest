'use strict';
const EXTRA_AVATAR_OPTIONS={skin:['peach','tan','brown','deep','rose','gold'],hair:['short','curly','spiky','bald'],hairColor:['brown','black','gold','purple','red'],shirt:['violet','mint','blue','pink','gold','red'],eyes:['happy','calm','wink'],accessory:['none','glasses','cap']};
const EXTRA_AVATAR_DEFAULT={skin:'peach',hair:'curly',hairColor:'brown',shirt:'mint',eyes:'happy',accessory:'none'};
const EXTRA_TIERS=['🥉 Bronze','🥈 Silver','🥇 Gold','💠 Crystal','🏆 Master'];
function cleanAvatar(value){const result={};for(const [key,options] of Object.entries(EXTRA_AVATAR_OPTIONS))result[key]=options.includes(value?.[key])?value[key]:EXTRA_AVATAR_DEFAULT[key];return result}
function extraState(){
 if(!state.social||typeof state.social!=='object'||Array.isArray(state.social))state.social={};const s=state.social;
 s.avatar=cleanAvatar(s.avatar);
 if(!s.book||typeof s.book!=='object'||Array.isArray(s.book))s.book={};
 if(!Array.isArray(s.pending))s.pending=[];
 if(!Array.isArray(s.receipts))s.receipts=[];
 if(!s.months||typeof s.months!=='object'||Array.isArray(s.months))s.months={};
 if(!Array.isArray(s.monthBadges))s.monthBadges=[];
 for(const [key,item] of Object.entries(s.book))if(!item||!validExtraQuestion(item.question)||!Number.isInteger(item.level)||item.level<0||item.level>8)delete s.book[key];
 s.pending=s.pending.filter(item=>item&&typeof item.id==='string'&&['quiz','review','match'].includes(item.kind)&&Number.isInteger(item.correct)&&Number.isInteger(item.total)&&item.total>=1&&item.total<=50&&item.correct>=0&&item.correct<=item.total);
 s.receipts=s.receipts.filter(item=>typeof item==='string'&&item.length<200);
 s.monthBadges=[...new Set(s.monthBadges.filter(item=>typeof item==='string'&&/^\d{4}-\d{2}$/.test(item)))];
 const r=s.review;if(r&&(!Array.isArray(r.questions)||!r.questions.length||r.questions.length>10||!r.questions.every(item=>item&&validExtraQuestion(item.question)&&Number.isInteger(item.level)&&item.level>=0&&item.level<9)||!Number.isInteger(r.i)||r.i<0||r.i>r.questions.length||(!r.finished&&r.i===r.questions.length)))s.review=null;
 const m=s.match;if(m&&(!Array.isArray(m.pairs)||!m.pairs.length||m.pairs.length>6||!m.pairs.every(p=>p&&Number.isInteger(p.id)&&typeof p.left==='string'&&typeof p.right==='string')||!Array.isArray(m.matched)||!Array.isArray(m.leftOrder)||!Array.isArray(m.rightOrder)||!Number.isFinite(m.deadline)||typeof m.xp!=='string'||!/^\d{1,1000}$/.test(m.xp)))s.match=null;
 return s;
}
function playerIdentity(){const s=extraState();if(!/^[0-9a-f-]{36}$/i.test(s.id||'')||!/^[0-9a-f]{64}$/i.test(s.key||'')){s.id=crypto.randomUUID();s.key=[...crypto.getRandomValues(new Uint8Array(32))].map(n=>n.toString(16).padStart(2,'0')).join('');s.registered=false;save()}return s}
function avatarSvg(value){
 const a=cleanAvatar(value),skin={peach:'#ffdbc2',tan:'#eeb98d',brown:'#bd815b',deep:'#89573f',rose:'#ffd0d5',gold:'#f7d98b'}[a.skin],hair={brown:'#754b40',black:'#343247',gold:'#f5c260',purple:'#a88aee',red:'#d67863'}[a.hairColor],shirt={violet:'#aa9cff',mint:'#80dfc3',blue:'#86c6f4',pink:'#f4a8c9',gold:'#f4d078',red:'#f2919c'}[a.shirt];
 const hairShape={short:'<path d="M24 57Q18 20 53 19Q88 18 89 53L77 43Q66 53 52 37Q45 51 24 57Z"/>',curly:'<path d="M23 58Q14 46 22 35Q19 22 33 22Q36 11 49 17Q62 8 70 20Q86 17 87 32Q99 38 87 57L76 45Q61 51 50 37Q41 52 23 58Z"/>',spiky:'<path d="M22 58L20 30L33 34L38 14L51 27L65 12L70 30L87 25L89 57L74 44L60 48L47 36L35 51Z"/>',bald:''}[a.hair];
 const eye='<ellipse cx="37" cy="60" rx="7" ry="10" fill="#393348"/><ellipse cx="70" cy="60" rx="7" ry="10" fill="#393348"/><ellipse cx="35" cy="56" rx="2.7" ry="3.5" fill="white"/><ellipse cx="68" cy="56" rx="2.7" ry="3.5" fill="white"/><circle cx="40" cy="65" r="1.4" fill="#b9a4dc"/><circle cx="73" cy="65" r="1.4" fill="#b9a4dc"/>';
 const eyes=a.eyes==='happy'?eye:a.eyes==='wink'?'<path d="M30 59Q37 52 44 59" fill="none" stroke="#393348" stroke-width="3" stroke-linecap="round"/>'+eye.slice(eye.indexOf('<ellipse cx="70"')).replace(/<ellipse cx="35"[^>]*\/>/,'').replace(/<circle cx="40"[^>]*\/>/,''): '<path d="M30 59Q37 54 44 59M63 59Q70 54 77 59" fill="none" stroke="#393348" stroke-width="3" stroke-linecap="round"/>';
 const accessory=a.accessory==='glasses'?'<g fill="none" stroke="#685278" stroke-width="2.5"><circle cx="37" cy="60" r="13"/><circle cx="70" cy="60" r="13"/><path d="M50 60H57"/></g>':a.accessory==='cap'?'<path d="M23 39Q22 10 55 12Q86 13 87 39Z" fill="'+shirt+'"/><path d="M21 38Q54 29 94 40" fill="none" stroke="#706093" stroke-width="5" stroke-linecap="round"/><path d="M55 18L57 27" stroke="white" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>':'';
 return '<svg class="avatar-svg" viewBox="0 0 110 110" role="img" aria-label="Player avatar"><circle cx="55" cy="55" r="54" fill="#ede7ff"/><circle cx="87" cy="19" r="5" fill="#fff"/><path d="M12 20L14 15L16 20L21 22L16 24L14 29L12 24L7 22Z" fill="#f5c870"/><path d="M20 111Q25 84 54 84Q87 84 91 111" fill="'+shirt+'"/><path d="M46 84L54 94L64 84" fill="white" opacity=".85"/><ellipse cx="24" cy="61" rx="7" ry="10" fill="'+skin+'"/><ellipse cx="86" cy="61" rx="7" ry="10" fill="'+skin+'"/><path d="M23 48Q23 22 54 22Q87 22 87 49L87 65Q86 87 55 89Q24 87 23 65Z" fill="'+skin+'"/><g fill="'+hair+'">'+hairShape+'</g><ellipse cx="30" cy="73" rx="8" ry="4" fill="#f49baa" opacity=".55"/><ellipse cx="79" cy="73" rx="8" ry="4" fill="#f49baa" opacity=".55"/>'+eyes+'<path d="M48 75Q54 82 61 75" fill="none" stroke="#ac5f68" stroke-width="2.5" stroke-linecap="round"/>'+accessory+'</svg>';
}
function monthKey(){return new Date(Date.now()+8*3600000).toISOString().slice(0,7)}
function monthProgress(){const s=extraState(),month=monthKey();if(!s.months[month]||typeof s.months[month]!=='object'||Array.isArray(s.months[month]))s.months[month]={tasks:{},claimed:false};const m=s.months[month];if(!m.tasks||typeof m.tasks!=='object'||Array.isArray(m.tasks))m.tasks={};return m}
function trackMonthly(kind,day=gameState().daily.day){if(!['goal','lessons','perfect'].includes(kind))return;monthProgress().tasks[day+':'+kind]=true;renderExtrasSummary()}
function claimMonthly(){const m=monthProgress();if(Object.keys(m.tasks).length<30||m.claimed)return;m.claimed=true;const s=extraState();if(!s.monthBadges.includes(monthKey()))s.monthBadges.push(monthKey());gameState().stars+=20;save();renderGame();celebrate('🏅 Monthly badge unlocked! +20 gems')}
function questionKey(question,context){return JSON.stringify([context.subject,context.stage||'',context.grade||0,question.q,question.a])}
function validExtraQuestion(q){return q&&typeof q.q==='string'&&typeof q.a==='string'&&Array.isArray(q.choices)&&q.choices.length===4&&q.choices.every(x=>typeof x==='string')&&new Set(q.choices).size===4&&q.choices.includes(q.a)}
function rememberAnswer(right,question,context=test){
 if(right||!context||!validExtraQuestion(question))return;const s=extraState(),key=questionKey(question,context),old=s.book[key];
 s.book[key]={key,subject:context.subject,stage:context.stage,grade:context.grade,level:Math.max(0,Math.min(8,Number(context.level)||0)),question:{q:question.q,a:question.a,choices:[...question.choices],topic:question.topic||context.subject,explanation:question.explanation||''},errors:(Number(old?.errors)||0)+1,reviewWins:0,last:Date.now()};
 const items=Object.values(s.book).sort((a,b)=>a.last-b.last);while(items.length>200)delete s.book[items.shift().key];
 renderExtrasSummary();
}
function shuffleExtra(items){const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy}
function startReview(){
 const s=extraState();if(s.review&&!s.review.finished){s.review.paused=false;save();renderReview();$('reviewRunner').scrollIntoView?.({behavior:'smooth',block:'start'});return}
 const subject=$('reviewSubject').value||'All',items=Object.values(s.book).filter(item=>(subject==='All'||item.subject===subject)&&validExtraQuestion(item.question));
 if(!items.length){$('reviewFeedback').textContent='No mistakes to review in this subject yet.';return}
 s.review={id:crypto.randomUUID(),mode:'review',questions:shuffleExtra(items).slice(0,10).map(item=>({...item,question:{...item.question,choices:shuffleExtra(item.question.choices)}})),i:0,correct:0,combo:0,answered:false,chosen:null,feedback:'',paused:false,finished:false};save();renderReview();$('reviewRunner').scrollIntoView?.({behavior:'smooth',block:'start'});
}
function answerReview(choice){
 const s=extraState(),r=s.review;if(!r||r.finished||r.paused||r.answered)return;const item=r.questions[r.i];if(!item.question.choices.includes(choice))return;
 r.answered=true;r.chosen=choice;const right=choice===item.question.a;if(typeof recordLearningAnswer==='function')recordLearningAnswer(right,item.question,item);if(typeof recordProfileAnswer==='function')recordProfileAnswer(right);
 if(right){r.correct++;r.combo=(r.combo||0)+1;const record=s.book[item.key];if(record){record.reviewWins=(Number(record.reviewWins)||0)+1;if(record.reviewWins>=2)delete s.book[item.key]}
  const g=gameState();g.daily.correct++;g.bestCombo=Math.max(g.bestCombo,r.combo);earnBadges(true);const xp=award(levels[item.level][1]);r.feedback='Correct! +'+sci(xp)+' XP.'+(s.book[item.key]?' One more correct review to master this question.':' Mastered! Removed from your mistake book.');
 }else{r.combo=0;rememberAnswer(false,item.question,item);r.feedback='Correct answer: '+item.question.a+'.'}
 if(item.question.explanation)r.feedback+=' '+item.question.explanation;save();renderGame();renderReview();
}
function nextReview(){const s=extraState(),r=s.review;if(!r||!r.answered||r.finished)return;r.i++;r.answered=false;r.chosen=null;r.feedback='';if(r.i>=r.questions.length){r.finished=true;state.completed++;recordGameFinish({...r,count:r.questions.length});queueRound({id:r.id,kind:'review',subject:r.questions[0]?.subject,correct:r.correct,total:r.questions.length});save();render();}else save();renderReview();}
function renderReview(){
 const s=extraState(),r=s.review,active=r&&!r.finished&&!r.paused;
 $('reviewRunner').hidden=!active;$('reviewStart').textContent=r&&!r.finished?'Continue review':'Start review';
 $('reviewSummary').textContent=r?.finished?'Last round: '+r.correct+'/'+r.questions.length+' correct.':'Answer a question correctly in two reviews to master it.';
 if(!active)return;const item=r.questions[r.i];if(!item||!validExtraQuestion(item.question)){r.paused=true;$('reviewRunner').hidden=true;return}
 $('reviewProgress').textContent=(r.i+1)+' / '+r.questions.length+' · '+r.correct+' correct · Combo '+(r.combo||0);
 $('reviewQuestion').textContent=item.subject+' · '+item.question.q;$('reviewFeedback').textContent=r.feedback||'';$('reviewNext').hidden=!r.answered;$('reviewAnswers').replaceChildren();
 for(const choice of item.question.choices){const button=document.createElement('button');button.textContent=choice;button.disabled=Boolean(r.answered);if(r.answered&&choice===item.question.a)button.classList.add('correct');else if(r.answered&&choice===r.chosen)button.classList.add('wrong');button.onclick=()=>answerReview(choice);$('reviewAnswers').appendChild(button)}
}
let matchSelection={left:null,right:null};
function startMatch(){
 const s=extraState();if(s.match&&!s.match.finished&&Date.now()<s.match.deadline){$('matchFeedback').textContent='Your round is still running. Finish it before starting another.';renderMatching();return}
 if(s.match&&!s.match.finished)finishMatch();const subject=$('matchSubject').value,bank=MATCH_BANK[subject]||MATCH_BANK.Math,usedLeft=new Set(),usedRight=new Set(),pairs=[];
 for(const [left,right] of shuffleExtra(bank)){if(usedLeft.has(left)||usedRight.has(right))continue;usedLeft.add(left);usedRight.add(right);pairs.push({id:pairs.length,left,right});if(pairs.length===6)break}
 s.match={id:crypto.randomUUID(),subject,pairs,leftOrder:shuffleExtra(pairs.map(p=>p.id)),rightOrder:shuffleExtra(pairs.map(p=>p.id)),matched:[],mistakes:0,combo:0,xp:'0',deadline:Date.now()+60000,finished:false};matchSelection={left:null,right:null};save();$('matchFeedback').textContent='Choose a prompt on the left, then its match on the right.';renderMatching();$('matchRunner').scrollIntoView?.({behavior:'smooth',block:'start'});
}
function chooseMatch(side,id){
 const r=extraState().match;if(!r||r.finished||!['left','right'].includes(side)||!r.pairs.some(p=>p.id===id)||r.matched.includes(id))return;if(Date.now()>=r.deadline){finishMatch();return}matchSelection[side]=id;
 if(matchSelection.left!==null&&matchSelection.right!==null){
  if(typeof recordProfileAnswer==='function')recordProfileAnswer(matchSelection.left===matchSelection.right);
  if(matchSelection.left===matchSelection.right){if(typeof recordLearningAnswer==='function')recordLearningAnswer(true,{q:r.pairs.find(p=>p.id===id).left+' = '+r.pairs.find(p=>p.id===id).right},{mode:'match',subject:r.subject});r.matched.push(id);r.combo++;const g=gameState();g.daily.correct++;g.bestCombo=Math.max(g.bestCombo,r.combo);earnBadges(true);const xp=award(5);r.xp=(BigInt(r.xp)+xp).toString();$('matchFeedback').textContent='✅ Matched! Combo '+r.combo;}
  else{r.mistakes++;r.combo=0;$('matchFeedback').textContent='Not a match. Try again!'}
  matchSelection={left:null,right:null};save();if(r.matched.length===r.pairs.length){finishMatch();return}
 }
 renderMatching();
}
function finishMatch(){const r=extraState().match;if(!r||r.finished)return;r.finished=true;matchSelection={left:null,right:null};queueRound({id:r.id,kind:'match',subject:r.subject,correct:r.matched.length,total:r.pairs.length});save();$('matchFeedback').textContent='Round complete: '+r.matched.length+'/'+r.pairs.length+' pairs, earned '+sci(r.xp)+' XP.';if(r.matched.length===r.pairs.length)celebrate('🎉 Every pair matched!');renderMatching();renderGame();}
function renderMatching(){
 const r=extraState().match;$('matchRunner').hidden=!r;if(!r)return;
 if(!r.finished&&Date.now()>=r.deadline){finishMatch();return}
 if(r.finished)$('matchFeedback').textContent='Round complete: '+r.matched.length+'/'+r.pairs.length+' pairs, earned '+sci(r.xp)+' XP.';
 $('matchTimer').textContent=r.finished?'Round complete':Math.max(0,Math.ceil((r.deadline-Date.now())/1000))+' sec';$('matchScore').textContent=r.subject+' · '+r.matched.length+'/'+r.pairs.length+' pairs';
 for(const side of ['left','right']){const box=$(side==='left'?'matchLeft':'matchRight');box.replaceChildren();for(const id of r[side+'Order']){const pair=r.pairs.find(p=>p.id===id);if(!pair)continue;const button=document.createElement('button');button.textContent=pair[side];button.disabled=r.finished||r.matched.includes(id);button.className='pair-tile'+(r.matched.includes(id)?' matched':'')+(matchSelection[side]===id?' selected':'');button.onclick=()=>chooseMatch(side,id);box.appendChild(button)}}
}
function tickMatch(){const r=extraState().match;if(!r||r.finished)return;if(Date.now()>=r.deadline)finishMatch();else $('matchTimer').textContent=Math.ceil((r.deadline-Date.now())/1000)+' sec';}
const EXTRA_API=location.hostname.endsWith('github.io')?'https://cyrusli.space/api':'/api';
async function cloudRequest(path,method='GET',body){const s=playerIdentity();const response=await fetch(EXTRA_API+path,{method,credentials:'same-origin',cache:'no-store',headers:{'X-Player-Id':s.id,'Authorization':'Bearer '+s.key,...(method==='POST'?{'Content-Type':'application/json'}:{})},...(method==='POST'?{body:JSON.stringify(body||{})}:{})});let data;try{data=await response.json()}catch{throw new Error('Connection unavailable. Please try again.')}if(!response.ok)throw new Error(data.error||'Online services are temporarily unavailable.');return data}
function queueRound(round){const s=extraState();if(s.pending.some(event=>event.id===round.id))return;if(typeof recordProfileRound==='function')recordProfileRound(round);s.pending.push({...round,completedAt:new Date().toISOString()});save();renderExtrasSummary();if(s.registered)syncRounds().catch(()=>{});}
let syncingRounds=false;
async function syncRounds(){const s=extraState();if(!s.registered){$('syncStatus').textContent='Save your profile to sync completed rounds to leagues.';return}if(syncingRounds)return;syncingRounds=true;
 try{while(s.pending.length){if(extraState()!==s)throw new Error('Your progress changed. Please sync again.');const event=s.pending[0];await cloudRequest('/events','POST',event);if(extraState()!==s)throw new Error('Your progress changed. Please sync again.');s.pending=s.pending.filter(item=>item.id!==event.id);save()}$('syncStatus').textContent='Progress synced.'}catch(error){$('syncStatus').textContent=s.pending.length+' rounds waiting to sync. '+error.message;throw error}finally{syncingRounds=false;renderExtrasSummary()}}
function applyReceipts(receipts){const s=extraState();let changed=false;for(const receipt of receipts||[]){if(typeof receipt.id!=='string'||!Number.isInteger(receipt.gems)||receipt.gems<0||receipt.gems>100||s.receipts.includes(receipt.id))continue;s.receipts.push(receipt.id);gameState().stars+=receipt.gems;changed=true}if(changed){save();renderGame()}return changed}
let profileNameDirty=false;
async function saveProfile(){const name=$('profileName').value.trim();if(!/^[\p{L}\p{N}_ .-]{2,20}$/u.test(name)){$('profileStatus').textContent='Use a nickname with 2–20 letters or numbers.';return}const s=extraState();$('saveProfile').disabled=true;$('profileStatus').textContent='Saving…';
 try{await cloudRequest('/player','POST',{name,avatar:s.avatar});s.registered=true;state.username=name;profileNameDirty=$('profileName').value.trim()!==name;save();render();$('profileStatus').textContent='Profile saved! You can join leagues and friend quests.';await syncRounds();await loadLeague();await loadFriends()}catch(error){$('profileStatus').textContent=error.message}finally{$('saveProfile').disabled=false}}
function avatarNode(avatar){const node=document.createElement('span');node.className='tiny-avatar';node.innerHTML=avatarSvg(avatar);return node}
async function loadLeague(){const s=extraState();if(!s.registered){$('leagueStatus').textContent='Save your profile to join this week’s league.';return}$('leagueStatus').textContent='Loading this week’s rankings…';
 try{await syncRounds();const data=await cloudRequest('/league');if($('profileLeagueSummary')){const own=data.rows.find(row=>row.id===s.id);$('profileLeagueSummary').textContent=EXTRA_TIERS[data.tier]+' · '+(own?'Rank '+own.rank+' · '+own.points+' correct this week':'No score yet');}$('leagueTitle').textContent=EXTRA_TIERS[data.tier]+' league · '+data.week;$('leagueStatus').textContent='Ranked by correct answers. Ends: '+new Date(data.ends).toLocaleString('en-SG',{timeZone:'Asia/Singapore'});$('leagueRows').replaceChildren();for(const row of data.rows){const tr=document.createElement('tr');if(row.id===s.id)tr.className='my-rank';for(const value of [row.rank,row.name,row.points]){const td=document.createElement('td');if(value===row.name){td.appendChild(avatarNode(row.avatar));td.appendChild(document.createTextNode(row.name+(row.id===s.id?' (you)':'')))}else td.textContent=value;tr.appendChild(td)}$('leagueRows').appendChild(tr)}}catch(error){$('leagueStatus').textContent=error.message;if($('profileLeagueSummary'))$('profileLeagueSummary').textContent=error.message}}
let displayedTeam=null;
function renderTeam(team){displayedTeam=team;$('friendMembers').replaceChildren();if(!team){$('friendCode').textContent='No team yet';$('friendProgress').value=0;$('friendProgressText').textContent='Answer 100 questions correctly together.';$('friendClaim').disabled=true;$('friendCopy').hidden=true;return}
 $('friendCode').textContent=team.code;$('friendCopy').hidden=false;$('friendProgress').max=team.target;$('friendProgress').value=Math.min(team.total,team.target);$('friendProgressText').textContent=team.total+'/'+team.target+' · '+team.members.length+'/2 players · Ends '+new Date(team.ends).toLocaleString('en-SG',{timeZone:'Asia/Singapore'});
 for(const member of team.members){const line=document.createElement('p');line.appendChild(avatarNode(member.avatar));line.appendChild(document.createTextNode(member.name+': '+member.points+' answers'));$('friendMembers').appendChild(line)}
 const receipt='friends:'+team.week+':'+team.code+':'+extraState().id,claimed=extraState().receipts.includes(receipt);$('friendClaim').textContent=claimed?'15 gems claimed':'Claim 15 gems';$('friendClaim').disabled=claimed||team.members.length!==2||team.total<team.target;
}
async function loadFriends(){if(!extraState().registered){$('friendStatus').textContent='Save your profile before creating or joining a team.';renderTeam(null);return}try{await syncRounds();const data=await cloudRequest('/me');applyReceipts(data.receipts);renderTeam(data.team);if(typeof renderProfileDashboard==='function')renderProfileDashboard();$('friendStatus').textContent=data.team?'Rounds completed after joining count. One team per player each week.':'Create an invite code for a friend, or enter theirs to join.'}catch(error){$('friendStatus').textContent=error.message;if($('profileTeamSummary'))$('profileTeamSummary').textContent=error.message}}
async function friendAction(action){if(!extraState().registered){$('friendStatus').textContent='Save your profile first.';return}$('friendStatus').textContent='Updating team…';for(const id of ['friendCreate','friendJoin','friendClaim'])$(id).disabled=true;
 try{await syncRounds();const data=await cloudRequest(action==='create'?'/team':action==='join'?'/team/join':'/team/claim','POST',action==='join'?{code:$('friendJoinCode').value}:{});if(data.receipts)applyReceipts(data.receipts);await loadFriends();if(action==='claim')celebrate('🤝 Friend quest complete! +15 gems')}catch(error){$('friendStatus').textContent=error.message}finally{$('friendCreate').disabled=false;$('friendJoin').disabled=false;if(displayedTeam)renderTeam(displayedTeam);else $('friendClaim').disabled=true}}
function renderExtrasSummary(){
 if($('accountAvatar'))$('accountAvatar').innerHTML=avatarSvg(extraState().avatar);
 if(!$('monthlyProgress'))return;const s=extraState(),m=monthProgress(),count=Object.keys(m.tasks).length;
 $('monthlyTitle').textContent=monthKey()+' monthly collection';$('monthlyProgress').value=Math.min(30,count);$('monthlyCount').textContent=Math.min(30,count)+'/30 daily quests';$('monthlyClaim').disabled=count<30||Boolean(m.claimed);$('monthlyClaim').textContent=m.claimed?'Monthly badge claimed':'Claim badge + 20 gems';
 $('mistakeCount').textContent=Object.values(s.book).filter(item=>validExtraQuestion(item.question)).length+' mistakes to review';$('reviewStart').disabled=!Object.values(s.book).some(item=>validExtraQuestion(item.question))&&!(s.review&&!s.review.finished);
 $('monthlyBadges').replaceChildren();for(const month of s.monthBadges.filter(x=>/^\d{4}-\d{2}$/.test(x)).sort().reverse()){const card=document.createElement('div');card.className='monthly-badge';card.textContent='🏅 '+month;$('monthlyBadges').appendChild(card)}if(!s.monthBadges.length)$('monthlyBadges').textContent='Your monthly badges will appear here.';
 $('pendingCount').textContent=s.pending.length?s.pending.length+' rounds waiting to sync':'';if(typeof renderProfileDashboard==='function')renderProfileDashboard();
}
function renderProfile(){const s=extraState();if(!profileNameDirty)$('profileName').value=state.username;for(const key of Object.keys(EXTRA_AVATAR_OPTIONS))$('avatar'+key).value=s.avatar[key];$('avatarPreview').innerHTML=avatarSvg(s.avatar);renderExtrasSummary()}
function renderReviewSubjects(){const selected=$('reviewSubject').value;$('reviewSubject').replaceChildren();$('reviewSubject').add(new Option('All mistakes','All'));for(const subject of [...new Set(Object.values(extraState().book).filter(item=>validExtraQuestion(item.question)).map(item=>item.subject))])$('reviewSubject').add(new Option(subject,subject));if([...$('reviewSubject').options].some(item=>item.value===selected))$('reviewSubject').value=selected;}
function extraTabChanged(tab){if(tab==='challenges'){renderReviewSubjects();renderReview();renderMatching();renderExtrasSummary();loadFriends()}else if(tab==='profile')renderProfile();else if(tab==='leaderboard')loadLeague()}
function initExtras(){
 extraState();playerIdentity();for(const kind of Object.keys(gameState().daily.claimed))if(gameState().daily.claimed[kind])trackMonthly(kind);
 if(pendingSession?.answered&&pendingSession.chosen!==pendingSession.question?.a){const key=questionKey(pendingSession.question,pendingSession);if(!extraState().book[key])rememberAnswer(false,pendingSession.question,pendingSession)}
 for(const subject of Object.keys(MATCH_BANK))$('matchSubject').add(new Option(subject,subject));$('matchSubject').value='Math';$('matchStart').onclick=startMatch;
 $('reviewStart').onclick=startReview;$('reviewNext').onclick=nextReview;$('reviewPause').onclick=()=>{const r=extraState().review;if(r){r.paused=true;save();renderReview()}};
 $('profileName').oninput=()=>{profileNameDirty=true;};$('profileName').onkeydown=event=>{if(event.key==='Enter'&&!$('saveProfile').disabled){event.preventDefault();saveProfile()}};$('monthlyClaim').onclick=claimMonthly;$('saveProfile').onclick=saveProfile;$('refreshLeague').onclick=loadLeague;$('friendCreate').onclick=()=>friendAction('create');$('friendJoin').onclick=()=>friendAction('join');$('friendClaim').onclick=()=>friendAction('claim');$('refreshFriends').onclick=loadFriends;
 $('syncRounds').onclick=async()=>{try{await syncRounds();await loadLeague();await loadFriends()}catch{}};
 $('friendCopy').onclick=async()=>{if(!displayedTeam)return;try{await navigator.clipboard.writeText(displayedTeam.code);$('friendStatus').textContent='Invite code copied. Share it with your friend.'}catch{$('friendStatus').textContent='Invite code: '+displayedTeam.code+' — copy it manually.'}};
 for(const key of Object.keys(EXTRA_AVATAR_OPTIONS))$('avatar'+key).onchange=()=>{const s=extraState();s.avatar[key]=$('avatar'+key).value;s.avatar=cleanAvatar(s.avatar);save();$('avatarPreview').innerHTML=avatarSvg(s.avatar);renderExtrasSummary();$('profileStatus').textContent='Avatar saved in this browser. Save profile to update it online.'};
 renderProfile();renderReviewSubjects();renderReview();renderMatching();renderExtrasSummary();save();setInterval(tickMatch,250);setInterval(()=>{if(extraState().registered&&extraState().pending.length)syncRounds().catch(()=>{})},60000);
}
