import { IAgentPluginSchema } from '@veramo/core'

export interface IContext extends Record<string, any> {
  id?: string
  name?: string
  picture?: string
}

export interface ISerializedAgentConfig {
  context: IContext
  remoteAgents: Array<{
    url: string
    token?: string
    enabledMethods: Array<string>
    schema?: IAgentPluginSchema
    schemaUrl?: string
  }>
}
