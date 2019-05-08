<template>
    <MainTabs/>
<!--    <v-toolbar app>-->
<!--      <v-toolbar-title class="headline text-uppercase">-->
<!--        <span>Помощник {{tbname}}</span>-->
<!--      </v-toolbar-title>-->
<!--      <v-spacer></v-spacer>-->
<!--      <TableList/>-->
<!--    </v-toolbar>-->

<!--    <v-content>-->
      <!--<Tabs/>-->
<!--      <ItemTable/>-->

<!--      <SimpleTable table-name="dressesToBuy"/>-->
<!--    </v-content>-->
</template>

<script>


import SimpleTable from "./components/SimpleTable";
import TableList from "./components/TableList";
import MainTabs from "./components/MainTabs";

export default {
  name: 'App',
  components: {
    // ItemTable
    MainTabs,
    TableList,
    SimpleTable
  },
  data () {
    return {
      tbname : this.$db.getCurrentTable()
      // tbname : db.getCurrentTable()
      // fpath: db.getFullTablePath()
    }
  }
}
</script>
