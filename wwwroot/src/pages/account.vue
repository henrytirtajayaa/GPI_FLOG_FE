<template>
  <div class="animated fadeIn">
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Account</span>
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
                <b-col sm="3">

                  <validation-provider name="Account Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="AccountCode">Account Code</label>
                      <b-form-input name="Account Code"
                                    v-mask="masking"
                                    type="text"
                                    placeholder="Account Code"
                                    v-model="form.model.AccountId"
                                    :state="validateState(validationContext)"
                                    aria-describedby="AccountCode-feedback"
                                    :disabled="form.isEdit" />
                      <b-form-invalid-feedback id="AccountCode-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="5">
                  <validation-provider name="Description"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="Description">Description</label>
                      <b-form-input name="Description"
                                    type="text"
                                    placeholder="Description"
                                    v-model="form.model.Description"
                                    :state="validateState(validationContext)"
                                    aria-describedby="Description-feedback" />
                      <b-form-invalid-feedback id="Description-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>



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
                                     :plain="true"
                                     :options="[{value:false,text:'Active'},{value:true,text:'Inactive'}]"
                                     aria-describedby="status-feedback" />
                      <b-form-invalid-feedback id="status-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="3">

                  <b-form-group label="Posting Type">
                    <b-form-radio-group id="radio-group-posting" v-model="form.model.PostingType" name="radio-sub-type">
                      <b-form-radio value=false>Balance sheet</b-form-radio>
                      <b-form-radio value=true>Profit Loss</b-form-radio>

                    </b-form-radio-group>
                  </b-form-group>

                </b-col>
                <b-col sm="3">

                  <b-form-group label="Normal Balance">
                    <b-form-radio-group id="radio-group-balance" v-model="form.model.NormalBalance" name="radio-sub-balance">
                      <b-form-radio value=true>Debit</b-form-radio>
                      <b-form-radio value=false>Credit</b-form-radio>

                    </b-form-radio-group>
                  </b-form-group>

                </b-col>
                <b-col sm="6" class="mt-4">
                  <b-form-group label=" ">
                    <b-form-checkbox v-model="form.model.NoDirectEntry" style="float:left">No Direct Entry</b-form-checkbox>
                    <b-form-checkbox v-model="form.model.Revaluation" style="float:left" class="ml-4">Revaluation</b-form-checkbox>

                  </b-form-group>

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
                    :items="this.$store.state.features.company.account.data"
                    :info="this.$store.state.features.company.account.listInfo"
                    :baseUrl="this.$store.state.features.company.account.baseUrl"
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

  </div>
