module.exports = [
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true
      }
    }
  },
  {
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
  },
]