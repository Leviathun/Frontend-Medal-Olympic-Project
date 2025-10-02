<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { mdiAccountPlus, mdiLogin } from '@mdi/js';
import { SpeedInsights } from '@vercel/speed-insights/vue';

import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <SpeedInsights />
  <div class="min-h-screen flex flex-col font-mono text-center text-[#EAEAEA] antialias animate-fade-in-down">
    <header>
      <div class="wrapper">

        <nav class="py-6 p-[30px] flex justify-between bg-white">
          <div class="flex justify-start items-center space-x-10">
            <RouterLink :to="{ name: 'medal-list-view' }"><img class="w-[90px]" src="./assets/logo.png" alt="Fake Olympics"></RouterLink>
            <RouterLink class="font-bold text-[#252A34]" exact-active-class="text-[#FF2E63]" :to="{ name: 'medal-list-view' }">MEDAL TABLE</RouterLink>
            <RouterLink class="font-bold text-[#252A34]" exact-active-class="text-[#FF2E63]" :to="{ name: 'about' }">ABOUT</RouterLink>
            <RouterLink class="font-bold text-[#252A34]" exact-active-class="text-[#FF2E63]" :to="{ name: 'users' }">USER LIST</RouterLink>
            <RouterLink class="font-bold text-[#252A34]" exact-active-class="text-[#FF2E63]" :to="{ name: 'manageCountry' }">MANAGE COUNTRY</RouterLink>
          </div>
          <div class="flex justify-start items-center space-x-10">
            <RouterLink v-if="!authStore.token && !authStore.isLoggingOut" class="font-bold text-[#252A34]" exact-active-class="text-[#FF2E63]" :to="{ name: 'login-register'}">Log In</RouterLink>
            <button v-else-if="authStore.token && !authStore.isLoggingOut" class="font-bold text-[#252A34]" @click="authStore.logout">Logout</button>
            <!-- ขณะ logout ให้ปุ่มหายไป -->
            <span v-else class="text-white">...</span>
          </div>
        </nav>
      </div>
    </header>
    
    <!-- Main content area -->
    <main class="flex-grow">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="py-2 w-full flex justify-center items-center bg-white">
      <h2 class="font-bold text-[#08D9D6] p-2 mb-0 text-center">@Team Shikanokonokonokokoshitantan</h2>
    </footer>
    
  </div>
</template>