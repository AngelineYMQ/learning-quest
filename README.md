# Learning Quest

Live site: https://cyrusli.space/

Completed tests save player nicknames, subject, difficulty, correct answers, question count and server timestamp to the shared leaderboard. The leaderboard shows the top 100 tests by accuracy, then correct answers, then newest completion. Names support Chinese and are public nicknames, not authenticated accounts. Results are client-submitted and are not suitable for prizes or verified examinations.

All six subjects, nine difficulties, boost options through 10^78 and durations through 720 hours are retained. XP, boosts, streaks and device progress remain local.

## Deployment
Upload index.html, app.js, questions.js, style.css, _worker.js and _routes.json to the existing Cloudflare Pages project cyrus-math-class. Its production DB binding points to cyrus_math_leaderboard. The worker creates the separate learning_quest_results table without modifying the old game's tables. Static assets bypass the worker; only /api/* invokes it.

GitHub Pages serves the same frontend and uses https://cyrusli.space/api/leaderboard. The worker permits this exact origin through CORS. For local-only offline play, the cloud leaderboard is unavailable.

## MOE primary practice
The default mode adds selected primary mathematics, science and English practice, with level/topic filters, explanations and current MOE source links in curriculum.js. 600 parameterised mathematics items, 60 science items, and 45 English items used across three two-year practice bands (90 level-tagged records). These are original MCQs, not MOE official questions, and do not cover all syllabus outcomes. Arcade mode retains the six original subjects and advanced questions. Include curriculum.js in Cloudflare deployments.

## School subjects and saved sessions
subject-library.js adds the subject directory consulted on MOE primary, secondary and pre-university pages (11 / 30 / 30 entries) and 272 original introductory concept questions. These starter banks are not complete grade-, G- or H-level courses; school-specific and third-language subjects may differ. Official document titles and links are preserved in each course's source list.

An active test, its exact question/choices, selected answer, correct count and feedback save to localStorage after each question and navigation. Refresh the same browser/address, then choose Continue saved test. Answered questions remain disabled so XP is not awarded again. Inventory offers JSON export/import for moving progress to another origin/browser. The leaderboard remains cloud-backed; personal snapshots are browser-local and are not accounts or automatic cross-device sync.

Deploy subject-library.js alongside the existing files. _worker.js accepts the new subject names and overview labels.

## Learning game elements
Daily correct-answer goals (5/10/20/30), three daily quests with once-per-day gem claims, topic-trail stars for at least 80% accuracy on tested topics, six achievement badges, answer combos, Explorer levels based on completed tests, and optional five-heart challenges. Zero hearts pauses Next until the player chooses free relaxed practice; the test is not discarded. Gems unlock mint and gold colour themes. Challenge hearts, combos, daily counters, rewards and route progress persist with the quiz and are included in backups. Personal data migrates to learningQuest_v3 so old v2 tabs cannot erase the new game fields. These are Learning Quest features inspired by common learning-game mechanics, without copying another app's branding or assets.
