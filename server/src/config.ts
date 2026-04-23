export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3001,

  // The Go server URL — only Express knows this exists
  goServerUrl: process.env.GO_SERVER_URL ?? "http://localhost:8080",

  // Only allow requests from your React dev server (and production domain later)
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173").split(","),
};
