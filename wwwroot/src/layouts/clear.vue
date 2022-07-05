<template>
  <div>
    <nuxt/>
  </div>
</template>

<script>

import util from "../helper/utils";
//import loginServices from '../services/loginservices'

export default {
  name: 'Clear',
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
    },
    methods: {
     showToast(message) {
      this.$bvToast.toast(message, {
        title: 'Verification',
        variant: 'danger',
        //toaster: 'b-toaster-bottom-center',
        autoHideDelay: 5000,
        appendToast: false
      })
    },
    
  }
}
</script>

