import { useCallback } from 'react';
import { useGatewayStore, Gateway } from '../store/useGatewayStore';
import { createApiClient, handleApiError } from '../services/api';
import { KongPaginatedResponse, KongEntity } from '../types/kongEntities';

export interface UseKongApiReturn<T extends KongEntity = KongEntity> {
  getAll: (endpoint: string) => Promise<T[]>;
  getById: (endpoint: string, id: string) => Promise<T>;
  create: (endpoint: string, data: T) => Promise<T>;
  update: (endpoint: string, id: string, data: Partial<T>) => Promise<T>;
  remove: (endpoint: string, id: string) => Promise<void>;
  gateway: Gateway | null;
  isConnected: boolean;
  error: string | null;
}

export function useKongApi<T extends KongEntity = KongEntity>(): UseKongApiReturn<T> {
  const { gateways, activeGatewayId } = useGatewayStore();
  const activeGateway = gateways.find(g => g.id === activeGatewayId) || null;
  
  const isConnected = Boolean(activeGateway);
  const error = !isConnected ? 'No active Kong gateway connection' : null;
  
  const getAll = useCallback(async (endpoint: string): Promise<T[]> => {
    if (!activeGateway) throw new Error('No active Kong gateway connection');
    
    try {
      const client = createApiClient(activeGateway);
      const response = await client.get<KongPaginatedResponse<T>>(endpoint);
      return response.data.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      throw new Error(errorMessage);
    }
  }, [activeGateway]);
  
  const getById = useCallback(async (endpoint: string, id: string): Promise<T> => {
    if (!activeGateway) throw new Error('No active Kong gateway connection');
    
    try {
      const client = createApiClient(activeGateway);
      const response = await client.get<T>(`${endpoint}/${id}`);
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      throw new Error(errorMessage);
    }
  }, [activeGateway]);
  
  const create = useCallback(async (endpoint: string, data: T): Promise<T> => {
    if (!activeGateway) throw new Error('No active Kong gateway connection');
    
    try {
      const client = createApiClient(activeGateway);
      const response = await client.post<T>(endpoint, data);
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      throw new Error(errorMessage);
    }
  }, [activeGateway]);
  
  const update = useCallback(async (endpoint: string, id: string, data: Partial<T>): Promise<T> => {
    if (!activeGateway) throw new Error('No active Kong gateway connection');
    
    try {
      const client = createApiClient(activeGateway);
      const response = await client.patch<T>(`${endpoint}/${id}`, data);
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      throw new Error(errorMessage);
    }
  }, [activeGateway]);
  
  const remove = useCallback(async (endpoint: string, id: string): Promise<void> => {
    if (!activeGateway) throw new Error('No active Kong gateway connection');
    
    try {
      const client = createApiClient(activeGateway);
      await client.delete(`${endpoint}/${id}`);
    } catch (err) {
      const errorMessage = handleApiError(err);
      throw new Error(errorMessage);
    }
  }, [activeGateway]);
  
  return {
    getAll,
    getById,
    create,
    update,
    remove,
    gateway: activeGateway,
    isConnected,
    error,
  };
}
