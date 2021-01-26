import React, { useContext } from 'react'
import { TAgent, IPluginMethodMap } from '@veramo/core'

export let VeramoReactContext: any

export function VeramoProvider<T extends IPluginMethodMap>(props: {
  children: any;
  agent: TAgent<T>
}) {

  VeramoReactContext = React.createContext({
    agent: props.agent
  })

  return <VeramoReactContext.Provider value={{
    agent: props.agent as TAgent<T>
  }}>
    {props.children}
  </VeramoReactContext.Provider>
}

export function useVeramo<T extends IPluginMethodMap>() {
  return useContext<{ agent: TAgent<T> }>(VeramoReactContext)
}
