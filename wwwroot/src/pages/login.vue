<template>
  <div class="app flex-row align-items-center" id="background">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="10">
          <b-card-group>
            <b-card no-body class="p-3" v-if="showPanel1">
                <div id="logo" align="right">
                  <label>Financial Logistic Integrated System</label> |
                  <img src="../static/img/LogoFLOG.png" alt="Flog" width="60" />
                </div>
              <b-card-body>
                <h3>Login</h3>
                <p class="text-muted">Sign In to your account</p>
                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text>
                      <i class="icon-user" />
                    </b-input-group-text>
                  </b-input-group-prepend>
                  <input type="text"
                         class="form-control"
                         style="font-size:12px;"
                         v-model="model.username"
                         v-on:keyup="onKeyEnter"
                         placeholder="Email Address" />
                </b-input-group>
                <b-input-group class="mb-4">
                  <b-input-group-prepend>
                    <b-input-group-text>
                      <i class="icon-lock" />
                    </b-input-group-text>
                  </b-input-group-prepend>
                  <input type="password"
                         class="form-control"
                         style="font-size:12px;"
                         v-model="model.password"
                         v-on:keyup="onKeyEnter"
                         placeholder="Password" />
                </b-input-group>
                <b-row>
                  <b-col cols="6">
                    <b-button variant="primary" class="px-4" @click="login">Login</b-button>
                  </b-col>
                  <b-col cols="6" class="text-right">
                    <span @click="forgotPassword()" class="px-0" style="color:darkcyan; cursor:pointer;">Forgot password?</span>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
            <b-card no-body class="p-3" v-if="showPanel2">
              <div id="logo" align="right">
                  <label>Financial Logistic Integrated System</label> |
                  <img src="../static/img/LogoFLOG.png" alt="Flog" width="60" />
              </div>
              <b-card-body>
                <div>
                  <b-form>
                    <h3>Welcome, <span style="text-transform: capitalize;">{{this.state.name}}</span></h3>
                    <p class="text-muted">Choose your company</p>
                    <b-form-group description="Please choose a company you want to work with">
                      <b-form-select id="input-1"
                                     style="font-size:12px;"
                                     v-model="selectedCompany"
                                     :options="selectOptions"
                                     required
                                     size="sm"
                                     class="mt-3"></b-form-select>
                    </b-form-group>

                    <b-row>
                      <b-col cols="6">
                        <b-button variant="primary"
                                  @click="onButtonClick(selectedCompany)"
                                  class="px-4">Select</b-button>
                      </b-col>
                      <b-col cols="6" class="text-right">
                        <a href="/login" class="px-0">Back</a>
                      </b-col>
                    </b-row>
                  </b-form>
                </div>
              </b-card-body>
            </b-card>
            <b-card no-body class="p-4" v-if="showPanel3">
              <div id="logo" align="right">
                  <label>Financial Logistic Integrated System</label> |
                  <img src="../static/img/LogoFLOG.png" alt="Flog" width="60" />
                </div>
              <b-card-body>
                <h3>Forgot Password</h3>
                <p class="text-muted">Please Insert Email Address that has been Registered</p>
                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text>
                      <i class="icon-user" />
                    </b-input-group-text>
                  </b-input-group-prepend>
                  <input type="email"
                         class="form-control"
                         v-on:keyup="onKeyEnter"
                         v-model="Email"
                         :rules="emailRules"
                         placeholder="Email Address" />
                </b-input-group>
                <b-row>
                  <b-col cols="6">
                    <b-button variant="primary" class="px-4" @click="reset" :loading="loading">Submit</b-button>
                  </b-col>
                  <b-col cols="6" class="text-right">
                    <a href="/login" class="px-0">Back</a>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
            <b-card no-body
                    class="text-white bg-primary py-5 d-md-down-none"
                    style="width:44%; opacity:0.9;"
                    md="4">
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
    name: 'Login',
    layout: 'clean',
    data: () => ({
      loading: false,
      showPanel1: true,
      showPanel2: false,
      showPanel3: false,
      Email: "",
      emailRules: [],
      selectedCompany: null,
      selectOptions: [{ value: null, text: 'Please select an option' }],
      userId: '',
      CompanyId: '',
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
        companyId: '',
        sessionid: ''
      },
      roles: []
    }),

    watch: {
      Email: function (mail) { // e_Mail is the exact name used in v-model
        if (mail !== '') {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (pattern.test(mail) == false) {
            this.valid = false;
            this.emailRules = ['Invalid e-mail.'];
          } else {
            this.emailRules = [];
            this.valid = true;
          }
        } else if (mail === '') {
          this.emailRules = ['E-mail is required'];
          this.valid = false;
        }
        //alert(this.emailRules.state);
      }
    },

    methods: {
      onKeyEnter: function (e) {
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

      async forgotPassword() {
        this.showPanel1 = false
        this.showPanel3 = true
      },

      async reset() {
        // let loader = this.$loading.show();
        await this.$store.dispatch('features/reset_password/RESET_PASSWORD', {
          model: { email: this.Email }
        });
        var status = this.$store.state.features["reset-password"].status;
        if (status == 200) {
          this.$swal.fire({ title: 'success', text: "Reset Password Request has been sent to your email", icon: 'success', confirmButtonText: 'Close' })
        } else {
          this.$swal.fire({ title: 'Error!', text: status, icon: 'error', confirmButtonText: 'Close' })
        }
        loader.hide();
      },

      async login() {
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
            var dt = await loginServices.doGetDetailSession(res.data.DetailUser.UserId, res.data.AccessToken)
            if (dt.status == 200) {
              if (dt.data.Id == null) {
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
              else {
                this.$bvModal.msgBoxConfirm('You are Currently Login at ' + dt.data.CreatedDate + '.  Do you want to Delete previous login session?')
                  .then(value => {
                    if (value) {
                      this.signout(dt.data.PersonId, dt.data.CompanySecurityId, dt.data.CompanyId);
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
                  })
                  .catch(err => {
                    // An error occurred
                  })
              }

            }
            //loader.hide();
            //console.log(this.roles);
          }
        } else {
          this.showToast(res.data.ErrorDescription)
        }

      },
      async onButtonClick(compSecId) {

        if (compSecId != null) {

          var res = await loginServices.doLoginCompany(
            this.state.userId,
            compSecId,
            this.state.token,
             this.CompanyId,
          )
          if (res.status == 200) {
            if (res.data.IsSuccess) {
              this.state.token = res.data.Token
              this.state.menus = res.data.Menus
              this.state.companySecurity = compSecId
              this.state.companyId = res.data.CompanyId
              this.state.sessionid = res.data.SessionId
              this.$store.dispatch('actSignIn', this.state)
              sessionStorage.setItem('CompanyId', res.data.CompanyId);
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
      },
      async signout(PersonId, CompanySecurityId, CompanyId) {

        await this.$store.dispatch('features/session_state/actSignOutCompany', {
          personId: PersonId,
          companySecurityId: CompanySecurityId,
          companyId: CompanyId
        })

      }
    }
  }
</script>

<style scoped>
  #logo{
    display: none;
  }
  #background {
    background-image: url("../static/img/GPI3.jpg");
    /* Full height */
    height: 100%;

    /* Center and scale the image nicely */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  @media only screen and (max-width: 990px) {
    #logo{
      display: block;
    }
  }
</style>
