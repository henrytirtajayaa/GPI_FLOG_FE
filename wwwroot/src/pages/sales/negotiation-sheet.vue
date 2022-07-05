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
                    size="sm"
                    class="mx-1"
                    v-if="form.model.DocumentNo != '' && actionButton.AllowApprovalHistory"
                  >
                    <b-button
                      variant="info"
                      @click="onModalHistory"
                      v-b-tooltip.hover
                      title="View History"
                      id="button"
                    >
                      <font-awesome-icon :icon="['fas', 'paw']" />
                    </b-button>
                  </b-button-group>
                  <b-button-group
                    size="sm"
                    class="mx-1"
                    v-if="actionButton.AllowApproval && form.model.DocumentNo != ''"
                  >
                    <b-button size="sm" variant="green" v-b-modal.modal-action-approve id="button">
                      <font-awesome-icon
                        :icon="['fas', 'check-circle']"
                        v-b-tooltip.hover
                        title="Approve this Transaction"
                      />&nbsp;Approve
                    </b-button>
                    <b-dropdown
                      size="sm"
                      variant="danger"
                      class="ml-1"
                      no-caret
                      v-if="form.isEdit"
                      id="button"
                    >
                      <template v-slot:button-content id="button">
                        <font-awesome-icon
                          :icon="['fas', 'ban']"
                          v-b-tooltip.hover
                          title="Disapprove this Transaction"
                        />&nbsp;Disapprove
                      </template>
                      <b-dropdown-item
                        href="#"
                        @click="openModalDisapprove(false)"
                        class="text-danger"
                      >
                        <font-awesome-icon :icon="['fas', 'ban']" class="text-danger" />&nbsp;
                        <span class="text-danger">Disapprove/Cancel</span>
                      </b-dropdown-item>
                      <b-dropdown-item
                        href="#"
                        @click="openModalDisapprove(true)"
                        class="text-danger"
                      >
                        <font-awesome-icon :icon="['fas', 'undo']" class="text-warning" />&nbsp;
                        <span class="text-warning">Ask Revision</span>
                      </b-dropdown-item>
                    </b-dropdown>
                  </b-button-group>
                  <b-button-group
                    size="sm"
                    class="mx-1"
                    v-if="actionButton.AllowSubmitApproval && form.model.DocumentNo != ''"
                  >
                    <b-button
                      id="button"
                      variant="green"
                      v-b-tooltip.hover
                      title="Submit for Approval"
                      @click="onSubmitForApproval"
                    >
                      <font-awesome-icon :icon="['fas', 'check-circle']" />&nbsp;Submit For Approval
                    </b-button>
                  </b-button-group>
                  <b-button-group size="sm" class="mx-1" v-if="actionButton.AllowEdit">
                    <b-button variant="blue" type="submit" id="button">
                      <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                    </b-button>
                  </b-button-group>
                  <!-- <b-dropdown
                    variant="link"
                    class="mx-1"
                    no-caret
                    v-if="form.isEdit && actionButton.AllowEdit"
                  >
                    <template v-slot:button-content>
                      <font-awesome-icon
                        :icon="['fas', 'cog']"
                        variant="dark"
                        class="text-secondary"
                      />
                    </template>
                    <b-dropdown-item href="#" @click="handleReverse" class="text-danger">
                      <font-awesome-icon :icon="['fas', 'trash']" class="text-danger" />&nbsp;
                      <span class="text-danger">Revise Sales Order</span>
                    </b-dropdown-item>
                  </b-dropdown> -->
                  <b-button-group size="sm" class="mx-1">
                    <b-button @click="onFormClose" id="button">
                      <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                    </b-button>
                  </b-button-group>
                </b-button-toolbar>
              </div>
            </div>
            <!-- BEGIN HEADER -->
            <!-- BEGIN TOP HEADER -->
            <b-row>
              <b-col sm="10">
                <b-row>
                  <b-col sm="6" lg="3">
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
                  <b-col sm="6" lg="3">
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
                  <b-col sm="6" lg="3">
                    <b-form-group>
                      <label for="DocumentNo">Document No</label>
                      <b-form-input
                        name="Document No"
                        type="text"
                        :disabled="form.isEdit || !actionButton.AllowEdit"
                        placeholder="Document No"
                        v-model="form.model.DocumentNo"
                        class="text-center font-weight-bold"
                        readonly
                        size="sm"
                      />
                    </b-form-group>
                  </b-col>
                  <b-col sm="6" lg="3">
                    <label>Sales Order Doc. No</label>
                    <validation-provider
                      name="Sales Order No"
                      :rules="{ required: false }"
                      v-slot="validationContext"
                    >
                      <b-input-group prepend>
                        <b-form-input
                          v-model="form.model.SoDocumentNo"
                          class="text-center"
                          readonly
                          :state="validateState(validationContext)"
                          size="sm"
                          aria-describedby="sales-order-docno"
                        ></b-form-input>
                        <b-input-group-append
                          v-if="form.model.DocumentNo == '' && form.model.SoDocumentNo == ''"
                        >
                          <b-button
                            variant="outline-primary"
                            size="sm"
                            :disabled="form.isEdit || !actionButton.AllowEdit || form.model.TransactionType == ''"
                          >
                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                          </b-button>
                        </b-input-group-append>
                        <b-form-invalid-feedback
                          id="sales-order-docno"
                        >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                      </b-input-group>
                    </validation-provider>
                  </b-col>
                </b-row>
              </b-col>
              <b-col sm="2" v-if="form.isEdit">
                <b-input-group>
                  <b-button
                    class="mt-4 px-2 bg-dark text-white form-control"
                    @click="openToastDocumentStatus"
                    pill
                    v-b-tooltip.hover
                    title="Document Status"
                  >
                    <font-awesome-icon :icon="['fas', 'bell']" size="sm" />&nbsp;
                    <span class="text-uppercase">
                      <code>{{form.display.DocumentStatus}}</code>
                    </span>
                  </b-button>
                </b-input-group>
              </b-col>
            </b-row>
            <!-- END TOP HEADER -->
            <b-row class="mt-1">
              <b-col sm="12">
                <b-card sm="12" style="margin:0; padding:0;">
                  <b-row>
                    <b-col sm="4" md="4" lg="2">
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
                                v-show="actionButton.AllowEdit"
                                variant="outline-primary"
                                size="sm"
                                @click="onModalSearchCustomer('CustomerCode','CustomerCode')"
                                :disabled="!actionButton.AllowEdit"
                              >
                                <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                              </b-button>
                              <b-button
                                v-show="form.model.CustomerCode!= ''"
                                variant="outline-primary"
                                size="sm"
                                @click="onModalCustomerAddressDetail(form.model.CustomerId,form.model.CustomerAddressCode,form.model.CustomerBillToAddressCode,form.model.CustomerShipToAddressCode,form.model.CustomerCode, 'Customer')"
                              >
                                <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>
                              </b-button>
                            </b-input-group-append>

                            <b-form-invalid-feedback
                              id="customer-code-feedback"
                            >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                          </b-input-group>
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                    <b-col sm="4">
                      <b-form-group>
                        <label for="CustomerName">Customer Name</label>
                        <b-input-group prepend>
                          <b-form-input
                            v-model="form.model.CustomerName"
                            class="font-weight-bold"
                            readonly
                            size="sm"
                          ></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                    <b-col sm="3">
                      <label>Customer Address</label>
                      <validation-provider
                        name="Customer Address Code"
                        :rules="{ required: true }"
                        v-slot="validationContext"
                      >
                        <b-input-group prepend>
                          <b-form-input
                            v-model="form.model.CustomerAddressCode"
                            class="font-weight-bold"
                            readonly
                            :state="validateState(validationContext)"
                            size="sm"
                            aria-describedby="address-code-feedback"
                          ></b-form-input>
                          <b-input-group-append v-show="actionButton.AllowEdit">
                            <b-button
                              variant="outline-primary"
                              :disabled="!actionButton.AllowEdit"
                              size="sm"
                              @click="onModalSearchCustomerAddress('CustomerAddressCode','CustomerAddressCode')"
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
                    <b-col sm="4" md="4" lg="3">
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
                              v-show="actionButton.AllowEdit"
                              variant="outline-primary"
                              :disabled="!actionButton.AllowEdit"
                              size="sm"
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
                  <b-row>
                    <b-col sm="4" lg="2">
                      <b-form-group>
                        <label for="MasterNo" class="text-primary font-weight-bold">Master No</label>
                        <validation-provider
                          name="Master No"
                          :rules="{ required: true }"
                          v-slot="validationContext"
                        >
                          <b-input-group prepend>
                            <b-form-input
                              name="MasterNo"
                              type="text"
                              class="font-weight-bold form-control"
                              placeholder="Master No"
                              v-model="form.model.MasterNo"
                              aria-describedby="Master-No"
                              :state="validateState(validationContext)"
                              size="sm"
                              :disabled="!actionButton.AllowEdit"
                            />
                            <b-form-invalid-feedback>{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                          </b-input-group>
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                    <b-col sm="4" lg="2">
                      <b-form-group>
                        <label for="AgreementNo">Agreement No</label>
                        <validation-provider
                          name="Agreement No"
                          :rules="{ required: false }"
                          v-slot="validationContext"
                        >
                          <b-form-input
                            name="AgreementNo"
                            type="text"
                            class="form-control"
                            placeholder="Agreement No"
                            v-model="form.model.AgreementNo"
                            :state="validateState(validationContext)"
                            size="sm"
                            :disabled="!actionButton.AllowEdit || !form.isEdit"
                          ></b-form-input>
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                    <b-col sm="4" lg="2">
                      <label>Booking No</label>
                      <b-input-group prepend>
                        <b-form-input
                          class="form-control"
                          v-model="form.model.BookingNo"
                          size="sm"
                          :disabled="!actionButton.AllowEdit || !form.isEdit"
                        ></b-form-input>
                      </b-input-group>
                    </b-col>
                    <b-col sm="4" lg="2">
                      <label>House No</label>
                      <b-input-group prepend>
                        <b-form-input
                          class="form-control"
                          v-model="form.model.HouseNo"
                          size="sm"
                          :disabled="!actionButton.AllowEdit || !form.isEdit"
                        ></b-form-input>
                      </b-input-group>
                    </b-col>
                    <b-col sm="4" lg="2">
                      <b-form-group>
                        <label for="TrxType">Shipment Status</label>
                        <b-form-select
                          name="ShipMent Status"
                          v-model="form.model.ShipmentStatus"
                          :disabled="!actionButton.AllowEdit"
                          :plain="true"
                          :options="[{value:'NONE',text:'NONE'},{value:'FREE HAND',text:'FREE HAND'},{value:'NOMINATED',text:'NOMINATED'}]"
                          size="sm"
                        />
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-card>
              </b-col>
            </b-row>
            <!-- END HEADER -->
            <b-row>
              <b-col sm="12">
                <!-- BEGIN TAB FOR HEADER -->
                <b-tabs pills card>
                  <b-tab ref="tabHeaderShipment">
                    <template v-slot:title>
                      <font-awesome-icon :icon="['fas', 'star']" />&nbsp;Shipment
                    </template>
                    <b-row>
                      <b-col sm="12">
                        <b-row>
                          <b-col sm="3">
                            <b-form-group>
                              <label for="ShipperCode">Shipper Code</label>
                              <b-input-group prepend>
                                <b-form-input
                                  name="ShipperCode"
                                  type="text"
                                  placeholder="Shipper Code"
                                  v-model="form.model.ShipperCode"
                                  aria-describedby="shipper-code"
                                  size="sm"
                                  readonly
                                />
                                <b-input-group-append>
                                  <b-button
                                    v-show="actionButton.AllowEdit"
                                    variant="outline-primary"
                                    size="sm"
                                    @click="onModalSearchCustomer('ShipperCode','ShipperCode')"
                                    :disabled="!actionButton.AllowEdit"
                                  >
                                    <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                  </b-button>
                                  <b-button
                                    v-show="form.model.ShipperCode!= ''"
                                    variant="outline-primary"
                                    size="sm"
                                    v-if="form.model.ShipperCode  != ''"
                                    :disabled="!form.isEdit"
                                    @click="onModalCustomerAddressDetail(form.model.ShipperId,form.model.ShipperAddressCode,form.model.ShipperBillToAddressCode,form.model.ShipperShipToAddressCode,form.model.ShipperCode, 'Shipper')"
                                  >
                                    <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>
                                  </b-button>
                                </b-input-group-append>
                              </b-input-group>
                            </b-form-group>
                          </b-col>
                          <b-col sm="6">
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
                          <b-col sm="3">
                            <label>Shipper Address Code</label>
                            <b-input-group prepend>
                              <b-form-input
                                v-model="form.model.ShipperAddressCode"
                                size="sm"
                                readonly
                              ></b-form-input>
                              <b-input-group-append>
                                <b-button
                                  v-show="actionButton.AllowEdit"
                                  variant="outline-primary"
                                  size="sm"
                                  @click="onModalSearchCustomerAddress('ShipperAddressCode','ShipperAddressCode')"
                                  :disabled="!actionButton.AllowEdit"
                                >
                                  <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                </b-button>
                              </b-input-group-append>
                            </b-input-group>
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col sm="3">
                            <b-form-group>
                              <label for="ConsigneeCode">Consignee Code</label>
                              <b-input-group prepend>
                                <b-form-input
                                  name="ConsigneeCode"
                                  type="text"
                                  placeholder="Consignee Code"
                                  v-model="form.model.ConsigneeCode"
                                  aria-describedby="Consignee-Code"
                                  size="sm"
                                  readonly
                                />
                                <b-input-group-append>
                                  <b-button
                                    v-show="actionButton.AllowEdit"
                                    variant="outline-primary"
                                    size="sm"
                                    @click="onModalSearchCustomer('ConsigneeCode','ConsigneeCode')"
                                    :disabled="!actionButton.AllowEdit"
                                  >
                                    <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                  </b-button>
                                  <b-button
                                    v-show="form.model.ConsigneeCode!= ''"
                                    variant="outline-primary"
                                    :disabled="!form.isEdit"
                                    size="sm"
                                    @click="onModalCustomerAddressDetail(form.model.ConsigneeId,form.model.ConsigneeAddressCode,form.model.ConsigneeBillToAddressCode,form.model.ConsigneeShipToAddressCode,form.model.ConsigneeCode, 'Consignee')"
                                  >
                                    <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>
                                  </b-button>
                                </b-input-group-append>
                              </b-input-group>
                            </b-form-group>
                          </b-col>
                          <b-col sm="6">
                            <label for="ConsigneeName">ConsigneeName</label>
                            <b-form-input
                              name="ConsigneeName"
                              type="text"
                              placeholder="Consignee Name"
                              v-model="form.model.ConsigneeName"
                              size="sm"
                              readonly
                            />
                          </b-col>
                          <b-col sm="3">
                            <label>Consignee Address Code</label>
                            <b-input-group prepend>
                              <b-form-input
                                v-model="form.model.ConsigneeAddressCode"
                                size="sm"
                                readonly
                              ></b-form-input>
                              <b-input-group-append>
                                <b-button
                                  v-show="actionButton.AllowEdit"
                                  variant="outline-primary"
                                  size="sm"
                                  @click="onModalSearchCustomerAddress('ConsigneeAddressCode','ConsigneeAddressCode')"
                                  :disabled="!form.isEdit || !actionButton.AllowEdit"
                                >
                                  <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                </b-button>
                              </b-input-group-append>
                            </b-input-group>
                          </b-col>
                        </b-row>  

                        <b-row class="mt-2">
                          <b-col lg="12" xl="3">
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

                          <b-col sm="4" lg="3" v-show="!form.model.IsDifferentNotifyPartner">
                            <b-form-input
                              v-model="form.model.NotifyPartnerBillAddressCode"
                              v-show="false"
                              size="sm"
                            ></b-form-input>
                            <b-form-input
                              v-model="form.model.NotifyPartnerShipAddressCode"
                              v-show="false"
                              size="sm"
                            ></b-form-input>
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
                                  @click="onModalSearchCustomer('NotifyPartyCode','NotifyPartyCode')"
                                >
                                  <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                </b-button>
                                <b-button
                                  v-show="form.model.NotifyPartnerCode!= ''"
                                  :disabled="form.isView"
                                  variant="outline-primary"
                                  size="sm"
                                  @click="onModalCustomerAddressDetail(form.model.NotifyPartnerId,form.model.NotifyAddressCode,form.model.NotifyPartnerBillAddressCode,form.model.NotifyPartnerShipAddressCode,form.model.NotifyPartnerCode)"
                                >
                                  <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>
                                </b-button>
                              </b-input-group-append>
                            </b-input-group>
                          </b-col>
                          <b-col sm="4" lg="3" v-show="!form.model.IsDifferentNotifyPartner">
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
                          <b-col sm="4" lg="3" v-show="!form.model.IsDifferentNotifyPartner">
                            <label>Address Code</label>
                            <b-input-group prepend>
                              <b-form-input
                                v-model="form.model.NotifyAddressCode"
                                readonly
                                size="sm"
                                aria-describedby="bill-to-addr-feedback"
                              ></b-form-input>
                              <b-input-group-append>
                                <b-button
                                  variant="outline-primary"
                                  size="sm"
                                  @click="onModalSearchCustomerAddress('NotifyAddressCode','NotifyAddressCode')"
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
                    <!-- BEGIN SHIPPING LINE -->
                    <b-row>
                      <b-col sm="3">
                        <b-form-group>
                          <label for="ShipperLineCode">Shipping Line Name</label>
                          <b-input-group prepend>
                            <b-form-input
                              name="ShipperLineName"
                              type="text"
                              placeholder="Shipping Line Name"
                              v-model="form.model.ShippingLineName"
                              aria-describedby="shipperline-name"
                              size="sm"
                              readonly
                            />
                            <b-input-group-append>
                              <b-button
                                v-show="actionButton.AllowEdit"
                                variant="outline-primary"
                                size="sm"
                                @click="onModalSearchShippingLine('ShippingLineName')"
                                :disabled="!form.isEdit || !actionButton.AllowEdit"
                              >
                                <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                              </b-button>
                            </b-input-group-append>
                          </b-input-group>
                        </b-form-group>
                      </b-col>
                      <b-col sm="6">
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
                      <b-col sm="3">
                        <label>Shipping Line Type</label>
                        <b-input-group prepend>
                          <b-form-input v-model="form.model.ShippingLineType" size="sm" readonly></b-form-input>
                        </b-input-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col sm="3">
                        <b-form-group>
                          <label for="ShippingLineVesselCode">Vessel/Carrier Code</label>
                          <b-input-group prepend>
                            <b-form-input
                              name="ShippingLineVesselCode"
                              type="text"
                              placeholder="MV/Carrier Code"
                              v-model="form.model.ShippingLineVesselCode"
                              size="sm"
                              :readonly="!form.isEdit || !actionButton.AllowEdit"
                            />
                          </b-input-group>
                        </b-form-group>
                      </b-col>
                      <b-col sm="6">
                        <b-form-group>
                          <label for="ShippingLineVesselName">Vessel/Carrier Name</label>
                          <b-input-group prepend>
                            <b-form-input
                              name="ShippingLineVesselName"
                              type="text"
                              placeholder="MV/Carrier Name"
                              v-model="form.model.ShippingLineVesselName"
                              size="sm"
                              :readonly="!form.isEdit || !actionButton.AllowEdit"
                            />
                          </b-input-group>
                        </b-form-group>
                      </b-col>
                      <b-col sm="3">
                        <label>Voyage/Flight No</label>
                        <b-input-group prepend>
                          <b-form-input
                            v-model="form.model.ShippingLineShippingNo"
                            class="font-weight-bold"
                            size="sm"
                            :disabled="!form.isEdit || !actionButton.AllowEdit"
                          ></b-form-input>
                        </b-input-group>
                      </b-col>
                      <b-col sm="4" lg="3">
                        <label>Estimate Departure</label>
                        <b-input-group>
                          <b-form-input
                            id="EstimateDelivery1"
                            :value="form.model.ShippingLineETD | formattedDMY"
                            type="text"
                            :placeholder="dateFormatString"
                            class="text-center"
                            size="sm"
                            readonly
                          ></b-form-input>
                          <b-input-group-append>
                            <b-form-datepicker
                              v-model="form.model.ShippingLineETD"
                              button-only
                              size="sm"
                              left
                              locale="en-US"
                              :min="minCalendarDate"
                              :disabled="!form.isEdit || !actionButton.AllowEdit"
                            ></b-form-datepicker>
                          </b-input-group-append>
                        </b-input-group>
                      </b-col>
                      <b-col sm="4" lg="3">
                        <label>Estimate Arrival</label>
                        <b-input-group>
                          <b-form-input
                            id="EstimateArrival1"
                            :value="form.model.ShippingLineETA | formattedDMY"
                            type="text"
                            :placeholder="dateFormatString"
                            class="text-center"
                            size="sm"
                            readonly
                          ></b-form-input>
                          <b-input-group-append>
                            <b-form-datepicker
                              v-model="form.model.ShippingLineETA"
                              button-only
                              size="sm"
                              left
                              locale="en-US"
                              :min="minCalendarDate"
                              :disabled="!form.isEdit || !actionButton.AllowEdit"
                            ></b-form-datepicker>
                          </b-input-group-append>
                        </b-input-group>
                      </b-col>
                    </b-row>
                    <!-- END SHIPPING LINE -->

                    <b-row class="mt-3">
                      <b-col sm="3">
                        <b-form-group>
                          <label for="PortOfLoading">Port Of Loading</label>
                          <b-input-group prepend>
                            <b-form-input
                              name="Port Of Loading"
                              type="text"
                              placeholder="Port Of Loading"
                              v-model="form.model.PortOfLoading"
                              aria-describedby="Port-Of-Loading"
                              size="sm"
                              readonly
                            />
                            <b-input-group-append>
                              <b-button
                                v-show="actionButton.AllowEdit"
                                variant="outline-primary"
                                size="sm"
                                :disabled="!form.isEdit || !actionButton.AllowEdit"
                                @click="onModalSearchPort('PortOfLoading')"
                              >
                                <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                              </b-button>
                            </b-input-group-append>
                          </b-input-group>
                        </b-form-group>
                      </b-col>
                      <b-col sm="3">
                        <b-form-group>
                          <label for="PortOfDischarges">Port Of Discharges</label>
                          <b-input-group prepend>
                            <b-form-input
                              name="Port Of Discharges"
                              type="text"
                              placeholder="Port Of Discharges"
                              v-model="form.model.PortOfDischarge"
                              aria-describedby="Port-Of-Discharges"
                              size="sm"
                              readonly
                            />
                            <b-input-group-append>
                              <b-button
                                v-show="actionButton.AllowEdit"
                                variant="outline-primary"
                                size="sm"
                                :disabled="!form.isEdit || !actionButton.AllowEdit"
                                @click="onModalSearchPort('PortOfDischarge')"
                              >
                                <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                              </b-button>
                            </b-input-group-append>
                          </b-input-group>
                        </b-form-group>
                      </b-col>
                      <b-col sm="3">
                        <validation-provider
                          name="Term Of Shipment"
                          :rules="{ required: true }"
                          v-slot="validationContext"
                        >
                          <b-form-group>
                            <label for="TrxType">Term Of Shipment</label>
                            <b-form-select
                              name="Term Of Shipment"
                              :disabled="!actionButton.AllowEdit || !form.isEdit"
                              v-model="form.model.TermOfShipment"
                              :state="validateState(validationContext)"
                              :plain="true"
                              :options="optionTermOfShipment"
                              size="sm"
                              aria-describedby="Term-Of-Shipment"
                            />
                            <b-form-invalid-feedback
                              id="Term-Of-Shipment"
                            >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
                      </b-col>
                      <b-col sm="3">
                        <validation-provider
                          name="Final Destination"
                          :rules="{ required: true }"
                          v-slot="validationContext"
                        >
                          <b-form-group>
                            <label for="FinalDestination">Final Destination</label>
                            <b-input-group prepend>
                              <b-form-input
                                name="Final Destination"
                                type="text"
                                readonly
                                placeholder="Final Destination"
                                v-model="form.model.FinalDestination"
                                :state="validateState(validationContext)"
                                aria-describedby="Final-Destination"
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
                              <b-form-invalid-feedback
                                id="Final-Destination"
                              >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                            </b-input-group>
                          </b-form-group>
                        </validation-provider>
                      </b-col>
                    </b-row>
                  </b-tab>
                  <b-tab @click="isTabMain=false">
                    <template v-slot:title>
                      <font-awesome-icon :icon="['fas', 'building']" />&nbsp;Cargo
                    </template>
                    <b-row>
                      <b-col sm="6">
                        <validation-provider
                          name="Commodity"
                          :rules="{ required: true }"
                          v-slot="validationContext"
                        >
                          <b-form-group>
                            <label for="Commodity">Commodity</label>
                            <b-input-group prepend>
                              <b-form-input
                                name="Commodity"
                                type="text"
                                :disabled="!form.isEdit || !actionButton.AllowEdit"
                                placeholder="Commodity"
                                v-model="form.model.Commodity"
                                :state="validateState(validationContext)"
                                aria-describedby="Commodity"
                                size="sm"
                              />
                            </b-input-group>
                            <b-form-invalid-feedback
                              id="Commodity"
                            >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
                      </b-col>
                      <b-col sm="3">
                        <b-form-group>
                          <label for="CargoGrossWeight">Cargo Gross Weight</label>
                          <b-input-group prepend>
                            <b-form-input
                              name="Cargo Gross Weight"
                              type="text"
                              :disabled="!form.isEdit || !actionButton.AllowEdit"
                              placeholder="Cargo Gross Weight"
                              v-model="form.model.CargoGrossWeight"
                              size="sm"
                            />
                          </b-input-group>
                        </b-form-group>
                      </b-col>

                      <b-col sm="3">
                        <b-form-group>
                          <label for="CargoNetWeight">Cargo Net Weight</label>
                          <b-input-group prepend>
                            <b-form-input
                              name="Cargo Net Weight"
                              type="text"
                              :disabled="!form.isEdit || !actionButton.AllowEdit"
                              placeholder="Cargo Net Weight"
                              v-model="form.model.CargoNetWeight"
                              size="sm"
                            />
                          </b-input-group>
                        </b-form-group>
                      </b-col>
                      <b-col sm="12">
                        <validation-provider
                          name="Description"
                          :rules="{ required: false }"
                          v-slot="validationContext"
                        >
                          <b-form-group>
                            <label for="Description">Description</label>
                            <b-form-textarea
                              name="Description"
                              :disabled="!form.isEdit || !actionButton.AllowEdit"
                              placeholder="Description"
                              v-model="form.model.CargoDescription"
                              :state="validateState(validationContext)"
                              size="sm"
                              aria-describedby="Description"
                            />
                          </b-form-group>
                          <b-form-invalid-feedback
                            id="Description"
                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </validation-provider>
                      </b-col>
                    </b-row>
                  </b-tab>

                  <b-tab @click="isTabMain=false">
                    <template v-slot:title>
                      <font-awesome-icon :icon="['fas', 'clipboard']" />&nbsp;Additional
                    </template>
                    <b-row>
                      <b-col>
                        <b-form-group>
                          <label for="Remark">Remark</label>
                          <b-form-textarea
                            name="Remark"
                            :disabled="!form.isEdit || !actionButton.AllowEdit"
                            placeholder="Remark"
                            v-model="form.model.Remark"
                            size="sm"
                          ></b-form-textarea>
                        </b-form-group>
                      </b-col>
                    </b-row>
                  </b-tab>
                </b-tabs>
                <!-- END TAB FOR HEADER -->
                <!-- BEGIN TAB FOR CHARGES, TRUCKING, CONTAINER -->
                <b-tabs card variant="dark" class="mt-3">
                  <b-tab ref="tabCharges">
                    <template v-slot:title>
                      <font-awesome-icon :icon="['fas', 'coins']" />&nbsp;Charges
                    </template>
                    <b-row>
                      <b-col>
                        <b-button
                          variant="yellow"
                          size="sm"
                          type="button"
                          :disabled="form.model.TransactionType == ''"
                          v-show="form.isEdit && actionButton.AllowEdit"
                          @click="onModalCharges('SELL', -1, null)"
                        >
                          <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;Add Selling
                        </b-button>
                      </b-col>
                    </b-row>
                    <b-row class="mb-2 mt-2">
                      <b-col class="table-responsive">
                        <table
                          id="table-detail"
                          width="120%"
                          class="table-light table-striped table-hover table-bordered"
                        >
                          <thead>
                            <tr>
                              <th
                                class="text-center"
                                rowspan="2"
                                style="vertical-align:middle;width:5%"
                              >
                                <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
                              </th>
                              <th class="text-left">CHARGES&nbsp;CODE</th>
                              <th class="text-left">CURRENCY</th>
                              <th class="text-left">RATE&nbsp;AMOUNT</th>
                              <th class="text-left">UNIT&nbsp;AMOUNT</th>
                              <th class="text-left">QUANTITY</th>
                              <th class="text-left">ORG.&nbsp;AMOUNT</th>
                              <th class="text-left">ORG. EXT.&nbsp;AMOUNT</th>
                              <th class="text-left">FUNC. EXT.&nbsp;AMOUNT</th>
                              <th class="text-left">&nbsp;CHARGE&nbsp;&nbsp;TO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                              <th class="text-left">PAYMENT&nbsp;CONDITION</th>
                            </tr>
                            <tr>
                              <th class="text-left" colspan="2">CHARGES NAME</th>
                              <th class="text-left" colspan="8">REMARKS</th>
                            </tr>
                            <tr></tr>
                          </thead>
                          <tbody class="position-relative buying">
                            <template v-for="(item, itemIndex) in chargesDetails">
                              <tr>
                                <td rowspan="2" class="text-center" style="width:3%">
                                  <a
                                    v-if="actionButton.AllowEdit"
                                    href="javascript:;"
                                    style="text-decoration:none;color:red;"
                                    @click="DeleteCharges(itemIndex)"
                                    v-show="form.isEdit "
                                  >
                                    <font-awesome-icon
                                      size="lg"
                                      :icon="['fas', 'trash']"
                                      variant="danger"
                                    />
                                  </a>
                                  <b-button
                                    v-if="actionButton.AllowEdit"
                                    variant="outline-warning"
                                    size="sm"
                                    pill
                                    type="button"
                                    @click="onModalCharges('BUY', itemIndex, item)"
                                    v-show="form.isEdit"
                                  >
                                    <font-awesome-icon
                                      :icon="['fas', 'plus']"
                                      v-b-tooltip.hover
                                      title="Add Cost"
                                    />
                                  </b-button>
                                  <span v-else>{{itemIndex + 1}}</span>
                                </td>
                                <td style="width:10%">
                                  <b-form-input
                                    type="text"
                                    size="sm"
                                    v-model="item.ChargesId"
                                    v-show="false"
                                  />
                                  {{item.ChargeCode}}
                                </td>
                                <td style="width:10%">
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
                                <td style="width:7%">
                                  <money
                                    v-model="item.ExchangeRate"
                                    v-bind="item.moneyOptionsarr"
                                    class="form-control currency-money-field"
                                    disabled
                                  ></money>
                                </td>
                                <td style="width:13%">
                                  <b-input-group prepend>
                                    <money
                                      v-model="item.UnitAmount"
                                      v-bind="item.moneyOptionsarr"
                                      class="form-control currency-money-field"
                                      :disabled="!actionButton.AllowEdit"
                                    ></money>
                                  </b-input-group>
                                </td>
                                <td style="width:13%">
                                  <b-input-group prepend>
                                    <money
                                      v-model="item.Quantity"
                                      v-bind="item.moneyOptionsarr"
                                      class="form-control currency-money-field"
                                      :disabled="!actionButton.AllowEdit"
                                    ></money>
                                  </b-input-group>
                                </td>
                                <td style="width:13%">
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
                                <td style="width:13%">
                                  <b-input-group prepend>
                                    <money
                                      v-model="item.OriginatingExtendedAmount"
                                      v-bind="item.moneyOptionsarr"
                                      class="form-control currency-money-field"
                                      disabled
                                    ></money>
                                  </b-input-group>
                                </td>
                                <td style="width:15%">
                                  <b-input-group prepend>
                                    <money
                                      v-model="item.FunctionalExtendedAmount"
                                      v-bind="moneyOptions"
                                      class="form-control currency-money-field"
                                      disabled
                                    ></money>
                                  </b-input-group>
                                </td>
                                <td style="width:25%">
                                  <b-input-group prepend>
                                    <b-form-input
                                      type="text"
                                      size="sm"
                                      v-model="item.CustomerId"
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
                                <td style="width:11%">
                                  <b-form-select
                                    v-model="item.PaymentCondition"
                                    :plain="true"
                                    :options="[{value:0,text:'NONE'},{value:1,text:'PREPAID'},{value:2,text:'COLLECT'}]"
                                    size="sm"
                                    :disabled="!actionButton.AllowEdit || !actionButton.AllowSave"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td colspan="2">{{item.ChargeName}}</td>
                                <td colspan="8">
                                  <b-form-input type="text" size="sm" v-model="item.Remark" :disabled="!actionButton.AllowEdit" />
                                </td>
                              </tr>
                              <template v-for="(itemBuying, BuyingIndex) in item.NsBuyings">
                                <tr class="row-buying">
                                  <td rowspan="2" class="text-center">
                                    <a
                                      v-if="actionButton.AllowEdit"
                                      href="javascript:;"
                                      style="text-decoration:none;color:red;"
                                      @click="DeleteBuying(itemIndex,BuyingIndex)"
                                      v-show="form.isEdit"
                                    >
                                      <font-awesome-icon
                                        size="lg"
                                        :icon="['fas', 'minus-circle']"
                                        variant="danger"
                                      />
                                    </a>
                                    <code v-else>-</code>
                                  </td>
                                  <td>
                                    <b-form-input
                                      type="text"
                                      size="sm"
                                      v-model="itemBuying.ChargesIdBuying"
                                      v-show="false"
                                    />
                                    {{itemBuying.ChargeCode}}
                                  </td>
                                  <td>
                                    <b-input-group prepend>
                                      <b-form-input
                                        v-model="itemBuying.CurrencyCode"
                                        class="font-weight-bold"
                                        readonly
                                        size="sm"
                                      ></b-form-input>
                                      <b-input-group-append>
                                        <b-button
                                          v-if="actionButton.AllowEdit"
                                          variant="outline-primary"
                                          size="sm"
                                          @click="onModalSearchCurrency('BUY','CurrencyCode', item, itemBuying)"
                                          v-show="form.isEdit"
                                        >
                                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                        </b-button>
                                        <b-input-group-append
                                          v-show="actionButton.AllowEdit && form.FunctionalCurrency != itemBuying.CurrencyCode"
                                        >
                                          <b-button
                                            variant="outline-primary"
                                            size="sm"
                                            :disabled="form.FunctionalCurrency == itemBuying.CurrencyCode"
                                            @click="openModalExchangeRate(itemBuying.CurrencyCode, itemBuying.moneyOptionsarr, itemBuying.ExchangeRate, 'BUY', item, itemBuying)"
                                            v-show="form.isEdit"
                                          >
                                            <font-awesome-icon :icon="['fas', 'arrow-right']"></font-awesome-icon>
                                          </b-button>
                                        </b-input-group-append>
                                      </b-input-group-append>
                                    </b-input-group>
                                    <b-input-group size="sm"></b-input-group>
                                  </td>
                                  <td>
                                    <money
                                      v-model="itemBuying.ExchangeRate"
                                      v-bind="itemBuying.moneyOptionsarr"
                                      class="form-control currency-money-field"
                                      disabled
                                    ></money>
                                    <b-form-checkbox v-model="itemBuying.IsMultiply" v-show="false"></b-form-checkbox>
                                  </td>
                                  <td style="width:13%">
                                  <b-input-group prepend>
                                    <money
                                      v-model="itemBuying.UnitAmount"
                                      v-bind="itemBuying.moneyOptionsarr"
                                      class="form-control currency-money-field"
                                      :disabled="!actionButton.AllowEdit"
                                    ></money>
                                  </b-input-group>
                                </td>
                                <td style="width:13%">
                                  <b-input-group prepend>
                                    <money
                                      v-model="itemBuying.Quantity"
                                      v-bind="itemBuying.moneyOptionsarr"
                                      class="form-control currency-money-field"
                                      :disabled="!actionButton.AllowEdit"
                                    ></money>
                                  </b-input-group>
                                </td>
                                  <td>
                                    <b-input-group prepend>
                                      <money
                                        v-model="itemBuying.OriginatingAmount"
                                        v-bind="itemBuying.moneyOptionsarr"
                                        class="form-control currency-money-field"
                                        :disabled="!actionButton.AllowEdit || !actionButton.AllowSave"
                                      ></money>
                                      <b-button
                                        @click="openModalExtendedTax('BUY', itemBuying.CurrencyCode,itemBuying.IsMultiply, itemBuying.OriginatingAmount, itemBuying.ExchangeRate, itemBuying.TaxScheduleId, itemBuying.ScheduleCode,
                                            itemBuying.ScheduleDesc, itemBuying.TaxablePercentTax,itemBuying.TaxPercentDiscount, itemBuying.IsTaxAfterDiscount, itemBuying.OriginatingDiscount, itemBuying.DiscountByAmount, itemBuying.moneyOptionsarr, item, itemBuying)"
                                        variant="outline-primary"
                                        size="sm"
                                        v-show="form.isEdit"
                                        v-if="actionButton.AllowEdit"
                                      >
                                        <font-awesome-icon :icon="['fas', 'arrow-right']"></font-awesome-icon>
                                      </b-button>
                                    </b-input-group>
                                  </td>
                                  <td>
                                    <b-input-group prepend>
                                      <money
                                        v-model="itemBuying.OriginatingExtendedAmount"
                                        v-bind="itemBuying.moneyOptionsarr"
                                        class="form-control currency-money-field"
                                        disabled
                                      ></money>
                                    </b-input-group>
                                  </td>
                                  <td>
                                    <b-input-group prepend>
                                      <money
                                        v-model="itemBuying.FunctionalExtendedAmount"
                                        v-bind="moneyOptions"
                                        class="form-control currency-money-field"
                                        disabled
                                      ></money>
                                    </b-input-group>
                                  </td>
                                  <td>
                                    <b-input-group prepend >
                                      <b-form-input v-model="itemBuying.VendorId" v-show="false"></b-form-input>
                                      <b-form-input
                                        v-model="itemBuying.ChargeTo"
                                        type="text"
                                        class="form-control"
                                        readonly
                                        size="sm"
                                      ></b-form-input>
                                      <b-button
                                        v-if="actionButton.AllowEdit"
                                        @click="onModalSearchVendor('BUY', item, itemBuying)"
                                        variant="outline-primary"
                                        size="sm"
                                        v-show="form.isEdit"
                                      >
                                        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                      </b-button>
                                    </b-input-group>
                                  </td>
                                  <td>
                                    <b-form-select
                                      v-model="itemBuying.PaymentCondition"
                                      :plain="true"
                                      class="form-control"
                                      :options="[{value:0,text:'NONE'},{value:1,text:'PREPAID'},{value:2,text:'COLLECT'}]"
                                      size="sm"
                                      :disabled="!actionButton.AllowEdit || !actionButton.AllowSave"
                                    />
                                  </td>
                                </tr>
                                <tr class="row-buying">
                                  <td colspan="2">{{itemBuying.ChargeName}}</td>
                                  <td colspan="8">
                                    <b-form-input
                                      type="text"
                                      size="sm"
                                      v-model="itemBuying.Remark"
                                      :disabled="!actionButton.AllowEdit"
                                    />
                                  </td>
                                </tr>
                              </template>
                              <tr>
                                <td
                                  colspan="8"
                                  class="text-right pr-2 bg-soft-blue"
                                >FUNCTIONAL EXTENDED AMOUNT DIFFERENCE</td>
                                <td class="bg-soft-blue">
                                  <b-input-group prepend>
                                    <money
                                      v-model="item.DifferenceAmount"
                                      v-bind="moneyOptions"
                                      :class="item.DifferenceAmount > 0 ? 'form-control currency-money-field font-weight-bold' : 'form-control currency-money-field text-red font-weight-bold'"
                                      disabled
                                    ></money>
                                  </b-input-group>
                                </td>
                                <td colspan="2" class="bg-soft-blue"></td>
                              </tr>
                            </template>
                          </tbody>
                          <tfoot></tfoot>
                          <slot name="caption" />
                        </table>
                      </b-col>
                    </b-row>

                    <b-row>
                      <b-col sm="4" class="text-right">
                        <label style="font-size: 12px;">TOTAL FUNCTIONAL SELLING AMOUNT</label>
                      </b-col>
                      <b-col sm="4">
                        <b-input-group-append style="padding-right:28px;">
                          <money
                            v-model="form.model.TotalFuncSelling"
                            v-bind="moneyOptions"
                            class="currency-money-field font-weight-bold"
                            disabled
                          ></money>
                        </b-input-group-append>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col sm="4" class="text-right">
                        <label style="font-size: 12px;">TOTAL FUNCTIONAL BUYING AMOUNT</label>
                      </b-col>
                      <b-col sm="4">
                        <money
                          v-model="form.model.TotalFuncBuying"
                          v-bind="moneyOptions"
                          class="currency-money-field font-weight-bold"
                          disabled
                        ></money>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col sm="4" class="text-right">
                        <label style="font-size: 12px;">ESTIMATED FUNCTIONAL PROFIT AMOUNT</label>
                      </b-col>
                      <b-col sm="4">
                        <money
                          v-model="form.model.TotalFuncProfit"
                          v-bind="moneyOptions"
                          class="currency-money-field font-weight-bold"
                          disabled
                        ></money>
                      </b-col>
                    </b-row>
                  </b-tab>
                  <b-tab @click="isTabMain=false">
                    <template v-slot:title>
                      <font-awesome-icon :icon="['fas', 'truck']" />&nbsp;Trucking
                    </template>
                    <b-row>
                      <b-col>
                        <b-button
                          variant="yellow"
                          size="sm"
                          type="button"
                          @click="onModalTruck()"
                          v-show="form.isEdit && actionButton.AllowEdit"
                        >
                          <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;Add Truck
                        </b-button>
                      </b-col>
                    </b-row>
                    <b-row class="mb-2 mt-2">
                      <b-col class="table-responsive">
                        <table
                          id="table-truck"
                          width="100%"
                          class="table-light table-striped table-hover table-bordered"
                        >
                          <thead>
                            <tr>
                              <th class="text-center" rowspan="2" style="vertical-align:middle;">
                                <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
                              </th>
                              <th class="text-left">TRUCK&nbsp;TYPE&nbsp;CODE</th>
                              <th class="text-left">TRUCK&nbsp;TYPE&nbsp;NAME</th>
                              <th class="text-left">TERM OF SHIPMENT</th>
                              <th class="text-left">TRUCK&nbsp;OWNER</th>
                              <th
                                class="text-left"
                              >UOM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                              <th class="text-center" rowspan="2" style="vertical-align:top;">QTY.</th>
                            </tr>
                            <tr>
                              <th class="text-left" colspan="3">REMARKS</th>
                              <th class="text-left" colspan="2">TRUCK OWNER NAME</th>
                            </tr>
                          </thead>
                          <tbody class="position-relative">
                            <template v-for="(item, itemIndex) in truckDetails">
                              <tr>
                                <td rowspan="2" class="text-center">
                                  <a
                                    v-if="actionButton.AllowEdit"
                                    href="javascript:;"
                                    style="text-decoration:none;color:red;"
                                    @click="DeleteTruck(itemIndex)"
                                    v-show="form.isEdit"
                                  >
                                    <font-awesome-icon
                                      size="lg"
                                      :icon="['fas', 'trash']"
                                      variant="danger"
                                    />
                                  </a>
                                </td>
                                <td width="15%">
                                  <b-form-input
                                    type="text"
                                    size="sm"
                                    v-model="item.VehicleTypeCode"
                                    readonly
                                  />
                                </td>
                                <td>
                                  <b-input-group prepend>
                                    <b-form-input
                                      type="text"
                                      size="sm"
                                      v-model="item.VehicleTypeName"
                                      readonly
                                    />
                                  </b-input-group>
                                </td>
                                <td width="10%">
                                  <b-input-group prepend>
                                    <b-form-select
                                      name="UOM"
                                      v-model="item.TruckloadTerm"
                                      :plain="true"
                                      :options="[{value:'FTL',text:'FTL'},{value:'LTL',text:'LTL'}]"
                                      size="sm"
                                      :disabled="!actionButton.AllowEdit"
                                    />
                                  </b-input-group>
                                </td>
                                <td width="20%">
                                  <b-input-group>
                                    <b-form-input
                                      type="text"
                                      size="sm"
                                      v-model="item.VendorId"
                                      v-show="false"
                                    />
                                    <b-form-input
                                      v-model="item.VendorCode"
                                      type="text"
                                      size="sm"
                                      readonly
                                    ></b-form-input>
                                    <b-button
                                      variant="secondary"
                                      size="sm"
                                      @click="onModalSearchVendor('TRUCK', item)"
                                      v-show="form.isEdit"
                                    >
                                      <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                    </b-button>
                                  </b-input-group>
                                </td>
                                <td width="10%">
                                  <b-form-select
                                    name="UOM"
                                    v-model="item.UomDetailId"
                                    :plain="true"
                                    :options="optionUom"
                                    size="sm"
                                    :disabled="!actionButton.AllowEdit"
                                  />
                                </td>
                                <td width="10%" rowspan="2" style="vertical-align:top;">
                                  <b-input-group prepend>
                                    <money
                                      v-model="item.Qty"
                                      :disabled="!actionButton.AllowEdit"
                                      v-bind="moneyOptions"
                                      class="currency-money-field font-weight-bold"
                                      style="width:100%"
                                    ></money>
                                  </b-input-group>
                                </td>
                              </tr>
                              <tr>
                                <td colspan="3">
                                  <b-form-input type="text" size="sm" v-model="item.Remark" />
                                </td>
                                <td colspan="2">
                                  <b-form-input
                                    type="text"
                                    size="sm"
                                    v-model="item.VendorName"
                                    readonly
                                  />
                                </td>
                              </tr>
                            </template>
                          </tbody>

                          <tfoot>
                            <template>
                              <tr>
                                <th colspan="7"></th>
                              </tr>
                              <tr>
                                <th></th>
                                <th style="font-size: 12px;" colspan="5">TOTAl TRUCK</th>
                                <th width="20%">
                                  <money
                                    v-model="form.model.TotalTruck"
                                    v-bind="moneyOptions"
                                    class="currency-money-field font-weight-bold"
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
                    </b-row>
                  </b-tab>
                  <b-tab @click="isTabMain=false">
                    <template v-slot:title>
                      <font-awesome-icon :icon="['fas', 'box']" />&nbsp;Container
                    </template>

                    <b-row>
                      <b-col>
                        <b-button
                          variant="yellow"
                          size="sm"
                          type="button"
                          v-show="form.isEdit && actionButton.AllowEdit"
                          @click="onModalContainer()"
                        >
                          <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;Add Container
                        </b-button>
                      </b-col>
                    </b-row>
                    <b-row class="mb-2 mt-2">
                      <b-col class="table-responsive">
                        <table
                          id="table-container"
                          width="100%"
                          class="table-light table-striped table-hover table-bordered"
                        >
                          <thead>
                            <tr>
                              <th class="text-center" rowspan="2" style="vertical-align:middle;">
                                <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
                              </th>
                              <th class="text-left">CONTAINER&nbsp;TYPE&nbsp;CODE</th>
                              <th class="text-left">CONTAINER&nbsp;TYPE&nbsp;NAME</th>
                              <th
                                class="text-left"
                              >UOM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                              <th class="text-left">QUANTITY</th>
                            </tr>
                            <tr>
                              <th class="text-left" colspan="3">REMARKS</th>
                            </tr>
                          </thead>
                          <tbody class="position-relative">
                            <template v-for="(item, itemIndex) in containerDetails">
                              <tr>
                                <td rowspan="2" class="text-center">
                                  <a
                                    v-if="actionButton.AllowEdit"
                                    href="javascript:;"
                                    style="text-decoration:none;color:red;"
                                    @click="DeleteContainer(itemIndex)"
                                    v-show="form.isEdit"
                                  >
                                    <font-awesome-icon :icon="['fas', 'trash']" variant="danger" />
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
                                      :disabled="!actionButton.AllowEdit"
                                    />
                                  </b-input-group>
                                </td>
                                <td width="20%">
                                  <b-input-group prepend>
                                    <money
                                      v-model="item.Qty"
                                      :disabled="!actionButton.AllowEdit"
                                      v-bind="moneyOptions"
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
                                    :disabled="!actionButton.AllowEdit"
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
                                <th style="font-size: 12px;" colspan="3">TOTAl CONTAINER</th>
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
                    </b-row>
                  </b-tab>
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
    <b-tabs pills card v-show="!isForm">
      <b-tab active @click="isTabMain=true">
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'tasks']" />&nbsp;Progress
        </template>
        <b-row>
          <b-col cols="12" sm="12">
            <b-card>
              <DataGrid
                id="grid-progress"
                ref="gridMain"
                :fields="this.$store.state.features.sales.ns_progress.headers"
                :items="this.$store.state.features.sales.ns_progress.data"
                :info="this.$store.state.features.sales.ns_progress.listInfo"
                :baseUrl="this.$store.state.features.sales.ns_progress.baseUrl"
                :actGetData="handleGetProgress"
                :actCreate="onFormCreate"
                :actEditRow="handleEdit"
                :actDeleteRow="handleDelete"
                addTableClasses="table-bordered"
                :isEdit="this.$store.state.roleaccess.AllowEdit"
                :isDelete="this.$store.state.roleaccess.AllowDelete"
                responsive
                items-per-page-select
                loading
                hover
                sorter
                pagination
                disableNewButton
                column-filter
                caption="Negotiation Sheet - Progress"
              ></DataGrid>
            </b-card>
          </b-col>
        </b-row>
      </b-tab>
      <b-tab @click="isTabMain=false">
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'history']" />&nbsp;History
        </template>
        <b-card-text>
          <b-row>
            <b-col cols="12" sm="12">
              <b-card width="100%">
                <DataGrid
                  id="grid-history"
                  ref="gridHistory"
                  :fields="this.$store.state.features.sales.ns_history.headers"
                  :items="this.$store.state.features.sales.ns_history.data"
                  :info="this.$store.state.features.sales.ns_history.listInfo"
                  :baseUrl="this.$store.state.features.sales.ns_history.baseUrl"
                  :actGetData="handleGetHistory"
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
                  caption="Negotiation Sheet - History"
                ></DataGrid>
              </b-card>
            </b-col>
          </b-row>
        </b-card-text>
      </b-tab>
    </b-tabs>
    <!-- END GRID -->

    <!-- MODAL -->
    <CustomerAddressExtensionModal
      ref="dlgCustomerAddressDetail"
      :actSelectedRow="onSelectedCustomerDetail"
    ></CustomerAddressExtensionModal>
    <ChargesModal ref="dlgCharges" :actSelectedRow="onSelectedCharges"></ChargesModal>
    <CurrencyModal ref="dlgCurrency" :actSelectedRow="onSelectedCurrency"></CurrencyModal>
    <ExchangeRateModal ref="dlgExchangeRate" :actSelectedRow="onSelectedExchangeRate"></ExchangeRateModal>
    <ExtendedTaxModal ref="dlgExtendedTax" :actSelectedRow="onSelectedExtendedTax"></ExtendedTaxModal>
    <CustomerModal ref="dlgCustomer" :actSelectedRow="onSelectedCustomer"></CustomerModal>
    <VendorModal ref="dlgVendor" :actSelectedRow="onSelectedVendor"></VendorModal>
    <VehicleModal ref="dlgTruck" :actSelectedRow="onSelectedTruck"></VehicleModal>
    <ApprovalHistoryModal ref="dlgHistory"></ApprovalHistoryModal>
    <ShippingLineModal ref="dlgShippingLine" :actSelectedRow="onSelectedShippingLine"></ShippingLineModal>
    <PortModal ref="dlgPort" :actSelectedRow="onSelectedPort"></PortModal>

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

    <div id="page-dialogs-customer-address">
      <b-modal v-model="isShowCustomerModal" hide-footer size="lg">
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

    <b-modal
      id="modal-action-approve"
      ref="modalApprove"
      title="Please type your Approve comments"
      @hidden="resetModalApproval"
      @ok="handleOkApprove"
    >
      <form ref="formApprove" @submit.stop.prevent="handleActionApprove">
        <b-form-group
          :state="approvalState"
          label="Reason"
          label-for="name-input"
          invalid-feedback="Reason must not empty"
        >
          <b-form-input
            id="name-input"
            v-model="form.approval.Reason"
            :state="approvalState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>

    <b-modal
      id="modal-action-disapprove"
      ref="modalDisapprove"
      :title="form.approval.DisapprovalTitle"
      @hidden="resetModalApproval"
    >
      <form ref="formDisapprove" @submit.stop.prevent="handleActionDisapprove">
        <b-form-group
          :state="disapprovalState"
          label="Reason"
          label-for="name-input"
          invalid-feedback="Reason must not empty"
        >
          <b-form-input
            id="name-input"
            v-model="form.approval.Reason"
            :state="disapprovalState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button
            variant="danger"
            v-if="!form.approval.AskRevision"
            size="sm"
            class="float-right"
            @click="handleOkDisApprove"
            style="margin-left:5px;"
          >Disapprove</b-button>
          <b-button
            variant="warning"
            v-if="form.approval.AskRevision"
            size="sm"
            class="float-right"
            @click="handleOkRevise"
            style="margin-left:5px;"
          >Revise</b-button>
          <b-button size="sm" class="float-right" @click="handleCancelDisapprove">Cancel</b-button>
        </div>
      </template>
    </b-modal>

    <!-- BEGIN DOCUMENT STATUS -->
    <b-toast id="document-status-toaster" variant="warning" solid>
      <template v-slot:toast-title>
        <div class="d-flex flex-grow-1 align-items-baseline">
          <b-img blank blank-color="green" class="mr-2" width="12" height="12"></b-img>
          <strong class="mr-auto">{{form.display.DocumentStatus}}</strong>
          <small class="text-muted mr-2"></small>
        </div>
      </template>
      <p>Created By :&nbsp;{{form.display.CreatedByName}}&nbsp;on&nbsp;{{form.display.CreatedDate}}</p>
      <table v-if="form.CurrentApprovers.length" width="100%">
        <thead>
          <tr>
            <th class="text-uppercase" style="border-bottom:solid 1px;">
              <small>Current Process Approvers :</small>
            </th>
          </tr>
        </thead>
        <template v-for="(approver, itemIndex) in form.CurrentApprovers">
          <tr>
            <td>
              <code class="font-weight-bold text-uppercase">{{approver.PersonFullName}}</code>
            </td>
          </tr>
        </template>
      </table>
    </b-toast>
    <!-- END DOCUMENT STATUS -->

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
  CustomerAddressExtensionModal,
  ExchangeRateModal, ExtendedTaxModal, CustomerModal, VendorModal, VehicleModal,
  ApprovalHistoryModal, ShippingLineModal, PortModal
} from "@/pages/modal/index.js";
import { mask } from "vue-the-mask";
import moment from "moment";
import util from "@/helper/utils";
import loginServices from "@/services/loginservices";
import cloneDeep from "lodash.cloneDeep";

