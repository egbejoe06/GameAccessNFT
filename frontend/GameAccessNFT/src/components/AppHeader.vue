<template>
    <header class="bg-purple-800 shadow-lg">
        <div class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <router-link to="/" class="text-white text-2xl font-bold">
                    NFT Game Portal
                </router-link>

                <nav class="flex items-center space-x-6">
                    <router-link to="/" class="text-white hover:text-purple-200 transition-colors">
                        Home
                    </router-link>
                    <router-link to="/mint" class="text-white hover:text-purple-200 transition-colors">
                        Mint
                    </router-link>
                    <router-link to="/access" class="text-white hover:text-purple-200 transition-colors">
                        Play Games
                    </router-link>
                    <!-- <router-link to="/admin" class="text-white hover:text-purple-200 transition-colors">
                        Admin
                    </router-link> -->

                    <ConnectWallet />
                </nav>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ConnectWallet from './ConnectWallet.vue'
import { useWallet } from '../composable/useWallet';

</script>