module.exports = {
  module: {
    rules: [{
      loader: 'babel-loader',
      test: /\.js$/,
      exclude: /node_modules/,
      options: {
        presets: ["@babel/react"]
      }
    }]
  }
}