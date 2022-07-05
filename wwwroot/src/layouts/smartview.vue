<template>
  <div class="app">
    <AppHeader fixed @change-company="changecompany()" />
    <div class="app-body">
      <SidebarSmartview :nav-items="nav" :actSmartview="SmartviewResult" fixed />
      <main class="main">
        <breadcrumb :list="list" />
        <div class="container-fluid">
          <DefaultPage v-if="page!=''" :SmartviewId="SmartviewId" :columns="Columns" :DefaultData="defaultData" :Page="page"></DefaultPage>
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
  SidebarSmartview,
  Aside as AppAside,
  Footer as AppFooter,
  Breadcrumb
  } from '~/components/'
  import loginServices from '../services/loginservices'
import DefaultPage from '../pages/smartview/default'

export default {
  name: 'Full',
  components: {
    AppHeader,
    SidebarSmartview,
    //AppAside,
    AppFooter,
    Breadcrumb,
    ChangeCompanyModal,
    DefaultPage
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
      nav: Array(),
      defaultData: Array(),
      page: '',
      Columns: Array(),
      SmartviewId: '',
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
      async SmartviewResult(id, name){
        this.page = ''
        var model = {
          SmartviewId: id
        }

        this.defaultData = [];
        this.Columns = [];

        await this.$store.dispatch(
          "features/report/smart_view/actGetDefaultSmartview",
          model
        );

        this.defaultData = this.$store.state.features.report.smart_view.defaultSmartview.Smartviews;
        this.Columns = this.$store.state.features.report.smart_view.defaultSmartview.Columns;

        this.page = name
        this.SmartviewId = id
      },
     showToast(message) {
      this.$bvToast.toast(message, {
        title: 'Login Verification',
        variant: 'danger',
        //toaster: 'b-toaster-bottom-center',
        autoHideDelay: 5000,
        appendToast: false
      })
    },
    async sideMenus() {
      var model = {
        SecurityRoleId: this.$store.state.roleaccess.SecurityRoleId
      }
      await this.$store.dispatch(
        "features/report/smart_view/actGetSmartvieByRoleId",
        model
      );
      //console.log(this.$store.state.features.report.smart_view.data)
      this.nav = Array(); //nav.items
      //let menus = this.$store.state.menu;
      let menus = this.$store.state.features.report.smart_view.data.Smartviews;
      console.log(menus)
      let sections = Array()
      for (let index = 0; index < menus.length; index++) {
        let menu = menus[index];
        this.nav.push({ name: util.toTitleCase(menu.SmartTitle), sql: menu.SqlViewName, id: menu.SmartviewId, icon: menu.Icon, badge: {variant: 'primary'}}); //'icon-speedometer'
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
            this.$store.state.token.replace('Bearer ', "")
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
