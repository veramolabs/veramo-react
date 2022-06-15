import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { createAgent, TAgent, IDIDManager } from '@veramo/core'
import { VeramoProvider, useVeramo } from '../VeramoProvider'
import { IContext } from '../types'
type IAgent = TAgent<IDIDManager>

beforeEach(() => {
  window.localStorage.clear()
})

const wrapper = (props: any) => (
  <VeramoProvider<IAgent, IContext>>{props.children}</VeramoProvider>
)

test('agent list should be empty by default', async () => {
  const { result } = renderHook(() => useVeramo(), { wrapper })

  expect(result.current.agent).toBeUndefined()
  expect(result.current.agents).toHaveLength(0)
  expect(result.current.activeAgentId).toBeUndefined()
  expect(typeof result.current.setActiveAgentId).toBe('function')
  expect(typeof result.current.addAgentConfig).toBe('function')
  expect(typeof result.current.removeAgent).toBe('function')
  expect(typeof result.current.updateAgentConfig).toBe('function')
  expect(typeof result.current.getAgentConfig).toBe('function')
})

test('should be able to add local agent', () => {
  const { result } = renderHook(() => useVeramo(), { wrapper })

  const agent = createAgent<IAgent, IContext>({
    context: {
      id: 'foo',
    },
  })

  act(() => result.current.addAgent(agent))

  expect(result.current.agent?.context.id).toEqual('foo')
})

test('should be able to add agent config', async () => {
  const { result } = renderHook(() => useVeramo(), { wrapper })

  act(() =>
    result.current.addAgentConfig({
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
    }),
  )

  expect(result.current.activeAgentId).toEqual('foo')
  expect(result.current.agents).toHaveLength(1)
  expect(result.current.agents[0]).toEqual(result.current.agent)
  expect(result.current.agents[0].context?.id).toEqual('foo')
  expect(result.current.agents[0].context?.name).toEqual('bar')
  expect(result.current.agents[0].availableMethods()).toEqual([
    'resolveDid',
    'didManagerCreate',
  ])
  expect(typeof result.current.agents[0].resolveDid).toBe('function')
  expect(typeof result.current.agents[0].didManagerCreate).toBe('function')
})

test('addAgentConfig should generate UUID for context.id', () => {
  const { result } = renderHook(() => useVeramo(), { wrapper })

  act(() =>
    result.current.addAgentConfig({
      context: {
        name: 'bar',
      },
      remoteAgents: [],
    }),
  )

  expect(typeof result.current.activeAgentId).toBe('string')
})

test('should be able to remove agent config', () => {
  const { result } = renderHook(() => useVeramo(), { wrapper })

  act(() =>
    result.current.addAgentConfig({
      context: {
        name: 'foo',
      },
      remoteAgents: [],
    }),
  )

  act(() => {
    const agent = createAgent<IAgent, IContext>({
      context: { id: 'baz' },
    })
    result.current.addAgent(agent)
  })

  act(() =>
    result.current.addAgentConfig({
      context: {
        name: 'bar',
      },
      remoteAgents: [],
    }),
  )

  expect(result.current.agents).toHaveLength(3)
  const originalActive = result.current.activeAgentId

  act(() => {
    if (result.current.agents[2].context.id)
      result.current.removeAgent(result.current.agents[2].context.id)
  })

  expect(result.current.agents).toHaveLength(2)
  expect(result.current.activeAgentId).toEqual(originalActive)
})

test('should reset active agent id if removing active agent', () => {
  const { result } = renderHook(() => useVeramo(), { wrapper })

  act(() => {
    const agent = createAgent<IAgent, IContext>({
      context: { id: 'baz' },
    })
    result.current.addAgent(agent)
  })

  act(() =>
    result.current.addAgentConfig({
      context: {
        name: 'foo',
      },
      remoteAgents: [],
    }),
  )

  act(() =>
    result.current.addAgentConfig({
      context: {
        name: 'bar',
      },
      remoteAgents: [],
    }),
  )

  expect(result.current.agents).toHaveLength(3)

  const secondAgentId = result.current.agents[1].context.id

  act(() => result.current.removeAgent(result.current.activeAgentId as string))

  expect(result.current.agents).toHaveLength(2)
  expect(result.current.activeAgentId).toEqual(secondAgentId)
  expect(result.current.activeAgentId).toEqual(
    result.current.agents[0].context.id,
  )
})

