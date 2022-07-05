
<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <!-- TAB FORM BEGIN -->
    <b-card no-body v-show="isForm">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
          <b-row>
            <b-col sm="12">
              <b-card>
                <div slot="header">
                  <span class="font-weight-bold">{{formCaption}}</span>
                  <small>{{ (form.isEdit) ? "Edit" : "New" }}</small>
                  <div right style="float:right;">
                    <b-button
                      variant="red"
                      v-b-modal.modal-void-reason
                      v-if="actionButton.AllowVoid"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'ban']"
                        v-b-tooltip.hover
                        title="Void this Transaction"
                      />&nbsp;Void
                    </b-button>
                    <b-button
                      variant="green"
                      @click="clickPosting"
                      v-if="actionButton.AllowPosting"
                      v-b-tooltip.hover
                      title="Posting this Transaction"
                    >
                      <font-awesome-icon :icon="['fas', 'check-circle']" />&nbsp;Posting
                    </b-button>
                    <b-button
                      v-if="form.model.DocumentNo != ''"
                      @click="onModalShowDistJournal"
                      v-b-tooltip.hover
                      title="View Distribution Journal"
                    >
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
                        <label>Document Date</label>
                        <b-input-group>
                          <b-form-input
                            v-model="form.display.DocumentDate"
                            type="text"
                            :placeholder="dateFormatString"
                            class="text-center"
                            size="sm"
                            readonly
                            aria-describedby="doc-date-feedback"
                          ></b-form-input>
                          <b-input-group-append v-if="actionButton.AllowEdit">
                            <b-form-datepicker
                              v-model="form.model.TransactionDate"
                              button-only
                              size="sm"
                              left
                              locale="en-US"
                              @input="dateChanged"
                              :min="minCalendarDate"
                              :max="maxCalendarDate"
                              dark
                            ></b-form-datepicker>
                          </b-input-group-append>
                        </b-input-group>
                      </b-col>
                      <b-col sm="3" >
                        <validation-provider
                          name="Transaction Type"
                          :rules="{ required: true }"
                          v-slot="validationContext"
                        >
                          <b-form-group>
                            <label for="TrxType">Document Type</label>
                            <b-form-select
                              name="Document Type"
                              v-model="form.model.DocumentType"
                              :state="validateState(validationContext)"
                              :plain="true"
                              html-field="html"
                              :options="[
                              {value:'RECEIPT',text:'RECEIPT'},
                              {value:'ADVANCE',text:'ADVANCE'}, 
                              {value:'CREDIT NOTE',text:'CREDIT NOTE'}
                              ]"
                              size="sm"
                              :disabled="form.model.DocumentNo != ''"
                              aria-describedby="trxtype-feedback"
                              v-if="form.model.DocumentType != 'DEPOSIT SETTLEMENT'"
                            />                            
                            <b-form-input 
                              v-model="form.model.DocumentType"
                              type="text"
                              class="text-center"
                              size="sm"
                              readonly
                              aria-describedby="doc-date-feedback"
                              v-else
                            ></b-form-input>
                            <b-form-invalid-feedback
                              id="trxtype-feedback"
                            >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
                      </b-col>
                      <b-col sm="4">
                        <b-form-group>
                          <label for="DocumentNo" class="text-center">Document No</label>
                          <b-form-input
                            name="Document No"
                            type="text"
                            placeholder="Document No"
                            v-model="form.model.DocumentNo"
                            class="text-center font-weight-bold"
                            readonly
                            variant="blue"
                            size="sm"
                          />
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col sm="6">
                        <b-card sm="12" style="margin:0; padding:0;">
                          <b-row>
                            <b-col sm="6">
                              <b-form-group>
                                <label for="CustomerCode">Customer Code</label>
                                <validation-provider
                                  name="Customer Code"
                                  :rules="{ required: true }"
                                  v-slot="validationContext"
                                >
                                  <b-input-group prepend>
                                    <b-form-input
                                      v-model="form.display.CustomerCode"
                                      readonly
                                      size="sm"
                                      :state="validateState(validationContext)"
                                      aria-describedby="Customer-code-feedback"
                                    ></b-form-input>
                                    <b-input-group-append v-if="actionButton.AllowEdit && form.model.DocumentNo == ''">
                                      <b-button
                                        variant="outline-primary"
                                        size="sm"
                                        @click="onModalSearchCustomer('CustomerId')"
                                      >
                                        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                      </b-button>
                                    </b-input-group-append>
                                    <b-form-invalid-feedback
                                      id="Customer-code-feedback"
                                    >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                  </b-input-group>
                                </validation-provider>
                              </b-form-group>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col sm="10">
                              <b-form-group>
                                <label for="CustomerName">Customer Name</label>
                                <b-form-input
                                  v-model="form.display.CustomerName"
                                  class="font-weight-bold"
                                  readonly
                                  size="sm"
                                ></b-form-input>
                              </b-form-group>
                            </b-col>
                          </b-row>
                        </b-card>
                      </b-col>
                      <b-col sm="6">
                        <b-card sm="12" style="margin:0; padding:0;">
                          <b-row>
                            <b-col sm="6">
                              <b-form-group v-if="form.model.DocumentType=='ADVANCE'">
                                <label for="ReffDocumentNo">Advance Doc. No</label>
                                <validation-provider
                                  name="Advance Payment No"
                                  :rules="{ required: true }"
                                  v-slot="validationContext"
                                >
                                  <b-input-group prepend>
                                    <b-form-input
                                      v-model="form.display.ReffDocumentNo"
                                      readonly
                                      size="sm"
                                      :state="validateState(validationContext)"
                                      aria-describedby="reff-doc-no-feedback"
                                    ></b-form-input>
                                    <b-input-group-append v-if="actionButton.AllowEdit && form.model.DocumentNo == ''">
                                      <b-button
                                        variant="outline-primary"
                                        size="sm"
                                        @click="onOpenSelectApplyOption"
                                        :disabled="form.display.CustomerCode == ''"
                                      >
                                        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                      </b-button>
                                    </b-input-group-append>
                                    <b-form-invalid-feedback
                                      id="reff-doc-no-feedback"
                                    >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                  </b-input-group>
                                </validation-provider>
                              </b-form-group>
                              <b-form-group v-if="form.model.DocumentType=='RECEIPT'">
                                <label for="ReffDocumentNo">Receipt Doc. No</label>
                                <validation-provider
                                  name="Receipt No"
                                  :rules="{ required: true }"
                                  v-slot="validationContext"
                                >
                                  <b-input-group prepend>
                                    <b-form-input
                                      v-model="form.display.ReffDocumentNo"
                                      readonly
                                      size="sm"
                                      :state="validateState(validationContext)"
                                      aria-describedby="reff-doc-no-feedback"
                                    ></b-form-input>
                                    <b-input-group-append v-if="actionButton.AllowEdit && form.model.DocumentNo == ''">
                                      <b-button
                                        variant="outline-primary"
                                        size="sm"
                                        @click="onOpenSelectApplyOption"
                                        :disabled="form.display.CustomerCode == ''"
                                      >
                                        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                      </b-button>
                                    </b-input-group-append>
                                    <b-form-invalid-feedback
                                      id="reff-doc-no-feedback"
                                    >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                  </b-input-group>
                                </validation-provider>
                              </b-form-group>
                              <b-form-group v-if="form.model.DocumentType=='CREDIT NOTE'">
                                <label for="ReffDocumentNo">Credit Note Doc. No</label>
                                <validation-provider
                                  name="Credit Note No"
                                  :rules="{ required: true }"
                                  v-slot="validationContext"
                                >
                                  <b-input-group prepend>
                                    <b-form-input
                                      v-model="form.display.ReffDocumentNo"
                                      readonly
                                      size="sm"
                                      :state="validateState(validationContext)"
                                      aria-describedby="credit-doc-no-feedback"
                                    ></b-form-input>
                                    <b-input-group-append v-if="actionButton.AllowEdit && form.model.DocumentNo == ''">
                                      <b-button
                                        variant="outline-primary"
                                        size="sm"
                                        @click="onOpenSelectApplyOption"
                                        :disabled="form.display.CustomerCode == ''"
                                      >
                                        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                      </b-button>
                                    </b-input-group-append>
                                    <b-form-invalid-feedback
                                      id="credit-doc-no-feedback"
                                    >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                  </b-input-group>
                                </validation-provider>
                              </b-form-group>
                            </b-col>
                            <b-col sm="5">
                              <label>Currency</label>
                              <b-form-input
                                v-model="form.display.CurrencyCode"
                                class="text-center font-weight-bold"
                                readonly
                                size="sm"
                              ></b-form-input>
                            </b-col>
                            <b-col sm="7" v-show="actionButton.AllowSave">
                              <label>Available</label>
                              <money
                                v-model="form.display.AvailableBalance"
                                v-bind="moneyOptions"
                                size="sm"
                                disabled
                                class="currency-money-field"
                                style="width:93%;"
                              ></money>
                            </b-col>
                          </b-row>
                        </b-card>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col>
                        <label for="Description">Description</label>
                        <b-form-textarea
                            name="Description"
                            placeholder="Description"
                            v-model="form.model.Description"
                            size="sm"
                            aria-describedby="description-feedback"
                            :readonly="!actionButton.AllowEdit"
                          />
                      </b-col>
                    </b-row>
                  </b-col>
                  <!-- END FORM -->
                  <!-- BEGIN DOCUMENT STATUS -->
                  <b-col sm="2" v-if="form.isEdit">
                    <b-card
                      bg-variant="dark"
                      text-variant="white"
                      :title="form.display.DocumentStatus">
                      <h5>{{ form.display.DocumentStatus }}</h5>
                      <b-card-text>
                        <div v-if="form.display.DocumentStatus == 'Void'">
                          <label>
                            <small>Void By :</small>
                            <br />
                            {{form.status.VoidName}}
                          </label>
                          <label>
                            <small>Void Date :</small>
                            <br />
                            {{form.status.VoidDate}}
                          </label>
                          <br />
                          <label>
                            <small>Comments :</small>
                            <br />
                            {{form.display.StatusComment}}
                          </label>
                        </div>
                        <div v-else>
                          <label>
                            <small>Created By :</small>
                          </label>
                          <br />
                          {{form.display.CreatedName}}
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
                  <!-- END DOCUMENT STATUS -->
                </b-row>
                <b-row class="mt-3 mb-2">
                  <b-col>
                    <b-button
                      variant="yellow"
                      :disabled="form.model.CustomerId == '' || form.display.ReffDocumentNo == ''"
                      size="sm"
                      type="button"
                      @click="onAddReceivableInvoice"
                      v-if="actionButton.AllowEdit"
                    >
                      <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;Add Receivable Invoice
                    </b-button>
                  </b-col>
                </b-row>
                <!-- TABLE DETAIL BEGIN -->
                <b-row>
                  <b-col sm="12" class="table-responsive">
                    <table
                      id="table-detail"
                      width="100%"
                      class="table-light table-striped table-hover table-bordered"
                    >
                      <thead>
                        <tr>
                          <th class="text-center" style="vertical-align:middle;">
                            <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
                          </th>
                          <th class="text-left" width="100">DOCUMENT NO</th>
                          <th class="text-left">SO DOC NO</th>
                          <th class="text-left">NS DOC NO</th>
                          <th class="text-center" width="80">CURRENCY</th>                          
                          <th class="text-center" width="200">INVOICE AMOUNT</th>
                          <th class="text-center" width="200">REMAINING AMOUNT</th>
                          <th class="text-center" width="200">APPLY AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody class="position-relative">
                        <template v-for="(item, itemIndex) in form.dataDetails">
                          <tr>
                            <td class="text-center">
                              <a
                                href="javascript:;"
                                style="text-decoration:none;color:red;"
                                @click="deleteRowDetail(itemIndex)"
                                v-if="actionButton.AllowEdit"
                              >
                                <font-awesome-icon
                                  size="lg"
                                  :icon="['fas', 'trash']"
                                  variant="danger"
                                />
                              </a>
                              <span v-else>{{itemIndex+1}}</span>
                            </td>
                            <td width="10%">
                              <b-form-input
                                type="text"
                                size="sm"
                                v-model="item.ReceiveTransactionId"
                                v-show="false"
                              />
                              {{item.DocumentNo}}
                            </td>
                            <td>{{item.SoDocNo}}</td>
                            <td>{{item.NsDocNo}}</td>
                            <td width="5%" class="text-center">{{item.CurrCode}}</td>                            
                            <td width="15%">
                              <b-input-group prepend>
                                <money
                                  v-model="item.OrgDocAmount"
                                  v-bind="moneyOptions"
                                  class="currency-money-field"
                                  disabled
                                  style="width:100%"
                                ></money>
                              </b-input-group>
                            </td>
                            <td width="15%">
                              <b-input-group prepend>
                                <money
                                  v-model="item.existingOriginatingBalance"
                                  v-bind="moneyOptions"
                                  class="currency-money-field"
                                  v-show="false"
                                ></money>
                                <money
                                  v-model="item.OriginatingBalance"
                                  v-bind="moneyOptions"
                                  class="currency-money-field"
                                  disabled
                                  style="width:100%"
                                ></money>
                              </b-input-group>
                            </td>
                            <td width="15%">
                              <b-input-group>
                                <money
                                  v-model="item.OriginatingPaid"
                                  v-bind="moneyOptions"
                                  class="currency-money-field form-control"
                                  style="width:82%"
                                  :change="limitValue(itemIndex)"
                                  :disabled="!actionButton.AllowSave"
                                ><input :min="0" :max="item.OriginatingBalance" /></money>
                                <b-button
                                  variant="secondary"
                                  size="sm"
                                  :disabled="!actionButton.AllowEdit"
                                  v-if="actionButton.AllowSave"
                                  @click.prevent="CountPaidAmount(itemIndex)"
                                >
                                  <font-awesome-icon :icon="['fas', 'bullseye']"></font-awesome-icon>
                                </b-button>
                                <b-button
                                  variant="outline-line"
                                  size="sm"
                                  :disabled="!actionButton.AllowEdit"
                                  v-if="item.OriginatingPaid!=0 && actionButton.AllowEdit"
                                  @click.prevent="item.OriginatingPaid = 0"
                                >
                                  <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                                </b-button>
                              </b-input-group>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                      <tfoot>
                        <tr>
                          <th colspan="5" class="text-center text-red text-uppercase"><i>{{form.model.OriginatingTotalPaid > form.display.AvailableBalance ? "Available Balance is not enough to apply total amount" : ""}}</i></th>
                          <th class="text-right" colspan="2">TOTAL APPLIED AMOUNT</th>
                          <th style="padding-right:34px;">
                            <money
                              v-model="form.model.OriginatingTotalPaid"
                              v-bind="moneyOptions"
                              class="currency-money-field font-weight-bold"
                              disabled
                              style="width:100%"
                            ></money>
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </b-col>
                </b-row>
                <!-- TABLE DETAIL END -->
              </b-card>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
    </b-card>
    <!-- TAB FORM END -->

    <!-- TAB GRID/LIST BEGIN -->
    <b-tabs pills card v-show="!isForm" v-model="tabularStep">
      <!-- TAB PROGRESS BEGIN -->
      <b-tab active @click="isTabMain=true">
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'tasks']" />&nbsp;Progress
        </template>
        <b-row>
          <b-col cols="12" sm="12">
            <b-card width="100%">
              <DataGrid
                ref="gridProgress"
                :fields="this.$store.state.features.finance.receivable_apply.progress.headers"
                :items="this.$store.state.features.finance.receivable_apply.progress.data"
                :info="this.$store.state.features.finance.receivable_apply.progress.listInfo"
                :baseUrl="this.$store.state.features.finance.receivable_apply.progress.baseUrl"
                :actGetData="handleGetProgress"
                :actCreate="onFormCreate"
                :actEditRow="handleEdit"
                :actDeleteRow="handleDelete"
                addTableClasses="table-bordered"
                responsive
                items-per-page-select
                loading
                hover
                sorter
                pagination
                column-filter
                caption="Receivable Apply - Progress"
              ></DataGrid>
            </b-card>
          </b-col>
        </b-row>
      </b-tab>
      <!-- TAB PROGRESS END -->
      <!-- TAB HISTORY BEGIN -->
      <b-tab @click="isTabMain=false">
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'history']" />&nbsp;History
        </template>
        <b-card-text>
          <b-row>
            <b-col cols="12" sm="12">
              <b-card width="100%">
                <DataGrid
                  ref="gridHistory"
                  :fields="this.$store.state.features.finance.receivable_apply.history.headers"
                  :items="this.$store.state.features.finance.receivable_apply.history.data"
                  :info="this.$store.state.features.finance.receivable_apply.history.listInfo"
                  :baseUrl="this.$store.state.features.finance.receivable_apply.history.baseUrl"
                  :actGetData="handleGetHistory"
                  :actEditRow="handleEdit"
                  addTableClasses="table-bordered"
                  responsive
                  items-per-page-select
                  loading
                  hover
                  sorter
                  pagination
                  column-filter
                  caption="Receivable Apply - History"
                  disableNewButton
                  historical
                ></DataGrid>
              </b-card>
            </b-col>
          </b-row>
        </b-card-text>
      </b-tab>
      <!-- TAB HISTORY END -->
    </b-tabs>
    <!-- TAB GRID/LIS END -->

    <DistributionJournalModal ref="dlgDistJournal"></DistributionJournalModal>
    <CustomerModal ref="dlgCustomer" :actSelectedRow="onSelectedCustomer"></CustomerModal>

    <b-modal
      id="modal-void-reason"
      ref="modal-void"
      title="Please type your reason to VOID "
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <form ref="formvoid" @submit.stop.prevent="handleVoid">
        <b-row>
          <b-col sm="6">
            <label>Void Date</label>
            <b-input-group>
              <b-form-input
                v-model="form.display.VoidDate"
                type="text"
                :placeholder="dateFormatString"
                class="text-center"
                size="sm"
                readonly
                aria-describedby="doc-date-feedback"
              ></b-form-input>
              <b-input-group-append
                v-if="actionButton.AllowVoid && (form.model.TransactionDate != maxVoidCalendarDate)"
              >
                <b-form-datepicker
                  v-model="form.model.VoidDate"
                  button-only
                  size="sm"
                  left
                  @input="dateChangedVoid"
                  :min="form.model.TransactionDate"
                  :max="maxVoidCalendarDate"
                  dark
                ></b-form-datepicker>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col>
            <b-form-group
              :state="voidState"
              label="Reason"
              label-for="name-input"
              invalid-feedback="Reason must not empty"
            >
              <b-form-input
                id="name-input"
                v-model="form.VoidReason"
                :state="voidState"
                autocomplete="false"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </form>
    </b-modal>

    <!-- BEGIN MODAL ADVANCE PAYMENT -->
    <div id="page-dialog-advance">
      <b-modal v-model="isShowSelectADV" hide-footer size="lg">
        <template v-slot:modal-title>Advance Payment</template>
        <div class="d-block text-center">
          <SelectGrid
            ref="gridSelectADV"
            :fields="[{label: 'Document No', key: 'DocumentNo', _classes: 'text-left', width:150, filter: true},
                      {label: 'Trx. Date', key: 'TransactionDate', _classes: 'text-center',width:100, filter: false, filter_date:true},
                      {label: 'Checkbook Code', key: 'CheckbookCode', _classes: 'text-left',width:180, filter: true},
                      {label: 'Currency', key: 'CurrencyCode', _classes: 'text-center', width:90, filter: false},
                      {label: 'Available Balance', key: 'OriginatingBalance', _classes: 'text-right', filter: false, currency:true},]"
            :items="this.$store.state.features.finance.receivable_apply.progress.dataADV"
            :info="this.$store.state.features.finance.receivable_apply.progress.listInfoADV"
            :baseUrl="this.$store.state.features.finance.receivable_apply.progress.baseUrlADV"
            :actGetData="handleGetSelectADV"
            :selectedItem="form.display.ReffDocumentNo"
            selectedFieldName="DocumentNo"
            :actSelectRow="handleSelectADV"
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
    <!-- END MODAL ADVANCE PAYMENT -->
    <!-- BEGIN MODAL CREDIT NOTE -->
    <div id="page-dialog-cn">
      <b-modal v-model="isShowSelectCN" hide-footer size="lg">
        <template v-slot:modal-title>Credit Note</template>
        <div class="d-block text-center">
          <SelectGrid
            ref="gridSelectCN"
            :fields="[{label: 'Document No', key: 'DocumentNo', _classes: 'text-left', width:150, filter: true},
                      {label: 'Trx Date', key: 'TransactionDate', _classes: 'text-center',width:100, filter: false, filter_date:true},
                      {label: 'Currency', key: 'CurrencyCode', _classes: 'text-center', width:90, filter: true},
                      {label: 'Balance', key: 'OriginatingBalance', _classes: 'text-right',  filter: true, currency:true},]"
            :items="this.$store.state.features.finance.receivable_apply.progress.dataCN"
            :info="this.$store.state.features.finance.receivable_apply.progress.listInfoCN"
            :baseUrl="this.$store.state.features.finance.receivable_apply.progress.baseUrlCN"
            :actGetData="handleGetSelectCN"
            :selectedItem="form.display.ReffDocumentNo"
            selectedFieldName="DocumentNo"
            :actSelectRow="handleSelectCN"
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
    <!-- END MODAL CREDIT NOTE -->

    <!-- BEGIN MODAL UNAPPLY RECEIPT -->
    <div id="page-dialog-unapply">
      <b-modal v-model="isShowSelectUnapply" hide-footer size="lg">
        <template v-slot:modal-title>Unapply Customer Receipt</template>
        <div class="d-block text-center">
          <SelectGrid
            ref="gridSelectUnapply"
            :fields="[{label: 'Document No', key: 'DocumentNo', _classes: 'text-left', width:150, filter: true},
                      {label: 'Trx Date', key: 'TransactionDate', _classes: 'text-center',width:100, filter: false, filter_date:true},
                      {label: 'Currency', key: 'CurrencyCode', _classes: 'text-center', width:90, filter: true},
                      {label: 'Balance', key: 'OriginatingBalance', _classes: 'text-right',  filter: true, currency:true},]"
            :items="this.$store.state.features.finance.receivable_apply.progress.dataUnapply"
            :info="this.$store.state.features.finance.receivable_apply.progress.listInfoUnapply"
            :baseUrl="this.$store.state.features.finance.receivable_apply.progress.baseUrlUnapply"
            :actGetData="handleGetSelectUnapply"
            :selectedItem="form.display.ReffDocumentNo"
            selectedFieldName="DocumentNo"
            :actSelectRow="handleSelectUnapply"
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
    <!-- END MODAL CREDIT NOTE -->

    <!-- BEGIN MODAL INVOICE -->
    <b-modal v-model="isShowSelectInvoice" hide-footer size="lg">
      <template v-slot:modal-title>Receivable Invoices</template>
      <div class="d-block text-center">
        <SelectGrid
          ref="gridSelectReceivable"
          :fields="[{label: 'Doc. No', key: 'DocumentNo', width:130},
                      {label: 'Trx. Date', key: 'TransactionDate', filter_date:true, filter:false, width:100, _classes:'text-center'},
                      {label: 'SO Doc. No', key: 'SODocumentNo'},
                      {label: 'NS Doc. No', key: 'NSDocumentNo'},
                      {label: 'Currency', key: 'CurrencyCode', _classes:'text-center', width:90},
                      {label: 'Balance', key: 'OriginatingBalance',_classes: 'text-right currency',currency: true,filter: false}
                    ]"
          :items="PendingReceivables"
          :info="this.$store.state.features.finance.receivable.receivable_history.listInvoicesInfo"
          :baseUrl="this.$store.state.features.finance.receivable.receivable_history.baseUrlInvoice"
          :actGetData="handleGetSelectReceivable"
          :actSelectRow="handleSelectReceivable"
          addTableClasses="table-bordered"
          selectedFieldName="DocumentNo"
          responsive
          loading
          hover
          sorter
          pagination
          column-filter
        ></SelectGrid>
      </div>
    </b-modal>
    <!-- END MODAL INVOICE -->
  </div>
