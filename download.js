const Client = require('ssh2').Client
const async = require('async')

module.exports = (config, picks, done) => {
  const conn = new Client()
  conn.on('ready', function() {
    conn.sftp(function(err, sftp) {
      if (err) done(err)
      console.log('starting downloads')
      async.mapLimit(picks, 1, (pick, cb) => download(config, sftp, pick, cb), (err, files) => {
        if (err) console.log('an error0', err)
        conn.end()
        done(err, files)
      })
    })
  }).connect({
    host: config.host,
    port: config.sshPort || 22,
    username: config.username,
    password: config.password
  })
}

function download (config, sftp, pick, done) {
  let remotePath = pick.file
  let file = remotePath.split('/').pop()
  let localPath = `${config.saveDir}/${file}`
  sftp.fastGet(remotePath, localPath, err => {
    done(err, file)
  })
}
