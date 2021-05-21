# Getting Started with Veramo React

Veramo React makes it easy to interact with multiple agents in React Applications.

## Motivation

When using veramo in your front end React apps you may need to manage the state of multiple remote and local agents. Veramo React makes it easy to manage agents without needing to write or maintain boilerplate code. It also enables making new features available to front-end stacks without developers needing to implement them manually.

When you add an agent configuration it is persisted to local storage. A randomly generated ID is assigned to each agent.

## Install and set up

```bash
yarn add @veramo-community/veramo-react
```

**_NOTE:_** Veramo React depends on `@next` versions of `@veramo`

Installation includes `@veramo/core@next` and `@veramo/remote-client@next`. You will **NOT** need to add additional `@veramo` dependencies to your app if you are just working with remote agents.

The following sippet is a simplified extract from [Veramo Agent Explorer](https://github.com/veramolabs/agent-explorer) that uses [React Query](https://github.com/tannerlinsley/react-query) ontop of `Veramo React` to manage the data layer including caching and global data syncing.

```tsx
import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { VeramoProvider } from '@veramo-community/veramo-react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { PageModuleProvider } from '../context/WidgetProvider'
import App from '../App'

const queryClient = new QueryClient()

export default = () => (
  <QueryClientProvider client={queryClient}>
    <VeramoProvider>
      <BrowserRouter>
        <Route component={App} />
      </BrowserRouter>
    </VeramoProvider>
  </QueryClientProvider>
)
```

## Create local agent

Create an agent in your app and export it. You will need to install additional dependencies

```bash
yarn add @veramo/did-resolver@next ethr-did-resolver did-resolver web-did-resolver
```

```tsx
import { createAgent, IResolver } from '@veramo/core'

import { DIDResolverPlugin } from '@veramo/did-resolver'
import { Resolver } from 'did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
import { getResolver as webDidResolver } from 'web-did-resolver'

// You will need to get a project ID from infura https://www.infura.io
const INFURA_PROJECT_ID = '<your PROJECT_ID here>'

export const agent = createAgent<IResolver>({
  plugins: [
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
        ...webDidResolver(),
      }),
    }),
  ],
})
```

In the provider setup above, add the following to bootstrap the local agent. You can also call [addAgent](#addAgent) to add while your application is running.

```tsx
import {agent} from '../veramo'

<VeramoProvider agent={[agent]}>...<VeramoProvider>
```

## `useVeramo hook`

The primary hook that provides the following API to your app. The below syntax uses React Query to fetch the data and uses the cache key of `credentials + agentID` to identify the data to your app.

```tsx
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'

export default = () => {
    const { agent } = useVeramo()
    const { data } = useQuery(
        ['credentials', { agentId: agent?.context.id }],
        () => agent?.dataStoreORMGetVerifiableCredentials())

    return (
        <div>
            {
                data.map((credential) => (
                    <div>{credential.issuer.id}</div>
                )
            }
        <div>
    )
}
```

If you are not using React Query you can just call `agent?.dataStoreORMGetVerifiableCredentials()` and manage the data like any async data source.

## API

### `agent`

The current active agent object. Call agent methods as normal:

```jsx
agent[METHOD]
```

### `agents`

A list of all configured agents.

### `activeAgentId`

The ID of the currently active agent.

### `setActiveAgentId`

Set the current active agent by ID

### `addAgent`

Add a local agent. Create a local agent as per example in `Create local agent` section.

```tsx
import { agent } from '../veramo'
import { useVeramo } from '@veramo-community/veramo-react'

// Inside a function component

const { addAgentConfig } = useVeramo()

const addLocalAgent = () => {
  addAgent(agent)
}
```

### `removeAgent`

Remove an agent by ID.

### `addAgentConfig`

Add a remote agent configuration.

```tsx
import { useVeramo } from '@veramo-community/veramo-react'

// Inside a function component
const { addAgentConfig } = useVeramo()

const newAgentConfig = () => {
  addAgentConfig({
    context: { name: 'Agent Name', schema: schemaUrl },
    remoteAgents: [
      {
        url: agentUrl,
        enabledMethods: Object.keys(schema['x-methods']),
        token: apiKey,
      },
    ],
  })
}
```

### `updateAgentConfig`

Update the configuration of an agent.

### `getAgentConfig`

Get the current configuration for an agent.

### `getAgent`

Get an agent by ID.

## Local development

- Clone repo
- Build project ~ `yarn build`
- Link npm/yarn ~ `yarn link`
- Link to your project's react version `yarn link ../<PROJECT_NAME>/node_modules/react`

In your react project run:

- `yarn link @veramo-community/veramo-react`
- `cd node_modules/react`
- `yarn link`

Back in `veramo-react`

- `yarn link react`
