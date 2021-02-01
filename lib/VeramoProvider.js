var __spreadArrays =
  (this && this.__spreadArrays) ||
  function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j]
    return r
  }
import React, { useContext, useState, useEffect } from 'react'
import {
  createAgentFromConfig,
  getStoredAgentConfigs,
  storeAgentConfigs,
} from './utils'
import { v4 as uuidv4 } from 'uuid'
var VeramoReactContext = React.createContext({})
export function VeramoProvider(props) {
  var _a
  var _b = useState(
      (props.agents || []).concat(
        getStoredAgentConfigs().map(function (c) {
          return createAgentFromConfig(c)
        }),
      ),
    ),
    agents = _b[0],
    setAgents = _b[1]
  var _c = useState(
      props.agents && props.agents.length > 0
        ? (_a = props.agents[0].context) === null || _a === void 0
          ? void 0
          : _a.id
        : undefined,
    ),
    activeAgentId = _c[0],
    setActiveAgentId = _c[1]
  useEffect(
    function () {
      var _a
      if (!activeAgentId && agents.length > 0) {
        setActiveAgentId(
          (_a = agents[0].context) === null || _a === void 0 ? void 0 : _a.id,
        )
      } else if (agents.length === 0 && activeAgentId !== undefined) {
        setActiveAgentId(undefined)
      }
    },
    [agents, activeAgentId],
  )
  var validateContext = function (context) {
    if (!(context === null || context === void 0 ? void 0 : context.id))
      throw Error('Missing context.id')
  }
  var addAgent = function (agent) {
    validateContext(agent.context)
    setAgents(__spreadArrays(agents, [agent]))
  }
  function addAgentConfig(config) {
    if (!config.context.id) {
      config.context.id = uuidv4()
    }
    var configs = getStoredAgentConfigs().concat(config)
    storeAgentConfigs(configs)
    addAgent(createAgentFromConfig(config))
  }
  var removeAgent = function (id) {
    if (activeAgentId === id) {
      setActiveAgentId(undefined)
    }
    storeAgentConfigs(
      getStoredAgentConfigs().filter(function (c) {
        return c.context.id !== id
      }),
    )
    setAgents(
      agents.filter(function (a) {
        var _a
        return (
          ((_a = a.context) === null || _a === void 0 ? void 0 : _a.id) !== id
        )
      }),
    )
  }
  var getAgentConfig = function (id) {
    var configs = getStoredAgentConfigs()
    var config = configs.find(function (c) {
      var _a
      return (
        ((_a = c.context) === null || _a === void 0 ? void 0 : _a.id) === id
      )
    })
    if (!config) throw Error('Config not found')
    return config
  }
  var updateAgentConfig = function (id, config) {
    validateContext(config.context)
    var configs = getStoredAgentConfigs()
    var existingConfig = configs.find(function (c) {
      var _a
      return (
        ((_a = c.context) === null || _a === void 0 ? void 0 : _a.id) === id
      )
    })
    if (!existingConfig) throw Error('Config not found')
    configs[configs.indexOf(existingConfig)] = config
    storeAgentConfigs(configs)
    var oldAgent = agents.find(function (a) {
      var _a
      return (
        ((_a = a.context) === null || _a === void 0 ? void 0 : _a.id) === id
      )
    })
    if (oldAgent) {
      var agentIndex = agents.indexOf(oldAgent)
      var newAgents = __spreadArrays(agents)
      newAgents[agentIndex] = createAgentFromConfig(config)
      setAgents(newAgents)
    }
  }
  return React.createElement(
    VeramoReactContext.Provider,
    {
      value: {
        agent: agents.find(function (a) {
          var _a
          return (
            ((_a = a.context) === null || _a === void 0 ? void 0 : _a.id) ===
            activeAgentId
          )
        }),
        agents: agents,
        activeAgentId: activeAgentId,
        setActiveAgentId: setActiveAgentId,
        addAgent: addAgent,
        removeAgent: removeAgent,
        addAgentConfig: addAgentConfig,
        updateAgentConfig: updateAgentConfig,
        getAgentConfig: getAgentConfig,
      },
    },
    props.children,
  )
}
export function useVeramo() {
  return useContext(VeramoReactContext)
}
