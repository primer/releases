const fetch = require('node-fetch')
const semver = require('semver')
const Octokit = require('@octokit/rest')

const github = new Octokit({auth: process.env.GITHUB_TOKEN})

const PACKAGES = [
  {name: '@primer/css',         repo: 'primer/css'},
  {name: '@primer/components',  repo: 'primer/components'},
  {name: '@primer/octicons',    repo: 'primer/octicons'}
].map(pkg => {
  pkg.url = `https://github.com/${pkg.repo}`
  return pkg
})

module.exports = async () => {
  const releases = []
  for (const pkg of PACKAGES) {
    const npmReleases = await getNpmReleases(pkg)
    const githubReleases = await getGitHubReleases(pkg)
    console.warn(`[${pkg.name}] got ${npmReleases.length} npm releases, ${githubReleases.length} github`)
    for (const npmRelease of npmReleases) {
      const {version, date} = npmRelease
      const {major, minor, patch, prerelease: [preid]} = semver.parse(version)
      if (!preid && patch === 0) {
        const tag = `v${version}`
        const githubRelease = githubReleases.find(release => release.tag_name === tag)
        if (githubRelease) {
          const {name: title, body: description} = githubRelease
          releases.push({
            package: pkg,
            version,
            semver: {major, minor, patch},
            date,
            title,
            description,
            tag,
            npm: npmRelease,
            github: githubRelease
          })
        }
      }
    }
  }
  releases.sort((a, b) => b.date.localeCompare(a.date))
  return {releases, packages: PACKAGES}
}

async function getNpmReleases(pkg) {
  const {name, repo, url} = pkg
  const packageInfo = await fetch(`https://registry.npmjs.org/${name}`).then(res => res.json())
  return Object.keys(packageInfo.versions)
    .sort(semver.rcompare)
    .map(version => {
      return {
        name,
        version,
        repo,
        url: `https://www.npmjs.com/package/${name}/v/${version}`,
        date: packageInfo.time[version],
        packageJSON: packageInfo.versions[version]
      }
    })
}

async function getGitHubReleases(pkg) {
  const [owner, repo] = pkg.repo.split('/')
  return await github.repos.listReleases({owner, repo})
    .then(res => res.data)
}

