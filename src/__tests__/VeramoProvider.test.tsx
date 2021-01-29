import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { VeramoProvider, useVeramo } from '../VeramoProvider'

beforeEach(() => {
  window.localStorage.clear()
})

const wrapper = (props: any) => (
  <VeramoProvider>{props.children}</VeramoProvider>
)

test('agent list should be empty by default', async () => {
  const { result } = renderHook(() => useVeramo(), { wrapper })

  expect(result.current.agent).toBeUndefined()
  expect(result.current.agents).toHaveLength(0)
  expect(result.current.activeAgentId).toBeUndefined()
  expect(typeof result.current.setActiveAgentId).toBe('function')
  expect(typeof result.current.addAgentConfig).toBe('function')
  expect(typeof result.current.removeAgentConfig).toBe('function')
  expect(typeof result.current.updateAgentConfig).toBe('function')
  expect(typeof result.current.getAgentConfig).toBe('function')
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

  act(() =>
    result.current.addAgentConfig({
      context: {
        name: 'bar',
      },
      remoteAgents: [],
    }),
  )

  expect(result.current.agents).toHaveLength(2)
  const active = result.current.activeAgentId

  act(() => {
    if (result.current.agents[1].context.id)
      result.current.removeAgentConfig(result.current.agents[1].context.id)
  })

  expect(result.current.agents).toHaveLength(1)
  expect(result.current.activeAgentId).toEqual(active)
})

test('should reset active agent id if removing active agent', () => {
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

  expect(result.current.agents).toHaveLength(2)
  const secondAgentId = result.current.agents[1].context.id

  act(() =>
    result.current.removeAgentConfig(result.current.activeAgentId as string),
  )

  expect(result.current.agents).toHaveLength(1)
  expect(result.current.activeAgentId).not.toEqual(secondAgentId)
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

  expect(result.current.agents).toHaveLength(2)
  const secondAgentId = result.current.agents[1].context.id as string

  act(() => {
    const config = result.current.getAgentConfig(secondAgentId)
    config.context.name = 'baz'

    result.current.updateAgentConfig(secondAgentId, config)
  })

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

test.todo('should be able to add local agent')
test.todo('addAgent should throw error if context.id is missing')
