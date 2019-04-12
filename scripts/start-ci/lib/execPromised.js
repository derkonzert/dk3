const { logger } = require("@dk3/logger")

const childProcesses = []

exports.killAll = () => {
  for (let p of childProcesses) {
    if (!p.killed) {
      p.kill()
    }
  }
}

exports.execPromised = (command, options) => {
  return new Promise((resolve, reject) => {
    var exec = require("child_process").exec

    const cmd = exec(command, options, function(error, stdout, stderr) {
      // work with result
      if (error) {
        return reject(error)
      }

      logger("stdout:", stdout)
      logger("stderr:", stderr)
    })

    childProcesses.push(cmd)
  })
}
