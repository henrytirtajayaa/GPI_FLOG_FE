<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <b-card no-body v-show="isForm" v-if="isPrint==false">
      <!-- TAB Customer BEGIN -->
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
          <b-row>
            <b-col sm="12">
              <b-card>
                <div slot="header">
                  <span class="font-weight-bold">{{formCaption}}</span>
                  <small>{{ (form.isEdit) ? "Edit" : "New" }}</small>
                  <div right style="float:right;">

                    <!-- <b-button variant="primary" v-if="form.model.DocumentNo != ''" @click="handlePrintOut" v-b-tooltip.hover title="View Print Out">
                      <font-awesome-icon :icon="['fas', 'print']" />
                    </b-button>
                    <b-button variant="info" v-if="form.model.DocumentNo != ''" @click="onModalHistory" v-b-tooltip.hover title="View History">
                      <font-awesome-icon :icon="['fas', 'paw']" />
                    </b-button> -->
                    <b-button variant="green" @click="clickPosting" v-if="form.isEdit&&form.model.Status==20&&HasCheckoutApproval==false" v-b-tooltip.hover title="Submit Container Rental Request">
                      <font-awesome-icon :icon="['fas', 'check-circle']" />&nbsp;Submit
                    </b-button>
                    <b-button variant="red" v-b-modal.modal-void-reason v-if="form.isEdit&&form.model.Status==21">
                      <font-awesome-icon :icon="['fas', 'ban']" v-b-tooltip.hover title="Cancel this Container Request" />&nbsp;Cancel Container
                    </b-button>
                    <b-button variant="blue" type="submit" v-if="form.model.Status==0||form.model.Status==1||form.model.Status==20||!form.isEdit">
                      <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                    </b-button>
                    <b-button @click="onFormClose">
                      <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                    </b-button>
                  </div>
                </div>
                <b-alert show variant="danger" v-if="form.alert.Status=='Disapproved'"><a href="#" class="alert-link">{{form.alert.UserFullName}} : </a>{{form.alert.Desc}}</b-alert>
                <b-row>
                  <!-- BEGIN FORM -->
                  <b-col sm="10">
                    <b-row>
                      <b-col sm="3">
                        <b-form-group>
                          <label for="DocumentNo">Document No</label>
                          <b-form-input name="Document No"
                                        type="text"
                                        placeholder="Document No"
                                        v-model="form.model.DocumentNo"
                                        class="font-weight-bold text-center"
                                        readonly
                                        variant="blue"
                                        :disabled="!actionButton.AllowEdit"
                                        size="sm" />
                        </b-form-group>
                      </b-col>
                      <b-col sm="3">
                        <label>Document Date</label>
                        <b-input-group>
                          <b-form-input v-model="form.display.DocumentDate"
                                        type="text"
                                        :placeholder="dateFormatString"
                                        class="text-center"
                                        size="sm"
                                        readonly
                                        aria-describedby="doc-date-feedback"></b-form-input>
                          <b-input-group-append v-if="actionButton.AllowEdit && !form.StatusApproval && form.model.Status!=20 && form.model.Status!=21 && form.model.Status!=44">
                            <b-form-datepicker v-model="form.model.DocumentDate"
                                               button-only
                                               size="sm"
                                               left
                                               locale="en-US"
                                               @input="dateChanged"
                                               :min="minCalendarDate"
                                               dark></b-form-datepicker>
                          </b-input-group-append>
                        </b-input-group>
                      </b-col>
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
                                           :disabled="!actionButton.AllowEdit || form.isEdit || dataDetails!=''"
                                           aria-describedby="trxtype-feedback" />
                            <b-form-invalid-feedback id="trxtype-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col sm="6">
                        <b-card sm="10" style="margin:0; padding:0;">
                          <b-row>
                            <b-col sm="12">
                              <label>Customer Code</label>
                              <b-form-input v-model="form.model.CustomerId" class="font-weight-bold" size="sm" v-show="false"></b-form-input>
                              <validation-provider name="Customer Code"
                                                   :rules="{ required: true }"
                                                   v-slot="validationContext">
                                <b-input-group prepend>
                                  <b-form-input v-model="form.model.CustomerCode"
                                                class="font-weight-bold"
                                                :state="validateState(validationContext)"
                                                readonly
                                                size="sm"
                                                aria-describedby="Customer-feedback"></b-form-input>
                                  <b-input-group-append v-if="actionButton.AllowEdit && form.model.Status!=21 && form.model.Status!=44">
                                    <b-button variant="outline-primary"
                                              size="sm"
                                              :disabled="!actionButton.AllowEdit"
                                              @click="onModalSearchCustomer('CustomerCode')">
                                      <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                    </b-button>
                                  </b-input-group-append>
                                  <b-form-invalid-feedback id="Customer-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-input-group>
                              </validation-provider>
                            </b-col><br>

                            <b-col sm="12">
                              <label for="Description">Customer Name</label>
                              <b-input-group :prepend="form.CurrencySymbol" size="sm">
                                <b-form-input v-model="form.model.CustomerName"
                                              class="font-weight-bold"
                                              readonly
                                              size="sm"
                                              aria-describedby="Currency-feedback"></b-form-input>
                              </b-input-group>
                            </b-col><br>

                            <b-col sm="12">
                              <label>Address Code</label>
                              <validation-provider name="Address Code"
                                                   :rules="{ required: true }"
                                                   v-slot="validationContext">
                                <b-input-group prepend>
                                  <b-form-input v-model="form.model.AddressCode"
                                                class="font-weight-bold"
                                                :state="validateState(validationContext)"
                                                readonly
                                                size="sm"
                                                aria-describedby="AddressCode-feedback"></b-form-input>
                                  <b-input-group-append>
                                    <b-button variant="outline-primary"
                                              size="sm"
                                              v-if="actionButton.AllowEdit && form.model.Status!=21 && form.model.Status!=44"
                                              :disabled="!actionButton.AllowEdit"
                                              @click="onModalSearchCustomerAddress('AddressCode', 'AddressCode')">
                                      <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                    </b-button>
                                    <b-button variant="outline-primary"
                                              size="sm"
                                              :disabled="!actionButton.AllowEdit"
                                              @click="onModalSearchCustomerAddressExtension">
                                      <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>
                                    </b-button>
                                  </b-input-group-append>
                                  <b-form-invalid-feedback id="AddressCode-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-input-group>
                              </validation-provider>
                            </b-col><br>

                            <b-col sm="12" hidden>
                              <label>Billing Address</label>
                              <b-form-input v-model="form.model.BillToAddressCode" size="sm" disabled></b-form-input>
                            </b-col>
                            <b-col sm="12" hidden>
                              <label>Shipping Address</label>
                              <b-form-input v-model="form.model.ShipToAddressCode" size="sm" disabled></b-form-input>
                            </b-col>

                          </b-row>
                        </b-card>
                      </b-col>

                      <b-col sm="6">
                        <b-card sm="10" style="margin:0; padding:0;">
                          <b-row>
                            <b-col sm="12">
                              <label for="SalesPerson">Sales Person</label>
                              
                              <b-input-group size="sm">
                                <b-form-input v-model="form.model.SalesCode"
                                              class="font-weight-bold"
                                              readonly
                                              size="sm"></b-form-input>
                                  <b-input-group-append v-if="actionButton.AllowEdit && form.model.Status!=21 && form.model.Status!=44">
                                    <b-button variant="outline-primary"
                                              size="sm"
                                              :disabled="!actionButton.AllowEdit"
                                              @click="onModalSearchSalesPerson('SalesCode')">
                                      <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                    </b-button>
                                  </b-input-group-append>
                                  </b-input-group>
                            </b-col><br>

                            <b-col sm="12">
                              <label>Container Owner Name</label>
                              <b-form-input v-model="form.model.VendorId" class="font-weight-bold" size="sm" v-show="false"></b-form-input>
                              <b-form-input v-model="form.model.VendorCode" class="font-weight-bold" size="sm" v-show="false"></b-form-input>
                              <validation-provider name="Container Owner Name"
                                                   :rules="{ required: true }"
                                                   v-slot="validationContext">
                                <b-input-group prepend>
                                  <b-form-input v-model="form.model.VendorName"
                                                class="font-weight-bold"
                                                :state="validateState(validationContext)"
                                                readonly
                                                size="sm"
                                                aria-describedby="VendorName-feedback"></b-form-input>
                                  <b-input-group-append v-if="actionButton.AllowEdit && form.model.Status!=21 && form.model.Status!=44">
                                    <b-button variant="outline-primary"
                                              size="sm"
                                              :disabled="!actionButton.AllowEdit"
                                              @click="onModalSearchVendor('VendorCode')">
                                      <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                    </b-button>
                                  </b-input-group-append>
                                  <b-form-invalid-feedback id="VendorName-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-input-group>
                              </validation-provider>
                            </b-col><br>
                          </b-row>
                        </b-card>
                      </b-col>
                    </b-row><br>
                    
                  </b-col>
                  <!-- END DOCUMENT STATUS -->
                  <b-col sm="2" v-if="form.isEdit">
                    <b-card bg-variant="dark" text-variant="white" 
                    :title="form.model.Status == 44 ? 'CANCELED' : (form.model.Status == 21 ? 'SUBMITTED': (form.model.Status == 210 ? 'COMPLETED' : 'OPEN'))">
                      <b-card-text>
                        <div v-if="form.model.Status == 44">
                          <label><small>Canceled By :</small></label><br />
                          <b>{{form.display.CanceledByName}}</b><br />
                          <label><small>Canceled Date :</small></label><br />
                          <b>{{form.display.CanceledDate}}</b><br />
                        </div>
                        <div v-else>
                          <label><small>Created By :</small></label><br />
                          <b>{{form.display.CreatedByName}}</b><br />
                          <label><small>Created Date :</small></label><br />
                          <b>{{form.display.CreatedDate}}</b>
                        </div>
                      </b-card-text>
                    </b-card>
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col>
                    <b-button variant="yellow" size="sm" type="button" @click="onAddContainer" v-if="actionButton.AllowEdit" 
                    :disabled="form.model.CustomerId == '' || form.model.Status==21 || form.model.Status==44">
                      <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;Add Container
                    </b-button>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col class="table-responsive">
                    <table id="table-detail"
                           width="100%"
                           class="table-light table-striped table-hover table-bordered">

                      <thead>
                        <tr>
                          <th class="text-center" rowspan="2" style="vertical-align:middle;">
                            <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
                          </th>
                          <th class="text-left text-uppercase">Container Type Code</th>
                          <th class="text-left text-uppercase">Container Type Name</th>
                          <th class="text-left text-uppercase" style="width:15%">Unit of Measurement</th>
                          <th class="text-center text-uppercase" rowspan="2">Quantity</th>
                        </tr>
                        <tr>
                          <th class="text-left text-uppercase" colspan="3">Remarks</th>
                        </tr>

                      </thead>
                      <tbody class="position-relative">
                        <template v-for="(item, itemIndex) in dataDetails">
                          <tr>
                            <td class="text-center" rowspan="2">
                              <a href="javascript:;"
                                 v-b-tooltip.hover title="Delete"
                                 style="text-decoration:none;color:red;"
                                 @click="DeleteContainer(itemIndex)" 
                                 v-show="actionButton.AllowEdit" 
                                 v-if="form.model.Status==0||form.model.Status==1||form.model.Status==20"
                                 :disabled="!actionButton.AllowEdit">
                                <font-awesome-icon size="lg"
                                                   :icon="['fas', 'trash-alt']"
                                                   variant="danger" />
                              </a>
                            </td>
                            <td>
                              {{ item.ContainerCode }}
                            </td>
                            <td>
                              {{ item.ContainerName }}
                            </td>
                            <td>
                              <validation-provider name="UOM"
                                             :rules="{ required: true }"
                                             v-slot="validationContext">
                              <b-form-group>
                                <b-form-select name="UOM"
                                              style="padding:0; margin:10px 0 0 0; border:0; cursor:pointer;"
                                              v-model="item.UomCode"
                                              :state="validateState(validationContext)"
                                              :plain="true"
                                              :options="listUOM"
                                              size="sm"
                                              :disabled="form.model.Status==21 || form.model.Status==44"
                                              aria-describedby="UOM-feedback" />
                                <b-form-invalid-feedback id="UOM-feedback"></b-form-invalid-feedback>
                              </b-form-group>
                        </validation-provider>
                            </td>
                            <td class="text-center font-weight-bold" width="10%" rowspan="2">
                              <b-form-input type="number" size="sm" 
                              style="padding:0; margin:0; border:0; text-align:center;" v-model="item.Quantity"
                              :disabled="form.model.Status==21 || form.model.Status==44" />
                            </td>
                          </tr>
                          <tr>
                            <td colspan="3">
                              <b-form-textarea
                              id="textarea"
                              size="sm"
                              placeholder="Description"
                              style="padding:0; margin:0; border:0; max-height:25px;"
                              v-model="item.Remarks"
                              :disabled="form.model.Status==21 || form.model.Status==44"></b-form-textarea>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                      <tfoot>
                        <template>
                          <tr>
                            <th colspan="5">
                              <!-- VALIDATION PROVIDER -->
                                  <validation-provider name="Applied Total Paid"
                                                      :rules="{ max_value:form.model.OriginatingTotalPaid }"
                                                      v-slot="validationContext">
                                    <b-form-input name="ApplTotalPaid"
                                                  v-model="form.model.AppliedTotalPaid"
                                                  style="float:right;"
                                                  size="sm"
                                                  hidden
                                                  :state="validateState(validationContext)"
                                                  aria-describedby="ApplTotalPaid-amount-feedback"></b-form-input>
                                    <b-form-invalid-feedback id="ApplTotalPaid-amount-feedback">
                                      <font-awesome-icon :icon="['fas', 'exclamation-circle']" hidden/>&nbsp;
                                      <!-- {{ validationContext.errors[0] }} -->
                                    </b-form-invalid-feedback>
                                  </validation-provider>
                                <!-- VALIDATION PROVIDER END -->
                            </th>

                          </tr>
                        </template>
                      </tfoot>
                      <slot name="caption" />
                    </table>
                  </b-col>
                </b-row>

              </b-card>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
      <!-- TAB Customer END -->
    </b-card>
    <b-tabs pills card v-show="!isForm" v-if="isPrint==false">
      <b-tab active @click="isTabMain=true">
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'tasks']" />&nbsp;Progress
        </template>
        <!-- TAB Customer BEGIN -->
        <b-row>
          <b-col cols="12" sm="12">
            <b-card width="100%">
              <DataGrid ref="gridProgress"
                        :fields="this.$store.state.features.company.container_rental_request.headers"
                        :items="this.$store.state.features.company.container_rental_request.data"
                        :info="this.$store.state.features.company.container_rental_request.listInfo"
                        :baseUrl="this.$store.state.features.company.container_rental_request.baseUrl"
                        :actGetData="handleGetProgress"
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
                        caption="Container Rental Request - Progress"></DataGrid>
            </b-card>
          </b-col>
        </b-row>
        <!-- TAB Customer END -->
      </b-tab>
      <b-tab @click="History">
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'history']" />&nbsp;History
        </template>
        <b-card-text>
          <b-row>
            <b-col cols="12" sm="12">
              <b-card width="100%">
                <DataGrid ref="gridHistory"
                          :fields="this.$store.state.features.company.container_rental_request_history.headers"
                          :items="this.$store.state.features.company.container_rental_request_history.data"
                          :info="this.$store.state.features.company.container_rental_request_history.listInfo"
                          :baseUrl="this.$store.state.features.company.container_rental_request_history.baseUrl"
                          :actGetData="handleGetHistory"
                          :actCreate="onFormCreate"
                          :actEditRow="handleEdit"
                          addTableClasses="table-bordered"
                          responsive
                          items-per-page-select
                          loading
                          hover
                          sorter
                          pagination
                          column-filter
                          disableNewButton
                          historical
                          :isEdit="false"
                          :isDelete="false"
                          caption="Container Rental Request - History"></DataGrid>
              </b-card>
            </b-col>
          </b-row>
        </b-card-text>
      </b-tab>

    </b-tabs>
    <CustomerModal ref="dlgCustomer" :actSelectedRow="onSelectedCustomer"></CustomerModal>
    <VendorModal ref="dlgVendor" :actSelectedRow="onSelectedVendor"></VendorModal>
    <SalesPersonModal ref="dlgSalesPerson" :actSelectedRow="onSelectedSalesPerson"></SalesPersonModal>
    <CustomerAddressExtensionModal ref="dlgCustomerAddressExtension" :actSelectedRow="onSelectedAddressExtension"></CustomerAddressExtensionModal>
    <DistributionJournalModal ref="dlgDistJournal"></DistributionJournalModal>
    <ApprovalHistoryModal ref="dlgHistory"></ApprovalHistoryModal>

    <b-modal v-model="isShowContainer" hide-footer size="lg">
      <template v-slot:modal-title>
        Select Container
      </template>
      <div class="d-block text-center">
        <SelectGrid ref="gridContainer"
                    :fields="[{label: 'Container Code', key: 'ContainerCode', width:110},
                      {label: 'Container Name', key: 'ContainerName', _classes:'text-left', width:300},
                      {label: 'Container Size', key: 'ContainerSize', _classes:'text-center', width:70},
                      {label: 'Container Teus', key: 'ContainerTeus', _classes:'text-center', width:70}
                    ]"
                    :items="this.$store.state.features.company.container_type.data"
                    :info="this.$store.state.features.company.container_type.listInfo"
                    :baseUrl="this.$store.state.features.company.container_type.baseUrl"
                    :actGetData="handleGetContainerSelect"
                    :selectedItem="form.model.ContainerCode"
                    selectedFieldName="ContainerCode"
                    :actSelectRow="handleSelectContainer"
                    addTableClasses="table-bordered"
                    responsive
                    loading
                    hover
                    sorter
                    pagination
                    column-filter></SelectGrid>
      </div>
    </b-modal>

    <b-modal v-model="isShowCustomerAddress" hide-footer size="lg">
      <template v-slot:modal-title>
        Select Address
      </template>
      <div class="d-block text-center">
        <SelectGrid ref="gridAddress"
                    :fields="[{label: 'Address Code', key: 'AddressCode'},
                      {label: 'Address Name', key: 'AddressName'}]"
                    :items="this.$store.state.features.company.customer_address.data"
                    :info="this.$store.state.features.company.customer_address.listInfo"
                    :baseUrl="this.$store.state.features.company.customer_address.baseUrl"
                    :actGetData="handleGetAddressSelect"
                    :selectedItem="form.model.AddressCode"
                    selectedFieldName="AddressCode"
                    :actSelectRow="handleSelectCustomerAddress"
                    addTableClasses="table-bordered"
                    responsive
                    loading
                    hover
                    sorter
                    pagination
                    column-filter></SelectGrid>
      </div>
    </b-modal>

  <!-- CANCEL CONTAINER START -->
    <b-modal id="modal-void-reason"
             ref="modal-void"
             title="Cancel Container"
             @show="resetModal"
             @hidden="resetModal"
             @ok="handleOk"
             @cancel="handleCancel">
      <form ref="formvoid" @submit.stop.prevent="handleCancelStatus">
        <b-row>
          <b-col sm="6">
            <label>Cancel Date</label>

            <b-input-group>
              <b-form-input v-model="form.display.CanceledDate"
                            type="text"
                            :placeholder="dateFormatString"
                            class="text-center"
                            size="sm"
                            readonly
                            aria-describedby="doc-date-feedback"></b-form-input>
              <b-input-group-append v-if="actionButton.AllowVoid && (form.model.DocumentDate != maxVoidCalendarDate)">
                <b-form-datepicker v-model="form.model.CanceledDate"
                                   button-only
                                   size="sm"
                                   left
                                   @input="dateChangedVoid"
                                   :min="form.model.DocumentDate"
                                   :max="maxVoidCalendarDate"
                                   dark></b-form-datepicker>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
      </form>
    </b-modal>
    <!-- CANCEL CONTAINER END -->

  <!--PrintOut-->
    <ReceiptVoucherPrint ref="PrintReceipt"  :data="dataPrint" :print="isPrint"></ReceiptVoucherPrint>
  <!--EndPrintOut-->
  </div>
