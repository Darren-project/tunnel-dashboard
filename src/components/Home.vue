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
  <div id="home">
    <h1 class="ui header">Welcome to the Tunnel Proxy Manager</h1>
    <div v-if="!authState || !authState.isAuthenticated">
      <p>If you‘re viewing this page then you have not authed.</p>
      <p>
        Once you have logged in you will be redirected through your authorization server (the issuer defined in config) to create a session for Single-Sign-On (SSO).
        After this you will be redirected back to the application with an ID token and access token. The tokens will be stored in local storage for future use.
      </p>
      <router-link
        id="login-button"
        class="ui primary button"
        role="button"
        to="/login"
      >
      Login
      </router-link>
    </div>

    <div v-if="authState && authState.isAuthenticated">
      <p>Welcome back, {{claims.name}}!</p>
      <p>
        You have successfully authenticated against your Okta org, and have been redirected back to this application.  You now have an ID token and access token in local storage.
        Visit the <a href="/dashboard">Dashboard</a> page to manage tunnels.
      </p>
  
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data: function () {
    return {
      claims: '',
    }
  },
  mounted () { this.setup() },
  methods: {
    async setup () {
      if (this.authState && this.authState.isAuthenticated) {
        this.claims = await this.$auth.getUser()
      }
    }
  }
}
</script>