export default {
  name: "NegotiationSheet",
  layout: "dashboard",
  components: {
    DataGrid,
    SelectGrid,
    VueElementLoading,
    ChargesModal,
    CustomerAddressExtensionModal,
    CurrencyModal,
    ExchangeRateModal , ExtendedTaxModal,
    CustomerModal, VendorModal, VehicleModal,
    ApprovalHistoryModal, ShippingLineModal, PortModal
  },
  directives: {
    mask
  },
  data() {
    return {
      maxTableWidth:"150%",
      actionButton: {
        AllowSave: true,
        AllowEdit: true,
        AllowSubmitApproval: false,
        AllowApproval: false,    
        AllowApprovalHistory : false,    
      },
      approvalState: null,
      disapprovalState: null,
      optionUom: [],
      listTransactionType: [],
      listPaymentCondition: [],
      index: 0,
      minCalendarDate: moment().format("YYYY-01-01"),
      dateFormatString: "DD/MM/YYYY",
      formCaption: "Negotiation Sheet",
      caption: "Negotiation Sheet",
      blockLoader: false,
      isShowCustomerModal : false,
      isModalShipperAddress: false,
      isModalConsigneeAddress: false,
      isModalNotifyAddress: false,
      isModalCustomerAddress: false,
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
      chargesDetails: [], //SELLING BUYING
      truckDetails: [], //TRUCKS
      containerDetails: [], //CONTAINERS
      form: {
        FunctionalCurrency: "",
        defaultRateType: 0,
        ReceivableSetup: [],
        isEdit: false,
        model: {
          NegotiationSheetId: "00000000-0000-0000-0000-000000000000",
          TransactionDate: moment().format("YYYY-MM-DD"),
          TransactionType: "",
          SalesOrderId: "00000000-0000-0000-0000-000000000000",
          SoDocumentNo: "",
          DocumentNo: "",
          TotalFuncSelling: 0,
          TotalFuncBuying: 0,
          TotalFuncProfit: 0,
          Remark: "",
          TotalTruck: 0,
          NsSellings: [],
          NsContainers : [],
          NsTruckings : [],

          CustomerId: "00000000-0000-0000-0000-000000000000",
          CustomerCode: "",
          CustomerName: "",
          CustomerAddressCode: "",
          CustomerBillToAddressCode: "",
          CustomerShipToAddressCode: "",
          QuotDocumentNo: "",
          SalesCode: "",
          SalesName : "",
          ShipmentStatus: "",
          MasterNo: "",
          AgreementNo: "",
          BookingNo: "",
          HouseNo: "",
          ShipperId: "00000000-0000-0000-0000-000000000000",
          ShipperCode: "",
          ShipperName: "",
          ShipperAddressCode: "",
          ShipperBillToAddressCode: "",
          ShipperShipToAddressCode: "",
          ConsigneeId: "00000000-0000-0000-0000-000000000000",
          ConsigneeCode: "",
          ConsigneeName: "",
          ConsigneeAddressCode: "",
          ConsigneeBillToAddressCode: "",
          ConsigneeShipToAddressCode: "",
          IsDifferentNotifyPartner: false,
          NotifyPartnerId: "",
          NotifyPartnerCode: "",
          NotifyPartnerName: "",
          NotifyAddressCode: "",
          NotifyBillToAddressCode: "",
          NotifyShipToAddressCode: "",
          IsShippingLineMaster: true,
          ShippingLineId: "00000000-0000-0000-0000-000000000000",
          ShippingLineCode: "",
          ShippingLineName: "",
          ShippingLineVesselCode: "",
          ShippingLineVesselName: "",          
          ShippingLineShippingNo: "",
          ShippingLineOwner:"",
          ShippingLineType:"",
          ShippingLineETD: "",
          ShippingLineETA: "",
          TermOfShipment: "",
          FinalDestination: "",
          PortOfLoading: "",
          PortOfDischarge: "",
          Commodity: "",
          CargoGrossWeight: "",
          CargoNetWeight: "",
          CargoDescription: "",      
        },
        display: {
          DocumentStatus: "",
          DocumentDate: moment(Date.now()).format("YYYY/MM/DD"),
          CreatedByName: "",
          CreatedDate: "",
          ClosedByName: "",
          ClosedDate: ""
        },
        CurrentApprovers:[],
        approval:{
          Reason:"",
          ApprovalIndex : 0,
          AskRevision : false,
          DisapprovalTitle : "",
        },
      },
      ApprovalCommentHistory:[],
    };
  },
  watch: {
    chargesDetails: {
      handler: function(after, before) {
        this.doCalculateChargeDetails();
      },
      deep: true
    },
    truckDetails: {
      handler: function(after, before) {
        this.doCalculateTruckDetails();
      },
      deep: true
    }
  },
  async created() {
    await this.initDefaultForm();
  },
  async mounted() {
    await this.$store.dispatch(
      "features/sales/ns_progress/actGetData",
      "GetNegotiationSheetProgress?"
    );
    await this.$store.dispatch(
      "features/sales/ns_history/actGetData",
      "GetNegotiationSheetHistory?"
    );
  },
  methods: {
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
    async doCalculateChargeDetails() {
      let sellingAmount = 0, totalFuncSelling = 0;
      let buyingAmount = 0, totalFuncBuying = 0;

      let orgBaseAmount,
        orgTaxAmount = 0;

      if (Array.isArray(this.chargesDetails) && this.chargesDetails.length) {
        for (let i = 0; i < this.chargesDetails.length; i++) {
          sellingAmount = 0;
          buyingAmount = 0;

          let record = this.chargesDetails[i];

          record = this.calculateTax(record);

          sellingAmount = record.FunctionalExtendedAmount;

          //CALCULATE BUYINGS
          for (let j = 0; j < record.NsBuyings.length; j++) {
            let buying = this.calculateTax(record.NsBuyings[j]);

            buyingAmount += buying.FunctionalExtendedAmount;
          }

          this.chargesDetails[i].DifferenceAmount =
            sellingAmount - buyingAmount;

          totalFuncSelling+= sellingAmount;
          totalFuncBuying += buyingAmount;
        }
      }

      this.form.model.TotalFuncSelling = totalFuncSelling;
      this.form.model.TotalFuncBuying = totalFuncBuying;
      this.form.model.TotalFuncProfit = (totalFuncSelling - totalFuncBuying);
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
    async handleGetProgress(url) {
      await this.$store.dispatch("features/sales/ns_progress/actGetData", url);
      await this.updateToken();
    },
    async handleGetHistory(url) {
      await this.$store.dispatch("features/sales/ns_history/actGetData", url);
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
      this.form.model.SoDocumentNo = "";
      this.form.model.DocumentNo = "";
      this.form.model.TotalFuncSelling = 0;
      this.form.model.TotalFuncBuying = 0;
      this.form.model.TotalFuncProfit = 0;
      this.form.model.Remark = "";
      this.form.model.Status = "";
      this.form.model.StatusComment = "";

      this.form.model.CustomerId= "00000000-0000-0000-0000-000000000000";
      this.form.model.CustomerCode= "";
      this.form.model.CustomerName= "";
      this.form.model.CustomerAddressCode= "";
      this.form.model.CustomerBillToAddressCode= "";
      this.form.model.CustomerShipToAddressCode= "";
      this.form.model.QuotDocumentNo= "";
      this.form.model.SalesCode= "";
      this.form.model.SalesName = "";
      this.form.model.ShipmentStatus= "NONE";
      this.form.model.MasterNo= "";
      this.form.model.AgreementNo= "";
      this.form.model.BookingNo= "";
      this.form.model.HouseNo= "";
      this.form.model.ShipperId= "00000000-0000-0000-0000-000000000000";
      this.form.model.ShipperCode= "";
      this.form.model.ShipperName= "";
      this.form.model.ShipperAddressCode= "";
      this.form.model.ShipperBillToAddressCode= "";
      this.form.model.ShipperShipToAddressCode= "";
      this.form.model.ConsigneeId= "00000000-0000-0000-0000-000000000000";
      this.form.model.ConsigneeCode= "";
      this.form.model.ConsigneeName= "";
      this.form.model.ConsigneeAddressCode= "";
      this.form.model.ConsigneeBillToAddressCode= "";
      this.form.model.ConsigneeShipToAddressCode= "";
      this.form.model.IsDifferentNotifyPartner= false;
      this.form.model.NotifyPartnerId= "";
      this.form.model.NotifyPartnerCode= "";
      this.form.model.NotifyPartnerName= "";
      this.form.model.NotifyAddressCode= "";
      this.form.model.NotifyBillToAddressCode= "";
      this.form.model.NotifyShipToAddressCode= "";
      this.form.model.IsShippingLineMaster= true;
      this.form.model.ShippingLineId= "00000000-0000-0000-0000-000000000000";
      this.form.model.ShippingLineCode= "";
      this.form.model.ShippingLineName= "";
      this.form.model.ShippingLineVesselCode= "";
      this.form.model.ShippingLineVesselName= "";          
      this.form.model.ShippingLineShippingNo= "";
      this.form.model.ShippingLineOwner= "";          
      this.form.model.ShippingLineType= "";
      
      this.form.model.ShippingLineETD= "";
      this.form.model.ShippingLineETA= "";
      this.form.model.TermOfShipment= "";
      this.form.model.FinalDestination= "";
      this.form.model.PortOfLoading= "";
      this.form.model.PortOfDischarge= "";
      this.form.model.Commodity= "";
      this.form.model.CargoGrossWeight= "";
      this.form.model.CargoNetWeight= "";
      this.form.model.CargoDescription= ""; 

      this.form.display.CreatedByName = "";
      this.form.display.CreatedDate = moment().format("DD-MM-YYYY HH:mm:ss");
      this.form.display.ModifiedByName = "";
      this.form.display.ModifiedDate = moment().format("DD-MM-YYYY HH:mm:ss");

      this.chargesDetails = [];
      this.containerDetails = [];
      this.truckDetails = [];

      this.$refs.tabHeaderShipment.activate();
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
      CustomerCode, 
      ParamStatus
    ) {
      console.log(CustomerId + " | " + AddressCode + " | " + CustomerBillToAddressCode + " | " + CustomerShipToAddressCode + " | " + ParamStatus);
      if (CustomerCode == undefined) {
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
          CustomerShipToAddressCode,
          ParamStatus
        )
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
    async onSelectedCustomerDetail(item, reff) {
      
      if(reff.toLowerCase()=='customer'){
        this.form.model.CustomerBillToAddressCode = item.BillToAddressCode;
        this.form.model.CustomerShipToAddressCode = item.ShipToAddressCode;
      }else if(reff.toLowerCase()=='shipper'){
        this.form.model.ShipperBillToAddressCode = item.BillToAddressCode;
        this.form.model.ShipperShipToAddressCode = item.ShipToAddressCode;
      }else if(reff.toLowerCase()=='consignee'){
        this.form.model.ConsigneeBillToAddressCode = item.BillToAddressCode;
        this.form.model.ConsigneeShipToAddressCode = item.ShipToAddressCode;
      }else{
        this.form.model.NotifyBillToAddressCode = item.BillToAddressCode;
        this.form.model.NotifyShipToAddressCode = item.ShipToAddressCode;
      }
    },
    async doFindCustomerAddresses(reff, url) {
      if (url == undefined) {
        url = this.$store.state.features.company.customer_address.baseUrl;
      }

      var customerid = null;

      if (reff.toLowerCase() == "customeraddresscode")
      {
        customerid = this.form.model.CustomerId;
      }else if(reff.toLowerCase() == "shipperaddresscode"){
        customerid = this.form.model.ShipperId;
      }else if(reff.toLowerCase() == "consigneeaddresscode"){
        customerid = this.form.model.ConsigneeId;
      }else if(reff.toLowerCase() == "notifyaddresscode"){
        customerid = this.form.model.NotifyPartnerId;
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
      
      if(this.isModalCustomerAddress){
        this.form.model.CustomerAddressCode = row.AddressCode;
      }else if(this.isModalConsigneeAddress){
        this.form.model.ConsigneeAddressCode = row.AddressCode;
      }else if(this.isModalNotifyAddress){
        this.form.model.NotifyAddressCode = row.AddressCode;
      }else{
        this.form.model.ShipperAddressCode = row.AddressCode;
      }

      this.isModalShipperAddress = false;
      this.isModalConsigneeAddress = false;
      this.isModalNotifyAddress = false;
      this.isModalCustomerAddress = false;
      this.isShowCustomerModal = false;
    },
    async onModalSearchCustomerAddress(reff, active) {
      await this.doFindCustomerAddresses(reff);

      if(reff.toLowerCase() =='customeraddresscode'){
        this.isModalCustomerAddress = true;
        this.isModalNotifyAddress = false;
        this.isModalShipperAddress = false;
        this.isModalConsigneeAddress = false;
      }else if(reff.toLowerCase() =='notifyaddresscode'){
        this.isModalNotifyAddress = true;
        this.isModalShipperAddress = false;
        this.isModalConsigneeAddress = false;
        this.isModalCustomerAddress = false;
      }else if(reff.toLowerCase()=='consigneeaddresscode'){
        this.isModalNotifyAddress = false;
        this.isModalShipperAddress = false;
        this.isModalConsigneeAddress = true;
        this.isModalCustomerAddress = false;
      }else{
        this.isModalNotifyAddress = false;
        this.isModalShipperAddress = true;
        this.isModalConsigneeAddress = false;
        this.isModalCustomerAddress = false;
      }
      this.isShowCustomerModal = true;
    },
    async handleEdit(row) {
      //NS BEGIN
      this.form.model.NegotiationSheetId = row.NegotiationSheetId;
      this.form.model.TransactionDate = moment(row.TransactionDate)
        .format("YYYY-MM-DD");
      this.form.display.DocumentDate = moment(this.form.model.TransactionDate)
        .utc()
        .format(this.dateFormatString);

      this.form.model.TransactionType = row.TransactionType;
      this.form.model.SalesOrderId = row.SalesOrderId;
      this.form.model.SoDocumentNo = row.SoDocumentNo;
      this.form.model.DocumentNo = row.DocumentNo;
      this.form.model.TotalFuncSelling = row.TotalFuncSelling;
      this.form.model.TotalFuncBuying = row.TotalFuncBuying;
      this.form.model.TotalFuncProfit =
        row.TotalFuncSelling - row.TotalFuncBuying;
      this.form.model.Remark = row.Remark;
      this.form.model.Status = util.docStatus(row.Status);
      //NS END

      this.form.model.CustomerId = row.CustomerId;
      this.form.model.CustomerCode = row.CustomerCode;
      this.form.model.CustomerName = row.CustomerName;
      this.form.model.CustomerAddressCode= row.CustomerAddressCode;
      this.form.model.CustomerBillToAddressCode= row.CustomerBillToAddressCode;
      this.form.model.CustomerShipToAddressCode= row.CustomerShipToAddressCode;
      this.form.model.QuotDocumentNo= row.QuotDocumentNo;
      this.form.model.SalesCode= row.SalesCode;
      this.form.model.SalesName = row.SalesName;
      this.form.model.ShipmentStatus= row.ShipmentStatus;
      this.form.model.MasterNo= row.MasterNo;
      this.form.model.AgreementNo= row.AgreementNo;
      this.form.model.BookingNo= row.BookingNo;
      this.form.model.HouseNo= row.HouseNo;
      this.form.model.ShipperId= row.ShipperId;
      this.form.model.ShipperCode= row.ShipperCode;
      this.form.model.ShipperName=row.ShipperName;
      this.form.model.ShipperAddressCode= row.ShipperAddressCode;
      this.form.model.ShipperBillToAddressCode= row.ShipperBillToAddressCode;
      this.form.model.ShipperShipToAddressCode= row.ShipperShipToAddressCode;
      this.form.model.ConsigneeId= row.ConsigneeId;
      this.form.model.ConsigneeCode= row.ConsigneeCode;
      this.form.model.ConsigneeName= row.ConsigneeName;
      this.form.model.ConsigneeAddressCode=row.ConsigneeAddressCode;
      this.form.model.ConsigneeBillToAddressCode= row.ConsigneeBillToAddressCode;
      this.form.model.ConsigneeShipToAddressCode= row.ConsigneeShipToAddressCode;
      this.form.model.IsDifferentNotifyPartner= row.IsDifferentNotifyPartner;
      this.form.model.NotifyPartnerId= row.NotifyPartnerId;
      this.form.model.NotifyPartnerCode= row.NotifyPartnerCode;
      this.form.model.NotifyPartnerName= row.NotifyPartnerName;
      this.form.model.NotifyAddressCode= row.NotifyAddressCode;
      this.form.model.NotifyBillToAddressCode= row.NotifyBillToAddressCode;
      this.form.model.NotifyShipToAddressCode= row.NotifyShipToAddressCode;
      this.form.model.IsShippingLineMaster= row.IsShippingLineMaster;
      this.form.model.ShippingLineId= row.ShippingLineId;
      this.form.model.ShippingLineCode= row.ShippingLineCode;
      this.form.model.ShippingLineName= row.ShippingLineName;
      this.form.model.ShippingLineVesselCode= row.ShippingLineVesselCode;
      this.form.model.ShippingLineVesselName= row.ShippingLineVesselName;       
      this.form.model.ShippingLineShippingNo= row.ShippingLineShippingNo;
      this.form.model.ShippingLineOwner= row.ShippingLineOwner;
      this.form.model.ShippingLineType= row.ShippingLineType;
      this.form.model.ShippingLineVesselName= row.ShippingLineVesselName;      
      this.form.model.ShippingLineETD= row.ShippingLineETD != undefined ? moment(row.ShippingLineETD).format('YYYY-MM-DD') : null;
      this.form.model.ShippingLineETA= row.ShippingLineETA != undefined ? moment(row.ShippingLineETA).format('YYYY-MM-DD') : null;
      this.form.model.TermOfShipment= row.TermOfShipment;
      this.form.model.FinalDestination= row.FinalDestination;
      this.form.model.PortOfLoading= row.PortOfLoading;
      this.form.model.PortOfDischarge= row.PortOfDischarge;
      this.form.model.Commodity= row.Commodity;
      this.form.model.CargoGrossWeight= row.CargoGrossWeight;
      this.form.model.CargoNetWeight= row.CargoNetWeight;
      this.form.model.CargoDescription= row.CargoDescription;

      //BEGIN DOCUMENT STATUS
      this.form.display.DocumentStatus = (row.Status.toLowerCase() == 'process' ? 'Waiting Approval' : row.Status);
      this.form.display.CreatedByName = row.CreatedBy;
      this.form.display.CreatedDate = moment(row.CreatedDate).format(
        "DD-MM-YYYY HH:mm:ss"
      );
      this.form.display.ModifiedByName = row.ModifiedByName;
      this.form.display.ModifiedDate = moment(row.ModifiedByName).format(
        "DD-MM-YYYY HH:mm:ss"
      );
      //END DOCUMENT STATUS

      //GET CURRENT APPROVERS
      this.form.CurrentApprovers = (row.CurrentApprovers != undefined ? row.CurrentApprovers : []);

      //CHARGES SELLING + BUYING
      var arrdata = cloneDeep(row.NsSellings);
      console.log(row.NsSellings);

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
        //item.IsDeleted = false;

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
        for (var i = 0; i < item.NsBuyings.length; i++) {
          discPercentage = 0;

          if (item.NsBuyings[i].OriginatingDiscount > 0) {
            discPercentage =
              (
                item.NsBuyings[i].OriginatingDiscount /
                item.NsBuyings[i].OriginatingAmount
              ).toFixed(2) * 100;
          }

          item.NsBuyings[i].Index = i;
          item.NsBuyings[i].DiscountPercentage = discPercentage;
          item.NsBuyings[i].DiscountByAmount = false;
          item.NsBuyings[i].TaxPercentDiscount =
            item.NsBuyings[i].PercentDiscount;
          //item.NsBuyings[i].IsDeleted = false;

          item.NsBuyings[i].moneyOptionsarr = {
            decimal: ",",
            thousands: ".",
            prefix: "",
            suffix: "",
            precision: item.NsBuyings[i].DecimalPlaces,
            masked: false,
            allowBlank: false,
            min: 0
          };
        }
      });
      this.chargesDetails = arrdata;
      
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
    async obtainApprovalComment(){
      await this.$store.dispatch("features/sales/ns_history/actGetApprovalComment", "GetNegotiationSheetApprovalComments?NegotiationSheetId=" + this.form.model.NegotiationSheetId);
        this.ApprovalCommentHistory = this.$store.state.features.sales.ns_history.dataComment
    },
    async activateButtons(){
      //ACTIVATE BUTTONS
      if (
        this.form.model.NegotiationSheetId != "" &&
        this.form.model.DocumentNo != ""
      ) {
        if (this.form.model.Status == util.docStatus("New")) {
          this.actionButton.AllowEdit = true;
          this.actionButton.AllowSave = true;
          this.actionButton.AllowSubmitApproval = true;
          this.actionButton.AllowApproval = false;
          this.actionButton.AllowApprovalHistory = false;
        } else if (this.form.model.Status == util.docStatus("Revise")) {
          await this.obtainApprovalComment();

          this.actionButton.AllowEdit = true;
          this.actionButton.AllowSave = true;
          this.actionButton.AllowSubmitApproval = true;
          this.actionButton.AllowApproval = false;
          this.actionButton.AllowApprovalHistory = true;
        } else if (this.form.model.Status == util.docStatus("process")) {
          this.actionButton.AllowApproval = false;
          if(this.form.CurrentApprovers != undefined && this.form.CurrentApprovers.length){
            let isMeApprover = this.form.CurrentApprovers.filter(approver=>approver.PersonId.toLowerCase()==this.$store.state.user.toLowerCase());
            if(isMeApprover.length){
              this.actionButton.AllowApproval = true;
              this.form.approval.ApprovalIndex = isMeApprover[0].ApprovalIndex;
            }
          }

          await this.obtainApprovalComment();

          this.actionButton.AllowSave = false;
          this.actionButton.AllowEdit = false;
          this.actionButton.AllowSubmitApproval = false;
          this.actionButton.AllowApprovalHistory = true;

        } else {
          await this.obtainApprovalComment();

          this.actionButton.AllowEdit = false;
          this.actionButton.AllowSave = false;
          this.actionButton.AllowSubmitApproval = false;
          this.actionButton.AllowApproval = false;
          this.actionButton.AllowApprovalHistory = true;
        }
      } else {
         this.actionButton.AllowEdit = true;
         this.actionButton.AllowSave = true;
         this.actionButton.AllowSubmitApproval = false;
         this.actionButton.AllowApproval = false;
         this.actionButton.AllowApprovalHistory = false;
      }
    },
    async onModalContainer() {
      this.handleGetContainer();

      this.isShowContainer = true;
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
      let currentIndex = this.chargesDetails.length;
      let paymentCondition = this.listTransactionType.filter(
        x => x.TransactionType == item.TransactionType
      )[0].PaymentCondition;

      if (modelReff == "SELL") {
        let newCharge = {
          Index: currentIndex,
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

        this.chargesDetails.push(newCharge);
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

        let newBuyingIndex = this.chargesDetails
          .filter(x => x.Index == obj.Index && x.ChargeId == obj.ChargeId)[0]
          ["NsBuyings"].length;
        
        newCharge.Index = newBuyingIndex;

        this.chargesDetails
          .filter(x => x.Index == obj.Index && x.ChargeId == obj.ChargeId)[0]
          ["NsBuyings"].push(newCharge);
      }
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
    async onSelectedPort(item, modelReff) {
      this.form.model[modelReff] = item.PortCode;
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
    async onSelectedShippingLine(item, modelReff) {
      if (modelReff == "ShippingLineName") {
        this.form.model.ShippingLineId = item.ShippingLineId;
        this.form.model.ShippingLineCode = item.ShippingLineCode;
        this.form.model.ShippingLineName = item.ShippingLineName;
        this.form.model.ShippingLineOwner = item.VendorName;
        this.form.model.ShippingLineType = item.ShippingLineType;        
      } 
    },
    async onModalTruck(row) {
      this.$refs.dlgTruck
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
    async onSelectedTruck(item, modelReff) {
      this.truckDetails.push({
        Index: this.truckDetails.length,
        TruckId: item.VehicleTypeId,
        VehicleTypeCode: item.VehicleTypeCode,
        VehicleTypeName: item.VehicleTypeName,
        TruckloadTerm: "FTL",
        UomDetailId: "",
        VendorId: "",
        VendorCode: "",
        VendorName: "",
        Qty: 0,
        Remark: ""
      });
    },
    async DeleteCharges(index) {
      this.$bvModal
        .msgBoxConfirm("Remove this Selling ?", {
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
            this.chargesDetails.splice(index, 1);
            //this.chargesDetails[index].IsDeleted = true;
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    async DeleteBuying(index, buyingIndex) {
      this.$bvModal
        .msgBoxConfirm("Remove this Buying ?", {
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
            this.chargesDetails[index]["NsBuyings"].splice(buyingIndex, 1);

            /*this.chargesDetails[index]["NsBuyings"][
              buyingIndex
            ].IsDeleted = true;*/
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    async DeleteTruck(index) {
      this.truckDetails.splice(index, 1);
    },
    async doDelete(row) {
      this.showLoader(true);

      await this.$store.dispatch("features/sales/ns_progress/actDelete", row);

      var response = this.$store.state.features.sales.ns_progress.resultDelete;
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
    //DELETE NS , OPEN  SO
    async handleDelete(row) {
      this.$bvModal
        .msgBoxConfirm("This Negotiation Sheet will be deleted and " + row.model.DocumentNo + " can be editable.\nDo you want to continue ?", {
          title: "Reverse Negotiation Sheet",
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
    async handleReverse() {
      this.$bvModal
        .msgBoxConfirm("This Negotiation Sheet will be deleted and " + this.form.model.DocumentNo + " can be editable.\nDo you want to continue ?", {
          title: "Reverse Negotiation Sheet",
          buttonSize: "sm",
          okVariant: "blue",
          centered: true,
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0"
        })
        .then(ok => {
          if (ok) {
            this.doDelete(this.form.model);
            this.form.isEdit = false; 
            this.isForm = false;           
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    validateForm() {
      let valid = true;
      let validAmount = true;
      let text = "";

      if (this.form.model.SalesOrderId == "") {
        valid = false;
        this.handleToast("Confirmation","danger", "Sales Order is not valid !");
      }

      if (this.form.model.Commodity == "") {
        valid = false;
        this.handleToast("Confirmation","danger", "Please fill Data Commodity in Cargo Line Tab !");
      }
      if (this.form.model.CargoDescription == "") {
        valid = false;
        this.handleToast("Confirmation","danger", "Please fill Cargo Description Data in  Cargo Line Tab !");
      }

      let errorMessage1 = '', errorMessage2 = '', errorMessage3 = '', errorMessage4 = '', errorMessage5 = '';

      /** BEGIN CHARGES */
      if (this.chargesDetails.length < 1) {
        valid = false;
        this.handleToast("Confirmation","danger", "Selling Charges must not empty !");
      }

      this.chargesDetails.forEach(function(row, index) {
        if (row.OriginatingExtendedAmount <= 0) {
          errorMessage1 = 'Originating Extended Amount in ' + row.ChargeCode + ' Selling must not be 0 (zero) !';
        }
        if (row.ChargeTo == "") {
          errorMessage2 = 'Charge To in ' + row.ChargeCode + ' Selling must be selected !';
        }
        if (row.HasCosting) {
          if (row.NsBuyings.length < 1) {
            errorMessage3 = 'Please add costing/buying charge for ' + row.ChargeCode + ' Selling !';
          }
        }

        row.NsBuyings.forEach(function(buy, index) {
          if (buy.OriginatingExtendedAmount <= 0) {
            errorMessage4 = 'Originating Extended Amount in ' + buy.ChargeCode + ' Buying must not be 0 (zero) !';
          }

          if (buy.ChargeTo == "") {
            errorMessage5 = 'Charge To in ' + row.ChargeCode + ' Buying must be selected !';
          }
        });

        if(errorMessage1 != '' || errorMessage2 != '' || errorMessage3 != '' || errorMessage4 != '' || errorMessage5 != ''){
          return
        }         
      });

      if(errorMessage1 != ''){
        valid = false;
        this.handleToast("Confirmation","danger", errorMessage1);
      }

      if(errorMessage2 != ''){
        valid = false;
        this.handleToast("Confirmation","danger", errorMessage2);
      }

      if(errorMessage3 != ''){
        valid = false;
        this.handleToast("Confirmation","danger", errorMessage3);
      }

      if(errorMessage4 != ''){
        valid = false;
        this.handleToast("Confirmation","danger", errorMessage4);
      }

      if(errorMessage5 != ''){
        valid = false;
        this.handleToast("Confirmation","danger", errorMessage5);
      }
      
      /*** END CHARGES */

      /* TAB CONTAINER */
      errorMessage1 = '', errorMessage2 = '', errorMessage3 = '', errorMessage4 = '', errorMessage5 = '';
      this.containerDetails.forEach(function (row, index) {
        if (row.UomDetailId <= 0) {
          errorMessage1 = 'Uom in Container ' + row.ContainerCode + ' must be selected !'       
        }

        if (row.Qty <= 0) {
          errorMessage2 = 'Qty in Container ' + row.ContainerCode + ' must be not empty !'       
        }

        if(errorMessage1 != '' || errorMessage2 != ''){
          return
        }
      });

      if(errorMessage1 != ''){
        valid = false;
        this.handleToast("Confirmation","danger", errorMessage1);
      }

      if(errorMessage2 != ''){
        valid = false;
        this.handleToast("Confirmation","danger", errorMessage2);
      }
      /** TAB CONTAINER */

      /* TAB TRUCKINGS */
      errorMessage1 = '', errorMessage2 = '', errorMessage3 = '', errorMessage4 = '', errorMessage5 = '';
      this.truckDetails.forEach(function(row, index) {
        if (row.Qty <= 0) {
          errorMessage1 = "Qty  in Trucking Detail data  must not be 0 !";
        }
        if (row.VendorId == "") {
          errorMessage2 = "Vendor in Trucking Detail must not null !";
        }
        if (row.UomDetailId == "") {
          errorMessage3 =  "Truck Uom in Trucking Detail must not null !";
        }

        if(errorMessage1 != '' || errorMessage2 != '' || errorMessage3 != ''){
          return
        }
      });

      if(errorMessage1 != ''){
        valid = false;
        this.handleToast("Confirmation","danger", errorMessage1);
      }

      if(errorMessage2 != ''){
        valid = false;
        this.handleToast("Confirmation","danger", errorMessage2);
      }

      if(errorMessage3 != ''){
        valid = false;
        this.handleToast("Confirmation","danger", errorMessage3);
      }

      /** END TRUCKINGS */
      
      return valid;
    },
    async prepareFormData() {
      this.chargesDetails.forEach(function(item, index){
        item.RowIndex = index;

        if(item.NsBuyings.length){
          item.NsBuyings.forEach(function(buy, bindex){
            buy.RowIndex = bindex;
          })
        }
      });

      this.form.model.NsSellings = this.chargesDetails;

      this.containerDetails.forEach(function(item, index){
        item.RowIndex = index;
      });
      this.form.model.NsContainers = this.containerDetails;

      this.truckDetails.forEach(function(item, index){
        item.RowIndex = index;
      });
      this.form.model.NsTruckings = this.truckDetails;
    },
    async onSubmit() {
      if (this.validateForm()) {
        this.showLoader(true);

        await this.prepareFormData();

        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/sales/ns_progress/actUpdate",
            this.form.model
          );
          var response = this.$store.state.features.sales.ns_progress
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
            "features/sales/ns_progress/actCreate",
            this.form.model
          );

          var response = this.$store.state.features.sales.ns_progress
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
    handleCancel(bvModalEvt) {
      this.resetModal();
      // Prevent modal from closing
      this.$bvModal.hide("modal-reason");
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
       
      if (obj != undefined && obj.length) {
        let chargeType = obj[0];
        let reffSell = obj[1];

        if (chargeType["TYPE"] == "SELL" && obj.length < 3) {
          let selling = this.chargesDetails.filter(
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
          
          let buying = this.chargesDetails
            .filter(
              x =>
                x.Index == reffSell.Index && x.ChargesId == reffSell.ChargesId
            )[0]
            .NsBuyings.filter(
              y => y.OriginatingAmount == reffBuy.OriginatingAmount && y.ChargesId == reffBuy.ChargesId
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
            let selling = this.chargesDetails.filter(
              x =>
                x.Index == reffSell.Index && x.ChargesId == reffSell.ChargesId
            )[0];

            if(item.CurrencyCode != this.form.FunctionalCurrency){
              selling["ExchangeRate"] = item.ExchangeRateAmount;
              selling["IsMultiply"] = item.CalcIsMultiply;
            }else{
              selling["ExchangeRate"] = 1;
              selling["IsMultiply"] = true;
            }            
          } else {
            let reffBuy = item.ReffObj[2];

            let buying = this.chargesDetails
              .filter(
                x =>
                  x.Index == reffSell.Index && x.ChargesId == reffSell.ChargesId
              )[0]
              .NsBuyings.filter(
                y =>
                  y.Index == reffBuy.Index && y.ChargesId == reffBuy.ChargesId
              )[0];
            
            if(item.CurrencyCode != this.form.FunctionalCurrency){
              buying["ExchangeRate"] = item.ExchangeRateAmount;
              buying["IsMultiply"] = item.CalcIsMultiply;
            }else{
              buying["ExchangeRate"] = 1;
              buying["IsMultiply"] = true;
            }    
          }
        }
      }
    },
    async openModalExtendedTax(
      type, currencyCode, isMultiply, orgAmount, exchangeRate, 
      taxScheduleId, scheduleCode, scheduleDesc, taxablePercentTax, taxPercentDiscount, isTaxAfterDiscount, 
      orgDiscount, discByAmount, refMoneyOptions,
      sellItem, buyItem
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
          reffObj, //OBJECT TO MODIFY REFF         
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
            let selling = this.chargesDetails.filter(x =>x.Index == reffSell.Index && x.ChargesId == reffSell.ChargesId)[0];

            if(selling != undefined){
              selling["TaxScheduleId"] = item.TaxScheduleId == "" ? "00000000-0000-0000-0000-000000000000": item.TaxScheduleId;
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
              selling["OriginatingExtendedAmount"] = item.OriginatingExtendedAmount;
              selling["FunctionalExtendedAmount"] = item.FunctionalExtendedAmount;
            }
          }else{
            //BUYING
            let reffBuy = item.ReffObj[2];

            let buying = this.chargesDetails.filter(x =>x.Index == reffSell.Index && x.ChargesId == reffSell.ChargesId)[0].NsBuyings. filter(y =>y.Index == reffBuy.Index && y.ChargesId == reffBuy.ChargesId)[0];

            if(buying != undefined){
              buying["TaxScheduleId"] = item.TaxScheduleId == "" ? "00000000-0000-0000-0000-000000000000" : item.TaxScheduleId;
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
              buying["OriginatingExtendedAmount"] = item.OriginatingExtendedAmount;
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
        .open('CustomerCode', sellItem.CustomerCode, reffObj)
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
            let selling = this.chargesDetails.filter(x =>x.Index == reffSell.Index && x.ChargesId == reffSell.ChargesId)[0];

            if(selling != undefined){
              selling["ChargeTo"] = item.CustomerCode;
              selling["CustomerId"] = item.CustomerId;
            }else{
              selling["ChargeTo"] = '';
              selling["CustomerId"] = '';
            }
          }else if(chargeType["TYPE"] == "CustomerCode"){
            this.form.model.CustomerId = item.CustomerId;
            this.form.model.CustomerCode = item.CustomerCode;
            this.form.model.CustomerName = item.CustomerName;
            this.form.model.CustomerAddressCode = item.AddressCode;
            this.form.model.CustomerBillToAddressCode = item.BillToAddressCode;
            this.form.model.CustomerShipToAddressCode = item.ShipToAddressCode;
          }else if(chargeType["TYPE"] == "ShipperCode"){
            this.form.model.ShipperId = item.CustomerId;
            this.form.model.ShipperCode = item.CustomerCode;
            this.form.model.ShipperName = item.CustomerName;
            this.form.model.ShipperAddressCode = item.AddressCode;
            this.form.model.ShipperBillToAddressCode = item.BillToAddressCode;
            this.form.model.ShipperShipToAddressCode = item.ShipToAddressCode;
          }else if(chargeType["TYPE"] == "ConsigneeCode"){
            this.form.model.ConsigneeId = item.CustomerId;
            this.form.model.ConsigneeCode = item.CustomerCode;
            this.form.model.ConsigneeName = item.CustomerName;
            this.form.model.ConsigneeAddressCode = item.AddressCode;
            this.form.model.ConsigneeBillToAddressCode = item.BillToAddressCode;
            this.form.model.ConsigneeShipToAddressCode = item.ShipToAddressCode;
          }else if(chargeType["TYPE"] == "NotifyPartyCode"){
            this.form.model.NotifyPartnerId = item.CustomerId;
            this.form.model.NotifyPartnerCode = item.CustomerCode;
            this.form.model.NotifyPartnerName = item.CustomerName;
            this.form.model.NotifyAddressCode = item.AddressCode;
            this.form.model.NotifyBillToAddressCode = item.BillToAddressCode;
            this.form.model.NotifyShipToAddressCode = item.ShipToAddressCode;
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
        .open('VendorCode', sellItem.VendorCode, reffObj)
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

            let buying = this.chargesDetails.filter(x =>x.Index == reffSell.Index && x.ChargesId == reffSell.ChargesId)[0].NsBuyings. filter(y =>y.Index == reffBuy.Index && y.ChargesId == reffBuy.ChargesId)[0];

            if(buying != undefined){
              buying["ChargeTo"] = item.VendorCode;
              buying["VendorId"] = item.VendorId;
            }else{
              buying["ChargeTo"] = '';
              buying["VendorId"] = '';
            }
          }else if(chargeType["TYPE"] == "TRUCK") {
            let reffTruck = reffObj[1];
            let truck = this.truckDetails.filter(x =>x.Index == reffTruck.Index && x.VehicleTypeId == reffTruck.VehicleTypeId)[0];

            if(truck != undefined){
                truck["VendorId"] = item.VendorId;
                truck["VendorCode"] = item.VendorCode;
                truck["VendorName"] = item.VendorName;
            }
          }
      }         
    },
    //END CHARGE DETAIL RELATED
    //BEGIN TRUCK DETAILS
    async onModalTruck(row) {
      this.$refs.dlgTruck
        .open(row, this.form.model[row])
        .then(res => {
          //console.log(res);
        })
        .catch(res => {
          //console.log(res);
        });
    },
    async onSelectedTruck(item, modelReff) {
      this.truckDetails.push({
        Index: this.truckDetails.length,
        VehicleTypeId: item.VehicleTypeId,
        VehicleTypeCode: item.VehicleTypeCode,
        VehicleTypeName: item.VehicleTypeName,
        TruckloadTerm: "FTL",
        UomDetailId: "",
        VendorId: "",
        VendorCode: "",
        VendorName: "",
        Qty: 0,
        Remark: ""
      });
    },
    //END TRUCK DETAILS
    //BEGIN CONTAINERS
    async handleSelectContainer(row) {
      var arr = [];
      this.containerDetails.push({
        Index: this.containerDetails.length,
        ContainerId: row.ContainerId,
        ContainerCode: row.ContainerCode,
        ContainerName: row.ContainerName,
        UomDetailId: row.UomDetailId,
        Qty: 0,
        Remark:'',
      });

      this.isShowContainer = false;
    },
    async DeleteContainer(index) {
      this.containerDetails.splice(index, 1);
    },
    async doSubmitForApproval() {
      this.showLoader(true);

      this.form.model.Reason = "";

      await this.$store.dispatch(
        "features/sales/ns_progress/actSubmitForApproval",
        this.form.model
      );
      var response = this.$store.state.features.sales.ns_progress.resultUpdate;
      if (response.status != 200) {
        this.handleToast(
          "Confirmation",
          "danger",
          response.data.ErrorDescription != null
            ? response.data.ErrorDescription
            : "Submit failed."
        );
      } else {
        this.$refs.gridMain.doRefresh();

        this.isForm = false;
        this.form.isEdit = false;
        
        this.handleToast("Confirmation", "success", response.data.Message);
      }

      this.showLoader(false);
    },
    //END CONTAINERS
    async onSubmitForApproval() {
      this.$bvModal
        .msgBoxConfirm("Proceed to Approval ?", {
          title: "Submit For Approval",
          buttonSize: "sm",
          okVariant: "blue",
          centered: true,
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0"
        })
        .then(ok => {
          if (ok) {
            this.doSubmitForApproval();
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    //BEGIN APPROVAL
    resetModalApproval() {
      this.form.approval.Reason = "";
      this.form.approval.ApprovalIndex= 0;
      this.form.approval.AskRevision = false;

      this.approvalState = null;
    },
    checkFormValidity(form) {
      if (form.toLowerCase() == 'approve') {
        const valid = this.$refs.formApprove.checkValidity()
        this.approvalState = valid
        return valid
      } else if (form.toLowerCase() == 'disapprove') {
        const valid = this.$refs.formDisapprove.checkValidity()
        this.disapprovalState = valid
        return valid
      } 
    },
    openModalDisapprove(isRevise){
      this.form.approval.AskRevision = isRevise;
      this.form.approval.DisapprovalTitle = "Please type your reason to " + (isRevise ? "Revise" : "Disapprove");
      this.$refs.modalDisapprove.show();
    },
    handleOkApprove(bvModalEvt) {
      bvModalEvt.preventDefault()
      this.handleActionApprove()
    },
    handleActionApprove() {
      if (!this.checkFormValidity('approve')) {
        return
      }

      this.doActionApprove();

      this.$nextTick(() => {
        this.$bvModal.hide('modal-action-approve')
      })
    },
    async doActionApprove() {
        this.showLoader(true);

        this.form.model.Comments = this.form.approval.Reason;
        this.form.model.NegotiationSheetId = this.form.model.NegotiationSheetId;
        this.form.model.ApprovalIndex = this.form.approval.ApprovalIndex;

        await this.$store.dispatch("features/sales/ns_progress/actApprovalApprove", this.form.model);

        var response = this.$store.state.features.sales.ns_progress.resultUpdate;
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
          this.$refs.gridHistory.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },
      handleOkDisApprove(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleActionDisapprove(false)
      },
      handleOkRevise(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleActionDisapprove(true)
      },
      handleCancelDisapprove(bvModalEvt) {
        this.resetModalApproval();
        // Prevent modal from closing
        this.$bvModal.hide('modal-action-disapprove')
      },
      handleActionDisapprove(isRevise) {
        if (!this.checkFormValidity('disapprove')) {
          return
        }

        if(isRevise){
          this.doActionRevise();
        }else{
          this.doActionDisapprove();
        }        

        this.$nextTick(() => {
          this.$bvModal.hide('modal-action-disapprove')
        })
      },
      async doActionDisapprove() {
        this.showLoader(true);

        this.form.model.Comments = this.form.approval.Reason;
        this.form.model.NegotiationSheetId = this.form.model.NegotiationSheetId;
        this.form.model.ApprovalIndex = this.form.approval.ApprovalIndex;

        await this.$store.dispatch("features/sales/ns_progress/actApprovalDisapprove", this.form.model);

        var response = this.$store.state.features.sales.ns_progress.resultUpdate;
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
          this.$refs.gridHistory.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },
      async doActionRevise() {
        this.showLoader(true);

        this.form.model.Comments = this.form.approval.Reason;
        this.form.model.NegotiationSheetId = this.form.model.NegotiationSheetId;
        this.form.model.ApprovalIndex = this.form.approval.ApprovalIndex;

        await this.$store.dispatch("features/sales/ns_progress/actApprovalRevise", this.form.model);

        var response = this.$store.state.features.sales.ns_progress.resultUpdate;
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
          this.$refs.gridHistory.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },
      async onModalHistory() {
        this.$refs.dlgHistory
          .open(this.ApprovalCommentHistory)
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async openToastDocumentStatus(){
        this.$bvToast.show('document-status-toaster');
      },
    //END APPROVAL
  },
  computed: {
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
      if(value != null){
        if (value != undefined && value.length > 6) {
        if (dateFormat == undefined) dateFormat = "DD/MM/YYYY ";
        return moment(value)
          .format(dateFormat);
        } else {
          return value;
        }
      }else{
        return ''
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

@media only screen and (max-width: 1024px) {
  #button {
    font-size: 10px;
  }
}
</style>