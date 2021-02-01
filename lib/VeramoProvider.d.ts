/// <reference types="react" />
import { TAgent, IPluginMethodMap } from '@veramo/core'
import { ISerializedAgentConfig, IAgent, IContext } from './types'
export declare function VeramoProvider<
  T extends IPluginMethodMap = IAgent,
  C extends Record<string, any> = IContext
>(props: {
  children: any
  agents?: Array<
    TAgent<T> & {
      context?: C
    }
  >
}): JSX.Element
export declare function useVeramo<
  T extends IPluginMethodMap = IAgent,
  C extends Record<string, any> = IContext
>(): {
  agent?:
    | ({ [P in keyof T]: import('@veramo/core').RemoveContext<T[P]> } &
        import('@veramo/core').IAgent & {
          context: C
        })
    | undefined
  agents: Array<
    TAgent<T> & {
      context: C
    }
  >
  activeAgentId?: string | undefined
  setActiveAgentId: (id: string) => void
  addAgent: (
    agent: TAgent<T> & {
      context?: C
    },
  ) => void
  removeAgent: (id: string) => void
  addAgentConfig: (config: ISerializedAgentConfig) => void
  getAgentConfig: (id: string) => ISerializedAgentConfig
  updateAgentConfig: (id: string, config: ISerializedAgentConfig) => void
}
