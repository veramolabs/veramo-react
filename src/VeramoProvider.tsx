import React, { useContext, useState, useEffect } from 'react'
import { TAgent, IPluginMethodMap } from '@veramo/core'
import {
  createAgentFromConfig,
  getStoredAgentConfigs,
  storeAgentConfigs,
} from './utils'
import { v4 as uuidv4 } from 'uuid'
import { ISerializedAgentConfig, IAgent, IContext } from './types'

const VeramoReactContext = React.createContext<any>({})

export function VeramoProvider<
  T extends IPluginMethodMap = IAgent,
  C extends Record<string, any> = IContext
>(props: { children: any }) {
  const [agents, setAgents] = useState<Array<TAgent<T> & { context: C }>>([])
  const [activeAgentId, setActiveAgentId] = useState<string | undefined>(
    undefined,
  )

  useEffect(() => {
    setAgents(getStoredAgentConfigs().map((c) => createAgentFromConfig(c)))
  }, [])

  const validateContext = (context: IContext): void => {
    if (!context.id) throw Error('Missing context.id')
  }

  const addAgentConfig = (config: ISerializedAgentConfig) => {
    if (!config.context.id) {
      config.context.id = uuidv4()
    }
    const configs = getStoredAgentConfigs().concat(config)
    storeAgentConfigs(configs)
    setAgents(configs.map((c) => createAgentFromConfig(c)))
    if (agents.length === 0) {
      setActiveAgentId(config.context.id)
    }
  }

  const removeAgentConfig = (id: string) => {
    const configs = getStoredAgentConfigs()
    const config = configs.find((c) => c.context?.id === id)
    if (!config) throw Error('Config not found')
    configs.splice(configs.indexOf(config), 1)
    storeAgentConfigs(configs)
    setAgents(configs.map((c) => createAgentFromConfig(c)))
    if (activeAgentId === id) {
      if (agents.length > 0) {
        const newId = agents[0].context.id as string
        setActiveAgentId(newId)
      } else {
        setActiveAgentId(undefined)
      }
    }
  }

  const getAgentConfig = (id: string): ISerializedAgentConfig => {
    const configs = getStoredAgentConfigs()
    const config = configs.find((c) => c.context?.id === id)
    if (!config) throw Error('Config not found')
    return config
  }

  const updateAgentConfig = (id: string, config: ISerializedAgentConfig) => {
    validateContext(config.context)
    const configs = getStoredAgentConfigs()
    const existingConfig = configs.find((c) => c.context?.id === id)
    if (!existingConfig) throw Error('Config not found')
    configs[configs.indexOf(existingConfig)] = config
    storeAgentConfigs(configs)
    setAgents(configs.map((c) => createAgentFromConfig(c)))
  }

  return (
    <VeramoReactContext.Provider
      value={{
        agent: agents.find((a) => a.context.id === activeAgentId),
        agents,
        activeAgentId,
        setActiveAgentId,
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

export function useVeramo<T extends IPluginMethodMap, C = IContext>() {
  return useContext<{
    agent?: TAgent<T> & { context: C }
    agents: Array<TAgent<T> & { context: C }>
    activeAgentId?: string
    setActiveAgentId: (id: string) => void
    addAgentConfig: (config: ISerializedAgentConfig) => void
    getAgentConfig: (id: string) => ISerializedAgentConfig
    removeAgentConfig: (id: string) => void
    updateAgentConfig: (id: string, config: ISerializedAgentConfig) => void
  }>(VeramoReactContext)
}
