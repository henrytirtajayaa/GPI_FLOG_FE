<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Container Rental Setup</span>
                <small>{{ (form.isEdit) ? "Edit" : "New" }}</small>
                <div right style="float:right;">
                  <b-button variant="blue" type="submit" v-if="isSave">
                    <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                  </b-button>
                  <b-button @click="onFormClose">
                    <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                  </b-button>
                </div>
              </div>
              <b-row> 
                <b-col sm="3">
                        <validation-provider name="Transaction Type"
                                             :rules="{ required: true }"
                                             v-slot="validationContext">
                          <b-form-group>
                            <label for="TrxType">Transaction Type</label>
                            <b-form-select name="Transaction Type"
                                           v-model="form.model.TransactionType"
                                           :state="validateState(validationContext)"
                                           :plain="true"
                                           :options="listTransactionType"
                                           size="sm"
                                           aria-describedby="trxtype-feedback" />
                            <b-form-invalid-feedback id="trxtype-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
                      </b-col>
                    
                <b-col sm="3">
                   <validation-provider
                          name="Customer Uofm Schedule"
                          :rules="{ required: true }"
                          v-slot="validationContext"
                        >
                          <label>Customer Uofm Schedule</label>
                          <b-input-group prepend>
                            <b-form-input
                              v-model="form.model.UomScheduleCode"
                              size="sm"
                              readonly
                              :state="validateState(validationContext)"
                              aria-describedby="UomScheduleCode-feedback"
                            ></b-form-input>
                            <b-input-group-append>
                              <b-button
                                variant="outline-success"
                                size="sm"
                                @click="onModalSearchUom('UomScheduleCode')"
                              >
                                <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                              </b-button>
                            </b-input-group-append>
                            <b-form-invalid-feedback
                              id="UomScheduleCode-feedback"
                            >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                          </b-input-group>
                        </validation-provider>
                </b-col>
              </b-row>
              <div>
                <div class="mt-3">
                  <b-card-group deck>
                    <!--Request-->
                    <b-card class="text-left" border-variant="success">
                      <template v-slot:header>
                        <h5 class="mb-0">Request</h5>
                      </template>
                      <b-card-text>
                        <validation-provider
                          name="Request Document No."
                          :rules="{ required: true }"
                          v-slot="validationContext"
                        >
                          <label> Document No.</label>
                          <b-input-group prepend>
                            <b-form-input
                              v-model="form.model.RequestDocNo"
                              size="sm"
                              readonly
                              :state="validateState(validationContext)"
                              aria-describedby="RequestDocNo-feedback"
                            ></b-form-input>
                            <b-input-group-append>
                              <b-button
                                variant="outline-success"
                                size="sm"
                                @click="onModalSearchDocNo('RequestDocNo')"
                              >
                                <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                              </b-button>
                            </b-input-group-append>
                            <b-form-invalid-feedback
                              id="RequestDocNo-feedback"
                            >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                          </b-input-group>
                        </validation-provider>
                      </b-card-text>
                    </b-card>

                    <!--Delivery-->
                    <b-card class="text-left" border-variant="success">
                      <template v-slot:header>
                        <h5 class="mb-0">Delivery</h5>
                      </template>
                      <b-card-text>
                        <validation-provider
                          name="Delivery Document No."
                          :rules="{ required: true }"
                          v-slot="validationContext"
                        >
                          <label> Document No.</label>
                          <b-input-group prepend>
                            <b-form-input
                              v-model="form.model.DeliveryDocNo"
                              size="sm"
                              readonly
                              :state="validateState(validationContext)"
                              aria-describedby="DeliveryDocNo-feedback"
                            ></b-form-input>
                            <b-input-group-append>
                              <b-button
                                variant="outline-success"
                                size="sm"
                                @click="onModalSearchDocNo('DeliveryDocNo')"
                              >
                                <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                              </b-button>
                            </b-input-group-append>
                            <b-form-invalid-feedback
                              id="DeliveryDocNo-feedback"
                            >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                          </b-input-group>
                        </validation-provider>
                      </b-card-text>
                    </b-card>

                    <!--Negotiation Sheet-->
                    <b-card class="text-left" border-variant="success">
                      <template v-slot:header>
                        <h5 class="mb-0">Closing</h5>
                      </template>
                      <b-card-text>
                      <validation-provider
                          name="Closing Document No."
                          :rules="{ required: true }"
                          v-slot="validationContext"
                        >
                        <label> Document No.</label>
                        <b-input-group prepend>
                          <b-form-input
                            v-model="form.model.ClosingDocNo"
                            size="sm"
                            :state="validateState(validationContext)"
                            readonly
                            aria-describedby="ClosingDocNo-feedback"
                          ></b-form-input>
                          <b-input-group-append>
                            <b-button
                              variant="outline-success"
                              size="sm"
                              @click="onModalSearchDocNo('ClosingDocNo')"
                            >
                              <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                            </b-button>
                          </b-input-group-append>
                          <b-form-invalid-feedback
                              id="ClosingDocNo-feedback"
                            >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-input-group>
                        </validation-provider>
                      </b-card-text>
                    </b-card>
                  </b-card-group>
                  <br />
                </div>
              </div>
              <b-row>
                <b-col sm="4" lg="2">
                  <validation-provider name="CustomerFreeUsageDays"
                                       :rules="{ required:true, min_value : 1 }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="CustomerFreeUsageDays">Customer Free Time</label>
                      <b-input-group size="sm" append="Day">
                      <b-form-input name="CustomerFreeUsageDays"
                                    type="number"
                                    placeholder="Customer Free Usage Days"
                                    v-model="form.model.CustomerFreeUsageDays"
                                    size="sm"
                                    :state="validateState(validationContext)"
                                    aria-describedby="CustomerFreeUsageDays-feedback" /></b-input-group>
                      <b-form-invalid-feedback id="CustomerFreeUsageDays-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="4" lg="2">
                  <validation-provider name="ShippingLineFreeUsageDays"
                                       :rules="{ required:true, min_value : 1 }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="ShippingLineFreeUsageDays">Shipping Line Free Time</label>
                      <b-input-group size="sm" append="Day">
                      <b-form-input name="ShippingLineFreeUsageDays"
                                    type="number"
                                    placeholder="Shipping Line Free Usage Days"
                                    v-model="form.model.ShippingLineFreeUsageDays"
                                    size="sm"
                                    :state="validateState(validationContext)"
                                    aria-describedby="ShippingLineFreeUsageDays-feedback" /></b-input-group>
                      <b-form-invalid-feedback id="ShippingLineFreeUsageDays-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="4" lg="2">
                  <validation-provider name="CntOwnerFreeUsageDays"
                                       :rules="{ required:true, min_value : 1 }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="CntOwnerFreeUsageDays">Container Owner Free Time</label>
                      <b-input-group size="sm" append="Day">
                      <b-form-input name="CntOwnerFreeUsageDays"
                                    type="number"
                                    placeholder="Cnt Owner Free Usage Days"
                                    v-model="form.model.CntOwnerFreeUsageDays"
                                    size="sm"
                                    :state="validateState(validationContext)"
                                    aria-describedby="CntOwnerFreeUsageDaysfeedback" /></b-input-group>
                      <b-form-invalid-feedback id="CntOwnerFreeUsageDays-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
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
          <DataGrid ref="gridCompany"
                    :fields="headerFields"
                    :items="this.$store.state.features.company.container_rental_setup.data"
                    :info="this.$store.state.features.company.container_rental_setup.listInfo"
                    :baseUrl="this.$store.state.features.company.container_rental_setup.baseUrl"
                    :actGetData="handleGetContainerRentalSetup"
                    :actCreate="onFormCreate"
                    :actEditRow="handleEdit"
                    :actDeleteRow="handleDelete"
                    :disableNewButton="!this.$store.state.roleaccess.AllowNew"
                    :isEdit="this.$store.state.roleaccess.AllowEdit"
                    :isDelete="this.$store.state.roleaccess.AllowDelete"
                    addTableClasses="table-bordered"
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
    <!-- Modal -->
    <DocNumberModal ref="dlgDocNo" :actSelectedRow="onSelectedDocNo"></DocNumberModal>
    <UomModal ref="dlgUom" :actSelectedRow="onSelectedUom"></UomModal>
    <!-- Modal -->
  </div>
