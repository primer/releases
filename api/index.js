const micro = require('micro')
const getReleases = require('..')

module.exports = micro(getReleases)
