<template>
  <q-layout view="lHh Lpr lFf">
    <div class="q-electron-drag app-bar">
      <div class="title-container">
        <span class="gilroy-extra-bold">LOA<span class="gilroy-light"> DETAILS </span></span>
        <span style="font-size: 10px; margin-left: 4px">
          v{{ settingsStore.settings.appVersion }}
        </span>
      </div>

      <div class="middle-bar">

        <div class="middle-bar-sep"></div>

          <!-- Home -->
          <router-link :to="{ path: '/' }" custom v-slot="{ href, navigate }">
            <div class="middle-bar-item q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--dense" :class="{ active: route.path === '/' }" :href="href"  @click="navigate">
              <q-icon name="home" />
              <q-tooltip>Home</q-tooltip>
            </div>
          </router-link>

          <!-- Logs -->
          <router-link :to="{ path: '/logs' }" custom v-slot="{ href, navigate }">
            <div class="middle-bar-item q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--dense" :class="{ active: route.path === '/logs' }" :href="href" @click="navigate">
              <q-icon name="query_stats" />
              <q-tooltip>Logs</q-tooltip>
            </div>
          </router-link>

          <!-- Settings -->
          <router-link :to="{ path: '/settings' }" custom v-slot="{ href, navigate }">
            <div class="middle-bar-item q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--dense" :class="{ active: route.path === '/settings' }" :href="href" @click="navigate">
              <q-icon name="settings" />
              <q-tooltip>Settings</q-tooltip>
            </div>
          </router-link>

          <!-- Wiki -->
          <div class="middle-bar-item q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--dense" @click="openWiki">
            <q-icon name="fa-brands fa-github" />
            <q-tooltip>Wiki</q-tooltip>
          </div>

          <!-- Discord -->
          <div class="middle-bar-item q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--dense" @click="openDiscord">
            <q-icon name="fa-brands fa-discord" />
            <q-tooltip>Discord</q-tooltip>
          </div>

          <!-- Patreon -->
          <div class="middle-bar-item patreon q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--dense" @click="openPatreon" style="margin-left: auto">
            <q-icon name="fa-brands fa-patreon" style="color: #f1465a" />
            <span>Support Us!</span>
            <q-tooltip>Patreon</q-tooltip>
          </div>

      </div>

      <div class="right-bar">
        <q-btn dense flat icon="ti-minus" @click="minimize" />
        <q-btn dense flat icon="ti-control-stop" @click="toggleMaximize" />
        <q-btn dense flat icon="ti-close" @click="closeApp" />
      </div>

    </div>

    <div class="q-page-container">
      <router-view />
    </div>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useSettingsStore } from "src/stores/settings";
import { useRoute } from "vue-router";
import { Settings } from "src-electron/util/app-settings";

const settingsStore = useSettingsStore();

const route = useRoute();

function minimize() {
  if (process.env.MODE === "electron") {
    window.windowControlApi.minimize();
  }
}

function toggleMaximize() {
  if (process.env.MODE === "electron") {
    window.windowControlApi.toggleMaximize();
  }
}

function closeApp() {
  if (process.env.MODE === "electron") {
    let hideToTray = true; // On by default
    if (settingsStore?.settings?.general?.closeToSystemTray === false)
      hideToTray = false;

    if (hideToTray) window.windowControlApi.hide();
    else window.windowControlApi.close();
  }
}

function openPatreon() {
  window.messageApi.send("window-to-main", {
    message: "open-link",
    value: "https://patreon.com/Herysia",
  });
}
function openDiscord() {
  window.messageApi.send("window-to-main", {
    message: "open-link",
    value: "https://discord.gg/C3fr3EBXbS",
  });
}
function openWiki() {
  window.messageApi.send("window-to-main", {
    message: "open-link",
    value: "https://github.com/lost-ark-dev/loa-details/wiki",
  });
}

onMounted(() => {
  settingsStore.initSettings();

  window.messageApi.receive("on-settings-change", (value: Settings) => {
    settingsStore.loadSettings(value);
  });
  window.messageApi.send("window-to-main", { message: "get-settings" });
});
</script>

<style>
.drawer-background {
  z-index: 2000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #111519b3;
}
.q-page-container {
  background: #1c2127;
}

.drawer-container {
  margin-top: 48px;
}
.drawer-container .close-button {
  margin-left: 32px;
}

.app-bar {
  display: flex;
  font-size: 16px;
  align-items: center;
  padding: 0 12px;
  padding-top: 1px;
  justify-content: space-between;
  background: #121519;
  color: #a0a1a3;
  height: 32px;
}

.app-bar .q-btn {
  color: #898a8c;
  font-size: 10px;
}
.app-bar .q-btn:hover {
  color: #fff;
}
.app-bar .q-btn .q-focus-helper {
  opacity: 0 !important;
}
.app-bar .right-bar {
  display: flex;
  align-items: center;
  justify-content: center;
}
.app-bar .right-bar .q-btn {
  margin-left: 8px;
}
.app-links {
  background: #161a1f;
  padding: 16px 32px 16px 16px;
  font-family: "gilroy light";
  font-size: 16px;
  letter-spacing: 1px;
  color: #b1d063;
  font-weight: bold;
}
.app-links .link-item:hover {
  color: #edfcb1;
  cursor: pointer;
}
.app-links .link-item.active {
  color: #fff;
}
.app-links .q-icon {
  padding-bottom: 3px;
}
</style>
