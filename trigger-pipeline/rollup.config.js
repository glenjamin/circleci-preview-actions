import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";

export default {
  input: "./src/main.ts",
  output: {
    file: "action.bundle.js",
    format: "cjs"
  },

  plugins: [
    resolve({ preferBuiltins: true }),
    commonjs(),
    json(),
    typescript()
  ],

  external: ["path", "os"]
};
