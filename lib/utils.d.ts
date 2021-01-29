import { ISerializedAgentConfig } from './types'
export declare function createAgentFromConfig(
  config: ISerializedAgentConfig,
): any
export declare function getStoredAgentConfigs(): ISerializedAgentConfig[]
export declare function storeAgentConfigs(
  configs: ISerializedAgentConfig[],
): void
