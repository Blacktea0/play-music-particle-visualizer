module.exports = {
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      extends: 'love'
    },
    {
      files: ['test/**/*'],
      env: {
        jest: true
      }
    }
  ]
}
