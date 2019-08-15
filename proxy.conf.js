const PROXY_CONFIG = [{
  context: [
    "/apis",
    "/many",
    "/endpoints",
    "/i",
    "/need",
    "/to",
    "/proxy"
  ],
  target: "http://localhost:3000",
  "secure": true,
  "changeOrigin": true,
  "pathRewrite": {
    "^/apis": ""
  },
  "logLevel": "debug"
}]

module.exports = PROXY_CONFIG;
