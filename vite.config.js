import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// vite-plugin-vue-devtools removido del array de plugins: el floating
// button "V" que inyecta en cada page rompía screenshots y se solapaba
// con elementos UI en walkthroughs (StepBusiness POS picker, etc).
// La extensión oficial Vue.js DevTools de Chrome sigue funcionando.

// `base` se setea solo cuando buildeamos para GH Pages (DEPLOY_TARGET=gh-pages).
// En dev y otros deploys queda en '/' (la default) para no romper el flujo local.
// El router lee `import.meta.env.BASE_URL` automáticamente y respeta el base.
const base = process.env.DEPLOY_TARGET === "gh-pages" ? "/deenex-web-v2/" : "/";

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
    allowedHosts: ["deenex.tech", ".railway.app"],
  },
});