</template>

<script>
import DataGrid from "@/components/Tables/DataGrid";
import SelectGrid from "@/components/tables/SelectGrid";
import VueElementLoading from "vue-element-loading";
import { DistributionJournalModal, CustomerModal } from "@/pages/modal/index.js";
import { mask } from "vue-the-mask";
import moment from "moment";
import util from "@/helper/utils";
import loginServices from '@/services/loginservices'

export default {
  name: "ReceivableApply",
  layout: "dashboard",
  components: {
    DataGrid,
    SelectGrid,
    VueElementLoading,
    DistributionJournalModal,
    CustomerModal
  },
  directives: {
    mask
  },
  data() {
    return {
      actionButton: {
        AllowSave: true,
        AllowEdit: true,
        AllowPosting: false,
        AllowVoid: false
      },
      tabularStep: 0,
      minCalendarDate: moment().format("YYYY-01-01"),
      maxCalendarDate: moment()
        .endOf("month")
        .format("YYYY-MM-DD"),
      dateFormatString: "DD/MM/YYYY",
      isTabMain: true,
      formCaption: "Receivable Apply",
      caption: "Receivable Apply",
      blockLoader: false,
      isForm: false,
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
      },
      perPage: 10,
      voidState: null,
      isShowSelectADV: false,
      isShowSelectCN: false,
      isShowSelectUnapply: false,
      isShowSelectInvoice: false,
      form: {
        valid: false,
        isEdit: false,
        model: {
          ReceivableApplyId: "00000000-0000-0000-0000-000000000000",
          TransactionDate: moment().format("YYYY-MM-DD"),
          CheckbookTransactionId: "00000000-0000-0000-0000-000000000000", //ADVANCE PAYMENT
          ReceiveTransactionId: "00000000-0000-0000-0000-000000000000", //CREDIT NOTE
          ReceiptHeaderId: "00000000-0000-0000-0000-000000000000", //UNAPPLY
          DocumentType: "",
          CustomerId: "00000000-0000-0000-0000-000000000000", //CREDIT NOTE
          DocumentNo: "",
          Description: "",
          OriginatingTotalPaid: 0,
          FunctionalTotalPaid: 0,
          Status: 1,
          ARApplyDetails: Array,
          VoidDate: moment().format("YYYY-MM-DD")
        },
        dataDetails: [],
        display: {
          DocumentDate: moment().format("DD/MM/YYYY"),
          CurrencyCode: "",
          ExchangeRate: 0,
          IsMultiply: true,
          DocumentStatus: "",
          CustomerCode: "",
          CustomerName: "",
          CreatedName: "",
          CreatedDate: "",
          StatusComment: "",
          VoidDate: moment().format("DD/MM/YYYY"),
          ReffDocumentNo: "",
          AvailableBalance: 0
        },
        status: {
          VoidName: "",
          VoidDate: moment().format("DD/MM/YYYY")
        },
        VoidReason: ""
      }
    };
  },
  watch: {
    "form.model.DocumentType"(newVal) {
      if(this.form.model.DocumentNo == '' && !this.form.isEdit){
        this.form.model.CheckbookTransactionId = "00000000-0000-0000-0000-000000000000";
        this.form.model.ReceiveTransactionId = "00000000-0000-0000-0000-000000000000";
        this.form.model.ReceiptHeaderId = "00000000-0000-0000-0000-000000000000";
        this.form.display.ReffDocumentNo = "";
        this.form.display.CurrencyCode = "";
        this.form.display.AvailableBalance = 0;
        this.form.dataDetails = [];
      }      
    },
    "form.dataDetails": {
      handler: function(after, before) {
        this.doCalculateDetails();
      },
      deep: true
    }
  },
  async mounted() {
    //OBTAIN MINIMUM CALENDAR INPUT
    let minimumInputDate = await this.$store.dispatch(
      "features/finance/constants/actGetMinInputDateFinancial"
    );
    if (minimumInputDate != undefined)
      this.minCalendarDate = moment(minimumInputDate).format("YYYY-MM-DD");

    await this.$store.dispatch(
      "features/company/financial_setup/actGet",
      "FinancialSetup?"
    );

    await this.$store.dispatch(
      "features/finance/receivable_apply/progress/actGetData",
      "GetProgressApplyReceivable?"
    );
    await this.$store.dispatch(
      "features/finance/receivable_apply/history/actGetData",
      "GetHistoryApplyReceivable?"
    );

    if (this.$refs.gridProgress != null) {
      await this.$refs.gridProgress.doRefresh();
    }
  },
  computed: {
    PendingReceivables(){
      let selectedDocNos = [];
      this.form.dataDetails.forEach(function(f){
        selectedDocNos.push(f.DocumentNo);
      });

      let filteredReceivables = this.$store.state.features.finance.receivable.receivable_history.dataInvoices.filter(x=> !selectedDocNos.includes(x.DocumentNo));

      return filteredReceivables;
    },
    maxVoidCalendarDate() {
      let trxDate = moment(this.form.model.TransactionDate, "YYYY-MM-DD");
      if (moment() <= trxDate) {
        return this.form.model.TransactionDate;
      } else {
        return moment().format("YYYY-MM-DD");
      }
    }
  },
  methods: {
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
      this.form.display.DocumentDate = "";
      if (this.form.model.TransactionDate != null)
        this.form.display.DocumentDate = moment(
          this.form.model.TransactionDate
        ).format(this.dateFormatString);
    },
    async dateChangedVoid() {
      this.form.display.VoidDate = "";
      if (this.form.model.VoidDate != null)
        this.form.display.VoidDate = moment(this.form.model.VoidDate).format(
          this.dateFormatString
        );
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
    async doCalculateDetails() {
      let orgTotal = 0;

      if (
        Array.isArray(this.form.dataDetails) &&
        this.form.dataDetails.length
      ) {
        this.form.dataDetails.forEach(function(detail) {
          orgTotal += detail.OriginatingPaid;
        });
      }

      this.form.model.OriginatingTotalPaid = orgTotal;
    },
    async limitValue(index) {
      if (
        this.form.dataDetails[index]["OriginatingPaid"] >
        this.form.dataDetails[index]["OrgDocAmount"]
      ) {
        //alert("Paid Amount can't be more than document amount");
        this.form.dataDetails[index]["OriginatingPaid"] = this.form.dataDetails[
          index
        ]["OrgDocAmount"];
      }
    },
    
    async CountPaidAmount(index) {
      var selisihAmount =
        this.form.display.AvailableBalance - this.form.model.OriginatingTotalPaid;
        console.log(this.form.display.AvailableBalance);
        console.log(this.form.model.OriginatingTotalPaid);
        console.log(selisihAmount);
      if (selisihAmount >= 0) {
        this.form.dataDetails[index]["OriginatingPaid"] = selisihAmount;
      }
    },

    validateState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    async handleGetProgress(url) {
      await this.$store.dispatch(
        "features/finance/receivable_apply/progress/actGetData",
        url
      );
      await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
    },
    async handleGetHistory(url) {
      await this.$store.dispatch(
        "features/finance/receivable_apply/history/actGetData",
        url
      );
      await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
    },
    async handleGetSelectADV(url) {
      if (url == undefined) {
        url = this.$store.state.features.finance.receivable_apply.progress
          .baseUrlADV;
        url = url + "CustomerId=" + this.form.model.CustomerId;
      } else {
        if (url.toLowerCase().lastIndexOf("customerid") < 0) {
          url = url + "&CustomerId=" + this.form.model.CustomerId;
        }
      }
      await this.$store.dispatch(
        "features/finance/receivable_apply/progress/actGetAdvancePayment",
        url
      );
    },
    async handleSelectADV(row) {
      this.form.model.ReceiveTransactionId =
        "00000000-0000-0000-0000-000000000000";
      this.form.model.ReceiptHeaderId =  "00000000-0000-0000-0000-000000000000";

      this.form.model.CheckbookTransactionId = row.CheckbookTransactionId;

      this.form.display.ReffDocumentNo = row.DocumentNo;
      this.form.display.CurrencyCode = row.CurrencyCode;
      this.form.display.ExchangeRate = row.ExchangeRate;
      this.form.display.IsMultiply = row.IsMultiply;
      this.form.display.AvailableBalance = row.OriginatingBalance;

      this.isShowSelectADV = false;
    },
    async handleGetSelectCN(url) {
      if (url == undefined) {
        url = this.$store.state.features.finance.receivable_apply.progress
          .baseUrlCN;
        url = url + "CustomerId=" + this.form.model.CustomerId;
      } else {
        if (url.toLowerCase().lastIndexOf("customerid") < 0) {
          url = url + "&CustomerId=" + this.form.model.CustomerId;
        }
      }
      await this.$store.dispatch(
        "features/finance/receivable_apply/progress/actGetCreditNote",
        url
      );
    },
    async handleGetSelectUnapply(url) {
      if (url == undefined) {
        url = this.$store.state.features.finance.receivable_apply.progress
          .baseUrlUnapply;
        url = url + "CustomerId=" + this.form.model.CustomerId;
      } else {
        if (url.toLowerCase().lastIndexOf("customerid") < 0) {
          url = url + "&CustomerId=" + this.form.model.CustomerId;
        }
      }
      await this.$store.dispatch(
        "features/finance/receivable_apply/progress/actGetUnapply",
        url
      );
    },
    async onOpenSelectApplyOption() {
      if (this.form.model.DocumentType == 'ADVANCE') {
        await this.handleGetSelectADV();

        this.isShowSelectUnapply = false;
        this.isShowSelectCN = false;
        this.isShowSelectADV = true;
      }else if(this.form.model.DocumentType == 'RECEIPT'){
        await this.handleGetSelectUnapply();
        
        this.isShowSelectCN = false;
        this.isShowSelectADV = false;
        this.isShowSelectUnapply = true;
      } else {
        await this.handleGetSelectCN();

        this.isShowSelectUnapply = false;
        this.isShowSelectADV = false;
        this.isShowSelectCN = true;
      }
    },
    async handleSelectCN(row) {
      this.form.model.CheckbookTransactionId =
        "00000000-0000-0000-0000-000000000000";
      this.form.model.ReceiptHeaderId =  "00000000-0000-0000-0000-000000000000";

      this.form.model.ReceiveTransactionId = row.ReceiveTransactionId;

      this.form.display.ReffDocumentNo = row.DocumentNo;
      this.form.display.CurrencyCode = row.CurrencyCode;
      this.form.display.ExchangeRate = row.ExchangeRate;
      this.form.display.IsMultiply = row.IsMultiply;
      this.form.display.AvailableBalance = row.OriginatingBalance;

      this.isShowSelectCN = false;
    },
    async handleSelectUnapply(row) {
      this.form.model.CheckbookTransactionId =
        "00000000-0000-0000-0000-000000000000";
      this.form.model.ReceiveTransactionId =  "00000000-0000-0000-0000-000000000000";

      this.form.model.ReceiptHeaderId = row.ReceiptHeaderId;

      this.form.display.ReffDocumentNo = row.DocumentNo;
      this.form.display.CurrencyCode = row.CurrencyCode;
      this.form.display.ExchangeRate = row.ExchangeRate;
      this.form.display.IsMultiply = row.IsMultiply;
      this.form.display.AvailableBalance = row.OriginatingBalance;

      this.isShowSelectUnapply = false;
    },
    async onAddReceivableInvoice() {
      this.handleGetSelectReceivable();
      this.isShowSelectInvoice = true;
    },
    async handleGetSelectReceivable(url) {
      if (url == undefined) {
        url = this.$store.state.features.finance.receivable.receivable_history
          .baseUrlInvoice;
        url =
          url +
          "CustomerId=" +
          this.form.model.CustomerId +
          "&CurrencyCode=" +
          this.form.display.CurrencyCode;
      } else {
        if (url.toLowerCase().lastIndexOf("Customerid") < 0) {
          url =
            url +
            "&CustomerId=" +
            this.form.model.CustomerId +
            "&CurrencyCode=" +
            this.form.display.CurrencyCode;
        }
      }
      await this.$store.dispatch(
        "features/finance/receivable/receivable_history/actGetPendingReceivable",
        url
      );
    },
    async handleSelectReceivable(row) {
      let exist = false;

      if (Array.isArray(this.form.dataDetails)) {
        for (let i = 0; i < this.form.dataDetails.length; i++) {
          if (
            this.form.dataDetails[i].ReceiveTransactionId ===
            row.ReceiveTransactionId
          ) {
            exist = true;
            break;
          }
        }
      }

      if (!exist) {
        let index = this.form.dataDetails.length;
        this.form.dataDetails.push({
          Index: index,
          ReceiveTransactionId: row.ReceiveTransactionId,
          DocumentNo: row.DocumentNo,
          SoDocNo: row.SoDocumentNo,
          CurrCode: row.CurrencyCode,
          NsDocNo: row.NSDocumentNo,
          OrgDocAmount: row.OriginatingInvoice,
          OriginatingBalance: row.OriginatingBalance,
          existingOriginatingBalance: row.OriginatingBalance,
          OriginatingPaid: 0
        });
      } else {
        this.handleToast(
          "Add Receivable Invoice",
          "warning",
          "Invoice already exist ! Can not insert duplicate invoice."
        );
      }

      this.isShowSelectInvoice = false;
    },
    async deleteRowDetail(index) {
      this.$bvModal
        .msgBoxConfirm("Are you sure ?", {
          title: "Delete Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "blue",
          centered: true,
          headerClass: "p-1 border-bottom-0",
          footerClass: "p-1 border-top-0"
        })
        .then(ok => {
          if (ok) {
            this.form.dataDetails.splice(index, 1);
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    async onFormClose() {
      this.ErrorMessage = "";
      this.isForm = false;
      this.form.isEdit = false;

      this.resetForm();
    },
    resetForm() {
      (this.form.model.ReceivableApplyId = "00000000-0000-0000-0000-000000000000"),
        (this.form.model.TransactionDate = moment().format("YYYY-MM-DD"));
      this.form.model.CheckbookTransactionId =
        "00000000-0000-0000-0000-000000000000";
      this.form.model.ReceiveTransactionId =
        "00000000-0000-0000-0000-000000000000";
      this.form.model.CustomerId = "00000000-0000-0000-0000-000000000000";
      this.form.model.DocumentNo = "";
      this.form.model.DocumentType = "RECEIPT";
      this.form.model.Description = "";
      this.form.model.OriginatingTotalPaid = 0;
      this.form.model.FunctionalTotalpaid = 0;
      this.form.model.Status = 1;
      this.form.model.ARApplyDetails = [];
      this.form.dataDetails = [];

      this.form.display.DocumentDate = moment().format(this.dateFormatString);
      this.form.display.CurrencyCode = "";
      this.form.display.ExchangeRate = 0;
      this.form.display.IsMultiply = true;
      this.form.display.ReffDocumentNo = "";
      this.form.display.CustomerCode = "";
      this.form.display.CustomerName = "";
      this.form.display.AvailableBalance = 0;

      this.form.display.CreatedName = "";
      this.form.display.CreatedDate = "";
      this.form.status.VoidName = "";
      this.form.status.VoidDate = "";

      this.form.display.StatusComment = "";
      this.moneyOptions.precision = 2;

      this.actionButton.AllowSave = true;
      this.actionButton.AllowEdit = true;
      this.actionButton.AllowPosting = false;
      this.actionButton.AllowVoid = false;

      this.$nextTick(() => {
        this.$refs.observer.reset();
      });
    },
    async onFormCreate() {
      this.resetForm();

      this.form.isEdit = false;
      this.isForm = true;
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
    async onSelectedCustomer(item, modelReff) {
      this.form.model.CustomerId = item.CustomerId;
      this.form.display.CustomerName = item.CustomerName;
      this.form.display.CustomerCode = item.CustomerCode;
    },
    async handleEdit(row) {
      this.isForm = true;

      //BINDING EDITTED DATA
      this.form.model.ReceivableApplyId = row.ReceivableApplyId;
      this.form.model.TransactionDate = moment(row.TransactionDate).format(
          "YYYY-MM-DD"
        );
      
      this.form.model.CustomerId = row.CustomerId;
      this.form.model.CheckbookTransactionId = row.CheckbookTransactionId;
      this.form.model.ReceiveTransactionId = row.ReceiveTransactionId;
      this.form.model.DocumentNo = row.DocumentNo;
      this.form.model.DocumentType = row.DocumentType;
      this.form.model.Description = row.Description;
      this.form.model.OriginatingTotalPaid = row.OriginatingTotalPaid;
      this.form.model.FunctionalTotalpaid = row.FunctionalTotalpaid;
      this.form.model.Status = util.docStatus(row.Status);
      this.form.model.ARApplyDetails = [];

      this.form.model.VoidDate = this.form.model.TransactionDate;

      this.form.display.DocumentDate = moment(
        this.form.model.TransactionDate
      ).format(this.dateFormatString);

      this.form.display.CurrencyCode = row.CurrencyCode;
      this.form.display.ExchangeRate = row.ExchangeRate;
      this.form.display.ReffDocumentNo = row.ReffDocumentNo;
      this.form.display.IsMultiply = row.IsMultiply;
      this.form.display.AvailableBalance = row.AvailableBalance;

      this.form.display.CustomerCode = row.CustomerCode;
      this.form.display.CustomerName = row.CustomerName;
      this.form.display.DocumentStatus = row.Status;
      this.form.display.StatusComment = row.StatusComment;
      this.form.display.VoidDate = this.form.display.DocumentDate;

      this.moneyOptions.precision = row.DecimalPlaces;

      this.form.status.VoidName = row.VoidByName;
      this.form.status.VoidDate =
        row.VoidDate != undefined
          ? moment(row.VoidDate).format("DD/MM/YYYY HH:mm:ss")
          : "";

      this.form.display.CreatedName = row.CreatedByName;
      this.form.display.CreatedDate = moment(row.CreatedDate).format(
        "DD/MM/YYYY HH:mm:ss"
      );

      //BEGIN DETAILS
      var details = row.ARApplyDetails;
      let arrDetails = [];
      if (details.length) {
        details.forEach(function(row, index) {
          arrDetails.push({
            Index: index,
            ReceiveTransactionId: row.ReceiveTransactionId,
            DocumentNo: row.DocumentNo,
            SoDocNo: row.SoDocumentNo,
            CurrCode: row.CurrencyCode,
            NsDocNo: row.NsDocumentNo,
            OrgDocAmount: row.OriginatingInvoice,
            OriginatingBalance: row.OriginatingBalance,
            existingOriginatingBalance: row.OriginatingBalance,
            OriginatingPaid: row.OriginatingPaid,
          });
        });
      }

      this.form.dataDetails = arrDetails;

      //END DETAILS

      //ACTIVATE BUTTONS
      if (
        this.form.model.ReceivableApplyId != "" &&
        this.form.model.DocumentNo != ""
      ) {
        if (this.form.model.Status == util.docStatus("New")) {
          this.actionButton.AllowEdit = true;
          this.actionButton.AllowSave = true;
          this.actionButton.AllowPosting = true;
          this.actionButton.AllowVoid = false;
        } else if (this.form.model.Status == util.docStatus("posted")) {
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

      this.form.isEdit = true;
    },
    async doDelete(row) {
      this.showLoader(true);

      await this.$store.dispatch(
        "features/finance/receivable_apply/progress/actDelete",
        row
      );

      var response = this.$store.state.features.finance.receivable_apply.progress
        .resultDelete;
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

        this.handleToast("Confirmation", "success", response.data.Message);
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
          headerClass: "p-1 border-bottom-0",
          footerClass: "p-1 border-top-0"
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

      if (this.form.model.OriginatingTotalPaid > this.form.display.AvailableBalance) {
        valid = false;
        this.handleToast(
          "Warning",
          "danger",
          "Applied amount must not exceed Available balance !"
        );
      }

      if (this.form.model.OriginatingTotalPaid <= 0) {
        valid = false;
        this.handleToast(
          "Warning",
          "danger",
          "Apply amount must be filled !"
        );
      }

      return valid;
    },
    async onSubmit() {
      if (this.validateForm()) {
        this.showLoader(true);

        this.form.model.ARApplyDetails = this.form.dataDetails;

        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/finance/receivable_apply/progress/actUpdate",
            this.form.model
          );
          var response = this.$store.state.features.finance.receivable_apply
            .progress.resultUpdate;

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

            this.$refs.gridProgress.doRefresh();

            this.handleToast("Confirmation", "success", "Successfully updated");
          }
        } else {
          await this.$store.dispatch(
            "features/finance/receivable_apply/progress/actCreate",
            this.form.model
          );
          var response = this.$store.state.features.finance.receivable_apply
            .progress.resultCreate;

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
    async doPostingJournal(row) {
      this.showLoader(true);

      this.form.model.Reason = "";

      await this.$store.dispatch(
        "features/finance/receivable_apply/progress/actPosting",
        this.form.model
      );

      var response = this.$store.state.features.finance.receivable_apply.progress
        .resultUpdate;
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
        .msgBoxConfirm(
          "Posting " +
            this.form.model.DocumentNo +
            " ? (make sure you already save all your changes)",
          {
            title: "Posting Journal Confirmation",
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
    async doVoidJournal(row) {
      this.showLoader(true);

      this.form.model.Reason = this.form.VoidReason;

      await this.$store.dispatch(
        "features/finance/receivable_apply/progress/actVoid",
        this.form.model
      );

      var response = this.$store.state.features.finance.receivable_apply.progress
        .resultUpdate;
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
    /* VOID MODAL */
    resetModal() {
      this.form.VoidReason = "";
      this.voidState = null;
    },
    checkFormValidity() {
      const valid = this.$refs.formvoid.checkValidity();
      this.voidState = valid;
      return valid;
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
    async onModalShowDistJournal(row) {
      this.$refs.dlgDistJournal
        .open(this.form.model.DocumentNo)
        .then(res => {
        })
        .catch(res => {
          console.log(res);
        });
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
  }
</style>
