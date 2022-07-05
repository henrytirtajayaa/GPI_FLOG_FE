<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="8">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Change Password</span><br>
                <small>you must remember your current password</small>
                <div right style="float:right;">
                  <b-button variant="blue" type="submit">
                    <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Submit
                  </b-button>
                  <b-button @click="onBack" >
                    <font-awesome-icon :icon="['fas', 'arrow-circle-left']" />&nbsp;Back

                  </b-button>
                </div>
              </div>
              <b-row class="mb-2">
                <b-col sm="10">
                  <validation-provider
                    name="Old Password"
                    :rules="{ required: true }"
                    v-slot="validationContext"
                  >
                    <label class="font-weight-bold">Old Password</label>
                    <b-input-group class="mb-2">
                      <b-form-input
                        v-model="form.model.OldPassword"
                        :type="showOldPassword ? 'text' : 'password'"
                        :state="validateState(validationContext)"
                        aria-describedby="old-feedback"
                      ></b-form-input>
                      <b-input-group-append>
                        <b-button variant="outline-secondary" @click="showOldPassword = !showOldPassword">
                          <font-awesome-icon :icon="['fas', 'eye']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                      <b-form-invalid-feedback id="old-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-input-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="10">
                  <validation-provider
                    name="New Password"
                    :rules="{ required: true }"
                    v-slot="validationContext"
                  >
                    <label class="font-weight-bold">New Password</label>
                    <b-input-group class="mb-2">
                      <b-form-input
                        v-model="form.model.NewPassword"
                        :type="showNewPassword ? 'text' : 'password'"
                        :state="validateState(validationContext)"
                        aria-describedby="new-feedback"
                      ></b-form-input>
                      <b-input-group-append>
                        <b-button variant="outline-secondary" @click="showNewPassword = !showNewPassword">
                          <font-awesome-icon :icon="['fas', 'eye']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                      <b-form-invalid-feedback id="new-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-input-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="10">
                  <validation-provider
                    name="Confirm New Password"
                    :rules="{ required: true }"
                    v-slot="validationContext"
                  >
                  <label class="font-weight-bold">Confirm New Password</label>
                    <b-input-group class="mb-2">
                      <b-form-input
                        v-model="form.model.ConfirmNewPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        :state="validateState(validationContext)"
                        aria-describedby="confirm-feedback"
                      ></b-form-input>
                      <b-input-group-append>
                        <b-button variant="outline-secondary" @click="showConfirmPassword = !showConfirmPassword">
                          <font-awesome-icon :icon="['fas', 'eye']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                      <b-form-invalid-feedback id="confirm-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-input-group>
                  </validation-provider>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";

export default {
  name: "ChangePassword",
  layout: "dashboard",
  components: { VueElementLoading },
  data() {
    return {
      caption: "Change Password",
      blockLoader: false,
      form: {
        valid: false,
        isEdit: true,
        model: {
          OldPassword: "",
          NewPassword: "",
          ConfirmNewPassword: ""
        }
      },
      showOldPassword: false,
      showNewPassword: false,
      showConfirmPassword: false
    };
  },
  async mounted() {},
  methods: {
    showLoader(val) {
      if (!val) {
        setTimeout(() => {
          this.blockLoader = false;
        }, 500);
      } else {
        this.blockLoader = val;
      }
    },
    handleToast(toastTitle, style, message) {
      this.$bvToast.toast(message, {
        title: toastTitle != "" ? toastTitle : "Confirmation",
        variant: style != "" ? style : "info",
        //toaster: 'b-toaster-bottom-center',
        autoHideDelay: 5000,
        appendToast: false
      });
    },
    validateState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs.observer.reset();
      });
    },
    async onBack() {
      this.$router.push('/dashboard')
    },
    

    async onSubmit() {
      this.showLoader(true);

      if (this.form.isEdit) {
        await this.$store.dispatch(
          "changepassword/actChangePassword",
          this.form.model
        );

        var response = this.$store.state.changepassword.resultCreate;
        if (response.status != 200) {
          this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription
          );
        } else {
          this.form.model.OldPassword = '';
          this.form.model.NewPassword = '';
          this.form.model.ConfirmNewPassword = '';
          this.showOldPassword = false;
          this.showNewPassword = false;
          this.showConfirmPassword = false;

          this.handleToast(
            "Change Password",
            "success",
            "Password has been changed"
          );
           this.$router.push('/dashboard')
        }
      }

      this.showLoader(false);
    }
  }
};
</script>
