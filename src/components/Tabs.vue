<template>
    <div>
        <v-tabs
                v-model="active"
                color="green"
                dark
                slider-color="yellow"
        >
            <v-tab>
               Платья на покупку
            </v-tab>
            <v-tab-item>
                <v-card flat>
                   <ItemTable/>
                </v-card>
            </v-tab-item>

            <v-tab>
                Платья на прокат
            </v-tab>
            <v-tab-item>
                <v-card flat>
                    <ItemTable/>
                </v-card>
            </v-tab-item>

            <v-tab>
                Платки
            </v-tab>
            <v-tab-item>
                <v-card flat>
                    <ItemTable/>
                </v-card>
            </v-tab-item>

            <v-tab>
                Головные уборы
            </v-tab>
            <v-tab-item>
                <v-card flat>
                    <ItemTable/>
                </v-card>
            </v-tab-item>

            <v-tab>
                Украшения
            </v-tab>
            <v-tab-item>
                <v-card flat>
                    <ItemTable/>
                </v-card>
            </v-tab-item>
        </v-tabs>
    </div>
</template>

<script>
    import ItemTable from "./ItemTable";
    export default {
        data () {
            return {
                active: null,
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
            }
        },
        components:{
            ItemTable
        }
    }
</script>
