import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import MintPage from '../views/Mint.vue'
import AccessPage from '../views/AccessPage.vue'
import AdminPanel from '../views/AdminPanel.vue'
import { ethers } from 'ethers'
import { useWallet } from '../composable/useWallet';

const { userAccount, getContract } = useWallet();


const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/mint', name: 'Mint', component: MintPage },
  { path: '/admin', name: 'Admin', component: AdminPanel },
  { path: '/access', name: 'Access', meta: { requiresNFT: true }, component: AccessPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// router.beforeEach(async (to, from, next) => {

//   if (to.matched.some(record => record.meta.requiresNFT)) {
//     const contract = await getContract()
//     if (await hasGameNFT(userAccount.value, contract)) {
//       return next()
//     } else {
//       return next('/mint')
//     }
//   }

//   next()
// })

// async function hasGameNFT(userAddress, contract) {
//   try {
//     if (!userAddress) return false
//     return await contract.hasAccess(userAddress)
//   } catch (error) {
//     console.error('Error checking NFT access:', error)
//     return false
//   }
// }

export default router
