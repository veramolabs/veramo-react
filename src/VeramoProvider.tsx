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
>(props: {
  children: any
  initialValues?: {
    agents?: Array<TAgent<T> & { context?: C }>
    configs?: Array<ISerializedAgentConfig>
  }
}) {
  const [agents, setAgents] = useState<Array<TAgent<T> & { context: C }>>(
    (props.initialValues?.agents as any) || [],
  )
  const [activeAgentId, setActiveAgentId] = useState<string | undefined>(
    undefined,
  )

  useEffect(() => {
    const storedConfigs = getStoredAgentConfigs()
    if (storedConfigs.length === 0 && props.initialValues?.configs) {
      storeAgentConfigs(props.initialValues?.configs)
      const initialAgents = props.initialValues?.configs.map(
        createAgentFromConfig,
      )
      setAgents([...agents, ...initialAgents])
    }
  }, [props.initialValues])

  useEffect(() => {
    if (!activeAgentId && agents.length > 0) {
      setActiveAgentId(agents[0].context.id)
    } else if (agents.length === 0 && activeAgentId !== undefined) {
      setActiveAgentId(undefined)
    }
  }, [agents, activeAgentId])

  const validateContext = (context: IContext): void => {
    if (!context?.id) throw Error('Missing context.id')
  }

  const addAgent = (agent: TAgent<T> & { context: C }): void => {
    validateContext(agent.context)
    setAgents([...agents, agent])
  }

  function addAgentConfig(config: ISerializedAgentConfig) {
    if (!config.context.id) {
      config.context.id = uuidv4()
    }
    const configs = getStoredAgentConfigs().concat(config)
    storeAgentConfigs(configs)
    addAgent(createAgentFromConfig(config))
  }

  const removeAgent = (id: string) => {
    if (activeAgentId === id) {
      setActiveAgentId(undefined)
    }

    storeAgentConfigs(
      getStoredAgentConfigs().filter((c) => c.context.id !== id),
    )

    setAgents(agents.filter((a) => a.context.id !== id))
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
    //FIXME
    setAgents(configs.map((c) => createAgentFromConfig(c)))
  }

  return (
    <VeramoReactContext.Provider
      value={{
        agent: agents.find((a) => a.context.id === activeAgentId),
        agents,
        activeAgentId,
        setActiveAgentId,
        addAgent,
        removeAgent,
        addAgentConfig,
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
    addAgent: (agent: TAgent<T> & { context?: C }) => void
    removeAgent: (id: string) => void
    addAgentConfig: (config: ISerializedAgentConfig) => void
    getAgentConfig: (id: string) => ISerializedAgentConfig
    updateAgentConfig: (id: string, config: ISerializedAgentConfig) => void
  }>(VeramoReactContext)
}
