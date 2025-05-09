import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Gateway {
  id: string;
  name: string;
  adminUrl: string;
  username?: string;
  password?: string;
  skipTlsVerify: boolean;
  type: 'oss' | 'enterprise';
}

interface GatewayState {
  gateways: Gateway[];
  activeGatewayId: string | null;
  addGateway: (gateway: Omit<Gateway, 'id'>) => void;
  updateGateway: (id: string, gateway: Partial<Gateway>) => void;
  removeGateway: (id: string) => void;
  setActiveGateway: (id: string | null) => void;
}

export const useGatewayStore = create<GatewayState>()(
  persist(
    (set) => ({
      gateways: [],
      activeGatewayId: null,

      addGateway: (gateway) => 
        set((state) => ({
          gateways: [...state.gateways, { ...gateway, id: crypto.randomUUID() }],
        })),

      updateGateway: (id, updatedGateway) =>
        set((state) => ({
          gateways: state.gateways.map((gateway) =>
            gateway.id === id ? { ...gateway, ...updatedGateway } : gateway
          ),
        })),

      removeGateway: (id) =>
        set((state) => ({
          gateways: state.gateways.filter((gateway) => gateway.id !== id),
          activeGatewayId: state.activeGatewayId === id ? null : state.activeGatewayId,
        })),

      setActiveGateway: (id) =>
        set(() => ({
          activeGatewayId: id,
        })),
    }),
    {
      name: 'gateway-storage',
    }
  )
);
