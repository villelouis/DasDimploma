<template>
    <MainTabs :test="this.getCurrentTable()"/>
</template>

<script>
    import console from 'console'
    import MainTabs from "./components/MainTabs";
    export default {
        name: 'App',
        components: {
            MainTabs,
        },
        data() {
            return {
                tbname: ""
            }
        },
        methods:{
            getCurrentTable(){
                this.$db.getCurrentTable([]).then((data)=>{
                    console.log(data);
                    this.tbname = data
                }).catch(e=>{console.log(e)});
                return this.tbname
            }
        }
    }
</script>
