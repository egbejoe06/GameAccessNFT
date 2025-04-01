<template>
    <div class="container mx-auto px-4 py-12">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-3xl font-bold mb-6 text-center">Exclusive Game Access</h1>

            <div v-if="!isConnected" class="bg-gray-100 rounded-lg p-8 text-center mb-8">
                <p class="text-gray-700 mb-4">Please connect your wallet to access exclusive games</p>
                <button @click="connectWallet"
                    class="bg-purple-600 text-white px-6 py-3 rounded-md font-bold hover:bg-purple-700 transition-colors">
                    Connect Wallet
                </button>
            </div>

            <div v-else-if="isLoading" class="bg-gray-100 rounded-lg p-8 text-center mb-8">
                <p class="text-gray-700 mb-4">Checking your access...</p>
                <div class="flex justify-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
                </div>
            </div>

            <div v-else-if="!hasAccess" class="bg-gray-100 rounded-lg p-8 text-center mb-8">
                <p class="text-gray-700 mb-4">You don't have access to this exclusive content</p>
                <p class="text-gray-600 mb-6">You need to own a GameAccessNFT to play these games</p>
                <button @click="goToMintPage"
                    class="bg-purple-600 text-white px-6 py-3 rounded-md font-bold hover:bg-purple-700 transition-colors">
                    Get Your NFT
                </button>
            </div>

            <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
                <div class="p-6 md:p-8">
                    <div class="flex items-center mb-6">
                        <div class="bg-green-100 p-2 rounded-full mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 class="text-xl font-bold">Access Granted!</h2>
                    </div>

                    <p class="text-gray-600 mb-8">
                        Welcome to our exclusive game collection! As a GameAccessNFT holder, you have access to the
                        following
                        Unreal Engine games. Choose any game to start playing.
                    </p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div v-for="(game, index) in games" :key="index"
                            class="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div
                                class="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white opacity-80"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div class="p-4">
                                <h3 class="font-bold text-lg mb-1">{{ game.title }}</h3>
                                <p class="text-gray-600 text-sm mb-3">{{ game.description }}</p>
                                <a :href="game.url" target="_blank"
                                    class="inline-block bg-purple-600 text-white px-4 py-2 rounded font-medium hover:bg-purple-700 transition-colors">
                                    Play Now
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 class="font-bold mb-2">Your NFT Information</h3>
                        <div class="flex justify-between mb-1">
                            <span class="text-gray-600">Token ID:</span>
                            <span>{{ tokenId || 'Loading...' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Contract Address:</span>
                            <a :href="'https://mumbai.polygonscan.com/address/' + contractAddress" target="_blank"
                                class="text-purple-600 hover:underline truncate max-w-xs">
                                {{ contractAddress }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ethers } from 'ethers';
import { useWallet } from '../composable/useWallet';

const router = useRouter();
const { connectWallet, userAccount, getContract } = useWallet();

// Component state
const isLoading = ref(true);
const hasAccess = ref(false);
const tokenId = ref(null);

// Sample games (would be loaded from backend in production)
const games = ref([
    {
        title: 'Space Explorer',
        description: 'Navigate through the cosmos in this immersive space adventure',
        url: '/games/space-explorer',
    },
    {
        title: 'Fantasy Quest',
        description: 'Battle mythical creatures in an epic fantasy world',
        url: '/games/fantasy-quest',
    },
    {
        title: 'Racing Championship',
        description: 'Compete in high-speed races across stunning environments',
        url: '/games/racing-championship',
    },
    {
        title: 'Survival Island',
        description: 'Test your survival skills on a mysterious deserted island',
        url: '/games/survival-island',
    }
]);

// Computed properties
const isConnected = computed(() => Boolean(userAccount.value));

// Navigation functions
const goToMintPage = () => {
    router.push('/mint');
};

// Check if user has access
const checkAccess = async () => {
    if (!isConnected.value) {
        isLoading.value = false;
        return;
    }

    isLoading.value = true;
    hasAccess.value = false;

    try {
        const contract = await getContract();

        // Check if user has access
        const accessResult = await contract.hasAccess(userAccount.value);
        hasAccess.value = accessResult;

        // If user has access, find their token ID
        if (hasAccess.value) {
            const balance = await contract.balanceOf(userAccount.value);
            if (balance > 0) {
                // For simplicity, we just get the first token if user has multiple
                // In a real implementation, you might want to show all tokens
                const filter = contract.filters.Transfer(null, userAccount.value);
                const events = await contract.queryFilter(filter);
                if (events.length > 0) {
                    // Get the most recent transfer to this user
                    const event = events[events.length - 1];
                    tokenId.value = event.args.tokenId.toString();
                }
            }
        }
    } catch (error) {
        console.error('Error checking access:', error);
    } finally {
        isLoading.value = false;
    }
};

// Watch for account changes
watch(userAccount, async () => {
    if (userAccount.value) {
        await checkAccess();
    } else {
        hasAccess.value = false;
        isLoading.value = false;
    }
});

// Initialize component
onMounted(async () => {
    if (userAccount.value) {
        await checkAccess();
    } else {
        isLoading.value = false;
    }
});
</script>