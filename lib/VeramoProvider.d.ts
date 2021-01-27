/// <reference types="react" />
import { TAgent, IPluginMethodMap } from '@veramo/core';
import { ISerializedAgentConfig } from './types';
export declare function VeramoProvider<T extends IPluginMethodMap>(props: {
    children: any;
    agent: TAgent<T>;
}): JSX.Element;
export declare function useVeramo<T extends IPluginMethodMap, C = Record<string, any>>(): {
    agent: TAgent<T> & {
        context?: C;
    };
    agents: Array<TAgent<T> & {
        context?: C;
    }>;
    addAgentConfig: (config: ISerializedAgentConfig) => void;
    getAgentConfig: (index: number) => ISerializedAgentConfig;
    removeAgentConfig: (index: number) => void;
    updateAgentConfig: (index: number, config: ISerializedAgentConfig) => void;
};
