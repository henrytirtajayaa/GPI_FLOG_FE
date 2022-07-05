<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <!-- BEGIN FORM -->
    <b-card no-body v-show="isForm">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
          <b-card>
            <div slot="header">
              <span class="font-weight-bold">{{formCaption}}</span>
              <small>{{ (form.isEdit) ? "Edit" : "New" }}</small>
              <div right style="float:right;">
                <b-button-toolbar key-nav size="sm">
                  <b-button-group
                    class="mx-1"
                    v-if="form.model.DocumentNo != '' && actionButton.AllowApprovalHistory"
                  >
                    <b-button
                      variant="info"
                      @click="onModalHistory"
                      v-b-tooltip.hover
                      title="View History"
                    >
                      <font-awesome-icon :icon="['fas', 'paw']" />
                    </b-button>
                  </b-button-group>
                  <b-button-group class="mx-1" v-if="actionButton.AllowEdit">
                    <b-button variant="blue" type="submit">
                      <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                    </b-button>
                  </b-button-group>
                  <b-button-group class="mx-1">
                    <b-button @click="onFormClose">
                      <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                    </b-button>
                  </b-button-group>
                </b-button-toolbar>
              </div>
            </div>
            <!-- BEGIN HEADER -->
            <b-row>
              <b-col sm="12">
                <b-row>
                  <b-col sm="3">
                    <validation-provider
                      name="Transaction Type"
                      :rules="{ required: true }"
                      v-slot="validationContext"
                    >
                      <b-form-group>
                        <label for="TrxType">Transaction Type</label>
                        <b-form-select
                          name="Transaction Type"
                          v-model="form.model.TransactionType"
                          :state="validateState(validationContext)"
                          :plain="true"
                          disabled
                          :options="listTransactionType"
                          value-field="TransactionType"
                          text-field="TransactionType"
                          size="sm"
                          aria-describedby="trxtype-feedback"
                        />
                        <b-form-invalid-feedback
                          id="trxtype-feedback"
                        >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </b-col>
                  <b-col sm="3">
                    <label>Document Date</label>
                    <b-input-group>
                      <b-form-input
                        id="TransactionDate"
                        :value="form.model.TransactionDate | formattedDMY"
                        type="text"
                        :placeholder="dateFormatString"
                        class="text-center"
                        size="sm"
                        readonly
                      ></b-form-input>
                      <b-input-group-append v-if="actionButton.AllowEdit">
                        <b-form-datepicker
                          v-model="form.model.TransactionDate"
                          button-only
                          size="sm"
                          left
                          locale="en-US"
                          :min="minCalendarDate"
                        ></b-form-datepicker>
                      </b-input-group-append>
                    </b-input-group>
                  </b-col>
                  <b-col sm="3">
                    <b-form-group>
                      <label for="DocumentNo">Document No</label>
                      <b-form-input
                        name="Document No"
                        type="text"
                        :disabled="form.isEdit || !actionButton.AllowEdit"
                        placeholder="Document No"
                        v-model="form.model.DocumentNo"
                        class="text-center form-control"
                        readonly
                        size="sm"
                      />
                    </b-form-group>
                  </b-col>
                  <b-col sm="3">
                    <label>Master No</label>
                    <b-form-input
                      name="MasterNo"
                      type="text"
                      class="font-weight-bold form-control"
                      placeholder="Master No"
                      v-model="form.model.MasterNo"
                      aria-describedby="Master-No"
                      size="sm"
                      disabled
                    />
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <!-- END HEADER -->
            <b-row>
              <b-col sm="12">
                <!-- BEGIN TAB FOR HEADER -->

                <!-- END TAB FOR HEADER -->
                <!-- BEGIN TAB FOR CHARGES, TRUCKING, CONTAINER -->
                <b-tabs pills variant="dark" class="mt-1">
                  <!-- BEGIN TAB SELLING -->
                  <b-tab ref="tabCharges">
                    <template v-slot:title>
                      <font-awesome-icon :icon="['fas', 'coins']" />&nbsp;SELLING
                    </template>
                    <b-row>
                      <b-col sm="12">
                        <b-navbar type="dark" variant="light">
                          <b-button variant="green" @click="onModalCreateInvoice('SELL')" v-if="HasPendingSelling">
                              <font-awesome-icon :icon="['fas', 'check-circle']" />&nbsp;Create Receivable Invoices
                            </b-button>
                          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                          <b-collapse id="nav-collapse" is-nav class="ml-3">
                            <b-nav-form>
                              <small>
                              <font-awesome-icon :icon="['fas', 'info']" />&nbsp;
                              <i>{{form.display.PaymentConditionCaption}}</i></small>
                            </b-nav-form>                            
                          </b-collapse>
                        </b-navbar>
                      </b-col>  
                    </b-row>
                    <b-row class="mb-2 mt-2">
                      <b-col class="table-responsive">
                        <table
                          id="table-detail"
                          width="100%"
                          class="table-light table-striped table-hover table-bordered"
                        >
                          <thead>
                            <tr>
                              <th
                                class="text-center"
                                rowspan="2"
                                style="vertical-align:middle;width:5%"
                              >
                                <b-form-checkbox v-model="isSellingCheckAll" @input="onClickSellingCheckAll"></b-form-checkbox>
                              </th>
                              <th class="text-left">CHARGES&nbsp;CODE</th>
                              <th class="text-left">CURRENCY</th>
                              <th class="text-left">RATE&nbsp;AMOUNT</th>
                              <th class="text-left">ORG.&nbsp;AMOUNT</th>
                              <th class="text-left">ORG.&nbsp;EXT.&nbsp;AMOUNT</th>
                              <th class="text-left">FUNC.&nbsp;EXT.&nbsp;AMOUNT</th>
                              <th class="text-left">CHARGE&nbsp;TO&nbsp;&nbsp;</th>
                            </tr>
                            <tr>
                              <th class="text-left" colspan="2">CHARGES&nbsp;NAME</th>
                              <th class="text-left" colspan="7">REMARKS</th>
                            </tr>
                            <tr></tr>
                          </thead>
                          <tbody class="position-relative buying">
                            <template v-for="(item, itemIndex) in sellingDetails">
                              <tr>
                                <td rowspan="2" class="text-center" style="width:3%">
                                  <a
                                    v-if="actionButton.AllowEdit"
                                    href="javascript:;"
                                    style="text-decoration:none;color:red;"
                                    v-show="form.isEdit "
                                  >
                                    <font-awesome-icon
                                      size="lg"
                                      :icon="['fas', 'trash']"
                                      variant="danger"
                                    />
                                  </a>
                                  <b-form-checkbox v-model="item.IsChecked" :disabled="item.ReceiveDocumentNo != ''"></b-form-checkbox>
                                </td>
                                <td style="width:10%">{{item.ChargeCode}}</td>
                                <td style="width:6%">
                                  <b-input-group prepend>
                                    <b-form-input
                                      v-model="item.CurrencyCode"
                                      class="form-control font-weight-bold"
                                      readonly
                                      size="sm"
                                    ></b-form-input>
                                    <b-input-group-append v-if="actionButton.AllowEdit">
                                      <b-button
                                        variant="outline-primary"
                                        size="sm"
                                        @click="onModalSearchCurrency('SELL','CurrencyCode', item)"
                                        v-show="form.isEdit"
                                      >
                                        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                      </b-button>
                                      <b-input-group-append
                                        v-show="actionButton.AllowEdit && form.FunctionalCurrency != item.CurrencyCode"
                                      >
                                        <b-button
                                          variant="outline-primary"
                                          size="sm"
                                          :disabled="form.FunctionalCurrency == item.CurrencyCode"
                                          v-show="form.isEdit"
                                          @click="openModalExchangeRate(item.CurrencyCode, item.moneyOptionsarr, item.ExchangeRate, 'SELL', item)"
                                        >
                                          <font-awesome-icon :icon="['fas', 'arrow-right']"></font-awesome-icon>
                                        </b-button>
                                      </b-input-group-append>
                                    </b-input-group-append>
                                  </b-input-group>
                                </td>
                                <td style="width:6%">
                                  <money
                                    v-model="item.ExchangeRate"
                                    v-bind="item.moneyOptionsarr"
                                    class="form-control currency-money-field"
                                    disabled
                                  ></money>
                                </td>
                                <td style="width:10%">
                                  <b-input-group prepend>
                                    <money
                                      v-model="item.OriginatingAmount"
                                      v-bind="item.moneyOptionsarr"
                                      class="form-control currency-money-field"
                                      :disabled="!actionButton.AllowEdit"
                                    ></money>
                                    <b-button
                                      @click="openModalExtendedTax('SELL',item.CurrencyCode, item.IsMultiply, item.OriginatingAmount,item.ExchangeRate, item.TaxScheduleId, item.ScheduleCode, item.ScheduleDesc, item.TaxablePercentTax,item.TaxPercentDiscount, item.IsTaxAfterDiscount, item.OriginatingDiscount, item.DiscountByAmount, item.moneyOptionsarr, item)"
                                      variant="outline-primary"
                                      size="sm"
                                      :disabled="item.OriginatingAmount <= 0 "
                                      v-show="form.isEdit"
                                      v-if="actionButton.AllowEdit"
                                    >
                                      <font-awesome-icon :icon="['fas', 'arrow-right']"></font-awesome-icon>
                                    </b-button>
                                  </b-input-group>
                                </td>
                                <td style="width:10%">
                                  <b-input-group prepend>
                                    <money
                                      v-model="item.OriginatingExtendedAmount"
                                      v-bind="item.moneyOptionsarr"
                                      class="form-control currency-money-field"
                                      disabled
                                    ></money>
                                  </b-input-group>
                                </td>
                                <td style="width:10%">
                                  <b-input-group prepend>
                                    <money
                                      v-model="item.FunctionalExtendedAmount"
                                      v-bind="moneyOptions"
                                      class="form-control currency-money-field"
                                      disabled
                                    ></money>
                                  </b-input-group>
                                </td>
                                <td style="width:10%">
                                  <b-input-group prepend>
                                    <b-form-input
                                      v-model="item.ChargeTo"
                                      type="text"
                                      readonly
                                      size="sm"
                                      class="form-control"
                                    ></b-form-input>
                                    <b-button
                                      @click="onModalSearchCustomer('SELL', item)"
                                      variant="outline-primary"
                                      size="sm"
                                      :disabled="item.OriginatingAmount <= 0 "
                                      v-show="form.isEdit"
                                      v-if="actionButton.AllowEdit"
                                    >
                                      <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                    </b-button>
                                  </b-input-group>
                                </td>
                              </tr>
                              <tr>
                                <td colspan="2">{{item.ChargeName}}</td>
                                <td colspan="7">
                                  <b-form-input
                                    type="text"
                                    size="sm"
                                    v-model="item.Remark"
                                    :disabled="!actionButton.AllowEdit"
                                  />
                                </td>
                              </tr>
                            </template>
                          </tbody>
                          <tfoot></tfoot>
                          <slot name="caption" />
                        </table>
                      </b-col>
                    </b-row>
                  </b-tab>
                  <!-- END TAB SELLING -->
                  <!-- BEGIN TAB BUYING -->
                  <b-tab ref="tabBuyings" >
                    <template v-slot:title>
                      <font-awesome-icon :icon="['fas', 'coins']" />&nbsp;BUYING
                    </template>
                    <b-row>
                      <b-col sm="12">
                        <b-navbar type="dark" variant="light">
                          <b-button variant="yellow" @click="onModalCreateInvoice('BUY')" v-if="HasPendingBuying">
                              <font-awesome-icon :icon="['fas', 'check-circle']" />&nbsp;Create Payable Invoices
                            </b-button>
                          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                          <b-collapse id="nav-collapse" is-nav class="ml-3">
                            <b-nav-form>
                              <small>
                              <font-awesome-icon :icon="['fas', 'info']" />&nbsp;
                              <i >{{form.display.PaymentConditionCaption}}</i></small>
                            </b-nav-form>                            
                          </b-collapse>
                        </b-navbar>
                      </b-col>  
                    </b-row>
                    <b-row class="mb-2 mt-2">
                      <b-col class="table-responsive">
                        <table
                          id="table-detail"
                          width="100%"
                          class="table-light table-striped table-hover table-bordered"
                        >
                          <thead>
                            <tr>
                              <th
                                class="text-center"
                                rowspan="2"
                                style="vertical-align:middle;width:5%"
                              >
                                <b-form-checkbox v-model="isBuyingCheckAll" @input="onClickBuyingCheckAll"></b-form-checkbox>
                              </th>
                              <th class="text-left">CHARGES&nbsp;CODE</th>
                              <th class="text-left">CURRENCY</th>
                              <th class="text-left">RATE&nbsp;AMOUNT</th>
                              <th class="text-left">ORG.&nbsp;AMOUNT</th>
                              <th class="text-left">ORG.&nbsp;EXT.&nbsp;AMOUNT</th>
                              <th class="text-left">FUNC.&nbsp;EXT.&nbsp;AMOUNT</th>
                              <th class="text-left">CHARGE&nbsp;TO&nbsp;&nbsp;</th>
                            </tr>
                            <tr>
                              <th class="text-left" colspan="2">CHARGES&nbsp;NAME</th>
                              <th class="text-left" colspan="7">REMARKS</th>
                            </tr>
                            <tr></tr>
                          </thead>
                          <tbody class="position-relative buying">
                            <template v-for="(item, itemIndex) in buyingDetails">
                              <tr>
                                <td rowspan="2" class="text-center" style="width:3%">
                                  <a
                                    v-if="actionButton.AllowEdit"
                                    href="javascript:;"
                                    style="text-decoration:none;color:red;"
                                    v-show="form.isEdit "
                                  >
                                    <font-awesome-icon
                                      size="lg"
                                      :icon="['fas', 'trash']"
                                      variant="danger"
                                    />
                                  </a>
                                  <b-form-checkbox v-model="item.IsChecked" :disabled="item.PayableDocumentNo != ''"></b-form-checkbox>
                                </td>
                                <td style="width:10%">{{item.ChargeCode}}</td>
                                <td style="width:6%">
                                  <b-input-group prepend>
                                    <b-form-input
                                      v-model="item.CurrencyCode"
                                      class="form-control font-weight-bold"
                                      readonly
                                      size="sm"
                                    ></b-form-input>
                                    <b-input-group-append v-if="actionButton.AllowEdit">
                                      <b-button
                                        variant="outline-primary"
                                        size="sm"
                                        @click="onModalSearchCurrency('SELL','CurrencyCode', item)"
                                        v-show="form.isEdit"
                                      >
                                        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                      </b-button>
                                      <b-input-group-append
                                        v-show="actionButton.AllowEdit && form.FunctionalCurrency != item.CurrencyCode"
                                      >
                                        <b-button
                                          variant="outline-primary"
                                          size="sm"
                                          :disabled="form.FunctionalCurrency == item.CurrencyCode"
                                          v-show="form.isEdit"
                                          @click="openModalExchangeRate(item.CurrencyCode, item.moneyOptionsarr, item.ExchangeRate, 'SELL', item)"
                                        >
                                          <font-awesome-icon :icon="['fas', 'arrow-right']"></font-awesome-icon>
                                        </b-button>
                                      </b-input-group-append>
                                    </b-input-group-append>
                                  </b-input-group>
                                </td>
                                <td style="width:8%">
                                  <money
                                    v-model="item.ExchangeRate"
                                    v-bind="item.moneyOptionsarr"
                                    class="form-control currency-money-field"
                                    disabled
                                  ></money>
                                </td>
                                <td style="width:10%">
                                  <b-input-group prepend>
                                    <money
                                      v-model="item.OriginatingAmount"
                                      v-bind="item.moneyOptionsarr"
                                      class="form-control currency-money-field"
                                      :disabled="!actionButton.AllowEdit"
                                    ></money>
                                    <b-button
                                      @click="openModalExtendedTax('SELL',item.CurrencyCode, item.IsMultiply, item.OriginatingAmount,item.ExchangeRate, item.TaxScheduleId, item.ScheduleCode, item.ScheduleDesc, item.TaxablePercentTax,item.TaxPercentDiscount, item.IsTaxAfterDiscount, item.OriginatingDiscount, item.DiscountByAmount, item.moneyOptionsarr, item)"
                                      variant="outline-primary"
                                      size="sm"
                                      :disabled="item.OriginatingAmount <= 0 "
                                      v-show="form.isEdit"
                                      v-if="actionButton.AllowEdit"
                                    >
                                      <font-awesome-icon :icon="['fas', 'arrow-right']"></font-awesome-icon>
                                    </b-button>
                                  </b-input-group>
                                </td>
                                <td style="width:10%">
                                  <b-input-group prepend>
                                    <money
                                      v-model="item.OriginatingExtendedAmount"
                                      v-bind="item.moneyOptionsarr"
                                      class="form-control currency-money-field"
                                      disabled
                                    ></money>
                                  </b-input-group>
                                </td>
                                <td style="width:10%">
                                  <b-input-group prepend>
                                    <money
                                      v-model="item.FunctionalExtendedAmount"
                                      v-bind="moneyOptions"
                                      class="form-control currency-money-field"
                                      disabled
                                    ></money>
                                  </b-input-group>
                                </td>
                                <td style="width:10%">
                                  <b-input-group prepend>
                                    <b-form-input
                                      type="text"
                                      size="sm"
                                      v-model="item.VendorId"
                                      v-show="false"
                                    ></b-form-input>
                                    <b-form-input
                                      v-model="item.ChargeTo"
                                      type="text"
                                      readonly
                                      size="sm"
                                      class="form-control"
                                    ></b-form-input>
                                    <b-button
                                      @click="onModalSearchCustomer('SELL', item)"
                                      variant="outline-primary"
                                      size="sm"
                                      :disabled="item.OriginatingAmount <= 0 "
                                      v-show="form.isEdit"
                                      v-if="actionButton.AllowEdit"
                                    >
                                      <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                    </b-button>
                                  </b-input-group>
                                </td>
                              </tr>
                              <tr>
                                <td colspan="2">{{item.ChargeName}}</td>
                                <td colspan="7">
                                  <b-form-input
                                    type="text"
                                    size="sm"
                                    v-model="item.Remark"
                                    :disabled="!actionButton.AllowEdit"
                                  />
                                </td>
                              </tr>
                            </template>
                          </tbody>
                          <tfoot></tfoot>
                          <slot name="caption" />
                        </table>
                      </b-col>
                    </b-row>
                  </b-tab>
                  <!-- END TAB BUYING -->
                </b-tabs>
                <!-- END TAB FOR CHARGES, TRUCKING, CONTAINER -->
              </b-col>
            </b-row>
          </b-card>
        </b-form>
      </validation-observer>
    </b-card>
    <!-- END FORM -->

    <!-- BEGIN GRID -->
    <b-card-text v-show="!isForm">
      <b-row>
        <b-col cols="12" sm="12">
          <b-card width="100%">
            <DataGrid
              ref="gridApproved"
              :fields="this.$store.state.features.sales.ns_approved.headers"
              :items="this.$store.state.features.sales.ns_approved.data"
              :info="this.$store.state.features.sales.ns_approved.listInfo"
              :baseUrl="this.$store.state.features.sales.ns_approved.baseUrl"
              :actGetData="handleGetApproved"
              :actEditRow="handleEdit"
              :isEdit="false"
              :isDelete="false"
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
              caption="Approved Negotiation Sheet"
            ></DataGrid>
          </b-card>
        </b-col>
      </b-row>
    </b-card-text>
    <!-- END GRID -->

    <!-- MODAL -->
    <CustomerAddressExtentionModal
      ref="dlgCustomerAddressDetail"
      :actSelectedRow="onSelectedCustomerDetail"
    ></CustomerAddressExtentionModal>
    <ChargesModal ref="dlgCharges" :actSelectedRow="onSelectedCharges"></ChargesModal>
    <CurrencyModal ref="dlgCurrency" :actSelectedRow="onSelectedCurrency"></CurrencyModal>
    <ExchangeRateModal ref="dlgExchangeRate" :actSelectedRow="onSelectedExchangeRate"></ExchangeRateModal>
    <ExtendedTaxModal ref="dlgExtendedTax" :actSelectedRow="onSelectedExtendedTax"></ExtendedTaxModal>
    <CustomerModal ref="dlgCustomer" :actSelectedRow="onSelectedCustomer"></CustomerModal>
    <VendorModal ref="dlgVendor" :actSelectedRow="onSelectedVendor"></VendorModal>
    <ApprovalHistoryModal ref="dlgHistory"></ApprovalHistoryModal>

    <div id="page-dialogs-customer-address">
      <b-modal v-model="isShowCustomerAddress" hide-footer size="lg">
        <template v-slot:modal-title>Customer Address</template>
        <div class="d-block text-center">
          <SelectGrid
            ref="gridModalCustomerAddress"
            :fields="[{label: 'Address Code', key: 'AddressCode', _classess: 'text-left', width:150, filter: true},
                      {label: 'Address Name', key: 'AddressName', _classess: 'text-left',filter: true},
                      {label: 'Contact', key: 'ContactPerson', _classess: 'text-left', width:150, filter: true},
                      {label: '', key: 'Default', _classess: 'text-center', width:50, sorter: false, filter: false}]"
            :items="this.$store.state.features.company.customer_address.data"
            :info="this.$store.state.features.company.customer_address.listInfo"
            :baseUrl="this.$store.state.features.company.customer_address.baseUrl"
            :actGetData="handleGetCustomerAddress"
            :selectedItem="form.CustomerAddressReffField"
            selectedFieldName="AddressCode"
            :actSelectRow="handleSelectCustomerAddress"
            addTableClasses="table-bordered"
            responsive
            loading
            hover
            sorter
            pagination
            column-filter
            :itemsPerPage="perPage"
          ></SelectGrid>
        </div>
      </b-modal>
    </div>

    <b-modal size="sm"
      id="modal-create-invoice"
      ref="modal-create-invoice"
      :title="form.model.IsCreateSelling ? 'Create Receivable Invoice(s)' : 'Create Payable Invoice(s)'"
      @show="resetModalInvoice"
      @hidden="resetModalInvoice"
      @ok="handleOk"
      @cancel="handleCancelInvoice"
    >
      <form ref="formInvoice" @submit.stop.prevent="handleInvoice">
        <b-row>
          <b-col sm="10">
            <label>Invoice Date</label>
            <b-input-group>
              <b-form-input
                :value="form.model.InvoiceDate | formattedDMY"
                type="text"
                :placeholder="dateFormatString"
                class="text-center"
                size="sm"
                readonly
              ></b-form-input>
              <b-input-group-append>
                <b-form-datepicker
                  v-model="form.model.InvoiceDate"
                  button-only
                  size="sm"
                  left
                  :min="form.model.TransactionDate"
                  :max="maxInvoiceCalendarDate"
                  dark
                ></b-form-datepicker>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
      </form>
    </b-modal>

    <!-- MODAL -->
  </div>
