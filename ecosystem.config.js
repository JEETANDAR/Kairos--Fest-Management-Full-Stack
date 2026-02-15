module.exports = {
  apps: [
    {
      name: "Kairos-FS",
      script: "./server/server.js",

      instances: 2,
      exec_mode: "cluster",

      autorestart: true,
      watch: false,
      max_memory_restart: "400M",

      listen_timeout: 8000,
      kill_timeout: 5000,
      restart_delay: 4000,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
}