</template>
<script>

  import DataGrid from '@/components/Tables/DataGrid';
  import SelectGrid from "@/components/tables/SelectGrid";
  import { mask } from 'vue-the-mask';
   import loginServices from '../services/loginservices'

  export default {
    name: 'User',
    layout: 'dashboard',
    components: {
      DataGrid, SelectGrid
    },
    directives: {
      mask
    },
    data: () => {
      return {
        caption: 'Financial Account',
        isForm: false,
        isShowSchedule: false,
        perPage: 20,
        selectfield: "",
        symbol: "",
        masking: "",
        //DataGrid HEADERS Declarations, you can
        headerFields: [
          { key: 'AccountId', label: 'Account Code', width: 300 },
          { key: 'Description', label: 'Description', classes: 'text-center' },
          {
            key: 'PostingType',
            label: 'Posting Type',
            _classes: 'text-center',
            width: 130,
            filter_select: true,
            filter_select_options: [
              { key: false, value: 'Balance Sheet' },
              { key: true, value: 'Profit Loss' }
            ]
          },
          {
            key: 'NormalBalance',
            label: 'Normal Balance',
            _classes: 'text-center',
            width: 100,
            filter_select: true,
            filter_select_options: [
              { key: true, value: 'Debit' },
              { key: false, value: 'Credit' }
            ]
          },
          {
            key: 'NoDirectEntry',
            label: 'No Direct Entry',
            _classes: 'text-center',
            width: 110,
            filter_select: true,
            filter_select_options: [
              { key: true, value: 'Yes' },
              { key: false, value: 'No' }
            ]
          },
          {
            key: 'Inactive',
            label: 'Status',
            _classes: 'text-center',
            width: 100,
            filter_select: true,
            filter_select_options: [
              { key: false, value: 'Active' },
              { key: true, value: 'Inactive' }
            ]
          }
        ],
        alert: '',
        ErrorMessage: '',
        form: {
          valid: false,
          isEdit: false,
          model: {
            AccountId: "",
            Segment1: "",
            Segment2: "",
            Segment3: "",
            Segment4: "",
            Segment5: "",
            Segment6: "",
            Segment7: "",
            Segment8: "",
            Segment9: "",
            Segment10: "",
            Description: "",
            PostingType: false,
            NormalBalance: 0,
            NoDirectEntry: "",
            InActive: false,
            Revaluation: false
          },
        }
      }
    },
    async mounted() {
      if (this.$refs.gridMain != null) {
        await this.$refs.gridMain.doRefresh()
      }
      await this.$store.dispatch("features/company/account_segment/actGetAccountSegment", "AccountSegment?");
      await this.$store.dispatch("features/central/company/actGetCompany", "Company?");
      //);
    },
    computed: {
      isSave() {
        return this.form.isEdit ? this.$store.state.roleaccess.AllowEdit : true;
      }
    },
    methods: {

      async handleGetData(url) {
        await this.$store.dispatch("features/company/account/actGetAccount", url);
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async onFormClose() {
        this.ErrorMessage = ''
        this.isForm = false
        this.form.isEdit = false;

        this.resetForm();
      },
      handleToast(toastTitle, style, message) {
        this.$bvToast.toast(message, {
          title: (toastTitle != '' ? toastTitle : 'Confirmation'),
          variant: (style != '' ? style : 'info'),
          //toaster: 'b-toaster-bottom-center',
          autoHideDelay: 5000,
          appendToast: false
        })
      },
      async onFormCreate() {
        this.resetForm();
        this.ErrorMessage = ''
        var maskstring = "";
        var companyName = this.$store.state.companyName;
        var Kode = '';
        this.$store.state.features.central.company.data.forEach(function (row, index) {
          if (row.CompanyName == companyName)
            Kode = row.CoaSymbol
        });

        this.$store.state.features.company.account_segment.data.forEach(function (row, index) {
          if (index > 0)
            maskstring += Kode;
          for (var i = 0; i < row.Length; i++) {
            maskstring += "#";
          }
        });
        this.masking = maskstring;

        this.form.model.AccountId = "";
        this.form.model.Segment1 = "",
          this.form.model.Segment2 = "",
          this.form.model.Segment3 = "",
          this.form.model.Segment4 = "",
          this.form.model.Segment5 = "",
          this.form.model.Segment6 = "",
          this.form.model.Segment7 = "",
          this.form.model.Segment8 = "",
          this.form.model.Segment9 = "",
          this.form.model.Segment10 = "",
          this.form.model.Description = "";
        this.form.model.PostingType = false;
        this.form.model.NormalBalance = true;
        this.form.model.NoDirectEntry = false;
        this.form.model.InActive = false;
        this.form.model.Revaluation = false;

        this.symbol = Kode;
        this.form.isEdit = false;
        this.isForm = true
      },
      async handleStatus(e) {
        if (this.form.model.InActive) {
          this.$bvModal.msgBoxConfirm('Are you sure?')
            .then(value => {
              if (value) {
                this.form.model.InActive = value;
              }
            })
            .catch(err => {
              // An error occurred
            })
        }
      },
      async handleEdit(row) {
        this.ErrorMessage = '';
        var maskstring = "";
        var Kode = "";
        var regex = /^[0-9]*$/;

        for (var i = 0; i < row.AccountId.length; i++) {
          if (!regex.test(row.AccountId[i])) {
            this.symbol = row.AccountId[i];
            Kode += row.AccountId[i];
          } else {
            Kode += "#"
          }

        }
        this.masking = Kode;

        this.form.model.AccountId = row.AccountId;
        this.form.model.Description = row.Description;
        this.form.model.PostingType = row.PostingType == "Profit Loss" ? true : false;
        this.form.model.NormalBalance = row.NormalBalance == "Debit" ? true : false;
        this.form.model.NoDirectEntry = row.NoDirectEntry == "Yes" ? true : false;
         this.form.model.InActive = (row.Inactive.toLowerCase().trim() == 'inactive' ? true : false);


        this.form.isEdit = true;
        this.isForm = true;
      },
      validateState({ dirty, validated, valid = null }) {

        return dirty || validated ? valid : null;
      },
      resetForm() {
        this.form.model.AccountId = "";

        this.$nextTick(() => {
          this.$refs.observer.reset();
        })
      },
      async doDelete(row) {
        await this.$store.dispatch("features/company/account/actDelete", row);

        var response = this.$store.state.features.company.account.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridMain.doRefresh();

          this.handleToast('Confirmation', 'success', "Successfully deleted");
        }
      },
      async handleDelete(row) {
        this.$bvModal.msgBoxConfirm('Are you sure?', {
          title: 'Delete Confirmation', size: 'sm', buttonSize: 'sm',
          okVariant: 'blue', centered: true,
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0',
        })
          .then(ok => {
            if (ok) {
              this.doDelete(row);
            }
          })
          .catch(err => {
            // An error occurred
          })
      },
      async segmentData(i, value) {
        switch (i) {
          case 1:
            this.form.model.Segment1 = value;
            break;
          case 2:
            this.form.model.Segment2 = value;
            break;
          case 3:
            this.form.model.Segment3 = value;
            break;
          case 4:
            this.form.model.Segment4 = value;
            break;
          case 5:
            this.form.model.Segment5 = value;
            break;
          case 6:
            this.form.model.Segment6 = value;
            break;
          case 7:
            this.form.model.Segment7 = value;
            break;
          case 8:
            this.form.model.Segment8 = value;
            break;
          case 9:
            this.form.model.Segment9 = value;
            break;
          case 10:
            this.form.model.Segment10 = value;
            break;
        }
      },
      async onSubmit() {

        var myarray = this.form.model.AccountId.split(this.symbol);
        for (var i = 0; i < myarray.length; i++) {
          await this.segmentData(i + 1, myarray[i]);
        }

        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/company/account/actUpdateAccount",
            this.form.model
          );
          var response = this.$store.state.features.company.account
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridMain.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully updated");

          }
        } else {
          await this.$store.dispatch(
            "features/company/account/actCreateAccount", this.form.model);

          var response = this.$store.state.features.company.account.resultCreate;
          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);

          } else {
            this.isForm = false;
            this.form.isEdit = false;
            this.$refs.gridMain.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully saved");
          }
        }
      },
    }
  }
</script>
