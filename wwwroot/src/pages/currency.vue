<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Currency</span>
                <small>{{ (form.isEdit) ? "Edit" : "New" }}</small>
                <div right style="float:right;">
                  <b-button variant="blue" type="submit">
                    <font-awesome-icon :icon="['fas', 'save']" v-if="isSave"/>&nbsp;Save
                  </b-button>
                  <b-button @click="onFormClose">
                    <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                  </b-button>
                </div>
              </div>
              <b-row>
                <b-col sm="2">
                  <validation-provider name="Currency"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="CurrencyCode">Currency Code</label>
                      <b-form-input name="CurrencyCode"
                                    type="text"
                                    size="sm"
                                    placeholder="Currency Code"
                                    v-model="form.model.CurrencyCode"
                                    :state="validateState(validationContext)"
                                    aria-describedby="currency-code-feedback"
                                    :disabled="form.isEdit" />
                      <b-form-invalid-feedback id="currency-code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="3">
                  <validation-provider name="Description"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="Description">Description</label>
                      <b-form-input name="Description"
                                    size="sm"
                                    type="text"
                                    placeholder="Description"
                                    v-model="form.model.Description"
                                    :state="validateState(validationContext)"
                                    aria-describedby="description-feedback" />
                      <b-form-invalid-feedback id="description-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="2">
                  <validation-provider name="Symbol"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="Symbol">Symbol</label>
                      <b-form-input name="Symbol"
                                    size="sm"
                                    type="text"
                                    placeholder="Symbol"
                                    v-model="form.model.Symbol"
                                    :state="validateState(validationContext)"
                                    aria-describedby="symbol-feedback" />
                      <b-form-invalid-feedback id="symbol-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="2">
                  <validation-provider name="DecimalPlaces"
                                       :rules="{ required: true, regex: /^[0-9]*$/}"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="S">Decimal Places</label>
                      <b-form-input name="DecimalPlaces"
                                    v-mask="masking"
                                    size="sm"
                                    type="text"
                                    placeholder="Decimal Places"
                                    v-model="form.model.DecimalPlaces"
                                    :state="validateState(validationContext)"
                                    aria-describedby="decimal-places-feedback" />
                      <b-form-invalid-feedback id="decimal-places-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <b-row>
                  <b-col sm="2">
                  <validation-provider name="CurrencyUnit"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="CurrencyUnit">Unit</label>
                      <b-form-input name="CurrencyUnit"
                                    type="text"
                                    size="sm"
                                    placeholder="Currency Unit (Dollars)"
                                    v-model="form.model.CurrencyUnit"
                                    :state="validateState(validationContext)"
                                    aria-describedby="currency-unit-feedback" />
                      <b-form-invalid-feedback id="currency-unit-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="2">
                  <b-form-group>
                    <label for="CurrencySubUnit">Sub Unit</label>
                    <b-form-input name="CurrencySubUnit"
                                  type="text"
                                  size="sm"
                                  placeholder="Currency Sub Unit (Cents)"
                                  v-model="form.model.CurrencySubUnit"
                                  aria-describedby="currency-subunit-feedback" />
                  </b-form-group>
                </b-col>
                <b-col sm=3></b-col>
                <b-col sm=2>
                  <validation-provider
                    name="Status"
                    :rules="{ required: true }"
                    v-slot="validationContext"
                  >
                    <b-form-group>
                      <label for="Status">Status</label>
                      <b-form-select
                        id="status"
                        size="sm"
                        name="Status"
                        v-model="form.model.Inactive"
                        :state="validateState(validationContext)"
                        :plain="true"
                        :options="[{value:false,text:'Active'},{value:true,text:'Inactive'}]"
                        aria-describedby="inactive-feedback"
                        @change="handleStatus"
                      />
                      <b-form-invalid-feedback
                        id="inactive-feedback"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="3">
                    <label>Realized Gain Acc</label>
                    <b-input-group prepend>
                      <b-form-input v-model="form.model.RealizedGainAcc"
                                    readonly
                                    size="sm"
                                    aria-describedby="realized=gain-acc-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button variant="outline-primary"
                                  size="sm"
                                  @click="onModalSearchAccount('RealizedGainAcc')">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                                <b-button variant="outline-danger" size="sm" v-if="form.model.RealizedGainAcc" @click="form.model.RealizedGainAcc=''">
                                    <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                                  </b-button>
                      </b-input-group-append>
                    </b-input-group>
                </b-col>
                <b-col sm="3">
                    <label>Realized Loss Acc</label>
                    <b-input-group prepend>
                      <b-form-input v-model="form.model.RealizedLossAcc"
                                    readonly
                                    size="sm"
                                    aria-describedby="realized=loss-acc-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button variant="outline-primary"
                                  size="sm"
                                  @click="onModalSearchAccount('RealizedLossAcc')">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                                <b-button variant="outline-danger" size="sm" v-if="form.model.RealizedLossAcc" @click="form.model.RealizedLossAcc=''">
                                    <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                                  </b-button>
                      </b-input-group-append>
                    </b-input-group>
                </b-col>
                <b-col sm="3">
                    <label>Unealized Gain Acc</label>
                    <b-input-group prepend>
                      <b-form-input v-model="form.model.UnrealizedGainAcc"
                                    readonly
                                    size="sm"
                                    aria-describedby="unrealized=gain-acc-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button variant="outline-primary"
                                  size="sm"
                                  @click="onModalSearchAccount('UnrealizedGainAcc')">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                                <b-button variant="outline-danger" size="sm" v-if="form.model.UnrealizedGainAcc" @click="form.model.UnrealizedGainAcc=''">
                                    <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                                  </b-button>
                      </b-input-group-append>
                    </b-input-group>
                </b-col>
                <b-col sm="3">
                    <label>Unealized Loss Acc</label>
                    <b-input-group prepend>
                      <b-form-input v-model="form.model.UnrealizedLossAcc"
                                    readonly
                                    size="sm"
                                    aria-describedby="unrealized=loss-acc-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button variant="outline-primary"
                                  size="sm"
                                  @click="onModalSearchAccount('UnrealizedLossAcc')">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                                <b-button variant="outline-danger" size="sm" v-if="form.model.UnrealizedLossAcc" @click="form.model.UnrealizedLossAcc=''">
                                    <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                                  </b-button>
                      </b-input-group-append>
                    </b-input-group>
                </b-col>
                
              </b-row>
            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>

    <b-row v-show="!isForm">
      <b-col cols="12" sm="12">
        <b-card width="100%">
          <DataGrid ref="gridCurrency"
                    :fields="headerFields"
                    :items="this.$store.state.features.company.currency.data"
                    :info="this.$store.state.features.company.currency.listInfo"
                    :baseUrl="this.$store.state.features.company.currency.baseUrl"
                    :actGetData="handleGetCurrency"
                    :actCreate="onFormCreate"
                    :actEditRow="handleEdit"
                    :actDeleteRow="handleDelete"
                    addTableClasses="table-bordered"
                    :disableNewButton="!this.$store.state.roleaccess.AllowNew"
                    :isEdit="this.$store.state.roleaccess.AllowEdit"
                    :isDelete="this.$store.state.roleaccess.AllowDelete"
                    responsive
                    items-per-page-select
                    loading
                    hover
                    sorter
                    pagination
                    column-filter
                    :caption="caption"></DataGrid>
        </b-card>
      </b-col>
    </b-row>

    <AccountModal ref="dlgAccount" :actSelectedRow="onSelectedCOA"></AccountModal>
  </div>
