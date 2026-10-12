'use strict';
const EXTRA_AVATAR_OPTIONS={skin:['peach','tan','brown','deep','rose','gold'],hair:['short','curly','spiky','bald'],hairColor:['brown','black','gold','purple','red'],shirt:['violet','mint','blue','pink','gold','red'],eyes:['happy','calm','wink'],accessory:['none','glasses','cap']};
const EXTRA_AVATAR_DEFAULT={skin:'peach',hair:'curly',hairColor:'brown',shirt:'mint',eyes:'happy',accessory:'none'};
const EXTRA_TIERS=['🥉 青铜','🥈 白银','🥇 黄金','💠 水晶','🏆 大师'];
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
 const a=cleanAvatar(value),skin={peach:'#f5c9a5',tan:'#dca979',brown:'#a96e45',deep:'#71452f',rose:'#efb8b3',gold:'#efcc71'}[a.skin],hairColor={brown:'#6c412c',black:'#202333',gold:'#e4b547',purple:'#8b64bd',red:'#b9563e'}[a.hairColor],shirt={violet:'#8f84ff',mint:'#37bfa3',blue:'#4c9cde',pink:'#e888b0',gold:'#e8b54a',red:'#d95b6a'}[a.shirt];
 const hair={short:'<path d="M20 45Q17 15 50 15Q83 16 80 44L72 33Q55 39 29 31Z"/>',curly:'<circle cx="28" cy="28" r="12"/><circle cx="42" cy="21" r="12"/><circle cx="58" cy="21" r="12"/><circle cx="73" cy="28" r="12"/>',spiky:'<path d="M19 44L21 22L35 25L39 10L51 22L65 12L67 25L80 21L81 44L71 32L30 32Z"/>',bald:''}[a.hair];
 const eyes=a.eyes==='happy'?'<path d="M32 52Q37 46 42 52M58 52Q63 46 68 52" fill="none" stroke="#253146" stroke-width="3" stroke-linecap="round"/>':a.eyes==='wink'?'<path d="M32 51L41 51" stroke="#253146" stroke-width="3" stroke-linecap="round"/><circle cx="63" cy="51" r="3"/>':'<circle cx="37" cy="51" r="3"/><circle cx="63" cy="51" r="3"/>';
 const accessory=a.accessory==='glasses'?'<g fill="none" stroke="#253146" stroke-width="3"><rect x="27" y="43" width="20" height="17" rx="5"/><rect x="53" y="43" width="20" height="17" rx="5"/><path d="M47 48H53"/></g>':a.accessory==='cap'?'<path d="M19 35Q19 6 51 11Q79 12 80 35Z" fill="'+shirt+'"/><path d="M15 35H85" stroke="#253146" stroke-width="5" stroke-linecap="round"/>':'';
 return '<svg class="avatar-svg" viewBox="0 0 100 100" role="img" aria-label="玩家头像"><circle cx="50" cy="50" r="49" fill="#253563"/><path d="M8 100Q12 77 50 77Q88 77 92 100Z" fill="'+shirt+'"/><rect x="40" y="68" width="20" height="17" rx="6" fill="'+skin+'"/><ellipse cx="50" cy="48" rx="30" ry="34" fill="'+skin+'"/><g fill="'+hairColor+'">'+hair+'</g><g fill="#253146">'+eyes+'</g><path d="M40 65Q50 '+(a.eyes==='calm'?'68':'77')+' 60 65" fill="none" stroke="#773d3b" stroke-width="3" stroke-linecap="round"/>'+accessory+'</svg>';
}
function monthKey(){return new Date(Date.now()+8*3600000).toISOString().slice(0,7)}
function monthProgress(){const s=extraState(),month=monthKey();if(!s.months[month]||typeof s.months[month]!=='object'||Array.isArray(s.months[month]))s.months[month]={tasks:{},claimed:false};const m=s.months[month];if(!m.tasks||typeof m.tasks!=='object'||Array.isArray(m.tasks))m.tasks={};return m}
function trackMonthly(kind,day=gameState().daily.day){if(!['goal','lessons','perfect'].includes(kind))return;monthProgress().tasks[day+':'+kind]=true;renderExtrasSummary()}
function claimMonthly(){const m=monthProgress();if(Object.keys(m.tasks).length<30||m.claimed)return;m.claimed=true;const s=extraState();if(!s.monthBadges.includes(monthKey()))s.monthBadges.push(monthKey());gameState().stars+=20;save();renderGame();celebrate('🏅 获得本月限定徽章和 20 宝石！')}
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
 if(!items.length){$('reviewFeedback').textContent='还没有这个科目的错题。';return}
 s.review={id:crypto.randomUUID(),mode:'review',questions:shuffleExtra(items).slice(0,10).map(item=>({...item,question:{...item.question,choices:shuffleExtra(item.question.choices)}})),i:0,correct:0,combo:0,answered:false,chosen:null,feedback:'',paused:false,finished:false};save();renderReview();$('reviewRunner').scrollIntoView?.({behavior:'smooth',block:'start'});
}
function answerReview(choice){
 const s=extraState(),r=s.review;if(!r||r.finished||r.paused||r.answered)return;const item=r.questions[r.i];if(!item.question.choices.includes(choice))return;
 r.answered=true;r.chosen=choice;const right=choice===item.question.a;
 if(right){r.correct++;r.combo=(r.combo||0)+1;const record=s.book[item.key];if(record){record.reviewWins=(Number(record.reviewWins)||0)+1;if(record.reviewWins>=2)delete s.book[item.key]}
  const g=gameState();g.daily.correct++;g.bestCombo=Math.max(g.bestCombo,r.combo);earnBadges(true);const xp=award(levels[item.level][1]);r.feedback='答对了！+'+sci(xp)+' XP。'+(s.book[item.key]?' 再复习答对一次即可从错题本移除。':' 已掌握，从错题本移除。');
 }else{r.combo=0;rememberAnswer(false,item.question,item);r.feedback='正确答案：'+item.question.a+'。'}
 if(item.question.explanation)r.feedback+=' '+item.question.explanation;save();renderGame();renderReview();
}
function nextReview(){const s=extraState(),r=s.review;if(!r||!r.answered||r.finished)return;r.i++;r.answered=false;r.chosen=null;r.feedback='';if(r.i>=r.questions.length){r.finished=true;state.completed++;recordGameFinish({...r,count:r.questions.length});queueRound({id:r.id,kind:'review',correct:r.correct,total:r.questions.length});save();render();}else save();renderReview();}
function renderReview(){
 const s=extraState(),r=s.review,active=r&&!r.finished&&!r.paused;
 $('reviewRunner').hidden=!active;$('reviewStart').textContent=r&&!r.finished?'继续错题挑战':'开始错题挑战';
 $('reviewSummary').textContent=r?.finished?'上次完成：'+r.correct+'/'+r.questions.length+' 答对。':'同一题在错题挑战中答对两次，即可移出错题本。';
 if(!active)return;const item=r.questions[r.i];if(!item||!validExtraQuestion(item.question)){r.paused=true;$('reviewRunner').hidden=true;return}
 $('reviewProgress').textContent=(r.i+1)+' / '+r.questions.length+' · '+r.correct+' 答对 · 连击 '+(r.combo||0);
 $('reviewQuestion').textContent=item.subject+' · '+item.question.q;$('reviewFeedback').textContent=r.feedback||'';$('reviewNext').hidden=!r.answered;$('reviewAnswers').replaceChildren();
 for(const choice of item.question.choices){const button=document.createElement('button');button.textContent=choice;button.disabled=Boolean(r.answered);if(r.answered&&choice===item.question.a)button.classList.add('correct');else if(r.answered&&choice===r.chosen)button.classList.add('wrong');button.onclick=()=>answerReview(choice);$('reviewAnswers').appendChild(button)}
}
let matchSelection={left:null,right:null};
function startMatch(){
 const s=extraState();if(s.match&&!s.match.finished&&Date.now()<s.match.deadline){$('matchFeedback').textContent='当前回合还在计时，完成后可再挑战。';renderMatching();return}
 if(s.match&&!s.match.finished)finishMatch();const subject=$('matchSubject').value,bank=MATCH_BANK[subject]||MATCH_BANK.Math,usedLeft=new Set(),usedRight=new Set(),pairs=[];
 for(const [left,right] of shuffleExtra(bank)){if(usedLeft.has(left)||usedRight.has(right))continue;usedLeft.add(left);usedRight.add(right);pairs.push({id:pairs.length,left,right});if(pairs.length===6)break}
 s.match={id:crypto.randomUUID(),subject,pairs,leftOrder:shuffleExtra(pairs.map(p=>p.id)),rightOrder:shuffleExtra(pairs.map(p=>p.id)),matched:[],mistakes:0,combo:0,xp:'0',deadline:Date.now()+60000,finished:false};matchSelection={left:null,right:null};save();$('matchFeedback').textContent='选择左边的词或算式，再选择右边对应的意思或答案。';renderMatching();$('matchRunner').scrollIntoView?.({behavior:'smooth',block:'start'});
}
function chooseMatch(side,id){
 const r=extraState().match;if(!r||r.finished||!['left','right'].includes(side)||!r.pairs.some(p=>p.id===id)||r.matched.includes(id))return;if(Date.now()>=r.deadline){finishMatch();return}matchSelection[side]=id;
 if(matchSelection.left!==null&&matchSelection.right!==null){
  if(matchSelection.left===matchSelection.right){r.matched.push(id);r.combo++;const g=gameState();g.daily.correct++;g.bestCombo=Math.max(g.bestCombo,r.combo);earnBadges(true);const xp=award(5);r.xp=(BigInt(r.xp)+xp).toString();$('matchFeedback').textContent='✅ 配对成功！连击 '+r.combo;}
  else{r.mistakes++;r.combo=0;$('matchFeedback').textContent='这两个不匹配，再试一次。'}
  matchSelection={left:null,right:null};save();if(r.matched.length===r.pairs.length){finishMatch();return}
 }
 renderMatching();
}
function finishMatch(){const r=extraState().match;if(!r||r.finished)return;r.finished=true;matchSelection={left:null,right:null};queueRound({id:r.id,kind:'match',correct:r.matched.length,total:r.pairs.length});save();$('matchFeedback').textContent='回合完成：'+r.matched.length+'/'+r.pairs.length+' 组配对，获得 '+sci(r.xp)+' XP。';if(r.matched.length===r.pairs.length)celebrate('🎉 配对全对！');renderMatching();renderGame();}
function renderMatching(){
 const r=extraState().match;$('matchRunner').hidden=!r;if(!r)return;
 if(!r.finished&&Date.now()>=r.deadline){finishMatch();return}
 if(r.finished)$('matchFeedback').textContent='回合完成：'+r.matched.length+'/'+r.pairs.length+' 组配对，获得 '+sci(r.xp)+' XP。';
 $('matchTimer').textContent=r.finished?'回合完成':Math.max(0,Math.ceil((r.deadline-Date.now())/1000))+' 秒';$('matchScore').textContent=r.subject+' · '+r.matched.length+'/'+r.pairs.length+' 配对';
 for(const side of ['left','right']){const box=$(side==='left'?'matchLeft':'matchRight');box.replaceChildren();for(const id of r[side+'Order']){const pair=r.pairs.find(p=>p.id===id);if(!pair)continue;const button=document.createElement('button');button.textContent=pair[side];button.disabled=r.finished||r.matched.includes(id);button.className='pair-tile'+(r.matched.includes(id)?' matched':'')+(matchSelection[side]===id?' selected':'');button.onclick=()=>chooseMatch(side,id);box.appendChild(button)}}
}
function tickMatch(){const r=extraState().match;if(!r||r.finished)return;if(Date.now()>=r.deadline)finishMatch();else $('matchTimer').textContent=Math.ceil((r.deadline-Date.now())/1000)+' 秒';}
const EXTRA_API=location.hostname.endsWith('github.io')?'https://cyrusli.space/api':'/api';
async function cloudRequest(path,method='GET',body){const s=playerIdentity();const response=await fetch(EXTRA_API+path,{method,cache:'no-store',headers:{'X-Player-Id':s.id,'Authorization':'Bearer '+s.key,...(method==='POST'?{'Content-Type':'application/json'}:{})},...(method==='POST'?{body:JSON.stringify(body||{})}:{})});let data;try{data=await response.json()}catch{throw new Error('连接暂时不可用，请稍后再试。')}if(!response.ok)throw new Error(data.error||'在线服务暂时不可用。');return data}
function queueRound(round){const s=extraState();if(s.pending.some(event=>event.id===round.id))return;s.pending.push({...round,completedAt:new Date().toISOString()});save();renderExtrasSummary();if(s.registered)syncRounds().catch(()=>{});}
let syncingRounds=false;
async function syncRounds(){const s=extraState();if(!s.registered){$('syncStatus').textContent='在个人资料保存昵称和头像后，回合成绩会同步到联赛。';return}if(syncingRounds)return;syncingRounds=true;
 try{while(s.pending.length){if(extraState()!==s)throw new Error('进度已更换，请重新同步。');const event=s.pending[0];await cloudRequest('/events','POST',event);if(extraState()!==s)throw new Error('进度已更换，请重新同步。');s.pending=s.pending.filter(item=>item.id!==event.id);save()}$('syncStatus').textContent='在线成绩已同步。'}catch(error){$('syncStatus').textContent=s.pending.length+' 个回合等待同步。'+error.message;throw error}finally{syncingRounds=false;renderExtrasSummary()}}
