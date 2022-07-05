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
                    </b-button> -->
                    <b-button variant="green" @click="clickPosting" 
                    v-if="form.isEdit&&form.model.OriginatingTotalPaid-form.model.AppliedTotalPaid==0&&form.model.Status==1" 
                    v-b-tooltip.hover title="Posting Deposit Settlement">
                      <font-awesome-icon :icon="['fas', 'check-circle']" />&nbsp;Posting
                    </b-button>
                    <b-button variant="outline-green" @click="clickSubmit" 
                    v-if="form.isEdit&&form.model.OriginatingTotalPaid-form.model.AppliedTotalPaid!=0&&form.model.Status==1" 
                    v-b-tooltip.hover title="Submit Deposit Settlement">
                      <font-awesome-icon :icon="['fas', 'check-circle']" />&nbsp;Submit
                    </b-button>
                    <b-button variant="red" v-b-modal.modal-void-reason v-if="form.isEdit && form.model.Status!=1 &&(isCreated==true)">
                      <font-awesome-icon :icon="['fas', 'ban']" v-b-tooltip.hover title="Void Deposit Settlement" />&nbsp;Void
                    </b-button>
                    <b-button variant="blue" type="submit" v-if="form.model.Status==0||form.model.Status==1 &&(isCreated == true)||!form.isEdit">
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
                  <b-col sm="12">
                    <b-alert show variant="danger" v-if="form.model.OriginatingTotalPaid < form.model.AppliedTotalPaid">
                      <h6 style="text-align:center; padding-top:5px;"><font-awesome-icon :icon="['fas', 'exclamation-circle']" />&nbsp; 
                      <b>DEPOSIT ORIGINATING AMOUNT MUST LARGER THAN APPLIED DEPOSIT AMOUNT !</b></h6>
                    </b-alert>
                      
                  </b-col>
                  <b-col sm="10">
                    <b-row>
                      <b-col sm="6" md="3">
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
                      <b-col sm="6" md="3">
                        <label>Document Date</label>
                        <b-input-group>
                          <b-form-input v-model="form.display.DocumentDate"
                                        type="text"
                                        :placeholder="dateFormatString"
                                        class="text-center"
                                        size="sm"
                                        readonly
                                        aria-describedby="doc-date-feedback"></b-form-input>
                          <b-input-group-append v-if="actionButton.AllowEdit && !form.StatusApproval && !form.Void">
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
                      <b-col sm="6" md="3">
                        <validation-provider name="Document Type"
                                             :rules="{ required: true }"
                                             v-slot="validationContext">
                          <b-form-group>
                            <label for="DocType">Type</label>
                            <b-form-select name="Document Type"
                                           v-model="form.model.DocumentType"
                                           :state="validateState(validationContext)"
                                           :plain="true"
                                           :options="[
                                            {value: 'DEMURRAGE', text: 'DEMURRAGE'},
                                            {value: 'CONTAINER GUARANTEE', text: 'CONTAINER GUARANTEE'},
                                            {value: 'DETENTION', text: 'DETENTION'}]"
                                           size="sm"
                                           :disabled="!actionButton.AllowEdit"
                                           aria-describedby="doctype-feedback" />
                            <b-form-invalid-feedback id="doctype-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
                      </b-col>
                      <b-col sm="6" md="3">
                              <label><b>Deposit No.</b></label>
                              <b-form-input v-model="form.model.ReceiveTransactionId" class="font-weight-bold" size="sm" v-show="false"></b-form-input>
                              <validation-provider name="Deposit No."
                                                   :rules="{ required: true }"
                                                   v-slot="validationContext">
                                <b-input-group prepend>
                                  <b-form-input v-model="form.model.DepositNo"
                                                class="font-weight-bold text-center"
                                                :state="validateState(validationContext)"
                                                readonly
                                                size="sm"
                                                aria-describedby="deposit-feedback"></b-form-input>
                                  <b-input-group-append v-if="actionButton.AllowEdit && !form.isEdit">
                                    <b-button variant="outline-primary"
                                              size="sm"
                                              :disabled="!actionButton.AllowEdit"
                                              @click="onModalSearchDeposit('DepositNo', 'DepositNo')">
                                      <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                    </b-button>
                                  </b-input-group-append>
                                  <b-form-invalid-feedback id="deposit-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-input-group>
                              </validation-provider>
                            </b-col>
                    </b-row>
                    <b-row>
                      <b-col sm="3">
                        <b-card sm="12" style="margin:0; padding:0;">
                          <b-row>
                            <b-col sm="12">
                              <label>Currency Code</label>
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

                                  <b-form-invalid-feedback id="Currency-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-input-group>
                              </validation-provider>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col sm="12">
                              <label>Rate Amount <code>{{form.model.IsMultiply ? "*" : "/"}}</code></label>
                              <validation-provider name="rate"
                                                   :rules="{ required: true, min_value:1 }"
                                                   v-slot="validationContext">

                                <b-input-group :prepend="form.CurrencySymbol" size="sm">
                                  <money v-model="form.model.ExchangeRate"
                                         v-bind="moneyOptions"
                                         size="sm"
                                         :state="validateState(validationContext)"
                                         class="currency-money-field"
                                         disabled
                                         aria-describedby="rate-amount-feedback"></money>
                                  <b-form-invalid-feedback id="rate-amount-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-input-group>
                              </validation-provider>
                            </b-col>
                            
                          </b-row>
                        </b-card>
                      </b-col>
                      <b-col sm="6">
                        <b-card sm="12" style="margin:0; padding:0;">
                          <b-row>
                            <b-col sm="8" lg="8">
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
                                  <b-input-group-append v-if="actionButton.AllowEdit && !form.isEdit">
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
                            </b-col>
                          </b-row>
                          <b-row class="mt-2">  
                            <b-col sm="12" >
                              <b-form-group size="sm">
                              <label for="Description">Customer Name</label>
                                <b-form-input v-model="form.model.CustomerName"
                                              class="font-weight-bold"
                                              readonly
                                              size="sm"
                                              aria-describedby="Currency-feedback"></b-form-input>
                              </b-form-group>
                            </b-col>
                          </b-row>
                        </b-card>
                      </b-col>
                      <b-col xl="3">
                          <b-row>
                            <b-col sm="12" v-if="form.model.ApplyDocumentNo">
                              <label for="ApplyNo"><b>Apply Doc. No.</b></label>
                              <b-input-group size="sm">
                                <b-form-input v-model="form.model.ApplyDocumentNo"
                                              class="font-weight-bold text-center"
                                              readonly
                                              size="sm"
                                              aria-describedby="ApplyNo-feedback"></b-form-input>
                                <b-button variant="light"
                                          v-if="form.model.DocumentNo != ''"
                                          @click="onModalShowDistJournalApply"
                                          v-b-tooltip.hover
                                          size="sm"
                                          title="View Distribution Journal">
                                  <font-awesome-icon :icon="['fas', 'balance-scale']" />
                                </b-button>
                              </b-input-group>
                            </b-col>
                          </b-row>
                          <b-row class="mt-2">  
                            <b-col sm="12" v-if="form.model.CheckbookDocumentNo">
                              <label for="CheckbookNo"><b>Checkbook Doc. No.</b></label>
                              <b-input-group :prepend="form.CurrencySymbol" size="sm">
                                <b-form-input v-model="form.model.CheckbookDocumentNo"
                                              class="font-weight-bold text-center"
                                              readonly
                                              size="sm"
                                              aria-describedby="CheckbookNo-feedback"></b-form-input>
                                <b-button variant="light"
                                          v-if="form.model.DocumentNo != ''"
                                          @click="onModalShowDistJournalCheckbook"
                                          v-b-tooltip.hover
                                          size="sm"
                                          title="View Distribution Journal">
                                  <font-awesome-icon :icon="['fas', 'balance-scale']" />
                                </b-button>
                              </b-input-group>
                            </b-col>
                          </b-row>
                      </b-col>
                    </b-row>
                    <b-row sm="7" lg="8" class="mt-2">
                      <b-col>
                        <b-form-group>
                          <label for="Description">Description</label>
                          <validation-provider name="Description"
                                               :rules="{ required: true }"
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
                      <b-col sm="5" lg="4">
                                    <label for="OrgTotalPaid" class="text-primary"><b>Deposit Originating Amount</b></label> &nbsp;
                                    <font-awesome-icon v-if="form.model.OriginatingTotalPaid < form.model.AppliedTotalPaid" style="color:red"
                                    :icon="['fas', 'exclamation-circle']"></font-awesome-icon>
                                            <money name="OrgTotalPaid"
                                                  class="currency-money-field font-weight-bold"
                                                  v-model="form.model.OriginatingTotalPaid"
                                                  v-bind="moneyOptions" :disabled="!actionButton.AllowEdit"
                                                  style="text-align:right; width:70%;"
                                                  size="sm"
                                                  disabled></money>
                                <!-- VALIDATION PROVIDER -->
                                  <validation-provider name="Originating Receipt Amount"
                                                      :rules="{ min_value:1 }"
                                                      v-slot="validationContext">
                                    <b-form-input name="OrgTotalPaid"
                                                  v-model="form.model.OriginatingTotalPaid"
                                                  style="float:right;"
                                                  size="sm"
                                                  hidden 
                                                  :state="validateState(validationContext)"
                                                  aria-describedby="OrgTotalPaid-amount-feedback"></b-form-input>
                                    <b-form-invalid-feedback id="OrgTotalPaid-amount-feedback">
                                      <font-awesome-icon :icon="['fas', 'exclamation-circle']" />&nbsp;{{ validationContext.errors[0] }}
                                    </b-form-invalid-feedback>
                                  </validation-provider>
                                <!-- VALIDATION PROVIDER END -->
                            </b-col>
                    </b-row>
                  </b-col>
                  <!-- END DOCUMENT STATUS -->
                  <b-col sm="2" v-if="form.isEdit" style="margin-top:10px;">
                    <b-card bg-variant="dark" text-variant="white">
                      <h5>{{ form.display.DocumentStatus }}</h5>
                      <b-card-text>
                        <div v-if="form.display.DocumentStatus == 'Void'">
                          <label><small>Void By :</small></label><br />
                          {{form.display.VoidName}}<br />
                          <label><small>Void Date :</small></label><br />
                          {{form.display.VoidDate}}<br />
                          <label><small>Comments :</small></label><br />
                          {{form.display.StatusComment}}
                        </div>
                        <div v-else>
                          <label><small>Created By :</small></label><br />
                          {{form.display.CreatedByName}}<br />
                          <label><small>Created Date :</small></label><br />
                          {{form.display.CreatedDate}}
                        </div>
                      </b-card-text>
                    </b-card>
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col>
                    <b-button variant="yellow" size="sm" type="button" 
                    @click="onAddReceivableInvoice" v-if="actionButton.AllowEdit"
                    :disabled="!form.model.DepositNo">
                      <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;Add Receivable Invoice
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
                          <th class="text-left text-uppercase">Doc. No</th>
                          <th class="text-left text-uppercase">Doc. Type</th>
                          <th class="text-center text-uppercase">Curr.</th>
                          <th class="text-left text-uppercase">Ns Doc. No</th>
                          <th class="text-left text-uppercase">ORG. Doc. AMOUNT</th>
                          <th class="text-left text-uppercase">Remaining. Doc. AMOUNT</th>
                          <th class="text-left text-uppercase">Applied Deposit AMOUNT</th>
                        </tr>

                      </thead>
                      <tbody class="position-relative">
                        <template v-for="(item, itemIndex) in dataDetails">
                          <tr>
                            <td class="text-center">
                              <a href="javascript:;"
                                 v-b-tooltip.hover title="Delete"
                                 style="text-decoration:none;color:red;"
                                 @click="DeleteReceivable(itemIndex)" v-if="actionButton.AllowEdit" :disabled="!actionButton.AllowEdit">
                                <font-awesome-icon size="lg"
                                                   :icon="['fas', 'trash-alt']"
                                                   variant="danger" />
                              </a>
                              <span v-else>{{itemIndex+1}}</span>
                            </td>
                            <td width="10%">
                              <b-form-input type="text" size="sm" v-model="item.ReceiveTransactionId" v-show="false" />
                              {{item.DocumentNo}}
                            </td>
                            <td>{{item.CustomerName}}</td>
                            <td width="5%" class="text-center">{{item.CurrCode}}</td>
                            <td>{{item.NsDocNo}}</td>
                            <td width="15%">
                              <b-input-group prepend>
                                <money v-model="item.OrgDocAmount" v-bind="moneyOptions" class="currency-money-field" disabled style="width:100%"></money>
                              </b-input-group>
                            </td>
                            <td width="15%">
                              <b-input-group prepend>
                                <money v-model="item.existingRemainingDocAmount" v-bind="moneyOptions" class="currency-money-field" v-show="false"></money>
                                <money v-model="item.RemainingDocAmount" v-bind="moneyOptions" class="currency-money-field" disabled style="width:100%"></money>
                              </b-input-group>
                            </td>
                            <td width="20%">
                              <b-input-group>
                                <money v-model="item.OrgPaidAmount" v-bind="moneyOptions" class="form-control currency-money-field" style="width:75%" 
                                :change="limitValue(itemIndex)"
                                :disabled="form.StatusApproval || !actionButton.AllowEdit">
                                <input :min="0" :max="item.RemainingDocAmount"/>
                                </money>
                                <b-button 
                                  variant="secondary" size="sm" 
                                  :disabled="!actionButton.AllowEdit" 
                                  v-if="actionButton.AllowEdit"
                                  @click.prevent="CountPaidAmount(itemIndex)">
                                  <font-awesome-icon :icon="['fas', 'bullseye']"></font-awesome-icon>
                                </b-button>
                                <b-button 
                                  variant="outline-line" size="sm" 
                                  :disabled="!actionButton.AllowEdit" 
                                  v-if="item.OrgPaidAmount!=0 && actionButton.AllowEdit" 
                                  @click.prevent="item.OrgPaidAmount = 0">
                                  <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                                </b-button>
                              </b-input-group>
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
                            <th colspan="2" style="font-size:12px; text-align:right; padding:0 5px 0 0;">
                              <font-awesome-icon v-if="form.model.OriginatingTotalPaid < form.model.AppliedTotalPaid" style="color:red"
                                    :icon="['fas', 'exclamation-circle']"></font-awesome-icon>
                                    APPLIED TOTAL DEPOSIT AMOUNT</th>
                            <th style="padding-right:5%;">
                              <money v-model="form.model.OriginatingTotalReceivable" v-bind="moneyOptions" class="currency-money-field" :value="SubOriginatingTotalReceivable" v-show="false"></money>
                              <money v-model="form.model.AppliedTotalPaid" v-bind="moneyOptions" class="currency-money-field" :value="SubOriginatingExtendedAmount" disabled style="width:100%"></money>
                            </th>

                          </tr>
                        </template>
                      </tfoot>
                      <slot name="caption" />
                    </table>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col sm="3">
                    
                  </b-col>
                  <b-col sm="2" class="text-center">
                    <label ><small>ORIGINATING</small></label>
                  </b-col>  
                  <b-col sm="2" class="text-center">
                    <label ><small>FUNCTIONAL</small></label>
                  </b-col>  
                </b-row>  
                <b-row>
                  <b-col sm="3">
                    <label style="font-size: 12px;" class="font-weight-bold">REMAINING DEPOSIT AMOUNT</label>
                  </b-col>
                  <b-col sm="4">
                    <b-input-group-append style="padding-right:28px;">
                      <money
                             :value="form.model.OriginatingTotalPaid-form.model.AppliedTotalPaid"
                             v-bind="moneyOptions"
                             class="currency-money-field font-weight-bold"
                             disabled
                             style="width:100%"></money>
                      <money
                            :value="(form.model.OriginatingTotalPaid-form.model.AppliedTotalPaid)*form.model.ExchangeRate"
                             v-bind="moneyOptions"
                             class="currency-money-field font-weight-bold"
                             disabled
                             style="width:100%"></money>
                    </b-input-group-append>
                  </b-col>
                </b-row>
            <br>
                <b-row v-if="form.model.DepositNo && form.model.AppliedTotalPaid < form.model.OriginatingTotalPaid">
                  <b-col sm="3">
                    <label style="font-size: 12px;" class="font-weight-bold">Checkbook Code</label>
                  </b-col>
                  <b-col sm="4">
                    <validation-provider name="Checkbook"
                                         :rules="{ required: true }"
                                         v-slot="validationContext">
                      <b-input-group prepend>
                        <b-form-input v-model="form.model.CheckbookCode"
                                      class="font-weight-bold"
                                      :state="validateState(validationContext)"
                                      readonly
                                      size="sm"
                                      aria-describedby="Checkbook-feedback"></b-form-input>
                        <b-input-group-append v-if="actionButton.AllowEdit">
                          <b-button variant="outline-primary"
                                    size="sm"
                                    :disabled="!actionButton.AllowEdit"
                                    @click="onModalSearchCheckbook('CheckbookCode', 'CheckbookCode')">
                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                          </b-button>
                        </b-input-group-append>
                        <b-form-invalid-feedback id="Checkbook-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                      </b-input-group>
                    </validation-provider>
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
                        :fields="this.$store.state.features.finance.deposit_settlement.deposit_settlement.headers"
                        :items="this.$store.state.features.finance.deposit_settlement.deposit_settlement.data"
                        :info="this.$store.state.features.finance.deposit_settlement.deposit_settlement.listInfo"
                        :baseUrl="this.$store.state.features.finance.deposit_settlement.deposit_settlement.baseUrl"
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
                        caption="Deposit Settlement - Progress"></DataGrid>
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
                          :fields="this.$store.state.features.finance.deposit_settlement.deposit_settlement_history.headers"
                          :items="this.$store.state.features.finance.deposit_settlement.deposit_settlement_history.data"
                          :info="this.$store.state.features.finance.deposit_settlement.deposit_settlement_history.listInfo"
                          :baseUrl="this.$store.state.features.finance.deposit_settlement.deposit_settlement_history.baseUrl"
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
                          :isEdit="false"
                          :isDelete="false"
                          caption="Deposit Settlement - History"></DataGrid>
              </b-card>
            </b-col>
          </b-row>
        </b-card-text>
      </b-tab>
    </b-tabs>
    
    <ExchangeRateModal ref="dlgExchangeRate" :actSelectedRow="onSelectedExchangeRate"></ExchangeRateModal>
    <CustomerModal ref="dlgCustomer" :actSelectedRow="onSelectedCustomer"></CustomerModal>
    <DistributionJournalModal ref="dlgDistJournal"></DistributionJournalModal>

    <b-modal v-model="isShowCheckbook" hide-footer size="lg">
      <template v-slot:modal-title>
        Select Checkbook
      </template>
      <div class="d-block text-center">
        <SelectGrid ref="gridCheckbookSelect"
                    :fields="[{label: 'Checkbook Code', key: 'CheckbookCode'},
                      {label: 'Checkbook Name', key: 'CheckbookName'},
                      {label: 'Currency Code', key: 'CurrencyCode'},
                      {label: 'Bank Account No', key: 'BankAccountCode'}]"
                    :items="this.$store.state.features.company.checkbook.data"
                    :info="this.$store.state.features.company.checkbook.listInfo"
                    :baseUrl="this.$store.state.features.company.checkbook.baseUrl"
                    :actGetData="handleGetCheckbookSelect"
                    :selectedItem="form.model.CheckbookCode"
                    selectedFieldName="CheckbookCode"
                    :actSelectRow="handleSelectCheckbook"
                    addTableClasses="table-bordered"
                    responsive
                    loading
                    hover
                    sorter
                    pagination
                    column-filter></SelectGrid>
      </div>
    </b-modal>

    <b-modal v-model="isShowDeposit" hide-footer size="lg">
      <template v-slot:modal-title>
        Select Deposit
      </template>
      <div class="d-block text-center">
        <SelectGrid ref="gridDeposit"
                    :fields="[{label: 'Doc. Type', key: 'DocumentType'},
                      {label: 'Doc. No', key: 'DocumentNo'},
                      {label: 'Trx. Type', key: 'TransactionType'},
                      {label: 'Trx. Date', key: 'TransactionDate'},
                      {label: 'Customer', key: 'CustomerName'},
                      {label: 'Deposit Amount', key: 'OriginatingExtendedAmount'}]"
                    :items="this.$store.state.features.finance.deposit.receivable_deposit_history.data"
                    :info="this.$store.state.features.finance.deposit.receivable_deposit_history.listInfo"
                    :baseUrl="this.$store.state.features.finance.deposit.receivable_deposit_history.baseUrl"
                    :actGetData="handleGetDeposit"
                    :selectedItem="form.model.DepositNo"
                    selectedFieldName="DocumentNo"
                    :actSelectRow="handleSelectDeposit"
                    addTableClasses="table-bordered"
                    responsive
                    loading
                    hover
                    sorter
                    pagination
                    column-filter></SelectGrid>
      </div>
    </b-modal>

    <b-modal v-model="isShowReceivable" hide-footer size="lg">
      <template v-slot:modal-title>
        Select Receivable
      </template>
      <div class="d-block text-center">
        <SelectGrid ref="gridReceivable"
                    :fields="[{label: 'Doc. No', key: 'DocumentNo', width:110},
                      {label: 'Trx. Date', key: 'TransactionDate', filter_date:true, width:80, _classes:'text-center'},
                      {label: 'NS Doc. No', key: 'NSDocumentNo'},
                      {label: 'Currency', key: 'CurrencyCode', _classes:'text-center', width:100},
                      {label: 'Org. Ext. Amount', key: 'OriginatingBalance',_classes: 'text-right currency',currency: true,filter: false}
                    ]"
                    :items="this.$store.state.features.finance.deposit_settlement.deposit_settlement_history.dataInvoices"
                    :info="this.$store.state.features.finance.deposit_settlement.deposit_settlement_history.listInvoicesInfo"
                    :baseUrl="this.$store.state.features.finance.deposit_settlement.deposit_settlement_history.baseUrlInvoice"
                    :actGetData="handleGetReceivableSelect"
                    :selectedItem="form.model.DocumentNo"
                    selectedFieldName="DocumentNo"
                    :actSelectRow="handleSelectReceivable"
                    addTableClasses="table-bordered"
                    responsive
                    loading
                    hover
                    sorter
                    pagination
                    column-filter></SelectGrid>
      </div>
    </b-modal>

    <b-modal id="modal-approve-reason"
             ref="modal-approve"
             title="Please type your reason to Approve "
             @show="resetModal"
             @hidden="resetModal"
             @ok="handleOkApprove"
             @cancel="handleCancel">
      <form ref="formapprove" @submit.stop.prevent="handleApprove">
        <b-form-group :state="approveState"
                      label="Reason"
                      label-for="name-input"
                      invalid-feedback="Reason must not empty">
          <b-form-input id="name-input"
                        v-model="form.VoidReason"
                        :state="approveState"
                        required></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
    <b-modal id="modal-approveposting-reason"
             ref="modal-approveposting"
             title="Please type your reason to Approve & Posting "
             @show="resetModal"
             @hidden="resetModal"
             @ok="handleOkApprovePosting"
             @cancel="handleCancel">
      <form ref="formapproveposting" @submit.stop.prevent="handleApprovePosting">
        <b-form-group :state="approvepostingState"
                      label="Reason"
                      label-for="name-input"
                      invalid-feedback="Reason must not empty">
          <b-form-input id="name-input"
                        v-model="form.VoidReason"
                        :state="approvepostingState"
                        required></b-form-input>
        </b-form-group>
      </form>
    </b-modal>

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
              <b-form-input id="name-input"
                            v-model="form.VoidReason"
                            :state="voidState"
                            required></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </form>
    </b-modal>

    <b-modal id="modal-disapprove-reason"
             ref="modal-disapprove"
             title="Please type your reason to Disapprove "
             @show="resetModal"
             @hidden="resetModal">
      <form ref="formdisapprove" @submit.stop.prevent="handleDisApprove">
        <b-form-group :state="disapproveState"
                      label="Reason"
                      label-for="name-input"
                      invalid-feedback="Reason must not empty">
          <b-form-input id="name-input"
                        v-model="form.VoidReason"
                        :state="disapproveState"
                        required></b-form-input>
        </b-form-group>
      </form>
      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button variant="danger"
                    size="sm"
                    class="float-right"
                    @click="handleOkDisApprove"
                    style="margin-left:5px;">
            Disapprove
          </b-button>
          <b-button variant="primary"
                    size="sm"
                    class="float-right"
                    @click="handleOkRevise"
                    style="margin-left:5px;">
            Revise
          </b-button>
          <b-button size="sm"
                    class="float-right"
                    @click="handleCancel">
            Cancel
          </b-button>
        </div>
      </template>
    </b-modal>
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
  import { ExchangeRateModal, CustomerModal, DistributionJournalModal } from "@/pages/modal/index.js";
  import { mask } from 'vue-the-mask';
  import moment from 'moment';
  import util from "@/helper/utils";
  import loginServices from '../../services/loginservices'

  export default {
    name: "Deposit Settlement",
    layout: "dashboard",
    components: {
      DataGrid,
      SelectGrid,
      VueElementLoading,      
      ExchangeRateModal,
      CustomerModal,
      DistributionJournalModal,
      ReceiptVoucherPrint
    },
    directives: {
      mask
    },
    data() {
      return {
        isPrint: false,
        dataPrint: [],
        VoidReason: "",
        HasCheckoutApproval: false,
        isCreated: false,
        voidState: null,
        approveState: null,
        CommentHistory: [],
        disapproveState: null,
        approvepostingState: null,
        actionButton: { AllowSave: true, AllowEdit: true, AllowPosting: false, AllowVoid: false },
        minCalendarDate: moment().format("YYYY-01-01"),
        dtlindex: 0,
        ChargesName: "",
        dataDetails: [],
        dateFormatString: 'DD-MM-YYYY',
        isTabMain: true,
        formCaption: "Deposit Settlement",
        caption: "Deposit Settlement",
        blockLoader: false,
        isForm: false, //FORM IN TAB CUSTOMER
        isFormAddress: false, //FORM IN TAB ADDRESS
        isShowCheckbook: false,
        isShowReceivable: false,
        isShowDeposit: false,
        itemHistory: [],
        HistoryInfo: [],
        itemReceivable: [],
        HistoryReceivable: [],
        historyUrl: "",
        Company: [],
        CompanyAddress: [],
        moneyOptions: {
          decimal: ",",
          thousands: ".",
          prefix: "",
          suffix: "",
          precision: 0,
          masked: false,
          allowBlank: false,
          min: 0,
          max: 3000
          //max: Number.MAX_SAFE_INTEGER
        },
        moneypercent: {
          decimal: '',
          thousands: '',
          prefix: '',
          suffix: '',
          decimalLength: 0,
          masked: false,
          allowBlank: true,
          precision: 0,
          min: 0,
          mxn: 100,
          //max: Number.MAX_SAFE_INTEGER
        },
        itemCities: Array(),
        perPage: 10,
        form: {
          valid: false,
          isEdit: false,
          StatusApproval: false,
          StatusPosting: false,
          CurrentIndex: 0,
          CurrencySymbol: "",
          defaultRateType: 0,
          FunctionalCurrency: "",
          CustomerAddressActiveField: "",
          CustomerAddressReffField: "",
          RateTypeExtension: {
            CurrencyCode: "",
            TypeRate: "",
            RateAmount: 0,
          },
          model: {
            SettlementHeaderId: "",
            CurrentIndex: "",
            RowId: "",
            DocumentNo: "",
            ReceiveTransactionId: "",
            DepositNo: "",
            ApplyDocumentNo: "",
            CheckbookDocumentNo: "",
            TransactionDate: "",
            DocumentType: "",
            CurrencyCode: "",
            ExchangeRate: 0,
            ReceiptTermCode: "",
            CustomerId: "",
            CustomerCode: "",
            CustomerName: "",
            IsMultiply: true,
            CheckbookCode: "",
            SoDocumentNo: "",
            NsDocumentNo: "",
            Description: "",
            OriginatingTotalPaid: "",
            AppliedTotalPaid: "",
            OriginatingTotalReceivable: "",
            FuctionalTotalPaid: 0,
            Status: 1,
            StatusComment: "",
            DepositSettlementDetails: [],
            OriginatingRemaining: "",
            VoidDate: moment().format("YYYY-MM-DD")
          },
          display: {
            DocumentDate: moment().format("DD-MM-YYYY"),
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
            VoidDate: "",
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
      await this.$store.dispatch("features/company/receivable_setup/actGet", "ReceivableSetup?");

      let minimumInputDate = await this.$store.dispatch("features/finance/constants/actGetMinInputDateSales");
      if (minimumInputDate != undefined)
        this.minCalendarDate = moment(minimumInputDate).format("YYYY-MM-DD");

      await this.$store.dispatch("features/company/financial_setup/actGet", "FinancialSetup?");

      await this.$store.dispatch(
        "features/company/company_setup/actGetCompanySetup",
        "CompanySetup?&CompanyId=" + this.$store.state.companyId
      );
      this.Company = this.$store.state.features.company.company_setup.data[0];

      await this.$store.dispatch(
        "features/company/company_address/actGetCompanyAddress",
        "CompanyAddress?&CompanyAddressId=" + this.Company.CompanyAddressId
      );
      this.CompanyAddress = this.$store.state.features.company.company_address.data[0];

      await this.$store.dispatch(
        "features/company/checkbook/actGetCheckbook",
        "Checkbook?&InActive=false&IsCash=false"
      );

      await this.initDefaultForm();

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
      async dateChangedVoid() {

        this.form.display.VoidDate = "";
        if (this.form.model.VoidDate != null)
          this.form.display.VoidDate = moment(this.form.model.VoidDate).format("YYYY-MM-DD");
      },

      async limitValue(index) {
        if (this.dataDetails[index]['OrgPaidAmount'] > this.dataDetails[index]['RemainingDocAmount']) {
          this.dataDetails[index]['OrgPaidAmount'] = this.dataDetails[index]['RemainingDocAmount'];
        }
      },
      async CountPaidAmount(index)
      {
        var selisihAmount = this.form.model.OriginatingTotalPaid - this.form.model.AppliedTotalPaid;
        if(selisihAmount >= 0) {
          this.dataDetails[index]['OrgPaidAmount'] = selisihAmount; 
        }
      },
      async dateChanged() {
        this.form.display.DocumentDate = '';
        if (this.form.model.TransactionDate != null)
          this.form.display.DocumentDate = moment(this.form.model.TransactionDate).format(this.dateFormatString)
      },
      handleToast(toastTitle, style, message) {
        this.$bvToast.toast(message, {
          title: toastTitle != "" ? toastTitle : "Confirmation",
          variant: style != "" ? style : "info",
          autoHideDelay: 5000,
          appendToast: false
        });
      },
      validateState({ dirty, validated, valid = null }) {
        return dirty || validated ? valid : null;
      },
      async handleGet(url) {
        await this.$store.dispatch("features/finance/deposit_settlement/deposit_settlement_history/actGetData", url);
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async handleGetProgress(url) {
        await this.$store.dispatch("features/finance/deposit_settlement/deposit_settlement/actGetData", url);
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async History() {
        this.itemHistory = this.$store.state.features.finance.deposit_settlement.deposit_settlement_history.data;
        this.HistoryInfo = this.$store.state.features.finance.deposit_settlement.deposit_settlement_history.listInfo;
      },
      async onAddReceivableInvoice() {
        this.handleGetReceivableSelect();

        this.isShowReceivable = true;
      },
      CekDetail(DocumentNo) {
        var isdoc = true;
        for (var i = 0; i < this.dataDetails.length; i++) {
          if (this.dataDetails[i].DocumentNo == DocumentNo)
            isdoc = false;
        }
        return isdoc;
      },
      async CekValueRemainingDocAmount(ReceiveTransactionId, OriginatingExtendedAmount) {
        var value = 0;
        await this.$store.dispatch("features/finance/deposit_settlement/deposit_settlement/actGetDataDetail", "GetReceiptDetail?" + "&ReceiveTransactionId=" + ReceiveTransactionId);
        var Dataexisting = await this.$store.state.features.finance.deposit_settlement.deposit_settlement.dataDetail;
        var ExRemainingDocAmount = 0;
        if (Dataexisting.length == 0) {
          value = OriginatingExtendedAmount;
        } else {
          for (var i = 0; i < Dataexisting.length; i++) {
            value += Dataexisting[i].OrgPaidAmount;
          }
          value = OriginatingExtendedAmount - value
        }

        return value;
      },

      async onSelectedRateType(item, modelReff) {
        this.form.model[modelReff] = item.RateType;
      },
      async onFormClose() {
        //location.reload();
        this.ErrorMessage = "";
        this.isForm = false;
        this.form.isEdit = false;

        this.resetForm();
      },

      resetForm() {
        this.form.model.SettlementHeaderId = "";
        this.form.model.TransactionDate = moment().format("YYYY-MM-DD");
        this.form.display.DocumentDate = moment().format("DD-MM-YYYY");
        this.form.model.DocumentType = 'DEPOSIT DEMURRAGE';
        this.form.model.DocumentNo = "",
        this.form.model.ReceiveTransactionId = "",
        this.form.model.DepositNo = "",
        this.form.model.ApplyDocumentNo = "",
        this.form.model.CheckbookDocumentNo = "",
          this.form.model.CurrencyCode = "",
          this.form.model.ExchangeRate = 1,
          this.form.model.CustomerId = "",
          this.form.model.CustomerCode = "",
          this.form.model.CustomerName = "",
          this.form.model.CheckbookCode = "",
          this.form.model.Description = "",
          this.form.model.OriginatingTotalPaid = 0,
          this.form.model.AppliedTotalPaid = 0,
          this.form.model.FuctionalTotalPaid = 0,
          this.form.model.Status = 1,
          this.dataDetails = [],

          this.form.display.CreatedName = "";
        this.form.display.CreatedDate = "";

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
      async initDefaultForm() {
        var ReceivableSetup = this.$store.state.features.company.receivable_setup.data;

        var financialSetup = this.$store.state.features.company.financial_setup.data;

        if (Array.isArray(financialSetup) && financialSetup.length) {
          financialSetup = financialSetup[0];
          this.form.FunctionalCurrency = financialSetup.FuncCurrencyCode;
          this.form.model.ExchangeRate = 1;
        }

        if (Array.isArray(ReceivableSetup) && ReceivableSetup.length) {
          ReceivableSetup = ReceivableSetup[0];
          this.form.defaultRateType = ReceivableSetup.DefaultRateType;
        }

      },
      async handleEdit(row) {
        var arr = [];
        var arrDetail = [];

        this.form.model.SettlementHeaderId = row.SettlementHeaderId,
          this.form.model.DocumentNo = row.DocumentNo,
          this.form.model.ReceiveTransactionId = row.ReceiveTransactionId,
          this.form.model.DepositNo = row.DepositNo,
          this.form.model.ApplyDocumentNo = row.ApplyDocumentNo,
          this.form.model.CheckbookDocumentNo = row.CheckbookDocumentNo,
          this.form.model.TransactionDate = moment(row.TransactionDate).format("YYYY-MM-DD");
        this.form.display.DocumentDate = moment(this.form.model.TransactionDate).format("DD-MM-YYYY");
        this.form.model.DocumentType = row.DocumentType,
          this.form.model.CurrencyCode = row.CurrencyCode,
          this.form.model.ExchangeRate = row.ExchangeRate,
          this.form.model.CustomerId = row.CustomerId,
          this.form.model.CustomerCode = row.CustomerCode,
          this.form.model.CustomerName = row.CustomerName,
          this.form.model.CheckbookCode = row.CheckbookCode,
          this.form.model.NsDocumentNo = row.NsDocumentNo,
          this.form.model.Description = row.Description,
          this.form.model.OriginatingTotalPaid = row.OriginatingTotalPaid,
          this.form.model.FunctionalTotalPaid = row.FunctionalTotalPaid,
          this.form.model.Status = util.docStatus(row.Status),
          this.form.display.DocumentStatus = row.Status;  
          this.form.model.StatusComment = row.StatusComment,
          this.form.display.CreatedByName = row.CreatedByName;
        this.form.display.CreatedDate = moment(row.CreatedDate).format('DD-MM-YYYY HH:mm:ss');
        this.form.display.VoidDate = row.VoidDate != undefined
          ? moment(row.VoidDate).format(this.dateFormatString + " HH:mm:ss")
          : moment(Date.now()).format(this.dateFormatString);

        //ACTIVATE BUTTONS
        if (this.form.model.SettlementHeaderId != '' && this.form.model.DocumentNo != '') {
          if (this.form.model.Status == util.docStatus('New')) {
            this.actionButton.AllowEdit = true
            this.actionButton.AllowSave = true
            this.actionButton.AllowPosting = true
            this.actionButton.AllowVoid = false
          } else if (this.form.model.Status == util.docStatus('posted')) {
            this.actionButton.AllowVoid = true
            this.actionButton.AllowSave = false
            this.actionButton.AllowEdit = false
            this.actionButton.AllowPosting = false
          } else {
            this.actionButton.AllowVoid = false
            this.actionButton.AllowSave = false
            this.actionButton.AllowEdit = false
            this.actionButton.AllowPosting = false
          }
        } else {
          this.actionButton.AllowSave = true
          this.actionButton.AllowEdit = true
          this.actionButton.AllowPosting = false;
          this.actionButton.AllowVoid = false;
        }

        row.DepositSettlementDetails.forEach(function (d, index) {
          arrDetail.push({
            "ReceiveTransactionId": d.ReceiveTransactionId, 
            "DocumentNo": d.DocumentNo, 
            "CustomerName": d.CustomerName, 
            "CurrCode": row.CurrencyCode, 
            "OrgDocAmount": d.OrgDocAmount,
            "NsDocNo": d.NSDocumentNo, 
            "RemainingDocAmount": d.OriginatingBalance, 
            "OrgPaidAmount": d.OriginatingPaid
          })        
        });
        this.dataDetails = arrDetail;
        
        var model = {
          SettlementHeaderId : this.form.model.SettlementHeaderId,
          CompanyId : this.$store.state.companyId
        }
        await this.$store.dispatch("features/finance/deposit_settlement/deposit_settlement/actGetDataPrint", model);
        this.dataPrint = this.$store.state.features.finance.deposit_settlement.deposit_settlement.resultDataPrint

        if (row.CreatedBy == this.$store.state.user)
          this.isCreated = true;

        this.isForm = true;
        this.form.isEdit = true;
      },
      async doDelete(row) {
        this.showLoader(true);

        await this.$store.dispatch("features/finance/deposit_settlement/deposit_settlement/actDelete", row);

        var response = this.$store.state.features.finance.deposit_settlement.deposit_settlement.resultDelete;
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
          var multiply = this.form.model.IsMultiply;
          var rate = this.form.model.ExchangeRate;

          this.dataDetails.forEach(function (row, index) {
            arrDetail.push({
              "ReceiptDetailId": row.ReceiptDetailId, 
              "SettlementHeaderId": "00000000-0000-0000-0000-000000000000", 
              "ReceiveTransactionId": row.ReceiveTransactionId, 
              "Description": "", 
              "OriginatingBalance": row.RemainingDocAmount,
              "FunctionalBalance": multiply ? 
              ((row.OrgDocAmount - row.OrgPaidAmount) * rate) : ((row.OrgDocAmount - row.OrgPaidAmount) / rate),
              "OriginatingPaid": row.OrgPaidAmount, 
              "FunctionalPaid": multiply ? (row.OrgPaidAmount * rate) : (row.OrgPaidAmount / rate), 
              "Status": 0
            })
          });

          this.form.model.DepositSettlementDetails = arrDetail;

          if (this.form.isEdit) {
            await this.$store.dispatch(
              "features/finance/deposit_settlement/deposit_settlement/actUpdate", this.form.model
            );
            var response = this.$store.state.features.finance.deposit_settlement.deposit_settlement.resultUpdate;
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
            await this.$store.dispatch("features/finance/deposit_settlement/deposit_settlement/actCreate", this.form.model);

            var response = this.$store.state.features.finance.deposit_settlement.deposit_settlement.resultCreate;

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
      async onSelectedExchangeRate(item) {
        if (item != undefined)
          this.form.model.ExchangeRate = item.ExchangeRateAmount;

        this.form.model.IsMultiply = item.CalcIsMultiply;
      },
      async onSelectedCustomer(item, modelReff) {

        this.form.model.CustomerId = item.CustomerId;
        this.form.model.CustomerName = item.CustomerName;
        this.form.model[modelReff] = item.CustomerCode;
      },
      async DeleteReceivable(index) {
        this.dataDetails.splice(index, 1);
      },
      async openModalExchangeRate(row) {
        this.$refs.dlgExchangeRate
          .open(
            this.form.model.CurrencyCode,
            this.form.model.TransactionDate,
            this.form.defaultRateType,
            this.moneyOptions,
            this.form.model.ExchangeRate
          )
          .then(res => {
            //console.log(res);
          })
          .catch(res => {
            //console.log(res);
          });
      },
      resetModal() {
        this.form.VoidReason = ''
        this.voidState = null
      },
      checkFormValidity(form) {
        if (form == 'void') {
          const valid = this.$refs.formvoid.checkValidity()
          this.voidState = valid
          return valid
        } else if (form == 'approve') {
          const valid = this.$refs.formapprove.checkValidity()
          this.voidState = valid
          return valid
        } else if (form == 'disapprove') {
          const valid = this.$refs.formdisapprove.checkValidity()
          this.voidState = valid
          return valid
        } else {
          const valid = this.$refs.formapproveposting.checkValidity()
          this.voidState = valid
          return valid
        }
      },

      async onModalShowDistJournalApply(row) {
        this.$refs.dlgDistJournal
          .open(this.form.model.ApplyDocumentNo)
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onModalShowDistJournalCheckbook(row) {
        this.$refs.dlgDistJournal
          .open(this.form.model.CheckbookDocumentNo)
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },

      async doVoidJournal(row) {
        this.showLoader(true);

        this.form.model.Reason = this.form.VoidReason;
        this.form.model.PersonId = this.$store.state.user;
        await this.$store.dispatch("features/finance/deposit_settlement/deposit_settlement/actVoid", this.form.model);
        var response = this.$store.state.features.finance.deposit_settlement.deposit_settlement.resultPosting;


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
     
      handleOkDisApprove(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleDisApprove()
      },
      handleOkRevise(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleRevise()
      },
      async clickPosting(index) {
        this.$bvModal
          .msgBoxConfirm("Posting " + this.form.model.DocumentNo + " ? (make sure you already save all your changes)", {
            title: "Posting Deposit Confirmation",
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
      async clickSubmit(index) {
        this.$bvModal
          .msgBoxConfirm("Submit " + this.form.model.DocumentNo + " ? (make sure you already save all your changes)", {
            title: "Submit Deposit Confirmation",
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

      handleOkApprove(bvModalEvt) {
        bvModalEvt.preventDefault()
        this.handleApprove()
      },
      handleApprove() {
        if (!this.checkFormValidity('approve')) {
          return
        }
        this.doApprove();
        this.$nextTick(() => {
          this.$bvModal.hide('modal-approve-reason')
        })
      },
      handleOkApprovePosting(bvModalEvt) {
        bvModalEvt.preventDefault()
        this.handleApprovePosting()
      },
      handleApprovePosting() {
        if (!this.checkFormValidity('approveposting')) {
          return
        }
        this.doApprovePosting();

        this.$nextTick(() => {
          this.$bvModal.hide('modal-approveposting-reason')
        })
      },
      async doDisApprove(row) {
        this.showLoader(true);

        this.form.model.Reason = this.form.VoidReason;
        this.form.model.PersonId = this.$store.state.user;

        await this.$store.dispatch("features/finance/deposit_settlement/deposit_settlement/actDisApprove", this.form.model);

        var response = this.$store.state.features.finance.deposit_settlement.deposit_settlement.resultUpdate;
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

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },
      async doRevise(row) {
        this.showLoader(true);

        this.form.model.Reason = this.form.VoidReason;
        this.form.model.PersonId = this.$store.state.user;

        await this.$store.dispatch("features/finance/deposit_settlement/deposit_settlement/actRevise", this.form.model);

        var response = this.$store.state.features.finance.deposit_settlement.deposit_settlement.resultUpdate;
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

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },
      async doApprove(row) {
        this.showLoader(true);

        this.form.model.Reason = this.form.VoidReason;
        this.form.model.PersonId = this.$store.state.user;
        this.form.model.CurrentIndex = this.form.CurrentIndex;

        await this.$store.dispatch("features/finance/deposit_settlement/deposit_settlement/actApprove", this.form.model);

        var response = this.$store.state.features.finance.deposit_settlement.deposit_settlement.resultUpdate;
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

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
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
        this.handleVoid()
      },
      handleCancel(bvModalEvt) {
        this.resetModal();
        // Prevent modal from closing
        this.$bvModal.hide('modal-void-reason')
      },
      handleVoid() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity('void')) {
          return
        }
        // Push the name to submitted names
        this.doVoidJournal();

        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('modal-void-reason')
        })
      },
      async doPostingReceipt(row) {
        this.showLoader(true);

        this.form.model.PersonId = this.$store.state.user;
        await this.$store.dispatch("features/finance/deposit_settlement/deposit_settlement/actPosting", this.form.model);

        var response = this.$store.state.features.finance.deposit_settlement.deposit_settlement.resultPosting;
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
          var arrDetail = [];
          var multiply = this.form.model.IsMultiply;
          var rate = this.form.model.ExchangeRate;

          this.dataDetails.forEach(function (row, index) {
            arrDetail.push({
              "ReceiptDetailId": row.ReceiptDetailId, 
              "SettlementHeaderId": "00000000-0000-0000-0000-000000000000", 
              "ReceiveTransactionId": row.ReceiveTransactionId, 
              "Description": "", 
              "OriginatingBalance": row.RemainingDocAmount,
              "FunctionalBalance": multiply ? 
              ((row.OrgDocAmount - row.OrgPaidAmount) * rate) : ((row.OrgDocAmount - row.OrgPaidAmount) / rate),
              "OriginatingPaid": row.OrgPaidAmount, 
              "FunctionalPaid": multiply ? (row.OrgPaidAmount * rate) : (row.OrgPaidAmount / rate), 
              "Status": 0
            })
          });

          this.form.model.DepositSettlementDetails = arrDetail;

          await this.$store.dispatch(
            "features/finance/deposit_settlement/deposit_settlement/actUpdate", 
            this.form.model);
          ///////////////////////

          this.isForm = false;
          this.form.isEdit = false;

          this.$refs.gridProgress.doRefresh();
          this.$refs.gridHistory.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },

      async doSubmitReceipt(row) {
        this.showLoader(true);

        this.form.model.PersonId = this.$store.state.user;
        await this.$store.dispatch("features/finance/deposit_settlement/deposit_settlement/actSubmit", this.form.model);

        var response = this.$store.state.features.finance.deposit_settlement.deposit_settlement.resultPosting;
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
          var arrDetail = [];
          var multiply = this.form.model.IsMultiply;
          var rate = this.form.model.ExchangeRate;

          this.dataDetails.forEach(function (row, index) {
            arrDetail.push({
              "ReceiptDetailId": row.ReceiptDetailId, 
              "SettlementHeaderId": "00000000-0000-0000-0000-000000000000", 
              "ReceiveTransactionId": row.ReceiveTransactionId, 
              "Description": "", 
              "OriginatingBalance": row.RemainingDocAmount,
              "FunctionalBalance": multiply ? 
              ((row.OrgDocAmount - row.OrgPaidAmount) * rate) : ((row.OrgDocAmount - row.OrgPaidAmount) / rate),
              "OriginatingPaid": row.OrgPaidAmount, 
              "FunctionalPaid": multiply ? (row.OrgPaidAmount * rate) : (row.OrgPaidAmount / rate), 
              "Status": 0
            })
          });

          this.form.model.DepositSettlementDetails = arrDetail;

          await this.$store.dispatch(
            "features/finance/deposit_settlement/deposit_settlement/actUpdate", 
            this.form.model);
          /////////////////

          this.isForm = false;
          this.form.isEdit = false;

          this.$refs.gridProgress.doRefresh();
          this.$refs.gridHistory.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },
      /***  END ***/
      async onModalSearchDeposit(reff, active) {
          await this.handleGetDeposit();
          this.isShowDeposit = true;
      },
      async handleGetDeposit(url){
          await this.$store.dispatch(
              "features/finance/deposit/receivable_deposit_history/actGetData",
              "GetHistoryDeposit?&DocumentType=" + this.form.model.DocumentType
          );
      },
      async handleSelectDeposit(row) {
        this.form.model.ReceiveTransactionId = row.ReceiveTransactionId;
        this.form.model.DepositNo = row.DocumentNo;
        this.form.model.CurrencyCode = row.CurrencyCode;
        this.form.model.ExchangeRate = row.ExchangeRate;
        this.form.model.CustomerId = row.CustomerId;
        this.form.model.CustomerCode = row.CustomerCode;
        this.form.model.CustomerName = row.CustomerName;
        this.form.model.OriginatingTotalPaid = row.SubtotalAmount;

        this.isShowDeposit = false;
      },

      async onModalSearchCheckbook(reff, active) {
        await this.handleGetCheckbookSelect();

        this.isShowCheckbook = true;
      },
      async handleGetCheckbookSelect(url) {
        await this.$store.dispatch(
          "features/company/checkbook/actGetCheckbook",
          "Checkbook?&CurrencyCode=" + this.form.model.CurrencyCode
        );
      },
      async handleGetReceivableSelect(url) {
        if (url == undefined) {
          url = "GetPendingDeposit?CustomerId=" + this.form.model.CustomerId + "&CurrencyCode=" + this.form.model.CurrencyCode;
        } else {
          if (url.toLowerCase().lastIndexOf("vendorid") < 0) {
            url =
              url + "&CustomerId=" + this.form.model.CustomerId + "&CurrencyCode=" + this.form.model.CurrencyCode;
          }
        }
        await this.$store.dispatch("features/finance/deposit_settlement/deposit_settlement_history/actGetPendingDeposit", url);
      },
      async handleSelectCheckbook(row) {
        this.form.model.CheckbookCode = row.CheckbookCode;

        this.isShowCheckbook = false;
      },
      async handleSelectReceivable(row) {
        let exist = false;

        if (Array.isArray(this.dataDetails)) {
          for (let i = 0; i < this.dataDetails.length; i++) {
            if (this.dataDetails[i].ReceiveTransactionId === row.ReceiveTransactionId) {
              exist = true;
              break;
            }
          }
        }

        if (!exist) {
          this.dataDetails.push({
            Index: (this.dataDetails.length),
            ReceiveTransactionId: row.ReceiveTransactionId,
            DocumentNo: row.DocumentNo,
            // CustomerDocNo: row.CustomerDocumentNo,
            CurrCode: row.CurrencyCode,
            NsDocNo: row.NsDocumentNo,
            OrgDocAmount: row.OriginatingInvoice,
            RemainingDocAmount: row.OriginatingBalance,
            existingRemainingDocAmount: row.OriginatingBalance,
            OrgPaidAmount: 0
          });
        } else {
          this.handleToast("Add Receivable Invoice", "warning", "Invoice already exist ! Can not insert duplicate invoice.");
        }
        this.isShowReceivable = false;
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
      CountRemaining(index) {
        if (index != undefined) {
          if (this.dataDetails.length > 0 && this.dataDetails[index]['OrgPaidAmount'] > 0)
            this.dataDetails[index]['RemainingDocAmount'] = (this.dataDetails[index]['existingRemainingDocAmount'] - this.dataDetails[index]['OrgPaidAmount']);
        }

      },

      SwitchButton(Name) {
        switch (expression) {
          case x:
            // code block
            break;
          case y:
            // code block
            break;
          default:
          // code block
        }
      },

      async doApprovePosting(row) {
        this.showLoader(true);

        this.form.model.Reason = this.form.VoidReason;
        this.form.model.PersonId = this.$store.state.user;

        await this.$store.dispatch("features/finance/deposit_settlement/deposit_settlement/actApprovePost", this.form.model);

        var response = this.$store.state.features.finance.deposit_settlement.deposit_settlement.resultUpdate;
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
    },

    computed: {
      maxVoidCalendarDate() {
        let trxDate = moment(this.form.model.TransactionDate, 'YYYY-MM-DD');
        if (moment() <= trxDate) {
          return this.form.model.TransactionDate
        } else {
          return moment().format('YYYY-MM-DD')
        }
      },
      SubOriginatingExtendedAmount: function () {
        var total = 0;
        for (var i = 0; i < this.dataDetails.length; i++) {

          total += this.dataDetails[i]['OrgPaidAmount'];

        }

        return this.form.model.AppliedTotalPaid = total;
      },
      SubOriginatingTotalReceivable: function () {
        var total = 0;
        for (var i = 0; i < this.dataDetails.length; i++) {

          total += this.dataDetails[i]['OrgDocAmount'];

        }

        return this.form.model.OriginatingTotalReceivable = total;
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
    padding: 3px;
    background-color: white;
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

  }
</style>

