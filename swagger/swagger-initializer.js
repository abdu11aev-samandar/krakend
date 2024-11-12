// swagger-prefixer.js

async function fetchAndPrefixSpec(service) {
  const response = await fetch(service.url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${service.name} spec from ${service.url}`);
  }
  const spec = await response.json();

  // Prefix all paths with /service-name
  const prefixedPaths = {};
  for (const path in spec.paths) {
    const newPath = `/${service.name}${path}`;
    prefixedPaths[newPath] = spec.paths[path];
  }
  spec.paths = prefixedPaths;

  // Optionally, modify the info title to include service name
  spec.info = spec.info || {};
  spec.info.title = `${service.name.charAt(0).toUpperCase() + service.name.slice(1)} API`;

  return spec;
}

async function combineSpecs(services) {
  const combinedSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Combined API Documentation',
      version: '1.0.0',
      description: 'This document combines all service APIs with appropriate prefixes.'
    },
    paths: {},
    components: {},
    security: []
  };

  for (const service of services) {
    try {
      const spec = await fetchAndPrefixSpec(service);
      // Merge paths
      for (const path in spec.paths) {
        if (combinedSpec.paths[path]) {
          console.warn(`Path ${path} already exists. Overwriting.`);
        }
        combinedSpec.paths[path] = spec.paths[path];
      }
      // Merge components (if any)
      if (spec.components) {
        for (const componentType in spec.components) {
          if (!combinedSpec.components[componentType]) {
            combinedSpec.components[componentType] = {};
          }
          for (const componentName in spec.components[componentType]) {
            if (combinedSpec.components[componentType][componentName]) {
              console.warn(`Component ${componentType}/${componentName} already exists. Overwriting.`);
            }
            combinedSpec.components[componentType][componentName] = spec.components[componentType][componentName];
          }
        }
      }
      // Merge security
      if (spec.security) {
        combinedSpec.security = combinedSpec.security.concat(spec.security);
      }
    } catch (error) {
      console.error(`Error processing ${service.name}:`, error);
    }
  }

  return combinedSpec;
}

window.onload = async function() {
  const services = [
    { name: 'gateway', url: '/gateway/docs/api-docs.json' },
    { name: 'crm', url: '/crm/docs/api-docs.json' },
    { name: 'call-center', url: '/call-center/docs/api-docs.json' },
    { name: 'chat-api', url: '/chat-api/docs/api-docs.json' },
    { name: 'help-desk', url: '/help-desk/docs/api-docs.json' },
  ];

  const combinedSpec = await combineSpecs(services);

  window.ui = SwaggerUIBundle({
    spec: combinedSpec,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout",
    persistAuthorization: true, // Remember auth tokens
    requestInterceptor: function(req) {
      // Optionally, automatically add the Authorization header if token exists
      const token = localStorage.getItem('swagger_auth_token');
      if (token) {
        req.headers['Authorization'] = `Bearer ${token}`;
      }
      return req;
    }
  });
};
