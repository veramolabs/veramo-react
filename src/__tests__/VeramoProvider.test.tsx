import React, { useEffect, useState } from 'react'
import { render, screen } from '@testing-library/react'
import { VeramoProvider, useVeramo } from '../VeramoProvider'

beforeEach(() => {
  window.localStorage.clear()
})

test('agent list should be empty by default', async () => {
  const App = () => {
    const { agents } = useVeramo()
    return <div>{agents.length === 0 && <div>Empty list</div>}</div>
  }

  render(
    <VeramoProvider>
      <App />
    </VeramoProvider>,
  )

  expect(await screen.getByText(/Empty list/)).toBeInTheDocument()

  // screen.debug();
})

test('should be able to add agent config', async () => {
  const App = () => {
    const { addAgentConfig, agents } = useVeramo()

    useEffect(() => {
      if (agents.length === 0) {
        // Adding first agent
        addAgentConfig({
          context: {
            id: 'foo',
          },
          remoteAgents: [],
        })
      }
    }, [agents])

    return (
      <ul>
        {agents.map((a) => (
          <li key={a.context?.id}>{a.context?.id}</li>
        ))}
      </ul>
    )
  }

  render(
    <VeramoProvider>
      <App />
    </VeramoProvider>,
  )
  expect(await screen.getByText(/foo/)).toBeInTheDocument()
  const items = await screen.findAllByRole('listitem')
  expect(items).toHaveLength(1)
  // screen.debug();
})
