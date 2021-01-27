import React, { useContext, useState, useEffect } from 'react';
import { createAgentFromConfig, getStoredAgentConfigs, storeAgentConfigs } from './utils';
var VeramoReactContext = React.createContext({});
export function VeramoProvider(props) {
    var _a = useState([props.agent]), agents = _a[0], setAgents = _a[1];
    useEffect(function () {
        setAgents([props.agent].concat(getStoredAgentConfigs().map(function (c) { return createAgentFromConfig(c); })));
    }, [props.agent]);
    var addAgentConfig = function (config) {
        var configs = getStoredAgentConfigs().concat(config);
        storeAgentConfigs(configs);
        setAgents([props.agent].concat(configs.map(function (c) { return createAgentFromConfig(c); })));
    };
    var removeAgentConfig = function (index) {
        var configs = getStoredAgentConfigs();
        configs.splice(index - 1, 1);
        storeAgentConfigs(configs);
        setAgents([props.agent].concat(configs.map(function (c) { return createAgentFromConfig(c); })));
    };
    var getAgentConfig = function (index) {
        var configs = getStoredAgentConfigs();
        return configs[index - 1];
    };
    var updateAgentConfig = function (index, config) {
        var configs = getStoredAgentConfigs();
        configs[index - 1] = config;
        storeAgentConfigs(configs);
        setAgents([props.agent].concat(configs.map(function (c) { return createAgentFromConfig(c); })));
    };
    return React.createElement(VeramoReactContext.Provider, { value: {
            agent: props.agent,
            agents: agents,
            addAgentConfig: addAgentConfig,
            removeAgentConfig: removeAgentConfig,
            updateAgentConfig: updateAgentConfig,
            getAgentConfig: getAgentConfig,
        } }, props.children);
}
export function useVeramo() {
    return useContext(VeramoReactContext);
}