</template>

<script>
  import { ReceiptVoucherPrint } from "@/pages/print/index.js";
  import DataGrid from "@/components/Tables/DataGrid";
  import SelectGrid from "@/components/tables/SelectGrid";
  import VueElementLoading from "vue-element-loading";
  import { CustomerModal, VendorModal, SalesPersonModal, CustomerAddressExtensionModal, DistributionJournalModal, ApprovalHistoryModal } from "@/pages/modal/index.js";
  import { mask } from 'vue-the-mask';
  import moment from 'moment';
  import util from "@/helper/utils";
  import loginServices from '../../services/loginservices'

  export default {
    name: "Container Rental Request",
    layout: "dashboard",
    components: {
      DataGrid,
      SelectGrid,
      VueElementLoading,
      CustomerModal,
      VendorModal,
      SalesPersonModal,
      CustomerAddressExtensionModal,
      DistributionJournalModal,
      ApprovalHistoryModal,
      ReceiptVoucherPrint
    },
    directives: {
      mask
    },
    data() {
      return {
        isPrint: false,
        dataPrint: [],
        HasCheckoutApproval: false,
        isCreated: false,
        approveState: null,
        CommentHistory: [],
        disapproveState: null,
        approvepostingState: null,
        actionButton: { AllowSave: true, AllowEdit: true, AllowPosting: false, AllowVoid: false },
        minCalendarDate: moment().format("YYYY-01-01"),
        dtlindex: 0,
        ChargesName: "",
        dataDetails: [],
        dateFormatString: 'DD/MM/YYYY',
        isTabMain: true,
        formCaption: "Container Rental Request",
        caption: "Container Rental Request",
        blockLoader: false,
        isForm: false, //FORM IN TAB CUSTOMER
        isFormAddress: false, //FORM IN TAB ADDRESS
        isShowContainer: false,
        isShowCustomerAddress: false,
        itemHistory: [],
        HistoryInfo: [],
        itemReceivable: [],
        HistoryReceivable: [],
        historyUrl: "",
        listTransactionType: [],
        listUOM: [],
        Company: [],
        CompanyAddress: [],
        itemCities: Array(),
        perPage: 10,
        form: {
          valid: false,
          isEdit: false,
          StatusApproval: false,
          StatusPosting: false,
          CurrentIndex: 0,
          model: {
            ContainerRentalRequestHeaderId: "",
            DocumentNo: "",
            DocumentDate: moment().format("YYYY-MM-DD"),
            TransactionType: "",
            CustomerId: "",
            CustomerCode: "",
            CustomerName: "",
            AddressCode: "",
            Status: 20,
            SalesCode: "",
            VendorId: "",
            VendorCode: "",
            VendorName: "",
            BillToAddressCode: "",
            ShipToAddressCode: "",
            ContainerRentalRequestDetails: [],
            CreatedBy: "",
            CreatedDate: "",
            ModifiedBy: "",
            ModifiedDate: "",
            CanceledBy: "",
            CanceledDate: moment().format("YYYY-MM-DD"),
          },
          display: {
            DocumentDate: moment().format(this.dateFormatString),
            CreatedByName: "",
            CreatedDate: "",
            ModifiedByName: "",
            ModifiedDate: "",
            CanceledByName: "",
            CanceledDate: "",
          },
          alert: {
            Status: 0,
            Desc: "",
            UserFullName: ""
          }
        },
      };
    },

    async mounted() {
      await this.$store.dispatch(
        "features/company/container_type/actGetContainer",
        "container?"
      );

      // await this.$store.dispatch(
      //   "features/company/checkbook/actGetCheckbook",
      //   "Checkbook?&InActive=false"
      // );

      // START GET TRANSACTION TYPE FROM SETUP
      var arrTransactionType = [];
      await this.$store.dispatch(
        "features/company/container_rental_setup/actGet",
        "SetupContainerRental?"
      );
      var data = this.$store.state.features.company.container_rental_setup.data;
      data.forEach(function(row){
        arrTransactionType.push({ value: row.TransactionType, text: row.TransactionType });
      });
      this.listTransactionType = arrTransactionType;
      // END GET TRANSACTION TYPE

      // START GET UOM
      var arrUOM = [];
      await this.$store.dispatch(
        "features/company/uom/base/actGet",
        "UomBase?"
      );
      var data = this.$store.state.features.company.uom.base.data;

      data.forEach(function(row){
        arrUOM.push({ value: row.UomCode, text: row.UomCode });
      }); 
      this.listUOM = arrUOM;
      // END GET UOM

      if (this.$refs.gridProgress != null) {
        await this.$refs.gridProgress.doRefresh();
      }
      if (this.$refs.gridHistory != null) {
        await this.$refs.gridHistory.doRefresh();
      }

    },
    methods: {
       async handlePrintOut(){
        this.showLoader(true);
        this.isPrint = true;
        var printReceipt = await this.$refs.PrintReceipt.exportToPDF()
        if(printReceipt.status == true){
          this.showLoader(printReceipt.loader)
          this.isPrint = printReceipt.print;
        }
      },

      showLoader(val) {
        if (!val) {
          setTimeout(() => {
            this.blockLoader = false;
          }, 300);
        } else {
          this.blockLoader = val;
        }
      },
      async dateChanged() {
        this.form.display.DocumentDate = '';
        if (this.form.model.DocumentDate != null)
          this.form.display.DocumentDate = moment(this.form.model.DocumentDate).format(this.dateFormatString)
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
      async handleGetHistory(url) {
        await this.$store.dispatch("features/company/container_rental_request_history/actGetData", url);
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async handleGetProgress(url) {
        await this.$store.dispatch("features/company/container_rental_request/actGetData", url);
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async History() {
        this.itemHistory = this.$store.state.features.company.container_rental_request_history.data;
        this.HistoryInfo = this.$store.state.features.company.container_rental_request_history.listInfo;
      },
      CekDetail(DocumentNo) {
        var isdoc = true;
        for (var i = 0; i < this.dataDetails.length; i++) {
          if (this.dataDetails[i].DocumentNo == DocumentNo)
            isdoc = false;

        }
        return isdoc;
      },

      async onModalSearchCustomerAddress(reff, active) {
        this.handleGetAddressSelect();
        this.isShowCustomerAddress = true;
      },
      async handleGetAddressSelect(url) {
        await this.$store.dispatch(
          "features/company/customer_address/actGetData", 
          "CustomerAddress?&CustomerId=" + this.form.model.CustomerId);
      },
      async handleSelectCustomerAddress(row){
        this.form.model.AddressCode = row.AddressCode;
        this.form.model.AddressName = row.AddressName;
        this.isShowCustomerAddress = false;
      },
      async handleGetCustomerAddressExtension(url) {
        await this.$store.dispatch(
          "features/company/customer/actGetData",
          "Customer?&CustomerId=" + this.form.model.CustomerId
        );
      },

      async onAddContainer() {
        this.handleGetContainerSelect();
        this.isShowContainer = true;
      },
      async handleGetContainerSelect(url) {
        await this.$store.dispatch(
          "features/company/container_type/actGetContainer", 
          "Container?Inactive=false");
      },
      async handleSelectContainer(row) {
        let exist = false;

        if (Array.isArray(this.dataDetails)) {
          for (let i = 0; i < this.dataDetails.length; i++) {
            if (this.dataDetails[i].ContainerId === row.ContainerId) {
              exist = true;
              break;
            }
          }
        }

        if (!exist) {
          this.dataDetails.push({
            Index: (this.dataDetails.length),
            ContainerId: row.ContainerId,
            ContainerCode: row.ContainerCode,
            ContainerName: row.ContainerName,
            ContainerSize: row.ContainerSize,
            ContainerType: row.ContainerType,
            ContainerTeus: row.ContainerTeus
          });
        } else {
          this.handleToast("Add Container", "warning", "Container already exist ! Can not insert duplicated container.");
        }

        this.isShowContainer = false;
      },

      async onFormClose() {
        //location.reload();
        this.ErrorMessage = "";
        this.isForm = false;
        this.form.isEdit = false;

        this.resetForm();
      },

      resetForm() {
        this.form.model.ContainerRentalRequestHeaderId = "";
        this.form.model.DocumentNo = "";
        this.form.model.DocumentDate = moment().format("YYYY-MM-DD");
        this.form.model.TransactionType = "";
        this.form.model.CustomerId = "";
        this.form.model.CustomerCode = "";
        this.form.model.CustomerName = "";
        this.form.model.AddressCode = "";
        this.form.model.Status = 20;
        this.form.model.SalesCode = "";
        this.form.model.VendorId = "";
        this.form.model.VendorCode = "";
        this.form.model.VendorName = "";
        this.form.model.BillToAddressCode = "";
        this.form.model.ShipToAddressCode = "";
        this.form.model.CreatedBy = "";
        this.form.model.CreatedDate = "";
        this.form.model.ModifiedBy = "";
        this.form.model.ModifiedDate = "";
        this.form.model.CanceledBy = "";
        this.form.model.CanceledDate = "";

        this.dataDetails = [],

        this.form.display.DocumentDate = moment().format(this.dateFormatString);
        this.form.display.CreatedByName = "";
        this.form.display.CreatedDate = "";
        this.form.display.ModifiedByName = "";
        this.form.display.ModifiedDate = "";
        this.form.display.CanceledBy = "";
        this.form.display.CanceledByName = "";
        this.form.display.CanceledDate = "";

        this.actionButton.AllowSave = true
        this.actionButton.AllowEdit = true
        this.actionButton.AllowPosting = false
        this.actionButton.AllowVoid = false

        this.$nextTick(() => {
          this.$refs.observer.reset();
        });
      },
      async onFormCreate() {
        this.resetForm();
        this.form.isEdit = false;
        this.isForm = true;
      },
      async DeleteExtended(index) {
        this.dataExtended.splice(index, 1);
      },

      async handleEdit(row) {
        var arr = [];

        this.form.model.ContainerRentalRequestHeaderId = row.ContainerRentalRequestHeaderId,
        this.form.model.DocumentNo = row.DocumentNo,
        this.form.model.DocumentDate = moment(row.DocumentDate).format("YYYY-MM-DD");
        this.form.model.TransactionType = row.TransactionType,
        this.form.model.CustomerId = row.CustomerId,
        this.form.model.CustomerCode = row.CustomerCode,
        this.form.model.CustomerName = row.CustomerName,
        this.form.model.AddressCode = row.AddressCode,
        this.form.model.Status = util.docStatus(row.Status),
        this.form.model.SalesCode = row.SalesCode,
        this.form.model.VendorId = row.VendorId,
        this.form.model.VendorCode = row.VendorCode,
        this.form.model.VendorName = row.VendorName,
        this.form.model.BillToAddressCode = row.BillToAddressCode,
        this.form.model.ShipToAddressCode = row.ShipToAddressCode,
        this.form.display.DocumentDate = moment(this.form.model.DocumentDate).format(this.dateFormatString);
        this.form.display.CreatedByName = row.CreatedByName;
        this.form.display.CreatedDate = moment(row.CreatedDate).format('DD-MM-YYYY HH:mm:ss');
        this.form.display.CanceledByName = row.CanceledByName;
        this.form.display.CanceledDate =
          row.CanceledDate != undefined
            ? moment(row.CanceledDate).format(this.dateFormatString + " HH:mm:ss")
            : moment(Date.now()).format(this.dateFormatString);
        
        row.ContainerRentalRequestDetails.forEach(function (d, index) {
          arr.push({
            "ContainerRentalRequestDetailId": d.ContainerRentalRequestDetailId,
            "ContainerRentalRequestHeaderId": d.ContainerRentalRequestHeaderId,
            "ContainerCode": d.ContainerCode,
            "ContainerName": d.ContainerName,
            "UomCode": d.UomCode,
            "Remarks": d.Remarks,
            "Quantity": d.Quantity
          })
        });
        this.dataDetails = arr;

        this.actionButton.AllowEdit = true
        this.isForm = true;
        this.form.isEdit = true;
      },
      async doDelete(row) {
        this.showLoader(true);

        await this.$store.dispatch("features/company/container_rental_request/actPutDelete", row);

        var response = this.$store.state.features.company.container_rental_request.resultPutDelete;
        if (response.status != 200) {
          this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription != null
              ? response.data.ErrorDescription
              : "Delete failed."
          );
        } else {
          this.$refs.gridProgress.doRefresh();

          this.handleToast("Confirmation", "success", "Successfully deleted");
        }

        this.showLoader(false);
      },
      async handleDelete(row) {
        this.$bvModal
          .msgBoxConfirm("Are you sure ?", {
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
      validateForm() {
        let valid = true;
        let validAmount = true;

        this.dataDetails.forEach(function (row, index) {
          if (row.OrgPaidAmount <= 0) {
            valid = false;
          }
        });

         if (!valid)
           this.handleToast("Warning", "danger", "Paid Amount in Detail data  must not less than 0 (zero) !");

        return valid;
      },
      async onSubmit() {
        if (this.validateForm()) {
          this.showLoader(true);
          var arrDetail = [];
          this.dataDetails.forEach(function (row, index) {
            arrDetail.push({
              "ContainerRentalRequestDetailId": row.ContainerRentalRequestDetailId,
              "ContainerRentalRequestHeaderId": "00000000-0000-0000-0000-000000000000",
              "ContainerCode": row.ContainerCode,
              "ContainerName": row.ContainerName,
              "UomCode": row.UomCode,
              "Remarks": row.Remarks,
              "Quantity": row.Quantity
            })
          });

          this.form.model.ContainerRentalRequestDetails = arrDetail;

          if (this.form.isEdit) {
            await this.$store.dispatch(
              "features/company/container_rental_request/actUpdate", this.form.model
            );
            var response = this.$store.state.features.company.container_rental_request.resultUpdate;
            if (response.status != 200) {
              this.handleToast(
                "Confirmation",
                "danger",
                response.data.ErrorDescription != undefined ? response.data.ErrorDescription : "Update failed !"
              );
            } else {
              this.isForm = false;
              this.form.isEdit = false;

              this.$refs.gridProgress.doRefresh();

              this.handleToast("Confirmation", "success", "Successfully updated");
            }
          } else {
            await this.$store.dispatch("features/company/container_rental_request/actCreate", this.form.model);

            var response = this.$store.state.features.company.container_rental_request.resultCreate;

            if (response.status != 200) {
              this.handleToast(
                "Confirmation",
                "danger",
                response.data.ErrorDescription != undefined
                  ? response.data.ErrorDescription
                  : "Submit failed !"
              );
            } else {
              this.isForm = false;
              this.form.isEdit = false;

              this.$refs.gridProgress.doRefresh();

              this.handleToast("Confirmation", "success", "Successfully saved");
            }
          }

          this.showLoader(false);
        }
      },

      async onModalSearchCustomer(row) {
        this.$refs.dlgCustomer
          .open(row, this.form.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onModalSearchVendor(row) {
        this.$refs.dlgVendor
          .open(row, this.form.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onModalSearchSalesPerson(row) {
        this.$refs.dlgSalesPerson
          .open(row, this.form.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onModalSearchCustomerAddressExtension(row) {
        this.$refs.dlgCustomerAddressExtension
          .open(this.form.model.CustomerId,
          this.form.model.AddressCode, 
          this.form.model.BillToAddressCode,
          this.form.model.ShipToAddressCode,
          this.form.model.Status)
          .then(res => {
            console.log(res)
          })
          .catch(res => {
            console.log(res);
          });
      },

      async onSelectedCustomer(item, modelReff) {
        this.form.model.CustomerId = item.CustomerId;
        this.form.model.CustomerName = item.CustomerName;
        this.form.model.AddressCode = item.AddressCode;
        this.form.model[modelReff] = item.CustomerCode;
        this.form.model.BillToAddressCode = item.BillToAddressCode;
        this.form.model.ShipToAddressCode = item.ShipToAddressCode;
        //vendordetail
      },
      async onSelectedVendor(item, modelReff) {
        this.form.model.VendorId = item.VendorId;
        this.form.model.VendorCode = item.VendorCode;
        this.form.model.VendorName = item.VendorName;
        //vendordetail
      },
      async onSelectedSalesPerson(item, modelReff) {
        this.form.model.SalesPersonId = item.SalesPersonId;
        this.form.model.SalesName = item.SalesName;
        this.form.model[modelReff] = item.SalesCode;
        //vendordetail
      },
      async onSelectedAddressExtension(item, modelReff){
        this.form.model.AddressCode = item.AddressCode;
        this.form.model.BillToAddressCode = item.BillToAddressCode;
        this.form.model.ShipToAddressCode = item.ShipToAddressCode;
      },

      async DeleteContainer(index) {

        this.dataDetails.splice(index, 1);

      },
      resetModal() {
        this.form.VoidReason = ''
        this.voidState = null
      },
      checkFormValidity() {
        const valid = this.$refs.formvoid.checkValidity();
        this.voidState = valid;
        return valid;
      },

      async clickSubmitApprove(index) {
        this.$bvModal
          .msgBoxConfirm("Submit " + this.form.model.DocumentNo + " ? (make sure you already save all your changes)", {
            title: "Submit Approval Confirmation",
            size: "md",
            buttonSize: "sm",
            okVariant: "blue",
            okTitle: 'YES',
            cancelTitle: 'NO',
            centered: true,
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0",
            hideHeaderClose: false,
          })
          .then(ok => {
            if (ok) {
              this.doSubmitReceipt(index);
            }
          })
          .catch(err => {
            // An error occurred
          });
      },
      async doSubmitReceipt(row) {
        this.showLoader(true);

        this.form.model.Reason = "";

        await this.$store.dispatch("features/finance/receipt/receipt_transaction/actSubmitApproval", this.form.model);

        var response = this.$store.state.features.company.container_rental_request.resultCreate;
        if (response.status != 200) {
          this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription != null
              ? response.data.ErrorDescription
              : "Delete failed."
          );
        } else {
          this.isForm = false;
          this.form.isEdit = false;

          this.$refs.gridProgress.doRefresh();
          this.$refs.gridHistory.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },
      async clickPosting(index) {
        this.$bvModal
          .msgBoxConfirm("Submit " + this.form.model.DocumentNo + " ? (make sure you already save all your changes)", {
            title: "Submit Container Rental Request Confirmation",
            size: "md",
            buttonSize: "sm",
            okVariant: "blue",
            okTitle: 'YES',
            cancelTitle: 'NO',
            centered: true,
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0",
            hideHeaderClose: false,
          })
          .then(ok => {
            if (ok) {
              this.doPostingReceipt(index);
            }
          })
          .catch(err => {
            // An error occurred
          });
      },
      async onModalHistory(row) {
        this.$refs.dlgHistory
          .open(this.CommentHistory)
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleCancelStatus()
      },
      handleCancel(bvModalEvt) {
        this.resetModal();
        // Prevent modal from closing
        this.$bvModal.hide('modal-void-reason')
      },
      handleCancelStatus() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity()) {
          return;
        }
        // Push the name to submitted names
        this.doVoidJournal();

        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide("modal-void-reason");
        });
      },

      async doPostingReceipt(row) {
        this.showLoader(true);

        this.form.model.PersonId = this.$store.state.user;
        await this.$store.dispatch("features/company/container_rental_request/actPosting", this.form.model);

        var response = this.$store.state.features.company.container_rental_request.resultPosting;
        if (response.status != 200) {
          this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription != null
              ? response.data.ErrorDescription
              : "Submit Failed!"
          );
        } else {
          this.isForm = false;
          this.form.isEdit = false;

          this.$refs.gridProgress.doRefresh();
          this.$refs.gridHistory.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },

      async doVoidJournal(row) {
        this.showLoader(true);

        this.form.model.PersonId = this.$store.state.user;
        await this.$store.dispatch(
          "features/company/container_rental_request/actCancelStatus",
          this.form.model
        );

        var response = this.$store.state.features.company.container_rental_request.resultPosting;
        if (response.status != 200) {
          this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription != null
              ? response.data.ErrorDescription
              : "Delete failed."
          );
        } else {
          this.isForm = false;
          this.form.isEdit = false;

          this.$refs.gridProgress.doRefresh();
          this.$refs.gridHistory.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },
      
      async onModalDistJournal(row) {
        this.$refs.dlgDistJournal
          .open(this.form.model.DocumentNo)
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      /***  END ***/
    },

    computed: {
      tableClasses() {
        return [
          "table",
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
      },
    },
  };
</script>

<style scoped>
  #table-detail thead th {
    font-size: 12px;
    border: 1px solid #cfd8dc;
    padding: 5px;
    background-color: #f5f5f5;
  }

  #table-detail tbody td {
    font-size: 12px;
    border-left: 0.5px solid #cfd8dc;
    border-right: 0.5px solid #cfd8dc;
    border-bottom: 1px solid #cfd8dc;
    max-height: 1px;
    padding: 0 5px 0 5px;
    background-color: white;
    color:black;
  }

  #table-detail tfoot th {
    font-size: 12px;
    border: 1px solid #cfd8dc;
    padding: 5px 0 5px 5px;
    background-color: #f5f5f5;
  }

  .v-money {
    width: 200px;
  }

  #table-detail input:disabled {
    background-color: #e8eaf6;
    cursor: text;
    margin: 0em;
    border: 1px solid #c2cfd6;
  }
</style>

