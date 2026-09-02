module.exports = {
  apps: [
    {
      name: "eastwind-backend",
      cwd: "./backend",
      script: "dist/index.js",
      instances: 1,
      autorestart: true,
      watch: false, // Disabling watch prevents high CPU polling
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "eastwind-frontend",
      cwd: "./frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      autorestart: true,
      watch: false, // Disabling watch prevents high CPU polling
      max_memory_restart: "600M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
