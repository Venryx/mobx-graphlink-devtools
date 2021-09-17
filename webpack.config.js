//import webpack from "webpack";

import {dirname} from "path";
import {fileURLToPath} from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
	mode: "none",
	entry: ["./Source/Panel/Entry.ts"],
	output: {
		path: __dirname + "/Dist/Bundles",
		filename: "Panel.js",
		libraryTarget: "umd",
	},
	resolve: {
		modules: [
			"Source",
			"node_modules",
		],
		extensions: [".js", ".jsx", ".ts", ".tsx"],
	},
	module: {
		rules: [
			/*{
				test: /\.(jsx?|tsx?)$/,
				exclude: /node_modules/,
				loader: "babel",
				options: {
					presets: ["es2015", "react"]
				}
			},*/
			{test: /\.tsx?$/, loader: "ts-loader"}
		]
	},
	plugins: [
		//new webpack.NoErrorsPlugin(),
	],
};