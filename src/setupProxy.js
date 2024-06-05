const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000", // Замените на адрес вашего Express сервера
      changeOrigin: true,
    })
  );
};
