module.exports = {
  apps: [
    {
      name: 'gallery',
      script: './.next/standalone/server.js',
      // instances: "max",
      exec_mode: 'cluster', // ใช้ Cluster Mode เพื่อกระจายโหลด
      max_memory_restart: '1G', // สั่ง restart ถ้า RAM พุ่งเกิน 1GB
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOSTNAME: '0.0.0.0',
      },
    },
  ],
}
