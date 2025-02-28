const CorsOpts = {
  credentials: true,
  origin: "*",
  methods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
  exposedHeaders: ["X-User-Preferred-Language", "X-App-Identifier"],
  allowedHeaders: ["X-User-Preferred-Language", "X-App-Identifier"],
};

module.exports = CorsOpts;
