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
    <b-table :items="tunnels" :fields="fields"></b-table>

</template>

<script>
import axios from 'axios'

export default {
  name: 'Dashboard',
  data () {
    return {
      "tunnels": [],
      "fields": [
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
      ]
    }
  },
  async created () {
      const accessToken = this.$auth.getAccessToken()
      const response = await axios.get("https://socksproxyapi.darrenmc.xyz/api/tunnels/list", {
        headers: {
          Authorization: `${accessToken}`
        }
  })
  this.tunnels = response.data
  }
}
</script>
