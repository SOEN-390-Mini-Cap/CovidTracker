# Naming Conventions

The standard naming convention for naming branches, commits, and pull requests is as follows.

### Branches

Branches should be named with the following template: `<jira-id>_short_description`

An example of this is for creating a branch to define development standards: `COV-1_define_basic_contribution_standards`

The `<jira-id>` is the id of the Jira issue the ticket is for i.e. `COV-1`

### Pull Requests

This is referring to the pull request title which should describe in short what the PR is doing as well as including the Jira id: `<jira-id>: short description`

An example is: `COV-1: define basic contribution standards`

Be sure that when you go to squash and merge your pull request the naming of that commit to main is consistent with the pull request name

### Commits

Except for the squashed commit to main from a pull request, your development commits have no defined naming template, but they should be descriptive of what changes were made in that commit an example is `added new markdown file describing the development standards`