function applyReceipts(receipts){const s=extraState();let changed=false;for(const receipt of receipts||[]){if(typeof receipt.id!=='string'||!Number.isInteger(receipt.gems)||receipt.gems<0||receipt.gems>100||s.receipts.includes(receipt.id))continue;s.receipts.push(receipt.id);gameState().stars+=receipt.gems;changed=true}if(changed){save();renderGame()}return changed}
async function saveProfile(){const name=$('profileName').value.trim();if(!/^[\p{L}\p{N}_ .-]{2,20}$/u.test(name)){$('profileStatus').textContent='昵称需要 2–20 个字母、汉字或数字。';return}const s=extraState();$('saveProfile').disabled=true;$('profileStatus').textContent='正在保存…';
 try{await cloudRequest('/player','POST',{name,avatar:s.avatar});s.registered=true;state.username=name;save();render();$('profileStatus').textContent='昵称和头像已保存，可参加联赛和好友任务。';await syncRounds();await loadLeague();await loadFriends()}catch(error){$('profileStatus').textContent=error.message}finally{$('saveProfile').disabled=false}}
function avatarNode(avatar){const node=document.createElement('span');node.className='tiny-avatar';node.innerHTML=avatarSvg(avatar);return node}
async function loadLeague(){const s=extraState();if(!s.registered){$('leagueStatus').textContent='先到个人资料保存昵称和头像，即可加入本周联赛。';return}$('leagueStatus').textContent='正在载入本周排名…';
 try{await syncRounds();const data=await cloudRequest('/league');$('leagueTitle').textContent=EXTRA_TIERS[data.tier]+'联赛 · '+data.week;$('leagueStatus').textContent='本周按答对题数排名；结束时间：'+new Date(data.ends).toLocaleString();$('leagueRows').replaceChildren();for(const row of data.rows){const tr=document.createElement('tr');if(row.id===s.id)tr.className='my-rank';for(const value of [row.rank,row.name,row.points]){const td=document.createElement('td');if(value===row.name){td.appendChild(avatarNode(row.avatar));td.appendChild(document.createTextNode(row.name+(row.id===s.id?'（你）':'')))}else td.textContent=value;tr.appendChild(td)}$('leagueRows').appendChild(tr)}}catch(error){$('leagueStatus').textContent=error.message}}
