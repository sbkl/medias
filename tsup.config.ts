import { defineConfig } from "tsup";
import * as fs from "fs/promises";
import * as path from "path";

const addDirectiveToFiles = async (directory: string, directive: string) => {
  const files = await fs.readdir(directory, { recursive: true });
  for (const file of files) {
    const filePath = path.join(directory, file.toString());
    if (filePath.endsWith(".js") || filePath.endsWith(".mjs")) {
      const content = await fs.readFile(filePath, "utf8");
      await fs.writeFile(filePath, `${directive}\n${content}`);
    }
  }
};

export default defineConfig([
  {
    entry: {
      "client/index": "src/client/index.ts",
    },
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    minify: true,
    splitting: false,
    treeshake: true,
    esbuildOptions(options) {
      options.banner = {
        js: '"use client"',
      };
    },
    external: ["react", "next", "react-dom"],
  },
  {
    entry: {
      "server/index": "src/server/index.ts",
    },
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    minify: true,
    splitting: false,
    treeshake: true,
    esbuildOptions(options) {
      options.banner = {
        js: '"use server"',
      };
    },
    external: ["react", "next", "react-dom"],
  },
]);
