<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Tax REfference</span>
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
                  <label for="StartDate">Start Date</label>
                    <b-input-group>
                        <b-form-input
                          v-model="form.display.TaxReffDate"
                          type="text"
                          :placeholder="dateFormatString" class="text-center"
                          size="sm"
                          readonly
                        ></b-form-input>
                        <b-input-group-append>
                          <b-form-datepicker
                            v-model="form.model.StartDate"                            
                            button-only
                            size="sm"
                            left
                            locale="en-US"   
                            @input="dateChanged"        
                          ></b-form-datepicker>
                        </b-input-group-append>
                      </b-input-group>
                </b-col>
                <b-col sm="2">
                  <validation-provider name="Doc Length"
                                       :rules="{ required: true,regex:/^0*(?:[1-9][0-9]?|100)$/ }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="DocLength">Doc Length</label>
                      <b-form-input name="DocLength"
                                    type="number"
                                    placeholder="Doc Length"
                                    v-model="form.model.DocLength"
                                    :disabled="(form.model.ReffNoStart!=0 || form.model.ReffNoEnd!=0 || form.isEdit)"
                                    :state="validateState(validationContext)"
                                    aria-describedby="DocLength-feedback"
                                    size="sm" />
                      <b-form-invalid-feedback id="DocLength-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <b-col sm="2" v-if="form.model.DocLength > 0">
                  <validation-provider name="Reff No Start"
                                       :rules="{ required: true,max:parseInt(form.model.DocLength),min:parseInt(form.model.DocLength) }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="ReffNoStart">Reff No Start</label>
                      <b-form-input name="Reff No Start"
                                    type="number"
                                    placeholder="Reff No Start"
                                    v-model="form.model.ReffNoStart"
                                    :state="validateState(validationContext)"
                                    aria-describedby="ReffNoStart-feedback"
                                    size="sm" />
                      <b-form-invalid-feedback id="ReffNoStart-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="2" v-if="form.model.DocLength > 0">
                  <validation-provider name="Reff No End"
                                       v-model="form.model.ReffNoEnd"
                                       :rules="{ required: true ,max:parseInt(form.model.DocLength),min:parseInt(form.model.DocLength)}"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="ReffNoEnd">Reff No End</label>
                      <b-form-input name="Reff No End"
                                    type="number"
                                    placeholder="Reff No End"
                                    v-model="form.model.ReffNoEnd"
                                    :state="validateState(validationContext)"
                                    aria-describedby="ReffNoEnd-feedback"
                                    size="sm" />
                      <b-form-invalid-feedback id="ReffNoEnd-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
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
                                     v-model="form.model.Status"
                                     :state="validateState(validationContext)"
                                     size="sm"
                                     :options="[{value:0,text:'Active'},{value:1,text:'Inactive'}]"
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
                    :items="this.$store.state.features.company.tax_refference_number.data"
                    :info="this.$store.state.features.company.tax_refference_number.listInfo"
                    :baseUrl="this.$store.state.features.company.tax_refference_number.baseUrl"
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
  import DataGrid from '@/components/Tables/DataGrid'
  import VueElementLoading from 'vue-element-loading'
  import moment from 'moment'
  import loginServices from '../services/loginservices'

  export default {
    name: 'Tax-Refferences',
    layout: 'dashboard',
    components: { DataGrid, VueElementLoading },
    data() {      
     return {
        dateFormatString:'DD/MM/YYYY',
        caption: 'Tax Refferences',
        blockLoader: false,
        isForm: false,
        value: '',
        countries: [],
        headerFields: [
          { key: 'StartDate', label: 'Start Date', _classes: 'text-center', width: 120, filter_date:true, date_format:'DD/MM/YYYY' },
          { key: 'ReffNoStart', label: 'Reff No Start',filter_number:true, width: 300, _classes: 'text-center'  },
          { key: 'ReffNoEnd', label: 'Reff No End',filter_number:true, width: 300, _classes: 'text-center'  },
          { key: 'LastNo', label: 'Last Used No', filter_number: true, width: 300, _classes: 'text-center' },
          {
          key: 'Status',
          label: 'Status',
          _classes: 'text-center',
          width: 100,
          filter_select: true,
          filter_select_options: [
            { key: 0, value: 'Active' },
            { key: 1, value: 'inactive' }
          ]
        }
        ],
        form: {
          valid: false,
          isEdit: false,
          model: {
            TaxRefferenceId: null,
            StartDate: "",
            ReffNoStart: null,
            ReffNoEnd: null,
            DocLength: 0,
            LastNo: "",
            Status: 1,            
          },
          display:{
            TaxReffDate : ""
          }
        }
      }
    },
     computed: {
      isSave() {
        return this.form.isEdit ? this.$store.state.roleaccess.AllowEdit : true;
      }
    },
    async mounted() {
      if (this.$refs.gridMain != null) {
        await this.$refs.gridMain.doRefresh()
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
          title: toastTitle != '' ? toastTitle : 'Confirmation',
          variant: style != '' ? style : 'info',
          //toaster: 'b-toaster-bottom-center',
          autoHideDelay: 5000,
          appendToast: false
        })
      },
      async handleGetData(url) {
        await this.$store.dispatch('features/company/tax_refference_number/actGet', url)
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async onFormClose() {
        this.ErrorMessage = ''
        this.isForm = false
        this.form.isEdit = false

        this.resetForm()
      },
      validateState({ dirty, validated, valid = null }) {
        return dirty || validated ? valid : null;
      },
      resetForm() {
        this.$nextTick(() => {
          this.$refs.observer.reset();
        })
      },
      async dateChanged(){
         this.form.display.TaxReffDate = '';
         if(this.form.model.StartDate != null)
          this.form.display.TaxReffDate = moment(this.form.model.StartDate).format(this.dateFormatString)
      },
      async onFormCreate() {
        this.ErrorMessage = '';
        this.resetForm();

        this.form.model.TaxRefferenceId = null;
        this.form.model.StartDate = moment().format('YYYY/MM/DD');
        this.form.model.ReffNoStart = 0;
        this.form.model.ReffNoEnd = 0;
        this.form.model.DocLength = 0;
        this.form.model.LastNo = 0;
        this.form.model.Status = 0;
        this.form.isEdit = false
        this.isForm = true

        this.form.display.TaxReffDate = moment().format(this.dateFormatString);
      },
      async handleEdit(row) {
         this.ErrorMessage = '';
        this.resetForm();
         this.form.model.TaxRefferenceId = row.TaxRefferenceId;
        this.form.model.StartDate = row.StartDate;
        this.form.model.ReffNoStart = row.ReffNoStart;
        this.form.model.ReffNoEnd = row.ReffNoEnd;
        this.form.model.DocLength = row.DocLength;
        this.form.model.LastNo = row.LastNo;
        //this.form.model.Status = row.Status;
        this.form.model.Status = (row.Status.toLowerCase() == 'inactive' ? 1 : 0);

        this.form.display.TaxReffDate = moment(row.StartDate).format(this.dateFormatString);

        this.isForm = true;
        this.form.isEdit = true;
      },
      async doDelete(row) {
        this.showLoader(true);

        await this.$store.dispatch(
          "features/company/tax_refference_number/actDelete",
          row
        );

        var response = this.$store.state.features.company.tax_refference_number.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridMain.doRefresh();
          this.resetForm();

          this.handleToast('Confirmation', 'success', "Successfully deleted");
        }

        this.showLoader(false);
      },
      async handleDelete(row) {
        this.$bvModal.msgBoxConfirm('Are you sure ?', {
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
      async onSubmit() {
        this.showLoader(true);

        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/company/tax_refference_number/actUpdate",
            this.form.model
          );
          var response = this.$store.state.features.company.tax_refference_number
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', (response.data.ErrorDescription != undefined ? response.data.ErrorDescription : 'Update failed !'));
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridMain.doRefresh();
            this.resetForm();

            this.handleToast('Confirmation', 'success', "Successfully updated");

          }
        } else {
          await this.$store.dispatch(
            "features/company/tax_refference_number/actCreate",
            this.form.model
          );

          var response = this.$store.state.features.company.tax_refference_number.resultCreate;

          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', (response.data.ErrorDescription != undefined ? response.data.ErrorDescription : 'Submit failed !'));

          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridMain.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully saved");
          }
        }

        this.showLoader(false);
      },
    },
  }
</script>
