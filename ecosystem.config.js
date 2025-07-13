module.exports = {
  apps: [
    {
      name: "app",
      script: "app.js",
      instances: "max", // Uses all available CPU cores
      exec_mode: "cluster", // Enables clustering (load balancing)
      watch: false,
    },
  ],
}
