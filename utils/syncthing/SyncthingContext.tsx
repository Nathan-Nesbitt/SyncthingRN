import React, { createContext, useContext, useMemo } from "react";
import { SyncthingExec } from "./SyncthingExec";

export interface SyncthingContextValue {
    syncthing: SyncthingExec;
}

const SyncthingContext = createContext<SyncthingContextValue | undefined>(undefined);

interface SyncthingProviderProps {
    children: React.ReactNode;
    binaryPath?: string;
}

export const SyncthingProvider = ({ children, binaryPath }: SyncthingProviderProps) => {
    const value = useMemo(() => {
        const syncthing = new SyncthingExec(binaryPath);
        return { syncthing };
    }, [binaryPath]);

    return (
        <SyncthingContext.Provider value={value}>
            {children}
        </SyncthingContext.Provider>
    );
};

export const useSyncthing = (): SyncthingContextValue => {
    const ctx = useContext(SyncthingContext);
    if (!ctx) throw new Error("useSyncthing must be used inside a SyncthingProvider");
    return ctx;
};