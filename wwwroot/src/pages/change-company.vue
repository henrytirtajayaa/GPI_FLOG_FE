<template>
  <div class="app flex-row align-items-center" id="background">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="10">
          <b-card-group>
            
            <b-card no-body class="p-4" v-if="showPanel2">
              <b-card-body>
                <div>
                  <b-form>
                    <h1>Welcome, <span style="text-transform: capitalize;">{{this.$store.state.name}}</span></h1>
                    <p class="text-muted">Choose your company</p>
                    <b-form-group description="Please choose a company you want to work with">
                      <b-form-select
                        id="input-1"
                        v-model="selectedCompany"
                        :options="selectOptions"
                        required
                        size="sm"
                        class="mt-3"
                      ></b-form-select>
                    </b-form-group>

                    <b-row>
                      <b-col cols="6">
                        <b-button
                          variant="primary"
                          @click="onButtonClick(selectedCompany)"
                          class="px-4"
                        >Select</b-button>
                      </b-col>
                      <b-col cols="6" class="text-right">
                        <a href="/dashboard" class="px-0">Back</a>
                      </b-col>
                    </b-row>
                  </b-form>
                </div>
              </b-card-body>
            </b-card>
            
            <b-card
              no-body
              class="text-white bg-primary py-5 d-md-down-none"
              style="width:44%; opacity:0.9;"
              md="4"
            >
              <b-card-body class="text-center">
                <div>
                  <img src="../static/img/LogoFLOG.png" alt="Flog" width="150" />
                  <h4 class="flex my-4 gpi-text">Financial Logistic Integrated System</h4>
                </div>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import loginServices from '../services/loginservices'
const cookie = process.client ? require('js-cookie') : undefined

export default {
  name: 'ChangeCompany',
  layout: 'clean',
  data: () => ({
    loading: false,
    showPanel2: true,
    selectedCompany: null,
    selectOptions: [{ value: null, text: 'Please select an option' }],
    userId: '',
    accessToken: '',
    model: {
      username: '',
      password: '',
    },
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
    roles: []
  }),

  async mounted() {

          this.selectOptions = []
          this.selectOptions.push({
            value: null,
            text: 'Please select a company',
            selected: 'selected'
          })
          for (var i = 0; i < this.roles.length; i++) {
            this.selectOptions.push({
              value: this.state.roles[i].SecurityId,
              text: this.state.roles[i].CompanyName
            })
          }
  },

  methods: {
    onKeyEnter: function(e) {
      if (e.keyCode === 13) {
        this.login()
      }
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

/*
    async login() {
      //let loader = this.$loading.show();
      var res = await loginServices.doLogin(
        this.model.username,
        this.model.password
      )
      if (res.status == 200) {
        if (res.data.IsSuccess) {
          this.state.userId = res.data.DetailUser.UserId
          this.state.token = res.data.AccessToken
          this.state.role = res.data.UserRoles
          this.state.email = res.data.DetailUser.EmailAddress
          this.state.name = res.data.DetailUser.UserName
          this.roles = res.data.UserRoles

          this.selectOptions = []
          this.selectOptions.push({
            value: null,
            text: 'Please select a company',
            selected: 'selected'
          })
          for (var i = 0; i < this.roles.length; i++) {
            this.selectOptions.push({
              value: this.roles[i].SecurityId,
              text: this.roles[i].CompanyName
            })
          }

          this.showPanel1 = false
          this.showPanel2 = true
        }
        //loader.hide();
        //console.log(this.roles);
      } else {
        this.showToast(res.data.ErrorDescription)
      }
    }, */

    async onButtonClick(compSecId) {
      if (compSecId != null) {
        var res = await loginServices.doLoginCompany(
          this.state.userId,
          compSecId,
          this.state.token
        )
        if (res.status == 200) {
          if (res.data.IsSuccess) {
            this.state.token = res.data.Token
            this.state.menus = res.data.Menus
            this.state.companySecurity = compSecId
            this.state.companyId = res.data.CompanyId
            this.$store.dispatch('actSignIn', this.state)
            this.$router.push('/dashboard')
          } else {
            this.showToast(res.data.ErrorDescription)
          }
        } else {
          this.showToast(res.data.ErrorDescription)
        }
      } else {
        this.showToast('Please, choose a company from the list !')
      }
    }
  }
}
</script>

<style>
#background{
  background-image: url("../static/img/GPI3.jpg");
}
</style>
