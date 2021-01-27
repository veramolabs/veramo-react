import { createAgent } from '@veramo/core';
import { AgentRestClient } from '@veramo/remote-client';
export function createAgentFromConfig(config) {
    var plugins = config.remoteAgents.map(function (remote) { return (new AgentRestClient({
        url: remote.url,
        headers: remote.token ? { Authorization: 'Bearer ' + remote.token } : undefined,
        enabledMethods: remote.enabledMethods
    })); });
    return createAgent({
        context: config.context,
        plugins: plugins,
    });
}
export function getStoredAgentConfigs() {
    return JSON.parse(localStorage.getItem('serializedAgentConfigs') || '[]');
}
export function storeAgentConfigs(configs) {
    return localStorage.setItem('serializedAgentConfigs', JSON.stringify(configs));
}