</template>

<script>
import DataGrid from "@/components/Tables/DataGrid";
import SelectGrid from "@/components/tables/SelectGrid";
import VueElementLoading from "vue-element-loading";
import {
  ChargesModal,
  CurrencyModal,
  CustomerAddressExtentionModal,
  ExchangeRateModal,
  ExtendedTaxModal,
  CustomerModal,
  VendorModal,
  ApprovalHistoryModal
} from "@/pages/modal/index.js";
import { mask } from "vue-the-mask";
import moment from "moment";
import util from "@/helper/utils";
import loginServices from "@/services/loginservices";
import cloneDeep from "lodash.cloneDeep";

export default {
  name: "NegotiationSheetApproved",
  layout: "dashboard",
  components: {
    DataGrid,
    SelectGrid,
    VueElementLoading,
    ChargesModal,
    CustomerAddressExtentionModal,
    CurrencyModal,
    ExchangeRateModal,
    ExtendedTaxModal,
    CustomerModal,
    VendorModal,
    ApprovalHistoryModal
  },
  directives: {
    mask
  },
  data() {
    return {
      actionButton: {
        AllowSave: true,
        AllowEdit: true,
        AllowSubmitApproval: false,
        AllowApproval: false,
        AllowApprovalHistory: false
      },
      approvalState: null,
      disapprovalState: null,
      optionUom: [],
      listTransactionType: [],
      listPaymentCondition: [],
      index: 0,
      minCalendarDate: moment().format("YYYY-01-01"),
      dateFormatString: "DD/MM/YYYY",
      formCaption: "Approved Negotiation Sheet",
      caption: "Approved Negotiation Sheet",
      blockLoader: false,
      isShowCustomerAddress: false,
      isShowContainer: false,
      isForm: false, //FORM IN TAB CUSTOMER
      isFormAddress: false, //FORM IN TAB ADDRESS
      optionTermOfShipment: [
        { value: "CY/CY", text: "CY/CY" },
        { value: "CY/DOOR", text: "CY/DOOR" },
        { value: "DOOR/CY", text: "DOOR/CY" },
        { value: "DOOR/CY", text: "DOOR/DOOR" },
        { value: "CY/CFS", text: "CY/CFS" },
        { value: "CFS/CY", text: "CFS/CY" },
        { value: "CFS/CFS", text: "CFS/CFS" }
      ],
      IsMultiply: true,
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
      moneyOptionsarr: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: "",
        precision: 0,
        masked: false,
        allowBlank: false,
        min: 0
      },
      perPage: 10,
      invoiceState: null,
      truckDetails: [], //TRUCKS
      containerDetails: [], //CONTAINERS
      sellingDetails: [], //SELLING
      buyingDetails: [], //BUYING
      isSellingCheckAll : false,
      isBuyingCheckAll : false,
      form: {
        FunctionalCurrency: "",
        defaultRateType: 0,
        ReceivableSetup: [],
        isEdit: false,
        model: {
          NegotiationSheetId: "00000000-0000-0000-0000-000000000000",
          TransactionDate: moment()
            .utc()
            .format("YYYY-MM-DD"),
          TransactionType: "",
          SalesOrderId: "00000000-0000-0000-0000-000000000000",
          DocumentNo: "",
          TotalFuncSelling: 0,
          TotalFuncBuying: 0,
          TotalFuncProfit: 0,
          Remark: "",
          TotalTruck: 0,
          NsSellings: [],
          NsBuyings: [],
          NsContainers: [],
          NsTruckings: [],
          InvoiceDate: moment()
            .utc()
            .format("YYYY-MM-DD"),
          IsCreateSelling: true
        },
        salesOrder: {
          DocumentNo: "",
          CustomerCode: "",
          CustomerBillToAddressCode: "",
          CustomerShipToAddressCode: "",
          ShipmentStatus: "NONE",
          QuotationDocNo: "",
          MasterNo: "",
          AgreementNo: "",
          BookingNo: "",
          HouseNo: "",
          CustomerId: "",
          CustomerName: "",
          AddressCode: "",
          SalesCode: "",
          SalesName: "",
          ShipperId: "",
          ShipperCode: "",
          ShipperAddressCode: "",
          ShipperName: "",
          ShipperBillToAddressCode: "",
          ShipperShipToAddressCode: "",
          ConsigneeId: "",
          ConsigneeCode: "",
          ConsigneeName: "",
          ConsigneeAddressCode: "",
          ConsigneeBillToAddressCode: "",
          ConsigneeShipToAddressCode: "",
          IsDifferentNotifyPartner: true,
          NotifyPartnerId: "",
          NotifyPartnerCode: "",
          NotifyPartnerName: "",
          NotifyPartnerAddressCode: "",
          NotifyPartnerBillAddressCode: "",
          NotifyPartnerShipAddressCode: "",
          ShippingLineId: "",
          ShippingLineName: "",
          ShippingLineOwner: "",
          ShippingLineType: "",
          ShippingLineShippingNo: "",
          ShippingLineDelivery: "",
          ShippingLineArrival: "",
          FeederLineArrival: "",
          FeederLineDelivery: "",
          FeederLineId: "",
          FeederLineName: "",
          FeederLineOwner: "",
          FeederLineType: "",
          FeederLineShippingNo: "",
          FeederLineArrival: "",
          TermOfShipment: "",
          FinalDestination: "",
          PortOfLoading: "",
          PortOfDischarge: "",
          Commodity: "",
          CargoGrossWeight: "",
          CargoNetWeight: "",
          CargoDescription: "",
          Remark: "",
          Status: 1,
          StatusComment: "",
          CreatedBy: "",
          CreatedByName: "",
          TotalContainer: 0,
          TotalTruck: 0,
          TotalSelling: 0,
          TotalBuying: 0,
          EstimateTotal: 0
        },
        display: {
          DocumentStatus: "",
          DocumentDate: moment(Date.now()).format("YYYY/MM/DD"),
          CreatedByName: "",
          CreatedDate: "",
          ClosedByName: "",
          ClosedDate: "",
          PaymentConditionCaption:"",
        },
        approval: {
          Reason: "",
          ApprovalIndex: 0
        }
      },
      ApprovalCommentHistory: []
    };
  },
  watch: {
    sellingDetails: {
      handler: function(after, before) {
        this.doCalculateSellingDetails();
      },
      deep: true
    },
    buyingDetails: {
      handler: function(after, before) {
        this.doCalculateBuyingDetails();
      },
      deep: true
    }
  },
  async created() {
    await this.initDefaultForm();
  },
  async mounted() {
    await this.$store.dispatch(
      "features/sales/ns_approved/actGetData",
      "GetNegotiationSheetApproved?"
    );
  },
  methods: {
    async onClickSellingCheckAll(){
      let isChecked = this.isSellingCheckAll;
      this.sellingDetails.filter(x=>x.ReceiveDocumentNo == '').forEach(function(item){
        item.IsChecked = isChecked;
      });
    },
    async onClickBuyingCheckAll(){
      let isChecked = this.isBuyingCheckAll;
      this.buyingDetails.filter(x=>x.PayableDocumentNo == '').forEach(function(item){
        item.IsChecked = isChecked;
      });
    },
    calculateTax(record) {
      let orgBaseAmount = record.OriginatingAmount;

      //AFTER DISCOUNT OR NOT, SET BASE AMOUNT
      if (record.IsTaxAfterDiscount) {
        if (record.OriginatingDiscount > 0) {
          orgBaseAmount = record.OriginatingAmount - record.OriginatingDiscount;
        }
      }

      //CALCULATE TAX ORIGINATING
      let orgTaxAmount = 0;
      if (orgBaseAmount > 0) {
        if (record.TaxPercentDiscount > 0) {
          orgTaxAmount =
            (record.TaxablePercentTax / 100) *
            orgBaseAmount *
            (record.TaxPercentDiscount / 100);
        }
      }

      record.OriginatingTax = orgTaxAmount;
      record.OriginatingExtendedAmount = orgBaseAmount + orgTaxAmount;
      record.FunctionalExtendedAmount = record.IsMultiply
        ? record.OriginatingExtendedAmount * record.ExchangeRate
        : record.OriginatingExtendedAmount / record.ExchangeRate;

      return record;
    },
    async doCalculateSellingDetails() {
      let sellingAmount = 0,
        totalFuncSelling = 0;

      let orgBaseAmount,
        orgTaxAmount = 0;

      if (Array.isArray(this.sellingDetails) && this.sellingDetails.length) {
        for (let i = 0; i < this.sellingDetails.length; i++) {
          sellingAmount = 0;

          let record = this.sellingDetails[i];

          record = this.calculateTax(record);

          sellingAmount = record.FunctionalExtendedAmount;

          totalFuncSelling += sellingAmount;
        }
      }

      this.form.model.TotalFuncSelling = totalFuncSelling;
      //this.form.model.TotalFuncBuying = totalFuncBuying;
      this.form.model.TotalFuncProfit =
        totalFuncSelling - this.form.model.TotalFuncBuying;
    },
    async doCalculateBuyingDetails() {
      let buyingAmount = 0,
        totalFuncBuying = 0;

      let orgBaseAmount,
        orgTaxAmount = 0;

      if (Array.isArray(this.buyingDetails) && this.buyingDetails.length) {
        for (let i = 0; i < this.buyingDetails.length; i++) {
          buyingAmount = 0;

          let record = this.buyingDetails[i];

          record = this.calculateTax(record);

          buyingAmount = record.FunctionalExtendedAmount;

          totalFuncBuying += buyingAmount;
        }
      }

      //this.form.model.TotalFuncSelling = totalFuncSelling;
      this.form.model.TotalFuncBuying = totalFuncBuying;
      this.form.model.TotalFuncProfit =
        this.form.model.TotalFuncSelling - totalFuncBuying;
    },
    async doCalculateTruckDetails() {
      let totalTruck = 0;

      if (Array.isArray(this.truckDetails) && this.truckDetails.length) {
        for (let i = 0; i < this.truckDetails.length; i++) {
          totalTruck += this.truckDetails[i].Qty;
        }
      }

      this.form.model.TotalTruck = totalTruck;
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
    async initDefaultForm() {
      //BEGIN FINANCIAL SETUP
      await this.$store.dispatch(
        "features/company/financial_setup/actGet",
        "FinancialSetup?"
      );

      var financialSetup = this.$store.state.features.company.financial_setup
        .data;

      var arr = [];
      if (financialSetup.length) {
        financialSetup = financialSetup[0];
        this.form.FunctionalCurrency = financialSetup.FuncCurrencyCode;
        this.form.model.ExchangeRate = 1;

        if (financialSetup.UomScheduleCode != "") {
          await this.$store.dispatch(
            "features/company/uom/header/actGet",
            "UomHeader?UomScheduleCode=" + financialSetup.UomScheduleCode
          );

          this.$store.state.features.company.uom.header.data.forEach(function(
            row,
            index
          ) {
            if (row.UomDetails.length > 0) {
              row.UomDetails.forEach(function(dtl, index) {
                arr.push({ value: dtl.UomDetailId, text: dtl.UomName });
              });
            }
          });
        }
      }
      this.optionUom = arr;

      //END FINANCIAL SETUP

      //BEGIN RECEIVABLE SETUP
      await this.$store.dispatch(
        "features/company/receivable_setup/actGet",
        "ReceivableSetup?"
      );

      if (this.$store.state.features.company.receivable_setup.data != null) {
        const recSetup = cloneDeep(
          this.$store.state.features.company.receivable_setup.data
        );

        this.ReceivableSetup = recSetup;
        if (
          this.ReceivableSetup != undefined &&
          Array.isArray(this.ReceivableSetup)
        ) {
          this.form.defaultRateType = this.ReceivableSetup[0].DefaultRateType;
        }
      }

      //END RECEIVABLE SETUP

      //BEGIN DOCUMENT TYPE & TRANSACTION TYPE
      const trxModule = this.$store.state.features.sales.ns_progress.TrxModule;
      const docFeatureId = this.$store.state.features.sales.ns_progress
        .DocFeatureId;

      let trxType = await this.$store.dispatch(
        "features/finance/document_type/actGetByDocSetup",
        trxModule
      );

      this.listTransactionType = [];
      if (trxType != undefined) {
        if (trxType.TransactionTypes != undefined) {
          this.listTransactionType = cloneDeep(
            trxType.TransactionTypes.filter(x => x.DocFeatureId == docFeatureId)
          );
        }
      }
      //END DOCUMENT TYPE & TRANSACTION TYPE

      // START GET ALL TRANSACTION TYPE
      await this.$store.dispatch(
        "features/company/transaction_type/actGetData",
        "MSTransactionType"
      );
      var msdata = this.$store.state.features.company.transaction_type.data;

      if (msdata != undefined) {
        this.listTransactionType.forEach(function(trx) {
          let find = msdata.filter(
            x => x.TransactionType == trx.TransactionType
          );
          if (find != undefined && find.length) {
            trx["PaymentCondition"] = find[0]["PaymentCondition"];
            trx["RequiredSubject"] = find[0]["RequiredSubject"];
          }
        });
      }
      // END GET ALL TRANSACTION TYPE
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
    async updateToken(url) {
      await loginServices.doLoginCompany(
        this.$store.state.user,
        this.$store.state.companySecurity,
        this.$store.state.token.replace("Bearer ", "")
      );
    },
    async handleGetApproved(url) {
      await this.$store.dispatch("features/sales/ns_approved/actGetData", url);
      await this.updateToken();
    },
    async onFormClose() {
      this.ErrorMessage = "";
      this.isForm = false;
      this.form.isEdit = false;

      this.resetForm();
    },
    resetForm() {
      this.form.model.NegotiationSheetId =
        "00000000-0000-0000-0000-000000000000";
      this.form.model.TransactionDate = moment().format("YYYY-MM-DD");
      this.form.display.DocumentDate = moment().format(this.dateFormatString);
      this.form.model.TransactionType = "";
      this.form.model.SalesOrderId = "00000000-0000-0000-0000-000000000000";
      this.form.model.DocumentNo = "";
      this.form.model.TotalFuncSelling = 0;
      this.form.model.TotalFuncBuying = 0;
      this.form.model.TotalFuncProfit = 0;
      this.form.model.Remark = "";
      this.form.model.InvoiceDate = moment().format("YYYY-MM-DD");
      this.form.model.IsCreateSelling = true;

      //RESET SALES ORDER
      this.form.model.DocumentNo = "";
      
      this.form.model.SalesCode = "";
      this.form.model.MasterNo = "";
      this.form.model.AgreementNo = "";

      this.form.display.CreatedByName = "";
      this.form.display.CreatedDate = moment().format("DD-MM-YYYY HH:mm:ss");
      this.form.display.ModifiedByName = "";
      this.form.display.ModifiedDate = moment().format("DD-MM-YYYY HH:mm:ss");
      
      this.containerDetails = [];
      this.truckDetails = [];
      this.sellingDetails = [];
      this.buyingDetails = [];
      
      this.isSellingCheckAll = false;
      this.isBuyingCheckAll = false;

      this.$refs.tabCharges.activate();

      this.$nextTick(() => {
        this.$refs.observer.reset();
      });
    },
    async onFormCreate() {
      this.resetForm();

      this.form.isEdit = false;
      this.isForm = true;
    },
    async onModalCustomerAddressDetail(
      CustomerId,
      AddressCode,
      CustomerBillToAddressCode,
      CustomerShipToAddressCode,
      CustomerCode
    ) {
      if (CustomerBillToAddressCode == undefined) {
        await this.$store.dispatch(
          "features/company/customer/actGetData",
          "Customer?" + "&CustomerCode=" + CustomerCode + "&Inactive=false"
        );
        var data = this.$store.state.features.company.customer.data;
        if (data.length > 0) {
          CustomerBillToAddressCode = data[0].BillToAddressCode;
          CustomerShipToAddressCode = data[0].ShipToAddressCode;
        }
      }

      this.$refs.dlgCustomerAddressDetail
        .open(
          CustomerId,
          AddressCode,
          CustomerBillToAddressCode,
          CustomerShipToAddressCode
        )
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
    async onSelectedCustomerDetail(item) {
      console.log("[onSelectedCustomerDetail] ...");
    },
    async doFindCustomerAddresses(reff, url) {
      if (url == undefined) {
        url = this.$store.state.features.company.customer_address.baseUrl;
      }

      var customerid = null;
      if (reff == "ShipperAddressCode")
        customerid = this.form.model.ShipperId;
      if (reff == "AddressCode") customerid = this.form.model.CustomerId;
      if (reff == "ConsigneeAddressCode")
        customerid = this.form.model.ConsigneeId;
      if (reff == "NotifyPartnerAddressCode") {
        customerid = this.form.model.NotifyPartnerId;
        if (this.IsDifferentNotifyPartner)
          this.form.model.NotifyPartnerAddressCode =
            item.NotifyPartnerAddressCode;
        else this.form.model.NotifyPartnerAddressCode = "";
      }

      if (url.toLowerCase().lastIndexOf("customerid") < 0) {
        url = url + "&CustomerId=" + customerid + "&Inactive=false";
      } else {
        var clean_uri = url
          .toLowerCase()
          .substring(0, url.indexOf("&customerid"));
        url = clean_uri + "&CustomerId=" + customerid + "&Inactive=false";
      }

      if (url.toLowerCase().lastIndexOf("customeraddress") < 0) {
        url = "customeraddress?" + url;
      }

      await this.$store.dispatch(
        "features/company/customer_address/actGetData",
        url
      );
    },
    async handleGetCustomerAddress(url) {
      await this.doFindCustomerAddresses(url);
    },
    async handleSelectCustomerAddress(row) {
      
      this.isShowCustomerAddress = false;
    },
    async onModalSearchCustomerAddress(reff, active) {
      await this.doFindCustomerAddresses(reff);

      this.isShowCustomerAddress = true;
    },
    async handleEdit(row) {
      //NS BEGIN
      this.form.model.NegotiationSheetId = row.NegotiationSheetId;
      this.form.model.TransactionDate = moment(row.TransactionDate)
        .utc()
        .format("YYYY-MM-DD");
      this.form.display.DocumentDate = moment(this.form.model.TransactionDate)
        .utc()
        .format(this.dateFormatString);

      this.form.model.TransactionType = row.TransactionType;
      this.form.model.SalesOrderId = row.SalesOrderId;
      this.form.model.DocumentNo = row.DocumentNo;
      this.form.model.TotalFuncSelling = row.TotalFuncSelling;
      this.form.model.TotalFuncBuying = row.TotalFuncBuying;
      this.form.model.TotalFuncProfit =
        row.TotalFuncSelling - row.TotalFuncBuying;
      this.form.model.Remark = "";
      this.form.model.Status = util.docStatus(row.Status);
      //NS END

      //SALES ORDER
      this.form.salesOrder = cloneDeep(row.SalesOrder);

      //BEGIN DOCUMENT STATUS
      this.form.display.DocumentStatus = row.Status;
      this.form.display.CreatedByName = row.CreatedBy;
      this.form.display.CreatedDate = moment(row.CreatedDate).format(
        "DD-MM-YYYY HH:mm:ss"
      );
      this.form.display.ModifiedByName = row.ModifiedByName;
      this.form.display.ModifiedDate = moment(row.ModifiedByName).format(
        "DD-MM-YYYY HH:mm:ss"
      );
      //END DOCUMENT STATUS

      //GET PAYMENT CONDITION By TRX TYPE
      let paymentCondition = 0;
      let myTrxType = this.listTransactionType.filter(
        tt => tt.TransactionType == row.TransactionType
      );
      if (myTrxType != undefined) {
        paymentCondition = myTrxType[0].PaymentCondition;
      }

      if(paymentCondition==1){
        this.form.display.PaymentConditionCaption = 'NONE OR PREPAID ONLY';
      }else if(paymentCondition==2){
        this.form.display.PaymentConditionCaption = 'NONE OR COLLECT ONLY';
      }else{
        this.form.display.PaymentConditionCaption = '';
      }

      //CHARGES SELLING + BUYING
      var arrdata = cloneDeep(row.NsSellings);

      let discPercentage = 0;
      arrdata.forEach(function(item, index) {
        discPercentage = 0;
        if (item.OriginatingDiscount > 0) {
          discPercentage =
            (item.OriginatingDiscount / item.OriginatingAmount).toFixed(2) *
            100;
        }

        item.Index = index;
        item.DiscountPercentage = discPercentage;
        item.DiscountByAmount = false;
        item.TaxPercentDiscount = item.PercentDiscount;

        if(item.ReceiveTransactionId != '00000000-0000-0000-0000-000000000000' && item.ReceiveDocumentNo != ''){
          item.IsChecked = true;
        }else{
          item.IsChecked = false;
        }
        
        item.moneyOptionsarr = {
          decimal: ",",
          thousands: ".",
          prefix: "",
          suffix: "",
          precision: item.DecimalPlaces,
          masked: false,
          allowBlank: false,
          min: 0
        };
      });
      
      this.sellingDetails = cloneDeep(
        arrdata.filter(
          x => x.PaymentCondition == 0 || x.PaymentCondition == paymentCondition
        )
      );

      //BUYINGS
      var arrdata2 = cloneDeep(row.NsBuyings);

      arrdata2.forEach(function(item, index) {
        discPercentage = 0;
        if (item.OriginatingDiscount > 0) {
          discPercentage =
            (item.OriginatingDiscount / item.OriginatingAmount).toFixed(2) *
            100;
        }

        item.Index = index;
        item.DiscountPercentage = discPercentage;
        item.DiscountByAmount = false;
        item.TaxPercentDiscount = item.PercentDiscount;
        
        if(item.PayableTransactionId != '00000000-0000-0000-0000-000000000000' && item.PayableDocumentNo != ''){
          item.IsChecked = true;
        }else{
          item.IsChecked = false;
        }

        item.moneyOptionsarr = {
          decimal: ",",
          thousands: ".",
          prefix: "",
          suffix: "",
          precision: item.DecimalPlaces,
          masked: false,
          allowBlank: false,
          min: 0
        };
      });

      //this.buyingDetails = arrdata2;
      this.buyingDetails = cloneDeep(
        arrdata2.filter(
          x => x.PaymentCondition == 0 || x.PaymentCondition == paymentCondition
        )
      );

      //END CHARGES SELLING + BUYING

      //BEGIN TRUCKS
      this.truckDetails = cloneDeep(row.NsTruckings);
      //END TRUCKS

      //BEGIN CONTAINERS
      this.containerDetails = cloneDeep(row.NsContainers);
      //END CONTAINERS

      await this.activateButtons();

      this.form.isEdit = true;
      this.isForm = true;
    },
    async obtainApprovalComment() {
      await this.$store.dispatch(
        "features/sales/ns_history/actGetApprovalComment",
        "GetNegotiationSheetApprovalComments?NegotiationSheetId=" +
          this.form.model.NegotiationSheetId
      );
      this.ApprovalCommentHistory = this.$store.state.features.sales.ns_history.dataComment;
    },
    async activateButtons() {
      //ACTIVATE BUTTONS
      if (
        this.form.model.NegotiationSheetId != "" &&
        this.form.model.DocumentNo != ""
      ) {
        if (this.form.model.Status == util.docStatus("approved")) {
          this.actionButton.AllowApproval = false;
          this.actionButton.AllowSave = false;
          this.actionButton.AllowEdit = false;

          await this.obtainApprovalComment();

          this.actionButton.AllowSubmitApproval = true;
          this.actionButton.AllowApprovalHistory = true;
        } else {
          //await this.obtainApprovalComment();

          this.actionButton.AllowEdit = false;
          this.actionButton.AllowSave = false;
          this.actionButton.AllowSubmitApproval = false;
          this.actionButton.AllowApproval = false;
          this.actionButton.AllowApprovalHistory = false;
        }
      } else {
        this.actionButton.AllowEdit = false;
        this.actionButton.AllowSave = false;
        this.actionButton.AllowSubmitApproval = false;
        this.actionButton.AllowApproval = false;
        this.actionButton.AllowApprovalHistory = false;
      }
    },

    async onModalCharges(row, index, obj) {
      this.$refs.dlgCharges
        .open(
          row,
          this.form.model[row],
          this.form.model.TransactionType,
          "",
          obj
        )
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
    async onSelectedCharges(item, modelReff, obj) {
      let paymentCondition = this.listTransactionType.filter(
        x => x.TransactionType == item.TransactionType
      )[0].PaymentCondition;

      if (modelReff == "SELL") {
        let newCharge = {
          Index: this.sellingDetails.length,
          ChargeId: item.ChargesId,
          ChargeCode: item.ChargesCode,
          ChargeName: item.ChargesName,
          CurrencyCode: this.form.FunctionalCurrency,
          ExchangeRate: 1,
          OriginatingExtendedAmount: 0,
          FunctionalTax: 0,
          FunctionalDiscount: 0,
          FunctionalExtendedAmount: 0,
          TaxScheduleId: item.TaxScheduleId,
          IsTaxAfterDiscount: true,
          PercentDiscount: item.PercentDiscount,
          HasCosting: item.HasCosting,
          PaymentCondition: paymentCondition,
          CustomerId: null,
          Remark: "",
          IsMultiply: true,
          OriginatingAmount: 0,
          OriginatingTax: 0,
          OriginatingDiscount: 0,
          DiscountPercentage: 0,
          DiscountByAmount: false,
          ChargeTo: "",
          NsBuyings: [],
          moneyOptionsarr: {
            decimal: ",",
            thousands: ".",
            prefix: "",
            suffix: "",
            precision: 0,
            masked: false,
            allowBlank: false,
            min: 0
          }
        };

        let taxScheduleCode = item.TaxScheduleCode;

        if (taxScheduleCode != "") {
          await this.$store.dispatch(
            "features/company/tax_schedule/actGetTaxSchedule",
            "TaxSchedule?&TaxScheduleCode=" + taxScheduleCode
          );
          var row = this.$store.state.features.company.tax_schedule.data;

          if (row != undefined) {
            newCharge["TaxScheduleId"] = row[0].TaxScheduleId;
            newCharge["ScheduleCode"] = row[0].TaxScheduleCode;
            newCharge["IsTaxAfterDiscount"] = row[0].TaxInclude;
            newCharge["ScheduleDesc"] = row[0].Description;
            newCharge["TaxPercentDiscount"] = row[0].PercentOfSalesPurchase;
            newCharge["TaxablePercentTax"] = row[0].TaxablePercent;
          }
        }

        this.sellingDetails.push(newCharge);
      } else {
        let newCharge = {
          ChargeId: item.ChargesId,
          ChargeCode: item.ChargesCode,
          ChargeName: item.ChargesName,
          CurrencyCode: this.form.FunctionalCurrency,
          ExchangeRate: 1,
          OriginatingExtendedAmount: 0,
          FunctionalTax: 0,
          FunctionalDiscount: 0,
          FunctionalExtendedAmount: 0,
          TaxScheduleId: "",
          IsTaxAfterDiscount: true,
          PercentDiscount: item.PercentDiscount,
          PaymentCondition: paymentCondition,
          VendorId: null,
          Remark: "",
          IsMultiply: true,
          OriginatingAmount: 0,
          OriginatingTax: 0,
          OriginatingDiscount: 0,
          DiscountPercentage: 0,
          DiscountByAmount: false,
          ChargeTo: "",
          moneyOptionsarr: {
            decimal: ",",
            thousands: ".",
            prefix: "",
            suffix: "",
            precision: 0,
            masked: false,
            allowBlank: false,
            min: 0
          }
        };

        let taxScheduleCode = item.TaxScheduleCode;
        if (taxScheduleCode != "") {
          await this.$store.dispatch(
            "features/company/tax_schedule/actGetTaxSchedule",
            "TaxSchedule?&TaxScheduleCode=" + taxScheduleCode
          );
          var row = this.$store.state.features.company.tax_schedule.data;

          if (row != undefined) {
            newCharge["TaxScheduleId"] = row[0].TaxScheduleId;
            newCharge["ScheduleCode"] = row[0].TaxScheduleCode;
            newCharge["IsTaxAfterDiscount"] = row[0].TaxInclude;
            newCharge["ScheduleDesc"] = row[0].Description;
            newCharge["TaxPercentDiscount"] = row[0].PercentOfSalesPurchase;
            newCharge["TaxablePercentTax"] = row[0].TaxablePercent;
          }
        }

        this.buyingDetails.push(newCharge);

      }
    },

    async onModalSearchVendor(ordertype, row, index, indexbuying) {
      this.ordertype = ordertype;
      if (ordertype == "Truck") {
        this.truckindex = index;
      } else {
        this.index = index;
        this.indexbuying = indexbuying;
      }

      this.$refs.dlgVendor
        .open(row, this.form.model[row])
        .then(res => {
          //console.log(res);
        })
        .catch(res => {
          //console.log(res);
        });
    },
    async getCurrentExchangeRate(currencyCode) {
      let exchangeRate = 1;
      if (currencyCode != "") {
        await this.$store.dispatch(
          "features/company/exchange_rate_header/actGetCurrentExchangeRate",
          "GetCurrentExchangeRate?CurrencyCode=" +
            currencyCode +
            "&TransactionDate=" +
            this.form.model.TransactionDate +
            "&RateType=" +
            this.form.defaultRateType
        );

        exchangeRate = this.$store.state.features.company.exchange_rate_header
          .dataExcRate;
      }
      return exchangeRate;
    },
    validateForm() {
      let valid = true;
      let validAmount = true;
      let text = "";

      return valid;
    },
    async prepareFormData() {
      this.form.model.NsSellings = this.sellingDetails;
      this.form.model.NsBuyings = this.buyingDetails;
    },
    async onSubmit() {
      if (this.validateForm()) {
        this.showLoader(true);

        await this.prepareFormData();

        this.showLoader(false);
      }
    },
    //BEGIN CHARGE DETAIL RELATED
    async onModalSearchCurrency(type, row, sellItem, buyItem) {
      let arr = [];
      arr.push({ TYPE: type });
      arr.push(sellItem);
      if (buyItem != undefined) {
        arr.push(buyItem);
      }

      this.$refs.dlgCurrency
        .open(row, this.form.model[row], arr)
        .then(res => {})
        .catch(res => {});
    },
    async onSelectedCurrency(item, modelReff, obj) {
      //console.log('[onSelectedCurrency] ... ' + JSON.stringify(item));
      if (obj != undefined && obj.length) {
        let chargeType = obj[0];
        let reffSell = obj[1];

        if (chargeType["TYPE"] == "SELL" && obj.length < 3) {
          let selling = this.sellingDetails.filter(
            x => x.Index == reffSell.Index && x.ChargesId == reffSell.ChargesId
          )[0];

          selling["CurrencyCode"] = item.CurrencyCode;

          if (item.DecimalPlaces != undefined)
            selling["moneyOptionsarr"].precision = item.DecimalPlaces;

          if (item.CurrencyCode != this.form.FunctionalCurrency) {
            selling["ExchangeRate"] = await this.getCurrentExchangeRate(
              item.CurrencyCode
            );
          } else {
            selling["moneyOptionsarr"].precision = 0;
            selling["ExchangeRate"] = 1;
            selling["IsMultiply"] = true;
          }
        } else {
          let reffBuy = obj[2];

          let buying = this.buyingDetails
            .filter(
              x =>
                x.Index == reffSell.Index && x.ChargesId == reffSell.ChargesId
            )[0]
            .NsBuyings.filter(
              y => y.Index == reffBuy.Index && y.ChargesId == reffBuy.ChargesId
            )[0];

          buying["CurrencyCode"] = item.CurrencyCode;

          if (item.DecimalPlaces != undefined)
            buying["moneyOptionsarr"].precision = item.DecimalPlaces;

          if (item.CurrencyCode != this.form.FunctionalCurrency) {
            buying["ExchangeRate"] = await this.getCurrentExchangeRate(
              item.CurrencyCode
            );
          } else {
            buying["moneyOptionsarr"].precision = 0;
            buying["ExchangeRate"] = 1;
            buying["IsMultiply"] = true;
          }
        }
      }
    },
    async openModalExchangeRate(
      CurrencyCode,
      reffOptions,
      currentRate,
      type,
      sellItem,
      buyItem
    ) {
      let reffObj = [];
      reffObj.push({ TYPE: type });
      reffObj.push(sellItem);
      if (buyItem != undefined) {
        reffObj.push(buyItem);
      }

      this.$refs.dlgExchangeRate
        .open(
          CurrencyCode,
          this.form.model.TransactionDate,
          this.form.defaultRateType,
          reffOptions,
          currentRate,
          -1,
          reffObj
        )
        .then(res => {
          //console.log(res);
        })
        .catch(res => {
          //console.log(res);
        });
    },
    async onSelectedExchangeRate(item) {
      if (item != undefined) {
        if (item.ReffObj != undefined) {
          let chargeType = item.ReffObj[0];
          let reffSell = item.ReffObj[1];

          if (chargeType["TYPE"] == "SELL" && item.ReffObj.length < 3) {
            let selling = this.sellingDetails.filter(
              x =>
                x.Index == reffSell.Index && x.ChargesId == reffSell.ChargesId
            )[0];

            if (item.CurrencyCode != this.form.FunctionalCurrency) {
              selling["ExchangeRate"] = item.ExchangeRateAmount;
              selling["IsMultiply"] = item.CalcIsMultiply;
            } else {
              selling["ExchangeRate"] = 1;
              selling["IsMultiply"] = true;
            }
          } else {
            let reffBuy = item.ReffObj[2];

            let buying = this.buyingDetails
              .filter(
                x =>
                  x.Index == reffSell.Index && x.ChargesId == reffSell.ChargesId
              )[0]
              .NsBuyings.filter(
                y =>
                  y.Index == reffBuy.Index && y.ChargesId == reffBuy.ChargesId
              )[0];

            if (item.CurrencyCode != this.form.FunctionalCurrency) {
              buying["ExchangeRate"] = item.ExchangeRateAmount;
              buying["IsMultiply"] = item.CalcIsMultiply;
            } else {
              buying["ExchangeRate"] = 1;
              buying["IsMultiply"] = true;
            }
          }
        }
      }
    },
    async openModalExtendedTax(
      type,
      currencyCode,
      isMultiply,
      orgAmount,
      exchangeRate,
      taxScheduleId,
      scheduleCode,
      scheduleDesc,
      taxablePercentTax,
      taxPercentDiscount,
      isTaxAfterDiscount,
      orgDiscount,
      discByAmount,
      refMoneyOptions,
      sellItem,
      buyItem
    ) {
      let reffObj = [];
      reffObj.push({ TYPE: type });
      reffObj.push(sellItem);
      if (buyItem != undefined) {
        reffObj.push(buyItem);
      }

      this.$refs.dlgExtendedTax
        .open(
          currencyCode,
          orgAmount,
          isMultiply,
          exchangeRate,
          taxScheduleId,
          scheduleCode,
          scheduleDesc,
          taxablePercentTax,
          taxPercentDiscount,
          isTaxAfterDiscount,
          orgDiscount,
          discByAmount,
          refMoneyOptions,
          reffObj //OBJECT TO MODIFY REFF
        )
        .then(res => {
          //console.log(res);
        })
        .catch(res => {
          //alert(res);
        });
    },
    async onSelectedExtendedTax(item, modelReff) {
      if (item.ReffObj != undefined) {
        let chargeType = item.ReffObj[0];
        let reffSell = item.ReffObj[1];

        if (chargeType["TYPE"] == "SELL" && item.ReffObj.length < 3) {
          //SELLING
          let selling = this.sellingDetails.filter(
            x => x.Index == reffSell.Index && x.ChargesId == reffSell.ChargesId
          )[0];

          if (selling != undefined) {
            selling["TaxScheduleId"] =
              item.TaxScheduleId == ""
                ? "00000000-0000-0000-0000-000000000000"
                : item.TaxScheduleId;
            selling["ScheduleCode"] = item.TaxScheduleCode;
            selling["OriginatingAmount"] = item.OrgAmount;
            selling["DiscountPercentage"] = item.DiscountPercentage;
            selling["DiscountByAmount"] = item.DiscountByAmount;
            selling["IsTaxAfterDiscount"] = item.IsTaxAfterDiscount;
            selling["OriginatingTax"] = item.OriginatingTaxAmount;
            selling["ScheduleCode"] = item.TaxScheduleCode;
            selling["TaxPercentDiscount"] = item.PercentageTaxBasedAmount;
            selling["TaxablePercentTax"] = item.TaxablePercent;
            selling["PercentDiscount"] = item.Percent;
            selling["OriginatingDiscount"] = item.OrgDiscAmount;
            selling["TaxablePercentTax"] = item.TaxablePercent;
            selling["OriginatingExtendedAmount"] =
              item.OriginatingExtendedAmount;
            selling["FunctionalExtendedAmount"] = item.FunctionalExtendedAmount;
          }
        } else {
          //BUYING
          let reffBuy = item.ReffObj[2];

          let buying = this.buyingDetails
            .filter(
              x =>
                x.Index == reffSell.Index && x.ChargesId == reffSell.ChargesId
            )[0]
            .NsBuyings.filter(
              y => y.Index == reffBuy.Index && y.ChargesId == reffBuy.ChargesId
            )[0];

          if (buying != undefined) {
            buying["TaxScheduleId"] =
              item.TaxScheduleId == ""
                ? "00000000-0000-0000-0000-000000000000"
                : item.TaxScheduleId;
            buying["ScheduleCode"] = item.TaxScheduleCode;
            buying["OriginatingAmount"] = item.OrgAmount;
            buying["DiscountPercentage"] = item.DiscountPercentage;
            buying["DiscountByAmount"] = item.DiscountByAmount;
            buying["IsTaxAfterDiscount"] = item.IsTaxAfterDiscount;
            buying["OriginatingTax"] = item.OriginatingTaxAmount;
            buying["TaxPercentDiscount"] = item.PercentageTaxBasedAmount;
            buying["TaxablePercentTax"] = item.TaxablePercent;
            buying["PercentDiscount"] = item.Percent;
            buying["OriginatingDiscount"] = item.OrgDiscAmount;
            buying["TaxablePercentTax"] = item.TaxablePercent;
            buying["OriginatingExtendedAmount"] =
              item.OriginatingExtendedAmount;
            buying["FunctionalExtendedAmount"] = item.FunctionalExtendedAmount;
          }
        }
      }
    },
    async onModalSearchCustomer(type, sellItem, buyItem) {
      let reffObj = [];
      reffObj.push({ TYPE: type });
      reffObj.push(sellItem);
      if (buyItem != undefined) {
        reffObj.push(buyItem);
      }

      this.$refs.dlgCustomer
        .open("CustomerCode", sellItem.CustomerCode, reffObj)
        .then(res => {
          //console.log(res);
        })
        .catch(res => {
          //console.log(res);
        });
    },
    async onSelectedCustomer(item, model, reffObj) {
      if (reffObj != undefined) {
        let chargeType = reffObj[0];

        if (chargeType["TYPE"] == "SELL") {
          let reffSell = reffObj[1];

          //SELLING
          let selling = this.sellingDetails.filter(
            x => x.Index == reffSell.Index && x.ChargesId == reffSell.ChargesId
          )[0];

          if (selling != undefined) {
            selling["ChargeTo"] = item.CustomerCode;
            selling["CustomerId"] = item.CustomerId;
          } else {
            selling["ChargeTo"] = "";
            selling["CustomerId"] = "";
          }
        } else if (chargeType["TYPE"] == "CustomerCode") {
          this.form.model.CustomerId = item.CustomerId;
          this.form.model.CustomerCode = item.CustomerCode;
          this.form.model.CustomerName = item.CustomerName;
          this.form.model.AddressCode = item.AddressCode;
          this.form.model.CustomerBillToAddressCode =
            item.BillToAddressCode;
          this.form.model.CustomerShipToAddressCode =
            item.ShipToAddressCode;
        }
      }
    },
    async onModalSearchVendor(type, sellItem, buyItem) {
      let reffObj = [];
      reffObj.push({ TYPE: type });
      reffObj.push(sellItem);
      if (buyItem != undefined) {
        reffObj.push(buyItem);
      }

      this.$refs.dlgVendor
        .open("VendorCode", sellItem.VendorCode, reffObj)
        .then(res => {
          //console.log(res);
        })
        .catch(res => {
          //console.log(res);
        });
    },
    async onSelectedVendor(item, model, reffObj) {
      if (reffObj != undefined) {
        let chargeType = reffObj[0];

        if (chargeType["TYPE"] == "BUY") {
          let reffSell = reffObj[1];
          //BUYING
          let reffBuy = reffObj[2];

          let buying = this.buyingDetails
            .filter(
              x =>
                x.Index == reffSell.Index && x.ChargesId == reffSell.ChargesId
            )[0]
            .NsBuyings.filter(
              y => y.Index == reffBuy.Index && y.ChargesId == reffBuy.ChargesId
            )[0];

          if (buying != undefined) {
            buying["ChargeTo"] = item.VendorCode;
            buying["VendorId"] = item.VendorId;
          } else {
            buying["ChargeTo"] = "";
            buying["VendorId"] = "";
          }
        } else if (chargeType["TYPE"] == "TRUCK") {
          let reffTruck = reffObj[1];
          let truck = this.truckDetails.filter(
            x =>
              x.Index == reffTruck.Index &&
              x.VehicleTypeId == reffTruck.VehicleTypeId
          )[0];

          if (truck != undefined) {
            truck["VendorId"] = item.VendorId;
            truck["VendorCode"] = item.VendorCode;
            truck["VendorName"] = item.VendorName;
          }
        }
      }
    },
    //END CHARGE DETAIL RELATED

    // BEGIN MODAL INVOICE /
    validateModalInvoice() {
      let valid = true;
      
      if(this.form.model.IsCreateSelling){
        
        if (this.sellingDetails.filter(x=>x.IsChecked && x.ReceiveDocumentNo == '').length < 1) {
          valid = false;
          this.handleToast(
            "Confirmation",
            "danger",
            "No Selling charge is selected !"
          );
        }
      }else{
        if (this.buyingDetails.filter(x=>x.IsChecked && x.PayableDocumentNo == '').length < 1) {
          valid = false;
          this.handleToast(
            "Confirmation",
            "danger",
            "No Buying charge is selected !"
          );
        }
      }

      return valid;
    },
    resetModalInvoice() {
      this.invoiceState = null;
    },
    onModalCreateInvoice(refType) {
      if(refType=='SELL'){
        this.form.model.IsCreateSelling = true;
      }else{
         this.form.model.IsCreateSelling = false;
      }

      if(this.validateModalInvoice()){
        this.$refs["modal-create-invoice"].show();
      }
    },
    checkFormValidity() {
      const valid = this.$refs.formInvoice.checkValidity();
      this.invoiceState = valid;
      return valid;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleInvoice();
    },
    handleCancelInvoice(bvModalEvt) {
      this.resetModalInvoice();
      // Prevent modal from closing
      this.$bvModal.hide("modal-create-invoice");
    },
    handleInvoice() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      // Push the name to submitted names
      if(this.form.model.IsCreateSelling){
        this.doCreateARInvoice();
      }else{
        this.doCreateAPInvoice();
      }

      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("modal-create-invoice");
      });
    },
    async doCreateARInvoice() {
      this.showLoader(true);
      
      this.form.model.NsSellings = this.sellingDetails.filter(x=>x.IsChecked && x.ReceiveDocumentNo == '');
      this.form.model.NsBuyings = [];

      await this.$store.dispatch(
        "features/sales/ns_approved/actCreateInvoice",
        this.form.model
      );
      var response = this.$store.state.features.sales.ns_approved.resultUpdate;
      if (response.status != 200) {
        this.handleToast(
          "Confirmation",
          "danger",
          response.data.ErrorDescription != null
            ? response.data.ErrorDescription
            : "Submit failed."
        );
      } else {
        this.$refs.gridApproved.doRefresh();

        this.isForm = false;
        this.form.isEdit = false;

        this.handleToast("Confirmation", "success", response.data.Message);
      }

      this.showLoader(false);
    },
    async doCreateAPInvoice() {
      this.showLoader(true);

      this.form.model.NsSellings = [];
      this.form.model.NsBuyings = this.buyingDetails.filter(x=>x.IsChecked && x.PayableDocumentNo == '');

      await this.$store.dispatch(
        "features/sales/ns_approved/actCreateInvoice",
        this.form.model
      );
      var response = this.$store.state.features.sales.ns_approved.resultUpdate;
      if (response.status != 200) {
        this.handleToast(
          "Confirmation",
          "danger",
          response.data.ErrorDescription != null
            ? response.data.ErrorDescription
            : "Submit failed."
        );
      } else {
        this.$refs.gridApproved.doRefresh();

        this.isForm = false;
        this.form.isEdit = false;

        this.handleToast("Confirmation", "success", response.data.Message);
      }

      this.showLoader(false);
    },
    // END MODAL INVOICE /
    //BEGIN APPROVAL
    async onModalHistory() {
      this.$refs.dlgHistory
        .open(this.ApprovalCommentHistory)
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    }
    //END APPROVAL
  },
  computed: {
    HasPendingSelling(){
      return (this.sellingDetails.filter(x=>x.ReceiveDocumentNo == '').length > 0);
    },
    HasPendingBuying(){
      return (this.buyingDetails.filter(x=>x.PayableDocumentNo == '').length > 0);
    },
    maxInvoiceCalendarDate() {
      let trxDate = moment(this.form.model.TransactionDate, "YYYY-MM-DD");
      if (moment() <= trxDate) {
        return this.form.model.TransactionDate;
      } else {
        return moment().format("YYYY-MM-DD");
      }
    },
    TotalContainer: function() {
      var total = 0;
      if (this.containerDetails != undefined) {
        //console.log(this.dataDetails);
        for (var i = 0; i < this.containerDetails.length; i++) {
          total += this.containerDetails[i]["Qty"];
        }
      }

      return (this.form.model.TotalContainer = total);
    },
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
    }
  },
  filters: {
    formattedDMY: function(value, dateFormat) {
      if (value != undefined && value.length > 6) {
        if (dateFormat == undefined) dateFormat = "DD/MM/YYYY ";
        return moment(value)
          .format(dateFormat);
      } else {
        value;
      }
    }
  }
};
</script>

