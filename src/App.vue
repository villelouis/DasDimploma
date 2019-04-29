<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Помощник</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <!--<Tabs/>-->
      <!--<ItemTable/>-->
      <SimpleTable table-name="dressesToBuy"/>
    </v-content>
  </v-app>
</template>

<script>
// import Tabs from "./components/Tabs";
// import ItemTable from "./components/ItemTable";
import SimpleTable from "./components/SimpleTable";

export default {
  name: 'App',
  components: {
    // ItemTable
    SimpleTable
  },
  data () {
    return {
    }
  }
}
</script>
