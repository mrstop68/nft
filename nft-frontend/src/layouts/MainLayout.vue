<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
         Pazar Yeri Uygulaması
        </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
        </q-item-label>

      
        <router-link to="/marketplace" class="routerLink">
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="widgets" />
            </q-item-section>
            <q-item-section> NFT Sayfası </q-item-section>
          </q-item>
        </router-link>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  name: 'MainLayout'
});



const leftDrawerOpen = ref(false);

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
<style lang="sass">
.routerLink
  text-decoration: none
  color: inherit
  margin-top:8px

</style>