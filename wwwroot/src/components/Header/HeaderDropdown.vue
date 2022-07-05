<template>
  <b-nav-item-dropdown 
    right 
    no-caret >
    <template slot="button-content">
      <img 
        src="~static/img/avatars/user.jpg" 
        class="img-avatar" 
        :alt="this.$store.state.email" >
    </template>
    <b-dropdown-header 
      tag="div" 
      class="text-center" >
      <strong>{{this.$store.state.name}}</strong>
    </b-dropdown-header>
    <!-- <b-dropdown-item>
      <b-icon-star></b-icon-star>
      My Tasks<b-badge variant="danger">{{ itemsCount }}</b-badge>
    </b-dropdown-item>
    <b-dropdown-item>
      <b-icon icon="bell-fill" class="border rounded"></b-icon>
      Updates<b-badge variant="info">{{ itemsCount }}</b-badge>
    </b-dropdown-item>
    <b-dropdown-item>
      <font-awesome-icon :icon="['far', 'envelope']" /> 
      Messages<b-badge variant="success">{{ itemsCount }}</b-badge>
    </b-dropdown-item>
    <b-dropdown-item>
      <font-awesome-icon :icon="['far', 'comments']" /> 
      Comments<b-badge variant="warning">{{ itemsCount }}</b-badge>
    </b-dropdown-item-->
    <!--b-dropdown-header 
      tag="div" 
      class="text-center" >
      <strong>Settings</strong>
    </b-dropdown-header>
    <b-dropdown-item>
      <font-awesome-icon :icon="['far', 'user']" /> 
      Profile
    </b-dropdown-item>
    <b-dropdown-item>
      <font-awesome-icon :icon="['fas', 'wrench']" /> 
      Settings
    </b-dropdown-item>
    <b-dropdown-item>
      <font-awesome-icon :icon="['fas', 'dollar-sign']" /> 
      Payments<b-badge variant="secondary">{{ itemsCount }}</b-badge>
    </b-dropdown-item/
    <b-dropdown-item>
      <b-icon-person-fill></b-icon-person-fill>
      Profile
    </b-dropdown-item> -->
    <b-dropdown-item @click="changeCompany">
      <b-icon icon="pie-chart" variant="outline"></b-icon>
      <label>Change Company</label>
    </b-dropdown-item>

    <b-dropdown-item @click="changePassword">
      <b-icon-lock></b-icon-lock>
      <label>Change Password</label>
    </b-dropdown-item>
    <b-dropdown-item @click="handleLogout" >
      <b-icon icon="power" variant="outline-danger" style="color:red;"></b-icon>
      <label class=" font-weight-bold">Sign Out</label>  
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
  import loginServices from '../../services/loginservices'
export default {
  name: 'HeaderDropdown',
  data: () => {
    return { 
      userEmail: "",
      userCompany: "",
      itemsCount: 42 
      }
  },
  mounted() {
    this.userEmail = this.$store.state.email;
    this.userCompany = this.$store.state.companyName;

    var today = new Date();
    //this.currentDate = today.getDate() + '-' + today.getMonth() + '-' + today.getFullYear();
  },
  methods: {
    async logout() {
      try {
        this.$store.dispatch('logout').then(() => {
          this.$router.push('/login')
        })
      } catch (e) {
        this.formError = e.message
      }
    },
    changePassword() {
      this.$router.push("/change-password");
    },

    changeCompany() {
      //this.$router.push("/change-company");
      this.$emit('change-company')
    },
    async handleLogout() {
      //Do session logout
      //let loader = this.$loading.show();
      var id =null;
      var dt = await loginServices.doGetDetailSession(this.$store.state.user, this.$store.state.token.replace('Bearer ', ""))
      if (dt.status == 200) {
        id = dt.data.Id == null ?dt.data.Id : dt.data.Id.toUpperCase();
      }
    
      if ( this.$store.state.sessionid == id) {
        await this.$store.dispatch('features/session_state/actSignOutCompany', {
          personId: this.$store.state.user,
          companySecurityId: this.$store.state.companySecurity,
          companyId: this.$store.state.companyId
        })

        var response = this.$store.state.features.session_state.data;
        if (response.status != 200) {
          this.$bvToast.toast('Signout failed !', {
            title: 'Attention',
            variant: 'danger',
            //toaster: 'b-toaster-bottom-center',
            autoHideDelay: 5000,
            appendToast: false
          });
          localStorage.setItem('NewCompanyId', null);
          sessionStorage.setItem('CompanyId', null);
          sessionStorage.clear();

          window.location.reload();
        } else {
          this.$store.dispatch("actSignOut");
          this.$router.push("/login");
        }
      } else {
        this.$store.dispatch("actSignOut");
          this.$router.push("/login");
      }
      //loader.hide();
      
    }
  }
}
</script>

<style scoped>
@media only screen and (max-width: 1024px) {
  img{
    max-height: 25px;
  }

  label{
    font-size:10px;
  }
}
</style>
