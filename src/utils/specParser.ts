import yaml from 'js-yaml';

// Function to parse OpenAPI specs
export const parseOpenApiSpec = async (specPath: string): Promise<any> => {
  try {
    // In a real implementation, you would fetch the file and parse it
    // For now we'll return a placeholder
    const response = await fetch(specPath);
    const yamlContent = await response.text();
    return yaml.load(yamlContent);
  } catch (error) {
    console.error('Error parsing OpenAPI spec:', error);
    throw error;
  }
};

// Helper to extract entity schemas from a spec
export const extractEntitySchemas = (spec: any): Record<string, any> => {
  const schemas: Record<string, any> = {};
  
  // Extract schemas from components section of OpenAPI spec
  if (spec.components && spec.components.schemas) {
    Object.entries(spec.components.schemas).forEach(([name, schema]) => {
      schemas[name] = schema;
    });
  }
  
  return schemas;
};

// Helper to extract endpoints from a spec
export const extractEndpoints = (spec: any): Record<string, any> => {
  const endpoints: Record<string, any> = {};
  
  // Extract paths from OpenAPI spec
  if (spec.paths) {
    Object.entries(spec.paths).forEach(([path, methods]) => {
      endpoints[path] = methods;
    });
  }
  
  return endpoints;
};