<style scoped>
#table-container thead th {
  font-size: 11px;
  border: 1px solid #cfd8dc;
  padding: 5px;
  background-color: #f5f5f5;
}

#table-container tbody td {
  font-size: 11px;
  border-left: 0.5px solid #cfd8dc;
  border-right: 0.5px solid #cfd8dc;
  border-bottom: 1px solid #cfd8dc;
  padding: 3px;
  background-color: white;
}

#table-container tfoot th {
  font-size: 11px;
  border: 1px solid #cfd8dc;
  padding: 5px;
  background-color: #f5f5f5;
}

#table-truck thead th {
  font-size: 11px;
  border: 1px solid #cfd8dc;
  padding: 5px;
  background-color: #f5f5f5;
}

#table-truck tbody td {
  font-size: 11px;
  border-left: 0.5px solid #cfd8dc;
  border-right: 0.5px solid #cfd8dc;
  border-bottom: 1px solid #cfd8dc;
  padding: 3px;
  background-color: white;
}

#table-truck tfoot th {
  font-size: 11px;
  border: 1px solid #cfd8dc;
  padding: 5px;
  background-color: #f5f5f5;
}

#table-detail thead th {
  font-size: 11px;
  border: 1px solid #cfd8dc;
  padding: 5px;
  background-color: #f5f5f5;
}

#table-detail tbody td {
  font-size: 11px;
  border-left: 0.5px solid #cfd8dc;
  border-right: 0.5px solid #cfd8dc;
  border-bottom: 1px solid #cfd8dc;
  padding: 3px;
  background-color: white;
}

.buying {
  font-size: 11px;
  border-left: 0.5px solid #cfd8dc;
  border-right: 0.5px solid #cfd8dc;
  border-bottom: 1px solid #cfd8dc;
  padding: 3px;
  background-color: red;
}

#table-detail tfoot th {
  font-size: 11px;
  border: 1px solid #cfd8dc;
  padding: 5px;
  background-color: #f5f5f5;
}

#table-detail input:disabled {
  background-color: #e8eaf6;
  cursor: text;
  margin: 0em;
  border: 1px solid #c2cfd6;
}

#table-detail .row-buying td {
  background-color: #eceff1;
}

#table-detail .bg-soft-blue {
  background-color: #bbdefb;
  color: #000;
}
</style>