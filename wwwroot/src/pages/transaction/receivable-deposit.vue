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
                    <b-button variant="dark" v-if="form.model.DocumentNo != ''" @click="handlePrintOut" v-b-tooltip.hover title="View Print Out">
                      <font-awesome-icon :icon="['fas', 'print']" />
                    </b-button>

                    <b-button variant="red"
                              v-b-modal.modal-void-reason
                              v-if="actionButton.AllowVoid">
                      <font-awesome-icon :icon="['fas', 'ban']"
                                         v-b-tooltip.hover
                                         title="Void this Transaction" />&nbsp;Void
                    </b-button>
                    <b-button variant="green"
                              @click="clickPosting"
                              v-if="actionButton.AllowPosting"
                              v-b-tooltip.hover
                              title="Posting this Transaction">
                      <font-awesome-icon :icon="['fas', 'check-circle']" />&nbsp;Posting
                    </b-button>
                    <b-button v-if="form.model.DocumentNo != ''"
                              @click="onModalDistJournal"
                              v-b-tooltip.hover
                              title="View Distribution Journal">
                      <font-awesome-icon :icon="['fas', 'balance-scale']" />
                    </b-button>
                    <b-button variant="blue" type="submit" v-if="actionButton.AllowSave">
                      <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                    </b-button>
                    <b-button @click="onFormClose">
                      <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                    </b-button>
                  </div>
                </div>
                <b-row>
                  <!-- BEGIN FORM -->
                  <b-col sm="10">
                    <b-row>
                      <b-col sm="3">
                        <validation-provider name="Document Type"
                                             :rules="{ required: true }"
                                             v-slot="validationContext">
                          <b-form-group>
                            <label for="DocumentType">Document Type</label><span style="color:red;"> *</span>
                            <!-- <b-form-select v-model="form.model.DocumentType">
                              <b-form-select-option value="DEPOSIT DEMURRAGE">Deposit Demurrage</b-form-select-option>
                              <b-form-select-option value="CONTAINER GUARANTEE">Container Guarantee</b-form-select-option>
                            </b-form-select> -->
                            <b-form-select id="DocumentType"
                                           name="Document Type"
                                           v-model="form.model.DocumentType"
                                           :state="validateState(validationContext)"
                                           :plain="true"
                                           :options="listDocumentType"
                                           value-field="Value"
                                           text-field="Text"
                                           @change="onDocumentTypeChange"
                                           size="sm"
                                           :disabled="!actionButton.AllowEdit || form.isEdit"
                                           aria-describedby="type-feedback" />
                            <b-form-invalid-feedback id="type-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
                      </b-col>

                      <b-col sm="3">
                        <label>Document Date</label><span style="color:red;"> *</span>
                        <b-input-group>
                          <b-form-input v-model="form.display.DocumentDate"
                                        type="text"
                                        :placeholder="dateFormatString"
                                        class="text-center"
                                        size="sm"
                                        readonly
                                        aria-describedby="doc-date-feedback"></b-form-input>
                          <b-input-group-append v-if="actionButton.AllowEdit">
                            <b-form-datepicker v-model="form.model.TransactionDate"
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
                            <label for="TrxType">Transaction Type</label><span style="color:red;"> *</span>
                            <b-form-select name="Transaction Type"
                                           v-model="form.model.TransactionType"
                                           :state="validateState(validationContext)"
                                           :plain="true"
                                           :options="filterByDocumentType"
                                           value-field="TransactionType"
                                           text-field="TransactionType"
                                           size="sm"
                                           :disabled="!actionButton.AllowEdit || form.isEdit"
                                           @change="onChangeTransactionType"
                                           aria-describedby="trxtype-feedback" />
                            <b-form-invalid-feedback id="trxtype-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
                      </b-col>
                      <b-col sm="3">
                        <b-form-group>
                          <label for="DocumentNo">Document No</label>
                          <b-form-input name="Document No"
                                        type="text"
                                        placeholder="Document No"
                                        v-model="form.model.DocumentNo"
                                        class="text-center font-weight-bold"
                                        readonly
                                        variant="blue"
                                        :disabled="!actionButton.AllowEdit"
                                        size="sm" />
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col sm="3">
                        <b-card sm="12" style="margin:0; padding:0;">
                          <b-row sm="2">
                            <b-col>
                              <label>Currency Code</label><span style="color:red;"> *</span>
                              <validation-provider name="Currency Code"
                                                   :rules="{ required: true }"
                                                   v-slot="validationContext">
                                <b-input-group prepend>
                                  <b-form-input v-model="form.model.CurrencyCode"
                                                class="font-weight-bold"
                                                :state="validateState(validationContext)"
                                                readonly
                                                size="sm"
                                                aria-describedby="Currency-feedback"></b-form-input>
                                  <b-input-group-append v-if="!form.isEdit">
                                    <b-button variant="outline-primary"
                                              size="sm"
                                              @click="onModalSearchCurrency('CurrencyCode','CurrencyName')">
                                      <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                    </b-button>
                                  </b-input-group-append>
                                  <b-form-invalid-feedback id="Currency-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-input-group>
                              </validation-provider>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col class="mt-3">
                              <label>
                                Rate Amount
                                <code>{{form.model.IsMultiply ? "*" : "/"}}</code>
                              </label>
                              <validation-provider name="rate"
                                                   :rules="{ required: true, min_value:1}"
                                                   v-slot="validationContext">
                                <b-input-group :prepend="form.CurrencySymbol" size="sm">
                                  <money v-model="form.model.RateAmount"
                                         v-bind="moneyOptions"
                                         style="width:100px;"
                                         size="sm"
                                         :state="validateState(validationContext)"
                                         :class="validationContext.errors.length == 0 ? 'currency-money-field is-valid' : 'currency-money-field is-invalid'"
                                         disabled
                                         aria-describedby="rate-amount-feedback"></money>
                                  <b-input-group-append v-if="(form.model.TransactionDate != '' && form.model.CurrencyCode != '' && (form.FunctionalCurrency != form.model.CurrencyCode)) && actionButton.AllowEdit">
                                    <b-button variant="outline-primary"
                                              size="sm"
                                              @click="openModalExchangeRate">
                                      <font-awesome-icon :icon="['fas', 'arrow-right']"></font-awesome-icon>
                                    </b-button>
                                  </b-input-group-append>
                                  <b-form-invalid-feedback id="rate-amount-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-input-group>
                              </validation-provider>
                            </b-col>
                          </b-row>
                        </b-card>
                        <b-row class="mt-2">
                          <b-col>
                            <label>Payment Term Code</label>
                            <b-input-group prepend>
                              <b-form-input v-model="form.model.PaymentTermCode"
                                            readonly
                                            size="sm"
                                            aria-describedby="payment-term-code-feedback"></b-form-input>
                              <b-input-group-append>
                                <b-button variant="outline-primary"
                                          size="sm"
                                          v-show="actionButton.AllowEdit"
                                          @click="onModalSearchPaymentTerm('PaymentTermCode')">
                                  <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                </b-button>
                              </b-input-group-append>
                            </b-input-group>
                          </b-col>
                        </b-row>
                      </b-col>
                      <b-col sm="9">
                        <b-card sm="12" style="margin:0; padding:0;">
                          <b-row>
                            <b-col sm="4">
                              <b-form-group>
                                <label for="CustomerCode">Customer Code</label><span style="color:red;"> *</span>
                                <validation-provider name="Customer Code"
                                                     :rules="{ required: true }"
                                                     v-slot="validationContext">
                                  <b-input-group prepend>
                                    <b-form-input v-model="form.model.CustomerCode"
                                                  readonly
                                                  size="sm"
                                                  :state="validateState(validationContext)"
                                                  aria-describedby="customer-code-feedback"></b-form-input>
                                    <b-input-group-append v-if="actionButton.AllowEdit">
                                      <b-button variant="outline-primary"
                                                size="sm"
                                                :disabled="!actionButton.AllowEdit"
                                                @click="onModalSearchCustomer('CustomerCode')">
                                        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                      </b-button>
                                    </b-input-group-append>
                                    <b-form-invalid-feedback id="customer-code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                  </b-input-group>
                                </validation-provider>
                              </b-form-group>
                            </b-col>
                            <b-col sm="8">
                              <b-form-group>
                                <label for="CustomerName">Customer Name</label>
                                <b-form-input v-model="form.model.CustomerName"
                                              class="font-weight-bold"
                                              readonly
                                              size="sm"></b-form-input>
                              </b-form-group>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col sm="4">
                              <label>Customer Address Code</label><span style="color:red;"> *</span>
                              <validation-provider name="Address Code"
                                                   :rules="{ required: true }"
                                                   v-slot="validationContext">
                                <b-input-group prepend>
                                  <b-form-input v-model="form.model.AddressCode"
                                                class="font-weight-bold"
                                                readonly
                                                :state="validateState(validationContext)"
                                                size="sm"
                                                aria-describedby="address-code-feedback"></b-form-input>
                                  <b-input-group-append>
                                    <b-button variant="outline-primary"
                                              size="sm"
                                              v-if="actionButton.AllowEdit"
                                              @click="onModalSearchCustomerAddress('AddressCode','AddressCode')">
                                      <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                    </b-button>
                                    <b-button v-show="form.model.AddressCode!= ''"
                                              variant="outline-primary"
                                              size="sm"
                                              @click="onModalSearchCustomerAddressExtension">
                                      <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>
                                    </b-button>
                                    <!-- <b-button v-show="form.model.AddressCode!= ''"
                                              variant="outline-primary"
                                              size="sm"
                                              @click="onModalCustomerAddressDetail(form.model.AddressCode,'AddressCode')">
                                      <font-awesome-icon :icon="['fas', 'info']"></font-awesome-icon>
                                    </b-button> -->
                                  </b-input-group-append>
                                  <b-form-invalid-feedback id="address-code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-input-group>
                              </validation-provider>
                            </b-col>
                            <b-col sm="4" hidden>
                              <label>Billing Address</label>
                              <b-input-group prepend>
                                <b-form-input v-model="form.model.BillToAddressCode"
                                              class="font-weight-bold"
                                              readonly
                                              size="sm"></b-form-input>
                                <b-input-group-append>
                                  <b-button variant="outline-secondary"
                                            size="sm"
                                            v-if="actionButton.AllowEdit"
                                            @click="onModalSearchCustomerAddress('BillToAddressCode','BillToAddressCode')">
                                    <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>
                                  </b-button>
                                  <b-button v-show="form.model.AddressCode!= ''"
                                            variant="outline-primary"
                                            size="sm"
                                            @click="onModalCustomerAddressDetail(form.model.BillToAddressCode,'BillToAddressCode')">
                                    <font-awesome-icon :icon="['fas', 'info']"></font-awesome-icon>
                                  </b-button>
                                </b-input-group-append>
                              </b-input-group>
                            </b-col>
                            <b-col sm="4" hidden>
                              <label>Shipping Address</label>
                              <b-input-group prepend>
                                <b-form-input v-model="form.model.ShipToAddressCode"
                                              class="font-weight-bold"
                                              readonly
                                              size="sm"></b-form-input>
                                <b-input-group-append>
                                  <b-button variant="outline-secondary"
                                            size="sm"
                                            v-if="actionButton.AllowEdit"
                                            @click="onModalSearchCustomerAddress('ShipToAddressCode','ShipToAddressCode')">
                                    <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>
                                  </b-button>
                                  <b-button v-show="form.model.AddressCode!= ''"
                                            variant="outline-primary"
                                            size="sm"
                                            @click="onModalCustomerAddressDetail(form.model.ShipToAddressCode,'ShipToAddressCode')">
                                    <font-awesome-icon :icon="['fas', 'info']"></font-awesome-icon>
                                  </b-button>
                                </b-input-group-append>
                              </b-input-group>
                            </b-col>
                            <b-col sm="6">
                              <label>NS Document No</label>
                              <b-input-group prepend>
                              <b-form-input v-model="form.model.NsDocumentNo"
                                            class="font-weight-bold"
                                            readonly
                                            size="sm"></b-form-input>
                              <b-input-group-append v-if="actionButton.AllowEdit">
                                      <b-button variant="outline-primary"
                                                size="sm"
                                                :disabled="!actionButton.AllowEdit"
                                                v-if="form.model.TransactionType"
                                                @click="onModalSearchNegotiationSheet('NsDocumentNo')">
                                        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                      </b-button>
                              </b-input-group-append>
                              </b-input-group>
                            </b-col>
                          </b-row><br/>
                          <b-row>
                            <b-col sm="4">
                              <label>NS Master No.</label>
                              <b-input-group prepend>
                              <b-form-input v-model="form.model.MasterNo"
                                            class="font-weight-bold"
                                            readonly
                                            size="sm"></b-form-input>
                              </b-input-group>
                            </b-col>
                             <b-col sm="4">
                              <label>NS Agreement No.</label>
                              <b-input-group prepend>
                              <b-form-input v-model="form.model.AgreementNo"
                                            class="font-weight-bold"
                                            readonly
                                            size="sm"></b-form-input>
                              </b-input-group>
                            </b-col>
                          </b-row>
                        </b-card>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col>
                        <b-form-group>
                          <label for="Description">Description</label><span style="color:red;"> *</span>
                          <validation-provider name="Description"
                                               :rules="{ required: false }"
                                               v-slot="validationContext">
                            <b-form-textarea name="Description"
                                             placeholder="Description"
                                             v-model="form.model.Description"
                                             :state="validateState(validationContext)"
                                             size="sm"
                                             :disabled="!actionButton.AllowEdit"
                                             aria-describedby="desc-feedback" />
                            <b-form-invalid-feedback id="desc-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                          </validation-provider>
                        </b-form-group>
                      </b-col>
                    </b-row>
                  </b-col>
                  <!-- END DOCUMENT STATUS -->
                  <b-col sm="2" v-if="form.isEdit">
                    <b-card bg-variant="dark"
                            text-variant="white">
                      <h5>{{ form.display.DocumentStatus }}</h5>
                      <b-card-text>
                        <div v-if="form.display.DocumentStatus == 'Void'">
                          <label>
                            <small>Void By :</small>
                          </label>
                          <br />
                          {{form.display.VoidName}}
                          <br />
                          <label>
                            <small>Void Date :</small>
                          </label>
                          <br />
                          {{form.display.VoidDate}}
                          <br />
                          <label>
                            <small>Comments :</small>
                          </label>
                          <br />
                          {{form.display.StatusComment}}
                        </div>
                        <div v-else>
                          <label>
                            <small>Created By :</small>
                          </label>
                          <br />
                          {{form.display.CreatedByName}}
                          <br />
                          <label>
                            <small>Created Date :</small>
                          </label>
                          <br />
                          {{form.display.CreatedDate}}
                        </div>
                      </b-card-text>
                    </b-card>
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col>
                    <b-button variant="yellow"
                              size="sm"
                              @click="onModalSearchCharges('ChargesCode')"
                              :disabled="!actionButton.AllowEdit || (form.model.CurrencyCode == '' || form.model.DocumentType == '' || form.model.TransactionType == '')"
                              v-if="actionButton.AllowEdit">
                      <font-awesome-icon :icon="['fas', 'search']" />&nbsp; Charges
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
                          <th class="text-left">CHARGES CODE</th>
                          <th class="text-left">ORG. AMOUNT</th>
                          <th class="text-left">ORG DISC AMOUNT</th>
                          <th class="text-left">ORG. TAX AMOUNT</th>
                          <th class="text-left">ORG. EXT. AMOUNT</th>
                        </tr>
                        <tr>
                          <th class="text-left" colspan="2">CHARGES NAME</th>
                          <th class="text-left" colspan="3">DESCRIPTION</th>
                        </tr>
                      </thead>
                      <tbody class="position-relative" v-if="form.detail.ChargesId">
                          <template>
                            <tr>
                            <td rowspan="2" class="text-center">
                            </td>
                            <td>
                              <b-form-input type="text"
                                            size="sm"
                                            v-model="form.detail.ChargesCode"
                                            readonly />
                              <b-form-input type="text"
                                            size="sm"
                                            v-model="form.detail.ChargesId"
                                            v-show="false" />
                            </td>
                            <td width="20%">
                              <b-input-group prepend>
                                <money v-model="form.detail.OriginatingAmount"
                                       v-bind="moneyOptions"
                                       class="currency-money-field"
                                       style="width:100%"
                                       :change="calculateDefault()"
                                       :disabled="!actionButton.AllowEdit"></money>
                              </b-input-group>
                            </td>
                            <td width="20%">
                              <b-input-group prepend>
                                <money :disabled="!actionButton.AllowEdit || form.isCN"
                                       v-model="form.detail.OriginatingDiscount"
                                       v-bind="moneyOptions"
                                       class="form-control currency-money-field"></money>
                                <b-button :disabled="!actionButton.AllowEdit"
                                          v-show="form.detail.OriginatingAmount > 0 && actionButton.AllowEdit && !form.isCN"
                                          @click="openModalDetailDiscount(form.detail.OriginatingAmount)"
                                          variant="outline-primary"
                                          size="sm">
                                  <font-awesome-icon :icon="['fas', 'arrow-right']"
                                                     :disabled="!actionButton.AllowEdit"></font-awesome-icon>
                                </b-button>
                              </b-input-group>
                            </td>
                            <td width="20%">
                              <b-input-group prepend>
                                <b-form-input v-model="form.detail.ScheduleId" v-show="false"></b-form-input>
                                <b-form-input v-model="form.detail.ScheduleCode" v-show="false"></b-form-input>
                                <b-form-input v-model="form.detail.ScheduleDesc" v-show="false"></b-form-input>
                                <b-form-checkbox v-model="form.detail.IsTaxAfterDiscount" v-show="false"></b-form-checkbox>
                                <b-form-input v-model="form.detail.BasedAmount" v-show="false"></b-form-input>
                                <b-form-input v-model="form.detail.TaxablePercentTax" v-show="false"></b-form-input>
                                <b-form-input v-model="form.detail.PercentDiscount"
                                              v-show="false"
                                              style="width:87%"></b-form-input>
                                <money v-model="form.detail.OriginatingTax"
                                       v-bind="moneyOptions"
                                       class="form-control currency-money-field"
                                       disabled></money>
                                <b-button :disabled="!actionButton.AllowEdit"
                                          @click="openModalDetailTax(form.detail.OriginatingAmount,form.detail.OriginatingDiscount, form.detail.ScheduleCode, form.detail.IsTaxAfterDiscount)"
                                          v-show="form.detail.OriginatingAmount > 0 && actionButton.AllowEdit && !form.isCN"
                                          variant="outline-primary"
                                          size="sm">
                                  <font-awesome-icon :icon="['fas', 'arrow-right']"></font-awesome-icon>
                                </b-button>
                              </b-input-group>
                            </td>
                            <td width="20%">
                              <b-input-group prepend>
                                <money v-model="form.detail.OriginatingExtendedAmount"
                                       v-bind="moneyOptions"
                                       class="currency-money-field"
                                       :change="TotalOriginatingExtendedAmount()"
                                       disabled
                                       style="width:100%"></money>
                              </b-input-group>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2">
                              <b-form-input type="text"
                                            size="sm"
                                            v-model="form.detail.ChargesName"
                                            readonly />
                            </td>
                            <td colspan="3">
                              <b-form-input type="text"
                                            size="sm"
                                            v-model="form.detail.Description"
                                            :disabled="!actionButton.AllowEdit" />
                            </td>
                          </tr>
                        </template>
                      </tbody>
                      <tfoot>
                        <tr>
                          <th colspan="5"></th>
                        </tr>
                        <tr>
                          <th></th>
                          <th style="font-size: 12px;">ORG. SUBTOTAL AMOUNT</th>
                          <th width="20%">
                            <money v-model="form.model.OriginatingAmount"
                                   v-bind="moneyOptions"
                                   class="currency-money-field font-weight-bold"
                                   :value="SubOriginatingAmount"
                                   disabled
                                   style="width:100%"></money>
                          </th>
                          <th>
                            <b-input-group prepend>
                              <money v-model="form.model.OriginatingDiscount"
                                     v-bind="moneyOptions"
                                     class="currency-money-field font-weight-bold"
                                     :value="SubTotalDiscount"
                                     disabled></money>
                            </b-input-group>
                          </th>
                          <th width="20%">
                            <b-input-group prepend>
                              <money v-model="form.model.OriginatingTax"
                                     v-bind="moneyOptions"
                                     class="currency-money-field font-weight-bold"
                                     :value="SubOriginatingTax"
                                     disabled></money>
                            </b-input-group>
                          </th>
                          <th width="20%">
                            <money v-model="form.model.OriginatingExtendedAmount"
                                   v-bind="moneyOptions"
                                   class="currency-money-field font-weight-bold"
                                   :value="SubOriginatingExtendedAmount"
                                   disabled
                                   style="width:100%"></money>
                          </th>
                        </tr>
                      </tfoot>
                      <slot name="caption" />
                    </table>
                  </b-col>
                </b-row>
                <hr />
                <b-row>
                  <b-col sm="2">
                    
                  </b-col>
                  <b-col sm="2" class="text-center">
                    <label ><small>ORIGINATING</small></label>
                  </b-col>  
                  <b-col sm="2" class="text-center">
                    <label ><small>FUNCTIONAL</small></label>
                  </b-col>  
                </b-row>  
                <b-row v-show="!form.isCN" hidden>
                  <b-col sm="2">
                    <label style="font-size: 12px;">SUBTOTAL AMOUNT</label>
                  </b-col>
                  <b-col sm="4">
                    <b-input-group-append style="padding-right:28px;">
                      <money v-model="form.model.SubTotalAmount1"
                             v-bind="moneyOptions"
                             class="currency-money-field"
                             disabled></money>
                      <money v-model="form.model.SubTotalAmount2"
                             v-bind="moneyOptions"
                             class="currency-money-field"
                             :value="CountTotalFuctionalAmount"
                             disabled></money>
                    </b-input-group-append>
                  </b-col>
                </b-row>
                <b-row v-show="!form.isCN" hidden>
                  <b-col sm="2">
                    <label style="font-size: 12px;">DISCOUNT AMOUNT</label>
                  </b-col>
                  <b-col sm="4">
                    <b-input-group-append :style="form.isCN ? 'padding-right:28px;' : ''">
                      <money v-model="form.model.SubDiscAmount1"
                             v-bind="moneyOptions"
                             class="currency-money-field"
                             disabled></money>
                      <money v-model="form.model.SubDiscAmount2"
                             v-bind="moneyOptions"
                             class="currency-money-field"
                             :value="CountTotalFuctionalDisc"
                             disabled></money>
                      <b-button :disabled="!actionButton.AllowEdit"
                                v-show="actionButton.AllowEdit && !form.isCN"
                                @click="openModalDetailDiscountExtended(form.model.SubTotalAmount1, 100)"
                                variant="outline-primary"
                                size="sm">
                        <font-awesome-icon :icon="['fas', 'arrow-right']"></font-awesome-icon>
                      </b-button>
                    </b-input-group-append>
                  </b-col>
                </b-row>
                <b-row v-show="!form.isCN" hidden>
                  <b-col sm="2">
                    <label style="font-size: 12px;">TAX AMOUNT</label>
                  </b-col>
                  <b-col sm="4">
                    <b-input-group-append :style="form.isCN ? 'padding-right:28px;' : ''">
                      <money v-model="form.model.SubTaxAmount1"
                             v-bind="moneyOptions"
                             class="currency-money-field"
                             disabled
                             style="width:100%"></money>
                      <money v-model="form.model.SubTaxAmount2"
                             v-bind="moneyOptions"
                             class="currency-money-field"
                             :value="CountTotalFuctionalTax"
                             disabled
                             style="width:100%"></money>
                      <b-button :disabled="!actionButton.AllowEdit"
                                v-show="actionButton.AllowEdit && !form.isCN"
                                @click="showTaxFooterExtended(form.model.SubTotalAmount1,form.model.SubDiscAmount1)"
                                variant="outline-primary"
                                size="sm">
                        <font-awesome-icon :icon="['fas', 'arrow-right']"></font-awesome-icon>
                      </b-button>
                    </b-input-group-append>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="2">
                    <label style="font-size: 12px;" class="font-weight-bold">TOTAL AMOUNT</label>
                  </b-col>
                  <b-col sm="4">
                    <b-input-group-append style="padding-right:28px;">
                      <money v-model="form.model.TotalAmount1"
                             v-bind="moneyOptions"
                             class="currency-money-field font-weight-bold"
                             :value="CountTotalAmount1"
                             disabled
                             style="width:100%"></money>
                      <money v-model="form.model.TotalAmount2"
                             v-bind="moneyOptions"
                             class="currency-money-field font-weight-bold"
                             :value="CountTotalAmountFuctional"
                             disabled
                             style="width:100%"></money>
                    </b-input-group-append>
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
              <DataGrid ref="gridMain"
                        :fields="this.$store.state.features.finance.deposit.receivable_deposit.headers"
                        :items="this.$store.state.features.finance.deposit.receivable_deposit.data"
                        :info="this.$store.state.features.finance.deposit.receivable_deposit.listInfo"
                        :baseUrl="this.$store.state.features.finance.deposit.receivable_deposit.baseUrl"
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
                        caption="Receivable for Deposit - Progress"></DataGrid>
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
                          :fields="this.$store.state.features.finance.deposit.receivable_deposit_history.headers"
                          :items="this.$store.state.features.finance.deposit.receivable_deposit_history.data"
                          :info="this.$store.state.features.finance.deposit.receivable_deposit_history.listInfo"
                          :baseUrl="this.$store.state.features.finance.deposit.receivable_deposit_history.baseUrl"
                          :actGetData="handleGet"
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
                          :isDelete = "false"
                          :isEdit = "false"
                          caption="Receivable for Deposit - History"></DataGrid>
              </b-card>
            </b-col>
          </b-row>
        </b-card-text>
      </b-tab>
    </b-tabs>

    <CurrencyModal ref="dlgCurrency" :actSelectedRow="onSelectedCurrency"></CurrencyModal>
    <PaymentTermModal ref="dlgPaymentTerm" :actSelectedRow="onSelectedPaymentTerm"></PaymentTermModal>
    <CustomerModal ref="dlgCustomer" :actSelectedRow="onSelectedCustomer"></CustomerModal>
    <ChargesDepositModal ref="dlgChargesDeposit" :actSelectedRow="onSelectedCharges"></ChargesDepositModal>
    <ScheduleModal ref="dlgSchedule" :actSelectedRow="onSelectedSchedule"></ScheduleModal>
    <ScheduleModal ref="dlgScheduleExtended" :actSelectedRow="onSelectedScheduleExtended"></ScheduleModal>
    <ExchangeRateModal ref="dlgExchangeRate" :actSelectedRow="onSelectedExchangeRate"></ExchangeRateModal>
    <DetailDiscountModal ref="dlgDetailDiscount" :actSelectedRow="onSelectedDetailDiscount"></DetailDiscountModal>
    <DetailTaxModal ref="dlgDetailTax" :actSelectedRow="onSelectedDetailTax"></DetailTaxModal>
    <DistributionJournalModal ref="dlgDistJournal"></DistributionJournalModal>
    <TaxExtentionModal ref="dlgTaxExtention" :actSelectedRow="onSelectedTaxExt"></TaxExtentionModal>
    <CustomerAddressExtensionModal ref="dlgCustomerAddressExtension" :actSelectedRow="onSelectedAddressExtension"></CustomerAddressExtensionModal>
    <NegotiationSheetModal ref="dlgNegotiationSheet" :actSelectedRow="onSelectedNegotiationSheet"></NegotiationSheetModal>

    <div id="page-dialogs">
      <b-modal v-model="isShowCustomerAddress" hide-footer size="lg">
        <template v-slot:modal-title>
          Customer Address
        </template>
        <div class="d-block text-center">
          <SelectGrid ref="gridModalCustomerAddress"
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
                      :itemsPerPage="perPage"></SelectGrid>
        </div>
      </b-modal>
    </div>

    <!-- poup Detail tax -->
    <!-- poup Detail disc end -->
    <div id="page-dialogs">
      <b-modal v-model="isCustomerAddressDetail" hide-footer size="lg">
        <template v-slot:modal-title>
          {{form.model.CustomerName}}
        </template>
        <div class="d-block text-left">
          <b-row>
            <b-col sm="12">
              <b-row>
                <b-col sm="6">
                  <label for="CustAddrName">Address Name</label>
                  <b-form-input name="CustAddrName"
                                class="font-weight-bold"
                                readonly
                                type="text"
                                v-model="form.addressDetail.AddressName"
                                size="sm"
                                aria-describedby="tab2-addr-name-feedback" />
                </b-col>
                <b-col sm="3">
                  <b-form-group>
                    <label for="ContactPerson">Contact Person</label>
                    <b-form-input name="ContactPerson"
                                  class="font-weight-bold"
                                  readonly
                                  type="text"
                                  v-model="form.addressDetail.ContactPerson"
                                  aria-describedby="tab2-contact-person-feedback"
                                  size="sm" />
                  </b-form-group>
                </b-col>
                <b-col sm="3">
                  <b-form-group>
                    <label for="Handphone">Handphone</label>
                    <b-form-input name="Handphone"
                                  class="font-weight-bold"
                                  readonly
                                  type="text"
                                  v-model="form.addressDetail.Handphone"
                                  size="sm" />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="12">
                  <b-form-group>
                    <label for="CustAddrDetail">Address</label>
                    <b-form-textarea name="CustAddrDetail"
                                     class="font-weight-bold"
                                     readonly
                                     v-model="form.addressDetail.Address"
                                     rows="3"
                                     max-rows="6"
                                     aria-describedby="tab2-addr-detail-feedback"
                                     size="sm"></b-form-textarea>
                  </b-form-group>
                </b-col>
              </b-row>

              <b-row>
                <b-col sm="4">
                  <b-form-group>
                    <label for="Phone1">
                      Phone&nbsp;
                      <b-badge pill variant="purple">1</b-badge>
                    </label>
                    <b-form-input name="Phone1"
                                  class="font-weight-bold"
                                  readonly
                                  type="text"
                                  v-model="form.addressDetail.Phone1"
                                  size="sm" />
                  </b-form-group>
                </b-col>
                <b-col sm="2">
                  <b-form-group>
                    <label for="Ext1">
                      Ext&nbsp;
                      <b-badge pill variant="purple">1</b-badge>
                    </label>
                    <b-form-input name="Ext1"
                                  class="font-weight-bold"
                                  readonly
                                  type="text"
                                  v-model="form.addressDetail.Extension1"
                                  size="sm" />
                  </b-form-group>
                </b-col>
                <b-col sm="6">
                  <b-form-group>
                    <label for="Fax">Fax</label>
                    <b-form-input name="Fax"
                                  type="text"
                                  class="font-weight-bold"
                                  readonly
                                  v-model="form.addressDetail.Fax"
                                  size="sm" />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row class="mt-3">
                <b-col sm="4">
                  <b-form-group>
                    <label for="Phone2">
                      Phone&nbsp;
                      <b-badge pill variant="purple">2</b-badge>
                    </label>
                    <b-form-input name="Phone2"
                                  class="font-weight-bold"
                                  readonly
                                  type="text"
                                  v-model="form.addressDetail.Phone2"
                                  size="sm" />
                  </b-form-group>
                </b-col>
                <b-col sm="2">
                  <b-form-group>
                    <label for="Ext2">
                      Ext&nbsp;
                      <b-badge pill variant="purple">2</b-badge>
                    </label>
                    <b-form-input name="Ext2"
                                  class="font-weight-bold"
                                  readonly
                                  type="text"
                                  v-model="form.addressDetail.Extension2"
                                  size="sm" />
                  </b-form-group>
                </b-col>
                <b-col sm="6">
                  <b-form-group>
                    <label for="Email">Email</label>
                    <b-form-input name="Email"
                                  class="font-weight-bold"
                                  readonly
                                  type="text"
                                  v-model="form.addressDetail.EmailAddress"
                                  size="sm"
                                  aria-describedby="tab2-email-feedback" />
                  </b-form-group>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </div>
      </b-modal>
    </div>
    <b-modal id="modal-void-reason"
             ref="modal-void"
             title="Please type your reason to VOID "
             @show="resetModal"
             @hidden="resetModal"
             @ok="handleOk"
             @cancel="handleCancel">
      <form ref="formvoid" @submit.stop.prevent="handleVoid">
        <b-row>
          <b-col sm="6">
            <label>Void Date</label>

            <b-input-group>
              <b-form-input v-model="form.display.VoidDate"
                            type="text"
                            :placeholder="dateFormatString"
                            class="text-center"
                            size="sm"
                            readonly
                            aria-describedby="doc-date-feedback"></b-form-input>
              <b-input-group-append v-if="actionButton.AllowVoid && (form.model.TransactionDate != maxVoidCalendarDate)">
                <b-form-datepicker v-model="form.model.VoidDate"
                                   button-only
                                   size="sm"
                                   left
                                   @input="dateChangedVoid"
                                   :min="form.model.TransactionDate"
                                   :max="maxVoidCalendarDate"
                                   dark></b-form-datepicker>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col>
            <b-form-group :state="voidState"
                          label="Reason"
                          label-for="name-input"
                          invalid-feedback="Reason must not empty">
              <b-form-input id="name-input" v-model="form.VoidReason" :state="voidState" required></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </form>
    </b-modal>
  <!--PrintOut-->
    <ReceivablePrint ref="PrintReceivable" :data="dataPrint" :print="isPrint"></ReceivablePrint>
  <!--EndPrintOut-->
  </div>
