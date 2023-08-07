# twice

A minimalist habit tracker designed for a satisfying, focused experience.

[Check out the web demo!](https://corneliusrenken.github.io/twice/)

## Features
- Tracks habit occurrences and streaks
- Keyboard-shortcut-driven workflow
- Local data storage in a user-defined location
- Built using [Electron](https://www.electronjs.org/), [React](https://react.dev/) and [Sass](https://sass-lang.com/)
- Built from scratch without the use of any additional libraries

## A Note on Design Decisions
- I designed the app to be a small unobtrusive window on your monitor. It shouldn't distract you, but remind you of your goals.
- I purposely limited features to maintain a streamlined functionality:
    - Habits can only be marked as completed for today or yesterday, catering to any late-night habits.
    - Adding, hiding, or deleting habits from your list only affects today; you probably hadn't committed to the habit if it wasn't in the list during the day.
- I decided to use [SQLite](https://www.sqlite.org/index.html) due to its embedded nature. This prevents the need for any further installation dependencies when sharing the app.
