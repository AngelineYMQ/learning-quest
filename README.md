# Learning Quest — playable offline prototype

Open `index.html` in a modern browser to play. No installation or server required.

## Features
- Math, Science, English, Geography, History and Coding tests; 9 difficulty levels; 5, 10, 20 or 50 questions.
- XP earned for correct answers; separate lifetime and spendable XP.
- Daily streaks and compounded 1.01^(streak-1) bonus, shield protection.
- XP boosts from 1.5× through 1 undecillion×, durations from 1 minute to 720 hours.
- Local player stats and local leaderboard, saved with localStorage.

## Important limitations
- Play online at https://angelineymq.github.io/learning-quest/. This is a browser-based prototype with local progress.
- Hard through Demon use separate, increasingly challenging questions in all six subjects. Longer tests can repeat questions, especially in the English and History banks.
- The shop uses a provisional integer-only pricing model, not the earlier example formula.
- No real online accounts, global leaderboard, secure score validation, or gifting. These require a backend.
- Progress is stored only in this browser and may be lost when browser data is cleared.
- The exponential streak multiplier uses exact BigInt arithmetic, which can become computationally expensive for extremely long streaks.

## Publish
Upload the entire folder to a static hosting service (e.g. Netlify Drop or Cloudflare Pages). A public link will be created by the host. For secure multiplayer functionality, add authentication and server-side persistence before launch.