test('should be able to update agent config', () => {
  const { result } = renderHook(() => useVeramo(), { wrapper })

  act(() =>
    result.current.addAgentConfig({
      context: {
        name: 'foo',
      },
      remoteAgents: [],
    }),
  )

  act(() =>
    result.current.addAgentConfig({
      context: {
        name: 'bar',
      },
      remoteAgents: [],
    }),
  )

  act(() => {
    const agent = createAgent<IAgent, IContext>({
      context: { id: 'lorem' },
    })
    result.current.addAgent(agent)
  })

  expect(result.current.agents).toHaveLength(3)
  const secondAgentId = result.current.agents[1].context.id as string

  act(() => {
    const config = result.current.getAgentConfig(secondAgentId)
    config.context.name = 'baz'

    result.current.updateAgentConfig(secondAgentId, config)
  })
  expect(result.current.agents).toHaveLength(3)

  expect(result.current.agents[1].context.name).toEqual('baz')
})

test('should be able to set active agent', () => {
  const { result } = renderHook(() => useVeramo(), { wrapper })

  act(() =>
    result.current.addAgentConfig({
      context: {
        id: 'foo',
        name: 'foo',
      },
      remoteAgents: [],
    }),
  )

  act(() =>
    result.current.addAgentConfig({
      context: {
        id: 'bar',
        name: 'bar',
      },
      remoteAgents: [],
    }),
  )

  expect(result.current.agent?.context.name).toEqual('foo')

  act(() => result.current.setActiveAgentId('bar'))
  expect(result.current.agent?.context.name).toEqual('bar')
})

test('addAgent should throw error if context.id is missing', () => {
  const { result } = renderHook(() => useVeramo(), { wrapper })

  try {
    act(() => result.current.addAgent(createAgent({})))
  } catch (e) {
    expect(e).toEqual(Error('Missing context.id'))
  }
})

test('should be possible to pass initial values as props', () => {
  const localAgent1 = createAgent<IAgent, IContext>({
    context: {
      id: 'foo',
    },
  })

  const localAgent2 = createAgent<IAgent, IContext>({
    context: {
      id: 'bar',
    },
  })

  const wrapper = (props: any) => (
    <VeramoProvider<IAgent, IContext> agents={[localAgent1, localAgent2]}>
      {props.children}
    </VeramoProvider>
  )

  const { result } = renderHook(() => useVeramo(), { wrapper })
  expect(result.current.agents).toHaveLength(2)

  act(() =>
    result.current.addAgentConfig({
      context: {
        name: 'foo',
      },
      remoteAgents: [],
    }),
  )

  act(() => {
    const agent = createAgent<IAgent, IContext>({
      context: { id: 'baz123' },
    })
    result.current.addAgent(agent)
  })

  expect(result.current.agents).toHaveLength(4)

  act(() => {
    result.current.removeAgent(result.current.activeAgentId as string)
  })
  expect(result.current.agents).toHaveLength(3)
  expect(result.current.activeAgentId).toEqual('bar')
})

test('should return correct agent by id', () => {
  const { result } = renderHook(() => useVeramo(), { wrapper })

  act(() => {
    const agent = createAgent<IAgent, IContext>({
      context: { id: 'baz' },
    })
    result.current.addAgent(agent)
  })

  act(() =>
    result.current.addAgentConfig({
      context: {
        name: 'foo',
        id: 'foo',
      },
      remoteAgents: [],
    }),
  )

  act(() =>
    result.current.addAgentConfig({
      context: {
        name: 'bar',
        id: 'bar',
      },
      remoteAgents: [],
    }),
  )

  act(() => {
    const agent = result.current.getAgent('bar')
    expect(agent.context.id).toEqual('bar')
  })
})
