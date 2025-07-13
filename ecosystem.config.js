module.exports = {
  apps: [
    {
      name: "lifeline-backend",
      script: "server.js",
      instances: "max", // Uses all available CPU cores
      exec_mode: "cluster", // Enables clustering (load balancing)
      watch: false,
    },
  ],
}
