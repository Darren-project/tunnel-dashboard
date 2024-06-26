/*!
 * Copyright (c) 2018, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

<template>
  <div id="app">
    <div class="ui inverted top fixed menu">
      <div class="ui container">
        <router-link
          to="/"
          class="header item"
        >
          <img
            class="ui mini image"
            src="./assets/logo.png"
          >
          &nbsp;
          Tunnel Manager
        </router-link>
        <router-link
          to="/login"
          class="item"
          v-if="authState && !authState.isAuthenticated"
        >
        Login
        </router-link>
        <router-link
          to="/dashboard"
          class="item"
          id="messages-button"
          v-if="authState && authState.isAuthenticated"
        >
          <i
            aria-hidden="true"
            class="outline"
          >
          </i>
          Dashboard
        </router-link>
        <router-link
          to="/profile"
          class="item"
          id="profile-button"
          v-if="authState && authState.isAuthenticated"
        >
        Profile
        </router-link>
        <a
          id="logout-button"
          class="item"
          v-if="authState && authState.isAuthenticated"
          v-on:click="logout()"
        >
        Logout
        </a>
      </div>
    </div>
    <div
      class="ui text container"
      style="margin-top: 7em;"
    >
      <router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component" />
  </keep-alive>
</router-view>
    </div>
    <AuthRequiredModal ref="authRequiredModal" />
  </div>
  
</template>

<script>
import AuthRequiredModal from './components/AuthRequiredModal.vue';
import router from './router';
export default {
  name: 'app',
  components: {
    AuthRequiredModal,
  },
  mounted() {
    document.title = 'Tunnel Manager'
  },
  methods: {
    onAuthRequired(oktaAuth) {
      if (!oktaAuth.authStateManager.getPreviousAuthState()?.isAuthenticated) {
        // App initialization stage
        router.push('/login');
      } else {
        // Ask the user to trigger the login process during token autoRenew process
        this.$refs.authRequiredModal.showModal();
      }
    },
    async logout () {
      const publicPath = this.$route.href.replace(new RegExp(this.$route.fullPath + '$'), '');
      await this.$auth.signOut({ postLogoutRedirectUri: `${window.location.origin}${publicPath}` })
    }
  }
}
</script>
