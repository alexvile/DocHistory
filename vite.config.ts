import { defineConfig } from "vite";
import { vercelPreset } from "@vercel/remix/vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import { installGlobals } from "@remix-run/node";

installGlobals();

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_singleFetch: true,
      },
      presets: [vercelPreset()],
      ignoredRouteFiles: ["**/*.css"],
    }),
    tsconfigPaths(),
  ],
});