import React, { useContext, useState, useEffect } from 'react'
import { TAgent, IPluginMethodMap, IAgentPlugin } from '@veramo/core'
import {
  createAgentFromConfig,
  getStoredAgentConfigs,
  storeAgentConfigs,
  storeActiveAgentId,
  getStoredActiveAgentId,
} from './utils.js'
import { v4 as uuidv4 } from 'uuid'
import { ISerializedAgentConfig, IContext } from './types.js'

const VeramoReactContext = React.createContext<any>({})

export function VeramoProvider<
  T extends IPluginMethodMap,
  C extends Record<string, any> = IContext
>(props: {
  children: any
  agents?: Array<TAgent<T> & { context?: C }>
  plugins?: IAgentPlugin[]
}) {
  const initialAgents = (props.agents || []).concat(
    getStoredAgentConfigs().map(
      (c) => createAgentFromConfig(c, props.plugins)
    ),
  )

  const initialActiveAgentId =
    getStoredActiveAgentId() ||
    (initialAgents.length > 0 ? initialAgents[0].context?.id : undefined)

  const [agents, setAgents] = useState<Array<TAgent<T> & { context?: C }>>(
    initialAgents,
  )
  const [activeAgentId, setActiveAgentIdInState] = useState<string | undefined>(
    initialActiveAgentId,
  )

  useEffect(() => {
    setAgents(initialAgents)
    setActiveAgentId(initialActiveAgentId)
  }, [props])

  const setActiveAgentId = (id?: string) => {
    storeActiveAgentId(id)
    setActiveAgentIdInState(id)
  }

  const validateContext = (context: IContext): void => {
    if (!context?.id) throw Error('Missing context.id')
  }

  const addAgent = (agent: TAgent<T> & { context: C }): void => {
    validateContext(agent.context)
    setAgents([...agents, agent])
    if (!activeAgentId) {
      setActiveAgentId(agent.context.id)
    }
  }

  function addAgentConfig(config: ISerializedAgentConfig) {
    if (!config.context.id) {
      config.context.id = uuidv4()
    }
    const configs = getStoredAgentConfigs().concat(config)
    storeAgentConfigs(configs)
    addAgent(createAgentFromConfig(config, props.plugins))
  }

  const removeAgent = (id: string) => {
    storeAgentConfigs(
      getStoredAgentConfigs().filter((c) => c.context.id !== id),
    )

    const filtered = agents.filter((a) => a.context?.id !== id)
    setAgents(filtered)
    if (activeAgentId === id) {
      setActiveAgentId(filtered[0]?.context?.id)
    }
  }

  const getAgentConfig = (id: string): ISerializedAgentConfig => {
    const configs = getStoredAgentConfigs()
    const config = configs.find((c) => c.context?.id === id)
    if (!config) throw Error('Config not found')
    return config
  }

  function getAgent<T>(id: string): T {
    const agent = agents.find((a) => a.context?.id === id)
    if (!agent) throw Error('Agent not found')
    return (agent as any) as T
  }

  const updateAgentConfig = (id: string, config: ISerializedAgentConfig) => {
    validateContext(config.context)
    const configs = getStoredAgentConfigs()
    const existingConfig = configs.find((c) => c.context?.id === id)
    if (!existingConfig) throw Error('Config not found')
    configs[configs.indexOf(existingConfig)] = config
    storeAgentConfigs(configs)

    const oldAgent = agents.find((a) => a.context?.id === id)
    if (oldAgent) {
      const agentIndex = agents.indexOf(oldAgent)
      const newAgents = [...agents]
      newAgents[agentIndex] = createAgentFromConfig(config, props.plugins)
      setAgents(newAgents)
    }
  }

  return (
    <VeramoReactContext.Provider
      value={{
        agent: agents.find((a) => a.context?.id === activeAgentId),
        agents,
        activeAgentId,
        setActiveAgentId,
        addAgent,
        removeAgent,
        addAgentConfig,
        updateAgentConfig,
        getAgentConfig,
        getAgent,
      }}
    >
      {props.children}
    </VeramoReactContext.Provider>
  )
}

export function useVeramo<
  T extends IPluginMethodMap,
  C extends Record<string, any> = IContext
>() {
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
    getAgent: (id: string) => TAgent<T> & { context: C }
  }>(VeramoReactContext)
}
