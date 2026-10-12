'use strict';
// Topic menus reflect usable quiz sizes; small pools remain available in mixed practice.
const TOPIC_MINIMUM=20;
function practiceTopicOptions(stage,subject,grade){
 const topics=schoolTopics(stage,subject,grade),large=topics.filter(t=>schoolPool(stage,subject,grade,t).length>=TOPIC_MINIMUM);
 if(large.length<2)return [];
 const small=topics.filter(t=>!large.includes(t)),mixed=small.flatMap(t=>schoolPool(stage,subject,grade,t));
 return [...large.map(value=>({value,label:typeof practiceTopicLabel==='function'?practiceTopicLabel(subject,value):value})),...(large.length&&mixed.length>=5?[{value:'Mixed review',label:'Mixed review'}]:[])];
}
function selectedPracticePool(stage,subject,grade,topic){if(topic!=='Mixed review')return schoolPool(stage,subject,grade,topic);const small=new Set(schoolTopics(stage,subject,grade).filter(t=>schoolPool(stage,subject,grade,t).length<TOPIC_MINIMUM));return schoolPool(stage,subject,grade).filter(q=>small.has(q.topic))}
function practiceHistoryKey(stage,subject,grade){return JSON.stringify([stage,subject,grade])}
function practiceHistory(){if(!state.practiceHistory||typeof state.practiceHistory!=='object'||Array.isArray(state.practiceHistory))state.practiceHistory={};return state.practiceHistory}
function choosePracticeQuestions(stage,subject,grade,topic,count){
 const bank=selectedPracticePool(stage,subject,grade,topic),history=practiceHistory(),key=practiceHistoryKey(stage,subject,grade),entries=Array.isArray(history[key])?history[key].filter(x=>typeof x==='string'):[],last=new Map(entries.map((q,i)=>[q,i]));
 const unseen=shuffleExtra(bank.filter(q=>!last.has(q.q))),old=bank.filter(q=>last.has(q.q)).sort((a,b)=>last.get(a.q)-last.get(b.q));
 return [...unseen,...old].slice(0,count).map(q=>({...q,choices:shuffleExtra(q.choices)}));
}
function rememberPracticeQuestion(round,question){if(round.mode!=='moe')return;const h=practiceHistory(),key=practiceHistoryKey(round.stage,round.subject,round.grade),old=Array.isArray(h[key])?h[key].filter(x=>typeof x==='string'):[];h[key]=[...old.filter(q=>q!==question.q),question.q].slice(-2000)}
