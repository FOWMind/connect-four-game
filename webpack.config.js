import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import path from "path";

const __dirname = new URL("./", import.meta.url).pathname;
const distPath = "build";

export default {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, distPath),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "index.html" }),
    new CopyPlugin({
      patterns: [
        { from: "src/images", to: "src/images" },
        { from: "src/sounds", to: "src/sounds" },
        { from: "src/css/index.css", to: "src/css" },
        { from: "favicon.ico" },
      ],
    }),
  ],
};
