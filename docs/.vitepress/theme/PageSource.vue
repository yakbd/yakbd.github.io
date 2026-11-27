<script setup lang="ts">
import { useData } from "vitepress";
const { frontmatter } = useData();
</script>

<template>
  <p v-if="frontmatter.source" class="page-source">
    This page is
    <a :href="frontmatter.source.url">{{ frontmatter.source.path }}</a>
    in <a :href="`https://github.com/${frontmatter.source.repo}`">{{ frontmatter.source.repo }}</a>
    (commit <code>{{ frontmatter.source.commit.slice(0, 7) }}</code>). Corrections go there.
  </p>
</template>

<style scoped>
.page-source {
  margin-top: 48px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
.page-source a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.page-source code {
  font-size: 13px;
}
</style>
