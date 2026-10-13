'use strict';
let accountSnoozedUntil=0,accountReady=false,accountBusy=false,accountBlocked=false,accountTimer=null,accountLast='',accountChanged=false,accountSyncPromise=null;
function accountProgress(){const value=JSON.parse(JSON.stringify(state));delete value.account;delete value.savedAt;if(value.social){delete value.social.key;delete value.social.id;delete value.social.registered}return value}
function accountMessage(text){if($('accountStatus'))$('accountStatus').textContent=text;if(state.account&&$('saveStatus'))$('saveStatus').textContent=text}
function renderAccount(){renderAccountReminder();if(!$('accountForm'))return;const signed=!!state.account;$('accountForm').hidden=signed;$('accountSigned').hidden=!signed;$('accountUsernameText').textContent=signed?'Logged in as '+state.account.username:'';$('accountLoad').hidden=!accountBlocked;if($('accountKeepAppearance'))$('accountKeepAppearance').hidden=!accountBlocked||!signed;$('reset').hidden=signed;$('importProgress').hidden=signed;}
function accountSaved(){renderAccountReminder();if(!accountReady||!state.account)return;const serialized=accountComparable(accountProgress());if(serialized===accountLast)return;accountLast=serialized;accountChanged=true;state.account.dirty=true;try{localStorage.setItem(KEY,JSON.stringify(state));localStorage.setItem(KEY+'_backup',JSON.stringify(state))}catch{}clearTimeout(accountTimer);accountTimer=setTimeout(syncAccount,900)}
async function accountRequest(path,method='GET',body){const response=await fetch(EXTRA_API+'/account'+path,{method,credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(15000),headers:method==='POST'?{'Content-Type':'application/json'}:{},...(body?{body:JSON.stringify(body)}:{})});const data=await response.json();if(!response.ok){const error=new Error(data.error||'Please try again.');error.status=response.status;throw error}return data}
function keepDeviceBackup(){try{localStorage.setItem('learningQuest_beforeLogin',JSON.stringify(state))}catch{throw new Error('Export a progress backup before logging in. This browser cannot keep a safety copy.')}}
function applyAccount(data){
 accountReady=false;test=null;pendingSession=data.progress.activeTest||null;state={...defaults,...data.progress,username:data.name,account:{username:data.username,id:data.id,revision:data.revision,dirty:false}};
 const s=extraState();s.id=data.id;s.key='0'.repeat(64);s.registered=true;s.avatar=cleanAvatar(data.avatar);profileNameDirty=false;matchSelection={left:null,right:null};displayedTeam=null;
 accountBlocked=false;accountChanged=false;save();render();showResume();renderPrimaryActivities();renderProfile();renderReview();renderMatching();$('quiz').hidden=true;$('results').hidden=true;$('setup').hidden=false;renderProfileDashboard();renderLearningRewards();accountLast=accountComparable(accountProgress());rememberAccountBase(data.revision,accountProgress());accountReady=true;renderAccount();accountMessage('Cloud progress loaded. Continue on any device with this account.');if(typeof loadConnections==='function'&&document.body.dataset.page==='profile')loadConnections();
}
function syncAccount(){if(accountSyncPromise)return accountSyncPromise;accountSyncPromise=runAccountSync().finally(()=>{accountSyncPromise=null});return accountSyncPromise}
async function runAccountSync(){
 if(!accountReady||!state.account||accountBusy||accountBlocked||!accountChanged)return;
 accountBusy=true;clearTimeout(accountTimer);accountMessage('Saving to your account…');
 try{for(let attempt=0;attempt<3&&accountChanged&&!accountBlocked;attempt++){
  const own=state.account,progress=accountProgress(),sent=accountComparable(progress);
  try{const data=await accountRequest('/progress','POST',{revision:own.revision,progress});if(state.account!==own)return;own.revision=data.revision;rememberAccountBase(data.revision,progress);accountChanged=accountComparable(accountProgress())!==sent;own.dirty=accountChanged;try{localStorage.setItem(KEY,JSON.stringify(state));localStorage.setItem(KEY+'_backup',JSON.stringify(state))}catch{}accountMessage(accountChanged?'Saving your latest changes…':'Saved to your account · '+new Date().toLocaleTimeString());}
  catch(error){if(state.account!==own)return;if(error.status===409){const cloud=await accountRequest('');if(state.account!==own)return;if(!await reconcileAccount(cloud))return;continue}if(error.status===401)showAccountConflict('Please log in again. Your unsynced progress is kept on this device.');else accountMessage(error.message||'Offline: progress is kept on this device. Reconnect to sync.');return}
 }}finally{accountBusy=false;if(accountChanged&&!accountBlocked)accountTimer=setTimeout(syncAccount,15000)}
}
async function submitAccount(mode){
 if(accountBusy)return;const username=$('loginUsername').value.trim().toLowerCase(),password=$('loginPassword').value;
 if(!/^[a-z0-9_]{3,20}$/.test(username)||password.length<6){accountMessage('Use 3–20 letters, numbers or underscores and a password of at least 6 characters.');return}
 accountBusy=true;$('accountLogin').disabled=true;$('accountRegister').disabled=true;accountMessage(mode==='register'?'Creating your account…':'Logging in…');
 try{
  keepDeviceBackup();let data;
  if(mode==='register'){
   const identity=playerIdentity();save();const response=await fetch(EXTRA_API+'/account/register',{method:'POST',credentials:'same-origin',signal:AbortSignal.timeout(15000),headers:{'Content-Type':'application/json','X-Player-Id':identity.id,Authorization:'Bearer '+identity.key},body:JSON.stringify({username,password,avatar:identity.avatar,progress:accountProgress()})});data=await response.json();if(!response.ok)throw new Error(data.error||'Account could not be created.');
  }else data=await accountRequest('/login','POST',{username,password});
  $('loginPassword').value='';
  if(state.account?.username===data.username&&state.account.dirty){accountBlocked=false;accountChanged=true;accountReady=true;await reconcileAccount(data);renderAccount();}else applyAccount(data);
 }catch(error){accountMessage(error.message||'Connection unavailable. Please try again.')}finally{accountBusy=false;$('accountLogin').disabled=false;$('accountRegister').disabled=false;syncAccount()}
}
async function loadAccount(){if(accountBusy)return;accountBusy=true;try{keepDeviceBackup();applyAccount(await accountRequest(''))}catch(error){accountMessage(error.message)}finally{accountBusy=false}}
async function logoutAccount(){
 await syncAccount();if(accountChanged){accountMessage('Your latest progress has not synced. Reconnect or resolve the save conflict before logging out.');return}if(accountBusy)return;
 accountBusy=true;try{await accountRequest('/logout','POST',{});accountReady=false;test=null;pendingSession=null;state={...defaults};save();render();showResume();renderProfile();renderReview();renderMatching();renderProfileDashboard();renderLearningRewards();accountBlocked=false;accountChanged=false;accountLast='';accountReady=true;renderAccount();accountMessage('Logged out. Your account progress is safely stored online.');if(typeof loadConnections==='function')loadConnections()}catch(error){accountMessage(error.message)}finally{accountBusy=false}
}
async function initAccounts(){
 $('accountSetup').onclick=openAccountSetup;$('accountLater').onclick=()=>{accountSnoozedUntil=Date.now()+86400000;try{localStorage.setItem('learningQuest_accountReminderUntil',String(accountSnoozedUntil))}catch{}$('accountReminder').hidden=true};
 $('accountLogin').onclick=()=>submitAccount('login');$('accountRegister').onclick=()=>submitAccount('register');$('accountLogout').onclick=logoutAccount;$('accountLoad').onclick=loadAccount;$('loginPassword').onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();submitAccount('login')}};
 $('accountRetry').onclick=async()=>{accountBlocked=false;renderAccount();await refreshAccount()};$('accountKeepAppearance').onclick=saveDeviceAppearance;
 $('accountRelogin').onclick=()=>{$('accountForm').hidden=false;$('loginUsername').value=state.account?.username||'';$('loginPassword').focus()};
 renderAccount();document.querySelector('main').inert=true;accountMessage('Checking your account…');
 try{const data=await accountRequest('');if(state.account?.id===data.id&&state.account.dirty){accountChanged=true;await reconcileAccount(data)}else applyAccount(data)}
 catch(error){accountMessage(state.account?'Progress is kept on this device. Log in again or reconnect to sync.':'Log in or create an account to continue across devices.');if(state.account){accountBlocked=error.status===401;accountChanged=!!state.account.dirty}}
 finally{document.querySelector('main').inert=false;accountReady=true;accountLast=accountComparable(accountProgress());renderAccount();syncAccount()}
 window.addEventListener('online',refreshAccount);window.addEventListener('focus',refreshAccount);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')syncAccount()});
}

