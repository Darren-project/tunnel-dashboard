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
  <h1>Tunnels</h1>
  <b-button @click="addtunnelopenModal">Add Tunnel</b-button>
  <BOverlay :show="showOverlayaddtunnel" rounded="sm">
  <b-modal v-model="addtunnelmodalOpen" title="Add Tunnel">
    <form @submit.prevent="addTunnel">
      <b-form-group label="Name" label-for="name-input" :state="nameValidationState">
        <b-form-input id="name-input" v-model="newTunnel.name" required></b-form-input>
        <b-form-invalid-feedback v-if="!newTunnel.name">Name is required.</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="Host" label-for="host-input" :state="hostValidationState">
        <b-form-input id="host-input" v-model="newTunnel.host" required></b-form-input>
        <b-form-invalid-feedback v-if="!newTunnel.host">Host is required.</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="Target" label-for="target-input" :state="targetValidationState">
        <b-form-input id="target-input" v-model="newTunnel.target" required></b-form-input>
        <b-form-invalid-feedback v-if="!newTunnel.target">Target is required.</b-form-invalid-feedback>
      </b-form-group>

      <b-button @click="addTunnel" type="submit" variant="primary">OK</b-button>
    </form>
    
  </b-modal>
  </BOverlay>
  <b-table :items="tunnels" :fields="fields"></b-table>

</template>

<script>
import axios from 'axios'
import { ref } from 'vue'

export default {
  name: 'Dashboard',
  data () {
    return {
      tunnels: ref([]),
      fields: [
        {
          key: 'name',
          label: 'Name'
        },
        {
          key: 'host',
          label: 'Host'
        },
        {
          key: 'target',
          label: 'Target'
        }
      ],
      addtunnelmodalOpen: ref(false),
      showOverlayaddtunnel: ref(false),
      newTunnel: ref({
        name: '',
        host: '',
        target: ''
      }),
      hostValidationState: null,
    }
  },
  async created () {
    const accessToken = this.$auth.getAccessToken()
    const response = await axios.get("https://socksproxyapi.darrenmc.xyz/api/tunnels/list", {
      headers: {
        Authorization: `${accessToken}`
      }
    })
    this.tunnels.value = response.data
  },
  methods: {
    addtunnelopenModal() {
      this.addtunnelmodalOpen.value = true
    },
    addTunnel() {
      this.showOverlayaddtunnel.value = true
      // Send data to server
      axios.post("https://socksproxyapi.darrenmc.xyz/api/tunnels/create/" + this.newTunnel.name, this.newTunnel, {
        headers: {
          Authorization: this.$auth.getAccessToken()
        },
        body: {
          name: this.newTunnel.value.name,
          host: this.newTunnel.value.host,
          target: this.newTunnel.value.target
        }
      })
      .then(response => {
        // Handle success
        console.log("Tunnel added successfully");
        // Close modal
        this.modalOpen.value = false;
        // Clear form fields
        this.newTunnel.value.name = '';
        this.newTunnel.value.host = '';
        this.newTunnel.value.target = '';
        const accessToken = this.$auth.getAccessToken()
        const response_list = axios.get("https://socksproxyapi.darrenmc.xyz/api/tunnels/list", {
          headers: {
            Authorization: `${accessToken}`
          }
        })
        this.tunnels.value = response_list.data
        this.showOverlayaddtunnel.value = false
      })
      .catch(error => {
        
      });
    }
  }
}
</script>
