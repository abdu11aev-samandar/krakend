window.onload = function() {
  window.ui = SwaggerUIBundle({
    urls: [
      {url: "/crm/docs/api-docs.json", name: "CRM API"},
      {url: "/call-center/docs/api-docs.json", name: "Call Center API"},
      {url: "/gateway/docs/api-docs.json", name: "Gateway API"},
      {url: "/chat-api/docs/api-docs.json", name: "Chat API"},
    ],
    "urls.primaryName": "Gateway API",
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  });
};