// Basic types for Kong entities

export interface KongService {
  id?: string;
  name?: string;
  protocol?: string;
  host: string;
  port?: number;
  path?: string;
  retries?: number;
  connect_timeout?: number;
  write_timeout?: number;
  read_timeout?: number;
  tags?: string[];
  client_certificate?: { id: string };
  tls_verify?: boolean;
  tls_verify_depth?: number;
  ca_certificates?: string[];
  created_at?: number;
  updated_at?: number;
}

export interface KongRoute {
  id?: string;
  name?: string;
  protocols?: string[];
  methods?: string[];
  hosts?: string[];
  paths?: string[];
  headers?: Record<string, string[]>;
  https_redirect_status_code?: number;
  regex_priority?: number;
  strip_path?: boolean;
  preserve_host?: boolean;
  tags?: string[];
  service?: { id: string };
  created_at?: number;
  updated_at?: number;
}

export interface KongConsumer {
  id?: string;
  username?: string;
  custom_id?: string;
  tags?: string[];
  created_at?: number;
  updated_at?: number;
}

export interface KongPlugin {
  id?: string;
  name: string;
  config?: Record<string, any>;
  protocols?: string[];
  enabled?: boolean;
  tags?: string[];
  consumer?: { id: string };
  service?: { id: string };
  route?: { id: string };
  created_at?: number;
  updated_at?: number;
}

export interface KongUpstream {
  id?: string;
  name: string;
  algorithm?: string;
  hash_on?: string;
  hash_fallback?: string;
  hash_on_cookie_path?: string;
  healthchecks?: Record<string, any>;
  tags?: string[];
  created_at?: number;
  updated_at?: number;
}

export interface KongTarget {
  id?: string;
  target: string;
  weight?: number;
  tags?: string[];
  upstream?: { id: string };
  created_at?: number;
  updated_at?: number;
}

export interface KongCertificate {
  id?: string;
  cert: string;
  key: string;
  cert_alt?: string;
  key_alt?: string;
  tags?: string[];
  created_at?: number;
  updated_at?: number;
}

export interface KongSni {
  id?: string;
  name: string;
  certificate?: { id: string };
  tags?: string[];
  created_at?: number;
  updated_at?: number;
}

// Generic responses from Kong API
export interface KongPaginatedResponse<T> {
  data: T[];
  next?: string;
  offset?: string;
}

export interface KongEntity {
  id?: string;
  name?: string;
  created_at?: number;
  updated_at?: number;
  tags?: string[];
}
