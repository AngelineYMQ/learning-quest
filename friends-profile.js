'use strict';
let connectionsLoading=false,connectionsGeneration=0,avatarUploadBusy=false,avatarReadGeneration=0;
async function connectionsRequest(path='',body){const response=await fetch(EXTRA_API+'/friends'+path,{method:body?'POST':'GET',credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(15000),headers:body?{'Content-Type':'application/json'}:{},...(body?{body:JSON.stringify(body)}:{})});const data=await response.json();if(!response.ok)throw new Error(data.error||'Please try again.');return data}
async function loadConnections(){
 if(!$('friendList'))return;const generation=++connectionsGeneration,own=state.account?.id;
 if(!own){$('friendList').replaceChildren();$('friendRequests').replaceChildren();$('friendBlocked').replaceChildren();$('friendListStatus').textContent='Log in to add friends using their exact username.';$('addFriend').disabled=true;return}
 $('addFriend').disabled=false;$('friendListStatus').textContent='Loading friends…';
 try{const data=await connectionsRequest();if(generation!==connectionsGeneration||state.account?.id!==own)return;renderConnections(data);$('friendListStatus').textContent='Only accepted friends can see each other’s learning summary.'}catch(error){if(generation===connectionsGeneration&&state.account?.id===own)$('friendListStatus').textContent=error.message}
}
function renderConnections(data){
 for(const id of ['friendList','friendRequests','friendBlocked'])$(id).replaceChildren();
 for(const person of data.people){const card=document.createElement('article');card.className='connection-card';const header=document.createElement('div');header.className='connection-person';const text=document.createElement('div'),name=document.createElement('strong'),username=document.createElement('small');name.textContent=person.name;username.textContent='@'+person.username;text.append(name,username);header.append(avatarNode(person.avatar),text);card.append(header);
  const info=document.createElement('p');info.textContent=person.status==='friend'?person.completed+' tests · '+person.streak+'-day streak · '+sci(person.xp)+' XP':person.status==='received'?'Wants to be your friend':'Waiting for your friend to accept';card.append(info);const buttons=document.createElement('div');buttons.className='connection-actions';
  const action=(label,path)=>{const button=document.createElement('button');button.textContent=label;button.onclick=()=>connectionAction(path,{id:person.id});buttons.append(button)};
  if(person.status==='received')action('Accept','/accept');if(person.status==='friend'){const team=document.createElement('button');team.textContent='Open friend quest';team.onclick=()=>openLearningPage('challenges');buttons.append(team)}
  action(person.status==='friend'?'Remove friend':person.status==='received'?'Decline':'Cancel request','/remove');action('Block','/block');card.append(buttons);$(person.status==='friend'?'friendList':'friendRequests').append(card);
 }
 for(const person of data.blocked){const card=document.createElement('div');card.className='connection-card';const text=document.createElement('span');text.textContent=person.name+' · @'+person.username;const button=document.createElement('button');button.textContent='Unblock';button.onclick=()=>connectionAction('/unblock',{id:person.id});card.append(text,button);$('friendBlocked').append(card)}
 if(!$('friendList').children.length)$('friendList').textContent='No friends yet. Ask your friend for their username.';if(!$('friendRequests').children.length)$('friendRequests').textContent='No pending requests.';if(!$('friendBlocked').children.length)$('friendBlocked').textContent='No blocked accounts.';
}
async function connectionAction(path,body){
 if(connectionsLoading)return;connectionsLoading=true;const own=state.account?.id;$('friendListStatus').textContent='Updating…';$('addFriend').disabled=true;
 try{await connectionsRequest(path,body);if(state.account?.id!==own)return;await loadConnections();if(path==='/request'){$('friendSearch').value='';$('friendListStatus').textContent='Friend request sent. Your friend can accept it in Profile.'}}catch(error){if(state.account?.id===own)$('friendListStatus').textContent=error.message}finally{connectionsLoading=false;$('addFriend').disabled=!state.account}
}
async function prepareAvatar(file){
 if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024)throw new Error('Choose a JPG, PNG or WebP image up to 8 MB.');
 const bitmap=await createImageBitmap(file);try{if(bitmap.width<1||bitmap.height<1||bitmap.width*bitmap.height>40000000)throw new Error('Choose an image smaller than 40 megapixels.');const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const context=canvas.getContext('2d');context.fillStyle='#ede7ff';context.fillRect(0,0,128,128);const size=Math.min(bitmap.width,bitmap.height);context.drawImage(bitmap,(bitmap.width-size)/2,(bitmap.height-size)/2,size,size,0,0,128,128);let photo=canvas.toDataURL('image/jpeg',.82);if(photo.length>28000)photo=canvas.toDataURL('image/jpeg',.55);if(!validAvatarPhoto(photo))throw new Error('This image could not be prepared. Try another photo.');return photo}finally{bitmap.close()}
}
async function setUploadedAvatar(photo){
 if(avatarUploadBusy)return;avatarUploadBusy=true;const social=extraState(),own=state.account?.id;$('uploadAvatar').disabled=true;$('removeUploadedAvatar').disabled=true;
 try{const avatar=cleanAvatar(social.avatar);if(photo)avatar.photo=photo;else delete avatar.photo;
  social.avatar=avatar;save();renderProfile();renderProfileDashboard();renderLearningRewards();$('avatarUploadStatus').textContent=own?'Avatar saved on this device. Syncing to your account…':'Avatar saved on this browser. Create an account to use it on every device.';
  if(own){accountChanged=true;await syncAccount();if(state.account?.id===own&&extraState()===social)$('avatarUploadStatus').textContent=accountChanged?'Avatar is kept on this device. Check your account sync status above.':'Avatar saved to your account.'}
 }catch(error){$('avatarUploadStatus').textContent=error.message}finally{avatarUploadBusy=false;$('uploadAvatar').disabled=false;$('removeUploadedAvatar').disabled=false;renderAvatarUpload()}
}
function renderAvatarUpload(){if($('removeUploadedAvatar'))$('removeUploadedAvatar').hidden=!validAvatarPhoto(extraState().avatar.photo)}
function initFriendsProfile(){
 $('refreshFriendsList').onclick=loadConnections;$('addFriend').onclick=()=>connectionAction('/request',{username:$('friendSearch').value.trim()});$('friendSearch').onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();$('addFriend').click()}};
 $('uploadAvatar').onclick=()=>$('avatarPhotoFile').click();$('removeUploadedAvatar').onclick=()=>setUploadedAvatar(null);
 $('avatarPhotoFile').onchange=async event=>{const file=event.target.files?.[0];if(!file)return;const generation=++avatarReadGeneration,own=state.account?.id,social=extraState();$('avatarUploadStatus').textContent='Preparing your avatar…';try{const photo=await prepareAvatar(file);if(generation!==avatarReadGeneration)return;if(state.account?.id!==own||extraState()!==social)throw new Error('Your account changed. Choose the photo again.');await setUploadedAvatar(photo)}catch(error){$('avatarUploadStatus').textContent=error.message}finally{event.target.value=''}};
 renderAvatarUpload();if(document.body.dataset.page==='profile')loadConnections();
}
