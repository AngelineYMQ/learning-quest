'use strict';
(function(){
 let restoring=false;
 window.learningNavigate=function(path){
  if(restoring)return;
  if(location.pathname!==path||location.hash)history.pushState({},'',path);
 };
 window.restoreLearningRoute=function(){
  restoring=true;
  try{
   let path=location.pathname;
   if(path.length>1&&path.endsWith('/'))path=path.slice(0,-1);
   if(location.hash.startsWith('#/')){path='/'+location.hash.slice(2);history.replaceState({},'',path)}
   const parts=path.split('/');
   const isLesson=parts[1]==='courses'&&parts[2]==='mini-shop'&&parts[3]==='lessons'&&/^[1-8]$/.test(parts[4])&&parts.length<=6;
   if(path==='/courses'||isLesson||path==='/business/setup'||path==='/business/run'){
    window.openCourseRoute(isLesson?Number(parts[4])-1:undefined,parts[5]==='check');
    if(path.startsWith('/business/'))window.openBusinessAdventure({run:path==='/business/run'});
    if(path==='/business/run'&&!state.courses.businessAdventure?.operations){path='/business/setup';history.replaceState({},'',path)}
    document.body.dataset.page='courses';
   }else{
    const page=path.slice(1)||'play';openLearningPage(PROFILE_PAGES.includes(page)?page:'play',false);
   }
   document.title=(path.startsWith('/business')?'My Singapore Company':path.startsWith('/courses')?'Courses':'Learning Quest')+' · Learning Quest';
  }finally{restoring=false}
 };
 window.restoreLearningRoute();
})();
