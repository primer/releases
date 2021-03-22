workflow "push" {
  on = "push"
  resolves = [
    "lint",
    "test",
    "publish",
  ]
}

action "install" {
  uses = "actions/npm@master"
  args = "ci"
}

action "lint" {
  needs = "install"
  uses = "actions/npm@master"
  args = ["run", "lint"]
}

action "test" {
  needs = "install"
  uses = "actions/npm@master"
  args = "test"
}

action "publish" {
  uses = "primer/publish@master"
  secrets = [
    "GITHUB_TOKEN",
    "NPM_AUTH_TOKEN",
  ]
}
