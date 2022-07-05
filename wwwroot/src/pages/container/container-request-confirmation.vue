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
                    <b-button variant="green" @click="clickPosting" v-if="form.isEdit&&form.model.Status==1&&HasCheckoutApproval==false" v-b-tooltip.hover title="Confirm Delivery Order">
                      <font-awesome-icon :icon="['fas', 'check-circle']" />&nbsp;Confirm
                    </b-button>
                    <b-button variant="green" v-b-modal.modal-extend v-if="form.isEdit&&form.model.Status==200">
                      <font-awesome-icon :icon="['fas', 'check-circle']" v-b-tooltip.hover title="Extend this Delivery Order" />&nbsp;Extend
                    </b-button>
                    <b-button variant="red" v-b-modal.modal-void-reason v-if="form.isEdit&&form.model.Status==200">
                      <font-awesome-icon :icon="['fas', 'ban']" v-b-tooltip.hover title="Cancel this Container Request Confirmation" />&nbsp;Cancel Confirmation
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
                      <b-col sm="4">
                        <b-form-input v-model="form.model.ContainerRentalRequestHeaderId" hidden />
                        <b-form-input v-model="form.model.ContainerRentalRequestDetailId" hidden />
                        <b-form-group>
                          <label for="DocumentNo"><b>Request Document No</b></label>
                          <b-input-group prepend>
                            <b-form-input name="Document No"
                                            type="text"
                                            placeholder="Document No"
                                            v-model="form.model.DocumentNo"
                                            class="font-weight-bold text-center"
                                            readonly
                                            variant="blue"
                                            :disabled="!actionButton.AllowEdit"
                                            size="sm" />
                            <b-input-group-append v-if="actionButton.AllowEdit && !form.isEdit && form.model.Status!=200 && form.model.Status!=44">
                                        <b-button variant="outline-primary"
                                                size="sm"
                                                :disabled="!actionButton.AllowEdit"
                                                @click="onModalSearchRequest('DocumentNo', 'DocumentNo')">
                                        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                        </b-button>
                            </b-input-group-append>
                        </b-input-group>
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
                          <b-input-group-append v-if="actionButton.AllowEdit && !form.StatusApproval && form.model.Status!=20 && form.model.Status!=200 && form.model.Status!=44">
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
                            <b-form-input name="Transaction Type"
                                           v-model="form.model.TransactionType"
                                           :state="validateState(validationContext)"
                                           size="sm"
                                           readonly
                                           disabled
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
                                                disabled
                                                size="sm"
                                                aria-describedby="Customer-feedback"></b-form-input>
                                  <b-form-invalid-feedback id="Customer-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-input-group>
                              </validation-provider>
                            </b-col><br>

                            <b-col sm="12">
                              <label for="Description">Customer Name</label>
                              <b-input-group :prepend="form.CurrencySymbol" size="sm">
                                <b-form-input v-model="form.model.CustomerName"
                                              class="font-weight-bold"
                                              size="sm"
                                              readonly
                                              disabled
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
                                              disabled
                                              size="sm"></b-form-input>
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
                                                disabled
                                                size="sm"
                                                aria-describedby="VendorName-feedback"></b-form-input>
                                  <b-form-invalid-feedback id="VendorName-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-input-group>
                              </validation-provider>
                            </b-col><br>
                          </b-row>
                        </b-card>
                      </b-col>
                    </b-row><br>

                    <b-row sm="12">
                      <b-col>
                        <b-row>
                          <b-col sm="4">
                            <validation-provider name="DeliveryOrderNo"
                                             :rules="{ required: true }"
                                             v-slot="validationContext">
                              <b-form-group>
                                <label>Cosco Document No.</label>
                                <b-form-input name="DeliveryOrderNo"
                                              type="text"
                                              v-model="form.model.DeliveryOrderNo"
                                              class="font-weight-bold text-left"
                                              style="text-transform: uppercase"
                                              variant="blue"
                                              :state="validateState(validationContext)"
                                              aria-describedby="coscodocno-feedback"
                                              :disabled="!actionButton.AllowEdit||form.isEdit"
                                              size="sm" />
                                <b-form-invalid-feedback id="coscodocno-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                              </b-form-group>
                            </validation-provider>
                          </b-col>

                           <b-col sm="3">
                        <label>Issue Date</label>
                        <b-input-group>
                          <b-form-input v-model="form.display.IssueDate"
                                        type="text"
                                        :placeholder="dateFormatString"
                                        class="text-center"
                                        size="sm"
                                        readonly
                                        aria-describedby="doc-date-feedback"></b-form-input>
                          <b-input-group-append v-if="actionButton.AllowEdit && !form.StatusApproval && form.model.Status!=20 && form.model.Status!=200 && form.model.Status!=44">
                            <b-form-datepicker v-model="form.model.IssueDate"
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
                        <label>Expired Date</label>
                          <b-input-group>
                            <b-form-input v-model="form.display.ExpiredDate"
                                          type="text"
                                          :placeholder="dateFormatString"
                                          class="text-center"
                                          size="sm"
                                          readonly
                                          aria-describedby="expired-date-feedback"></b-form-input>
                            <b-input-group-append v-if="actionButton.AllowEdit && !form.StatusApproval && form.model.Status!=20 && form.model.Status!=200 && form.model.Status!=44">
                              <b-form-datepicker v-model="form.model.ExpiredDate"
                                                button-only
                                                size="sm"
                                                left
                                                locale="en-US"
                                                @input="dateChanged"
                                                :min="form.model.IssueDate"
                                                dark></b-form-datepicker>
                            </b-input-group-append>
                            </b-input-group>
                            <span v-if="showWarningDate&&form.model.ExpiredDate < today" 
                            style="color:red; font-size:10px;">
                              <font-awesome-icon :icon="['fas', 'exclamation']"></font-awesome-icon>
                              This Delivery Order Already EXPIRED!<br/>
                            </span>
                            <span v-if="showWarningDate&&form.model.Status==1&&form.model.ExpiredDate < form.model.IssueDate" 
                            style="color:red; font-size:10px;">
                              <font-awesome-icon :icon="['fas', 'exclamation']"></font-awesome-icon>
                              Expired Date CANNOT less than Issue Date!
                            </span>
                            
                      </b-col>
                        </b-row>
                      </b-col>
                    </b-row>
                    
                  </b-col>
                  <!-- END DOCUMENT STATUS -->
                  <b-col sm="2" v-if="form.isEdit">
                    <b-card bg-variant="dark" text-variant="white" 
                    :title="form.model.Status == 44 ? 'CANCELLED' : (form.model.Status == 200 ? 'CONFIRMED': 'NEW')">
                      <b-card-text>
                        <div v-if="form.model.Status == 44">
                          <label><small>Canceled By :</small></label><br />
                          <b>{{form.display.ModifiedByName}}</b><br />
                          <label><small>Canceled Date :</small></label><br />
                          <b>{{form.display.ModifiedDate}}</b><br />
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
                          <th class="text-left text-uppercase">Grade</th>
                          <th class="text-left text-uppercase" style="width:15%">Unit of Measurement</th>
                          <th class="text-center text-uppercase" rowspan="2">Quantity</th>
                          <th class="text-center text-uppercase" rowspan="2">Quantity To Confirm</th>
                        </tr>
                        <tr>
                          <th class="text-left text-uppercase" colspan="4">Remarks</th>
                        </tr>

                      </thead>
                      <tbody class="position-relative">
                        <template v-for="(item, itemIndex) in dataDetails">
                          <tr>
                            <td class="text-center" rowspan="2">
                              <span hidden>{{ item.ContainerRentalRequestHeaderId }}</span>
                              <span hidden> || {{ item.ContainerRentalRequestDetailId }}</span>
                            </td>
                            <td style="background-color:#E1F0E7;">
                              {{ item.ContainerCode }}
                            </td>
                            <td style="background-color:#E1F0E7;">
                              {{ item.ContainerName }}
                            </td>
                            <td>
                              <validation-provider name="Grade"
                                             :rules="{ required: true }"
                                             v-slot="validationContext">
                                <b-form-group>
                                  <b-form-select name="Grade"
                                                style="padding:0; margin:10px 0 0 0; border:0; cursor:pointer;"
                                                v-model="item.Grade"
                                                :state="validateState(validationContext)"
                                                :plain="true"
                                                size="sm"
                                                :disabled="form.model.Status==200 || form.model.Status==44"
                                                aria-describedby="Grade-feedback">
                                    <b-form-select-option :value="null">Select Grade</b-form-select-option>
                                    <b-form-select-option value="A">A</b-form-select-option>
                                    <b-form-select-option value="B">B</b-form-select-option>
                                    <b-form-select-option value="C">C</b-form-select-option>
                                    <b-form-select-option value="D">D</b-form-select-option>
                                  </b-form-select>
                                  <b-form-invalid-feedback id="Grade-feedback"></b-form-invalid-feedback>
                                </b-form-group>
                              </validation-provider>
                            </td>
                            <td style="background-color:#E1F0E7;">
                              {{ item.UomCode }}
                            </td>
                            <td class="text-center font-weight-bold" style="background-color:#E1F0E7;" width="10%" rowspan="2">
                              <!-- <span v-if="!form.isEdit">{{ item.Quantity }}</span> -->
                              <span>{{ item.QuantityBalance }}</span>
                              <input type="text" v-model="item.QuantityBalance" hidden />
                            </td>
                            <td class="text-center font-weight-bold" width="10%" rowspan="2">
                              <validation-provider name="Confirm"
                                              :rules="{ required: true, min_value:0, max_value:item.QuantityBalance }"
                                              v-slot="validationContext">  
                                <b-form-input type="number" size="sm" 
                                              style="padding:0; margin:0; border:solid 1px #E1F0E7; text-align:center;" 
                                              v-model="item.QuantityToConfirm"
                                              :state="validateState(validationContext)"
                                              aria-describedby="Confirm-feedback"
                                              :disabled="form.model.Status==200 || form.model.Status==44" />
                                <b-form-invalid-feedback id="Confirm-feedback"></b-form-invalid-feedback>
                              </validation-provider>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="4">
                              <b-form-textarea
                              id="textarea"
                              size="sm"
                              placeholder="Description"
                              style="padding:0; margin:0; border:0; max-height:25px;"
                              v-model="item.Remarks"
                              :disabled="form.model.Status==200 || form.model.Status==44"></b-form-textarea>
                            </td>
                          </tr>
                        </template>
                      </tbody>
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
                        :fields="this.$store.state.features.company.container_request_confirm.headers"
                        :items="this.$store.state.features.company.container_request_confirm.data"
                        :info="this.$store.state.features.company.container_request_confirm.listInfo"
                        :baseUrl="this.$store.state.features.company.container_request_confirm.baseUrl"
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
                        caption="Container Request Confirmation - Progress"></DataGrid>
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
                          :fields="this.$store.state.features.company.container_request_confirm_history.headers"
                          :items="this.$store.state.features.company.container_request_confirm_history.data"
                          :info="this.$store.state.features.company.container_request_confirm_history.listInfo"
                          :baseUrl="this.$store.state.features.company.container_request_confirm_history.baseUrl"
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
                          caption="Container Request Confirmation - History"></DataGrid>
              </b-card>
            </b-col>
          </b-row>
        </b-card-text>
      </b-tab>

    </b-tabs>
    <CustomerAddressExtensionModal ref="dlgCustomerAddressExtension" :actSelectedRow="onSelectedAddressExtension"></CustomerAddressExtensionModal>

    <b-modal v-model="isShowRequest" hide-footer size="xl">
      <template v-slot:modal-title>
        Select Container Request
      </template>
      <div class="d-block text-center">
        <SelectGrid ref="gridContainerRequest"
                    :fields="[
                        {label: 'Document No', key: 'DocumentNo', _classes:'text-center', sort:true, filter:true},
                        {label: 'Transaction Type', key: 'TransactionType', _classes:'text-center', sort:true, filter:true},
                        {label: 'Sales Person', key: 'SalesCode', sort:true, filter:true},
                        {label: 'Customer Name', key: 'CustomerName', sort:true, filter:true},
                        {label: 'Container Owner', key: 'VendorName', sort:true, filter:true}
                    ]"
                    :items="this.$store.state.features.company.container_request_confirm.resultRemaining"
                    :info="this.$store.state.features.company.container_request_confirm.listInfo"
                    :baseUrl="this.$store.state.features.company.container_request_confirm.baseUrl"
                    :actGetData="handleGetRequestSelect"
                    :selectedItem="form.model.DocumentNo"
                    selectedFieldName="DocumentNo"
                    :actSelectRow="handleSelectRequest"
                    addTableClasses="table-bordered"
                    responsive
                    loading
                    hover
                    sorter
                    pagination
                    column-filter></SelectGrid>
      </div>
    </b-modal>

    <!-- EXTEND CONTAINER START -->
    <b-modal id="modal-extend"
             ref="modal-extend"
             title="Extend Delivery Order "
             @show="resetModal"
             @hidden="resetModal"
             @ok="handleOk"
             @cancel="handleCancel">
      <form ref="formvoid" @submit.stop.prevent="handleExpiredStatus">
        <b-row>
          <b-col sm="6">
            <label>Pick New Expired Date</label>

            <b-input-group>
              <b-form-input v-model="form.display.ExpiredDateExtend"
                            type="text"
                            :placeholder="dateFormatString"
                            class="text-center"
                            size="sm"
                            readonly
                            aria-describedby="doc-date-feedback"></b-form-input>
              <b-input-group-append>
                <b-form-datepicker v-model="form.model.ExpiredDateExtend"
                                   button-only
                                   size="sm"
                                   left
                                   @input="dateExtendExpired"
                                   :min="checkExtendValidationDate"
                                   dark></b-form-datepicker>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
      </form>
    </b-modal>
    <!-- EXTEND CONTAINER END -->

    <!-- CANCEL CONTAINER START -->
    <b-modal id="modal-void-reason"
             ref="modal-void"
             title="Cancel Confirmation"
             @show="resetModal44"
             @hidden="resetModal44"
             @ok="handleOk44"
             @cancel="handleCancel44">
      <form ref="formvoid" @submit.stop.prevent="handleCancelStatus">
        <b-row>
          <b-col sm="12">
            <label>Cancel this Container Request Confirmation?</label> 
            <label>(This cancellation cannot be undo!)</label>
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
  import { CustomerAddressExtensionModal } from "@/pages/modal/index.js";
  import { mask } from 'vue-the-mask';
  import moment from 'moment';
  import util from "@/helper/utils";
  import loginServices from '../../services/loginservices'

  export default {
    name: "Container Request Confirmation",
    layout: "dashboard",
    components: {
      DataGrid,
      SelectGrid,
      VueElementLoading,
      CustomerAddressExtensionModal,
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
        formCaption: "Container Request Confirmation",
        caption: "Container Request Confirmation",
        blockLoader: false,
        isForm: false, //FORM IN TAB CUSTOMER
        isFormAddress: false, //FORM IN TAB ADDRESS
        isShowRequest: false,
        showWarningDate: false,
        checkExtendValidationDate: "",
        today: "",
        itemHistory: [],
        HistoryInfo: [],
        itemReceivable: [],
        HistoryReceivable: [],
        historyUrl: "",
        listTransactionType: [],
        listUOM: [],
        listDoDateHistory: [],
        Company: [],
        CompanyAddress: [],
        extendState: null,
        itemCities: Array(),
        perPage: 10,
        form: {
          valid: false,
          isEdit: false,
          StatusApproval: false,
          StatusPosting: false,
          CurrentIndex: 0,
          model: {
            ContainerRequestConfirmHeaderId: "",
            ContainerRentalRequestHeaderId: "",
            DocumentNo: "",
            DocumentDate: moment().format("YYYY-MM-DD"),
            TransactionType: "",
            CustomerId: "",
            CustomerCode: "",
            CustomerName: "",
            AddressCode: "",
            Status: 1,
            SalesCode: "",
            VendorId: "",
            VendorCode: "",
            VendorName: "",
            BillToAddressCode: "",
            ShipToAddressCode: "",
            DeliveryOrderNo: "",
            IssueDate: moment().format("YYYY-MM-DD"),
            ExpiredDate: moment().format("YYYY-MM-DD"),
            ContainerRentalRequestDetails: [],
            ContainerRequestConfirmDetails: [],
            CreatedBy: "",
            CreatedDate: "",
            ModifiedBy: "",
            ModifiedDate: moment().format("YYYY-MM-DD"),
            ExpiredDateExtend: moment().format("YYYY-MM-DD")
          },
          display: {
            DocumentDate: moment().format(this.dateFormatString),
            IssueDate: moment().format(this.dateFormatString),
            ExpiredDate: moment().format(this.dateFormatString),
            CreatedByName: "",
            CreatedDate: "",
            ModifiedByName: "",
            ModifiedDate: "",
            CanceledByName: "",
            CanceledDate: "",
            ExpiredDateExtend: moment().format(this.dateFormatString)
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

      //GET TODAY DATE
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    this.today = today;
    ////////////////////////////////////////////////
      
      // GET DO DATE
      var arrDoDateHistory = [];
      await this.$store.dispatch(
        "features/company/container_request_confirm_history/actGetData",
        "GetHistoryContainerRequestConfirm?"
      );
      var dataDoDateHistory = this.$store.state.features.company.container_request_confirm_history.data;
      dataDoDateHistory.forEach(function(row){
        arrDoDateHistory.push({ value:row.ExpiredDate })
      });
      this.listDoDateHistory = arrDoDateHistory;

      
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
          this.form.display.DocumentDate = moment(this.form.model.DocumentDate).format(this.dateFormatString);

          if (this.form.model.IssueDate != null)
          this.form.display.IssueDate = moment(this.form.model.IssueDate).format(this.dateFormatString);

          if (this.form.model.ExpiredDate != null)
          this.form.display.ExpiredDate = moment(this.form.model.ExpiredDate).format(this.dateFormatString)

          if(this.form.model.ExpiredDate < this.form.model.IssueDate || this.form.model.ExpiredDate < moment().format("YYYY-MM-DD")){
            this.showWarningDate = true;
          }else{
            this.showWarningDate = false;
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
      async handleGetHistory(url) {
        await this.$store.dispatch("features/company/container_request_confirm_history/actGetData", url);
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async handleGetProgress(url) {
        await this.$store.dispatch("features/company/container_request_confirm/actGetData", url);
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async History() {
        this.itemHistory = this.$store.state.features.company.container_request_confirm_history.data;
        this.HistoryInfo = this.$store.state.features.company.container_request_confirm_history.listInfo;
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

      async onModalSearchRequest(reff, active){
          this.handleGetRequestSelect();
          this.isShowRequest = true;
      },
      async handleGetRequestSelect(url){
          // await this.$store.dispatch(
          //     "features/company/container_rental_request_history/actGetData", 
          //     "GetHistoryContainerRentalRequest?");
          await this.$store.dispatch(
              "features/company/container_request_confirm/actGetRemaining", 
              "GetQuantityRemaining?");
      },
      async handleSelectRequest(row){
          this.form.model.ContainerRentalRequestHeaderId = row.ContainerRentalRequestHeaderId;
          this.form.model.DocumentNo = row.DocumentNo;
          this.form.model.TransactionType = row.TransactionType;
          this.form.model.CustomerId = row.CustomerId;
          this.form.model.CustomerCode = row.CustomerCode;
          this.form.model.CustomerName = row.CustomerName;
          this.form.model.AddressCode = row.AddressCode;
          this.form.model.SalesCode = row.SalesCode;
          this.form.model.VendorId = row.VendorId;
          this.form.model.VendorCode = row.VendorCode;
          this.form.model.VendorName = row.VendorName;
          this.form.model.BillToAddressCode = row.BillToAddressCode;
          this.form.model.ShipToAddressCode = row.ShipToAddressCode;
          this.isShowRequest = false;

          this.$refs.gridContainerRequest.doRefresh();

          var arr = [];
          console.log(row.ContainerRentalRequestDetails);
          row.ContainerRentalRequestDetails.forEach(function (d, index) {
          arr.push({
            "ContainerRentalRequestDetailId": d.ContainerRentalRequestDetailId,
            "ContainerCode": d.ContainerCode,
            "ContainerName": d.ContainerName,
            "Grade": null,
            "UomCode": d.UomCode,
            "Remarks": d.Remarks,
            "Quantity": d.Quantity,
            "QuantityBalance": d.Quantity,
            "QuantityToConfirm": 0
          })
        });

        
        this.dataDetails = arr;
      },

      async onFormClose() {
        //location.reload();
        this.ErrorMessage = "";
        this.isForm = false;
        this.form.isEdit = false;

        this.resetForm();
      },

      resetForm() {
        this.form.model.ContainerRequestConfirmHeaderId = "";
        this.form.model.ContainerRentalRequestHeaderId = "";
        this.form.model.DocumentNo = "";
        this.form.model.DocumentDate = moment().format("YYYY-MM-DD");
        this.form.model.TransactionType = "";
        this.form.model.CustomerId = "";
        this.form.model.CustomerCode = "";
        this.form.model.CustomerName = "";
        this.form.model.AddressCode = "";
        this.form.model.Status = 1;
        this.form.model.SalesCode = "";
        this.form.model.VendorId = "";
        this.form.model.VendorCode = "";
        this.form.model.VendorName = "";
        this.form.model.BillToAddressCode = "";
        this.form.model.ShipToAddressCode = "";
        this.form.model.DeliveryOrderNo = "";
        this.form.model.IssueDate = moment().format("YYYY-MM-DD");
        this.form.model.ExpiredDate = moment().format("YYYY-MM-DD");
        this.form.model.CreatedBy = "";
        this.form.model.CreatedDate = "";
        this.form.model.ModifiedBy = "";
        this.form.model.ModifiedDate = "";

        this.dataDetails = [],

        this.form.display.DocumentDate = moment().format(this.dateFormatString);
        this.form.display.IssueDate = moment().format(this.dateFormatString);
        this.form.display.ExpiredDate = moment().format(this.dateFormatString);
        this.form.display.CreatedByName = "";
        this.form.display.CreatedDate = "";
        this.form.display.ModifiedByName = "";
        this.form.display.ModifiedDate = "";

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

        this.form.model.ContainerRequestConfirmHeaderId = row.ContainerRequestConfirmHeaderId,
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
        this.form.model.DeliveryOrderNo = row.DeliveryOrderNo,
        this.form.model.IssueDate = moment(row.IssueDate).format("YYYY-MM-DD"),
        this.form.model.ExpiredDate = moment(row.ExpiredDate).format("YYYY-MM-DD"),
        this.form.display.DocumentDate = moment(this.form.model.DocumentDate).format(this.dateFormatString);
        this.form.display.IssueDate = moment(this.form.model.IssueDate).format(this.dateFormatString);
        this.form.display.ExpiredDate = moment(this.form.model.ExpiredDate).format(this.dateFormatString);
        this.form.display.CreatedByName = row.CreatedByName;
        this.form.display.CreatedDate = moment(row.CreatedDate).format('DD-MM-YYYY HH:mm:ss');
        this.form.display.ModifiedByName = row.ModifiedByName;
        this.form.display.ModifiedDate =
          row.ModifiedDate != undefined
            ? moment(row.ModifiedDate).format(this.dateFormatString + " HH:mm:ss")
            : moment(Date.now()).format(this.dateFormatString);


        row.ContainerRequestConfirmDetails.forEach(function (d, index) {
          arr.push({
            "ContainerRequestConfirmDetailId": d.ContainerRequestConfirmDetailId,
            "ContainerRequestConfirmHeaderId": d.ContainerRequestConfirmHeaderId,
            "ContainerRentalRequestDetailId": d.ContainerRentalRequestDetailId,
            "ContainerCode": d.ContainerCode,
            "ContainerName": d.ContainerName,
            "Grade": d.Grade,
            "UomCode": d.UomCode,
            "Remarks": d.Remarks,
            "Quantity": d.Quantity,
            "QuantityRemaining": d.QuantityRemaining,
            "QuantityBalance": d.QuantityBalance,
            "QuantityToConfirm": d.QuantityToConfirm
          })
        });
        this.dataDetails = arr;
        this.form.model.ContainerRequestConfirmDetails = this.dataDetails;

        // CHECK EXPIRED IN FIELD
        this.dateChanged();

        this.actionButton.AllowEdit = true
        this.isForm = true;
        this.form.isEdit = true;
      },
      async doDelete(row) {
        this.showLoader(true);

        await this.$store.dispatch("features/company/container_request_confirm/actPutDelete", row);

        var response = this.$store.state.features.company.container_request_confirm.resultPutDelete;
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

          // CHECK QUANTITY TO RENTAL REQUEST STATUS
              await this.$store.dispatch(
                "features/company/container_request_confirm/actCloseRequest", 
                this.form.model
              );
              var response = this.$store.state.features.company.container_request_confirm.resultPosting;
              //

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
              "ContainerRequestConfirmDetailId": row.ContainerRequestConfirmDetailId,
              "ContainerRequestConfirmHeaderId": row.ContainerRequestConfirmHeaderId,
              "ContainerRentalRequestDetailId": row.ContainerRentalRequestDetailId,
              "Grade": row.Grade,
              "Remarks": row.Remarks,
              "QuantityToConfirm": row.QuantityToConfirm,
              "QuantityBalance": row.QuantityBalance
            })
          });

          this.form.model.ContainerRequestConfirmDetails = arrDetail;
          console.log(arrDetail);
          if (this.form.isEdit) {
            await this.$store.dispatch(
              "features/company/container_request_confirm/actUpdate", this.form.model
            );
            var response = this.$store.state.features.company.container_request_confirm.resultUpdate;
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

              // CHECK QUANTITY TO RENTAL REQUEST STATUS
              await this.$store.dispatch(
                "features/company/container_request_confirm/actCloseRequest", 
                this.form.model
              );
              var response = this.$store.state.features.company.container_request_confirm.resultPosting;
              //

              this.handleToast("Confirmation", "success", "Successfully updated");
            }
          } else {
            await this.$store.dispatch("features/company/container_request_confirm/actCreate", this.form.model);

            var response = this.$store.state.features.company.container_request_confirm.resultCreate;

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

              // CHECK QUANTITY TO RENTAL REQUEST STATUS
              await this.$store.dispatch(
                "features/company/container_request_confirm/actCloseRequest", 
                this.form.model
              );
              var response = this.$store.state.features.company.container_request_confirm.resultPosting;
              //

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
        // CHECK IF ISSUE DATE GREATER THAN TODAY
        if(this.form.model.ExpiredDate >= this.today){
          this.checkExtendValidationDate = this.form.model.ExpiredDate;
        }else{
          this.checkExtendValidationDate = this.today;
        }

        this.form.model.ExpiredDateExtend = this.form.model.ExpiredDate;
        this.form.display.ExpiredDateExtend = this.form.display.ExpiredDate;

        this.extendState = null
      },
      checkFormValidity() {
        const valid = this.$refs.formvoid.checkValidity();
        this.extendState = valid;
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

        var response = this.$store.state.features.company.container_request_confirm.resultCreate;
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
          .msgBoxConfirm("Confirm Cosco Doc. " + this.form.model.DeliveryOrderNo + " with Document No. " + this.form.model.DocumentNo + " ? (make sure you already save all your changes)", {
            title: "Confirm Container Rental Request Confirmation",
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
              this.onSubmit();
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
        this.handleExpiredStatus()
      },
      handleCancel(bvModalEvt) {
        this.resetModal();
        // Prevent modal from closing
        this.$bvModal.hide('modal-extend')
      },
      handleExpiredStatus() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity()) {
          return;
        }
        // Push the name to submitted names
        this.doExtendRequest();

        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide("modal-extend");
        });
      },

      async dateExtendExpired() {
        this.form.display.ExpiredDateExtend = "";

        if(this.form.model.ExpiredDateExtend != null)
        this.form.display.ExpiredDateExtend = moment(this.form.model.ExpiredDateExtend).format('DD/MM/YYYY');

        if(this.form.model.ExpiredDateExtend < this.today)
        this.form.model.ExpiredDateExtend = this.today;
        this.form.display.ExpiredDateExtend = moment(this.form.model.ExpiredDateExtend).format('DD/MM/YYYY');
      },


      async handleOk44(bvModalEvt){
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleCancelStatus()
      },
      handleCancel44(bvModalEvt) {
        this.resetModal44();
        // Prevent modal from closing
        this.$bvModal.hide('modal-void-reason')
      },
      resetModal44(){
        this.voidState = null
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
      async doVoidJournal(row) {
        this.showLoader(true);

        this.form.model.PersonId = this.$store.state.user;
        await this.$store.dispatch(
          "features/company/container_request_confirm/actCancelStatus",
          this.form.model
        );

        var response = this.$store.state.features.company.container_request_confirm.resultPosting;
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

          this.onSubmit();

          this.$refs.gridProgress.doRefresh();
          this.$refs.gridHistory.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },

      async doPostingReceipt(row) {
        this.showLoader(true);

        this.form.model.PersonId = this.$store.state.user;
        await this.$store.dispatch("features/company/container_request_confirm/actPosting", this.form.model);

        var response = this.$store.state.features.company.container_request_confirm.resultPosting;
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

      async doExtendRequest(row) {
        this.showLoader(true);

        this.form.model.ExpiredDate = this.form.model.ExpiredDateExtend;
        this.form.display.ExpiredDate = this.form.display.ExpiredDateExtend;

        this.form.model.PersonId = this.$store.state.user;
        await this.$store.dispatch(
          "features/company/container_request_confirm/actExtend",
          this.form.model
        );

        var response = this.$store.state.features.company.container_request_confirm.resultPosting;
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

