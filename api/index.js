const micro = require('micro')
const getReleases = require('..')

module.exports = micro(async (req, res) => {
  const releases = await getReleases()
  res.setHeader('Access-Control-Allow-Origin', '*')
  return releases
})
