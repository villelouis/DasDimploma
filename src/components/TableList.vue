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
                        >Таблицы</v-btn>
                    </template>
                    <span>Выбрать таблицу или создать новую</span>
                </v-tooltip>
            </template>
            <v-list>
                <v-list-tile
                        v-for="(item, index) in items"
                        :key="index"
                        @click=""
                >
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
    export default {
        name: "TableList",
        data: () => ({
            items: [
                { title: 'Click Me1hjjjjjjjjjjjjjjjjjjjjjjjjjjjj'},
                { title: 'Click Me2' },
                { title: 'Click Me3' },
                { title: 'Click Me4' }
            ]
        })
    }
</script>

<style scoped>

</style>