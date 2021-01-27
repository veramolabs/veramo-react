import React, { useContext, useState, useEffect } from 'react'
import { TAgent, IPluginMethodMap } from '@veramo/core'
import { createAgentFromConfig, getStoredAgentConfigs, storeAgentConfigs } from './utils'
import { ISerializedAgentConfig } from './types'

const VeramoReactContext = React.createContext<any>({})

export function VeramoProvider<T extends IPluginMethodMap>(props: {
  children: any;
  agent: TAgent<T>
}) {

  const [agents, setAgents] = useState<Array<TAgent<T>>>([props.agent])

  useEffect(() => {
    setAgents([props.agent].concat(
      getStoredAgentConfigs().map(c => createAgentFromConfig<T>(c))
    ))
  }, [props.agent])

  const addAgentConfig = (config: ISerializedAgentConfig) => {
    const configs = getStoredAgentConfigs().concat(config)
    storeAgentConfigs(configs)
    setAgents([props.agent].concat(
      configs.map(c => createAgentFromConfig<T>(c))
    ))

  }

  return <VeramoReactContext.Provider value={{
    agent: props.agent,
    agents,
    addAgentConfig,
  }}>
    {props.children}
  </VeramoReactContext.Provider>
}

export function useVeramo<T extends IPluginMethodMap, C = Record<string, any>>() {
  return useContext<{ 
    agent: TAgent<T> & { context?: C },
    agents: Array<TAgent<T> & { context?: C }>,
    addAgentConfig: (config: ISerializedAgentConfig) => void
  }>(VeramoReactContext)
}
