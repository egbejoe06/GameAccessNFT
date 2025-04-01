<template>
    <div class="container mx-auto px-4 py-12">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-3xl font-bold mb-6 text-center">Mint Your Game Access NFT</h1>

            <div v-if="!isConnected" class="bg-gray-100 rounded-lg p-8 text-center mb-8">
                <p class="text-gray-700 mb-4">Please connect your wallet to mint an NFT</p>
                <button @click="connectWallet"
                    class="bg-purple-600 text-white px-6 py-3 rounded-md font-bold hover:bg-purple-700 transition-colors">
                    Connect Wallet
                </button>
            </div>

            <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
                <div class="p-6 md:p-8 md:flex">
                    <div class="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                        <div
                            class="bg-gradient-to-br from-purple-400 to-indigo-600 aspect-square rounded-lg flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-white opacity-80" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h2 class="text-xl font-bold mb-2">Game Access NFT</h2>
                        <p class="text-gray-600 mb-4">
                            This NFT grants you access to our exclusive collection of Unreal Engine games.
                            Each token is unique and stored on the Polygon blockchain.
                        </p>
                        <div class="flex items-center mb-4">
                            <div class="mr-4">
                                <p class="text-sm text-gray-500">Price</p>
                                <p class="font-bold">{{ nftPrice }} MATIC</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Available</p>
                                <p class="font-bold">{{ availableSupply }} / {{ totalSupply }}</p>
                            </div>
                        </div>
                        <div v-if="hasMinted" class="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
                            You have already minted this NFT!
                        </div>
                    </div>

                    <div class="md:w-1/2 bg-gray-50 p-6 rounded-lg">
                        <h3 class="text-lg font-bold mb-4">Mint Your NFT</h3>

                        <div class="mb-6">
                            <div class="flex justify-between mb-2">
                                <span class="text-gray-600">Price:</span>
                                <span class="font-bold">{{ nftPrice }} MATIC</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Gas Fee (est.):</span>
                                <span>~0.001 MATIC</span>
                            </div>
                        </div>

                        <button @click="mintNFT" :disabled="isMinting || hasMinted"
                            class="w-full bg-purple-600 text-white px-6 py-3 rounded-md font-bold hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed">
                            {{ isMinting ? 'Minting...' : (hasMinted ? 'Already Minted' : 'Mint Now') }}
                        </button>

                        <div v-if="mintingStatus" class="mt-4 p-3 rounded-md"
                            :class="mintingStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                            {{ mintingStatus.message }}
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

const { connectWallet, userAccount, getContract } = useWallet();

// Component state
const nftPrice = ref(0.0001);  // MATIC price per NFT (matches contract)
const totalSupply = ref(10000); // MAX_SUPPLY from contract
const availableSupply = ref(0);
const isMinting = ref(false);
const mintingStatus = ref(null);
const hasMinted = ref(false);
const nftMetadata = ref(null);

// Computed properties
const isConnected = computed(() => Boolean(userAccount.value));

// const fetchNFTMetadata = async () => {
//     if (!isConnected.value) return;

//     try {
//         const contract = await getContract();
//         const tokenURI = await contract.tokenURI(1);
//         console.log('Token URI:', tokenURI);

//         console.log("tokenUri is ", tokenURI)
//         // Fetch the metadata from the IPFS gateway URL
//         const response = await fetch(tokenURI);

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         console.log("response is ", response)
//         const metadata = await response.json();
//         console.log('NFT Metadata:', metadata);

//         // Store the full metadata in the ref
//         nftMetadata.value = metadata;
//         console.log(nftMetadata.value)

//         // Now you can access all properties from metadata
//         // For example: metadata.name, metadata.description, metadata.image, metadata.attributes, etc.
//     } catch (error) {
//         console.error('Error fetching NFT metadata:', error);
//         mintingStatus.value = {
//             type: 'error',
//             message: `Failed to fetch NFT metadata: ${error.message || 'Unknown error'}`
//         };
//     }
// };

// Fetch contract data
const fetchContractData = async () => {
    if (!isConnected.value) return;

    try {
        const contract = await getContract();
        const currentSupply = await contract.currentSupply();
        const price = await contract.mintPrice();

        // Check if user has already minted
        if (userAccount.value) {
            hasMinted.value = await contract.hasMinted(userAccount.value);
        }

        availableSupply.value = totalSupply.value - parseInt(currentSupply);
        nftPrice.value = parseFloat(ethers.utils.formatEther(price));
    } catch (error) {
        console.error('Error fetching contract data:', error);
    }
};

// Mint NFT function
const mintNFT = async () => {
    if (!isConnected.value) {
        await connectWallet();
        return;
    }

    if (hasMinted.value) {
        mintingStatus.value = {
            type: 'error',
            message: 'You have already minted this NFT'
        };
        return;
    }

    isMinting.value = true;
    mintingStatus.value = null;

    try {
        const contract = await getContract();
        const price = ethers.utils.parseEther(nftPrice.value.toString());
        const tx = await contract.mint({ value: price });
        await tx.wait();

        mintingStatus.value = {
            type: 'success',
            message: `Successfully minted your Game Access NFT!`
        };

        hasMinted.value = true;

        // Refresh contract data after minting
        await fetchContractData();
    } catch (error) {
        console.error('Error minting NFT:', error);
        mintingStatus.value = {
            type: 'error',
            message: `Failed to mint: ${error.message || 'Unknown error'}`
        };
    } finally {
        isMinting.value = false;
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
        await fetchNFTMetadata();
    }
});
</script>