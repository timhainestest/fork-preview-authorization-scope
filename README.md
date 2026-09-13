# fork-preview-authorization-scope

A fixture for measuring how far one preview-deployment authorization reaches on a pull request from a
fork.

`index.html` is a static page carrying one line, `marker=<value>`. It is the only thing that changes
between commits, so whatever the deployed URL prints is the commit that was built. No build step, no
configuration file and no environment variables, so nothing here is specific to a hosting provider.

Point a preview-deployment provider at this repository, open a pull request from a fork, and read the
marker off the preview URL.
