<template>
  <div class="app">
    <AppHeader fixed />
    <div class="app-body">
      <Sidebar 
        :nav-items="nav" 
        fixed />
      <main class="main">
        <breadcrumb :list="list"/>
        <div class="container-fluid">
          <nuxt />
        </div>
      </main>
      <!-- AppAside fixed/-->
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import nav from './menu'
import {
  Header as AppHeader,
  Sidebar,
  //AppAside as AppAside,
  Footer as AppFooter,
  Breadcrumb
} from '~/components/'

export default {
  name: 'Full',
  components: {
    AppHeader,
    Sidebar,
    //AppAside,
    AppFooter,
    Breadcrumb
  },
  data() {
    return {
      nav: nav.items
    }
  },
  computed: {
    name() {
      return this.$route.name
    },
    list() {
      return this.$route.matched
    }
  }
}
</script>

<style>
@media only screen and (max-width: 1024px) {
  .app{
    font-size:80%;
  }

  .app input{
      font-size:10px;
    }

  .app select{
    font-size:10px;
  }

  .app textarea{
    font-size: 10px;
  }

  .app button{
    padding:3px 5px 3px 5px;
    font-size:10px;
  }
  
}

@media only screen and (max-width: 290px) {
  /* .app{
    display:none;
  } */
}
</style>

