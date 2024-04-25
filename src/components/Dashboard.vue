
<template>
  <div>
    <TunnelsView />
  </div>
</template>

<script>
import TunnelsView from './Tunnels.vue';

export default {
  name: 'Dashboard',
  components: {
    TunnelsView
  },
data() {
  return {}
},
mounted() {
  console.log('Dashboard component mounted');
}
}
</script>
