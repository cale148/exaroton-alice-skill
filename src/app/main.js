const { server } = require('./server.js')


const intents = {
  'server.action': server,
}

module.exports.handler = async (event) => {
  const {version, session, request, state} = event
  const [intent, payload] = Object.entries(request?.nlu?.intents || {})?.[0] || []
  const response = {
    text: 'Говори что желаешь?',
    end_session: false,
  }
  if (intent) {
    const { text } = await intents[intent]?.(payload)
    response.text = text
  }
  return {
    version,
    session,
    response,
    // session_state,
  }
}


