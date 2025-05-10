import { testKongConnection } from '../kongConnection';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('http://localhost:8001/status', () => {
    return HttpResponse.json({ 
      database: { reachable: true },
      server: { connections_accepted: 1 }
    });
  }),
  http.get('https://localhost:8001/status', () => {
    return HttpResponse.json({ 
      database: { reachable: true },
      server: { connections_accepted: 1 }
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('testKongConnection', () => {
  it('should successfully connect to HTTP endpoint', async () => {
    const result = await testKongConnection('http://localhost:8001', false);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Connection successful');
  });

  it('should successfully connect to HTTPS with TLS verification disabled', async () => {
    const result = await testKongConnection('https://localhost:8001', true);
    expect(result.success).toBe(true);
  });

  it('should fail with invalid URL', async () => {
    server.use(
      http.get('http://invalid-url/status', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    const result = await testKongConnection('http://invalid-url', false);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Connection failed');
  });

  it('should fail when Kong returns error status', async () => {
    server.use(
      http.get('http://localhost:8001/status', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    const result = await testKongConnection('http://localhost:8001', false);
    expect(result.success).toBe(false);
  });
});
