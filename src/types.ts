import {
  IDataStore,
  IDIDManager,
  IKeyManager,
  IResolver,
  IMessageHandler,
} from '@veramo/core'
import { ICredentialIssuer } from '@veramo/credential-w3c'
import { IDIDComm } from '@veramo/did-comm'
import { IDataStoreORM } from '@veramo/data-store'

export type IAgent = IDataStore &
  IDataStoreORM &
  ICredentialIssuer &
  IDIDManager &
  IDIDComm &
  IKeyManager &
  IResolver &
  IMessageHandler

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
  }>
}
