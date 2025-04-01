<template>
    <div>
        <button v-if="!userAccount" @click="connectWallet"
            class="bg-white text-purple-800 px-4 py-2 rounded-md hover:bg-purple-100 transition-colors font-medium">
            Connect Wallet
        </button>
        <div v-else class="flex items-center">
            <span class="bg-green-500 h-2 w-2 rounded-full mr-2"></span>
            <span class="text-white mr-2">{{ shortenAddress }}</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useWallet } from '../composable/useWallet';

const { connectWallet, userAccount } = useWallet();

const shortenAddress = computed(() => {
    if (!userAccount.value) return '';
    return `${userAccount.value.slice(0, 6)}...${userAccount.value.slice(-4)}`;
});
</script>
