<template>
    <MainTabs :test="this.tbname"/>
</template>

<script>

import MainTabs from "./components/MainTabs";

export default {
  name: 'App',
  components: {
    MainTabs,
  },
  data () {
    return {
      tbname : this.$db.getCurrentTable()
    }
  }
}
</script>