function needsAccountSetup(){return !state.account&&!!(state.social?.registered||Number(state.completed)>0||/^\d+$/.test(state.lifetime)&&BigInt(state.lifetime)>0n||state.activeTest||pendingSession)}
function renderAccountReminder(){
 if(!$('accountReminder'))return;const existing=needsAccountSetup();let snoozed=accountSnoozedUntil>Date.now();try{snoozed=snoozed||Number(localStorage.getItem('learningQuest_accountReminderUntil')||0)>Date.now()}catch{}
 $('accountReminder').hidden=!existing||snoozed||document.body.dataset.page==='profile';if($('accountMigrationInfo'))$('accountMigrationInfo').hidden=!existing;
}
function openAccountSetup(){
 openLearningPage('profile');$('accountForm').hidden=false;const suggested=state.username?.trim().toLowerCase();if(!$('loginUsername').value&&suggested!=='player_1'&&/^[a-z0-9_]{3,20}$/.test(suggested||''))$('loginUsername').value=suggested;
 accountMessage('To keep this device’s progress, choose a username and password, then select Create account & save my progress. Already have an account on another device? Log in instead.');$('loginUsername').focus();
}

function accountComparable(value){const copy=JSON.parse(JSON.stringify(value));delete copy.playSeconds;return JSON.stringify(copy)}
function accountBaseKey(id=state.account?.id){return 'learningQuest_cloudBase_'+id}
function readAccountBase(){try{const base=JSON.parse(localStorage.getItem(accountBaseKey())||'null');return base&&base.revision===state.account?.revision?base.progress:null}catch{return null}}
function rememberAccountBase(revision,progress){try{localStorage.setItem(accountBaseKey(),JSON.stringify({revision,progress}))}catch{}}
function cloudAccountProgress(data){return {...defaults,...data.progress,username:data.name,social:{...data.progress.social,avatar:cleanAvatar(data.avatar)}}}
function mergeAccountProgress(base,local,cloud){
 const conflicts=[],equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b),object=v=>v&&typeof v==='object'&&!Array.isArray(v);
 function merge(b,l,c,path){
  if(path==='playSeconds')return Math.max(Number(l)||0,Number(c)||0);
  if(equal(l,c))return l;if(equal(l,b))return c;if(equal(c,b))return l;
  if(object(l)&&object(c)&&(object(b)||b===undefined)){const result={};for(const key of new Set([...Object.keys(b||{}),...Object.keys(l),...Object.keys(c)])){const value=merge(b?.[key],l[key],c[key],path?path+'.'+key:key);if(value!==undefined)result[key]=value}return result}
  conflicts.push(path);return l;
 }
 const progress=merge(base,local,cloud,'');return {progress,conflicts};
}
function showAccountConflict(message){accountBlocked=true;renderAccount();accountMessage(message||'Both devices changed the same progress. Your local progress is safe. Load the cloud copy, or save this device’s avatar and pet name below.');}
function adoptAccountMerge(data,progress){
 const running=test,keepRunner=running&&!running.finished&&JSON.stringify(accountProgress().activeTest)===JSON.stringify(progress.activeTest),cloud=cloudAccountProgress(data);
 // applyAccount uses the authoritative player avatar, so pass the merged avatar too.
 applyAccount({...data,progress,avatar:progress.social?.avatar||data.avatar});rememberAccountBase(data.revision,cloud);accountChanged=accountComparable(accountProgress())!==accountComparable(cloud);state.account.dirty=accountChanged;accountLast=accountComparable(accountProgress());
 if(keepRunner){test=running;pendingSession=null;$('setup').hidden=true;$('results').hidden=true;$('quiz').hidden=false;showQuestion(true)}
 try{localStorage.setItem(KEY,JSON.stringify(state));localStorage.setItem(KEY+'_backup',JSON.stringify(state))}catch{}
}
async function reconcileAccount(data){
 if(data.id!==state.account?.id)throw new Error('Your login changed. Please log in to the correct account.');
 const cloud=cloudAccountProgress(data),local=accountProgress(),base=readAccountBase();
 if(!accountChanged&&!state.account.dirty){if(data.revision!==state.account.revision||accountComparable(local)!==accountComparable(cloud)){cloud.playSeconds=Math.max(Number(local.playSeconds)||0,Number(cloud.playSeconds)||0);adoptAccountMerge(data,cloud);}return true}
 if(data.revision===state.account.revision)return true;
 if(accountComparable(local)===accountComparable(cloud)){applyAccount(data);return true}
 if(!base){showAccountConflict('This device has older unsynced progress. It is kept safely here. To keep the photo and pet name you changed here, use Save this device’s avatar & pet name.');return false}
 const merged=mergeAccountProgress(base,local,cloud);if(merged.conflicts.length){showAccountConflict();return false}keepDeviceBackup();adoptAccountMerge(data,merged.progress);return true;
}
async function refreshAccount(){
 if(!state.account||accountBusy||accountBlocked)return;const own=state.account;try{const data=await accountRequest('');if(state.account!==own)return;if(await reconcileAccount(data))await syncAccount()}catch(error){accountMessage(error.message||'Offline. Your progress is kept on this device.')}
}
async function saveDeviceAppearance(){
 if(!state.account||accountBusy)return;accountBusy=true;const own=state.account,avatar=cleanAvatar(extraState().avatar),petName=learningRewards().pet.name;
 try{keepDeviceBackup();const data=await accountRequest('');if(state.account!==own)return;if(data.id!==own.id)throw new Error('Please log in to the correct account.');const progress=cloudAccountProgress(data);progress.social={...progress.social,avatar};progress.learningRewards={...progress.learningRewards,pet:{...progress.learningRewards?.pet,name:petName}};
  adoptAccountMerge(data,progress);accountChanged=true;state.account.dirty=true;accountBlocked=false;renderAccount();accountMessage('Saving this device’s avatar and pet name…');
 }catch(error){accountMessage(error.message)}finally{accountBusy=false;await syncAccount()}
}