</template>
<script>
  import DataGrid from "@/components/Tables/DataGrid";
  import VueElementLoading from "vue-element-loading";
  import { AccountModal } from "@/pages/modal/index.js";
  import { mask } from 'vue-the-mask';
  import loginServices from '../services/loginservices'

  export default {
    name: "Currency",
    layout: "dashboard",
    components: {
      DataGrid,
      VueElementLoading,
      AccountModal
    },
    directives: {
      mask
    },
    data: () => {
      return {
        caption: "Currencies",
        blockLoader: false,
        isForm: false,
        masking: "#######",
        //DataGrid HEADERS Declarations, you can
        headerFields: [
          {
            key: "CurrencyCode",
            label: "Currency Code",
            classes: "text-center",
            width: 200,
            filter: true
          },
          {
            key: "Description",
            label: "Description",
            filter: true
          },
          {
            key: "Symbol",
            label: "Symbol",
            _classes: "text-center",
            width: 50,
            filter: true
          },
          {
            key: "DecimalPlaces",
            label: "Decimal Places",
            _classes: "text-center",
            width: 200,
            filter_number: true
          },
          {
            key: "Inactive",
            label: "Status",
            width: 50,
            filter_select: true,
            filter_select_options: [
              { key: false, value: "Active" },
              { key: true, value: "Inactive" }
            ]
          }
        ],
        alert: "",
        ErrorMessage: "",
        form: {
          valid: false,
          isEdit: false,
          model: {
            CurrencyId: null,
            CurrencyCode: "",
            Description: "",
            Symbol: "",
            DecimalPlaces: "",
            RealizedGainAcc: "",
            RealizedLossAcc: "",
            UnrealizedGainAcc: "",
            UnrealizedLossAcc: "",
            Inactive: false,
            CurrencyUnit: "",
            CurrencySubUnit: "",
          }
        }
      };
    },
     computed: {
      isSave() {
        return this.form.isEdit ? this.$store.state.roleaccess.AllowEdit : true;
      }
    },
    async mounted() {
      if (this.$refs.gridCurrency != null) {
        await this.$refs.gridCurrency.doRefresh();
      }
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
      async handleGetCurrency(url) {
        await this.$store.dispatch(
          "features/company/currency/actGetCurrency",
          url
        );
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async onFormClose() {
        this.ErrorMessage = "";
        this.isForm = false;
        this.form.isEdit = false;

        this.resetForm();
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
        this.form.model[modelReff] = item.AccountId;
      },
      async onFormCreate() {
        this.ErrorMessage = "";
        this.form.model.CurrencyId = "";
        this.form.model.CurrencyCode = "";
        this.form.model.Description = "";
        this.form.model.Symbol = "";
        this.form.model.DecimalPlaces = "";
        this.form.model.RealizedGainAcc = "";
        this.form.model.RealizedLossAcc = "";
        this.form.model.UnrealizedGainAcc = "";
        this.form.model.UnrealizedLossAcc = "";
        this.form.model.Inactive = false;
        this.form.model.CurrencyUnit = "";
        this.form.model.CurrencySubUnit = "";
        this.form.isEdit = false;
        this.isForm = true;
        this.resetForm();
      },
      async handleStatus(e) {
        if (this.form.model.InActive) {
          this.$bvModal
            .msgBoxConfirm("Are you sure?")
            .then(value => {
              if (value) {
                this.form.model.InActive = value;
              }
            })
            .catch(err => {
              // An error occurred
            });
        }
      },
      async handleEdit(row) {
        this.ErrorMessage = "";
        this.isForm = true;
        this.form.model.CurrencyId = row.CurrencyId;
        this.form.model.CurrencyCode = row.CurrencyCode;
        this.form.model.Description = row.Description;
        this.form.model.Symbol = row.Symbol;
        this.form.model.DecimalPlaces = row.DecimalPlaces;
        this.form.model.RealizedGainAcc = row.RealizedGainAcc;
        this.form.model.RealizedLossAcc = row.RealizedLossAcc;
        this.form.model.UnrealizedGainAcc = row.UnrealizedGainAcc;
        this.form.model.UnrealizedLossAcc = row.UnrealizedLossAcc;
        this.form.model.CurrencyUnit = row.CurrencyUnit;
        this.form.model.CurrencySubUnit = row.CurrencySubUnit
        this.form.model.Inactive = (row.Inactive.toLowerCase() == 'inactive' ? true : false);
        this.form.isEdit = true;
      },
      validateState({ dirty, validated, valid = null }) {
        return dirty || validated ? valid : null;
      },
      resetForm() {
        this.$nextTick(() => {
          this.$refs.observer.reset();
        });
      },
      async doDelete(row) {
        this.showLoader(true);

        await this.$store.dispatch(
          "features/company/currency/actDeleteCurrency",
          row
        );

        var response = this.$store.state.features.company.currency.resultDelete;
        if (response.status != 200) {
          this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription
          );
        } else {
          this.$refs.gridCurrency.doRefresh();
          this.resetForm();

          this.handleToast("Confirmation", "success", "Successfully deleted");
        }

        this.showLoader(false);
      },
      async handleDelete(row) {
        this.$bvModal
          .msgBoxConfirm("Are you sure?", {
            title: "Delete Confirmation",
            size: "sm",
            buttonSize: "sm",
            okVariant: "blue",
            centered: true,
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0"
          })
          .then(ok => {
            if (ok) {
              this.doDelete(row);
            }
          })
          .catch(err => {
            // An error occurred
          });
      },
      async onSubmit() {
        this.showLoader(true);

        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/company/currency/actUpdateCurrency",
            this.form.model
          );
          var response = this.$store.state.features.company.currency.resultUpdate;

          if (response.status != 200) {
            this.handleToast(
              "Confirmation",
              "danger",
              response.data.ErrorDescription
            );
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridCurrency.doRefresh();
            this.resetForm();

            this.handleToast("Confirmation", "success", "Successfully updated");
          }
        } else {
          await this.$store.dispatch(
            "features/company/currency/actCreateCurrency",
            this.form.model
          );

          var response = this.$store.state.features.company.currency.resultCreate;

          if (response.status != 200) {
            this.handleToast(
              "Confirmation",
              "danger",
              response.data.ErrorDescription
            );
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridCurrency.doRefresh();
            this.resetForm();

            this.handleToast("Confirmation", "success", "Successfully saved");
          }
        }

        this.showLoader(false);
      }
    }
  };
</script>