let displayedTeam=null;
function renderTeam(team){displayedTeam=team;$('friendMembers').replaceChildren();if(!team){$('friendCode').textContent='尚未组队';$('friendProgress').value=0;$('friendProgressText').textContent='两个人共同完成 100 道正确答案。';$('friendClaim').disabled=true;$('friendCopy').hidden=true;return}
 $('friendCode').textContent=team.code;$('friendCopy').hidden=false;$('friendProgress').max=team.target;$('friendProgress').value=Math.min(team.total,team.target);$('friendProgressText').textContent=team.total+'/'+team.target+' · '+team.members.length+'/2 人 · 本周结束 '+new Date(team.ends).toLocaleString();
 for(const member of team.members){const line=document.createElement('p');line.appendChild(avatarNode(member.avatar));line.appendChild(document.createTextNode(member.name+'：'+member.points+' 题'));$('friendMembers').appendChild(line)}
 const receipt='friends:'+team.week+':'+team.code+':'+extraState().id,claimed=extraState().receipts.includes(receipt);$('friendClaim').textContent=claimed?'已领取 15 宝石':'领取 15 宝石';$('friendClaim').disabled=claimed||team.members.length!==2||team.total<team.target;
}
async function loadFriends(){if(!extraState().registered){$('friendStatus').textContent='先到个人资料保存昵称和头像，再创建或加入队伍。';renderTeam(null);return}try{await syncRounds();const data=await cloudRequest('/me');applyReceipts(data.receipts);renderTeam(data.team);$('friendStatus').textContent=data.team?'加入后完成的回合计入任务；每人每周参加一队。':'创建邀请码给好友，或输入好友的邀请码加入。'}catch(error){$('friendStatus').textContent=error.message}}
async function friendAction(action){if(!extraState().registered){$('friendStatus').textContent='请先在个人资料保存昵称和头像。';return}$('friendStatus').textContent='正在更新队伍…';for(const id of ['friendCreate','friendJoin','friendClaim'])$(id).disabled=true;
 try{await syncRounds();const data=await cloudRequest(action==='create'?'/team':action==='join'?'/team/join':'/team/claim','POST',action==='join'?{code:$('friendJoinCode').value}:{});if(data.receipts)applyReceipts(data.receipts);await loadFriends();if(action==='claim')celebrate('🤝 好友任务完成，获得 15 宝石！')}catch(error){$('friendStatus').textContent=error.message}finally{$('friendCreate').disabled=false;$('friendJoin').disabled=false;if(displayedTeam)renderTeam(displayedTeam);else $('friendClaim').disabled=true}}
