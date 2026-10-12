const subjects = ["Additional Mathematics", "Art", "Biology", "Character and Citizenship Education", "Chemistry", "China Studies in Chinese", "China Studies in English", "Chinese", "Chinese Language and Literature", "Computing", "Design and Technology", "Drama", "Economics", "Electronics", "English", "English Language and Linguistics", "Exercise and Sports Science", "Food and Consumer Education", "Further Mathematics", "General Paper", "Geography", "History", "Knowledge and Inquiry", "Literature in Chinese", "Literature in English", "Literature in Malay", "Literature in Tamil", "Malay", "Malay Language and Literature", "Management of Business", "Math", "Music", "Nutrition and Food Science", "Physical Education", "Physics", "Principles of Accounts", "Project Work", "Science", "Social Studies", "Tamil", "Tamil Language and Literature", "Theatre Studies and Drama", "Translation", "Coding"];
const levels = ['Beginner','Easy','Medium','Intermediate','Hard','Advanced','Extreme','Insane','Demon'];
const json = (body, status = 200) => Response.json(body, {status, headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const schema = `CREATE TABLE IF NOT EXISTS learning_quest_results (id TEXT PRIMARY KEY, player TEXT NOT NULL, subject TEXT NOT NULL, difficulty TEXT NOT NULL, correct INTEGER NOT NULL, total INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')))`;

const SOCIAL_SCHEMA = [
 `CREATE TABLE IF NOT EXISTS lq_players (id TEXT PRIMARY KEY, key_hash TEXT NOT NULL, name TEXT NOT NULL UNIQUE, avatar TEXT NOT NULL, created_at TEXT NOT NULL)`,
 `CREATE TABLE IF NOT EXISTS lq_events (id TEXT PRIMARY KEY, player_id TEXT NOT NULL, kind TEXT NOT NULL, correct INTEGER NOT NULL, total INTEGER NOT NULL, created_at TEXT NOT NULL, completed_at TEXT NOT NULL)`,
 `CREATE INDEX IF NOT EXISTS lq_events_time ON lq_events(player_id,created_at)`,
 `CREATE TABLE IF NOT EXISTS lq_leagues (player_id TEXT NOT NULL, week TEXT NOT NULL, tier INTEGER NOT NULL, PRIMARY KEY(player_id,week))`,
 `CREATE TABLE IF NOT EXISTS lq_teams (code TEXT PRIMARY KEY, week TEXT NOT NULL, created_at TEXT NOT NULL)`,
 `CREATE TABLE IF NOT EXISTS lq_team_members (week TEXT NOT NULL, player_id TEXT NOT NULL, code TEXT NOT NULL, joined_at TEXT NOT NULL, PRIMARY KEY(week,player_id))`,
 `CREATE TABLE IF NOT EXISTS lq_rewards (id TEXT PRIMARY KEY, player_id TEXT NOT NULL, gems INTEGER NOT NULL, created_at TEXT NOT NULL)`
];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const AVATAR_OPTIONS = {skin:['peach','tan','brown','deep','rose','gold'],hair:['short','curly','spiky','bald'],hairColor:['brown','black','gold','purple','red'],shirt:['violet','mint','blue','pink','gold','red'],eyes:['happy','calm','wink'],accessory:['none','glasses','cap']};
function avatarValue(value){if(!value||typeof value!=='object'||Array.isArray(value))return null;const result={};for(const [key,options] of Object.entries(AVATAR_OPTIONS)){if(!options.includes(value[key]))return null;result[key]=value[key]}return result}
function gamePeriods(now=Date.now()){
 const day=86400000,offset=8*3600000,local=new Date(now+offset),weekday=(local.getUTCDay()+6)%7;
 const monday=Math.floor((now+offset)/day)-weekday,start=monday*day-offset;
 return {week:new Date(monday*day).toISOString().slice(0,10),start:new Date(start).toISOString(),end:new Date(start+7*day).toISOString(),previous:new Date((monday-7)*day).toISOString().slice(0,10),previousStart:new Date(start-7*day).toISOString(),month:local.toISOString().slice(0,7)};
}
class SocialError extends Error{constructor(status,message){super(message);this.status=status}}
async function socialBody(request){
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))throw new SocialError(415,'Please send JSON.');
 const reader=request.body?.getReader();if(!reader)throw new SocialError(400,'Missing request.');const chunks=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>8192){await reader.cancel();throw new SocialError(413,'Request too large.')}chunks.push(value)}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}
 let data;try{data=JSON.parse(new TextDecoder().decode(bytes))}catch{throw new SocialError(400,'Invalid JSON.')}
 if(!data||typeof data!=='object'||Array.isArray(data))throw new SocialError(400,'Invalid request.');return data;
}
const socialAll=async(db,sql,...args)=>(await db.prepare(sql).bind(...args).all()).results;
const socialOne=async(db,sql,...args)=>(await socialAll(db,sql,...args))[0];
async function socialAuth(request,db,allowNew=false){
 const id=request.headers.get('X-Player-Id'),key=request.headers.get('Authorization')?.replace(/^Bearer /,'');
 if(!UUID.test(id||'')||!/^\w{64}$/.test(key||'')||!/^[0-9a-f]+$/i.test(key))throw new SocialError(401,'Open Profile and save your player profile first.');
 const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(key)))].map(n=>n.toString(16).padStart(2,'0')).join('');
 const player=await socialOne(db,'SELECT * FROM lq_players WHERE id = ?',id);
 if(player&&player.key_hash!==hash)throw new SocialError(401,'This player profile could not be verified. Restore your own progress backup.');
 if(!player&&!allowNew)throw new SocialError(401,'Save your profile before using online challenges.');
 return {id,hash,player};
}
async function leagueRows(db,week,start,end,tier,playerId){
 return socialAll(db,`WITH scores AS (SELECT m.player_id,p.name,p.avatar,COALESCE(SUM(e.correct),0) AS points FROM lq_leagues m JOIN lq_players p ON p.id=m.player_id LEFT JOIN lq_events e ON e.player_id=m.player_id AND e.created_at>=? AND e.created_at<? WHERE m.week=? AND m.tier=? GROUP BY m.player_id,p.name,p.avatar), ranked AS (SELECT *,ROW_NUMBER() OVER(ORDER BY points DESC,player_id ASC) AS rank,COUNT(*) OVER() AS members FROM scores) SELECT * FROM ranked WHERE rank<=50 OR player_id=? ORDER BY rank`,start,end,week,tier,playerId);
}
async function leagueMember(db,id,period){
 let member=await socialOne(db,'SELECT * FROM lq_leagues WHERE player_id=? AND week=?',id,period.week);if(member)return member;
 const latest=await socialOne(db,'SELECT * FROM lq_leagues WHERE player_id=? ORDER BY week DESC LIMIT 1',id);let tier=latest?.tier||0;
 if(latest?.week===period.previous){const previous=await leagueRows(db,period.previous,period.previousStart,period.start,tier,id);const row=previous.find(row=>row.player_id===id);if(row?.points>0&&row.rank<=3)tier=Math.min(4,tier+1);else if(row?.members>=10&&row.rank>row.members-3)tier=Math.max(0,tier-1)}
 await db.prepare('INSERT OR IGNORE INTO lq_leagues(player_id,week,tier) VALUES(?,?,?)').bind(id,period.week,tier).run();return socialOne(db,'SELECT * FROM lq_leagues WHERE player_id=? AND week=?',id,period.week);
}
async function teamDetails(db,id,period){
 const own=await socialOne(db,'SELECT * FROM lq_team_members WHERE player_id=? AND week=?',id,period.week);if(!own)return null;
 const members=await socialAll(db,`SELECT m.player_id,p.name,p.avatar,COALESCE(SUM(e.correct),0) AS points FROM lq_team_members m JOIN lq_players p ON p.id=m.player_id LEFT JOIN lq_events e ON e.player_id=m.player_id AND e.created_at>=? AND e.created_at<? AND e.completed_at>=m.joined_at WHERE m.code=? AND m.week=? GROUP BY m.player_id,p.name,p.avatar`,period.start,period.end,own.code,period.week);
 return {code:own.code,week:period.week,target:100,total:members.reduce((n,m)=>n+m.points,0),members:members.map(m=>({id:m.player_id,name:m.name,avatar:JSON.parse(m.avatar),points:m.points})),ends:period.end};
}
async function socialReceipts(db,id){return socialAll(db,'SELECT id,gems FROM lq_rewards WHERE player_id=? ORDER BY created_at DESC LIMIT 500',id)}
async function handleSocial(request,env){
 const path=new URL(request.url).pathname,db=env.DB;
 if(!['/api/player','/api/events','/api/league','/api/team','/api/team/join','/api/team/claim','/api/me'].includes(path))return json({error:'Not found'},404);
 const permitted={'/api/player':['POST'],'/api/events':['POST'],'/api/league':['GET'],'/api/team':['GET','POST'],'/api/team/join':['POST'],'/api/team/claim':['POST'],'/api/me':['GET']};
 if(!permitted[path].includes(request.method))return json({error:'Method not allowed'},405);
 if(request.method==='POST'&&![new URL(request.url).origin,'https://angelineymq.github.io'].includes(request.headers.get('Origin')))return json({error:'Invalid origin'},403);
 try{
  await db.batch(SOCIAL_SCHEMA.map(sql=>db.prepare(sql)));const auth=await socialAuth(request,db,path==='/api/player'),period=gamePeriods(),stamp=new Date(Date.now()).toISOString();
  if(path==='/api/player'){
   const data=await socialBody(request),name=typeof data.name==='string'?data.name.trim():'',avatar=avatarValue(data.avatar);
   if(!/^[\p{L}\p{N}_ .-]{2,20}$/u.test(name)||!avatar)throw new SocialError(400,'Use a nickname of 2–20 letters or numbers and the available avatar options.');
   const occupied=await socialOne(db,'SELECT id FROM lq_players WHERE name=? AND id<>?',name,auth.id);if(occupied)throw new SocialError(409,'That nickname is taken. Please add an initial or a number.');
   try{await db.prepare('INSERT INTO lq_players(id,key_hash,name,avatar,created_at) VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,avatar=excluded.avatar WHERE lq_players.key_hash=excluded.key_hash').bind(auth.id,auth.hash,name,JSON.stringify(avatar),stamp).run()}catch(error){if(String(error).includes('UNIQUE'))throw new SocialError(409,'That nickname is taken. Please choose another.');throw error}
   await leagueMember(db,auth.id,period);return json({saved:true,id:auth.id,name,avatar,week:period.week});
  }
  if(path==='/api/events'){
   const data=await socialBody(request);const {id,kind,correct,total}=data;
   if(!UUID.test(id||'')||!['quiz','review','match'].includes(kind)||!Number.isInteger(correct)||!Number.isInteger(total)||total<1||total>50||correct<0||correct>total||(kind==='match'&&total>6))throw new SocialError(400,'Invalid completed round.');
   const prior=await socialOne(db,'SELECT player_id FROM lq_events WHERE id=?',id);if(prior&&prior.player_id!==auth.id)throw new SocialError(409,'Round already belongs to another player.');
   const date=Date.parse(data.completedAt);const completed=new Date(Number.isFinite(date)?Math.max(Date.now()-30*86400000,Math.min(Date.now(),date)):Date.now()).toISOString();
   await leagueMember(db,auth.id,period);
   await db.prepare('INSERT OR IGNORE INTO lq_events(id,player_id,kind,correct,total,created_at,completed_at) VALUES(?,?,?,?,?,?,?)').bind(id,auth.id,kind,correct,total,stamp,completed).run();return json({saved:true,week:period.week});
  }
  if(path==='/api/league'){
   const member=await leagueMember(db,auth.id,period),rows=await leagueRows(db,period.week,period.start,period.end,member.tier,auth.id);
   return json({week:period.week,ends:period.end,tier:member.tier,rows:rows.map(r=>({id:r.player_id,name:r.name,avatar:JSON.parse(r.avatar),points:r.points,rank:r.rank,members:r.members}))});
  }
  if(path==='/api/me')return json({id:auth.id,name:auth.player.name,avatar:JSON.parse(auth.player.avatar),team:await teamDetails(db,auth.id,period),receipts:await socialReceipts(db,auth.id)});
  if(path==='/api/team'&&request.method==='GET')return json({team:await teamDetails(db,auth.id,period)});
  if(path==='/api/team'&&request.method==='POST'){
   const existing=await teamDetails(db,auth.id,period);if(existing)return json({team:existing});
   const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let code;
   for(let attempt=0;attempt<3;attempt++){
    code=[...crypto.getRandomValues(new Uint8Array(8))].map(n=>alphabet[n%32]).join('');
    try{await db.batch([db.prepare('INSERT INTO lq_teams(code,week,created_at) VALUES(?,?,?)').bind(code,period.week,stamp),db.prepare('INSERT INTO lq_team_members(week,player_id,code,joined_at) VALUES(?,?,?,?)').bind(period.week,auth.id,code,stamp)]);break}catch(error){const current=await teamDetails(db,auth.id,period);if(current)return json({team:current});if(attempt===2)throw error}
   }
   return json({team:await teamDetails(db,auth.id,period)});
  }
  if(path==='/api/team/join'){
   const data=await socialBody(request),code=typeof data.code==='string'?data.code.trim().toUpperCase():'';
   if(!/^[A-HJ-NP-Z2-9]{8}$/.test(code))throw new SocialError(400,'Enter an 8-character invitation code.');
   const existing=await teamDetails(db,auth.id,period);if(existing){if(existing.code===code)return json({team:existing});throw new SocialError(409,'You already have a team this week.');}
   const team=await socialOne(db,'SELECT * FROM lq_teams WHERE code=? AND week=?',code,period.week);if(!team)throw new SocialError(404,'Invitation code is not available this week.');
   try{const result=await db.prepare('INSERT INTO lq_team_members(week,player_id,code,joined_at) SELECT ?,?,?,? WHERE (SELECT COUNT(*) FROM lq_team_members WHERE code=? AND week=?)<2').bind(period.week,auth.id,code,stamp,code,period.week).run();if(!result.meta?.changes)throw new SocialError(409,'This team already has two players.')}catch(error){if(error instanceof SocialError)throw error;if(String(error).includes('UNIQUE'))throw new SocialError(409,'You already have a team this week.');throw error}
   return json({team:await teamDetails(db,auth.id,period)});
  }
  if(path==='/api/team/claim'){
   const team=await teamDetails(db,auth.id,period);if(!team||team.members.length!==2||team.total<team.target)throw new SocialError(409,'Two teammates must reach 100 correct answers after joining.');
   const id='friends:'+period.week+':'+team.code+':'+auth.id;
   await db.prepare('INSERT OR IGNORE INTO lq_rewards(id,player_id,gems,created_at) VALUES(?,?,?,?)').bind(id,auth.id,15,stamp).run();return json({receipts:await socialReceipts(db,auth.id)});
  }
 }catch(error){if(error instanceof SocialError)return json({error:error.message},error.status);console.error('Online challenge request failed',error);return json({error:'Online challenges are temporarily unavailable. Please retry.'},503)}
}

