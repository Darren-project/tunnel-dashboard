<template>
  <h1>Tunnels</h1>
  <b-button @click="addtunnelopenModal">Add Tunnel</b-button>
  <b-modal v-model="addtunnelmodalOpen" title="Add Tunnel">
    <BOverlay :show="showOverlayaddtunnel" rounded="sm">
      <form>
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
      </form>
    </BOverlay>

    <template v-slot:ok>
      <b-button @click="addTunnel">Add tunnel</b-button>
    </template>
  </b-modal>
  <BOverlay :show="showOverlaytable" rounded="sm">
  <b-table :items="tunnelsTable" :fields="fields"></b-table>
  </BOverlay>
</template>

<script>
import axios from 'axios'
let firstfetch = true


export default {
  name: 'Dashboard',
  data() {
    return {
      tunnels: [],
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
      addtunnelmodalOpen: false,
      showOverlayaddtunnel: false,
      newTunnel: {
        name: '',
        host: '',
        target: ''
      },
      hostValidationState: null,
      nameValidationState: null,
      targetValidationState: null,
      showOverlaytable: false
    }
  },
  methods: {
    async fetchTunnels() {      
      this.showOverlaytable = true
      try {
        const accessToken = this.$auth.getAccessToken()
        const response = await axios.get("https://socksproxyapi.darrenmc.xyz/api/tunnels/list", {
          headers: {
            Authorization: accessToken
          }
        })
        this.tunnels = response.data

      } catch (error) {
        console.error("Error fetching tunnels:", error)
        this.showOverlaytable = false
      }
    },
    addtunnelopenModal() {
      this.addtunnelmodalOpen = true
    },
    async addTunnel() {
      this.showOverlayaddtunnel = true
      try {
        const accessToken = this.$auth.getAccessToken()
        await axios.post("https://socksproxyapi.darrenmc.xyz/api/tunnels/create/" + this.newTunnel.name, this.newTunnel, {
          headers: {
            Authorization: accessToken
          },
          body: {
            name: this.newTunnel.name,
            host: this.newTunnel.host,
            target: this.newTunnel.target
          }
        })
        console.log("Tunnel added successfully")
        this.newTunnel.name = ''
        this.newTunnel.host = ''
        this.newTunnel.target = ''
        this.fetchTunnels()
        this.showOverlayaddtunnel = false
        this.addtunnelmodalOpen = false
      } catch (error) {
        console.error("Error adding tunnel:", error)
        this.showOverlayaddtunnel = false
      }
    }
  },
errorHandler(error, vm, info) {
  console.log('errorCaptured', error, info)
  return false; // Prevents the error from propagating further
},
mounted() {
    try {
      
      if (firstfetch) {
        firstfetch = false
      this.fetchTunnels()
      } else {
        return;
      }
    } catch (error) {
      console.error("Error fetching tunnels:", error)
    }
  },
  computed: {
    tunnelsTable: {
      get() {
      // `this` points to the component instance
      return this.tunnels
    },
  }
  }
}
</script>