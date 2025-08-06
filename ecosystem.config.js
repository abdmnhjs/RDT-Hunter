module.exports = {
  apps: [
    {
      name: "reset",
      script: "./scripts/reset.mts",
      exec_interpreter: "tsx",
      cron_restart: "0 0 * * *",
      autorestart: false,
    },
  ],
};
