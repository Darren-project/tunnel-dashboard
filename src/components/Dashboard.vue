//ts-ignore
<script>
import axios from 'axios'

export default {
  inject: ['API_URL'],
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
      edititems: '',
      edittunnelmodalOpen: false,
      showOverlayedittunnel: false,
      editname: '',
      serverStatus: '🔃 Loading Status ...',
      serverRunning: false,
      statusFetching: false,
      showOverlayserverStatus: false
    }
  },
  methods: {
    async fetchServerStatus() {
      this.serverStatus = '🔃 Loading Status ...'
      try {
        this.statusFetching = true
        this.showOverlayserverStatus = true
        const response = await axios.get("https://" + this.API_URL + "/")
        if (response.data.status == "state.tunnel.running") {
          this.serverStatus = '✅ Server is running'
          this.serverRunning = true
        } else {
          this.serverStatus = '❌ Server is not running'
          this.serverRunning = false
        }
        this.statusFetching = false
        this.showOverlayserverStatus = false
      } catch (error) {
        console.error("Error fetching server status:", error)
        this.$toast.error('Error fetching server status');
        this.statusFetching = false
        this.showOverlayserverStatus = false
      }
    },
    async fetchTunnels() {      
      this.showOverlaytable = true
      try {
        const accessToken = this.$auth.getAccessToken()
        const response = await axios.get("https://" + this.API_URL + "/api/tunnels/list", {
          headers: {
            Authorization: accessToken
          }
        })
        this.tunnels = response.data
        this.showOverlaytable = false


      } catch (error) {
        console.error("Error fetching tunnels:", error)
        this.$toast.error('Error fetching tunnels');
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
    editTunnelModal(item) {
      this.edititems = Object.assign({}, item)
      this.editname = item.name
      this.edittunnelmodalOpen = true
    },
    async editTunnel() {
        this.showOverlayedittunnel = true
      try {
        const accessToken = this.$auth.getAccessToken()
        if(this.edititems.name == '' || this.edititems.host == '' || this.edititems.target == '') {
          this.$toast.error('Error editing tunnel: Invalid data');
          this.showOverlayedittunnel = false
          return;
        }
        await axios.post("https://" + this.API_URL + "/api/tunnels/edit/" + this.editname, this.edititems, {
          headers: {
            Authorization: accessToken
          },
          body: {
            name: this.edititems.name,
            host: this.edititems.host,
            target: this.edititems.target
          }
        })
        console.log("Tunnel edited successfully")
        this.$toast.success('Tunnel edited successfully');
        this.edititems.name = ''
        this.edititems.host = ''
        this.edititems.target = ''
        this.fetchTunnels()
        this.showOverlayedittunnel = false
        this.edittunnelmodalOpen = false
      } catch (error) {
        console.error("Error editing tunnel:", error)
        this.showOverlayedittunnel = false
        const { status } = error.response.data;
        if(status == "state.tunnel.edit.invalid.duplicate") {
          this.$toast.error('Error editing tunnel: Duplicate');
        }
        if(status == "state.tunnel.edit.invalid.data") {
          this.$toast.error('Error editing tunnel: Invalid data');
        }
        }
    },
    async deleteTunnel() {
      try {
        this.showOverlaydeletetunnel = true
        const accessToken = this.$auth.getAccessToken()
        await axios.post("https://" + this.API_URL + "/api/tunnels/delete/" + this.deleteName, null, {
          headers: {
            Authorization: accessToken
          }
        })
        console.log("Tunnel deleted successfully")
        this.$toast.success('Tunnel deleted successfully');
        this.deleteModalOpen = false
        this.showOverlaydeletetunnel = false
        this.fetchTunnels()
      } catch (error) {
        console.error("Error deleting tunnel:", error)
        this.$toast.error('Error deleting tunnel');
        this.showOverlaydeletetunnel = false
        this.deleteModalOpen = false
      }
    },
    async addTunnel() {
      this.showOverlayaddtunnel = true
      try {
        const accessToken = this.$auth.getAccessToken()
        if(this.newTunnel.name == '' || this.newTunnel.host == '' || this.newTunnel.target == '') {
          this.$toast.error('Error adding tunnel: Invalid data');
          this.showOverlayaddtunnel = false
          return;
        }
        await axios.post("https://" + this.API_URL + "/api/tunnels/create/" + this.newTunnel.name, this.newTunnel, {
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
        this.$toast.success('Tunnel added successfully');
        this.newTunnel.name = ''
        this.newTunnel.host = ''
        this.newTunnel.target = ''
        this.fetchTunnels()
        this.showOverlayaddtunnel = false
        this.addtunnelmodalOpen = false
      } catch (error) {
        console.error("Error adding tunnel:", error)
        this.showOverlayaddtunnel = false
        const { status } = error.response.data;
        if(status == "state.tunnel.create.invalid.duplicate") {
          this.$toast.error('Error adding tunnel: Duplicate');
        }
        if(status == "state.tunnel.create.invalid.data") {
          this.$toast.error('Error adding tunnel: Invalid data');
        }
        }
      },
      async stopServer() {
        try {
          this.serverStatus = '🔃 Stopping Server ...'
          this.showOverlayserverStatus = true
          const accessToken = this.$auth.getAccessToken()
          await axios.post("https://" + this.API_URL + "/api/tunnels/stop", null, {
            headers: {
              Authorization: accessToken
            }
          })
          console.log("Server stopped successfully")
          this.$toast.success('Server stopped successfully');
          this.fetchServerStatus() 
        } catch (error) {
          console.error("Error stopping server:", error)
          this.$toast.error('Error stopping server');
          this.showOverlayserverStatus = false
          this.fetchServerStatus()
  
        }
      },
        async restartServer() {
        try {
          this.serverStatus = '🔃 Restarting Server ...'
          this.showOverlayserverStatus = true
          const accessToken = this.$auth.getAccessToken()
          await axios.post("https://" + this.API_URL + "/api/tunnels/restart", null, {
            headers: {
              Authorization: accessToken
            }
          })
          console.log("Server restarted successfully")
          this.$toast.success('Server restarted successfully');
          this.fetchServerStatus() 
        } catch (error) {
          console.error("Error restarting server:", error)
          this.$toast.error('Error restarting server');
          this.showOverlayserverStatus = false
  
        }
      },
      async startServer() {
        try {
          this.serverStatus = '🔃 Starting Server ...'
          this.showOverlayserverStatus = true
          const accessToken = this.$auth.getAccessToken()
          await axios.post("https://" + this.API_URL + "/api/tunnels/start", null, {
            headers: {
              Authorization: accessToken
            }
          })
          console.log("Server started successfully")
          this.$toast.success('Server started successfully');
          this.fetchServerStatus() 
        } catch (error) {
          console.error("Error starting server:", error)
          this.$toast.error('Error starting server');
          this.showOverlayserverStatus = false
  
        }
      },
  },
beforeMount() {
      try {
        this.fetchServerStatus()
        this.fetchTunnels()
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
  <BToastOrchestrator />
  <b-modal v-model="edittunnelmodalOpen" :title="'Editing ' + this.editname">
    <BOverlay :show="showOverlayedittunnel" rounded="sm">
      <form>
        <b-form-group label="Name" label-for="name-input" :state="nameValidationState">
          <b-form-input id="name-input" v-model="edititems.name" required></b-form-input>
          <b-form-invalid-feedback v-if="!edititems.name">Name is required.</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group label="Host" label-for="host-input" :state="hostValidationState">
          <b-form-input id="host-input" v-model="edititems.host" required></b-form-input>
          <b-form-invalid-feedback v-if="!newTunnel.host">Host is required.</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group label="Target" label-for="target-input" :state="targetValidationState">
          <b-form-input id="target-input" v-model="edititems.target" required></b-form-input>
          <b-form-invalid-feedback v-if="!edititems.target">Target is required.</b-form-invalid-feedback>
        </b-form-group>
      </form>
    </BOverlay>

    <template v-slot:ok>
      <b-button @click="editTunnel" :disabled="showOverlayedittunnel" variant="primary">Save tunnel</b-button>
    </template>
  </b-modal>
  <b-modal v-model="deleteModalOpen" :title="'Deleting ' + this.deleteName ">
    <BOverlay :show="showOverlaydeletetunnel" rounded="sm">
    <p>Are you sure you want to delete <b> {{ this.deleteName }} </b></p>
  </BOverlay>
    <template v-slot:ok>
      <b-button :disabled="showOverlaydeletetunnel" @click="deleteTunnel" variant="danger">Delete</b-button>
    </template>
  </b-modal>


  <b-button :disabled="showOverlaytable" @click="addtunnelopenModal" variant="primary">Add Tunnel</b-button>
  &nbsp;
  <b-button :disabled="showOverlaytable" @click="fetchTunnels" variant="primary">Refresh</b-button>

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
      <b-button @click="addTunnel" :disabled="showOverlayaddtunnel" variant="primary">Add tunnel</b-button>
    </template>
  </b-modal>
  <BOverlay :show="showOverlaytable" rounded="sm">
  <b-table :items="tunnelsTable" :fields="fields">
    <template #cell(actions)="row">
      <b-button @click="deleteTunnelModal(row.item.name)" variant="danger">Delete</b-button>
      &nbsp;
      <b-button @click="editTunnelModal(row.item)" variant="primary">Edit</b-button>
      </template>
  </b-table>
  </BOverlay>

<h1>Server Status</h1>
<br>
<BOverlay :show="showOverlayserverStatus" rounded="sm">
{{ serverStatus }} &nbsp; <b-button :disabled="statusFetching" @click="fetchServerStatus" variant="primary">Refresh</b-button>
<br>
<br>
<h5>Server Actions</h5>
<template v-if="serverRunning">
  <b-button @click="stopServer" variant="danger">Stop</b-button>
      &nbsp;
      <b-button @click="restartServer" variant="primary">Restart</b-button>
</template>
<template v-else>
  <b-button @click="startServer" variant="primary">Start</b-button>
</template>
</BOverlay>
<br>
</template>
