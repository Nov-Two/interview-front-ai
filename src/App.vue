<template>
  <van-config-provider :theme="themeStore.isDark ? 'dark' : 'light'">
    <router-view />
  </van-config-provider>
</template>

<script setup lang="ts">
import { useThemeStore } from './store';

const themeStore = useThemeStore();
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  background-color: var(--van-background);
  color: var(--van-text-color);
}
</style>
