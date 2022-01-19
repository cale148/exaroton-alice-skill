const {Client} = require('exaroton')
const client = new Client(process.env.EXAROTON_KEY)

const getServersList = async () => {
  const servers = await client.getServers()
  return servers.reduce((list, server) => {
    const motd = JSON.parse(`"${server.motd?.trim()}"`) || '1'
    list[motd] = server
    return list
  }, {})
}

const stop = async (server) => {
  await server.stop()
  return { text: 'Сервер остановлен' }
}
const start = async (server) => {
  await server.start()
  return { text: 'Сервер запускается' }
}
const status = async (server) => {
  await server.get()
  const response = { text: 'Сервер не запущен' }
  if (server.hasStatus(server.STATUS.ONLINE)) {
    response.text = 'Сервер запущен'
  } else if (server.hasStatus([server.STATUS.PREPARING, server.STATUS.LOADING, server.STATUS.STARTING])) {
    response.text = 'Сервер запускается'
  }
  return response
}
const select = async (server) => {}

const actions = {
  stop,
  start,
  status,
  select,
}

module.exports.server = async ({ slots }) => {
  const serversList = await getServersList()
  const { name: { value: serverName }, action: { value: serverAction } } = slots
  const serverId = serversList[serverName]?.id
  if (serverId && Object.keys(actions).includes(serverAction)) {
    const server = await client.server(serverId)
    return await actions[serverAction]?.(server)
  } else {
    return { text: 'Сервер не найден' }
  }
}
