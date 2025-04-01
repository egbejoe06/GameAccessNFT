<template>
    <div>
        <!-- Hero Section -->
        <section class="relative bg-purple-900 text-white">
            <div class="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-900 opacity-90"></div>
            <div class="relative container mx-auto px-4 py-24 md:py-32">
                <div class="max-w-3xl">
                    <h1 class="text-4xl md:text-6xl font-bold mb-6">
                        Unlock Exclusive Games with our NFT Collection
                    </h1>
                    <p class="text-xl md:text-2xl mb-8">
                        Mint our exclusive NFT to gain access to premium Unreal Engine games.
                        Be part of a new gaming experience.
                    </p>
                    <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <router-link to="/mint"
                            class="bg-white text-purple-900 px-8 py-3 rounded-md font-bold hover:bg-purple-100 transition-colors text-center">
                            Mint an NFT Key
                        </router-link>
                        <router-link to="/access"
                            class="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-bold hover:bg-white hover:text-purple-900 transition-colors text-center">
                            Access Games
                        </router-link>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="py-16 bg-white">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold text-center mb-12">How It Works</h2>

                <div class="grid md:grid-cols-3 gap-8">
                    <div class="bg-gray-50 p-6 rounded-lg shadow-md">
                        <div
                            class="bg-purple-100 text-purple-800 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold mb-2">1. Mint an NFT</h3>
                        <p class="text-gray-600">
                            Connect your wallet and mint one of our exclusive NFT keys on the Polygon network.
                        </p>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg shadow-md">
                        <div
                            class="bg-purple-100 text-purple-800 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold mb-2">2. Verify Ownership</h3>
                        <p class="text-gray-600">
                            Our platform verifies that you own an NFT from our collection via wallet authentication.
                        </p>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg shadow-md">
                        <div
                            class="bg-purple-100 text-purple-800 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold mb-2">3. Play Exclusive Games</h3>
                        <p class="text-gray-600">
                            Access our library of high-quality Unreal Engine games, playable directly in your browser.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Collection Preview -->
        <section class="py-16 bg-gray-100">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold text-center mb-4">NFT Collection Preview</h2>
                <p class="text-gray-600 text-center max-w-2xl mx-auto mb-12">
                    Our exclusive 10,000 NFT collection featuring unique digital keys to unlock a world of gaming.
                </p>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div v-for="i in 4" :key="i" class="bg-white rounded-lg overflow-hidden shadow-md">
                        <div class="bg-gradient-to-br from-purple-400 to-indigo-600 aspect-square"></div>
                        <div class="p-4">
                            <h3 class="font-bold mb-1">Game Key #{{ 1000 + i }}</h3>
                            <p class="text-gray-600 text-sm">Unique access token</p>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-10">
                    <router-link to="/mint"
                        class="inline-block bg-purple-600 text-white px-6 py-3 rounded-md font-bold hover:bg-purple-700 transition-colors">
                        View Collection
                    </router-link>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: 'HomePage'
}
</script>