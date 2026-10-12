# Learning Quest

Live site: https://cyrusli.space/

Completed tests save player nicknames, subject, difficulty, correct answers, question count and server timestamp to the shared leaderboard. The leaderboard shows the top 100 tests by accuracy, then correct answers, then newest completion. Names support Chinese and are public nicknames, not authenticated accounts. Results are client-submitted and are not suitable for prizes or verified examinations.

All six subjects, nine difficulties, boost options through 10^78 and durations through 720 hours are retained. XP, boosts, streaks and device progress remain local.

## Deployment
Upload index.html, app.js, questions.js, style.css, _worker.js and _routes.json to the existing Cloudflare Pages project cyrus-math-class. Its production DB binding points to cyrus_math_leaderboard. The worker creates the separate learning_quest_results table without modifying the old game's tables. Static assets bypass the worker; only /api/* invokes it.

GitHub Pages serves the same frontend and uses https://cyrusli.space/api/leaderboard. The worker permits this exact origin through CORS. For local-only offline play, the cloud leaderboard is unavailable.

## MOE primary practice
The default mode adds selected primary mathematics, science and English practice, with level/topic filters, explanations and current MOE source links in curriculum.js. 600 parameterised mathematics items, 60 science items, and 45 English items used across three two-year practice bands (90 level-tagged records). These are original MCQs, not MOE official questions, and do not cover all syllabus outcomes. Arcade mode retains the six original subjects and advanced questions. Include curriculum.js in Cloudflare deployments.
