<template>
    <div class="container mx-auto px-4 py-12">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-3xl font-bold mb-6 text-center">GameAccessNFT Admin Panel</h1>

            <div v-if="!isConnected" class="bg-gray-100 rounded-lg p-8 text-center mb-8">
                <p class="text-gray-700 mb-4">Please connect your wallet to access admin features</p>
                <button @click="connectWallet"
                    class="bg-purple-600 text-white px-6 py-3 rounded-md font-bold hover:bg-purple-700 transition-colors">
                    Connect Wallet
                </button>
            </div>

            <div v-else-if="!isOwner" class="bg-red-100 rounded-lg p-8 text-center mb-8">
                <p class="text-red-700 mb-4">Only the contract owner can access this panel</p>
                <p class="text-gray-700">Connected address: {{ userAccount }}</p>
                <p class="text-gray-700">Contract owner: {{ ownerAddress }}</p>
            </div>

            <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
                <div class="bg-purple-600 px-6 py-4">
                    <h2 class="text-xl font-bold text-white">Admin Functions</h2>
                </div>

                <div class="p-6 md:p-8">
                    <!-- Contract Stats -->
                    <div class="mb-8 p-4 bg-gray-50 rounded-lg">
                        <h3 class="text-lg font-bold mb-4">Contract Stats</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-gray-500">Current Supply</p>
                                <p class="font-bold">{{ currentSupply }} / {{ maxSupply }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Contract Balance</p>
                                <p class="font-bold">{{ contractBalance }} MATIC</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Mint Price</p>
                                <p class="font-bold">{{ mintPrice }} MATIC</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Base URI</p>
                                <p class="font-bold truncate" :title="baseURI">{{ baseURI || 'Not set' }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Withdraw Funds -->
                    <div class="mb-8 p-6 border border-gray-200 rounded-lg">
                        <h3 class="text-lg font-bold mb-4">Withdraw Funds</h3>

                        <div class="mb-4">
                            <div class="flex justify-between mb-2">
                                <span class="text-gray-600">Available Balance:</span>
                                <span class="font-bold">{{ contractBalance }} MATIC</span>
                            </div>
                        </div>

                        <button @click="withdrawFunds" :disabled="isWithdrawing || contractBalance <= 0"
                            class="w-full bg-purple-600 text-white px-6 py-3 rounded-md font-bold hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed">
                            {{ isWithdrawing ? 'Processing...' : 'Withdraw All Funds' }}
                        </button>

                        <div v-if="withdrawStatus" class="mt-4 p-3 rounded-md"
                            :class="withdrawStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                            {{ withdrawStatus.message }}
                        </div>
                    </div>

                    <!-- Set Base URI -->
                    <div class="p-6 border border-gray-200 rounded-lg">
                        <h3 class="text-lg font-bold mb-4">Set Token Base URI</h3>

                        <div class="mb-4">
                            <label for="baseURI" class="block text-sm font-medium text-gray-700 mb-2">New Base
                                URI</label>
                            <input type="text" id="baseURI" v-model="newBaseURI"
                                class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="https://your-api.com/metadata/" />
                            <p class="text-sm text-gray-500 mt-1">
                                Token ID and ".json" will be appended automatically
                            </p>
                        </div>

                        <button @click="setBaseURI" :disabled="isSettingURI || !newBaseURI"
                            class="w-full bg-purple-600 text-white px-6 py-3 rounded-md font-bold hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed">
                            {{ isSettingURI ? 'Processing...' : 'Update Base URI' }}
                        </button>

                        <div v-if="uriStatus" class="mt-4 p-3 rounded-md"
                            :class="uriStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                            {{ uriStatus.message }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { ethers } from 'ethers';
import { useWallet } from '../composable/useWallet';

const { connectWallet, userAccount, getContract, provider } = useWallet();

// Component state
const ownerAddress = ref('');
const currentSupply = ref(0);
const maxSupply = ref(10000);
const mintPrice = ref(0);
const contractBalance = ref(0);
const baseURI = ref('');
const newBaseURI = ref('');

// Action states
const isWithdrawing = ref(false);
const withdrawStatus = ref(null);
const isSettingURI = ref(false);
const uriStatus = ref(null);

// Computed properties
const isConnected = computed(() => Boolean(userAccount.value));
const isOwner = computed(() =>
    userAccount.value &&
    ownerAddress.value &&
    userAccount.value.toLowerCase() === ownerAddress.value.toLowerCase()
);

// Fetch contract data
const fetchContractData = async () => {
    if (!isConnected.value) return;

    try {
        const contract = await getContract();

        // Get owner
        ownerAddress.value = await contract.owner();

        // Get contract stats
        const supply = await contract.currentSupply();
        currentSupply.value = parseInt(supply);

        const price = await contract.mintPrice();
        mintPrice.value = parseFloat(ethers.utils.formatEther(price));

        // Get contract balance
        const balance = await provider.getBalance(contract.address);
        contractBalance.value = parseFloat(ethers.utils.formatEther(balance));

        // Try to get base URI (this might not work directly depending on implementation)
        try {
            // If there's a public getter (not in your contract though)
            // baseURI.value = await contract._TokenURI();

            // Alternative approach: check an existing token URI and extract the base
            if (currentSupply.value > 0) {
                const tokenURI = await contract.tokenURI(1);
                baseURI.value = tokenURI.replace('1.json', '');
            }
        } catch (error) {
            console.log('Could not fetch base URI directly');
        }

    } catch (error) {
        console.error('Error fetching contract data:', error);
    }
};

// Withdraw funds
const withdrawFunds = async () => {
    if (!isConnected.value || !isOwner.value) return;

    isWithdrawing.value = true;
    withdrawStatus.value = null;

    try {
        const contract = await getContract();
        const tx = await contract.withdraw();
        await tx.wait();

        withdrawStatus.value = {
            type: 'success',
            message: `Successfully withdrawn ${contractBalance.value} MATIC to owner account`
        };

        // Refresh data
        await fetchContractData();
    } catch (error) {
        console.error('Error withdrawing funds:', error);
        withdrawStatus.value = {
            type: 'error',
            message: `Failed to withdraw: ${error.message || 'Unknown error'}`
        };
    } finally {
        isWithdrawing.value = false;
    }
};

// Set base URI
const setBaseURI = async () => {
    if (!isConnected.value || !isOwner.value || !newBaseURI.value) return;

    isSettingURI.value = true;
    uriStatus.value = null;

    try {
        const contract = await getContract();
        const tx = await contract.setBaseURI(newBaseURI.value);
        await tx.wait();

        uriStatus.value = {
            type: 'success',
            message: `Successfully updated base URI to ${newBaseURI.value}`
        };

        baseURI.value = newBaseURI.value;
        newBaseURI.value = '';

    } catch (error) {
        console.error('Error setting base URI:', error);
        uriStatus.value = {
            type: 'error',
            message: `Failed to update base URI: ${error.message || 'Unknown error'}`
        };
    } finally {
        isSettingURI.value = false;
    }
};

// Watch for account changes
watch(userAccount, async () => {
    if (userAccount.value) {
        await fetchContractData();
    }
});

// Initialize component
onMounted(async () => {
    if (userAccount.value) {
        await fetchContractData();
    }
});
</script>