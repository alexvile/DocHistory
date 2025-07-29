import { defineConfig } from "vite";
import { vercelPreset } from "@vercel/remix/vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      presets: [vercelPreset()],
      ignoredRouteFiles: ["**/*.css"],
    }),
    tsconfigPaths(),
  ],
});