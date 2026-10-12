const subjects = ['Math','Science','English','Geography','History','Coding'];
const levels = ['Beginner','Easy','Medium','Intermediate','Hard','Advanced','Extreme','Insane','Demon'];
const json = (body, status = 200) => Response.json(body, {status, headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const schema = `CREATE TABLE IF NOT EXISTS learning_quest_results (id TEXT PRIMARY KEY, player TEXT NOT NULL, subject TEXT NOT NULL, difficulty TEXT NOT NULL, correct INTEGER NOT NULL, total INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')))`;

async function handle(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    if (url.pathname !== '/api/leaderboard') return json({error:'Not found'},404);
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
        if (!/^[0-9a-f-]{36}$/i.test(id || '') || !/^[\p{L}\p{N}_ .-]{2,20}$/u.test(player) || !subjects.includes(subject) || !(levels.includes(difficulty)||/^MOE P[1-6]$/.test(difficulty)) || (!Number.isInteger(total)||total<1||total>50) || !Number.isInteger(correct) || correct < 0 || correct > total) return json({error:'Please use a name of 2–20 letters or numbers and a valid completed test.'},400);
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
    if (request.method === 'OPTIONS' && new URL(request.url).pathname === '/api/leaderboard') {
      return new Response(null,{status:github?204:403,headers:github?{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin'}:{}});
    }
    const response = await handle(request,env);
    if (!github) return response;
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin',origin);
    headers.set('Vary','Origin');
    return new Response(response.body,{status:response.status,headers});
  }
};
