<<<<<<< HEAD:src/types.ts
import {
  IDataStore,
  IDIDManager,
  IKeyManager,
  IResolver,
  IMessageHandler,
  IAgentPluginSchema,
} from '@veramo/core'
import { ICredentialIssuer } from '@veramo/credential-w3c'
import { IDIDComm } from '@veramo/did-comm'
import { IDataStoreORM } from '@veramo/data-store'
import { ISelectiveDisclosure } from '@veramo/selective-disclosure'

export type IAgent = IDataStore &
  IDataStoreORM &
  ICredentialIssuer &
  IDIDManager &
  IDIDComm &
  IKeyManager &
  IResolver &
  IMessageHandler &
  ISelectiveDisclosure

=======
import { IDataStore, IDIDManager, IKeyManager, IResolver, IMessageHandler, IAgentPluginSchema } from '@veramo/core';
import { ICredentialIssuer } from '@veramo/credential-w3c';
import { IDIDComm } from '@veramo/did-comm';
import { IDataStoreORM } from '@veramo/data-store';
import { ISelectiveDisclosure } from '@veramo/selective-disclosure';
export declare type IAgent = IDataStore & IDataStoreORM & ICredentialIssuer & IDIDManager & IDIDComm & IKeyManager & IResolver & IMessageHandler & ISelectiveDisclosure;
>>>>>>> chore: build:lib/types.d.ts
export interface IContext extends Record<string, any> {
    id?: string;
    name?: string;
    picture?: string;
}

export interface ISerializedAgentConfig {
    context: IContext;
    remoteAgents: Array<{
        url: string;
        token?: string;
        enabledMethods: Array<string>;
        schema?: IAgentPluginSchema;
        schemaUrl?: string;
    }>;
}
