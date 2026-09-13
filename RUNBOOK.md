# Runbook — how far does one fork-preview authorization reach?

Two arms. Arm A tests whether the authorize link releases the commit it names or the current head.
Arm B tests whether a commit pushed after a successful deployment runs unchallenged. Arm B is the one
that decides severity on the Vercel disclosure.

The deployed page prints `VERCEL_GIT_COMMIT_SHA`. Curl the preview URL and you know which commit
Vercel built, without relying on commit statuses.

## Setup, once

1. Vercel project connected to this repository. Hobby is enough if Git Fork Protection is available on
   the plan; otherwise use a Team, because the target is a Team.
2. Project Settings → Environment Variables: add any variable, e.g. `FIXTURE=1`. Fork protection arms
   when the project has environment variables configured or the pull request touches `vercel.json`.
3. Project Settings → Security: confirm **Git Fork Protection** is on.
4. Give `$POC_GITHUB_HANDLE` read access, then fork the repository to that account.
5. Record the project id and the base commit before starting.

Use `GH_TOKEN=$(cat "$POC_GH_TOKEN_FILE")` for every fork-side command. Do not `gh auth switch`.

## Arm A — does the link release the commit it names?

1. From the fork, branch off `main`, change `MARKER` to `A1`, push, open a pull request.
2. Wait for the Vercel comment. **Record the pinned SHA** from its authorize link:
   `gh api repos/$OWNER/$REPO/issues/$PR/comments --jq '.[]|select(.user.login=="vercel[bot]")|.body' | grep -o 'sha%22%3A%22[0-9a-f]*'`
3. Do not click yet. From the fork, change `MARKER` to `A2` and push a second commit.
4. Confirm the authorize comment still pins the A1 SHA and has not been edited:
   `gh api repos/$OWNER/$REPO/issues/comments/$ID --jq '{created_at,updated_at}'`
5. Now click the authorize link.
6. Curl the preview URL and read `deployed_sha` and `marker`.

**Reads as:** `marker=A2` means the link released the current head, not the commit it named. A
reviewer who opened that link saw A1 and got A2. `marker=A1` means the link is bound to its commit and
this arm is clean.

## Arm B — does a push after a deployment run unchallenged?

1. Fresh branch from `main` on the fork, `MARKER` set to `B1`, push, open a second pull request.
2. Authorize it immediately, while B1 is head. Confirm B1 deploys and the preview says `marker=B1`.
3. From the fork, change `MARKER` to `B2` and push.
4. Watch that commit for 10 minutes. Record whether a `Authorization required to deploy.` status
   appears on the B2 SHA, whether a new authorize comment is posted, and whether B2 deploys.

**Reads as:** B2 deploying with no fresh authorization is the finding. It means one benign commit
waved through buys execution for whatever is pushed next, and `UI:A` on the disclosure should be
argued down to near-free. B2 stalling behind a new gate means the authorization is per-commit and the
maintainer-assisted precondition holds, in which case say so in the advisory and keep High.

## Recording

Write the result into `disclosures/vercel/authorized-fork-preview-runs-code-with-inherited-actions-secrets/attachments/fork-authorization-scope.txt`
under a new `# 5. Live test` section: both arms, the SHAs, the pinned SHA, each `deployed_sha` read off
the preview, and the status timeline per commit. Then update `filing.md` §Severity analysis and the
advisory's authorization section, which currently name both arms as untested.

## Boundary

This runs entirely on repositories and a Vercel project we own. Nothing here touches Vercel's own
repositories, projects or deployments. Do not run any arm of this against `vercel/microfrontends`.
