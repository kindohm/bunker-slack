Bunkerchat balls.

## Usage in Slack

There are two slash-commands:

`/magic8ball [question]`

`/soulsphere [question]`

Each slash-command corresponds to a route in this repo under `src/routes/`.

## Local development

```
yarn
yarn run dev
```

On commit, a `husky` pre-commit hook is used to auto-prettify
files with `pretty-quick`.

## References

https://api.slack.com/interactivity/slash-commands
