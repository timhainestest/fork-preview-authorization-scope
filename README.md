# fork-preview-authorization-scope

A fixture for measuring how far one preview-deployment authorization reaches on a pull request from a
fork.

The build writes `VERCEL_GIT_COMMIT_SHA`, the branch ref and the contents of `MARKER` into the served
page, so the deployed URL itself says which commit was built. `MARKER` is the only thing that changes
between test commits.

Connect a preview-deployment provider to this repository, set any environment variable on the project
so fork protection arms, and push commits from a fork.
