import React, { createContext, ReactNode, useContext } from "react";
import { ServerInfoRepresentation } from "./server-info";
import { HttpClientContext } from "../http-service/HttpClientContext";
import { sortProviders } from "../../util";
import { DataLoader } from "../../components/data-loader/DataLoader";

export const ServerInfoContext = createContext<ServerInfoRepresentation>(
  {} as ServerInfoRepresentation
);

export const useServerInfo = () => useContext(ServerInfoContext);

export const useLoginProviders = () => {
  return sortProviders(useServerInfo().providers["login-protocol"].providers);
};

export const ServerInfoProvider = ({ children }: { children: ReactNode }) => {
  const httpClient = useContext(HttpClientContext)!;
  const loader = async () => {
    const response = await httpClient.doGet<ServerInfoRepresentation>(
      "/admin/serverinfo"
    );
    return response.data!;
  };
  return (
    <DataLoader loader={loader}>
      {(serverInfo) => (
        <ServerInfoContext.Provider value={serverInfo.data}>
          {children}
        </ServerInfoContext.Provider>
      )}
    </DataLoader>
  );
};
