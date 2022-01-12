const { start } = require('./start.js')
const { run } = require('./run.js')


const steps = {
  start,
  run,
}

module.exports.handler = async (event) => {
  const {version, session, request, state} = event

  const { response, session_state } = steps[state.session.step || 'start']?.({ request, state })
  return {
    version,
    session,
    response,
    session_state,
  }
}
