import { IPluginMethodMap, TAgent } from '@veramo/core';
import { ISerializedAgentConfig } from './types';
export declare function createAgentFromConfig<T extends IPluginMethodMap>(config: ISerializedAgentConfig): TAgent<T>;
export declare function getStoredAgentConfigs(): ISerializedAgentConfig[];
export declare function storeAgentConfigs(configs: ISerializedAgentConfig[]): void;
