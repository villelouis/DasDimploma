<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Помощник {{tbname}}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <TableList/>
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
// const console = require('console');
import SimpleTable from "./components/SimpleTable";
import TableList from "./components/TableList";
import TableManager from "./database/TableManager"

let db = new TableManager('URA');
export default {
  name: 'App',
  components: {
    // ItemTable
    TableList,
    SimpleTable
  },
  data () {
    return {
      tbname : db.getCurrentTable()
      // fpath: db.getFullTablePath()
    }
  }
}
</script>