</template>

<script>
  import DataGrid from "@/components/Tables/DataGrid";
  import SelectGrid from "@/components/tables/SelectGrid";
  import VueElementLoading from "vue-element-loading";
  import cloneDeep from "lodash.cloneDeep";
  import {
    CurrencyModal,
    PaymentTermModal,
    CustomerModal,
    ChargesDepositModal,
    ScheduleModal,
    ExchangeRateModal,
    DetailDiscountModal,
    DetailTaxModal,
    DistributionJournalModal,
    CustomerAddressExtensionModal,
    TaxExtentionModal,
    NegotiationSheetModal
  } from "@/pages/modal/index.js";
  import { mask } from "vue-the-mask";
  import moment from "moment";
  import util from "@/helper/utils";
  import { ReceivablePrint } from "@/pages/print/index.js";
  import loginServices from '../../services/loginservices'

  export default {
    name: "Deposit",
    layout: "dashboard",
    components: {
      DataGrid,
      SelectGrid,
      VueElementLoading,
      CurrencyModal,
      PaymentTermModal,
      CustomerModal,
      ChargesDepositModal,
      ScheduleModal,
      ExchangeRateModal,
      DetailDiscountModal,
      DetailTaxModal,
      DistributionJournalModal,
      TaxExtentionModal,
      CustomerAddressExtensionModal,
      ReceivablePrint,
      NegotiationSheetModal
    },
    directives: {
      mask
    },
    data() {
      return {
        listDocumentType : [],
        isPrint: false,
        dataPrint: [],
        Company: [],
        CompanyAddress: [],
        VoidReason: "",
        voidState: null,
        actionButton: {
          AllowSave: true,
          AllowEdit: true,
          AllowPosting: false,
          AllowVoid: false
        },
        minCalendarDate: moment().format("YYYY-01-01"),
        dtlindex: 0,
        ChargesName: "",
        dataDetails: [],
        dateFormatString: "DD/MM/YYYY",
        isTabMain: true,
        formCaption: "Deposit",
        caption: "Deposit",
        blockLoader: false,
        isForm: false, //FORM IN TAB CUSTOMER
        isFormAddress: false, //FORM IN TAB ADDRESS
        isShowCustomerGroup: false,
        isShowCustomerAddress: false,
        isCustomerAddressDetail: false,
        isTaxDetail: false,
        itemHistory: [],
        HistoryInfo: [],
        listTransactionType: [],
        ReceivableSetups: [],
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
        moneypercent: {
          decimal: "",
          thousands: "",
          prefix: "",
          suffix: "",
          decimalLength: 0,
          masked: false,
          allowBlank: true,
          precision: 0,
          min: 0,
          mxn: 100
          //max: Number.MAX_SAFE_INTEGER
        },
        itemCities: Array(),
        perPage: 10,
        form: {
          valid: false,
          isEdit: false,
          isCN: false,
          CurrencySymbol: "",
          defaultRateType: 0,
          FunctionalCurrency: "",
          CustomerAddressActiveField: "",
          CustomerAddressReffField: "",
          RateTypeExtention: {
            CurrencyCode: "",
            TypeRate: "",
            RateAmount: 0
          },
          addressDetail: {
            CustomerName: null,
            AddressCode: "",
            AddressName: "",
            ContactPerson: "",
            Address: "",
            Handphone: "",
            Phone1: "",
            Extension1: "",
            Phone2: "",
            Extension2: "",
            Fax: "",
            EmailAddress: ""
          },
          TaxDetail: {
            TaxBasedAmount: false,
            BasedAmount: 0,
            TaxScheduleId: "",
            TaxScheduleCode: "",
            PercentageTaxBased: 0,
            TaxablePercentTax: 0,
            OriginatingTaxAmount: 0,
            TaxCharges: 0
          },
          TaxExtention: {
            TaxBasedAmount: false,
            BasedAmount: 0,
            DiscAmount: 0,
            Amount: 0,
            TaxScheduleCode: "",
            Description: "",
            PercentageTaxBased: 0,
            TaxablePercentTax: 0,
            OriginatingTaxAmount: 0,
            TaxCharges: 0,
            TotalTaxAmount: 0,
            TotalTaxFuctionalAmount: 0
          },
          model: {
            ReceiveTransactionId: "",
            DocumentType: "",
            DocFeatureId : 0,
            DocumentNo: "",
            TransactionDate: moment().format("YYYY-MM-DD"),
            TransactionType: "",
            CurrencyCode: "",
            ExchangeRate: "",
            PaymentTermCode: "",
            CustomerId: "",
            CustomerCode: "",
            RateAmount: 0,
            IsMultiply: true,
            ChargesCode: "",
            CustomerName: "",
            AddressCode: "",
            BillToAddressCode: "",
            ShipToAddressCode: "",
            SoDocumentNo: "",
            NsDocumentNo: "",
            MasterNo: "",
            AgreementNo: "",
            Description: "",
            SubtotalAmount: "",
            DiscountAmount: "",
            TaxAmount: 0,
            Status: 1,
            StatusComment: "",
            ReceivableDetails: [],
            ReceivableTaxes: [],
            VoidDate: moment().format("YYYY-MM-DD"),
            SubTotalAmount1: 0,
            SubTotalAmount2: 0,
            SubDiscAmount1: 0,
            SubDiscAmount2: 0,
            SubTaxAmount1: 0,
            SubTaxAmount2: 0,
            TotalAmount1: 0,
            TotalAmount2: 0
          },
          detail: {
            Index: "",
            ChargesId: "",
            ChargesCode: "",
            ChargesName: "",
            TransactionType: "",
            ScheduleId: "",
            ScheduleCode: "",
            OriginatingAmount: 0,
            OriginatingDiscount: 0,
            OriginatingTax: 0,
            OriginatingExtendedAmount: 0,
            Description: "",
            IsTaxAfterDiscount: false,
            PercentDiscount: 0,
            TaxablePercentTax: 0,
            IsDeleted : false,
          },
          display: {
            DocumentDate: moment().format(this.dateFormatString),
            CurrencySymbol: "",
            OriginatingDebitAmount: 0,
            OriginatingCreditAmount: 0,
            FunctionalDebitAmount: 0,
            FunctionalCreditAmount: 0,
            DocumentStatus: "",
            CreatedByName: "",
            CreatedDate: "",
            StatusComment: "",
            VoidName: "",
            VoidDate: ""
          }
        }
      };
    },
    watch: {
      "form.model.DocumentType"(newVal) {
        if (this.form.model.DocumentType == "CREDIT NOTE") {
          this.form.isCN = true;
        } else {
          this.form.isCN = false;
        }

        let sel = this.listDocumentType.filter(el => el.Value == newVal);
        if(sel[0] != undefined){
          this.form.model.DocFeatureId = sel[0].DocFeatureId;
        }else{
          this.form.model.DocFeatureId = 0;
        }         
      }
    },
    async mounted() {
      let minimumInputDate = await this.$store.dispatch(
        "features/finance/constants/actGetMinInputDateSales"
      );

      if (minimumInputDate != undefined)
        this.minCalendarDate = moment(minimumInputDate).format("YYYY-MM-DD");

      await this.$store.dispatch(
        "features/company/financial_setup/actGet",
        "FinancialSetup?"
      );

      await this.$store.dispatch(
        "features/company/receivable_setup/actGet",
        "ReceivableSetup?"
      );

      await this.$store.dispatch(
        "features/finance/deposit/receivable_deposit/actGetData",
        "GetProgressDeposit?"
      );
      await this.$store.dispatch(
        "features/finance/deposit/receivable_deposit_history/actGetData",
        "GetHistoryDeposit?"
      );

      await this.$store.dispatch(
        "features/company/customer_address/actGetDataCustomer",
        "CustomerAddress?"
      );

      if (this.$refs.gridMain != null) {
        await this.$refs.gridMain.doRefresh();
      }
      
      await this.initDefaultForm();
    },
    methods: {
       async handlePrintOut(){
        this.showLoader(true);
        this.isPrint = true;
        var PrintReceivable = await this.$refs.PrintReceivable.exportToPDF()
        if(PrintReceivable.status == true){
          this.showLoader(PrintReceivable.loader)
          this.isPrint = PrintReceivable.print;
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
      async dateChangedVoid() {
        this.form.display.VoidDate = "";
        if (this.form.model.VoidDate != null)
          this.form.display.VoidDate = moment(this.form.model.VoidDate).format(
            "YYYY-MM-DD"
          );

        await this.changeCurrentExchangeRate();
      },
      async dateChanged() {
        this.form.display.DocumentDate = "";
        if (this.form.model.TransactionDate != null) this.form.display.DocumentDate = moment(this.form.model.TransactionDate).format(this.dateFormatString);
      },
      async onDocumentTypeChange(){
        this.form.model.TransactionType = '';
        this.resetDetail();
        this.dataDetails = [];
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
      async handleGetCustomerAddress(url) {
        await this.doFindCustomerAddresses(url);
      },

      async handleGet(url) {
        if (url == undefined) {
          url = this.$store.state.features.finance.deposit.receivable_deposit_history
            .baseUrl;
        }
        if (url.toLowerCase().lastIndexOf("GetHistoryDeposit") < 0) {
          url = "GetHistoryDeposit?" + url;
        }
        await this.$store.dispatch(
          "features/finance/deposit/receivable_deposit_history/actGetData",
          url
        );
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async handleGetProgress(url) {
        await this.$store.dispatch(
          "features/finance/deposit/receivable_deposit/actGetData",
          url
        );
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async History() {
        this.itemHistory = this.$store.state.features.finance.deposit.receivable_deposit_history.data;
        this.HistoryInfo = this.$store.state.features.finance.deposit.receivable_deposit_history.listInfo;
      },
      async onSelectedCurrency(item, modelReff) {
        this.form.model[modelReff] = item.CurrencyCode;

        if (item.DecimalPlaces != undefined)
          this.moneyOptions.precision = item.DecimalPlaces;
        this.form.display.CurrencySymbol = item.Symbol;

        if (item.CurrencyCode != this.form.FunctionalCurrency) {
          await this.changeCurrentExchangeRate();
        } else {
          this.form.model.RateAmount = 1;
          this.form.model.IsMultiply = true;
        }
      },

      async changeCurrentExchangeRate() {
        this.form.model.RateAmount = 1;

        //OBTAIN DEFAULT EXCHANGE RATE AMOUNT
        if (this.form.model.CurrencyCode != "") {
          await this.$store.dispatch(
            "features/company/exchange_rate_header/actGetCurrentExchangeRate",
            "GetCurrentExchangeRate?CurrencyCode=" +
            this.form.model.CurrencyCode +
            "&TransactionDate=" +
            this.form.model.TransactionDate +
            "&RateType=" +
            this.form.defaultRateType
          );

          this.form.model.RateAmount = this.$store.state.features.company.exchange_rate_header.dataExcRate;
          this.form.model.IsMultiply = this.$store.state.features.company.exchange_rate_header.dataExcIsMultiply;
        }
      },
      async onSelectedPaymentTerm(item, modelReff) {
        this.form.model[modelReff] = item.PaymentTermCode;
      },
      async onSelectedCustomer(item, modelReff) {
        this.form.model.CustomerId = item.CustomerId;
        this.form.model.CustomerName = item.CustomerName;
        this.form.model[modelReff] = item.CustomerCode;
        this.form.model.AddressCode = item.AddressCode;
        this.form.model.BillToAddressCode = item.BillToAddressCode;
        this.form.model.ShipToAddressCode = item.ShipToAddressCode;
        //customerdetail
      },
      async CustomerAddressDetail(detail) {
        this.from.addressDetail.CustomerName = detail.CustomerName;
        this.from.addressDetail.AddressName = detail.AddressName;
        this.from.addressDetail.ContactPerson = detail.ContactPerson;
        this.from.addressDetail.Address = detail.Address;
        this.from.addressDetail.Handphone = detail.Handphone;
        this.from.addressDetail.Phone1 = detail.Phone1;
        this.from.addressDetail.Extension1 = detail.Extension1;
        this.from.addressDetail.Phone2 = detail.Phone2;
        this.from.addressDetail.Extension2 = detail.Extension2;
        this.from.addressDetail.Fax = detail.Fax;
        this.from.addressDetail.EmailAddress = detail.EmailAddress;
      },
      async handleSelectCustomerAddress(row) {
        this.form.model[this.form.CustomerAddressActiveField] = row.AddressCode;
        if (this.form.CustomerAddressActiveField == "AddressCode") {
          await this.setMainAddress();
        }

        this.form.CustomerAddressActiveField = "";
        this.form.CustomerAddressReffField = "";

        this.isShowCustomerAddress = false;
      },
      async onSelectedCharges(item, modelReff) {
          this.form.detail.ChargesId = item.ChargesId;
          this.form.detail[modelReff] = item.ChargesCode;
          this.form.detail.ChargesName = item.ChargesName;
          this.form.detail.TransactionType = item.TransactionType;
          this.form.detail.ScheduleId = "00000000-0000-0000-0000-000000000000";
          this.form.detail.ScheduleCode = item.TaxScheduleCode;
          this.form.detail.OriginatingAmount = 0;
          this.form.detail.OriginatingDiscount = 0;
          this.form.detail.OriginatingTax = 0;
          this.form.detail.OriginatingExtendedAmount = 0;
          this.form.detail.FunctionalTax = 0;
          this.form.detail.FunctionalDiscount = 0;
          this.form.detail.FunctionalExtendedAmount = 0;
          this.form.detail.Description = "";
          this.form.detail.IsTaxAfterDiscount = false;
          this.form.detail.PercentDiscount = 0;
          this.form.detail.TaxablePercentTax = 0;
          this.form.detail.IsDeleted = false;

        var defaultTaxScheduleCode = item.TaxScheduleCode;

        //SET TAX FOR NON-CN
        if (!this.form.isCN) {
          if (defaultTaxScheduleCode != "") {
            await this.$store.dispatch(
              "features/company/tax_schedule/actGetTaxSchedule",
              "TaxSchedule?&TaxScheduleCode=" + defaultTaxScheduleCode
            );

            var row = this.$store.state.features.company.tax_schedule.data;
            
            if (row != undefined && Array.isArray(row)) {
              if (row[0] != undefined) {
                this.form.detail.ScheduleId = row[0].TaxScheduleId;
                this.form.detail.ScheduleCode = row[0].TaxScheduleCode;
                this.form.detail.IsTaxAfterDiscount = row[0].TaxBasedAmount;
                this.form.detail.PercentDiscount = row[0].PercentOfSalesPurchase;
                this.form.detail.TaxablePercentTax = row[0].TaxablePercent;
              }
            }
          }
        }
      },
      async onSelectedSchedule(row) {
        this.form.TaxDetail.TaxScheduleCode = row.TaxScheduleCode;
        this.form.TaxDetail.PercentageTaxBased = row.PercentOfSalesPurchase;
        this.form.TaxDetail.TaxablePercentTax = row.TaxablePercent;
        this.form.TaxDetail.Description = row.Description;
        this.form.TaxDetail.TaxScheduleId = row.TaxScheduleId;
        // ((% of based tax amount)/100 x (before discount/after discount)) x (taxable percent/100)
        this.form.TaxDetail.OriginatingTaxAmount =
          (row.PercentOfSalesPurchase / 100) *
          this.form.TaxDetail.BasedAmount *
          (row.TaxablePercent / 100);
      },
      async onSelectedScheduleExtended(row) {
        this.form.TaxExtention.TaxScheduleCode = row.TaxScheduleCode;
        this.form.TaxExtention.PercentageTaxBased = row.PercentOfSalesPurchase;
        this.form.TaxExtention.TaxablePercentTax = row.TaxablePercent;
        this.form.TaxExtention.Description = row.Description;
      },
      async onSelectedRateType(item, modelReff) {
        this.form.model[modelReff] = item.RateType;
      },
      async onFormClose() {
        this.ErrorMessage = "";
        this.isForm = false;
        this.form.isEdit = false;

        this.resetForm();
      },
      async onSelectedTaxExt(row) {
        this.form.model.ReceivableTaxes = row.TaxDetails;

        this.form.model.SubTaxAmount1 = row.OriginatingTotalTax;
        this.form.model.SubTaxAmount2 = row.FunctionalTotalTax;
      },
      resetForm() {
        this.form.model.ReceiveTransactionId =
          "00000000-0000-0000-0000-000000000000";
        this.form.model.TransactionDate = moment().format("YYYY-MM-DD");
        this.form.display.DocumentDate = moment().format(this.dateFormatString);
        this.form.model.TransactionType = "";
        (this.form.model.DocumentType = ""),
          (this.form.model.DocumentNo = ""),
          (this.form.model.CurrencyCode = ""),
          (this.form.model.RateAmount = 1),
          (this.form.model.PaymentTermCode = ""),
          (this.form.model.CustomerId = ""),
          (this.form.model.CustomerCode = ""),
          (this.form.model.AddressCode = ""),
          (this.form.model.ChargesCode = ""),
          (this.form.model.CustomerName = ""),
          (this.form.model.BillToAddressCode = ""),
          (this.form.model.ShipToAddressCode = ""),
          (this.form.model.SoDocumentNo = ""),
          (this.form.model.NsDocumentNo = ""),
          (this.form.model.MasterNo = ""),
          (this.form.model.AgreementNo = ""),
          (this.form.model.Description = ""),
          (this.form.model.SubtotalAmount = 0),
          (this.form.model.DiscountAmount = 0),
          (this.form.model.TaxAmount = 0),
          (this.form.model.Status = 1),
          (this.form.model.StatusComment = ""),
          (this.form.model.ReceivableDetails = []),
          (this.form.model.ReceivableTaxes = []),
          (this.dataDetails = []),
          (this.form.display.CreatedName = "");
        this.form.display.CreatedDate = "";
        this.form.display.VoidName = "";
        this.form.display.VoidDate = "";
        this.form.display.StatusComment = "";
        this.moneyOptions.precision = 0;

        this.actionButton.AllowSave = true;
        this.actionButton.AllowEdit = true;
        this.actionButton.AllowPosting = false;
        this.actionButton.AllowVoid = false;

        this.resetDetail();

        this.$nextTick(() => {
          this.$refs.observer.reset();
        });
      },
      async resetDetail(){
          this.form.detail.ChargesId = "";
          this.form.detail.ChargesCode = "";
          this.form.detail.ChargesName = "";
          this.form.detail.TransactionType = "";
          this.form.detail.ScheduleId = "";
          this.form.detail.ScheduleCode = "";
          this.form.detail.OriginatingAmount = "";
          this.form.detail.OriginatingDiscount = "";
          this.form.detail.OriginatingTax = "";
          this.form.detail.OriginatingExtendedAmount = "";
          this.form.detail.FunctionalTax = "";
          this.form.detail.FunctionalDiscount = "";
          this.form.detail.FunctionalExtendedAmount = "";
          this.form.detail.Description = "";
          this.form.detail.IsTaxAfterDiscount = "";
          this.form.detail.PercentDiscount = "";
          this.form.detail.TaxablePercentTax = "";
          this.form.model.NsDocumentNo = "";
          this.form.model.MasterNo = "";
          this.form.model.AgreementNo = "";
      },

      async onFormCreate() {
        this.resetForm();
        this.form.isEdit = false;
        this.isForm = true;
      },
      async showTaxFooterExtended(total, discount) {
        this.$refs.dlgTaxExtention
          .open(
            this.form.model.ReceivableTaxes,
            total,
            discount,
            this.form.model.RateAmount,
            this.form.model.IsMultiply,
            this.moneyOptions,
            false
          )
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async initDefaultForm() {
        this.ReceivableSetups = cloneDeep(this.$store.state.features.company.receivable_setup
          .data);

        var financialSetup = this.$store.state.features.company.financial_setup
          .data;

        if (Array.isArray(financialSetup) && financialSetup.length) {
          financialSetup = financialSetup[0];
          this.form.FunctionalCurrency = financialSetup.FuncCurrencyCode;
          this.form.model.RateAmount = 1;
        }

        //BEGIN DOCUMENT TYPE & TRANSACTION TYPE
        let trxModule = this.$store.state.features.finance.deposit.receivable_deposit.TrxModule;

        let data = await this.$store.dispatch("features/finance/document_type/actGetByDocSetup", trxModule);

        if (data != undefined) {
          this.listDocumentType = data.DocumentTypes;
          this.listTransactionType = data.TransactionTypes;
        }
        //END DOCUMENT TYPE & TRANSACTION TYPE
      },
      async onChangeTransactionType(){
        let trxType = this.form.model.TransactionType;
        let found = this.ReceivableSetups.filter(function(item) {
          return item['TransactionType'] == trxType;
        });
        if (found.length > 0) {
          this.form.defaultRateType = found[0].DefaultRateType;
        }

        this.resetDetail();
        this.dataDetails = [];

      },
      async handleEdit(row) {
        var arr = [];

        (this.form.model.ReceiveTransactionId = row.ReceiveTransactionId),
          (this.form.model.DocumentType = row.DocumentType),
          (this.form.model.DocumentNo = row.DocumentNo),
          (this.form.model.TransactionDate = moment(row.TransactionDate).format(
            "YYYY-MM-DD"
          ));
        this.form.display.DocumentDate = moment(
          this.form.model.TransactionDate
        ).format(this.dateFormatString);
        (this.form.model.TransactionType = row.TransactionType),
          (this.form.model.CurrencyCode = row.CurrencyCode),
          (this.form.model.RateAmount = row.ExchangeRate),
          (this.form.model.PaymentTermCode = row.PaymentTermCode),
          (this.form.model.CustomerId = row.CustomerId),
          (this.form.model.CustomerCode = row.CustomerCode),
          (this.form.model.AddressCode = row.CustomerAddressCode),
          (this.form.model.ChargesCode = row.ChargesCode),
          (this.form.model.CustomerName = row.CustomerName),
          (this.form.model.BillToAddressCode = row.BillToAddressCode),
          (this.form.model.ShipToAddressCode = row.ShipToAddressCode),
          (this.form.model.SoDocumentNo = row.SoDocumentNo),
          (this.form.model.NsDocumentNo = row.NsDocumentNo),
          (this.form.model.MasterNo = row.MasterNo),
          (this.form.model.AgreementNo = row.AgreementNo),
          (this.form.model.Description = row.Description),
          (this.form.model.SubtotalAmount = row.SubtotalAmount),
          (this.form.model.DiscountAmount = row.DiscountAmount),
          (this.form.model.TaxAmount = row.TaxAmount),
          (this.form.model.Status = row.Status),
          (this.form.model.StatusComment = row.StatusComment),
          (this.form.model.SubDiscAmount1 = row.DiscountAmount),
          (this.form.model.SubTaxAmount1 = row.TaxAmount);

        (this.form.model.ReceivableTaxes = row.ReceiveTransactionTaxes),
          (this.form.display.DocumentStatus = row.Status);

        this.form.display.VoidName = row.VoidByName;
        this.form.display.VoidDate =
          row.VoidDate != undefined
            ? moment(row.VoidDate).format(this.dateFormatString + " HH:mm:ss")
            : moment(Date.now()).format(this.dateFormatString);

        this.form.display.CreatedByName = row.CreatedByName;
        this.form.display.CreatedDate = moment(row.CreatedDate).format(
          this.dateFormatString + " HH:mm:ss"
        );

        row.ReceiveTransactionDetails.forEach(function (d) {
          arr.push({
            ChargesId: d.ChargesId,
            ChargesCode: d.ChargesCode,
            ChargesName: d.ChargesName,
            Description: d.ChargesDescription,
            OriginatingAmount: d.OriginatingAmount,
            OriginatingDiscount: d.OriginatingDiscount,
            OriginatingExtendedAmount: d.OriginatingExtendedAmount,
            OriginatingTax: d.OriginatingTax,
            FunctionalTax: d.OriginatingTax * row.ExchangeRate,
            FunctionalDiscount: d.OriginatingDiscount * row.ExchangeRate,
            FunctionalExtendedAmount: d.OriginatingExtendedAmount * row.ExchangeRate,
            Status: d.Status,
            ScheduleId: d.TaxScheduleId,
            ScheduleCode : d.TaxScheduleCode,
            IsTaxAfterDiscount: d.IsTaxAfterDiscount == 0 ? false : true,
            PercentDiscount: d.PercentDiscount,
            TaxablePercentTax: d.TaxablePercentTax != undefined ? d.TaxablePercentTax : 0,
            IsDeleted : false,
          });
        });
        
        this.dataDetails = arr[0];

          this.form.detail.ChargesId = arr[0].ChargesId;
          this.form.detail.ChargesCode = arr[0].ChargesCode;
          this.form.detail.ChargesName = arr[0].ChargesName;
          this.form.detail.TransactionType = arr[0].TransactionType;
          this.form.detail.ScheduleId = arr[0].ScheduleId;
          this.form.detail.ScheduleCode = arr[0].ScheduleCode;
          this.form.detail.OriginatingAmount = arr[0].OriginatingAmount;
          this.form.detail.OriginatingDiscount = arr[0].OriginatingDiscount;
          this.form.detail.OriginatingTax = arr[0].OriginatingTax;
          this.form.detail.OriginatingExtendedAmount = arr[0].OriginatingExtendedAmount;
          this.form.detail.FunctionalTax = arr[0].FunctionalTax;
          this.form.detail.FunctionalDiscount = arr[0].FunctionalDiscount;
          this.form.detail.FunctionalExtendedAmount = arr[0].FunctionalExtendedAmount;
          this.form.detail.Description = arr[0].Description;
          this.form.detail.IsTaxAfterDiscount = arr[0].IsTaxAfterDiscount;
          this.form.detail.PercentDiscount = arr[0].PercentDiscount;
          this.form.detail.TaxablePercentTax = arr[0].TaxablePercentTax;

        if (
          this.form.model.ReceiveTransactionId != "" &&
          this.form.model.DocumentNo != ""
        ) {
          if (this.form.model.Status == "New") {
            this.actionButton.AllowEdit = true;
            this.actionButton.AllowSave = true;
            this.actionButton.AllowPosting = true;
            this.actionButton.AllowVoid = false;
          } else if (this.form.model.Status == "Posted") {
            this.actionButton.AllowVoid = true;
            this.actionButton.AllowSave = false;
            this.actionButton.AllowEdit = false;
            this.actionButton.AllowPosting = false;
          } else {
            this.actionButton.AllowVoid = false;
            this.actionButton.AllowSave = false;
            this.actionButton.AllowEdit = false;
            this.actionButton.AllowPosting = false;
          }
        } else {
          this.actionButton.AllowSave = true;
          this.actionButton.AllowEdit = true;
          this.actionButton.AllowPosting = false;
          this.actionButton.AllowVoid = false;
        }

        var model = {
          ReceiveTransactionId : this.form.model.ReceiveTransactionId,
          CompanyId : this.$store.state.companyId
        }
        await this.$store.dispatch("features/finance/deposit/receivable_deposit/actGetDataPrint", model);
        this.dataPrint = this.$store.state.features.finance.deposit.receivable_deposit.resultDataPrint

        this.isForm = true;
        this.form.isEdit = true;
      },
      async setMainAddress() {
        var response = await this.$store.dispatch(
          "features/company/customer_address/actGetDataCustomer",
          this.form.model
        );
        if (response.status == 200) {
          if (response.data.CustomerAddresses.length > 0) {
            var data = response.data.CustomerAddresses[0];
            this.form.display.AddressName = data.AddressName;
            this.form.display.ContactPerson = data.ContactPerson;
            this.form.display.Address = data.Address;
            this.form.display.Handphone = data.Handphone;
            this.form.display.Phone1 = data.Phone1;
            this.form.display.Extension1 = data.Extension1;
            this.form.display.Phone2 = data.Phone2;
            this.form.display.Extension2 = data.Extension2;
            this.form.display.Fax = data.Fax;
            this.form.display.EmailAddress = data.EmailAddress;
            this.form.display.HomePage = data.HomePage;
            this.form.display.Neighbourhood = data.Neighbourhood;
            this.form.display.Hamlet = data.Hamlet;
            this.form.display.UrbanVillage = data.UrbanVillage;
            this.form.display.SubDistrict = data.SubDistrict;
            this.form.display.CityCode = data.CityCode;
            this.form.display.PostCode = data.PostCode;
            this.form.display.Province = data.Province;
            this.form.display.CountryName = data.CountryName;
          }
        }
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
      async onSelectedCOA(item, modelReff) {
        this.form.model[modelReff] = item.AccountId;
      },
      async onModalSearchPaymentTerm(row) {
        this.$refs.dlgPaymentTerm
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

      async onModalSearchCustomerAddress(reff, active) {
        await this.doFindCustomerAddresses();
        this.form.CustomerAddressReffField = this.form.model[reff];
        this.form.CustomerAddressActiveField = active;
        this.isShowCustomerAddress = true;
      },
      async onSelectedAddressExtension(item, modelReff){
        this.form.model.AddressCode = item.AddressCode;
        this.form.model.BillToAddressCode = item.BillToAddressCode;
        this.form.model.ShipToAddressCode = item.ShipToAddressCode;
      },

      async onModalSearchNegotiationSheet(row) {
        this.$refs.dlgNegotiationSheet
          .open(row, 
          this.form.model[row], 
          this.form.model.TransactionType)
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onSelectedNegotiationSheet(item, modelReff) {
        this.form.model[modelReff] = item.DocumentNo;
        this.form.model.MasterNo = item.MasterNo;
        this.form.model.AgreementNo = item.AgreementNo;
      },
      

      async onModalCustomerAddressDetail(addressCode, type) {
        var url =
          "CustomerAddress?" +
          "&CustomerId=" +
          this.form.model.CustomerId +
          "&Inactive=false" +
          "&AddressCode=" +
          addressCode;
        //CustomerAddressDetail
        await this.$store.dispatch(
          "features/company/customer_address/actGetData",
          url
        );
        var data = this.$store.state.features.company.customer_address.data;

        if (data.length > 0) {
          var detail = data[0];
          this.form.addressDetail.CustomerName = detail.CustomerName;
          this.form.addressDetail.AddressName = detail.AddressName;
          this.form.addressDetail.ContactPerson = detail.ContactPerson;
          this.form.addressDetail.Address = detail.Address;
          this.form.addressDetail.Handphone = detail.Handphone;
          this.form.addressDetail.Phone1 = detail.Phone1;
          this.form.addressDetail.Extension1 = detail.Extension1;
          this.form.addressDetail.Phone2 = detail.Phone2;
          this.form.addressDetail.Extension2 = detail.Extension2;
          this.form.addressDetail.Fax = detail.Fax;
          this.form.addressDetail.EmailAddress = detail.EmailAddress;
        }

        this.isCustomerAddressDetail = true;
      },
      async doFindCustomerAddresses(url) {
        if (url == undefined) {
          url = this.$store.state.features.company.customer_address.baseUrl;
        }

        if (url.toLowerCase().lastIndexOf("customerid") < 0) {
          url =
            url + "&CustomerId=" + this.form.model.CustomerId + "&Inactive=false";
        } else {
          var clean_uri = url
            .toLowerCase()
            .substring(0, url.indexOf("&customerid"));
          url =
            clean_uri +
            "&CustomerId=" +
            this.form.model.CustomerId +
            "&Inactive=false";
        }

        if (url.toLowerCase().lastIndexOf("customeraddress") < 0) {
          url = "customeraddress?" + url;
        }

        await this.$store.dispatch(
          "features/company/customer_address/actGetData",
          url
        );
      },
      async doDelete(row) {
        this.showLoader(true);

        await this.$store.dispatch(
          "features/finance/deposit/receivable_deposit/actPutTrxDelete",
          row
        );

        var response = this.$store.state.features.finance.deposit
          .receivable_deposit.resultTrxDelete;
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
        let valid = true;

        if(this.form.model.SubTotalAmount1 < 1 || this.form.model.SubTotalAmount2 < 1){
          valid = false;
          this.handleToast(
            "Warning",
            "danger",
            "Originating Subtotal must LARGER than 0 (zero) !"
          );
        }

        let validAmount = true;
        let validExtendedAmount = true;
        
          if (this.form.detail.OriginatingAmount <= 0) {
            validAmount = false;
          }

          if (this.form.detail.OriginatingExtendedAmount <= 0) {
            validExtendedAmount = false;
          }

        if (!validAmount){
          valid = false;
          this.handleToast(
            "Warning",
            "danger",
            "Originating Amount in Detail data must LARGER than 0 (zero) !"
          );
        }
        
        if (!validExtendedAmount){
          valid = false;
          this.handleToast(
            "Warning",
            "danger",
            "Originating Extended Amount in Detail must LARGER than 0 (zero) !"
          );
        }

        return valid;
      },
      async onSubmit() {
        if (this.validateForm()) {
          this.showLoader(true);
          var RateAmount = this.form.model.RateAmount;
          var arrDetail = [];

          let isMultiply = this.form.model.IsMultiply;

              arrDetail.push({
                ChargesId: this.form.detail.ChargesId,
                ChargesDescription: this.form.detail.Description,
                OriginatingAmount: this.form.detail.OriginatingAmount,
                OriginatingTax: this.form.detail.OriginatingTax,
                OriginatingDiscount: this.form.detail.OriginatingDiscount,
                OriginatingExtendedAmount: this.form.detail.OriginatingExtendedAmount,
                FunctionalTax: isMultiply ? (this.form.detail.OriginatingTax * RateAmount) : (this.form.detail.OriginatingTax / RateAmount),
                FunctionalDiscount: isMultiply ? (this.form.detail.OriginatingDiscount * RateAmount) : (this.form.detail.OriginatingDiscount / RateAmount),
                FunctionalExtendedAmount: isMultiply ? (this.form.detail.OriginatingExtendedAmount * RateAmount) : (this.form.detail.OriginatingExtendedAmount / RateAmount),
                Status: 1,
                TaxScheduleId: this.form.detail.ScheduleId,
                IsTaxAfterDiscount: this.form.detail.IsTaxAfterDiscount == 0 ? false : true,
                PercentDiscount: this.form.detail.PercentDiscount
              });      

          this.form.model.ReceivableDetails = arrDetail;

          if (this.form.isEdit) {
            await this.$store.dispatch(
              "features/finance/deposit/receivable_deposit/actUpdate",
              this.form.model
            );
            var response = this.$store.state.features.finance.deposit
              .receivable_deposit.resultUpdate;
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
              this.$refs.gridHistory.doRefresh();
              this.resetForm();

              this.handleToast("Confirmation", "success", "Successfully updated");
            }
          } else {
            await this.$store.dispatch(
              "features/finance/deposit/receivable_deposit/actCreate",
              this.form.model
            );

            var response = this.$store.state.features.finance.deposit
              .receivable_deposit.resultCreate;

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
              this.$refs.gridHistory.doRefresh();
              this.resetForm();

              this.handleToast("Confirmation", "success", "Successfully saved");
            }
          }

          this.showLoader(false);
        }
      },
      async onModalSearchCurrency(row) {
        this.$refs.dlgCurrency
          .open(row, this.form.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onModalSheduleCode(row) {
        this.$refs.dlgSchedule
          .open(row, this.form.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onSelectedExchangeRate(item) {
        if (item != undefined) {
          this.form.model.RateAmount = item.ExchangeRateAmount;

          this.form.model.IsMultiply = item.CalcIsMultiply;
        }
      },
      async onSelectedDetailDiscount(row, index) {
        if (index == 100) {
          this.form.model.SubDiscAmount1 = row.dtlDiscountAmount;
          this.form.model.SubDiscAmount2 = row.dtlFuctDiscountAmount;
        } else {
          this.form.detail.OriginatingDiscount = row.dtlDiscountAmount;
        }
      },

      async onSelectedDetailTax(row) {
        if (row != undefined) {       
            this.form.detail.ScheduleCode = row.TaxScheduleCode;
            this.form.detail.IsTaxAfterDiscount = row.TaxBasedAmount;
            this.form.detail.PercentDiscount = row.PercentageTaxBased;
            this.form.detail.BasedAmount = row.BasedAmount;
            this.form.detail.TaxablePercentTax = row.TaxablePercentTax;
            this.form.detail.OriginatingTax = row.OriginatingTaxAmount;
            if (row.OriginatingTaxAmount > 0) {
              this.form.detail.ScheduleId = row.TaxScheduleId;
            } else {
              this.form.detail.ScheduleId =
                "00000000-0000-0000-0000-000000000000";
            }     
        }
      },
      async openModalExchangeRate(row) {
        this.$refs.dlgExchangeRate
          .open(
            this.form.model.CurrencyCode,
            this.form.model.TransactionDate,
            this.form.defaultRateType,
            this.moneyOptions,
            this.form.model.RateAmount
          )
          .then(res => {
            //console.log(res);
          })
          .catch(res => {
            //console.log(res);
          });
      },

      async openModalDetailDiscount(value) {
        this.$refs.dlgDetailDiscount
          .open(
            "1",
            this.form.detail.ChargesName,
            value,
            this.form.model.RateAmount,
            this.form.detail.OriginatingDiscount,
            this.IsMultiply,
            this.moneyOptions
          )
          .then(res => {
            //console.log(res);
          })
          .catch(res => {
            //console.log(res);
          });
      },
      async openModalDetailDiscountExtended(value, index) {
        this.$refs.dlgDetailDiscount
          .open(
            index,
            "",
            value,
            this.form.model.RateAmount,
            this.form.model.SubDiscAmount1,
            this.IsMultiply,
            this.moneyOptions
          )
          .then(res => {
            //console.log(res);
          })
          .catch(res => {
            //console.log(res);
          });
      },
      async openModalDetailTax(value, discount, taxScheduleId, isAfterDiscount) {
        this.$refs.dlgDetailTax
          .open(
            "1",
            "",
            value,
            this.form.model.RateAmount,
            discount,
            this.moneyOptions,
            taxScheduleId,
            isAfterDiscount
          )
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onModalSearchRateType(row) {
        this.$refs.dlgRateType
          .open(row, this.form.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onModalSearchCharges(row) {
        this.$refs.dlgChargesDeposit
          .open(
            row,
            this.form.detail[row],
            this.form.model.TransactionType,
            "Receivables"
          )
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      countBaseAmount(value) {
        if (value == true) this.form.TaxDetail.BasedAmount = value;
        else
          this.form.TaxDetail.BasedAmount =
            value - this.form.TaxDetail.DiscountAmount;
      },
      TotalOriginatingExtendedAmount() {
        this.form.detail.OriginatingExtendedAmount = 
        this.form.detail.OriginatingAmount - this.form.detail.OriginatingDiscount + this.form.detail.OriginatingTax;
      },

      calculateDefault() {        
        if (
          this.form.detail.OriginatingAmount > 0 
        ) {
            let basedAmount = this.form.detail.OriginatingAmount;
            if(this.form.detail.IsTaxAfterDiscount){
              basedAmount = basedAmount - this.form.detail.OriginatingDiscount;
            }

            if (this.form.detail.TaxablePercentTax > 0) {
              this.form.detail.OriginatingTax =
                (this.form.detail.PercentDiscount / 100) *
                basedAmount *
                (this.form.detail.TaxablePercentTax / 100);
            }
        } else {
          this.form.detail.OriginatingTax = 0;
        }
      },

      changeTaxBasedAmountExt(value) {
        if (value == true)
          this.form.TaxExtention.BasedAmount = this.form.TaxExtention.Amount;
        else
          this.form.TaxExtention.BasedAmount =
            this.form.TaxExtention.Amount - this.form.TaxExtention.DiscAmount;
      },

      resetModal() {
        this.form.VoidReason = "";
        this.voidState = null;
      },
      checkFormValidity() {
        const valid = this.$refs.formvoid.checkValidity();
        this.voidState = valid;
        return valid;
      },
      async doVoidJournal(row) {
        this.showLoader(true);

        this.form.model.Reason = this.form.VoidReason;
        await this.$store.dispatch(
          "features/finance/deposit/receivable_deposit/actVoid",
          this.form.model
        );
        var response = this.$store.state.features.finance.deposit
          .receivable_deposit.resultPosting;
        
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

          this.$refs.gridHistory.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },
      async clickPosting(index) {
        this.$bvModal
          .msgBoxConfirm(
            "Posting " +
            this.form.model.DocumentNo +
            " ? (make sure you already save all your changes)",
            {
              title: "Posting Deposit Confirmation",
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
              this.doPostingJournal(index);
            }
          })
          .catch(err => {
            // An error occurred
          });
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault();
        // Trigger submit handler
        this.handleVoid();
      },
      handleCancel(bvModalEvt) {
        this.resetModal();
        // Prevent modal from closing
        this.$bvModal.hide("modal-void-reason");
      },
      handleVoid() {
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
      async doPostingJournal(row) {
        this.showLoader(true);

        await this.$store.dispatch(
          "features/finance/deposit/receivable_deposit/actPosting",
          this.form.model
        );

        var response = this.$store.state.features.finance.deposit
          .receivable_deposit.resultPosting;
        if (response.status != 200) {
          this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription != null
              ? response.data.ErrorDescription
              : "Delete failed."
          );
        } else {
          // SAVE LAST EDIT
          var RateAmount = this.form.model.RateAmount;
          var arrDetail = [];

          let isMultiply = this.form.model.IsMultiply;

              arrDetail.push({
                ChargesId: this.form.detail.ChargesId,
                ChargesDescription: this.form.detail.Description,
                OriginatingAmount: this.form.detail.OriginatingAmount,
                OriginatingTax: this.form.detail.OriginatingTax,
                OriginatingDiscount: this.form.detail.OriginatingDiscount,
                OriginatingExtendedAmount: this.form.detail.OriginatingExtendedAmount,
                FunctionalTax: isMultiply ? (this.form.detail.OriginatingTax * RateAmount) : (this.form.detail.OriginatingTax / RateAmount),
                FunctionalDiscount: isMultiply ? (this.form.detail.OriginatingDiscount * RateAmount) : (this.form.detail.OriginatingDiscount / RateAmount),
                FunctionalExtendedAmount: isMultiply ? (this.form.detail.OriginatingExtendedAmount * RateAmount) : (this.form.detail.OriginatingExtendedAmount / RateAmount),
                Status: 1,
                TaxScheduleId: this.form.detail.ScheduleId,
                IsTaxAfterDiscount: this.form.detail.IsTaxAfterDiscount == 0 ? false : true,
                PercentDiscount: this.form.detail.PercentDiscount
              });      

          this.form.model.ReceivableDetails = arrDetail;

          await this.$store.dispatch(
            "features/finance/deposit/receivable_deposit/actUpdate",
            this.form.model
          );
          /////////////////////////

          this.isForm = false;
          this.form.isEdit = false;

          this.$refs.gridMain.doRefresh();
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
      }
      /***  END ***/
    },

    computed: {
      filterByDocumentType() {
        return this.listTransactionType.filter(
          el => el.DocFeatureId == this.form.model.DocFeatureId
        );
      },
      maxVoidCalendarDate() {
        let trxDate = moment(this.form.model.TransactionDate, "YYYY-MM-DD");
        if (moment() <= trxDate) {
          return this.form.model.TransactionDate;
        } else {
          return moment().format("YYYY-MM-DD");
        }
      },
      SubOriginatingAmount: function () {
        this.form.model.OriginatingAmount = this.form.detail.OriginatingAmount;
      },

      SubTotalDiscount: function () {
        this.form.model.OriginatingDiscount = this.form.detail.OriginatingDiscount;
      },

      SubOriginatingTax: function () {
        this.form.model.OriginatingTax = this.form.detail.OriginatingTax;
      },
      SubOriginatingExtendedAmount: function () {
        this.form.model.SubTotalAmount1 = this.form.detail.OriginatingExtendedAmount;
        this.form.model.OriginatingExtendedAmount = this.form.detail.OriginatingExtendedAmount;
      },

      CountTotalAmount1: function () {
        var total = 0;
        total =
          this.form.model.SubTotalAmount1 -
          this.form.model.SubDiscAmount1 +
          this.form.model.SubTaxAmount1;
        return (this.form.model.TotalAmount1 = total);
      },
      CountTotalFuctionalAmount: function () {
        var total = 0;
        if (this.form.model.IsMultiply)
          total = this.form.model.SubTotalAmount1 * this.form.model.RateAmount;
        else total = this.form.model.SubTotalAmount1 / this.form.model.RateAmount;

        return (this.form.model.SubTotalAmount2 = total);
      },
      CountTotalFuctionalDisc: function () {
        var total = 0;
        if (this.form.model.IsMultiply)
          total = this.form.model.SubDiscAmount1 * this.form.model.RateAmount;
        else total = this.form.model.SubDiscAmount1 / this.form.model.RateAmount;

        return (this.form.model.SubDiscAmount2 = total);
      },
      CountTotalFuctionalTax: function () {
        var total = 0;
        if (this.form.model.IsMultiply)
          total = this.form.model.SubTaxAmount1 * this.form.model.RateAmount;
        else total = this.form.model.SubTaxAmount1 / this.form.model.RateAmount;

        return (this.form.model.SubTaxAmount2 = total);
      },
      CountTotalAmountFuctional: function () {
        var total = 0;
        if (this.form.model.IsMultiply)
          total = this.form.model.TotalAmount1 * this.form.model.RateAmount;
        else total = this.form.model.TotalAmount1 / this.form.model.RateAmount;

        return (this.form.model.TotalAmount2 = total);
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

  @media only screen and (max-width: 1024px) {
    h5{
      font-size:14px;
    }
    
    #table-detail thead th {
      font-size: 10px;
      border: 1px solid #cfd8dc;
      padding: 5px;
      background-color: #f5f5f5;
    }

    #table-detail tbody td {
      font-size: 10px;
      border-left: 0.5px solid #cfd8dc;
      border-right: 0.5px solid #cfd8dc;
      border-bottom: 1px solid #cfd8dc;
      padding: 3px;
      background-color: white;
    }

    #table-detail tfoot th {
      font-size: 10px;
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
  }
</style>

