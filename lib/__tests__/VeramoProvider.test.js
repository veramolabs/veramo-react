var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this
        }),
      g
    )
    function verb(n) {
      return function (v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.')
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { createAgent } from '@veramo/core'
import { VeramoProvider, useVeramo } from '../VeramoProvider'
beforeEach(function () {
  window.localStorage.clear()
})
var wrapper = function (props) {
  return React.createElement(VeramoProvider, null, props.children)
}
test('agent list should be empty by default', function () {
  return __awaiter(void 0, void 0, void 0, function () {
    var result
    return __generator(this, function (_a) {
      result = renderHook(
        function () {
          return useVeramo()
        },
        { wrapper: wrapper },
      ).result
      expect(result.current.agent).toBeUndefined()
      expect(result.current.agents).toHaveLength(0)
      expect(result.current.activeAgentId).toBeUndefined()
      expect(typeof result.current.setActiveAgentId).toBe('function')
      expect(typeof result.current.addAgentConfig).toBe('function')
      expect(typeof result.current.removeAgent).toBe('function')
      expect(typeof result.current.updateAgentConfig).toBe('function')
      expect(typeof result.current.getAgentConfig).toBe('function')
      return [2 /*return*/]
    })
  })
})
test('should be able to add local agent', function () {
  var _a
  var result = renderHook(
    function () {
      return useVeramo()
    },
    { wrapper: wrapper },
  ).result
  var agent = createAgent({
    context: {
      id: 'foo',
    },
  })
  act(function () {
    return result.current.addAgent(agent)
  })
  expect(
    (_a = result.current.agent) === null || _a === void 0
      ? void 0
      : _a.context.id,
  ).toEqual('foo')
})
test('should be able to add agent config', function () {
  return __awaiter(void 0, void 0, void 0, function () {
    var result
    var _a, _b
    return __generator(this, function (_c) {
      result = renderHook(
        function () {
          return useVeramo()
        },
        { wrapper: wrapper },
      ).result
      act(function () {
        return result.current.addAgentConfig({
          context: {
            id: 'foo',
            name: 'bar',
          },
          remoteAgents: [
            {
              url: 'https://example.com/agent',
              enabledMethods: ['resolveDid'],
            },
            {
              url: 'https://example.org/agent',
              token: '12345',
              enabledMethods: ['didManagerCreate'],
            },
          ],
        })
      })
      expect(result.current.activeAgentId).toEqual('foo')
      expect(result.current.agents).toHaveLength(1)
      expect(result.current.agents[0]).toEqual(result.current.agent)
      expect(
        (_a = result.current.agents[0].context) === null || _a === void 0
          ? void 0
          : _a.id,
      ).toEqual('foo')
      expect(
        (_b = result.current.agents[0].context) === null || _b === void 0
          ? void 0
          : _b.name,
      ).toEqual('bar')
      expect(result.current.agents[0].availableMethods()).toEqual([
        'resolveDid',
        'didManagerCreate',
      ])
      expect(typeof result.current.agents[0].resolveDid).toBe('function')
      expect(typeof result.current.agents[0].didManagerCreate).toBe('function')
      return [2 /*return*/]
    })
  })
})
test('addAgentConfig should generate UUID for context.id', function () {
  var result = renderHook(
    function () {
      return useVeramo()
    },
    { wrapper: wrapper },
  ).result
  act(function () {
    return result.current.addAgentConfig({
      context: {
        name: 'bar',
      },
      remoteAgents: [],
    })
  })
  expect(typeof result.current.activeAgentId).toBe('string')
})
test('should be able to remove agent config', function () {
  var result = renderHook(
    function () {
      return useVeramo()
    },
    { wrapper: wrapper },
  ).result
  act(function () {
    return result.current.addAgentConfig({
      context: {
        name: 'foo',
      },
      remoteAgents: [],
    })
  })
  act(function () {
    var agent = createAgent({
      context: { id: 'baz' },
    })
    result.current.addAgent(agent)
  })
  act(function () {
    return result.current.addAgentConfig({
      context: {
        name: 'bar',
      },
      remoteAgents: [],
    })
  })
  expect(result.current.agents).toHaveLength(3)
  var originalActive = result.current.activeAgentId
  act(function () {
    if (result.current.agents[2].context.id)
      result.current.removeAgent(result.current.agents[2].context.id)
  })
  expect(result.current.agents).toHaveLength(2)
  expect(result.current.activeAgentId).toEqual(originalActive)
})
test('should reset active agent id if removing active agent', function () {
  var result = renderHook(
    function () {
      return useVeramo()
    },
    { wrapper: wrapper },
  ).result
  act(function () {
    var agent = createAgent({
      context: { id: 'baz' },
    })
    result.current.addAgent(agent)
  })
  act(function () {
    return result.current.addAgentConfig({
      context: {
        name: 'foo',
      },
      remoteAgents: [],
    })
  })
  act(function () {
    return result.current.addAgentConfig({
      context: {
        name: 'bar',
      },
      remoteAgents: [],
    })
  })
  expect(result.current.agents).toHaveLength(3)
  var secondAgentId = result.current.agents[1].context.id
  act(function () {
    return result.current.removeAgent(result.current.activeAgentId)
  })
  expect(result.current.agents).toHaveLength(2)
  expect(result.current.activeAgentId).toEqual(secondAgentId)
  expect(result.current.activeAgentId).toEqual(
    result.current.agents[0].context.id,
  )
})
test('should be able to update agent config', function () {
  var result = renderHook(
    function () {
      return useVeramo()
    },
    { wrapper: wrapper },
  ).result
  act(function () {
    return result.current.addAgentConfig({
      context: {
        name: 'foo',
      },
      remoteAgents: [],
    })
  })
  act(function () {
    return result.current.addAgentConfig({
      context: {
        name: 'bar',
      },
      remoteAgents: [],
    })
  })
  expect(result.current.agents).toHaveLength(2)
  var secondAgentId = result.current.agents[1].context.id
  act(function () {
    var config = result.current.getAgentConfig(secondAgentId)
    config.context.name = 'baz'
    result.current.updateAgentConfig(secondAgentId, config)
  })
  expect(result.current.agents[1].context.name).toEqual('baz')
})
test('should be able to set active agent', function () {
  var _a, _b
  var result = renderHook(
    function () {
      return useVeramo()
    },
    { wrapper: wrapper },
  ).result
  act(function () {
    return result.current.addAgentConfig({
      context: {
        id: 'foo',
        name: 'foo',
      },
      remoteAgents: [],
    })
  })
  act(function () {
    return result.current.addAgentConfig({
      context: {
        id: 'bar',
        name: 'bar',
      },
      remoteAgents: [],
    })
  })
  expect(
    (_a = result.current.agent) === null || _a === void 0
      ? void 0
      : _a.context.name,
  ).toEqual('foo')
  act(function () {
    return result.current.setActiveAgentId('bar')
  })
  expect(
    (_b = result.current.agent) === null || _b === void 0
      ? void 0
      : _b.context.name,
  ).toEqual('bar')
})
test('addAgent should throw error if context.id is missing', function () {
  var result = renderHook(
    function () {
      return useVeramo()
    },
    { wrapper: wrapper },
  ).result
  try {
    act(function () {
      return result.current.addAgent(createAgent({}))
    })
  } catch (e) {
    expect(e).toEqual(Error('Missing context.id'))
  }
})
test('should be possible to pass initial values as props', function () {
  var localAgent1 = createAgent({
    context: {
      id: 'foo',
    },
  })
  var localAgent2 = createAgent({
    context: {
      id: 'bar',
    },
  })
  var remoteConfig1 = {
    context: {
      id: 'remote1',
      name: 'baz',
    },
    remoteAgents: [
      {
        url: 'https://example.com/agent',
        enabledMethods: ['resolveDid'],
      },
      {
        url: 'https://example.org/agent',
        token: '12345',
        enabledMethods: ['didManagerCreate'],
      },
    ],
  }
  var remoteConfig2 = {
    context: {
      id: 'remote2',
    },
    remoteAgents: [
      {
        url: 'https://example.org/agent',
        enabledMethods: ['resolveDid'],
      },
    ],
  }
  var remoteConfig3 = {
    context: {
      id: 'remote3',
    },
    remoteAgents: [
      {
        url: 'https://example.org/agent3',
        enabledMethods: ['resolveDid'],
      },
    ],
  }
  var wrapper = function (props) {
    return React.createElement(
      VeramoProvider,
      {
        initialValues: {
          agents: [localAgent1, localAgent2],
          configs: [remoteConfig1, remoteConfig2, remoteConfig3],
        },
      },
      props.children,
    )
  }
  var result = renderHook(
    function () {
      return useVeramo()
    },
    { wrapper: wrapper },
  ).result
  expect(result.current.agents).toHaveLength(5)
  act(function () {
    return result.current.addAgentConfig({
      context: {
        name: 'foo',
      },
      remoteAgents: [],
    })
  })
  act(function () {
    var agent = createAgent({
      context: { id: 'baz123' },
    })
    result.current.addAgent(agent)
  })
  expect(result.current.agents).toHaveLength(7)
  act(function () {
    result.current.removeAgent(result.current.activeAgentId)
  })
  expect(result.current.agents).toHaveLength(6)
  expect(result.current.activeAgentId).toEqual('bar')
})