</template>
<script>

  import DataGrid from '@/components/Tables/DataGrid';
  import VueElementLoading from 'vue-element-loading'
  import loginServices from '../../services/loginservices'
  import { DocNumberModal, UomModal } from "@/pages/modal/index.js";

  export default {
    name: 'ContainerRentalSetup',
    layout: 'dashboard',
    components: {
      DataGrid, VueElementLoading, DocNumberModal, UomModal
    },
    data: () => {
      return {
        caption: 'Container Rental Setup',
        blockLoader: false,
        isForm: false,
        listTransactionType: [],
        //DataGrid HEADERS Declarations, you can
        headerFields: [
          {
            key: 'TransactionType',
            label: 'Transaction Type',
            classes: 'text-center',
            filter: true
          },
          {
            key: 'RequestDocNo',
            label: 'Request Doc.No',
            width: 200,
            filter: true
          },
          {
            key: 'DeliveryDocNo',
            label: 'Delivery Doc.No',
            width: 200,
            filter: true
          },
          {
            key: 'ClosingDocNo',
            label: 'Closing Doc.No',
            width: 200,
            filter: true
          },
          {
            key: 'UomScheduleCode',
            label: 'Uom Schedule Code',
            width: 200,
            filter: true
          }
        ],
        alert: '',
        ErrorMessage: '',
        form: {
          valid: false,
          isEdit: false,
          model: {
                SetupContainerRentalId : null,
                TransactionType : '',
                RequestDocNo : '',
                DeliveryDocNo : '',
                ClosingDocNo : '',
                UomScheduleCode : '',
                CustomerFreeUsageDays : '',
                ShippingLineFreeUsageDays : '',
                CntOwnerFreeUsageDays : ''
          },
        }
      }
    },
    computed: {
      isSave() {
        return this.form.isEdit ? this.$store.state.roleaccess.AllowEdit : true;
      }
    },
    async mounted() {
      if (this.$refs.gridCompany != null) {
        await this.$refs.gridCompany.doRefresh();
      }

      // START GET TRANSACTION TYPE
      var arrTransactionType = [];
      await this.$store.dispatch(
        "features/company/transaction_type/actGetData",
        "MSTransactionType?"
      );
      var data = this.$store.state.features.company.transaction_type.data;

      data.forEach(function(row){
        arrTransactionType.push({ value: row.TransactionType, text: row.TransactionType });
      });
      this.listTransactionType = arrTransactionType;
      // END GET TRANSACTION TYPE

    },
    methods: {
      async onModalSearchDocNo(row) {
        this.$refs.dlgDocNo
          .open(row, this.form.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onSelectedDocNo(item, modelReff) {
        this.form.model[modelReff] = item.DocumentId;
      },
      async onModalSearchUom(row) {
        this.$refs.dlgUom
          .open(row, this.form.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onSelectedUom(item, modelReff) {
        this.form.model[modelReff] = item.UomScheduleCode;
      },
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
          title: (toastTitle != '' ? toastTitle : 'Confirmation'),
          variant: (style != '' ? style : 'info'),
          //toaster: 'b-toaster-bottom-center',
          autoHideDelay: 5000,
          appendToast: false
        })
      },
      async handleGetContainerRentalSetup(url) {
        
        await this.$store.dispatch('features/company/container_rental_setup/actGet', url)
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
        
       
      },
      async onFormClose() {
        this.ErrorMessage = ''
        this.isForm = false
        this.form.isEdit = false;

        this.resetForm();
      },
      async onFormCreate() {
        this.ErrorMessage = ''
        this.form.model.SetupContainerRentalId = ''
        this.form.model.TransactionType = ''
        this.form.model.RequestDocNo = ''
        this.form.model.DeliveryDocNo = ''
        this.form.model.ClosingDocNo = ''
        this.form.model.UomScheduleCode = ''
        this.form.model.CustomerFreeUsageDays = ''
        this.form.model.ShippingLineFreeUsageDays = ''
        this.form.model.CntOwnerFreeUsageDays = ''
        this.form.isEdit = false
        this.isForm = true
        this.resetForm();
      },

      async handleEdit(row) {
        this.ErrorMessage = '';
        this.isForm = true;
        this.form.model.SetupContainerRentalId = row.SetupContainerRentalId
        this.form.model.TransactionType = row.TransactionType
        this.form.model.RequestDocNo = row.RequestDocNo
        this.form.model.DeliveryDocNo = row.DeliveryDocNo
        this.form.model.ClosingDocNo = row.ClosingDocNo
        this.form.model.UomScheduleCode = row.UomScheduleCode
        this.form.model.CustomerFreeUsageDays = row.CustomerFreeUsageDays
        this.form.model.ShippingLineFreeUsageDays = row.ShippingLineFreeUsageDays
        this.form.model.CntOwnerFreeUsageDays = row.CntOwnerFreeUsageDays
        this.form.isEdit = true;
      },
      validateState({ dirty, validated, valid = null }) {
        return dirty || validated ? valid : null;
      },
      resetForm() {
        this.$nextTick(() => {
          this.$refs.observer.reset();
        })
      },
      async doDelete(row) {
        this.showLoader(true);

        await this.$store.dispatch(
          "features/company/container_rental_setup/actDelete",
          row
        );

        var response = this.$store.state.features.company.container_rental_setup.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridCompany.doRefresh();
          this.resetForm();

          this.handleToast('Confirmation', 'success', "Successfully deleted");
        }

        this.showLoader(false);
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
      async onSubmit() {
        this.showLoader(true);

        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/company/container_rental_setup/actUpdate",
            this.form.model
          );
          var response = this.$store.state.features.company.container_rental_setup
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridCompany.doRefresh();
            this.resetForm();

            this.handleToast('Confirmation', 'success', "Successfully updated");

          }
        } else {
          await this.$store.dispatch(
            "features/company/container_rental_setup/actCreate",
            this.form.model
          );

          var response = this.$store.state.features.company.container_rental_setup.resultCreate;

          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);

          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridCompany.doRefresh();
            this.resetForm();

            this.handleToast('Confirmation', 'success', "Successfully saved");
          }
        }

        this.showLoader(false);
      },
    }
  }
</script>
