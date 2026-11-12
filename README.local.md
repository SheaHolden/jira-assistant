# Running Jira Assistant locally

Personal setup for running this fork against a real Jira Cloud site, as either the web app or a self-signed Firefox extension. These instructions and the files they rely on live only on the `local` branch.

## Requirements

- Node.js (pnpm is run through `npx`, so it doesn't need a global install)
- `make`
- Firefox, for the extension

Run `make install` once after cloning. `make` also reinstalls automatically whenever `package.json` changes.

## Make targets

| Target | What it does |
|---|---|
| `make dev` | Runs the web app at http://localhost:47613 |
| `make firefox` | Builds, version-stamps and signs the Firefox extension into `dist/xpi/` |
| `make build-extn` | Builds the extensions for all browsers into `dist/<browser>/`, unsigned |
| `make build-extn-debug` | Same as `build-extn`, with source maps |
| `make build-web` | Builds the web app into `dist/` (only useful hosted behind a proxy, see below) |
| `make typecheck` | Runs `tsc -b` |
| `make format` | Runs Prettier on `src` and `vite.config.ts` |
| `make clean` | Deletes `dist/` |

## Web app

```sh
make dev
```

Open http://localhost:47613. The port is set by the `start-web` script in `package.json`, and Vite runs with `--no-open`.

**Logging in:** on the Integrate page, enter your Jira site URL, your Atlassian email and a Jira API token. Create the token at https://id.atlassian.com/manage-profile/security/api-tokens. The app stores the credentials in your browser's storage for `localhost:47613`.

**How it reaches Jira:** Jira Cloud doesn't send CORS headers, so a browser page can't call it directly. The web build works around this with a relay:

- `src/services/ajax-request-service.web.ts` sends requests for `*.atlassian.net` through `/__cors-proxy?url=…`, without cookies.
- The `devCorsProxy()` plugin in `vite.config.ts` forwards those requests over HTTPS, and only to `*.atlassian.net`. It strips the `host`, `origin`, `referer` and `cookie` headers.
- The relay only exists in the dev server (`make dev`). A static `make build-web` can't talk to Jira Cloud on its own.

The upstream `start` script needs a hosts-file entry, port 443 and mkcert, and it opens a browser. `start-web` avoids all of that.

## Firefox extension (self-signed)

Release Firefox only installs extensions signed by Mozilla. `make firefox` gets the build signed as an **unlisted** add-on: Mozilla signs it automatically, but it never appears on addons.mozilla.org (AMO).

### One-time setup

1. Log in at https://addons.mozilla.org, then generate credentials at https://addons.mozilla.org/developers/addon/api/key/.
2. Put them in `.env.local` in the repo root. Git ignores this file.
   ```
   WEB_EXT_API_KEY=user:12345678:123
   WEB_EXT_API_SECRET=…
   ```
   The "JWT issuer" goes in `WEB_EXT_API_KEY` and the "JWT secret" in `WEB_EXT_API_SECRET`, with no quotes.

### Build, sign, install

```sh
make firefox
```

1. Wait a few minutes while Mozilla validates and signs it. The signed file appears at `dist/xpi/<hash>-<version>.xpi`.
2. In Firefox, go to `about:addons` → gear → **Install Add-on From File…** → pick the `.xpi`.
3. Open it from the toolbar button or with Cmd+Shift+J. It uses your existing Jira login in Firefox, so it doesn't need an API token.

**Moving from the store version:** export your settings from the store version first (user menu → Export settings). Import them into this build, then uninstall the store version. Running both means two copies acting on your Jira pages.

### Details

- **Extension ID:** `public/firefox/manifest.json` sets the ID to `jira-assistant@sheaholden.github.io`. The upstream ID belongs to the original author's AMO account, so it can't be used for signing. Keep this ID unchanged so updates install over the existing copy and keep its data.
- **Data collection:** the manifest declares `required: ["none"]` and `optional: ["technicalAndInteraction"]`. AMO requires this declaration, and the optional entry covers the app's Google Analytics, which users can turn off in settings.
- **Version numbers:** AMO won't sign the same version twice. `make firefox` rewrites the version in `dist/firefox/manifest.json` (not in the source) to `<upstream x.y.z>.<minutes since 1970>`. Every build therefore gets a higher number, and upstream version bumps still sort higher.
- **Other browsers:** `public/firefox_selfhost/manifest.json` and the other browsers' manifests are upstream's and haven't been changed.

## Changes in this fork

**Settings.** All of these default to the original behaviour:

- **Calendar → Settings → Month View**
  - *Click a day to add worklog*: in month view, clicking a day opens Add Worklog. Clicking the day number still opens the day view.
  - *Daily summary as text*: shows the daily "Logged" total as text on the date row instead of as a yellow box.
- **Worklog report → Settings → Formatting**
  - *Decimal places* (1 / 2 / 4): rounding for hours shown as decimals.
  - *Show total column after user details in grouped report*: adds a total column right after User Details.

**Bug fixes** (always on, candidates for an upstream PR):

- Daily totals on the calendar appear on the correct day. Before, `new Date('yyyy-MM-dd')` was read as UTC, which shifted totals back a day west of UTC.
- A worklog added from the calendar keeps its local date.
- Deleting a worklog from the edit dialog updates the day's total immediately.

## Git layout

| Remote / branch | Purpose |
|---|---|
| `origin` | Your fork, https://github.com/SheaHolden/jira-assistant |
| `upstream` | shridhar-tl/jira-assistant |
| `local` | Daily use: the local dev setup plus all the feature commits |
| feature branch from `upstream/develop` | For a PR: cherry-pick only the feature/fix commits, never the local-setup ones |

Local-only commits: the web dev setup (Makefile, `start-web`, proxy) and the self-signed Firefox setup (manifest ID, `make firefox`, `.gitignore`, this file).

**Picking up upstream changes:**
```sh
git fetch upstream
git rebase upstream/develop    # on local
make firefox                   # then reinstall the new .xpi
```
