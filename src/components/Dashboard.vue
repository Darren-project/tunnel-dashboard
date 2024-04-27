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
        },
        {
          key: 'actions',
          label: 'Actions'
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
      showOverlaytable: false,
      deleteModalOpen: false,
      deleteName: '',
      showOverlaydeletetunnel: false,
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
        this.showOverlaytable = false


      } catch (error) {
        console.error("Error fetching tunnels:", error)
        this.showOverlaytable = false
      }
    },
    addtunnelopenModal() {
      this.addtunnelmodalOpen = true
    },
    deleteTunnelModal(name) {
      this.deleteName = name
      this.deleteModalOpen = true
    },
    async deleteTunnel() {
      try {
        this.showOverlaydeletetunnel = true
        const accessToken = this.$auth.getAccessToken()
        await axios.post("https://socksproxyapi.darrenmc.xyz/api/tunnels/delete/" + this.deleteName, null, {
          headers: {
            Authorization: accessToken
          }
        })
        console.log("Tunnel deleted successfully")
        this.deleteModalOpen = false
        this.showOverlaydeletetunnel = false
        this.fetchTunnels()
      } catch (error) {
        console.error("Error deleting tunnel:", error)
        this.showOverlaydeletetunnel = false
      }
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
beforeMount() {
      try {
      console.log("First fetch: ", firstfetch)
      if (firstfetch) {
        firstfetch = false
        this.fetchTunnels()
      } else {
        return true;
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

<template>
  <h1>Tunnels Editor</h1>
  <b-modal v-model="deleteModalOpen" title="Delete Tunnel">
    <BOverlay :show="showOverlaydeletetunnel" rounded="sm"></BOverlay>
    <p>Are you sure you want to delete this tunnel?</p>
    <template v-slot:ok>
      <b-button @click="deleteTunnel">Delete</b-button>
    </template>
  </b-modal>
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
      <b-button @click="addTunnel" :disabled="showOverlayaddtunnel">Add tunnel</b-button>
    </template>
  </b-modal>
  <BOverlay :show="showOverlaytable" rounded="sm">
  <b-table :items="tunnelsTable" :fields="fields">
    <template #cell(actions)="row">
      <b-button @click="deleteTunnelModal(row.item.name)">Delete</b-button>
      </template>
  </b-table>
  </BOverlay>
</template>