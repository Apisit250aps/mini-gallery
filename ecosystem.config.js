module.exports = {
  apps: [
    {
      name: "gallery",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001",
      cwd: "./",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
}