function renderExtrasSummary(){
 if(!$('monthlyProgress'))return;const s=extraState(),m=monthProgress(),count=Object.keys(m.tasks).length;
 $('monthlyTitle').textContent=monthKey()+' 月度收藏';$('monthlyProgress').value=Math.min(30,count);$('monthlyCount').textContent=Math.min(30,count)+'/30 个每日任务';$('monthlyClaim').disabled=count<30||Boolean(m.claimed);$('monthlyClaim').textContent=m.claimed?'本月徽章已领取':'领取徽章 + 20 宝石';
 $('mistakeCount').textContent=Object.values(s.book).filter(item=>validExtraQuestion(item.question)).length+' 道待复习错题';$('reviewStart').disabled=!Object.values(s.book).some(item=>validExtraQuestion(item.question))&&!(s.review&&!s.review.finished);
 $('monthlyBadges').replaceChildren();for(const month of s.monthBadges.filter(x=>/^\d{4}-\d{2}$/.test(x)).sort().reverse()){const card=document.createElement('div');card.className='monthly-badge';card.textContent='🏅 '+month;$('monthlyBadges').appendChild(card)}if(!s.monthBadges.length)$('monthlyBadges').textContent='完成月度挑战后，限定徽章会出现在这里。';
 $('pendingCount').textContent=s.pending.length?s.pending.length+' 个回合等待同步':'';
}
function renderProfile(){const s=extraState();$('profileName').value=state.username;for(const key of Object.keys(EXTRA_AVATAR_OPTIONS))$('avatar'+key).value=s.avatar[key];$('avatarPreview').innerHTML=avatarSvg(s.avatar);renderExtrasSummary()}
function renderReviewSubjects(){const selected=$('reviewSubject').value;$('reviewSubject').replaceChildren();$('reviewSubject').add(new Option('全部错题','All'));for(const subject of [...new Set(Object.values(extraState().book).filter(item=>validExtraQuestion(item.question)).map(item=>item.subject))])$('reviewSubject').add(new Option(subject,subject));if([...$('reviewSubject').options].some(item=>item.value===selected))$('reviewSubject').value=selected;}
function extraTabChanged(tab){if(tab==='challenges'){renderReviewSubjects();renderReview();renderMatching();renderExtrasSummary();loadFriends()}else if(tab==='profile')renderProfile();else if(tab==='leaderboard')loadLeague()}
function initExtras(){
 extraState();playerIdentity();for(const kind of Object.keys(gameState().daily.claimed))if(gameState().daily.claimed[kind])trackMonthly(kind);
 if(pendingSession?.answered&&pendingSession.chosen!==pendingSession.question?.a){const key=questionKey(pendingSession.question,pendingSession);if(!extraState().book[key])rememberAnswer(false,pendingSession.question,pendingSession)}
 for(const subject of Object.keys(MATCH_BANK))$('matchSubject').add(new Option(subject,subject));$('matchSubject').value='Math';$('matchStart').onclick=startMatch;
 $('reviewStart').onclick=startReview;$('reviewNext').onclick=nextReview;$('reviewPause').onclick=()=>{const r=extraState().review;if(r){r.paused=true;save();renderReview()}};
 $('monthlyClaim').onclick=claimMonthly;$('saveProfile').onclick=saveProfile;$('refreshLeague').onclick=loadLeague;$('friendCreate').onclick=()=>friendAction('create');$('friendJoin').onclick=()=>friendAction('join');$('friendClaim').onclick=()=>friendAction('claim');$('refreshFriends').onclick=loadFriends;
 $('syncRounds').onclick=async()=>{try{await syncRounds();await loadLeague();await loadFriends()}catch{}};
 $('friendCopy').onclick=async()=>{if(!displayedTeam)return;try{await navigator.clipboard.writeText(displayedTeam.code);$('friendStatus').textContent='邀请码已复制，可发给好友。'}catch{$('friendStatus').textContent='邀请码：'+displayedTeam.code+'，可以手动复制。'}};
 for(const key of Object.keys(EXTRA_AVATAR_OPTIONS))$('avatar'+key).onchange=()=>{const s=extraState();s.avatar[key]=$('avatar'+key).value;s.avatar=cleanAvatar(s.avatar);save();$('avatarPreview').innerHTML=avatarSvg(s.avatar);$('profileStatus').textContent='头像已在此浏览器保存，点击保存资料更新在线头像。'};
 renderProfile();renderReviewSubjects();renderReview();renderMatching();renderExtrasSummary();save();setInterval(tickMatch,250);setInterval(()=>{if(extraState().registered&&extraState().pending.length)syncRounds().catch(()=>{})},60000);
}
