'use strict';
let accountReady=false,accountBusy=false,accountBlocked=false,accountTimer=null,accountLast='',accountChanged=false;
function accountProgress(){const value=JSON.parse(JSON.stringify(state));delete value.account;delete value.savedAt;if(value.social){delete value.social.key;delete value.social.id;delete value.social.registered}return value}
function accountMessage(text){if($('accountStatus'))$('accountStatus').textContent=text;if(state.account&&$('saveStatus'))$('saveStatus').textContent=text}
function renderAccount(){if(!$('accountForm'))return;const signed=!!state.account;$('accountForm').hidden=signed;$('accountSigned').hidden=!signed;$('accountUsernameText').textContent=signed?'Logged in as '+state.account.username:'';$('accountLoad').hidden=!accountBlocked;$('reset').hidden=signed;$('importProgress').hidden=signed;}
function accountSaved(){if(!accountReady||!state.account)return;const serialized=JSON.stringify(accountProgress());if(serialized===accountLast)return;accountLast=serialized;accountChanged=true;state.account.dirty=true;try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}clearTimeout(accountTimer);accountTimer=setTimeout(syncAccount,900)}
async function accountRequest(path,method='GET',body){const response=await fetch(EXTRA_API+'/account'+path,{method,credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(15000),headers:method==='POST'?{'Content-Type':'application/json'}:{},...(body?{body:JSON.stringify(body)}:{})});const data=await response.json();if(!response.ok){const error=new Error(data.error||'Please try again.');error.status=response.status;throw error}return data}
function keepDeviceBackup(){try{localStorage.setItem('learningQuest_beforeLogin',JSON.stringify(state))}catch{throw new Error('Export a progress backup before logging in. This browser cannot keep a safety copy.')}}
function applyAccount(data){
 accountReady=false;test=null;pendingSession=data.progress.activeTest||null;state={...defaults,...data.progress,username:data.name,account:{username:data.username,id:data.id,revision:data.revision,dirty:false}};
 const s=extraState();s.id=data.id;s.key='0'.repeat(64);s.registered=true;s.avatar=cleanAvatar(data.avatar);profileNameDirty=false;matchSelection={left:null,right:null};displayedTeam=null;
 accountBlocked=false;accountChanged=false;save();render();showResume();renderPrimaryActivities();renderProfile();renderReview();renderMatching();$('quiz').hidden=true;$('results').hidden=true;$('setup').hidden=false;renderProfileDashboard();renderLearningRewards();accountLast=JSON.stringify(accountProgress());accountReady=true;renderAccount();accountMessage('Cloud progress loaded. Continue on any device with this account.');
}
async function syncAccount(){
 if(!accountReady||!state.account||accountBusy||accountBlocked||!accountChanged)return;
 accountBusy=true;const own=state.account,revision=own.revision,progress=accountProgress(),sent=JSON.stringify(progress);accountMessage('Saving to your account…');
 try{const data=await accountRequest('/progress','POST',{revision,progress});if(state.account!==own)return;own.revision=data.revision;accountChanged=JSON.stringify(accountProgress())!==sent;own.dirty=accountChanged;try{localStorage.setItem(KEY,JSON.stringify(state));localStorage.setItem(KEY+'_backup',JSON.stringify(state))}catch{}accountMessage('Saved to your account · '+new Date().toLocaleTimeString());}
 catch(error){if(state.account!==own)return;if(error.status===409||error.status===401){accountBlocked=true;renderAccount()}accountMessage(error.message||'Offline: progress is kept on this device. Reconnect to sync.');}
 finally{accountBusy=false;if(accountChanged&&!accountBlocked)accountTimer=setTimeout(syncAccount,15000)}
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
  if(state.account?.username===data.username&&state.account.dirty){if(state.account.revision===data.revision){accountBlocked=false;accountChanged=true;accountReady=true;renderAccount();accountMessage('Logged in. Saving this device’s offline progress…')}else{accountBlocked=true;renderAccount();accountMessage('Another device has newer progress. Export a backup, then load the cloud version.')}}else applyAccount(data);
 }catch(error){accountMessage(error.message||'Connection unavailable. Please try again.')}finally{accountBusy=false;$('accountLogin').disabled=false;$('accountRegister').disabled=false;syncAccount()}
}
async function loadAccount(){if(accountBusy)return;accountBusy=true;try{keepDeviceBackup();applyAccount(await accountRequest(''))}catch(error){accountMessage(error.message)}finally{accountBusy=false}}
async function logoutAccount(){
 await syncAccount();if(accountChanged){accountMessage('Your latest progress has not synced. Reconnect or resolve the save conflict before logging out.');return}if(accountBusy)return;
 accountBusy=true;try{await accountRequest('/logout','POST',{});accountReady=false;test=null;pendingSession=null;state={...defaults};save();render();showResume();renderProfile();renderReview();renderMatching();renderProfileDashboard();renderLearningRewards();accountBlocked=false;accountChanged=false;accountLast='';accountReady=true;renderAccount();accountMessage('Logged out. Your account progress is safely stored online.')}catch(error){accountMessage(error.message)}finally{accountBusy=false}
}
async function initAccounts(){
 $('accountLogin').onclick=()=>submitAccount('login');$('accountRegister').onclick=()=>submitAccount('register');$('accountLogout').onclick=logoutAccount;$('accountLoad').onclick=loadAccount;$('loginPassword').onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();submitAccount('login')}};
 $('accountRetry').onclick=()=>{accountBlocked=false;renderAccount();accountChanged=true;syncAccount()};
 $('accountRelogin').onclick=()=>{$('accountForm').hidden=false;$('loginUsername').value=state.account?.username||'';$('loginPassword').focus()};
 renderAccount();document.querySelector('main').inert=true;accountMessage('Checking your account…');
 try{const data=await accountRequest('');if(state.account?.id===data.id&&state.account.dirty){accountBlocked=state.account.revision!==data.revision;accountChanged=true;accountMessage(accountBlocked?'Another device has newer progress. Export a backup, then load the cloud version.':'Restoring offline progress…')}else applyAccount(data)}
 catch(error){accountMessage(state.account?'Progress is kept on this device. Log in again or reconnect to sync.':'Log in or create an account to continue across devices.');if(state.account){accountBlocked=error.status===401;accountChanged=!!state.account.dirty}}
 finally{document.querySelector('main').inert=false;accountReady=true;accountLast=JSON.stringify(accountProgress());renderAccount();syncAccount()}
 window.addEventListener('online',()=>{if(!accountBlocked)syncAccount()});window.addEventListener('focus',async()=>{if(!state.account||accountBusy||accountBlocked)return;await syncAccount();if(accountChanged||accountBusy)return;try{const own=state.account,data=await accountRequest('');if(state.account!==own)return;if(data.revision!==own.revision){if(accountChanged){accountBlocked=true;renderAccount();accountMessage('Another device has newer progress. Export a backup, then load the cloud version.')}else applyAccount(data)}}catch{}});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')syncAccount()});
}
