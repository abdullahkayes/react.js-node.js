module.exports = {
  apps: [
    {
      name: 'shipping-api',
      script: './server.js',
      cwd: './',
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      instances: 'max',
      exec_mode: 'cluster',
      max_restarts: 3,
      min_uptime: '10s',
      max_memory_restart: '500M',
    },
  ],
};
