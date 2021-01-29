import React, { useContext, useState, useEffect } from 'react'
import {
  createAgentFromConfig,
  getStoredAgentConfigs,
  storeAgentConfigs,
} from './utils'
import { v4 as uuidv4 } from 'uuid'
var VeramoReactContext = React.createContext({})
export function VeramoProvider(props) {
  var _a = useState([]),
    agents = _a[0],
    setAgents = _a[1]
  var _b = useState(undefined),
    activeAgentId = _b[0],
    setActiveAgentId = _b[1]
  useEffect(function () {
    setAgents(
      getStoredAgentConfigs().map(function (c) {
        return createAgentFromConfig(c)
      }),
    )
  }, [])
  var validateContext = function (context) {
    if (!context.id) throw Error('Missing context.id')
  }
  var addAgentConfig = function (config) {
    if (!config.context.id) {
      config.context.id = uuidv4()
    }
    var configs = getStoredAgentConfigs().concat(config)
    storeAgentConfigs(configs)
    setAgents(
      configs.map(function (c) {
        return createAgentFromConfig(c)
      }),
    )
    if (agents.length === 0) {
      setActiveAgentId(config.context.id)
    }
  }
  var removeAgentConfig = function (id) {
    var configs = getStoredAgentConfigs()
    var config = configs.find(function (c) {
      var _a
      return (
        ((_a = c.context) === null || _a === void 0 ? void 0 : _a.id) === id
      )
    })
    if (!config) throw Error('Config not found')
    configs.splice(configs.indexOf(config), 1)
    storeAgentConfigs(configs)
    setAgents(
      configs.map(function (c) {
        return createAgentFromConfig(c)
      }),
    )
    if (activeAgentId === id) {
      if (agents.length > 0) {
        var newId = agents[0].context.id
        setActiveAgentId(newId)
      } else {
        setActiveAgentId(undefined)
      }
    }
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
        addAgentConfig: addAgentConfig,
        removeAgentConfig: removeAgentConfig,
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
