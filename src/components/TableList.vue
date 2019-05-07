<template>
    <div class="text-xs-right">
        <v-menu
                offset-y
        >
            <template #activator="{ on: menu }">
                <v-tooltip bottom>
                    <template #activator="{ on: tooltip }">
                        <v-btn
                                color="grey lighten-1"
                                dark
                                v-on="{ ...tooltip, ...menu }"
                                @click="getTables"
                        >Таблицы
                            <!--                                v-on="{ ...tooltip, ...menu }"-->
                        </v-btn>
                    </template>
                    <span>Выбрать таблицу или создать новую</span>
                </v-tooltip>
            </template>
            <v-list>
                <v-list-tile
                        v-for="(table, index) in tables"
                        :key="index"
                        @click=""
                >
                    <v-list-tile-title>{{ table.title }}</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
    import console from 'console';
    export default {
        name: "TableList",
        data() {
            return {
                tables: []
            }
        },
        methods: {
            getTables: function () {
                let tables = this.tables;
                this.$db.asyncGetAllTables().then(function (doc) {
                    for (let i in doc){
                        tables.push({title:doc[i]});
                    }
                }).catch(e => {console.log(e)})
            }
        }
    }
</script>

<style scoped>

</style>