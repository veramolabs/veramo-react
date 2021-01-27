export interface ISerializedAgentConfig {
    context: Record<string, any>;
    remoteAgents: Array<{
        url: string;
        token?: string;
        enabledMethods: Array<string>;
    }>;
}
