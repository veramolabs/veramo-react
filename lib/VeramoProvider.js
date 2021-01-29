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
      ((_a = props.initialValues) === null || _a === void 0
        ? void 0
        : _a.agents) || [],
    ),
    agents = _b[0],
    setAgents = _b[1]
  var _c = useState(undefined),
    activeAgentId = _c[0],
    setActiveAgentId = _c[1]
  useEffect(
    function () {
      var _a, _b, _c
      var storedConfigs = getStoredAgentConfigs()
      if (
        storedConfigs.length === 0 &&
        ((_a = props.initialValues) === null || _a === void 0
          ? void 0
          : _a.configs)
      ) {
        storeAgentConfigs(
          (_b = props.initialValues) === null || _b === void 0
            ? void 0
            : _b.configs,
        )
        var initialAgents =
          (_c = props.initialValues) === null || _c === void 0
            ? void 0
            : _c.configs.map(createAgentFromConfig)
        setAgents(__spreadArrays(agents, initialAgents))
      }
    },
    [props.initialValues],
  )
  useEffect(
    function () {
      if (!activeAgentId && agents.length > 0) {
        setActiveAgentId(agents[0].context.id)
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
        return a.context.id !== id
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
    //FIXME
    setAgents(
      configs.map(function (c) {
        return createAgentFromConfig(c)
      }),
    )
  }
  return React.createElement(
    VeramoReactContext.Provider,
    {
      value: {
        agent: agents.find(function (a) {
          return a.context.id === activeAgentId
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
