<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <b-card no-body v-show="isForm">
      <!-- TAB Vendor BEGIN -->
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
          <b-row>
            <b-col sm="12">
              <b-card>
                <div slot="header">
                  <span class="font-weight-bold">{{formCaption}}</span>
                  <small>{{ (form.isEdit) ? "Edit" : (form.isView ?"View": "New") }}</small>

                  <div right style="float:right;">
                    <b-button
                      variant="green"
                      v-if="form.isView && form.model.Status == 'Submit'"
                      @click="clickComplete"
                    >
                      <font-awesome-icon :icon="['fas', 'door-closed']" />&nbsp;Complete
                    </b-button>

                    <b-button
                      variant="green"
                      @click="clickPosting"
                      v-if="form.isEdit"
                      v-b-tooltip.hover
                      title="Submit this Quotation"
                    >
                      <font-awesome-icon :icon="['fas', 'check-circle']" />&nbsp;Submit
                    </b-button>
                    <b-button variant="red" v-b-modal.modal-reason v-if="form.isEdit">
                      <font-awesome-icon :icon="['fas', 'ban']" v-b-tooltip.hover title="Cancel" />&nbsp;Cancel
                    </b-button>
                    <b-button variant="dark" 
                    v-if="!form.isEdit && !form.isView && form.model.TransactionType"
                    v-b-tooltip.hover title="Copy From Another Sales Quotation"
                    @click="onModalSearchQuotation('SalesQuotationId','SalesQuotationId')">
                      <font-awesome-icon :icon="['fas', 'copy']" />
                    </b-button>
                    <b-button variant="blue" type="submit" v-if="!form.isView">
                      <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                    </b-button>
                    <b-button @click="onFormClose">
                      <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                    </b-button>
                  </div>
                </div>
                <b-row>
                  <!-- BEGIN FORM -->

                  <b-col sm="12">
                    <b-alert
                      :show="false"
                      variant="danger"
                      dismissible
                      v-if="ErrorBag != '' && form.model.TransactionType != ''"
                      style="font-size:11px;"
                    >
                      <span v-html="ErrorBag"></span>
                    </b-alert>
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
                              :disabled="form.isEdit || form.isView"
                              value-field="TransactionType"
                              text-field="TransactionType"
                              :plain="true"
                              :options="listTransactionType"
                              @change="onChangeTransactionType"
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
                            v-model="form.display.DocumentDate"
                            type="text"
                            :disabled="form.isView"
                            :placeholder="dateFormatString"
                            class="text-center"
                            size="sm"
                            readonly
                          ></b-form-input>
                          <b-input-group-append>
                            <b-form-datepicker
                              v-model="form.model.TransactionDate"
                              button-only
                              :disabled="form.isView"
                              size="sm"
                              left
                              locale="en-US"
                              :min="minCalendarDate"
                              @input="dateChanged"
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
                            placeholder="Document No"
                            v-model="form.model.DocumentNo"
                            class="text-center font-weight-bold"
                            readonly
                            size="sm"
                          />
                        </b-form-group>
                      </b-col>
                      <b-col sm="3" v-if="form.isEdit || form.isView">   
                        <b-input-group >       
                          <b-button class="mt-4 px-2 bg-dark text-white form-control"  @click="openToastDocumentStatus" pill v-b-tooltip.hover title="Document Status">
                            <font-awesome-icon :icon="['fas', 'bell']" size="sm" />&nbsp;<span class="text-uppercase"><code>{{form.display.DocumentStatus}}</code></span>  
                          </b-button>
                          </b-input-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col sm="12">
                        <b-card sm="12" style="margin:0; padding:0;">
                          <b-row>
                            <b-col sm="6" md="3">
                              <b-form-group>
                                <label for="CustomerCode">Customer Code</label>
                                <validation-provider
                                  name="Customer Code"
                                  :rules="{ required: true }"
                                  v-slot="validationContext"
                                >
                                  <b-input-group prepend>
                                    <b-form-input
                                      v-model="form.model.CustomerCode"
                                      readonly
                                      size="sm"
                                      :state="validateState(validationContext)"
                                      aria-describedby="customer-code-feedback"
                                    ></b-form-input>
                                    <b-input-group-append>
                                      <b-button
                                        variant="outline-primary"
                                        v-show="!form.isView"
                                        size="sm"
                                        @click="onModalSearchCustomer('CustomerCode')"
                                      >
                                        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                      </b-button>
                                    </b-input-group-append>
                                    <b-form-invalid-feedback
                                      id="customer-code-feedback"
                                    >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                  </b-input-group>
                                </validation-provider>
                              </b-form-group>
                            </b-col>
                            <b-col sm="6" md="3">
                              <b-form-group>
                                <label for="CustomerName">Customer Name</label>
                                <b-form-input
                                  v-model="form.model.CustomerName"
                                  class="font-weight-bold"
                                  readonly
                                  size="sm"
                                ></b-form-input>
                              </b-form-group>
                            </b-col>
                            <b-col sm="6" md="3">
                              <label>Customer Address Code</label>
                              <validation-provider
                                name="Customer Address Code"
                                :rules="{ required: true }"
                                v-slot="validationContext"
                              >
                                <b-input-group prepend>
                                  <b-form-input
                                    v-model="form.model.AddressCode"
                                    class="font-weight-bold"
                                    readonly
                                    :state="validateState(validationContext)"
                                    size="sm"
                                    aria-describedby="address-code-feedback"
                                  ></b-form-input>
                                  <b-input-group-append>
                                    <b-button
                                      variant="outline-primary"
                                      size="sm"
                                      v-show="!form.isView"
                                      @click="onModalSearchCustomerAddress('AddressCode','AddressCode')"
                                    >
                                      <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                    </b-button>
                                  </b-input-group-append>
                                  <b-form-invalid-feedback
                                    id="address-code-feedback"
                                  >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-input-group>
                              </validation-provider>
                            </b-col>
                            <b-col sm="6" md="3">
                              <label>Sales Person</label>
                              <validation-provider
                                name="Sales Person"
                                :rules="{ required: true }"
                                v-slot="validationContext"
                              >
                                <b-input-group prepend>
                                  <b-form-input
                                    v-model="form.model.SalesCode"
                                    class="font-weight-bold"
                                    readonly
                                    :state="validateState(validationContext)"
                                    size="sm"
                                    aria-describedby="Sales-Person"
                                  ></b-form-input>
                                  <b-input-group-append>
                                    <b-button
                                      variant="outline-primary"
                                      v-show="!form.isView"
                                      size="sm"
                                      @click="onModalSearchSalesPerson('SalesCode')"
                                    >
                                      <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                    </b-button>
                                  </b-input-group-append>
                                  <b-form-invalid-feedback
                                    id="Sales-Person"
                                  >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-input-group>
                              </validation-provider>
                            </b-col>
                          </b-row>
                          <hr />
                          <b-tabs pills card>
                            <b-tab>
                              <template v-slot:title>
                                <font-awesome-icon :icon="['fas', 'star']" />&nbsp;Shipment
                              </template>
                              <b-row>
                                <b-col sm="12">
                                  <b-row>
                                    <b-col xs="6" sm="6" lg="3">
                                      <b-form-group>
                                        <label for="ShipperCode">Shipper Code</label>
                                        <validation-provider
                                          name="Shipper Code"
                                          ref="fieldShipperCode"
                                          :rules="ValidateShipperRule"
                                          v-slot="validationContext"
                                        >
                                          <b-input-group prepend>
                                            <b-form-input
                                              name="ShipperCode"
                                              type="text"
                                              placeholder="Shipper Code"
                                              :state="validateState(validationContext)"
                                              v-model="form.model.ShipperCode"
                                              aria-describedby="shipper-code-feedback"
                                              size="sm"
                                              readonly
                                            />
                                            <b-input-group-append>
                                              <b-button
                                                variant="outline-primary"
                                                size="sm"
                                                v-show="!form.isView"
                                                @click="onModalSearchCustomer('ShipperCode')"
                                              >
                                                <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                              </b-button>
                                            </b-input-group-append>
                                            <b-form-invalid-feedback
                                              id="shipper-code-feedback"
                                            >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                          </b-input-group>
                                        </validation-provider>
                                      </b-form-group>
                                    </b-col>
                                    <b-col xs="12" sm="12" lg="6">
                                      <b-form-group>
                                        <label for="ShipperName">Shipper Name</label>
                                        <b-form-input
                                          name="ShipperName"
                                          type="text"
                                          placeholder="Shipper Name"
                                          v-model="form.model.ShipperName"
                                          size="sm"
                                          readonly
                                        ></b-form-input>
                                      </b-form-group>
                                    </b-col>
                                    <b-col xs="6" sm="6" lg="3">
                                      <label>Shipper Address Code</label>
                                      <b-input-group prepend>
                                        <b-form-input
                                          v-model="form.model.ShipperAddressCode"
                                          size="sm"
                                          readonly class="form-control"
                                        ></b-form-input>
                                        <b-input-group-append>
                                          <b-button
                                            variant="outline-primary"
                                            size="sm" :disabled="form.model.ShipperCode == ''"
                                            v-if="!form.isView"
                                            @click="onModalSearchCustomerAddress('ShipperAddressCode','ShipperAddressCode')"
                                            v-show="!form.isView"
                                          >
                                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                          </b-button>
                                        </b-input-group-append>
                                      </b-input-group>
                                    </b-col>
                                  </b-row>
                                  <b-row>
                                    <b-col xs="6" sm="6" lg="3">
                                      <b-form-group>
                                        <label for="ConsigneeCode">Consignee Code</label>
                                        <validation-provider
                                          name="Consignee Code"
                                          ref="fieldConsigneeCode"
                                          :rules="ValidateConsigneeRule"
                                          v-slot="validationContext"
                                        >
                                          <b-input-group prepend>
                                            <b-form-input
                                              name="ConsigneeCode"
                                              type="text"
                                              placeholder="Consignee Code"
                                              v-model="form.model.ConsigneeCode"
                                              :state="validateState(validationContext)"
                                              aria-describedby="consignee-code-feedback"
                                              size="sm"
                                              readonly
                                            />
                                            <b-input-group-append>
                                              <b-button
                                                variant="outline-primary"
                                                size="sm" 
                                                @click="onModalSearchCustomer('ConsigneeCode')"
                                                v-show="!form.isView"
                                              >
                                                <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                              </b-button>
                                            </b-input-group-append>
                                            <b-form-invalid-feedback
                                              id="consignee-code-feedback"
                                            >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                          </b-input-group>
                                        </validation-provider>
                                      </b-form-group>
                                    </b-col>

                                    <b-col sm="6">
                                      <label for="ConsigneeName">Consignee Name</label>
                                      <b-form-input
                                        name="ConsigneeName"
                                        type="text"
                                        placeholder="Consignee Name"
                                        v-model="form.model.ConsigneeName"
                                        size="sm"
                                        readonly
                                      />
                                    </b-col>
                                    <b-col xs="6" sm="6" lg="3">
                                      <label>Consignee Address Code</label>
                                      <b-input-group prepend>
                                        <b-form-input
                                          v-model="form.model.ConsigneeAddressCode"
                                          size="sm"
                                          readonly
                                        ></b-form-input>
                                        <b-input-group-append>
                                          <b-button
                                            variant="outline-primary"
                                            size="sm" :disabled="form.model.ConsigneeCode == ''"
                                            @click="onModalSearchCustomerAddress('ConsigneeAddressCode','ConsigneeAddressCode')"
                                            v-show="!form.isView"
                                          >
                                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                          </b-button>
                                        </b-input-group-append>
                                      </b-input-group>
                                    </b-col>
                                  </b-row>
                                  <b-row class="mt-2">
                                    <b-col sm="3">
                                      <label>Notify Party</label>
                                      <b-input-group>
                                        <template v-slot:prepend>
                                          <b-form-radio-group
                                            class="mt-1"
                                            v-model="form.model.IsDifferentNotifyPartner"
                                            :options="[{ item: true, name: 'Same As Consignee' },{ item: false, name: 'Other' }]"
                                            size="sm"
                                            value-field="item"
                                            text-field="name"
                                            :disabled="form.isView"
                                          ></b-form-radio-group>
                                        </template>
                                      </b-input-group>
                                    </b-col>
                                    <b-col sm="3" v-show="!form.model.IsDifferentNotifyPartner">
                                      <label>Notify Party Code</label>
                                      <b-input-group prepend>
                                        <b-form-input
                                          v-model="form.model.NotifyPartnerCode"
                                          class="font-weight-bold"
                                          readonly
                                          size="sm"
                                        ></b-form-input>
                                        <b-input-group-append>
                                          <b-button
                                            variant="outline-primary"
                                            size="sm"
                                            v-show="!form.isView"
                                            @click="onModalSearchCustomer('NotifyPartnerCode','NotifyPartnerCode')"
                                          >
                                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                          </b-button>
                                        </b-input-group-append>
                                      </b-input-group>
                                    </b-col>
                                    <b-col sm="3" v-show="!form.model.IsDifferentNotifyPartner">
                                      <label for="Notify Party Name">Notify Party Name</label>
                                      <b-form-input
                                        name="NotifyPartnerName"
                                        type="text"
                                        placeholder="Notify Party Name"
                                        v-model="form.model.NotifyPartnerName"
                                        readonly
                                        size="sm"
                                      />
                                    </b-col>
                                    <b-col sm="3" v-show="!form.model.IsDifferentNotifyPartner">
                                      <label>Address Code</label>
                                      <b-input-group prepend>
                                        <b-form-input
                                          v-model="form.model.NotifyPartnerAddressCode"
                                          readonly
                                          v-show="!form.isView"
                                          size="sm"
                                          aria-describedby="bill-to-addr-feedback"
                                        ></b-form-input>
                                        <b-input-group-append>
                                          <b-button
                                            variant="outline-primary"
                                            size="sm"
                                            @click="onModalSearchCustomerAddress('NotifyPartnerAddressCode','NotifyPartnerAddressCode')"
                                            v-show="!form.isView"
                                          >
                                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                          </b-button>
                                        </b-input-group-append>
                                      </b-input-group>
                                    </b-col>
                                  </b-row>
                                </b-col>
                              </b-row>
                            </b-tab>
                            <b-tab @click="isTabMain=false">
                              <template v-slot:title>
                                <font-awesome-icon :icon="['fas', 'shipping-fast']" />&nbsp;Shipping Line
                              </template>
                              
                                <!-- BEGIN SHIPPING LINE MASTER LOOKUP -->
                                <b-row v-if="form.model.IsShippingLineMaster">
                                  <b-col xs="6" sm="6" lg="3">
                                    <b-form-group>
                                      <label for="ShipperLineCode">Shipping Line Name</label>
                                      <validation-provider
                                        name="Shipping Line Code"
                                        ref="fieldConsigneeCode"
                                        :rules="{required : true}"
                                        v-slot="validationContext"
                                      >
                                        <b-input-group prepend>
                                          <b-form-input
                                            name="ShippingLineName"
                                            type="text"
                                            placeholder="Shipping Line Code"
                                            v-model="form.model.ShippingLineName"
                                            aria-describedby="shipping-line-code-feedback"
                                            :state="validateState(validationContext,'Shipping Line')"
                                            size="sm"
                                            readonly
                                          />
                                          <b-input-group-append>
                                            <b-button
                                              variant="outline-primary"
                                              size="sm"
                                              @click="onModalSearchShippingLine('ShippingLineName')"
                                              v-show="!form.isView"
                                            >
                                              <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                            </b-button>
                                          </b-input-group-append>
                                          <b-form-invalid-feedback
                                            id="shipping-line-code-feedback"
                                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                        </b-input-group>
                                      </validation-provider>
                                    </b-form-group>
                                  </b-col>
                                  <b-col xs="6" sm="8" lg="6">
                                    <b-form-group>
                                      <label for="ShipperLineOwner">Shipping Line Owner</label>
                                      <b-form-input
                                        name="ShippingLineOwner"
                                        type="text"
                                        placeholder="Shipping Line Owner"
                                        v-model="form.model.ShippingLineOwner"
                                        size="sm"
                                        readonly
                                      ></b-form-input>
                                    </b-form-group>
                                  </b-col>
                                  <b-col sm="4" lg="3">
                                    <label>Shipping Line Type</label>
                                    <b-input-group prepend>
                                      <b-form-input
                                        v-model="form.model.ShippingLineType"
                                        size="sm"
                                        readonly
                                      ></b-form-input>
                                    </b-input-group>
                                  </b-col>
                                </b-row>
                                <!-- END SHIPPING LINE MASTER LOOKUP -->
                                <!-- BEGIN SHIPPING LINE CUSTOM -->
                                <b-row v-if="!form.model.IsShippingLineMaster">
                                  <b-col sm="3">
                                    <b-form-group>
                                      <label for="ShipperLineCode">Shipping Line Code</label>
                                      <validation-provider
                                        name="Shipping Line Code"
                                        ref="fieldConsigneeCode"
                                        :rules="{required : true}"
                                        v-slot="validationContext"
                                      >
                                        <b-input-group prepend>
                                          <b-form-input
                                            name="ShippingLineCode"
                                            type="text"
                                            placeholder="Shipping Line Code"
                                            v-model="form.model.ShippingLineCode"
                                            aria-describedby="shipping-line-code-feedback"
                                            :state="validateState(validationContext,'Shipping Line Code')"
                                            size="sm"
                                            :readonly="!form.isEdit"
                                          />
                                          <b-form-invalid-feedback
                                            id="shipping-line-code-feedback"
                                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                        </b-input-group>
                                      </validation-provider>
                                    </b-form-group>
                                  </b-col>
                                  <b-col sm="6">
                                    <b-form-group>
                                      <label for="ShippingLineName">Shipping Line Name</label>
                                      <validation-provider
                                        name="Shipping Line Name"
                                        :rules="{required : true}"
                                        v-slot="validationContext"
                                      >
                                      <b-form-input
                                        name="ShippingLineName"
                                        type="text"
                                        placeholder="Shipping Line Name"
                                        v-model="form.model.ShippingLineName"
                                        :state="validateState(validationContext,'Shipping Line Name')"
                                        size="sm"
                                        :readonly="!form.isEdit"
                                      ></b-form-input>
                                      </validation-provider>
                                    </b-form-group>
                                  </b-col>
                                </b-row>
                                <!-- END SHIPPING LINE CUSTOM -->
                                <b-row>
                                  <b-col xs="6" sm="6" lg="3">
                                    <b-form-group>
                                      <label for="ShippingLineVesselCode" class="label">Vessel/Carrier Code</label>
                                      <b-input-group prepend>
                                        <b-form-input
                                          name="ShippingLineVesselCode"
                                          type="text"
                                          placeholder="MV/Carrier Code"
                                          v-model="form.model.ShippingLineVesselCode" class="form-control"
                                          size="sm"
                                          :readonly="form.isView"
                                        />
                                      </b-input-group>
                                    </b-form-group>
                                  </b-col>
                                  <b-col xs="6" sm="8" lg="6">
                                    <b-form-group>
                                      <label for="ShippingLineVesselName">Vessel/Carrier Name</label>
                                      <b-input-group prepend>
                                        <b-form-input
                                          name="ShippingLineVesselName"
                                          type="text"
                                          placeholder="MV/Carrier Name" class="form-control"
                                          v-model="form.model.ShippingLineVesselName"
                                          size="sm"
                                          :readonly="form.isView"
                                        />
                                      </b-input-group>
                                    </b-form-group>
                                  </b-col>
                                  <b-col sm="4" lg="3">
                                    <label>Voyage/Flight No</label>
                                    <b-input-group prepend>
                                      <b-form-input
                                        v-model="form.model.ShippingLineShippingNo"
                                        class="font-weight-bold"
                                        size="sm"
                                        :disabled="form.isView"
                                      ></b-form-input>
                                    </b-input-group>
                                  </b-col>
                                  <b-col sm="5" lg="3">
                                    <label>Estimate Departure</label>
                                    <b-input-group>
                                      <b-form-input
                                        id="EstimateDelivery2"
                                        type="text"
                                        :placeholder="dateFormatString"
                                        :value="form.model.ShippingLineDelivery | formattedDMY"
                                        class="text-center"
                                        size="sm"
                                        readonly
                                      ></b-form-input>
                                      <b-input-group-append>
                                        <b-form-datepicker
                                          v-model="form.model.ShippingLineDelivery"
                                          button-only
                                          size="sm"
                                          left
                                          locale="en-US"
                                          :min="minCalendarDate"
                                          :disabled="form.isView"
                                        ></b-form-datepicker>
                                      </b-input-group-append>
                                    </b-input-group>
                                  </b-col>
                                  <b-col sm="5" lg="3">
                                    <label>Estimate Arrival</label>
                                    <b-input-group>
                                      <b-form-input
                                        id="EstimateArrival1"
                                        type="text"
                                        :placeholder="dateFormatString"
                                        :value="form.model.ShippingLineArrival | formattedDMY"
                                        class="text-center"
                                        size="sm"
                                        readonly
                                      ></b-form-input>
                                      <b-input-group-append>
                                        <b-form-datepicker
                                          v-model="form.model.ShippingLineArrival"
                                          button-only
                                          size="sm"
                                          left
                                          locale="en-US"
                                          :min="minCalendarDate"
                                          :disabled="form.isView"
                                        ></b-form-datepicker>
                                      </b-input-group-append>
                                    </b-input-group>
                                  </b-col>
                                </b-row>
                              
                              <b-row class="mt-3">
                                <b-col sm="6" lg="3">
                                  <b-form-group>
                                    <label for="PortOfLoading">Port Of Loading</label>
                                    <validation-provider
                                      name="Port Of Loading"
                                      :rules="{required : true}"
                                      v-slot="validationContext"
                                    >
                                      <b-input-group prepend>
                                        <b-form-input
                                          name="Port Of Loading"
                                          type="text"
                                          placeholder="Port Of Loading"
                                          v-model="form.model.PortOfLoading"
                                          :state="validateState(validationContext,'Port Of Loading')"
                                          size="sm"
                                          readonly
                                        />
                                        <b-input-group-append>
                                          <b-button
                                            variant="outline-primary"
                                            size="sm"
                                            v-show="!form.isView"
                                            @click="onModalSearchPort('PortOfLoading')"
                                          >
                                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                          </b-button>
                                        </b-input-group-append>
                                        <b-form-invalid-feedback>{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                      </b-input-group>
                                    </validation-provider>
                                  </b-form-group>
                                </b-col>
                                <b-col sm="6" lg="3">
                                  <b-form-group>
                                    <label for="PortOfDischarges">Port Of Discharge</label>
                                    <validation-provider
                                      name="Port Of Discharge"
                                      :rules="{required : true}"
                                      v-slot="validationContext"
                                    >
                                      <b-input-group prepend>
                                        <b-form-input
                                          name="Port Of Discharge"
                                          type="text"
                                          placeholder="Port Of Discharge"
                                          v-model="form.model.PortOfDischarge"
                                          aria-describedby="Port-Of-Discharge"
                                          :state="validateState(validationContext,'Port Of Discharge')"
                                          size="sm"
                                          readonly
                                        />
                                        <b-input-group-append>
                                          <b-button
                                            variant="outline-primary"
                                            size="sm"
                                            v-show="!form.isView"
                                            @click="onModalSearchPort('PortOfDischarge')"
                                          >
                                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                          </b-button>
                                        </b-input-group-append>
                                        <b-form-invalid-feedback>{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                      </b-input-group>
                                    </validation-provider>
                                  </b-form-group>
                                </b-col>
                                <b-col sm="6" lg="3">
                                  <b-form-group>
                                    <label for="TermofShipment">Term Of Shipment</label>
                                    <validation-provider
                                      name="Term Of Shipment"
                                      :rules="{required : true}"
                                      v-slot="validationContext"
                                    >
                                      <b-form-select
                                        name="Term Of Shipment"
                                        v-model="form.model.TermOfShipment"
                                        :plain="true"
                                        :options="optionTermOfShipment"
                                        :state="validateState(validationContext,'Term Of Shipment')"
                                        size="sm"
                                        :disabled="form.isView"
                                        aria-describedby="Term-Of-Shipment"
                                      />
                                      <b-form-invalid-feedback>{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                    </validation-provider>
                                  </b-form-group>
                                </b-col>
                                <b-col sm="6" lg="3">
                                  <b-form-group>
                                    <label for="FinalDestination">Final Destination</label>
                                    <validation-provider
                                      name="Final Destination"
                                      :rules="{required : true}"
                                      v-slot="validationContext"
                                    >
                                      <b-input-group prepend>
                                        <b-form-input
                                          name="Final Destination"
                                          type="text"
                                          placeholder="Final Destination"
                                          v-model="form.model.FinalDestination"
                                          :state="validateState(validationContext,'Final Destination')"
                                          aria-describedby="Final-Destination"
                                          readonly
                                          size="sm"
                                        />
                                        <b-input-group-append>
                                          <b-button v-show="!form.isView"
                                            variant="outline-primary"
                                            size="sm"
                                            @click="onModalSearchPort('FinalDestination')"
                                          >
                                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                          </b-button>
                                        </b-input-group-append>
                                        <b-form-invalid-feedback>{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                      </b-input-group>
                                    </validation-provider>
                                  </b-form-group>
                                </b-col>
                              </b-row>
                            </b-tab>
                            <b-tab @click="isTabMain=false">
                              <template v-slot:title>
                                <font-awesome-icon :icon="['fas', 'building']" />&nbsp;Cargo
                              </template>
                              <b-row>
                                <b-col sm="12" lg="6">
                                  <b-form-group>
                                    <label for="Commodity">Commodity</label>
                                    <validation-provider
                                      name="Commodity"
                                      :rules="{required : true}"
                                      v-slot="validationContext"
                                    >
                                      <b-input-group prepend>
                                        <b-form-input
                                          name="Commodity"
                                          type="text"
                                          placeholder="Commodity"
                                          :disabled="form.isView"
                                          v-model="form.model.Commodity"
                                          :state="validateState(validationContext,'Commodity')"
                                          aria-describedby="Commodity"
                                          size="sm"
                                        />
                                        <b-form-invalid-feedback>{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                      </b-input-group>
                                    </validation-provider>
                                  </b-form-group>
                                </b-col>
                                <b-col sm="6" lg="3">
                                  <b-form-group>
                                    <label for="CargoGrossWeight">Cargo Gross Weight</label>
                                    <validation-provider
                                      name="Cargo Gross Weight"
                                      :rules="{required : false}"
                                      v-slot="validationContext"
                                    >
                                      <b-input-group prepend>
                                        <b-form-input
                                          name="Cargo Gross Weight"
                                          type="text"
                                          :disabled="form.isView"
                                          placeholder="Cargo Gross Weight"
                                          v-model="form.model.CargoGrossWeight"
                                          :state="validateState(validationContext,'Cargo Gross Weight')"
                                          size="sm"
                                        />
                                        <b-form-invalid-feedback>{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                      </b-input-group>
                                    </validation-provider>
                                  </b-form-group>
                                </b-col>

                                <b-col sm="6" lg="3">
                                  <b-form-group>
                                    <label for="CargoNetWeight">Cargo Net Weight</label>
                                    <b-input-group prepend>
                                      <b-form-input
                                        name="Cargo Net Weight"
                                        type="text"
                                        :disabled="form.isView"
                                        placeholder="Cargo Net Weight"
                                        v-model="form.model.CargoNetWeight"
                                        size="sm"
                                      />
                                    </b-input-group>
                                  </b-form-group>
                                </b-col>
                                <b-col sm="12">
                                  <b-form-group>
                                    <label for="Description">Description</label>
                                    <validation-provider
                                      name="Cargo Description"
                                      :rules="{ required : false }"
                                      v-slot="validationContext"
                                    >
                                      <b-form-textarea
                                        name="Description"
                                        :disabled="form.isView"
                                        placeholder="Description"
                                        v-model="form.model.CargoDescription"
                                        :state="validateState(validationContext,'Cargo Description')"
                                        size="sm"
                                        aria-describedby="Description"
                                      />
                                      <b-form-invalid-feedback>{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                    </validation-provider>
                                  </b-form-group>
                                </b-col>
                              </b-row>
                            </b-tab>
                            <b-tab @click="isTabMain=false">
                              <template v-slot:title>
                                <font-awesome-icon
                                  :icon="['fas', 'clipboard']"
                                  v-show="!form.isView"
                                />&nbsp;Additional
                              </template>
                              <b-row>
                                <b-col>
                                  <b-form-group>
                                    <label for="Remark">Remark</label>
                                    <b-form-textarea
                                      name="Remark"
                                      :disabled="form.isView"
                                      placeholder="Remark"
                                      v-model="form.model.Remark"
                                      size="sm"
                                    ></b-form-textarea>
                                  </b-form-group>
                                </b-col>
                              </b-row>
                            </b-tab>
                          </b-tabs>
                        </b-card>
                      </b-col>
                    </b-row>
                  </b-col>
                  
                </b-row>
                <b-row class="mb-2 mt-2">
                  <b-col>
                    <b-button
                      variant="yellow"
                      size="sm"
                      type="submit"
                      v-if="!form.isView"
                      @click.prevent="onModalContainer()"
                    >
                      <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;Add Container
                    </b-button>
                  </b-col>
                </b-row>

                <b-row>
                  <div style=" width:120%; overflow-x:auto;">
                  <b-col class="table-responsive">
                    <table
                      id="table-detail"
                      width="100%"
                      class="table-light table-striped table-hover table-bordered"
                    >
                      <thead>
                        <tr>
                          <th class="text-center" rowspan="2" style="vertical-align:middle;">
                            <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
                          </th>
                          <th class="text-left">CONTAINER&nbsp;TYPE CODE</th>
                          <th class="text-left">&nbsp;CONTAINER&nbsp;TYPE&nbsp;NAME&nbsp;</th>
                          <th class="text-left">
                            UOM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </th>
                          <th class="text-left">QUANTITY</th>
                        </tr>
                        <tr>
                          <th class="text-left" colspan="3">REMARKS</th>
                        </tr>
                      </thead>
                      <tbody class="position-relative">
                        <template v-for="(item, itemIndex) in dataDetails">
                          <tr>
                            <td rowspan="2" class="text-center">
                              <a
                                href="javascript:;"
                                style="text-decoration:none;color:red;"
                                v-if="!form.isView"
                                @click="DeleteContainer(itemIndex)"
                                v-show="!form.isView"
                              >
                                <font-awesome-icon
                                  size="lg"
                                  :icon="['fas', 'trash']"
                                  variant="danger"
                                />
                              </a>
                            </td>

                            <td>
                              <b-form-input
                                type="text"
                                size="sm"
                                v-model="item.ContainerId"
                                v-show="false"
                              />
                              <b-form-input
                                type="text"
                                size="sm"
                                v-model="item.ContainerCode"
                                readonly
                              />
                            </td>
                            <td width="20%">
                              <b-input-group prepend>
                                <b-form-input
                                  type="text"
                                  size="sm"
                                  v-model="item.ContainerName"
                                  readonly
                                />
                              </b-input-group>
                            </td>
                            <td width="20%">
                              <b-input-group prepend>
                                <b-form-select
                                  name="UOM"
                                  v-model="item.UomDetailId"
                                  :plain="true"
                                  :options="optionUom"
                                  size="sm"
                                  :disabled="form.isView"
                                />
                              </b-input-group>
                            </td>
                            <td width="20%">
                              <b-input-group prepend>
                                <money
                                  v-model="item.Qty"
                                  v-bind="moneyOptions"
                                  :disabled="form.isView"
                                  class="currency-money-field font-weight-bold"
                                  style="width:100%"
                                ></money>
                              </b-input-group>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="3">
                              <b-form-input
                                type="text"
                                :disabled="form.isView"
                                size="sm"
                                v-model="item.Remark"
                              />
                            </td>
                          </tr>
                        </template>
                      </tbody>

                      <tfoot>
                        <template>
                          <tr>
                            <th colspan="5"></th>
                          </tr>
                          <tr>
                            <th></th>
                            <th style="font-size: 12px;" colspan="3">TOTAL CONTAINER</th>
                            <th width="20%">
                              <money
                                v-model="form.model.TotalContainer"
                                v-bind="moneyOptions"
                                class="currency-money-field font-weight-bold"
                                :value="TotalContainer"
                                disabled
                                style="width:100%"
                              ></money>
                            </th>
                          </tr>
                        </template>
                      </tfoot>
                      <slot name="caption" />
                    </table>
                  </b-col>
                  </div>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
      <!-- TAB Vendor END -->
    </b-card>
    <b-tabs pills card v-show="!isForm">
      <b-tab active @click="isTabMain=true">
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'tasks']" />&nbsp;Progress
        </template>
        <!-- TAB Vendor BEGIN -->
        <b-row>
          <b-col cols="12" sm="12">
            <b-card width="100%">
              <DataGrid
                ref="gridMain"
                :fields="this.$store.state.features.sales.quotation.headers"
                :items="this.$store.state.features.sales.quotation.data"
                :info="this.$store.state.features.sales.quotation.listInfo"
                :baseUrl="this.$store.state.features.sales.quotation.baseUrl"
                :actGetData="handleGetProgress"
                :actCreate="onFormCreate"
                :actEditRow="handleEdit"
                :actDeleteRow="handleDelete"
                addTableClasses="table-bordered"
                :disableNewButton="!this.$store.state.roleaccess.AllowNew"
                :isEdit="this.$store.state.roleaccess.AllowEdit"
                :isDelete="false"
                responsive
                items-per-page-select
                loading
                hover
                sorter
                pagination
                column-filter
                caption="Sales Quotation- Progress"
              ></DataGrid>
            </b-card>
          </b-col>
        </b-row>
        <!-- TAB Vendor END -->
      </b-tab>
      <b-tab @click="History">
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'history']" />&nbsp;History
        </template>
        <b-card-text>
          <b-row>
            <b-col cols="12" sm="12">
              <b-card width="100%">
                <DataGrid
                  ref="gridMain123"
                  :fields="this.$store.state.features.sales.quotation_history.headers"
                  :items="this.$store.state.features.sales.quotation_history.data"
                  :info="this.$store.state.features.sales.quotation_history.listInfo"
                  :baseUrl="this.$store.state.features.sales.quotation_history.baseUrl"
                  :actGetData="handleGetHistory"
                  :actCreate="onFormCreate"
                  :actEditRow="handleView"
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
                  caption="List of Quotation - History"
                ></DataGrid>
              </b-card>
            </b-col>
          </b-row>
        </b-card-text>
      </b-tab>
    </b-tabs>

    <!-- == COPY QUOTATION START == -->
      <div id="page-dialogs">
        <b-modal v-model="isShowQuotationCopy" hide-footer size="xl">
          <template v-slot:modal-title>Sales Quotation</template>
            <b-form-checkbox size="sm" 
              v-model="withDetailQuotation"
              name="withdetail">
                with <code class="font-weight-bold">DETAIL CONTAINER</code>
            </b-form-checkbox><br/>
          <div class="d-block">
            <small>Select <b-icon id="icon" icon="circle" variant="primary"></b-icon>
             to copy Sales Quotation!</small>
            <SelectGrid
              ref="gridSalesQuotation"
              :fields="this.$store.state.features.sales.quotation_all.headers"
              :items="this.$store.state.features.sales.quotation_all.data"
              :info="this.$store.state.features.sales.quotation_all.listInfo"
              :baseUrl="this.$store.state.features.sales.quotation_all.baseUrl"
              :actGetData="handleGetQuotation"
              :selectedItem="form.model.SalesQuotationId"
              selectedFieldName="SalesQuotationId"
              :actSelectRow="handleSelectQuotation"
              addTableClasses="table-bordered"
              responsive
              loading
              hover
              sorter
              pagination
              column-filter
              :itemsPerPage="5"
            ></SelectGrid>
          </div>
        </b-modal>
      </div>
    <!-- == COPY QUOTATION END == -->

    <CustomerModal ref="dlgCustomer" :actSelectedRow="onSelectedCustomer"></CustomerModal>
    <ShippingLineModal ref="dlgShippingLine" :actSelectedRow="onSelectedShippingLine"></ShippingLineModal>
    <PortModal ref="dlgPort" :actSelectedRow="onSelectedPort"></PortModal>
    <SalesPersonModal ref="dlgSalesPerson" :actSelectedRow="onSelectedSalesPerson"></SalesPersonModal>

    <b-modal
      id="modal-reason"
      ref="modal"
      title="Please type your reason to Cancel "
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <form ref="formreason" @submit.stop.prevent="handleDoCancel">
        <b-row class="mt-2">
          <b-col>
            <b-form-group
              :state="ReasonState"
              label="Reason"
              label-for="name-input"
              invalid-feedback="Reason must not empty"
            >
              <b-form-input
                id="name-input"
                v-model="form.model.StatusComment"
                :state="ReasonState"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </form>
    </b-modal>
    <div id="page-dialogs">
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
    <div id="page-dialogs">
      <b-modal v-model="isShowContainer" hide-footer size="lg">
        <template v-slot:modal-title>Container</template>
        <div class="d-block text-center">
          <SelectGrid
            ref="gridModal"
            :fields="[{label: 'Container Code', key: 'ContainerCode', _classess: 'text-left', width:150, filter: true},
                      {label: 'Container Name', key: 'ContainerName', _classess: 'text-left',filter: true}]"
            :items="this.$store.state.features.company.container_type.data"
            :info="this.$store.state.features.company.container_type.listInfo"
            :baseUrl="this.$store.state.features.company.container_type.baseUrl"
            :actGetData="handleGetCustomerAddress"
            :selectedItem="form.CustomerAddressReffField"
            selectedFieldName="ContainerCode"
            :actSelectRow="handleSelectContainer"
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
    <!-- START MODAL VOID REASON -->
    <!-- END MODAL VOID REASON -->

    <!-- BEGIN DOCUMENT STATUS -->
    <b-toast id="document-status-toaster" variant="warning" solid >
      <template v-slot:toast-title>
        <div class="d-flex flex-grow-1 align-items-baseline">
          <b-img blank blank-color="green" class="mr-2" width="12" height="12"></b-img>
          <strong class="mr-auto">{{form.display.DocumentStatus}}</strong>
          <small class="text-muted mr-2"></small>
        </div>
      </template>
      <p>Created By :&nbsp;{{form.display.CreatedByName}}&nbsp;on&nbsp;{{form.display.CreatedDate}}</p>    
    </b-toast>
    <!-- END DOCUMENT STATUS -->

  </div>
</template>

<script>
import DataGrid from "@/components/Tables/DataGrid";
import SelectGrid from "@/components/tables/SelectGrid";
import VueElementLoading from "vue-element-loading";
import {
  CustomerModal,
  ShippingLineModal,
  PortModal,
  SalesPersonModal
} from "@/pages/modal/index.js";
import { mask } from "vue-the-mask";
import moment from "moment";
import util from "@/helper/utils";
import loginServices from "@/services/loginservices";
import cloneDeep from "lodash.cloneDeep";

export default {
  name: "Quotation",
  layout: "dashboard",
  components: {
    DataGrid,
    SelectGrid,
    VueElementLoading,
    CustomerModal,
    ShippingLineModal,
    PortModal,
    SalesPersonModal
  },
  directives: {
    mask
  },
  data() {
    return {
      ErrorBag: "",
      ReasonState: null,
      Reason: "",
      optionTermOfShipment: [
        { value: "CY/CY", text: "CY/CY" },
        { value: "CY/DOOR", text: "CY/DOOR" },
        { value: "DOOR/CY", text: "DOOR/CY" },
        { value: "DOOR/CY", text: "DOOR/DOOR" },
        { value: "CY/CFS", text: "CY/CFS" },
        { value: "CFS/CY", text: "CFS/CY" },
        { value: "CFS/CFS", text: "CFS/CFS" }
      ],
      listTransactionType: [],
      optionUom: [],
      Company: [],
      CompanyAddress: [],
      minCalendarDate: moment().format("YYYY-01-01"),
      dataDetails: [],
      dateFormatString: "DD/MM/YYYY",
      isTabMain: true,
      formCaption: "Quotation",
      //TotalContainer: 0,
      caption: "Quotation",
      blockLoader: false,
      isShowCustomerAddress: false,
      isShowContainer: false,
      isShowQuotationCopy: false,
      withDetailQuotation: false,
      isForm: false, //FORM IN TAB CUSTOMER
      isFormAddress: false, //FORM IN TAB ADDRESS
      itemHistory: [],
      HistoryInfo: [],
      historyUrl: "",
      moneyOptions: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: "",
        precision: 0,
        masked: false,
        allowBlank: false,
        min: 0
        //max: Number.MAX_SAFE_INTEGER
      },
      perPage: 10,
      form: {
        isView: false,
        valid: false,
        Reason: "",
        isEdit: false,
        CustomerAddressActiveField: "",
        CustomerAddressReffField: "",
        model: {
          SalesQuotationId: "",
          TransactionDate: moment().format("YYYY-MM-DD"),
          DocumentNo: "",
          CustomerCode: "",
          CustomerId: "",
          CustomerName: "",
          AddressCode: "",
          SalesCode: "",
          SalesName: "",
          ShipperId: "",
          ShipperCode: "",
          ShipperAddressCode: "",
          ShipperName: "",
          ConsigneeId: "",
          ConsigneeCode: "",
          ConsigneeCode: "",
          ConsigneeName: "",
          ConsigneeAddressCode: "",
          IsDifferentNotifyPartner: true,
          NotifyPartnerId: "",
          NotifyPartnerCode: "",
          NotifyPartnerName: "",
          NotifyPartnerAddressCode: "",
          ShippingLineId: "",
          IsShippingLineMaster: true,
          ShippingLineCode: "",
          ShippingLineName: "",
          ShippingLineVesselCode: "",
          ShippingLineVesselName: "",
          ShippingLineOwner: "",
          ShippingLineType: "",
          ShippingLineShippingNo: "",
          ShippingLineDelivery: "",
          ShippingLineArrival: "",
          FeederLineArrival: "",
          FeederLineDelivery: "",
          FeederLineId: "",
          IsFeederLineMaster: true,
          FeederLineCode: "",
          FeederLineName: "",
          FeederLineVesselCode: "",
          FeederLineVesselName: "",
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
          SalesQuotationDetail: [],
          CreatedBy: "",
          CreatedByName: "",
          TotalContainer: 0
        },
        dataDetails: [],
        display: {
          DocumentStatus: "",
          DocumentDate: moment(Date.now()).format("YYYY/MM/DD"),
          CreatedByName: "",
          CreatedDate: "",
          ClosedByName: "",
          ClosedDate: ""
        },
        validator: {
          RequiredSubject: 0,
          PaymentCondition: 0
        }
      }
    };
  },
  async created() {
    await this.initDefaultForm();
  },
  async mounted() {
    await this.$store.dispatch(
      "features/sales/quotation/actGetData",
      "GetSalesQuotationProgress?"
    );
    await this.$store.dispatch(
      "features/sales/quotation_history/actGetData",
      "GetSalesQuotationHistory?"
    );
  },
  watch: {
    "form.model.TransactionType"(newVal) {
      //console.log('WATCH ... ' + newVal);
    }
  },
  methods: {
    async initDefaultForm() {
      //BEGIN DOCUMENT TYPE & TRANSACTION TYPE
      const trxModule = this.$store.state.features.sales.quotation.TrxModule;
      const docFeatureId = this.$store.state.features.sales.quotation
        .DocFeatureId;

      let data = await this.$store.dispatch(
        "features/finance/document_type/actGetByDocSetup",
        trxModule
      );

      this.listTransactionType = [];
      if (data != undefined) {
        if (data.TransactionTypes != undefined) {
          this.listTransactionType = cloneDeep(
            data.TransactionTypes.filter(x => x.DocFeatureId == docFeatureId)
          );
        }
      }
      //END DOCUMENT TYPE & TRANSACTION TYPE

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
    showLoader(val) {
      if (!val) {
        setTimeout(() => {
          this.blockLoader = false;
        }, 300);
      } else {
        this.blockLoader = val;
      }
    },
    async bindTransactionTypeValidator() {
      let found = this.listTransactionType.filter(
        x => x.TransactionType == this.form.model.TransactionType
      );
      if (found != undefined) {
        this.form.validator.RequiredSubject = found[0].RequiredSubject;
        this.form.validator.PaymentCondition = found[0].PaymentCondition;
      }
    },
    async onChangeTransactionType() {
      await this.bindTransactionTypeValidator();
      //RESET DETAILS
    },
    async dateChanged() {
      this.form.display.DocumentDate = "";
      if (this.form.model.TransactionDate != null)
        this.form.display.DocumentDate = moment(
          this.form.model.TransactionDate
        ).format(this.dateFormatString);
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
    validateState({ dirty, validated, valid = null }, obj) {
      if (obj != undefined) {
        let warningMessage = "* " + obj + " is required ! <br/>";

        if (valid) {
          this.ErrorBag = this.ErrorBag.replace(warningMessage, "");
        } else {
          if (this.ErrorBag.indexOf(warningMessage) < 0)
            this.ErrorBag += warningMessage;
        }
      }

      return dirty || validated ? valid : null;
    },

    async handleGet(url) {
      await loginServices.doLoginCompany(
        this.$store.state.user,
        this.$store.state.companySecurity,
        this.$store.state.token.replace("Bearer ", "")
      );
    },
    async handleGetProgress(url) {
      await this.$store.dispatch("features/sales/quotation/actGetData", url);
      await loginServices.doLoginCompany(
        this.$store.state.user,
        this.$store.state.companySecurity,
        this.$store.state.token.replace("Bearer ", "")
      );
    },
    async handleGetHistory(url) {
      await this.$store.dispatch(
        "features/sales/quotation_history/actGetData",
        url
      );
      await loginServices.doLoginCompany(
        this.$store.state.user,
        this.$store.state.companySecurity,
        this.$store.state.token.replace("Bearer ", "")
      );
    },
    async History() {
      this.itemHistory = this.$store.state.features.sales.quotation_history.data;
      this.HistoryInfo = this.$store.state.features.sales.quotation_history.listInfo;
    },
    async onFormClose() {
      this.ErrorMessage = "";
      this.isForm = false;
      this.form.isEdit = false;

      this.resetForm();
    },
    resetForm() {
      this.form.isView = false;
      // (this.form.model.SalesQuotationId = null),//"00000000-0000-0000-0000-000000000000";
      this.form.model.SalesQuotationId = "";
      this.form.model.TransactionType = "";
      this.form.model.DocumentNo = "";
      this.form.model.TransactionDate = moment().format("YYYY-MM-DD");
      this.form.display.DocumentDate = moment().format(this.dateFormatString);
      this.form.model.CustomerCode = "";
      this.form.model.CustomerId = "";
      this.form.model.CustomerName = "";
      this.form.model.AddressCode = "";

      this.form.model.SalesCode = "";
      this.form.model.SalesName = "";
      this.form.model.ShipperId = "";
      this.form.model.ShipperCode = "";
      this.form.model.ShipperAddressCode = "";
      this.form.model.ShipperName = "";

      this.form.model.ConsigneeId = "";
      this.form.model.ConsigneeCode = "";
      this.form.model.ConsigneeName = "";
      this.form.model.ConsigneeAddressCode = "";
      this.form.model.IsDifferentNotifyPartner = true;
      this.form.model.NotifyPartnerId = "";
      this.form.model.NotifyPartnerCode = "";
      this.form.model.NotifyPartnerName = "";
      this.form.model.NotifyPartnerAddressCode = "";

      this.form.model.ShippingLineId = "";
      this.form.model.ShippingLineCode = "";
      this.form.model.ShippingLineName = "";
      this.form.model.ShippingLineOwner = "";
      this.form.model.ShippingLineType = "";
      this.form.model.ShippingLineVesselCode = "";
      this.form.model.ShippingLineVesselName = "";

      this.form.model.ShippingLineShippingNo = "";

      this.form.model.ShippingLineArrival = "";
      this.form.model.ShippingLineDelivery = "";
      this.form.model.FeederLineArrival = "";
      this.form.model.FeederLineDelivery = "";
      this.form.model.FeederLineId = "";
      this.form.model.FeederLineCode = "";
      this.form.model.FeederLineName = "";
      this.form.model.FeederLineOwner = "";
      this.form.model.FeederLineType = "";
      this.form.model.FeederLineVesselCode = "";
      this.form.model.FeederLineVesselName = "";

      this.form.model.FeederLineShippingNo = "";
      this.form.model.TermOfShipment = "";
      this.form.model.FinalDestination = "";

      this.form.model.PortOfLoading = "";
      this.form.model.PortOfDischarge = "";
      this.form.model.Commodity = "";
      this.form.model.CargoGrossWeight = "";
      this.form.model.CargoNetWeight = "";
      this.form.model.CargoDescription = "";
      this.form.model.Remark = "";
      this.form.model.Status = "";
      this.form.model.StatusComment = "";

      this.form.display.CreatedByName = "";
      this.form.display.CreatedDate = moment().format("DD-MM-YYYY HH:mm:ss");
      this.form.display.ModifiedByName = "";
      this.form.display.ModifiedDate = moment().format("DD-MM-YYYY HH:mm:ss");
      this.dataDetails = [];

      this.$nextTick(() => {
        this.$refs.observer.reset();
      });
    },
    async onFormCreate() {
      this.resetForm();
      this.form.isEdit = false;
      this.isForm = true;
    },

    async handleView(row) {
      
      var arr = [];

      (this.form.model.SalesQuotationId = row.SalesQuotationId),
        (this.form.model.TransactionType = row.TransactionType),
        (this.form.model.DocumentNo = row.DocumentNo),
        (this.form.model.TransactionDate = moment(row.TransactionDate).format(
          "YYYY-MM-DD"
        )),
        (this.form.display.DocumentDate = moment(
          this.form.model.TransactionDate
        ).format(this.dateFormatString));
        (this.form.model.CustomerCode = row.CustomerCode),
        (this.form.model.CustomerId = row.CustomerId),
        (this.form.model.CustomerName = row.CustomerName),
        (this.form.model.AddressCode = row.CustomerAddressCode),
        (this.form.model.SalesCode = row.SalesCode),
        (this.form.model.SalesName = row.SalesName),
        (this.form.model.ShipperId = row.ShipperId),
        (this.form.model.ShipperCode = row.ShipperCode),
        (this.form.model.ShipperAddressCode = row.ShipperAddressCode),
        (this.form.model.ShipperName = row.ShipperName),
        (this.form.model.ConsigneeId = row.ConsigneeId),
        (this.form.model.ConsigneeCode = row.ConsigneeCode),
        (this.form.model.ConsigneeName = row.ConsigneeName),
        (this.form.model.ConsigneeAddressCode = row.ConsigneeAddressCode),
        (this.form.model.IsDifferentNotifyPartner =
          row.IsDifferentNotifyPartner),
        (this.form.model.NotifyPartnerId = row.NotifyPartnerId),
        (this.form.model.NotifyPartnerCode = row.NotifyPartnerCode),
        (this.form.model.NotifyPartnerName = row.NotifyPartnerName),
        (this.form.model.NotifyPartnerAddressCode =
          row.NotifyPartnerAddressCode),
        (this.form.model.ShippingLineId = row.ShippingLineId),
        this.form.model.ShippingLineCode = row.ShippingLineCode;
        (this.form.model.ShippingLineName = row.ShippingLineName),
        this.form.model.ShippingLineVesselCode = row.ShippingLineVesselCode;
        this.form.model.ShippingLineVesselName = row.ShippingLineVesselName;
        (this.form.model.ShippingLineOwner = row.ShippingLineOwner),
        (this.form.model.ShippingLineType = row.ShippingLineType),
        (this.form.model.ShippingLineShippingNo = row.ShippingLineShippingNo),
        (this.form.model.ShippingLineArrival =
          row.ShippingLineArrival == "0001-01-01T00:00:00.000Z"
            ? null
            : moment(row.ShippingLineArrival).format("YYYY-MM-DD")),
        (this.form.model.ShippingLineDelivery =
          row.ShippingLineDelivery == "0001-01-01T00:00:00.000Z"
            ? null
            : moment(row.ShippingLineDelivery).format("YYYY-MM-DD")),
        (this.form.model.FeederLineArrival =
          row.FeederLineArrival == "0001-01-01T00:00:00.000Z"
            ? null
            : moment(row.FeederLineArrival).format("YYYY-MM-DD")),
        (this.form.model.FeederLineDelivery =
          row.FeederLineDelivery == "0001-01-01T00:00:00.000Z"
            ? null
            : moment(row.FeederLineDelivery).format("YYYY-MM-DD")),
        (this.form.model.FeederLineId = row.FeederLineId),
      this.form.model.FeederLineCode = row.FeederLineCode;
      (this.form.model.FeederLineName = row.FeederLineName),
       this.form.model.FeederLineVesselCode = row.FeederLineVesselCode;
        this.form.model.FeederLineVesselName = row.FeederLineVesselName;
        (this.form.model.FeederLineOwner = row.FeederLineOwner),
        (this.form.model.FeederLineType = row.FeederLineType),
        (this.form.model.FeederLineShippingNo = row.FeederLineShippingNo),
        (this.form.model.TermOfShipment = row.TermOfShipment),
        (this.form.model.FinalDestination = row.FinalDestination),
        (this.form.model.PortOfLoading = row.PortOfLoading),
        (this.form.model.PortOfDischarge = row.PortOfDischarge),
        (this.form.model.Commodity = row.Commodity),
        (this.form.model.CargoGrossWeight = row.CargoGrossWeight),
        (this.form.model.CargoNetWeight = row.CargoNetWeight),
        (this.form.model.CargoDescription = row.CargoDescription),
        (this.form.model.Remark = row.Remark),
        (this.form.model.Status = row.Status),
        (this.form.model.StatusComment = row.StatusComment),
      this.form.display.CreatedDate = moment(row.CreatedDate).format(
        "DD-MM-YYYY HH:mm:ss"
      );
      this.form.display.ModifiedByName = row.ModifiedByName;
      this.form.display.ModifiedDate = moment(row.ModifiedByName).format(
        "DD-MM-YYYY HH:mm:ss"
      );

      (this.form.display.CreatedByName = row.CreatedByName);
      this.form.display.DocumentStatus = row.Status;

      row.SalesQuotationDetails.forEach(function(d, index) {
        arr.push({
          Index: index,
          ContainerId: d.ContainerId,
          ContainerCode: d.ContainerCode,
          ContainerName: d.ContainerName,
          UomDetailId: d.UomDetailId,
          Qty: d.Qty,
          Remark: d.Remark
        });
      });
      this.dataDetails = arr;

      // this.form.isEdit = true;
      this.isForm = true;
      this.form.isView = true;
    },
    async handleEdit(row) {
      
      var arr = [];

      (this.form.model.SalesQuotationId = row.SalesQuotationId),
        (this.form.model.TransactionType = row.TransactionType),
        (this.form.model.DocumentNo = row.DocumentNo),
        (this.form.model.TransactionDate = moment(row.TransactionDate).format(
          "YYYY-MM-DD"
        )),
        (this.form.display.DocumentDate = moment(
          this.form.model.TransactionDate
        ).format(this.dateFormatString));
      (this.form.model.CustomerCode = row.CustomerCode),
        (this.form.model.CustomerId = row.CustomerId),
        (this.form.model.CustomerName = row.CustomerName),
        (this.form.model.AddressCode = row.CustomerAddressCode),
        (this.form.model.SalesCode = row.SalesCode),
        (this.form.model.SalesName = row.SalesName),
        (this.form.model.ShipperId = row.ShipperId),
        (this.form.model.ShipperCode = row.ShipperCode),
        (this.form.model.ShipperAddressCode = row.ShipperAddressCode),
        (this.form.model.ShipperName = row.ShipperName),
        (this.form.model.ConsigneeId = row.ConsigneeId),
        (this.form.model.ConsigneeCode = row.ConsigneeCode),
        (this.form.model.ConsigneeName = row.ConsigneeName),
        (this.form.model.ConsigneeAddressCode = row.ConsigneeAddressCode),
        (this.form.model.IsDifferentNotifyPartner =
          row.IsDifferentNotifyPartner),
        (this.form.model.NotifyPartnerId = row.NotifyPartnerId),
        (this.form.model.NotifyPartnerCode = row.NotifyPartnerCode),
        (this.form.model.NotifyPartnerName = row.NotifyPartnerName),
        (this.form.model.NotifyPartnerAddressCode =
          row.NotifyPartnerAddressCode),
        (this.form.model.ShippingLineId = row.ShippingLineId),
      this.form.model.ShippingLineCode = row.ShippingLineCode;
      (this.form.model.ShippingLineName = row.ShippingLineName),
        this.form.model.ShippingLineVesselCode = row.ShippingLineVesselCode;
        this.form.model.ShippingLineVesselName = row.ShippingLineVesselName;
        (this.form.model.ShippingLineOwner = row.ShippingLineOwner),
        (this.form.model.ShippingLineType = row.ShippingLineType),
        (this.form.model.ShippingLineShippingNo = row.ShippingLineShippingNo),
        (this.form.model.ShippingLineArrival =
          row.ShippingLineArrival == "0001-01-01T00:00:00.000Z"
            ? null
            : moment(row.ShippingLineArrival).format("YYYY-MM-DD")),
        (this.form.model.ShippingLineDelivery =
          row.ShippingLineDelivery == "0001-01-01T00:00:00.000Z"
            ? null
            : moment(row.ShippingLineDelivery).format("YYYY-MM-DD")),
        (this.form.model.FeederLineArrival =
          row.FeederLineArrival == "0001-01-01T00:00:00.000Z"
            ? null
            : moment(row.FeederLineArrival).format("YYYY-MM-DD")),
        (this.form.model.FeederLineDelivery =
          row.FeederLineDelivery == "0001-01-01T00:00:00.000Z"
            ? null
            : moment(row.FeederLineDelivery).format("YYYY-MM-DD")),
        (this.form.model.FeederLineId = row.FeederLineId),
      this.form.model.FeederLineCode = row.FeederLineCode;
      (this.form.model.FeederLineName = row.FeederLineName),
      this.form.model.FeederLineVesselCode = row.FeederLineVesselCode;
        this.form.model.FeederLineVesselName = row.FeederLineVesselName;
        (this.form.model.FeederLineOwner = row.FeederLineOwner),
        (this.form.model.FeederLineType = row.FeederLineType),
        (this.form.model.FeederLineShippingNo = row.FeederLineShippingNo),
        (this.form.model.TermOfShipment = row.TermOfShipment),
        (this.form.model.FinalDestination = row.FinalDestination),
        (this.form.model.PortOfLoading = row.PortOfLoading),
        (this.form.model.PortOfDischarge = row.PortOfDischarge),
        (this.form.model.Commodity = row.Commodity),
        (this.form.model.CargoGrossWeight = row.CargoGrossWeight),
        (this.form.model.CargoNetWeight = row.CargoNetWeight),
        (this.form.model.CargoDescription = row.CargoDescription),
        (this.form.model.Remark = row.Remark),
        (this.form.model.Status = row.Status),
        (this.form.model.StatusComment = row.StatusComment),
        (this.form.display.CreatedByName = row.CreatedByName);
      this.form.display.CreatedDate = moment(row.CreatedDate).format(
        "DD-MM-YYYY HH:mm:ss"
      );
      this.form.display.ModifiedByName = row.ModifiedByName;
      this.form.display.ModifiedDate = moment(row.ModifiedByName).format(
        "DD-MM-YYYY HH:mm:ss"
      );

      this.form.display.DocumentStatus = row.Status;

      row.SalesQuotationDetails.forEach(function(d, index) {
        arr.push({
          Index: index,
          ContainerId: d.ContainerId,
          ContainerCode: d.ContainerCode,
          ContainerName: d.ContainerName,
          UomDetailId: d.UomDetailId,
          Qty: d.Qty,
          Remark: d.Remark
        });
      });
      this.dataDetails = arr;
      
      //ACTIVATE SHIPPER OR CUSTOMER REQUIRED
      await this.bindTransactionTypeValidator();

      this.isForm = true;
      this.form.isView = false;
      this.form.isEdit = true;
    },
    async onModalContainer() {
      this.handleGetContainer();

      this.isShowContainer = true;
    },

    async handleGetContainer(url) {
      if (url == undefined) {
        url = "container?";
      } else {
        if (url.toLowerCase().lastIndexOf("containerid") < 0) {
          url;
        }
      }
      await this.$store.dispatch(
        "features/company/container_type/actGetContainer",
        url
      );
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

    async onModalSearchShippingLine(row) {
      this.$refs.dlgShippingLine
        .open(row, this.form.model[row])
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
    async onModalSearchPort(row) {
      this.$refs.dlgPort
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

    async onSelectedCustomer(item, modelReff) {
      this.form.model[modelReff] = item.CustomerCode;
      if (modelReff == "CustomerCode") {
        this.form.model.CustomerId = item.CustomerId;
            this.form.model.CustomerCode = item.CustomerCode;
            this.form.model.CustomerName = item.CustomerName;
            this.form.model.CustomerAddressCode = item.AddressCode;
            this.form.model.CustomerBillToAddressCode = item.BillToAddressCode;
            this.form.model.CustomerShipToAddressCode = item.ShipToAddressCode;
      }
      if (modelReff == "ShipperCode") {
        this.form.model.ShipperId = item.CustomerId;
            this.form.model.ShipperCode = item.CustomerCode;
            this.form.model.ShipperName = item.CustomerName;
            this.form.model.ShipperAddressCode = item.AddressCode;
            this.form.model.ShipperBillToAddressCode = item.BillToAddressCode;
            this.form.model.ShipperShipToAddressCode = item.ShipToAddressCode;
      }
      if (modelReff == "NotifyPartnerCode") {
        this.form.model.NotifyPartnerId = item.CustomerId;
            this.form.model.NotifyPartnerCode = item.CustomerCode;
            this.form.model.NotifyPartnerName = item.CustomerName;
            this.form.model.NotifyPartnerAddressCode = item.AddressCode;
            this.form.model.NotifyBillToAddressCode = item.BillToAddressCode;
            this.form.model.NotifyShipToAddressCode = item.ShipToAddressCode;
      }
      if (modelReff == "ConsigneeCode") {
        this.form.model.ConsigneeId = item.CustomerId;
            this.form.model.ConsigneeCode = item.CustomerCode;
            this.form.model.ConsigneeName = item.CustomerName;
            this.form.model.ConsigneeAddressCode = item.AddressCode;
            this.form.model.ConsigneeBillToAddressCode = item.BillToAddressCode;
            this.form.model.ConsigneeShipToAddressCode = item.ShipToAddressCode;
        if (this.form.model.IsDifferentNotifyPartner == true) {
          this.form.model.NotifyPartnerId = item.CustomerId;
          this.form.model.NotifyPartnerCode = item.CustomerCode;
          this.form.model.NotifyPartnerName = item.CustomerName;

          this.form.model.NotifyPartnerAddressCode = item.AddressCode;
        } else {
          this.form.model.NotifyPartnerId = "";
          this.form.model.NotifyPartnerCode = "";
          this.form.model.NotifyPartnerName = "";
          this.form.model.NotifyPartnerAddressCode = "";
        }
      }
      //customerdetail
    },
    async onSelectedShippingLine(item, modelReff) {
      if (modelReff == "FeederLineName") {
        this.form.model.FeederLineId = item.ShippingLineId;
        this.form.model.FeederLineCode = item.ShippingLineCode;
        this.form.model.FeederLineName = item.ShippingLineName;
        this.form.model.FeederLineOwner = item.VendorName;
        this.form.model.FeederLineType = item.ShippingLineType;
      } else {
        this.form.model.ShippingLineId = item.ShippingLineId;
        this.form.model.ShippingLineCode = item.ShippingLineCode;
        this.form.model.ShippingLineName = item.ShippingLineName;
        this.form.model.ShippingLineOwner = item.VendorName;
        this.form.model.ShippingLineType = item.ShippingLineType;
      }
      //this.form.model.CustomerName = item.CustomerName;
    },
    async onSelectedPort(item, modelReff) {
      this.form.model[modelReff] = item.PortCode;
      //this.form.model.CustomerName = item.CustomerName;
    },
    async onSelectedSalesPerson(item, modelReff) {
      this.form.model[modelReff] = item.SalesCode;
      //this.form.model.CustomerName = item.CustomerName;
    },
    async onModalSearchCustomerAddress(reff, active) {
      await this.doFindCustomerAddresses(reff);

      this.form.CustomerAddressReffField = this.form.model[reff];
      this.form.CustomerAddressActiveField = active;
      this.isShowCustomerAddress = true;
    },
    async handleGetCustomerAddress(url) {
      await this.doFindCustomerAddresses(url);
    },
    async handleSelectCustomerAddress(row) {
      this.form.model[this.form.CustomerAddressActiveField] = row.AddressCode;
      this.form.CustomerAddressActiveField = "";
      this.form.CustomerAddressReffField = "";
      if (this.form.CustomerAddressActiveField == "ConsigneeAddressCode")
        this.form.model.NotifyPartnerAddressCode = row.AddressCode;

      this.isShowCustomerAddress = false;
    },
    async handleSelectContainer(row) {
      var arr = [];
      this.dataDetails.push({
        Index: this.dataDetails.length,
        ContainerId: row.ContainerId,
        ContainerCode: row.ContainerCode,
        ContainerName: row.ContainerName,
        UomDetailId: "",
        Qty: 0,
        Remark: ""
      });

      this.isShowContainer = false;
    },

    async handleGetQuotation(url)
    {
      await this.$store.dispatch(
          "features/sales/quotation_all/actGetData",
          url
        );
    },  
    async handleSelectQuotation(row){
          (this.form.model.CustomerCode = row.CustomerCode),
          (this.form.model.CustomerId = row.CustomerId),
          (this.form.model.CustomerName = row.CustomerName),
          (this.form.model.AddressCode = row.CustomerAddressCode),
          (this.form.model.SalesCode = row.SalesCode),
          (this.form.model.SalesName = row.SalesName),
          (this.form.model.ShipperId = row.ShipperId),
          (this.form.model.ShipperCode = row.ShipperCode),
          (this.form.model.ShipperAddressCode = row.ShipperAddressCode),
          (this.form.model.ShipperName = row.ShipperName),
          (this.form.model.ConsigneeId = row.ConsigneeId),
          (this.form.model.ConsigneeCode = row.ConsigneeCode),
          (this.form.model.ConsigneeName = row.ConsigneeName),
          (this.form.model.ConsigneeAddressCode = row.ConsigneeAddressCode),
          (this.form.model.IsDifferentNotifyPartner = row.IsDifferentNotifyPartner),
          (this.form.model.NotifyPartnerId = row.NotifyPartnerId),
          (this.form.model.NotifyPartnerCode = row.NotifyPartnerCode),
          (this.form.model.NotifyPartnerName = row.NotifyPartnerName),
          (this.form.model.NotifyPartnerAddressCode = row.NotifyPartnerAddressCode),
          (this.form.model.ShippingLineId = row.ShippingLineId),
          this.form.model.ShippingLineCode = row.ShippingLineCode;
          (this.form.model.ShippingLineName = row.ShippingLineName),
          this.form.model.ShippingLineVesselCode = row.ShippingLineVesselCode;
          this.form.model.ShippingLineVesselName = row.ShippingLineVesselName;
          (this.form.model.ShippingLineOwner = row.ShippingLineOwner),
          (this.form.model.ShippingLineType = row.ShippingLineType),
          (this.form.model.ShippingLineShippingNo = row.ShippingLineShippingNo),
          (this.form.model.ShippingLineArrival =
            row.ShippingLineArrival == "0001-01-01T00:00:00.000Z"
              ? null
              : moment(row.ShippingLineArrival).format("YYYY-MM-DD")),
          (this.form.model.ShippingLineDelivery =
            row.ShippingLineDelivery == "0001-01-01T00:00:00.000Z"
              ? null
              : moment(row.ShippingLineDelivery).format("YYYY-MM-DD")),
          (this.form.model.FeederLineArrival =
            row.FeederLineArrival == "0001-01-01T00:00:00.000Z"
              ? null
              : moment(row.FeederLineArrival).format("YYYY-MM-DD")),
          (this.form.model.FeederLineDelivery =
            row.FeederLineDelivery == "0001-01-01T00:00:00.000Z"
              ? null
              : moment(row.FeederLineDelivery).format("YYYY-MM-DD")),
          (this.form.model.FeederLineId = row.FeederLineId),
        this.form.model.FeederLineCode = row.FeederLineCode;
        (this.form.model.FeederLineName = row.FeederLineName),
        this.form.model.FeederLineVesselCode = row.FeederLineVesselCode;
        this.form.model.FeederLineVesselName = row.FeederLineVesselName;
        (this.form.model.FeederLineOwner = row.FeederLineOwner),
        (this.form.model.FeederLineType = row.FeederLineType),
        (this.form.model.FeederLineShippingNo = row.FeederLineShippingNo),
        (this.form.model.TermOfShipment = row.TermOfShipment),
        (this.form.model.FinalDestination = row.FinalDestination),
        (this.form.model.PortOfLoading = row.PortOfLoading),
        (this.form.model.PortOfDischarge = row.PortOfDischarge),
        (this.form.model.Commodity = row.Commodity),
        (this.form.model.CargoGrossWeight = row.CargoGrossWeight),
        (this.form.model.CargoNetWeight = row.CargoNetWeight),
        (this.form.model.CargoDescription = row.CargoDescription),
        (this.form.model.Remark = row.Remark);

        if(this.withDetailQuotation){
            var arr = [];

            row.SalesQuotationDetails.forEach(function(d, index) {
            arr.push({
                Index: index,
                ContainerId: d.ContainerId,
                ContainerCode: d.ContainerCode,
                ContainerName: d.ContainerName,
                UomDetailId: d.UomDetailId,
                Qty: d.Qty,
                Remark: d.Remark
              });
            });
          this.dataDetails = arr;
        }else{
          var arr = [];
          this.dataDetails = arr;
        }
        
        this.isShowQuotationCopy = false;

    },
    async onModalSearchQuotation(reff, active){
      this.withDetailQuotation = false;
      await this.handleGetQuotation();

      this.isShowQuotationCopy = true;
    },

    async doFindCustomerAddresses(reff, url) {
      if (url == undefined) {
        url = this.$store.state.features.company.customer_address.baseUrl;
      }

      var customerid = null;
      if (reff == "ShipperAddressCode") customerid = this.form.model.ShipperId;
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
    async DeleteContainer(index) {
      this.dataDetails.splice(index, 1);
    },
    async doDelete(row) {
      this.showLoader(true);

      await this.$store.dispatch("features/sales/quotation/actDelete", row);

      var response = this.$store.state.features.sales.quotation.resultDelete;
      if (response.status != 200) {
        this.handleToast(
          "Confirmation",
          "danger",
          response.data.ErrorDescription != null
            ? response.data.ErrorDescription
            : "Delete failed."
        );
      } else {
        this.$refs.gridMain.doRefresh();

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
      console.log('validate ');
      let valid = true;
      let validAmount = true;
      let text = "";

      //Shipping Line Name
      if (this.form.model.ShippingLineName == "") {
        valid = false;
        this.handleToast(
          "Confirmation",
          "danger",
          "Please choose Shipper Line Name in Shipping Line Tab !"
        );
      }
      if (this.form.model.PortOfLoading == "") {
        valid = false;
        this.handleToast(
          "Confirmation",
          "danger",
          "Please choose Port of Loading in Shipping Line Tab !"
        );
      }
      if (this.form.model.PortOfDischarge == "") {
        valid = false;
        this.handleToast(
          "Confirmation",
          "danger",
          "Please fill Port Of Discharge in  Shipping Line Tab !"
        );
      }
      if (this.form.model.TermOfShipment == "") {
        valid = false;
        this.handleToast(
          "Confirmation",
          "danger",
          "Please fill Term Of Shipment in  Shipping Line Tab !"
        );
      }
      if (this.form.model.FinalDestination == "") {
        valid = false;
        this.handleToast(
          "Confirmation",
          "danger",
          "Please fill Final Destination in  Shipping Line Tab !"
        );
      }
      if (this.form.model.Commodity == "") {
        valid = false;
        this.handleToast(
          "Confirmation",
          "danger",
          "Please fill Data Commodity in Cargo Line Tab !"
        );
      }
      if (this.form.model.CargoDescription == "") {
        valid = false;
        this.handleToast(
          "Confirmation",
          "danger",
          "Please fill Cargo Description Data in  Cargo Line Tab !"
        );
      }

      if (this.dataDetails.length <= 0) {
        valid = false;
        this.handleToast(
          "Confirmation",
          "danger",
          "Detail container must not empty !"
        );
      }

      let errorMessage1 = "",
        errorMessage2 = "";
      this.dataDetails.forEach(function(row, index) {
        if (row.UomDetailId <= 0) {
          errorMessage1 =
            "Uom in Container " + row.ContainerCode + " must be selected !";
        }

        if (row.Qty <= 0) {
          errorMessage2 =
            "Qty in Container " + row.ContainerCode + " must be not empty !";
        }

        if (errorMessage1 != "" || errorMessage2 != "") {
          return;
        }
      });

      if (errorMessage1 != "") {
        valid = false;
        this.handleToast("Confirmation", "danger", errorMessage1);
      }

      if (errorMessage2 != "") {
        valid = false;
        this.handleToast("Confirmation", "danger", errorMessage2);
      }

      return valid;
    },
    async getTransactionType() {
      this.ChargesDetails = [];
    },

    async onSubmit() {
      console.log('onSubmit ...');
      if (this.validateForm()) {
        this.showLoader(true);
        var arrDetail = [];
        this.dataDetails.forEach(function(row, index) {
          arrDetail.push({
            ContainerId: row.ContainerId,
            ContainerCode: row.ContainerCode,
            ContainerName: row.ContainerName,
            UomDetailId: row.UomDetailId,
            Qty: row.Qty,
            Remark: row.Remark
          });
        });

        this.form.model.SalesQuotationDetail = arrDetail;

        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/sales/quotation/actUpdate",
            this.form.model
          );
          var response = this.$store.state.features.sales.quotation
            .resultUpdate;
          if (response.status != 200) {
            this.handleToast(
              "Confirmation",
              "danger",
              response.data.ErrorDescription != undefined
                ? response.data.ErrorDescription
                : "Update failed !"
            );
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridMain.doRefresh();

            this.handleToast("Confirmation", "success", "Successfully updated");
          }
        } else {
          await this.$store.dispatch(
            "features/sales/quotation/actCreate",
            this.form.model
          );

          var response = this.$store.state.features.sales.quotation
            .resultCreate;

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

            this.$refs.gridMain.doRefresh();

            this.handleToast("Confirmation", "success", "Successfully saved");
          }
        }

        this.showLoader(false);
      }
    },
    resetModal() {
      this.form.Reason = "";
      this.ReasonState = null;
    },
    checkFormValidity() {
      const valid = this.$refs.formvoid.checkValidity();
      this.ReasonState = valid;
      return valid;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleDoCancel();
    },
    handleCancel(bvModalEvt) {
      this.resetModal();
      // Prevent modal from closing
      this.$bvModal.hide("modal-reason");
    },
    async handleDoCancel() {
      await this.$store.dispatch(
        "features/sales/quotation/actCancel",
        this.form.model
      );
      var response = this.$store.state.features.sales.quotation.resultCancel;
      if (response.status != 200) {
        this.handleToast(
          "Confirmation",
          "danger",
          response.data.ErrorDescription != undefined
            ? response.data.ErrorDescription
            : "Cancel failed !"
        );
      } else {
        this.isForm = false;
        this.form.isEdit = false;

        this.$refs.gridMain.doRefresh();
        this.$refs.gridMain123.doRefresh();

        this.handleToast("Confirmation", "success", "Successfully Cancel");
      }

      this.$nextTick(() => {
        this.$bvModal.hide("modal-reason");
      });
    },

    async doPosting(row) {
      if (this.validateForm()) {
        this.showLoader(true);
        var arrDetail = [];
        this.dataDetails.forEach(function(row, index) {
          arrDetail.push({
            ContainerId: row.ContainerId,
            ContainerCode: row.ContainerCode,
            ContainerName: row.ContainerName,
            UomDetailId: row.UomDetailId,
            Qty: row.Qty,
            Remark: row.Remark
          });
        });

        this.form.model.SalesQuotationDetail = arrDetail;

        await this.$store.dispatch(
          "features/sales/quotation/actSubmit",
          this.form.model
        );
        var response = this.$store.state.features.sales.quotation.resultUpdate;
        if (response.status != 200) {
          this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription != undefined
              ? response.data.ErrorDescription
              : "Update failed !"
          );
        } else {
          this.isForm = false;
          this.form.isEdit = false;

          this.$refs.gridMain.doRefresh();
          this.$refs.gridMain123.doRefresh();

          this.handleToast("Confirmation", "success", "Successfully updated");
        }

        this.showLoader(false);
      }
    },
    async doComplete(row) {
      this.showLoader(true);

      this.form.model.Reason = "";

      await this.$store.dispatch(
        "features/sales/quotation/actComplete",
        this.form.model
      );
      var response = this.$store.state.features.sales.quotation.resultUpdate;
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

        this.$refs.gridMain.doRefresh();
        this.$refs.gridMain123.doRefresh();

        this.handleToast("Confirmation", "success", response.data.Message);
      }

      this.showLoader(false);
    },

    async clickPosting(index) {
      this.$bvModal
        .msgBoxConfirm(
          "Submit " +
            this.form.model.DocumentNo +
            " ? (make sure you already save all your changes)",
          {
            title: "Submit Quotation",
            size: "md",
            buttonSize: "sm",
            okVariant: "blue",
            okTitle: "YES",
            cancelTitle: "NO",
            centered: true,
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0",
            hideHeaderClose: false
          }
        )
        .then(ok => {
          if (ok) {
            this.doPosting(index);
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    async openToastDocumentStatus(){
        this.$bvToast.show('document-status-toaster');
      },
    async clickComplete(index) {
      this.$bvModal
        .msgBoxConfirm(
          "Complete " + this.form.model.DocumentNo + " Will be completed",
          {
            title: "Complete Quotation",
            size: "md",
            buttonSize: "sm",
            okVariant: "blue",
            okTitle: "YES",
            cancelTitle: "NO",
            centered: true,
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0",
            hideHeaderClose: false
          }
        )
        .then(ok => {
          if (ok) {
            this.doComplete(index);
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    async formatDMY(value, dateFormat) {
      if (dateFormat == undefined) dateFormat = "DD/MM/YYYY ";
      return moment(value)
        .utc()
        .format(dateFormat);
    }
  },
  computed: {
    ValidateShipperRule: function() {
      let rules = { required: false };
      if (this.form.validator.RequiredSubject == 1) {
        rules = { required: false };
      }
      return rules;
    },
    ValidateConsigneeRule: function() {
      let rules = { required: false };
      if (this.form.validator.RequiredSubject == 2) {
        rules = { required: true };
      }
      return rules;
    },
    TotalContainer: function() {
      var total = 0;
      if (this.dataDetails != undefined) {
        //console.log(this.dataDetails);
        for (var i = 0; i < this.dataDetails.length; i++) {
          total += this.dataDetails[i]["Qty"];
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
  padding: 3px;
  background-color: white;
}

#table-detail tfoot th {
  font-size: 12px;
  border: 1px solid #cfd8dc;
  padding: 5px;
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

