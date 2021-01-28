import React, { useContext, useState, useEffect } from 'react'
import { TAgent, IPluginMethodMap } from '@veramo/core'
import {
  createAgentFromConfig,
  getStoredAgentConfigs,
  storeAgentConfigs,
} from './utils'
import { ISerializedAgentConfig, IAgent, IContext } from './types'

const VeramoReactContext = React.createContext<any>({})

export function VeramoProvider<T extends IPluginMethodMap = IAgent>(props: {
  children: any
}) {
  const [agents, setAgents] = useState<Array<TAgent<T>>>([])

  useEffect(() => {
    setAgents(getStoredAgentConfigs().map((c) => createAgentFromConfig<T>(c)))
  }, [])

  const addAgentConfig = (config: ISerializedAgentConfig) => {
    const configs = getStoredAgentConfigs().concat(config)
    storeAgentConfigs(configs)
    setAgents(configs.map((c) => createAgentFromConfig<T>(c)))
  }

  const removeAgentConfig = (index: number) => {
    const configs = getStoredAgentConfigs()
    configs.splice(index, 1)
    storeAgentConfigs(configs)
    setAgents(configs.map((c) => createAgentFromConfig<T>(c)))
  }

  const getAgentConfig = (index: number): ISerializedAgentConfig => {
    const configs = getStoredAgentConfigs()
    return configs[index]
  }

  const updateAgentConfig = (index: number, config: ISerializedAgentConfig) => {
    const configs = getStoredAgentConfigs()
    configs[index] = config
    storeAgentConfigs(configs)
    setAgents(configs.map((c) => createAgentFromConfig<T>(c)))
  }

  return (
    <VeramoReactContext.Provider
      value={{
        agent: agents[0],
        agents,
        addAgentConfig,
        removeAgentConfig,
        updateAgentConfig,
        getAgentConfig,
      }}
    >
      {props.children}
    </VeramoReactContext.Provider>
  )
}

export function useVeramo<
  T extends IPluginMethodMap,
  C = Record<string, any>
>() {
  return useContext<{
    agent?: TAgent<T> & { context?: C }
    agents: Array<TAgent<T> & { context?: C }>
    addAgentConfig: (config: ISerializedAgentConfig) => void
    getAgentConfig: (index: number) => ISerializedAgentConfig
    removeAgentConfig: (index: number) => void
    updateAgentConfig: (index: number, config: ISerializedAgentConfig) => void
  }>(VeramoReactContext)
}