async function handle(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    if (url.pathname !== '/api/leaderboard') {if(!env.DB)return json({error:'Online challenges are temporarily unavailable.'},503);return handleSocial(request,env);}
    if (!env.DB) return json({error:'Leaderboard is temporarily unavailable.'},503);
    try {
      if (!['GET','POST'].includes(request.method)) return json({error:'Method not allowed'},405);
      if (request.method === 'POST') {
        if (![url.origin,'https://angelineymq.github.io'].includes(request.headers.get('Origin'))) return json({error:'Invalid origin'},403);
        if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json({error:'JSON required'},415);
        const body = await request.text();
        if (body.length > 2048) return json({error:'Result too large'},413);
        let result;
        try { result = JSON.parse(body); } catch { return json({error:'Invalid result'},400); }
        const {id, subject, difficulty, correct, total} = result;
        const player = typeof result.player === 'string' ? result.player.trim() : '';
        if (!/^[0-9a-f-]{36}$/i.test(id || '') || !/^[\p{L}\p{N}_ .-]{2,20}$/u.test(player) || !subjects.includes(subject) || !(levels.includes(difficulty)||/^MOE P[1-6]$/.test(difficulty)||/^MOE S[1-5]$/.test(difficulty)||/^MOE JC[12]$/.test(difficulty)||/^MOE (Primary|Secondary|JC) overview$/.test(difficulty)) || (!Number.isInteger(total)||total<1||total>50) || !Number.isInteger(correct) || correct < 0 || correct > total) return json({error:'Please use a name of 2–20 letters or numbers and a valid completed test.'},400);
        await env.DB.prepare(schema).run();
        // A test's UUID makes retrying a failed request safe, without duplicate records.
        await env.DB.prepare('INSERT OR IGNORE INTO learning_quest_results (id,player,subject,difficulty,correct,total) VALUES (?,?,?,?,?,?)').bind(id,player,subject,difficulty,correct,total).run();
        return json({saved:true});
      }
      await env.DB.prepare(schema).run();
      const {results} = await env.DB.prepare('SELECT player,subject,difficulty,correct,total,created_at FROM learning_quest_results ORDER BY (correct * 1.0 / total) DESC, correct DESC, created_at DESC LIMIT 100').all();
      return json({results});
    } catch (error) {
      console.error('Leaderboard request failed', error);
      return json({error:'Leaderboard is temporarily unavailable. Please try again.'},503);
    }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const github = origin === 'https://angelineymq.github.io';
    if (request.method === 'OPTIONS' && new URL(request.url).pathname.startsWith('/api/')) {
      return new Response(null,{status:github?204:403,headers:github?{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization, X-Player-Id','Vary':'Origin'}:{}});
    }
    const response = await handle(request,env);
    if (!github) return response;
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin',origin);
    headers.set('Vary','Origin');
    return new Response(response.body,{status:response.status,headers});
  }
};
