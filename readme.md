Bunkerchat Slack slash commands.

## Usage in Slack

There are three slash-commands:

`/magic8ball [question]`

`/soulsphere [question]`

`/hangman` or `/h` (followed by `/hangman [guess]` or `/h [guess]`)

Each slash-command corresponds to a route in this repo under `src/routes/`.

## Local development

Requires nodejs 16.

```
yarn
yarn run dev
```

Unit tests exist for Hangman game logic.

```
yarn run test
# or
yarn run test:watch
```

On commit, a `husky` pre-commit hook is used to auto-prettify
files with `pretty-quick`.

## Dev Notes

Important pieces:

- yarn
- nodejs
- typescript

## References

https://api.slack.com/interactivity/slash-commands
