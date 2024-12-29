module.exports = {
    presets: [
      '@babel/preset-env', // This preset handles modern JS syntax
      '@babel/preset-react' // This preset handles React JSX
    ],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from', // To handle export * as syntax
      '@babel/plugin-proposal-private-methods', // Optional: For private class methods/fields
      '@babel/plugin-syntax-dynamic-import' // Optional: For dynamic imports if needed
    ],
  };
  