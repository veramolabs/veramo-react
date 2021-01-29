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

  expect(result.current.agents).toHaveLength(0)
  expect(typeof result.current.addAgentConfig).toBe('function')
})

test('should be able to add agent config', async () => {
  const { result } = renderHook(() => useVeramo(), { wrapper })

  act(() =>
    result.current.addAgentConfig({
      context: {
        id: 'foo',
      },
      remoteAgents: [],
    }),
  )

  expect(result.current.agents).toHaveLength(1)
  expect(result.current.agents[0].context?.id).toEqual('foo')
})
