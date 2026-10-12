'use strict';
function renderPrimaryActivities(){
  if(!$('primaryActivities'))return;
  const enabled=$('practiceMode').value==='moe'&&$('schoolStage').value==='primary';
  $('primaryActivities').hidden=!enabled;if(!enabled)return;
  const subject=$('subject').value,grade=Number($('primaryGrade').value),topic=$('moeTopic').value;
  const plans=PRIMARY_GUIDE[subject]?.[grade]||[];
  const selected=plans.filter(plan=>topic==='All'||plan.topic===topic);
  $('primaryPlanNote').textContent=`Primary ${grade} · ${plans.length} practice areas. Choose a Topic to focus. These grade plans are authored practice sequences; MOE Art, Music and language outcomes often use learning bands. Written, oral and practical responses need teacher review and do not award automatic XP or leaderboard scores. The 2024 mother-tongue revision starts with the 2024 P1 cohort; use your teacher’s materials for cohort-specific requirements.`;
  $('primaryActivityList').replaceChildren();
  if(!state.activityDrafts||typeof state.activityDrafts!=='object'||Array.isArray(state.activityDrafts))state.activityDrafts={};
  for(const plan of selected){
    const key=JSON.stringify([subject,grade,plan.topic]),draft=state.activityDrafts[key]||{};
    const details=document.createElement('details');details.className='activity-card';if(topic!=='All')details.open=true;
    const summary=document.createElement('summary');summary.textContent=plan.topic+' · '+schoolPool('primary',subject,grade,plan.topic).length+' auto-marked checks + guided activity';
    const aim=document.createElement('p');aim.textContent='Learning focus: '+plan.aim;
    const prompt=document.createElement('p');prompt.textContent=plan.task;
    const label=document.createElement('label');label.textContent='Your response / notes (saved on this browser)';
    const input=document.createElement('textarea');input.rows=5;input.maxLength=6000;input.value=typeof draft.text==='string'?draft.text:'';label.appendChild(input);
    const status=document.createElement('small');status.textContent=draft.savedAt?'Draft restored. Review with a teacher.':'Draft saves as you type.';
    input.oninput=()=>{const other=Object.entries(state.activityDrafts).reduce((total,[id,value])=>total+(id!==key&&value&&typeof value.text==='string'?value.text.length:0),0);if(other+input.value.length>200000){status.textContent='Draft storage limit reached. Export a backup and shorten older responses.';return}state.activityDrafts[key]={text:input.value.slice(0,6000),savedAt:Date.now()};save();status.textContent='Draft saved. No automatic assessment.'};
    const checklist=document.createElement('ul');for(const check of plan.check){const item=document.createElement('li');item.textContent=check;checklist.appendChild(item)}
    const checkTitle=document.createElement('strong');checkTitle.textContent='Review checklist';
    const source=document.createElement('a');source.href=PRIMARY_SOURCES[subject].url;source.textContent=PRIMARY_SOURCES[subject].title;source.target='_blank';source.rel='noopener';
    details.append(summary,aim,prompt,label,status,checkTitle,checklist,source);$('primaryActivityList').appendChild(details);
  }
}
