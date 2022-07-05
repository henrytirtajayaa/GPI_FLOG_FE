<template>
  <header class="app-header navbar">
    <button 
      class="navbar-toggler mobile-sidebar-toggler d-lg-none" 
      type="button" 
      @click="mobileSidebarToggle" >
      <span class="navbar-toggler-icon" />
    </button>
    <b-link 
      class="navbar-brand" 
      to="/dashboard" />
    <button 
      class="navbar-toggler sidebar-toggler d-md-down-none" 
      type="button" 
      @click="sidebarToggle" >
      <span class="navbar-toggler-icon" />
    </button>
    <!--b-navbar-nav class="d-md-down-none">
      <b-nav-item class="px-3">Dashboard</b-nav-item>
      <b-nav-item class="px-3">Users</b-nav-item>
      <b-nav-item class="px-3">Settings</b-nav-item>
    </b-navbar-nav-->
    <b-navbar-nav>
      <span style="color:#000;" class="headerText"><b>{{this.$store.state.companyName}}</b></span>     
    </b-navbar-nav>

    <b-navbar-nav class="ml-auto">
    <span class="hideText"><b>{{ appDate }}</b></span>
       
      <!--b-nav-item class="d-md-down-none">
        <i class="icon-bell"/>
        <b-badge 
          pill 
          variant="danger">
          5
        </b-badge>
      </b-nav-item -->
      <!--b-nav-item class="d-md-down-none">
        <i class="icon-list"/>
      </b-nav-item -->
      <!--b-nav-item class="d-md-down-none">
        <i class="icon-location-pin"/>
      </b-nav-item-->
      <HeaderDropdown @change-company="changecompany()"/>
    </b-navbar-nav>
    <!--button 
      class="navbar-toggler aside-menu-toggler d-md-down-none" 
      type="button" 
      @click="asideToggle" >
      <span class="navbar-toggler-icon" />
    </button -->
  </header>
</template>

<script>
import moment from "moment";
import HeaderDropdown from './HeaderDropdown.vue';

export default {
  name: 'CHeader',
  components: {
    HeaderDropdown
  },
  props: {
    fixed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      appDate : moment().format('dddd, DD MMMM YYYY')
    };
  },
  mounted: function() {
    this.isFixed(this.fixed)
  },
  methods: {
    moment: function () {
      return moment();
    },
    isFixed(fixed) {
      fixed
        ? document.body.classList.add('header-fixed')
        : document.body.classList.remove('header-fixed')
      return fixed
    },
    sidebarToggle(e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-hidden')
    },
    sidebarMinimize(e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-minimized')
    },
    mobileSidebarToggle(e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-mobile-show')
    },
    asideToggle(e) {
      e.preventDefault()
      document.body.classList.toggle('aside-menu-hidden')
    },
    changecompany(e) {
      this.$emit('change-company');
    }
  }
}
</script>

<style scoped>
@media only screen and (max-width: 420px) {
  .hideText{
    display: none;
  }

  .headerText{
    font-size: 8px;
  }
}
</style>
