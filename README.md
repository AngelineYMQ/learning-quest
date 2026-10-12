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

## Expanded primary practice (October 2026)
Primary grade selectors now cover P1–P6 for all eleven listed subjects, with Science P3–P6. primary-expansion.js supplies additional original questions, numerical variants and 504 authored grade/topic guided activity plans. primary-activities.js provides browser-local written-response drafts with review checklists; drafts are included in progress backups. LearningQuest v4 isolates the new fields from older v3 tabs and imports earlier progress. Questions are deduplicated within the selected subject/grade pool; shared checks may reappear across grades. A large question count is not evidence of complete curriculum coverage.

The content is an expansion, **not a completed textbook or exhaustive syllabus outcome bank**. Most new numerical entries exercise a limited set of problem templates. Some non-mathematical topics have only a concept check and a guided activity. Tamil and other language activities need language-teacher review; speaking/listening/practical work are not automatically assessed. Foundation/Higher courses are not fully implemented as distinct tracks. The 2024 mother-tongue syllabuses roll out from the 2024 P1 cohort; current older cohorts can use prior versions. Art/Music/language progression is often band-based, so the displayed grade plans are authored learning sequences, not official year-specific chapter lists. Ten official subject PDFs were read; the newest Mathematics PDF endpoint returned 403 and its indexed official extracts were only partially accessible. Full mathematics and all-subject completeness therefore remain unverified.

Deploy primary-expansion.js and primary-activities.js with the other static assets. Blank question pools do not offer a disabled Start button; available guided activities remain usable. Written response drafts do not award XP, accuracy, trail stars or leaderboard results.

## Challenges and player profiles
The Challenges tab adds 60-second matching, saved mistake review, monthly badges and two-player invite-code quests. Profile provides an original customizable avatar and a browser-held player identity. Save a unique nickname there to activate online features; preserve the Inventory backup to move that identity to another browser. LearningQuest v5 migrates existing progress, including unfinished tests. Review and matching have independent saved rounds and never replace an unfinished test.

Weekly leagues use correct answers from completed quiz, review and matching rounds, not boosted XP. Weeks reset Monday at midnight Singapore time; offline uploads count in the week they sync. Positive-score top three players advance; the bottom three drop when a tier has at least ten players. Friend teams need two members and 100 correct answers from rounds completed after joining; each member claims 15 gems once. Monthly badges require 30 claimed daily quests and award 20 gems once. Scores remain client submitted.

Deploy extras.js and match-bank.js with all existing frontend files. The worker creates separate lq_* D1 tables and retains the existing completed-test leaderboard. Topic trail and the guided activity directory are removed from the visible interface. Current boost duration options include the previously added 50-year option.

## Profile layout and English interface
Profile opens from the avatar button in the upper-right header, separate from practice navigation. Nicknames are edited in Profile. The interface, challenge messages and avatar controls use English; language-subject questions retain their teaching language. Original customizable SVG avatars now use chibi proportions, bright eyes and pastel colours. Existing player identities, avatar selections and saved progress are retained.
