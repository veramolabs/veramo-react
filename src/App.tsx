import React from 'react';
import './App.css';
import { useVeramo } from './lib/veramo-react';
import { AgentInterfaces } from './agent'

function App() {
  const { agent } = useVeramo<AgentInterfaces>()

  agent.resolveDid({ didUrl: 'did:web:sun.veramo.io'})
  .then(console.log)
  .catch(console.log)

  return (
    <div className="App">
      Agent: {agent.context.name}
    </div>
  );
}

export default App;
