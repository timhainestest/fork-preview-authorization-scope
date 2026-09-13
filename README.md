# vercel-fork-authorization-scope

Measures how far one Vercel fork-preview authorization reaches. Two arms, both run against a Vercel
project connected to this repository with Git Fork Protection on.

The deployed page prints `VERCEL_GIT_COMMIT_SHA`, so the preview URL itself says which commit Vercel
built. That is the oracle; the commit statuses are corroboration.

`RUNBOOK.md` has the steps and what each outcome means.
