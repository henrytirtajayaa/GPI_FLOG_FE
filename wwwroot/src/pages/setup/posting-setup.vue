<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold text-uppercase">Posting Accounts Setup</span>
                <small>Config</small>
                <div right style="float:right;">
                  <a
                    href="javascript:;"
                    v-if="!form.isEdit && $store.state.roleaccess.AllowEdit"
                    @click="form.isEdit=true"
                    class="btn btn-outline-secondary"
                  >
                    <font-awesome-icon :icon="['fas', 'edit']" />&nbsp;Edit
                  </a>
                  <b-button
                    variant="blue"
                    type="submit"
                    v-if="form.isEdit && $store.state.roleaccess.AllowNew"
                  >
                    <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                  </b-button>
                  <a
                    href="javascript:;"
                    v-if="form.isEdit"
                    @click="onCancel"
                    class="btn btn-outline-secondary"
                  >
                    <font-awesome-icon :icon="['fas', 'times']" />&nbsp;Cancel
                  </a>
                </div>
              </div>
              <template v-for="(item, itemIndex) in form.dataDetails" >
                <b-alert show class="font-weight-bold mt-2">{{item.Group}}</b-alert>
                <b-row v-for="(param, paramIndex) in item.Params" v-bind:key="param.ParamId" class="ml-1">
                  <b-col sm="4">{{param.Description}}</b-col>
                  <b-col sm="3">
                    <b-input-group prepend>
                      <b-form-input v-model="param.AccountId" readonly size="sm" class="font-weight-bold"></b-form-input>
                      <b-input-group-append>
                        <b-button v-b-tooltip.hover title="Select COA Account"
                          size="sm"
                          variant="outline-primary"
                          @click="onModalSearchAccount(param.PostingKey)"
                          v-if="form.isEdit"
                        >
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                        <b-button v-b-tooltip.hover title="Clear"
                                  variant="outline-danger"
                                  v-if="form.isEdit"
                                  @click="param.AccountId='',param.AccountDesc=''"
                                  size="sm">
                          <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-col>
                  <b-col sm="5" class="bg-light">
                    <label class="mt-1 text-purple ">{{param.AccountDesc}}</label>
                  </b-col>
                </b-row>
              </template>
            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>

    <!-- Modal -->
    <AccountModal ref="dlgAccount" :actSelectedRow="onSelectedCOA"></AccountModal>

    <!-- Modal -->
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import loginServices from "@/services/loginservices";
import { AccountModal } from "@/pages/modal/index.js";

export default {
  name: "PostingParam",
  layout: "dashboard",
  components: {
    VueElementLoading,
    AccountModal
  },
  data() {
    return {
      caption: "Posting Parameter",
      isForm: false,
      blockLoader: false,
      perPage: 20,
      form: {
        valid: false,
        isEdit: false,
        dataDetails: [],
        model: {
          PostingParams: Array
        }
      }
    };
  },
  async mounted() {
    this.onBind();
  },
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
    async onBind() {
      let postingParams = await this.$store.dispatch(
        "features/finance/constants/actGetPostingParam"
      );

      if (postingParams != undefined){
          this.form.dataDetails = postingParams;          
      }
    },
    async onModalSearchAccount(row) {
      this.$refs.dlgAccount
        .open(row, this.form.model[row])
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
    async onSelectedCOA(item, modelReff) {
      //this.form.model[modelReff] = item.AccountId;
      this.form.dataDetails.forEach(function(group) {
        if (Array.isArray(group.Params)) {
          group.Params.forEach(function(detail) {
            if (detail.PostingKey == modelReff){
              detail.AccountId = item.AccountId;
              detail.AccountDesc = item.Description;
            }
          });
        }
      });
    },
    async handleSubmit() {
      this.showLoader(true);

      let params = [];

      this.form.dataDetails.forEach(function(group) {
        if (Array.isArray(group.Params)) {
          group.Params.forEach(function(detail) {
            params.push({
                ParamId: detail.ParamId,
                PostingKey: detail.PostingKey,
                AccountId: detail.AccountId,
                Description: detail.Description,
                AccountDesc : detail.AccountDesc
            });
          });
        }
      });

      this.form.model.PostingParams = params;

      await this.$store.dispatch(
        "features/finance/constants/actUpdatePostingParam",
        this.form.model
      );

      var response = this.$store.state.features.finance.constants
        .resultUpdate;

      if (response.status != 200) {
        this.handleToast(
          "Confirmation",
          "danger",
          response.data.ErrorDescription
        );
      } else {
        this.isForm = false;
        this.form.isEdit = false;

        await this.onBind();

        this.handleToast("Confirmation", "success", "Successfully updated");
      }

      this.showLoader(false);
    },
    async onCancel() {
      this.form.isEdit = false;
      this.resetForm();
      this.onBind();
    },
    async onSubmit() {
      this.$bvModal
        .msgBoxConfirm("Save your changes ?", {
          title: "Submit Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "blue",
          okTitle: "Yes",
          cancelTitle: "No",
          centered: true,
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0"
        })
        .then(ok => {
          if (ok) {
            this.handleSubmit();
          }
        })
        .catch(err => {
          // An error occurred
        });
    }
  }
};
</script>
