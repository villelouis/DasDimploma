<template>
    <v-app>
        <div class="test">{{test}}</div>
        <div>
            <v-toolbar title>
                <v-toolbar-side-icon
                        @click.stop="drawer = !drawer"
                ></v-toolbar-side-icon>
                <v-toolbar-title>Помощник</v-toolbar-title>
            </v-toolbar>
        </div>
        <v-layout
                wrap
                style="height: 200px;"
        >
            <v-navigation-drawer
                    v-model="drawer"
                    dark
                    absolute
                    temporary
            >
                <v-list class="pa-1">
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <img src="https://randomuser.me/api/portraits/men/85.jpg">
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title>John Leider</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>

                <v-list class="pt-0" dense>
                    <v-divider></v-divider>
                                        <v-list-tile
                                                v-for="item in items"
                                                :key="item.title"
                                                @click=""
                                                :to="item.route"
                                        >
                                            <v-list-tile-action>
                                                <v-icon>{{ item.icon }}</v-icon>
                                            </v-list-tile-action>

                                            <v-list-tile-content>
                                                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                            </v-list-tile-content>
                                        </v-list-tile>

                </v-list>

            </v-navigation-drawer>
            <v-flex>
                <router-view></router-view>
                <!--                <SimpleTable table-name="dressesToBuy"/>-->
            </v-flex>
        </v-layout>

    </v-app>
</template>

<script>

    export default {
        name: "MainTabs",
        props:['test'],
        data() {
            return {
                drawer: null,
                items: [
                    {title: this.getCurrentTable(), icon: 'dashboard',route:"/CurrentTable/dressesToBuy"},
                    {title: 'Выбрать таблицу', icon: 'question_answer',route:"/Tables"}
                ],
                mini: false,
                right: null,
            }
        },
        methods:{
            getCurrentTable: function(){
                return "Текущая таблица"
            }
        }
    }
</script>

<style scoped>

</style>