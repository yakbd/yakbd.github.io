import { h } from "vue";
import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import Landing from "./Landing.vue";
import PageSource from "./PageSource.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { "doc-footer-before": () => h(PageSource) }),
  enhanceApp({ app }) {
    app.component("Landing", Landing);
  },
} satisfies Theme;
