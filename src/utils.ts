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
  if (typeof localStorage == 'undefined') {
    return []
  }
  return JSON.parse(
    localStorage.getItem('serializedAgentConfigs') || '[]',
  ) as ISerializedAgentConfig[]
}

export function storeAgentConfigs(configs: ISerializedAgentConfig[]) {
  if (typeof localStorage !== 'undefined') {
    return localStorage.setItem(
      'serializedAgentConfigs',
      JSON.stringify(configs),
    )
  }
}

export function storeActiveAgentId(id?: string) {
  if (typeof localStorage !== 'undefined') {
    return localStorage.setItem('activeAgentId', JSON.stringify(id))
  }
}

export function getStoredActiveAgentId() {
  if (typeof localStorage !== 'undefined') {
    const storedId = localStorage.getItem('activeAgentId')
    return storedId === null || storedId === 'undefined'
      ? undefined
      : JSON.parse(storedId)
  }
}
