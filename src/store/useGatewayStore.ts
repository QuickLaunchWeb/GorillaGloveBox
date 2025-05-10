import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios, { AxiosRequestConfig } from 'axios';
import https from 'https';

export type AuthType = 'none' | 'basic-auth' | 'key-auth' | 'jwt-hs256';

export interface AuthConfig {
  username?: string;
  password?: string;
  key?: string;
  jwtKey?: string;
  jwtSecret?: string;
}

export interface Gateway {
  id: string;
  name: string;
  adminUrl: string;
  skipTlsVerify: boolean;
  type: 'oss' | 'enterprise';
  authType: AuthType;
  authConfig?: AuthConfig;
}

interface GatewayState {
  gateways: Gateway[];
  activeGatewayId: string | null;
  addGateway: (gateway: Omit<Gateway, 'id'>) => void;
  removeGateway: (id: string) => void;
  setActiveGateway: (id: string) => void;
  testConnection: (gateway: Omit<Gateway, 'id'>) => Promise<{ success: boolean; message: string }>;
}

export const useGatewayStore = create<GatewayState>()(
  persist(
    (set) => ({
      gateways: [],
      activeGatewayId: null,
      addGateway: (gateway) => set((state) => ({
        gateways: [...state.gateways, { ...gateway, id: crypto.randomUUID() }],
      })),
      removeGateway: (id) => set((state) => ({
        gateways: state.gateways.filter(g => g.id !== id),
        activeGatewayId: state.activeGatewayId === id ? null : state.activeGatewayId
      })),
      setActiveGateway: (id) => set({ activeGatewayId: id }),
      testConnection: async (gateway) => {
        try {
          const config: AxiosRequestConfig = {
            headers: {} as Record<string, string>,
            httpsAgent: gateway.skipTlsVerify ? new https.Agent({ rejectUnauthorized: false }) : undefined
          };
          
          // Add auth headers based on auth type
          if (gateway.authType === 'basic-auth' && gateway.authConfig) {
            config.headers['Authorization'] = `Basic ${btoa(`${gateway.authConfig.username}:${gateway.authConfig.password}`)}`;
          } else if (gateway.authType === 'key-auth' && gateway.authConfig?.key) {
            config.headers['apikey'] = gateway.authConfig.key;
          } else if (gateway.authType === 'jwt-hs256' && gateway.authConfig?.jwtKey && gateway.authConfig?.jwtSecret) {
            config.headers['Authorization'] = `Bearer mock-jwt-token`;
          }
          
          await axios.get(`${gateway.adminUrl}/status`, config);
          return { success: true, message: 'Connection successful' };
        } catch (error: any) {
          return { 
            success: false, 
            message: error.response?.data?.message || error.message || 'Connection failed' 
          };
        }
      }
    }),
    {
      name: 'gateway-storage',
    }
  )
);
