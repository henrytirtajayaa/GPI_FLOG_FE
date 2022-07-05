<template>
  <div class="animated fadeIn">
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Tax Schedule</span>
                <small>{{ (form.isEdit) ? "Edit" : "New" }}</small>
                <div right style="float:right;">
                  <b-button variant="blue" type="submit">
                    <font-awesome-icon :icon="['fas', 'save']" v-if="isSave" />&nbsp;Save
                  </b-button>
                  <b-button @click="onFormClose">
                    <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                  </b-button>
                </div>
              </div>
              <b-row>
                <b-col sm="2">
                  <validation-provider name="Tax Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="TaxScheduleCode">Tax Schedule Code</label>
                      <b-form-input name="Tax Schedule Code"
                                    size="sm"
                                    type="text"
                                    placeholder="Tax Schedule Code"
                                    v-model="form.model.TaxScheduleCode"
                                    :disabled="form.isEdit"
                                    :state="validateState(validationContext)"
                                    aria-describedby="code-feedback" />
                      <b-form-invalid-feedback id="code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="4">
                  <b-form-group>
                    <label for="Description">Description</label>
                    <b-form-input name="Description"
                                  size="sm"
                                  type="text"
                                  placeholder="Description"
                                  v-model="form.model.Description"
                                  aria-describedby="Description-feedback" />
                  </b-form-group>
                </b-col>
                <b-col sm="3">
                  <b-form-group label="Type">
                    <b-form-radio-group v-model="form.model.IsSales"
                                        :options="options"
                                        name="radio-inline"></b-form-radio-group>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="2">
                  <validation-provider name="Percent Of Sales Purchase"
                                       :rules="{ required: true, min_value : 1, max_value : 100 }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="PercentOfSalesPurchase">% Sales Or Purchase</label>
                      <b-form-input name="Percent Of Sales Purchase"
                                    size="sm"
                                    type="number"
                                    placeholder="Percent Of Sales Purchase"
                                    v-model="form.model.PercentOfSalesPurchase"
                                    :state="validateState(validationContext)"
                                    aria-describedby="PercentOfSalesPurchase-feedback" />
                      <b-form-invalid-feedback id="PercentOfSalesPurchase-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="2">
                  <validation-provider name="Taxable Percentage"
                                       :rules="{ required: true, max:3, min_value : 0, max_value : 100}"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="TaxablePercent">Taxable Percent</label>
                      <money v-model="form.model.TaxablePercent"
                             v-bind="taxableOptions"
                             size="sm"
                             class="currency-money-field"
                             aria-describedby="TaxablePercent-feedback"></money>
                      <b-form-invalid-feedback id="TaxablePercent-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="2">
                  <validation-provider name="Rounding Type"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="RoundingType">Rounding Type</label>
                      <b-form-select id="RoundingType"
                                     name="RoundingType"
                                     v-model="form.model.RoundingType"
                                     size="sm"
                                     :plain="true"
                                     :options="[{value:0,text:'Rounding Up'},{value:1,text:'Rounding Down'},{value:2,text:'Half Rounding'}]"
                                     aria-describedby="status-feedback" />
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="2">
                  <b-form-group>
                    <label for="RoundingLimitAmount">Rounding Limit Amount</label>
                    <money v-model="form.model.RoundingLimitAmount"
                           v-bind="moneyOptions"
                           size="sm"
                           class="currency-money-field"></money>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="3" class="mt-4">
                  <b-form-group>
                    <b-form-checkbox v-model="form.model.TaxInclude"
                                     style="float:left;margin-left:4%">Tax Include</b-form-checkbox>
                    <b-form-checkbox v-model="form.model.WithHoldingTax"
                                     style="float:left;margin-left:4%">Witholding Tax</b-form-checkbox>
                  </b-form-group>
                </b-col>
                <b-col sm="3">
                  <validation-provider name="Tax Account No"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <label>Tax Account</label>
                    <b-input-group prepend>
                      <b-form-input v-model="form.model.TaxAccountNo"
                                    :state="validateState(validationContext)"
                                    readonly
                                    size="sm"
                                    aria-describedby="tax-account-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button variant="outline-primary"
                                  size="sm"
                                  @click="onModalSearchAccount('TaxAccountNo')">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                      <b-form-invalid-feedback id="tax-account-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-input-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="2">
                  <validation-provider name="Status"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="Status">Status</label>
                      <b-form-select id="status"
                                     name="Status"
                                     v-model="form.model.InActive"
                                     :state="validateState(validationContext)"
                                     size="sm"
                                     :plain="true"
                                     :options="[{value:false,text:'Active'},{value:true,text:'Inactive'}]"
                                     aria-describedby="status-feedback" />
                      <b-form-invalid-feedback id="status-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
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
          <DataGrid ref="gridMain"
                    :fields="headerFields"
                    :items="this.$store.state.features.company.tax_schedule.data"
                    :info="this.$store.state.features.company.tax_schedule.listInfo"
                    :baseUrl="this.$store.state.features.company.tax_schedule.baseUrl"
                    :actGetData="handleGetData"
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
  import SelectGrid from "@/components/tables/SelectGrid";
  import { mask } from "vue-the-mask";
  import { AccountModal } from "@/pages/modal/index.js";
  import loginServices from '../services/loginservices'
  export default {
    name: "TaxSchedule",
    layout: "dashboard",
    components: {
      DataGrid,
      SelectGrid,
      AccountModal
    },
    directives: {
      mask
    },
    computed: {
      tableClasses() {
        return [
          "table",
          this.addTableClasses,
          {
            [`table-${this.size}`]: this.size,
            "table-dark": this.dark,
            "table-striped": this.striped,
            "b-table-fixed": this.fixed,
            "table-hover": this.hover,
            "table-bordered": this.border,
            border: this.outlined
          }
        ];
      }
    },
    data: () => {
      return {
        moneyOptions: {
          decimal: ",",
          thousands: ".",
          prefix: "",
          suffix: "",
          precision: 0,
          masked: false,
          allowBlank: false,
          min: 0
        },
        taxableOptions: {
          decimal: ",",
          thousands: ".",
          prefix: "",
          suffix: "",
          precision: 2,
          masked: false,
          allowBlank: false,
          min: 0
        },
        caption: "Tax Schedules",
        isForm: false,
        perPage: 20,
        options: [
          { text: "Sales", value: true },
          { text: "Purchase", value: false }
        ],
        headerFields: [
          {
            key: "TaxScheduleCode",
            label: "Tax Schedule Code",
            classes: "text-center"
          },
          { key: "Description", label: "Description" },
          {
            key: "IsSales",
            label: "Type",
            width: 100,
            filter_select: true,
            filter_select_options: [
              { key: true, value: "Sales" },
              { key: false, value: "Purchase" }
            ]
          },
          {
            key: "TaxAccountNo",
            label: "Account",
            width: 100,
          },
          {
            key: "PercentOfSalesPurchase",
            label: "% Sales | Purchase",
            filter_number: true,
            width: 150,
            _classes: "text-center"
          },
          {
            key: "TaxablePercent",
            label: "Taxable Percent",
            filter: false,
            currency: true,
            width: 150,
            _classes: "text-center"
          },
          {
            key: "RoundingType",
            label: "Rounding Type",
            _classes: "text-center",
            width: 150,
            filter_select: true,
            filter_select_options: [
              { key: 0, value: "Rounding Up" },
              { key: 1, value: "Rounding Down" },
              { key: 2, value: "Half Rounding" }
            ]
          },
          {
            key: "Inactive",
            label: "Status",
            _classes: "text-center",
            width: 100,
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
            TaxScheduleId: null,
            TaxScheduleCode: "",
            Description: "",
            IsSales: true,
            PercentOfSalesPurchase: 0,
            TaxablePercent: 0,
            RoundingType: "",
            RoundingLimitAmount: 0,
            TaxInclude: false,
            WithHoldingTax: false,
            TaxAccountNo: "",
            InActive: false
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
      if (this.$refs.gridMain != null) {
        await this.$refs.gridMain.doRefresh();
      }
    },
    methods: {
      async handleSelectData(row) {
        this.form.model.TaxAddressId = row.AddressCode;
        this.TaxAddressName = row.AddressName;
        this.isShowCompanyAddress2 = false;
      },
      async handleSelectCity(row) {
        this.form.model.CityCode = row.CityCode;
        this.form.model.CityName = row.CityName;
        this.Province = row.Province;
        this.CountryName = row.CountryName;
        this.isShowCity = false;
      },
      async handleSameAddress(arg) {
        if (arg) {
          this.form.model.TaxAddressId = "";
          this.TaxAddressName = "-";
        } else {
          this.TaxAddressName = "";
        }
      },
      async handleGetData(url) {
        await this.$store.dispatch(
          "features/company/tax_schedule/actGetTaxSchedule",
          url
        );
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
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
      async onFormClose() {
        this.ErrorMessage = "";
        this.isForm = false;
        this.form.isEdit = false;

        this.resetForm();
      },
      async onFormCreate() {
        this.resetForm();
        this.ErrorMessage = "";

        (this.form.model.TaxScheduleId = ""),
          (this.form.model.TaxScheduleCode = ""),
          (this.form.model.Description = ""),
          (this.form.model.IsSales = true),
          (this.form.model.PercentOfSalesPurchase = 100),
          (this.form.model.TaxablePercent = 0),
          (this.form.model.RoundingType = 0),
          (this.form.model.RoundingLimitAmount = 0),
          (this.form.model.TaxInclude = false),
          (this.form.model.WithHoldingTax = false),
          (this.form.model.InActive = false);
        this.form.model.TaxAccountNo = ""

        this.form.isEdit = false;
        this.isForm = true;
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
        this.resetForm();
        this.ErrorMessage = "";

        (this.form.model.TaxScheduleId = row.TaxScheduleId),
          (this.form.model.TaxScheduleCode = row.TaxScheduleCode),
          (this.form.model.Description = row.Description),
          (this.form.model.IsSales = row.IsSales == "Sales" ? true : false),
          (this.form.model.PercentOfSalesPurchase = row.PercentOfSalesPurchase),
          (this.form.model.TaxablePercent = row.TaxablePercent),
          (this.form.model.RoundingType =
            row.RoundingType == "Rounding Up"
              ? 0
              : row.RoundingType == "Rounding Down"
                ? 1
                : 2),
          (this.form.model.RoundingLimitAmount = row.RoundingLimitAmount),
          (this.form.model.TaxInclude = row.TaxInclude),
          (this.form.model.WithHoldingTax = row.WithHoldingTax),
          (this.form.model.TaxAccountNo = row.TaxAccountNo),
          (this.form.model.InActive = row.Inactive == "Inactive" ? true : false);

        this.form.isEdit = true;
        this.isForm = true;
      },
      validateState({ dirty, validated, valid = null }) {
        return dirty || validated ? valid : null;
      },
      resetForm() {
        this.$nextTick(() => {
          this.$refs.observer.reset();
        });
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
      async doDelete(row) {
        await this.$store.dispatch(
          "features/company/tax_schedule/actDelete",
          row
        );

        var response = this.$store.state.features.company.tax_schedule
          .resultDelete;
        if (response.status != 200) {
          this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription
          );
        } else {
          this.$refs.gridMain.doRefresh();

          this.handleToast("Confirmation", "success", "Successfully deleted");
        }
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
        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/company/tax_schedule/actUpdateTaxSchedule",
            this.form.model
          );
          var response = this.$store.state.features.company.tax_schedule
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

            this.$refs.gridMain.doRefresh();

            this.handleToast("Confirmation", "success", "Successfully updated");
          }
        } else {
          await this.$store.dispatch(
            "features/company/tax_schedule/actCreateTaxSchedule",
            this.form.model
          );

          var response = this.$store.state.features.company.tax_schedule
            .resultCreate;
          if (response.status != 200) {
            this.handleToast(
              "Confirmation",
              "danger",
              response.data.ErrorDescription
            );
          } else {
            this.isForm = false;
            this.form.isEdit = false;
            this.$refs.gridMain.doRefresh();

            this.handleToast("Confirmation", "success", "Successfully saved");
          }
        }
      }
    }
  };
</script>
