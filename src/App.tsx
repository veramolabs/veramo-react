import React, { useEffect } from 'react';
import './App.css';
import { useAgent } from './setup'

function App() {
  const { agent, agents, addAgentConfig, removeAgentConfig, getAgentConfig, updateAgentConfig } = useAgent()

  useEffect(() => {

    const lastAgent = agents[agents.length - 1]

    lastAgent
      .resolveDid({ didUrl: 'did:web:sun.veramo.io'})
      .then(console.log)
      .catch(console.log)

    if (lastAgent.availableMethods().includes('dataStoreORMGetVerifiableCredentials')) {
      lastAgent
        .dataStoreORMGetVerifiableCredentials()
        .then(console.log)
        .catch(console.log)
    }

  }, [agents])

  const addBob = () => {
    addAgentConfig({
      context: {
        name: 'Bob'
      },
      remoteAgents: [{
        url: 'https://bob-did.eu.ngrok.io/agent',
        token: 'lala',
        enabledMethods: ['resolveDid']
      },{
        url: 'https://public.simonas.not.cat/agent',
        enabledMethods: ['dataStoreORMGetVerifiableCredentials']
      }]
    })
  }

  const changeName = (index: number, name: string) => {
    const config = getAgentConfig(index)
    config.context.name = name
    updateAgentConfig(index, config)
  }

  return (
    <div>
      Agents: 
        <ul>
          {agents.map((a, index) => (
            <li key={index}>
              {a.context?.name} 
              <button onClick={() => changeName(index, 'New name')}>Rename</button>
              <button onClick={() => removeAgentConfig(index)}>Remove</button>
            </li>
          ))}
        </ul>

      <button onClick={addBob}>Add agent</button>
    </div>
  );
}

export default App;
