<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
    <AppHeader />
    <main class="flex-grow">
      <router-view></router-view>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useWallet } from './composable/useWallet';
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

const { connectWallet, userAccount, getContract } = useWallet();

onMounted(async () => {
  connectWallet()
});

</script>