module.exports = {
  apps: [{
    name: 'wannsee-geoscriptions',
    script: 'npm',
    args: 'run build-preview-server',
    watch: ['.'],
    watch_delay: 1000,
    ignore_watch: ['node_modules'],
  }],
}
