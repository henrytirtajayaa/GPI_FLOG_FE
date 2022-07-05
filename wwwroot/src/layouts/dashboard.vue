<template>
  <div class="app">
    <AppHeader fixed @change-company="changecompany()" />
    <div class="app-body">
      <Sidebar :nav-items="nav" fixed />
      <main class="main">
        <breadcrumb :list="list" />
        <div class="container-fluid">
          <nuxt />
        </div>
      </main>
      <!--AppAside fixed /-->
    </div>
    <AppFooter />
    <ChangeCompanyModal ref="dlgChangeCompany" v-model="compSecId" @update-company="Updatecompany"></ChangeCompanyModal>
  </div> 
</template>

<script>
import nav from './menu'
import util from "../helper/utils";
import { ChangeCompanyModal } from "@/pages/modal/index.js";
import {
  Header as AppHeader,
  Sidebar,
  Aside as AppAside,
  Footer as AppFooter,
  Breadcrumb
  } from '~/components/'
  import loginServices from '../services/loginservices'

export default {
  name: 'Full',
  components: {
    AppHeader,
    Sidebar,
    //AppAside,
    AppFooter,
    Breadcrumb,
    ChangeCompanyModal
  },
  data() {
    return {
       state: {
        userId: '',
        name: '',
        email: '',
        role: '',
        token: '',
        menus: [],
        companySecurity: '',
        companyId: ''
      },
      compSecId: "",
      nav: Array()
    }
  },
  computed: {
    name() {
      return this.$route.name
    },
    list() {
      return this.$route.matched
    }
  },
    mounted() {
      if (localStorage.getItem( 'NewCompanyId') != null)
        sessionStorage.setItem( 'CompanyId', localStorage.getItem( 'NewCompanyId') ) 
    this.sideMenus()
  },
    methods: {
     showToast(message) {
      this.$bvToast.toast(message, {
        title: 'Login Verification',
        variant: 'danger',
        //toaster: 'b-toaster-bottom-center',
        autoHideDelay: 5000,
        appendToast: false
      })
    },
    sideMenus() {
      this.nav = Array(); //nav.items
      let menus = this.$store.state.menu; 

      let sections = Array()
      for (let index = 0; index < menus.length; index++) {
        let menu = menus[index];
        if (menu.Title) {
          if (menu.Items.length > 0) {
            //Section
            let children1 = [];
            for(let ci=0;ci<menu.Items.length;ci++){
              let child1 = menu.Items[ci];
              if(child1.Items.length > 0){
                  let children2 = [];
                  for(let i=0;i<child1.Items.length;i++){
                    let child2 = child1.Items[i];
                    children2.push({name: util.toTitleCase(child2.Title), url: child2.Href, icon: child2.Icon}); //'icon-pencil'
                  }

                  children1.push({ 
                  name: util.toTitleCase(child1.Title), url: child1.Href, icon: child1.Icon, //'icon-star'
                  badge: {variant: 'secondary'}, children : children2});
              }else{
                  children1.push({ name: util.toTitleCase(child1.Title), url: child1.Href, icon: child1.Icon, badge: {variant: 'default'}}); //'icon-compass'
              }
            }

            //ADD SECTION GROUP
            this.nav.push({ name: util.toTitleCase(menu.Title), url: menu.Href, icon: menu.Icon, wrapper: { element: '', attributes: {}}, children:children1}); //'icon-star'

          } else {
            //Direct Nav
            this.nav.push({ name: util.toTitleCase(menu.Title), url: menu.Href, icon: menu.Icon, badge: {variant: 'primary'}}); //'icon-speedometer'
          }
        }
      }
    },
    changecompany() {
     
      this.$refs.dlgChangeCompany
        .open(this.$store.state.listcompany,this.$store.state.companyId)
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
      async Updatecompany(compSecId) {
      
        if (compSecId != null) {
          var res = await loginServices.doLoginCompany(
            this.$store.state.user,
            compSecId,
            this.$store.state.token.replace('Bearer ', ""),
            this.$store.state.companyId
          )
          if (res.status == 200) {
            if (res.data.IsSuccess) {
             
              this.state.token = res.data.Token
              this.state.menus = res.data.Menus
              this.state.companySecurity = compSecId
              this.state.companyId = res.data.CompanyId
              localStorage.setItem( 'NewCompanyId', res.data.CompanyId );
              this.$store.dispatch('actSignIn', this.state)
              window.location.reload();
            } else {
              this.showToast(res.data.ErrorDescription)
            }
          } else {
            this.showToast(res.data.ErrorDescription)
          }
        } else {
          this.showToast('Please, choose a company from the list !')
        }
      
    },
    
  }
}
</script>
