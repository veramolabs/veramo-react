import { createAgent, IPluginMethodMap, TAgent } from '@veramo/core'
import { AgentRestClient } from '@veramo/remote-client'
import { ISerializedAgentConfig } from './types'

export function createAgentFromConfig<T extends IPluginMethodMap>(config: ISerializedAgentConfig): TAgent<T> {
  const plugins = config.remoteAgents.map(remote => (new AgentRestClient({
    url: remote.url,
    headers: remote.token ? { Authorization: 'Bearer ' + remote.token } : undefined,
    enabledMethods: remote.enabledMethods
  })))

  return createAgent<T>({
    context: config.context,
    plugins,
  })
  
}

export function getStoredAgentConfigs() {
  return JSON.parse(localStorage.getItem('serializedAgentConfigs') || '[]') as ISerializedAgentConfig[]
}

export function storeAgentConfigs(configs: ISerializedAgentConfig[]) {
  return localStorage.setItem('serializedAgentConfigs', JSON.stringify(configs))
}