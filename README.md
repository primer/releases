# @primer/releases

This is both an npm package and a web service for getting the latest
[Primer](https://primer.style) release data from both npm and GitHub.

## Node
To use it in Node, install it with:

```sh
npm install --save @primer/releases
```

The main module export is an async function that returns an object:

```js
const getReleases = require('@primer/releases')

const {releases, packages} = await getReleases()
console.log('latest release:', releases[0])
console.log('primer packages:', packages)
```

## API
The JSON API is available at:

[releases.primer.style/api](https://releases.primer.style/api)

Query string parameters and request body are ignored, and there is no
caching.
