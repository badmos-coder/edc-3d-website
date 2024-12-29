module: {
  rules: [
    {
      test: /\.js$/,
      include: [
        path.resolve(__dirname, 'node_modules/three-mesh-bvh')
      ],
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [
            '@babel/plugin-proposal-export-namespace-from',
            '@babel/plugin-proposal-private-methods'
          ]
        }
      }
    }
  ]
}
