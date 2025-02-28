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
    async onSuccess() {
      // Add "use client" to both client and hooks directories in dist
      await addDirectiveToFiles("dist/client", '"use client";');
      if (
        await fs
          .access("dist/hooks")
          .then(() => true)
          .catch(() => false)
      ) {
        await addDirectiveToFiles("dist/hooks", '"use client";');
      }
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
    async onSuccess() {
      await addDirectiveToFiles("dist/server", '"use server";');
    },
    external: ["react", "next", "react-dom"],
  },
]);
