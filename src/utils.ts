import { createAgent, IAgentPlugin } from '@veramo/core'
import { AgentRestClient } from '@veramo/remote-client'
import { ISerializedAgentConfig, IContext } from './types'

export function createAgentFromConfig(
  config: ISerializedAgentConfig,
  plugins?: IAgentPlugin[],
): any {
  const restClients: IAgentPlugin[] = config.remoteAgents.map(
    (remote) =>
      new AgentRestClient({
        url: remote.url,
        headers: remote.token
          ? { Authorization: 'Bearer ' + remote.token }
          : undefined,
        enabledMethods: remote.enabledMethods,
        schema: remote.schema,
      }),
  )

  return createAgent({
    context: config.context,
    plugins: restClients.concat(plugins || []),
  })
}

export function getStoredAgentConfigs() {
  return JSON.parse(
    localStorage.getItem('serializedAgentConfigs') || '[]',
  ) as ISerializedAgentConfig[]
}

export function storeAgentConfigs(configs: ISerializedAgentConfig[]) {
  return localStorage.setItem('serializedAgentConfigs', JSON.stringify(configs))
}

export function storeActiveAgentId(id?: string) {
  return localStorage.setItem('activeAgentId', JSON.stringify(id))
}

export function getStoredActiveAgentId() {
  const storedId = localStorage.getItem('activeAgentId')
  return storedId === null || storedId === 'undefined'
    ? undefined
    : JSON.parse(storedId)
}
