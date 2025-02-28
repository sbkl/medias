import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/client/index.ts"],
    outDir: "dist/client",
    format: ["cjs", "esm"],
    dts: true,
    clean: false,
    minify: false,
    splitting: false,
    treeshake: true,
    sourcemap: true,
    banner: {
      js: '"use client";\n',
    },
    external: ["react", "react-dom", "next", "zod", "convex-helpers"],
  },
  {
    entry: ["src/server/index.ts"],
    outDir: "dist/server",
    format: ["cjs", "esm"],
    dts: true,
    clean: false,
    minify: false,
    splitting: false,
    treeshake: true,
    sourcemap: true,
    banner: {
      js: '"use server";\n',
    },
    external: ["react", "react-dom", "next", "zod", "convex-helpers"],
  },
]);
