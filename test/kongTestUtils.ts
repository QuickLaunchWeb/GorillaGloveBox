import { setupServer, SetupServerApi } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock Data Structures
const mockServices = [{
  id: '1',
  name: 'test-service',
  url: 'http://mockbin.org/request',
  created_at: Date.now(),
  updated_at: Date.now(),
  connect_timeout: 60000,
  protocol: 'http',
  enabled: true
}];

const mockRoutes = [{
  id: '1',
  name: 'test-route',
  paths: ['/test'],
  methods: ['GET'],
  service: { id: '1' },
  created_at: Date.now(),
  updated_at: Date.now()
}];

const mockPlugins = [{
  id: '1',
  name: 'key-auth',
  service: { id: '1' },
  config: { key_names: ['apikey'] },
  enabled: true,
  created_at: Date.now()
}];

const mockConsumers = [{
  id: '1',
  username: 'test-consumer',
  custom_id: 'test-id',
  created_at: Date.now()
}];

const mockCertificates = [{
  id: '1',
  cert: '-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----',
  key: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----',
  created_at: Date.now()
}];

const mockSnis = [{
  id: '1',
  name: 'test.example.com',
  certificate: { id: '1' },
  created_at: Date.now()
}];

const mockUpstreams = [{
  id: '1',
  name: 'test-upstream',
  algorithm: 'round-robin',
  created_at: Date.now()
}];

// Request Handlers
export const testKongHandlers = [
  // Status endpoint
  http.get('*/status', () => {
    return HttpResponse.json({ 
      database: { reachable: true },
      server: { connections_accepted: 1 }
    });
  }),

  // Services CRUD
  http.get('*/services', () => HttpResponse.json({ data: mockServices, next: null })),
  http.get('*/services/:id', ({ params }) => {
    const service = mockServices.find(s => s.id === params.id);
    return service ? HttpResponse.json(service) : new HttpResponse(null, { status: 404 });
  }),
  http.post('*/services', async ({ request }) => {
    const service = await request.json() as any;
    const newService = {
      ...service,
      id: 'mock-' + Math.random().toString(36).substring(2, 9),
      created_at: Date.now(),
      updated_at: Date.now()
    };
    mockServices.push(newService);
    return HttpResponse.json(newService);
  }),
  http.put('*/services/:id', async ({ params, request }) => {
    const updates = await request.json() as any;
    const index = mockServices.findIndex(s => s.id === params.id);
    if (index === -1) return new HttpResponse(null, { status: 404 });
    mockServices[index] = { 
      ...mockServices[index], 
      ...updates, 
      updated_at: Date.now() 
    };
    return HttpResponse.json(mockServices[index]);
  }),
  http.delete('*/services/:id', ({ params }) => {
    const index = mockServices.findIndex(s => s.id === params.id);
    if (index === -1) return new HttpResponse(null, { status: 404 });
    mockServices.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // Routes CRUD
  http.get('*/routes', () => HttpResponse.json({ data: mockRoutes, next: null })),
  http.get('*/routes/:id', ({ params }) => {
    const route = mockRoutes.find(r => r.id === params.id);
    return route ? HttpResponse.json(route) : new HttpResponse(null, { status: 404 });
  }),

  // Plugins CRUD
  http.get('*/plugins', () => HttpResponse.json({ data: mockPlugins, next: null })),
  http.get('*/plugins/:id', ({ params }) => {
    const plugin = mockPlugins.find(p => p.id === params.id);
    return plugin ? HttpResponse.json(plugin) : new HttpResponse(null, { status: 404 });
  }),

  // Consumers
  http.get('*/consumers', () => HttpResponse.json({ data: mockConsumers, next: null })),

  // Certificates
  http.get('*/certificates', () => HttpResponse.json({ data: mockCertificates, next: null })),

  // SNIs
  http.get('*/snis', () => HttpResponse.json({ data: mockSnis, next: null })),

  // Upstreams
  http.get('*/upstreams', () => HttpResponse.json({ data: mockUpstreams, next: null })),

  // Health check
  http.get('*/', () => HttpResponse.json({ 
    tagline: 'Welcome to kong',
    version: '3.0.0'
  }))
];

export const startTestKong = (): SetupServerApi => {
  const server = setupServer(...testKongHandlers);
  server.listen({ onUnhandledRequest: 'bypass' });
  return server;
};

export const stopTestKong = (server: SetupServerApi): void => {
  server.close();
};

export const getTestAdminUrl = (): string => 'http://localhost:8001';

export const testEndpoints = {
  services: '/services',
  routes: '/routes',
  plugins: '/plugins',
  upstreams: '/upstreams',
  consumers: '/consumers',
  certificates: '/certificates',
  snis: '/snis',
  testRoute: '/test'
};