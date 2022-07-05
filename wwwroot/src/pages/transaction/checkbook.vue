<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm" v-if="isPrint==false">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Checkbook Transaction</span>
                <small>{{ (form.isEdit) ? "Edit" : "New" }}</small>
                <div right style="float:right;">
                  <b-button variant="green"
                            @click="clickSubmitApprove"
                            v-if="form.disabled==false&&form.isEdit&&form.model.ApprovalCode!=null&&form.model.DocumentType=='OUT'&&form.model.Status==1"
                            v-b-tooltip.hover
                            title="Submit For Approval">
                    <font-awesome-icon :icon="['fas', 'check-circle']" />&nbsp;Submit For Approval
                  </b-button>
                  <b-button variant="green"
                            @click="clickPosting"
                            v-if="form.disabled==false&&form.isEdit&&form.model.Status==1&&form.model.DocumentType!='OUT'"
                            v-b-tooltip.hover
                            title="Posting this Transaction">
                    <font-awesome-icon :icon="['fas', 'check-circle']" />&nbsp;Posting
                  </b-button>
                  <b-button variant="green"
                            @click="clickPosting"
                            v-if="form.disabled==false&&form.isEdit&&form.model.Status==1&&form.model.DocumentType=='OUT'&&form.model.ApprovalCode==null"
                            v-b-tooltip.hover
                            title="Posting this Transaction">
                    <font-awesome-icon :icon="['fas', 'check-circle']" />&nbsp;Posting
                  </b-button>
                    <b-button variant="dark" v-if="form.model.DocumentNo != ''" @click="handlePrintOut" v-b-tooltip.hover title="View Print Out">
                      <font-awesome-icon :icon="['fas', 'print']" />
                    </b-button>
                  <b-button variant="green"
                            v-b-modal.modal-approve-reason
                            v-if="form.isEdit&&form.StatusApproval&&form.StatusPosting==false&&form.model.Status==10">
                    <font-awesome-icon :icon="['fas', 'check-circle']"
                                       v-b-tooltip.hover
                                       title="Approve this Transaction" />&nbsp;Approve
                  </b-button>
                  <b-button variant="green"
                            v-b-modal.modal-approveposting-reason
                            v-if="form.isEdit&&form.StatusApproval&&form.StatusPosting==true&&form.model.Status==10">
                    <font-awesome-icon :icon="['fas', 'check-circle']"
                                       v-b-tooltip.hover
                                       title="Approve this Transaction" />&nbsp;Approve & Posting
                  </b-button>
                  <b-button variant="red"
                            v-b-modal.modal-disapprove-reason
                            v-if="form.isEdit&&form.StatusApproval&&form.model.Status==10">
                    <font-awesome-icon :icon="['fas', 'ban']"
                                       v-b-tooltip.hover
                                       title="Approve this Transaction" />&nbsp;Disapprove
                  </b-button>
                  <b-button variant="info"
                            v-if="form.model.DocumentNo != ''"
                            @click="onModalShowDistJournal"
                            v-b-tooltip.hover
                            title="View Distribution Journal">
                    <font-awesome-icon :icon="['fas', 'balance-scale']" />
                  </b-button>
                  <b-button variant="info"
                            @click="isShowTimeline=true"
                            v-if="CommentHistoryLength>0"
                            v-b-tooltip.hover
                            title="View Approval History">
                    <font-awesome-icon :icon="['fas', 'paw']" danger />
                  </b-button>
                  <b-button variant="red" v-b-modal.modal-void-reason v-if="actionButton.AllowVoid">
                    <font-awesome-icon :icon="['fas', 'ban']"
                                       v-b-tooltip.hover
                                       title="Void this Transaction" />&nbsp;Void
                  </b-button>
                  <b-button variant="blue"
                            type="submit"
                            v-if="isSave && actionButton.AllowEdit">
                    <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                  </b-button>
                  <b-button @click="onFormClose">
                    <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                  </b-button>
                </div>
              </div>
              <b-alert show variant="danger" v-if="form.alert.Status=='Disapproved'">
                <a href="#" class="alert-link">{{form.alert.UserFullName}} :</a>
                {{form.alert.Desc}}
              </b-alert>
              <b-row class="mt-3">
                <b-col xl="6" lg="12">
                  <b-card tag="article" class="mb-1">
                    <b-card-text>
                      <b-row class="mt-2">
                        <b-col sm="4">
                          <validation-provider name="DocumentType"
                                               :rules="{ required: true }"
                                               v-slot="validationContext">
                            <b-form-group>
                              <label for="DocumentType">Document Type</label>
                              <b-form-select id="DocumentType"
                                             name="DocumentType"
                                             v-model="form.model.DocumentType"
                                             :state="validateState(validationContext)"
                                             :plain="true"
                                             size="sm"
                                             :options="[{value:'IN',text:'IN'},{value:'OUT',text:'OUT'}]"
                                             aria-describedby="document-type-feedback"
                                             @change="handleChangeDocType()"
                                             :disabled="form.isEdit" />
                              <b-form-invalid-feedback id="document-type-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                            </b-form-group>
                          </validation-provider>
                        </b-col>
                        <b-col sm="4">
                          <label>Document Date</label>
                          <b-input-group>
                            <b-form-input v-model="form.display.DocumentDate"
                                          type="text"
                                          :placeholder="dateFormatString"
                                          class="text-center"
                                          size="sm"
                                          readonly
                                          aria-describedby="doc-date-feedback"></b-form-input>
                            <b-input-group-append v-if="form.disabled==false">
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
                        <b-col sm="4">
                          <validation-provider name="TransactionType"
                                               :rules="{ required: true }"
                                               v-slot="validationContext">
                            <b-form-group>
                              <label for="TransactionType">Checkbook Type</label>
                              <b-form-select id="TransactionType"
                                             name="TransactionType"
                                             v-model="form.model.TransactionType"
                                             :state="validateState(validationContext)"
                                             :plain="true"
                                             size="sm"
                                             :options="arrTransactionType"
                                             aria-describedby="transaction-type-feedback"
                                             :disabled="form.disabled" />
                              <b-form-invalid-feedback id="transaction-type-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                            </b-form-group>
                          </validation-provider>
                        </b-col>
                        <b-col sm="4">
                          <b-form-group>
                            <label for="DocumentNumber">Document Number</label>
                            <b-form-input name="DocumentNumber"
                                          type="text"
                                          placeholder="Document Number"
                                          v-model="form.model.DocumentNo"
                                          size="sm"
                                          readonly />
                          </b-form-group>
                        </b-col>
                        <b-col sm="4">
                          <validation-provider name="Checkbook Code"
                                               :rules="{ required: true }"
                                               v-slot="validationContext">
                            <label>Checkbook Code</label>
                            <b-input-group prepend>
                              <b-form-input size="sm"
                                            v-model="form.model.CheckbookCode"
                                            placeholder="Choose Checkbook"
                                            readonly
                                            :state="validateState(validationContext)"
                                            aria-describedby="checkbook-feedback"></b-form-input>
                              <b-input-group-append v-if="form.isEdit==false">
                                <b-button size="sm"
                                          variant="outline-primary"
                                          @click="isShowCheckbook=true">
                                  <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                </b-button>
                              </b-input-group-append>
                              <b-form-invalid-feedback id="checkbook-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                            </b-input-group>
                          </validation-provider>
                        </b-col>
                        <b-col sm="4">
                          <b-form-group>
                            <label for="BankAccountCode">Bank Account</label>
                            <b-form-input name="BankAccountCode"
                                          type="text"
                                          placeholder="Bank Account"
                                          v-model="form.model.BankAccountCode"
                                          size="sm"
                                          readonly />
                          </b-form-group>
                        </b-col>
                        <b-col sm="4">
                          <b-form-group>
                            <label for="CurrencyCode">Currency Code</label>
                            <b-form-input name="CurrencyCode"
                                          type="text"
                                          placeholder="Currency Code"
                                          v-model="form.model.CurrencyCode"
                                          size="sm"
                                          readonly />
                          </b-form-group>
                        </b-col>
                        <b-col sm="4">
                          <label>Rate Amount</label>
                          <validation-provider name="Rate Amount"
                                               :rules="{ required: true, min_value:1 }"
                                               v-slot="validationContext">
                            <b-input-group :prepend="form.display.CurrencySymbol" size="sm">
                              <money v-model="form.model.ExchangeRate"
                                     v-bind="moneyOptions"
                                     style="width:135px;"
                                     size="sm"
                                     :state="validateState(validationContext)"
                                     :class="validationContext.errors.length == 0 ? 'currency-money-field is-valid' : 'currency-money-field is-invalid'"
                                     disabled
                                     aria-describedby="rate-amount-feedback"></money>
                              <b-input-group-append v-if="form.disabled==false&&form.model.TransactionDate != '' && form.model.CurrencyCode != ''">
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
                    </b-card-text>
                  </b-card>
                </b-col>
                <b-col xl="4" lg="8">
                  <b-card tag="article" class="mb-1">
                    <b-card-text>
                      <b-row class="mt-2">
                        <b-col sm="12">
                          <validation-provider :v-bind="DocTypeSelect2"
                                               :rules="{ required: true }"
                                               v-slot="validationContext">
                            <b-form-group>
                              <label>{{DocTypeSelect2}}</label>
                              <b-form-input :name="DocTypeSelect2"
                                            type="text"
                                            placeholder
                                            v-model="form.model.PaidSubject"
                                            size="sm"
                                            :state="validateState(validationContext)"
                                            aria-describedby="paid-from-feedback"
                                            :disabled="form.disabled" />
                              <b-form-invalid-feedback id="paid-from-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                            </b-form-group>
                          </validation-provider>
                        </b-col>
                        <b-col sm="6">
                          <label>{{DocTypeSelect}} Code</label>
                          <b-input-group prepend>
                            <b-form-input size="sm"
                                          v-model="form.model.SubjectCode"
                                          :placeholder="DocTypeSelect"
                                          disabled></b-form-input>
                            <b-input-group-append v-if="form.disabled==false">
                              <b-button size="sm"
                                        variant="outline-primary"
                                        @click="onModalSearch('SubjectCode')">
                                <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                              </b-button>
                              <b-button size="sm"
                                        variant="outline-primary"
                                        @click="handleCancelSubject()"
                                        v-if="form.model.SubjectCode!=''">
                                <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                              </b-button>
                            </b-input-group-append>
                          </b-input-group>
                        </b-col>
                        <b-col sm="6">
                          <b-form-group>
                            <label>{{DocTypeSelect}} Name</label>
                            <b-form-input :name="DocTypeSelect"
                                          type="text"
                                          :placeholder="DocTypeSelect"
                                          v-model="form.model.SubjectName"
                                          size="sm"
                                          readonly />
                          </b-form-group>
                        </b-col>
                      </b-row>
                    </b-card-text>
                  </b-card>
                </b-col>
                <b-col xl="2" lg="3" v-if="form.isEdit">
                  <b-card bg-variant="dark"
                          text-variant="white">
                    <h5>{{ form.display.DocumentStatus }}</h5>
                    <b-card-text>
                      <div v-if="form.CurrentApproval != ''">
                        <label>
                          <small>Current Approver :</small>
                          <br />
                          <code>{{form.CurrentApproval}}</code>
                        </label>
                      </div>
                      <div v-if="form.display.DocumentStatus == 'Void'">
                        <label>
                          <small>Void By :</small>
                          <br />
                          <small>{{form.status.VoidName}}</small>
                        </label>
                        <label>
                          <small>Void Date :</small>
                          <br />
                          <small>{{form.status.VoidDate}}</small>
                        </label>
                        <label>
                          <small>Comments :</small>
                          <br />
                          {{form.display.StatusComment}}
                        </label>
                      </div>
                      <div v-else>
                        <label>
                          <small>Created By :</small>
                          <br />
                          <small>{{form.display.CreatedName}}</small>
                        </label>
                        <label>
                          <small>Created Date :</small>
                          <br />
                          <small>{{form.display.CreatedDate}}</small>
                        </label>
                      </div>
                    </b-card-text>
                  </b-card>
                </b-col>
                <b-col sm="12">
                  <b-row>
                    <b-col sm="12">
                      <validation-provider name="Description"
                                           :rules="{ required: true }"
                                           v-slot="validationContext">
                        <b-form-group>
                          <label for="Description">Description</label>
                          <b-form-textarea name="Description"
                                           type="text"
                                           placeholder
                                           v-model="form.model.Description"
                                           size="sm"
                                           :state="validateState(validationContext)"
                                           aria-describedby="description-feedback" />
                          <b-form-invalid-feedback id="description-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                      </validation-provider>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
              <b-row class="mb-2"
                     v-if="form.disabled==false&&form.model.Status==0||form.disabled==false&&form.model.Status==1">
                <b-col>
                  <b-button :disabled="form.model.CheckbookCode==''||form.model.DocumentType==''"
                            variant="yellow"
                            size="sm"
                            type="submit"
                            @click.prevent="onModalSearchCharges('ChargesCode','ChargesCode','checkbook')">
                    <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;Add
                  </b-button>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <table id="table-sub">
                    <thead>
                      <tr>
                        <th class="text-center" rowspan="2" style="vertical-align: middle;">
                          <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
                        </th>
                        <th class="text-left">CHARGES CODE</th>
                        <th class="text-left" width="700">CHARGES NAME</th>
                        <th class="text-center">ORIGINATING AMOUNT</th>
                      </tr>
                      <tr>
                        <th class="text-left" colspan="2">DESCRIPTION</th>
                        <th class="text-center" width="100">FUNCTIONAL AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody class="position-relative">
                      <template v-for="(item, itemIndex) in dataDetails">
                        <tr>
                          <td rowspan="2">
                            <b-button v-if="form.disabled==false&&form.model.Status==0||form.disabled==false&&form.model.Status==1"
                                      variant="outline-danger"
                                      pill
                                      size="sm">
                              <font-awesome-icon :icon="['fas', 'trash']"
                                                 @click="DeleteCharges(itemIndex)" />
                            </b-button>
                          </td>
                          <td>
                            <b-form-input placeholder="Charges Code"
                                          type="text"
                                          size="sm"
                                          v-model="item.ChargesCode"
                                          readonly />
                          </td>
                          <td>
                            <b-form-input placeholder="Charges Name"
                                          type="text"
                                          size="sm"
                                          v-model="item.ChargesName"
                                          readonly />
                          </td>
                          <td>
                            <money v-model="item.OriginatingAmount"
                                   v-bind="moneyOptions"
                                   size="sm"
                                   class="currency-money-field"
                                   @input="onInputOriginating(itemIndex)"
                                   :disabled="form.disabled"></money>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2">
                            <b-form-input placeholder="Description"
                                          type="text"
                                          size="sm"
                                          v-model="item.ChargesDescription"
                                          :readonly="form.disabled" />
                          </td>
                          <td>
                            <money v-model="item.FunctionalAmount"
                                   v-bind="moneyOptions"
                                   size="sm"
                                   class="currency-money-field"
                                   disabled></money>
                          </td>
                        </tr>
                      </template>
                      <tr>
                        <th class="text-right" colspan="3">ORIGINATING TOTAL AMOUNT</th>
                        <td>
                          <money v-model="form.model.OriginatingTotalAmount"
                                 v-bind="moneyOptions"
                                 size="sm"
                                 class="currency-money-field"
                                 disabled></money>
                        </td>
                      </tr>
                      <tr>
                        <th class="text-right" colspan="3">FUNCTIONAL TOTAL AMOUNT</th>
                        <td>
                          <money v-model="form.model.FunctionalTotalAmount"
                                 v-bind="moneyOptions"
                                 size="sm"
                                 class="currency-money-field"
                                 disabled></money>
                        </td>
                      </tr>
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
    <b-tabs pills card v-show="!isForm" v-if="isPrint==false">
      <b-tab active>
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'tasks']" />&nbsp;Progress
        </template>
        <b-row>
          <b-col cols="12" sm="12">
            <b-card width="100%">
              <DataGrid ref="gridCheckbook"
                        :fields="this.$store.state.features.finance.checkbook.checkbook_progress.headers"
                        :items="this.$store.state.features.finance.checkbook.checkbook_progress.data"
                        :info="this.$store.state.features.finance.checkbook.checkbook_progress.listInfo"
                        :baseUrl="this.$store.state.features.finance.checkbook.checkbook_progress.baseUrl"
                        :actGetData="handleGetCheckbook"
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
                        :caption="caption1"></DataGrid>
            </b-card>
          </b-col>
        </b-row>
      </b-tab>
      <b-tab @click="History">
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'history']" />&nbsp;History
        </template>
        <b-row v-show="!isForm">
          <b-col cols="12" sm="12">
            <b-card width="100%">
              <DataGrid ref="gridCheckbookHistory"
                        :fields="this.$store.state.features.finance.checkbook.checkbook_history.headers"
                        :items="this.$store.state.features.finance.checkbook.checkbook_history.data"
                        :info="this.$store.state.features.finance.checkbook.checkbook_history.listInfo"
                        :baseUrl="this.$store.state.features.finance.checkbook.checkbook_history.baseUrl"
                        :actGetData="handleGetCheckbookHistory"
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
                        :caption="caption2"
                        disableNewButton
                        historical></DataGrid>
            </b-card>
          </b-col>
        </b-row>
      </b-tab>
    </b-tabs>
    <div id="page-dialogs" height="100%">
      <DistributionJournalModal ref="dlgDistJournal"></DistributionJournalModal>
      <CustomerModal ref="dlgCustomModal"
                     :actSelectedRow="onSelected"
                     v-if="DocTypeSelect=='Customer'"></CustomerModal>
      <VendorModal ref="dlgCustomModal" :actSelectedRow="onSelected" v-if="DocTypeSelect=='Vendor'"></VendorModal>
      <ChargesModal ref="dlgCharges" :actSelectedRow="onSelectedCharges"></ChargesModal>
      <ExchangeRateModal ref="dlgExchangeRate" :actSelectedRow="onSelectedExchangeRate"></ExchangeRateModal>

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
                <b-input-group-append v-if="actionButton.AllowVoid">
                  <b-form-datepicker v-model="form.model.VoidDate"
                                     button-only
                                     size="sm"
                                     left
                                     @input="dateChangedVoid"
                                     :min="form.model.TransactionDate"
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
                              autocomplete="false"
                              required></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
        </form>
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
            <b-form-input id="name-input" v-model="form.VoidReason" :state="approveState" required></b-form-input>
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
                      style="margin-left:5px;">Disapprove</b-button>
            <b-button variant="primary"
                      size="sm"
                      class="float-right"
                      @click="handleOkRevise"
                      style="margin-left:5px;">Revise</b-button>
            <b-button size="sm" class="float-right" @click="handleCancel">Cancel</b-button>
          </div>
        </template>
      </b-modal>
      <b-modal v-model="isShowTimeline" hide-footer size="lg" title="Approval History">
        <table id="table-sub">
          <thead>
            <tr>
              <th class="text-center">DATE TIME</th>
              <th class="text-left">NAME</th>
              <th class="text-center">STATUS</th>
              <th class="text-left">REASON / COMMENTS</th>
            </tr>
          </thead>
          <tbody class="position-relative">
            <tr v-for="(item, Index) in CommentHistory">
              <td class="text-center"
                  width="130px">
                {{item.CommentDate | formattedDMY('DD/MM/YYYY hh:mm:ss') }}
              </td>
              <td class="text-left" width="180px">{{item.UserFullName}}</td>
              <td class="text-center" style="font-size:16px" width="100px">
                <b-badge :variant="item.StatusColor">{{item.Status}}</b-badge>
              </td>
              <td class="text-left">{{item.Comments}}</td>
            </tr>
          </tbody>
        </table>
      </b-modal>
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

      <b-modal v-model="isShowRateType" hide-footer size="lg">
        <template v-slot:modal-title>
          Rate Type Detail
        </template>
        <div class="d-block">
          <b-row>
            <b-col sm="4">
              <b-form-group>
                <label for="CurrencyCode">Currency Code</label>
                <b-form-input name="CurrencyCode"
                              type="text"
                              placeholder="Currency Code"
                              v-model="form.model.CurrencyCode"
                              size="sm"
                              readonly />
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group>
                <label for="CurrencyCode">Rate Type</label>
                <b-form-select id="RateType"
                               name="RateType"
                               v-model="form.model.RateType"
                               :plain="true"
                               size="sm"
                               :options="listRateType"
                               @change="handleGetExchangeRate()" />
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group>
                <label for="ExchangeRate">Rate Amount</label>
                <b-form-input name="ExchangeRate"
                              type="text"
                              placeholder="Rate Amount"
                              v-model="form.model.ExchangeRate"
                              size="sm"
                              disabled />
              </b-form-group>
            </b-col>
          </b-row>
        </div>
        <b-button class="mt-3"
                  style="float:right;"
                  @click="handleGetExchangeRate('OK')"
                  variant="blue">
          <font-awesome-icon :icon="['fas', 'check']" />&nbsp;OK
        </b-button>
      </b-modal>
    </div>
    
  </div>
</template>
<script>
  import DataGrid from "@/components/Tables/DataGrid";
  import VueElementLoading from "vue-element-loading";
  import SelectGrid from "@/components/Tables/SelectGrid";
  import loginServices from '../../services/loginservices'
  import {
    CustomerModal,
    VendorModal,
    ChargesModal,
    ExchangeRateModal,
    DistributionJournalModal
  } from "@/pages/modal/index.js";
  import moment from "moment";
  import util from "@/helper/utils";

  export default {
    name: "Checkbook",
    layout: "dashboard",
    components: {
      DataGrid,
      VueElementLoading,
      SelectGrid,
      CustomerModal,
      VendorModal,
      ChargesModal,
      ExchangeRateModal,
      DistributionJournalModal,
    },
    data: () => {
      return {
        isPrint: false,
        dataPrint: [],
        actionButton: {
          AllowSave: true,
          AllowEdit: true,
          AllowPosting: false,
          AllowVoid: false
        },
        caption1: "Checkbook - Progress",
        caption2: "Checkbook - History",
        blockLoader: false,
        isForm: false,
        isShowCheckbook: false,
        isShowRateType: false,
        isShowTimeline: false,
        minCalendarDate: moment().format("YYYY-01-01"),
        dateFormatString: "DD/MM/YYYY",
        listRateType: [],
        dataDetails: [],
        arrTransactionType: [],
        //DataGrid HEADERS Declarations, you can
        headerFields: [],
        alert: "",
        ErrorMessage: "",
        financialSetup: [],
        CommentHistory: [],
        CommentHistoryLength: 0,
        defaultRateType: 0,
        voidState: null,
        approveState: null,
        disapproveState: null,
        approvepostingState: null,
        form: {
          disabled: true,
          StatusApproval: false,
          StatusPosting: false,
          CurrentApproval: "",
          isEdit: false,
          model: {
            CheckbookTransactionId: null,
            DocumentType: "",
            CheckbookCode: "",
            DocumentNo: "",
            CurrencyCode: "",
            SubjectCode: "",
            SubjectName: "",
            TransactionDate: "",
            FunctionalTotalAmount: 0,
            OriginatingTotalAmount: 0,
            RequestCheckbookDetails: [],
            PaidSubject: "",
            Status: 0,
            PersonId: "",
            CurrentIndex: 0,
            IsMultiply: true,
            VoidDate: moment().format("YYYY-MM-DD")
          },
          display: {
            DocumentDate: moment().format("DD/MM/YYYY"),
            CurrencySymbol: "",
            DocumentStatus: "",
            CreatedName: "",
            CreatedDate: "",
            StatusComment: "",
            VoidName: "",
            VoidDate: moment().format("DD/MM/YYYY")
          },
          status: {
            VoidName: "",
            VoidDate: moment().format("DD/MM/YYYY")
          },
          alert: {
            Status: 0,
            Desc: "",
            UserFullName: ""
          }
        },
        DocTypeSelect: "",
        DocTypeSelect2: "",
        moneyOptions: {
          decimal: ",",
          thousands: ".",
          prefix: "",
          suffix: "",
          decimalLength: 2,
          masked: false,
          allowBlank: false,
          min: 0
          //max: Number.MAX_SAFE_INTEGER
        }
      };
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
      // maxVoidCalendarDate() {
      //   let trxDate = moment(this.form.model.TransactionDate, "YYYY-MM-DD");
      //   if (moment() <= trxDate) {
      //     return this.form.model.TransactionDate;
      //   } else {
      //     return moment().format("YYYY-MM-DD");
      //   }
      // }
    },
    filters: {
      formattedDMY: function (value, dateFormat) {
        if (dateFormat == undefined) dateFormat = "DD/MM/YYYY ";
        return moment(value).utc().format(dateFormat);
      }
    },
    computed: {
      isSave() {
        return this.form.isEdit ? this.$store.state.roleaccess.AllowEdit : true;
      }
    },
    async mounted() {
      if (this.$refs.gridCheckbook != null) {
        await this.$refs.gridCheckbook.doRefresh();
      }

      await this.$store.dispatch(
        "features/company/checkbook/actGetCheckbook",
        "Checkbook?&InActive=false"
      );

      var arrRate = [];
      await this.$store.dispatch(
        "features/finance/constants/actGet",
        this.$store.state.features.finance.constants.ACTION_TYPE.RATE_TYPE
      );
      this.$store.state.features.finance.constants.data.forEach(function (
        row,
        index
      ) {
        arrRate.push({ value: row.RateType, text: row.Caption });
      });
      this.listRateType = arrRate;
      this.form.PersonId = this.$store.state.user;
    },
    methods: {
       async handlePrintOut(){
        let routeData = this.$router.resolve(
        {
          path: '/nofpage/print/preview', 
          query: {
            'DocType': 'checkbook_voucher', 
            'DocId' : this.form.model.CheckbookTransactionId, 
            'FileName' : this.form.model.DocumentNo }
        });
        
        var newWindow = window.open('', '_blank');
        newWindow.location.assign(routeData.href);
      },
      validateState({ dirty, validated, valid = null }) {
        return dirty || validated ? valid : null;
      },
      resetForm() {
        this.form.status.VoidName = "";
        this.form.status.VoidDate = "";

        this.actionButton.AllowSave = true;
        this.actionButton.AllowEdit = true;
        this.actionButton.AllowPosting = false;
        this.actionButton.AllowVoid = false;

        this.$nextTick(() => {
          this.$refs.observer.reset();
        });
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
          title: toastTitle != "" ? toastTitle : "Confirmation",
          variant: style != "" ? style : "info",
          //toaster: 'b-toaster-bottom-center',
          autoHideDelay: 5000,
          appendToast: false
        });
      },
      async onSelectedExchangeRate(item) {
        if (item != undefined) {
          this.form.model.ExchangeRate = item.ExchangeRateAmount;
          this.form.model.IsMultiply = item.CalcIsMultiply;
        }
      },
      async openModalExchangeRate(row) {
        this.$refs.dlgExchangeRate
          .open(
            this.form.model.CurrencyCode,
            this.form.model.TransactionDate,
            this.form.defaultRateType,
            this.moneyOptions
          )
          .then(res => {
            //console.log(res);
          })
          .catch(res => {
            //console.log(res);
          });
      },
      async dateChanged() {
        this.form.display.DocumentDate = "";
        if (this.form.model.TransactionDate != null)
          this.form.display.DocumentDate = moment(
            this.form.model.TransactionDate
          ).format(this.dateFormatString);

        await this.changeCurrentExchangeRate();
      },
      async dateChangedVoid() {
        this.form.display.VoidDate = "";
        if (this.form.model.VoidDate != null)
          this.form.display.VoidDate = moment(this.form.model.VoidDate).format(
            this.dateFormatString
          );

        await this.changeCurrentExchangeRate();
      },
      async changeCurrentExchangeRate() {
        this.form.model.ExchangeRate = 1;

        //OBTAIN DEFAULT EXCHANGE RATE AMOUNT
        if (this.form.model.CurrencyCode != "" && this.form.defaultRateType > 0) {
          await this.$store.dispatch(
            "features/company/exchange_rate_header/actGetCurrentExchangeRate",
            "GetCurrentExchangeRate?CurrencyCode=" +
            this.form.model.CurrencyCode +
            "&TransactionDate=" +
            this.form.model.TransactionDate +
            "&RateType=" +
            this.form.defaultRateType
          );
          this.form.model.ExchangeRate = this.$store.state.features.company.exchange_rate_header.dataExcRate;
        }
      },
      async onInputOriginating(index) {
        this.dataDetails[index].FunctionalAmount = this.form.model.IsMultiply
          ? this.dataDetails[index].OriginatingAmount *
          this.form.model.ExchangeRate
          : this.dataDetails[index].OriginatingAmount /
          this.form.model.ExchangeRate;
        var OriginatingTotalAmount = 0;
        var FunctionalTotalAmount = 0;
        this.dataDetails.forEach(function (row, index) {
          OriginatingTotalAmount += row.OriginatingAmount;
          FunctionalTotalAmount += row.FunctionalAmount;
        });
        this.form.model.OriginatingTotalAmount = OriginatingTotalAmount;
        this.form.model.FunctionalTotalAmount = FunctionalTotalAmount;
      },
      async DeleteCharges(index) {
        this.$bvModal
          .msgBoxConfirm("Are you sure?", {
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
              this.dataDetails.splice(index, 1);
            }
          })
          .catch(err => {
            // An error occurred
          });
      },
      async onModalSearchCharges(row) {
        if (this.form.model.ExchangeRate < 1) {
          this.handleToast(
            "Confirmation",
            "danger",
            "Rate amount must greater than 0"
          );
        } else {
          this.$refs.dlgCharges
            .open(
              row,
              this.form.model[row],
              this.form.financialSetup[0].CheckbookChargesType,
              "Checkbook"
            )
            .then(res => {
              console.log(res);
            })
            .catch(res => {
              console.log(res);
            });
        }
      },
      onSelectedCharges(row) {
        this.dataDetails.push({
          Index: this.dataDetails.length,
          ChargesId: row.ChargesId,
          ChargesCode: row.ChargesCode,
          ChargesName: row.ChargesName,
          OriginatingAmount: 0,
          FunctionalAmount: 0,
          ChargesDescription: ""
        });
      },

      /* VOID MODAL */
      resetModal() {
        this.form.VoidReason = "";
        this.voidState = null;
      },
      checkFormValidity(form) {
        if (form == "void") {
          const valid = this.$refs.formvoid.checkValidity();
          this.voidState = valid;
          return valid;
        } else if (form == "approve") {
          const valid = this.$refs.formapprove.checkValidity();
          this.voidState = valid;
          return valid;
        } else if (form == "disapprove") {
          const valid = this.$refs.formdisapprove.checkValidity();
          this.voidState = valid;
          return valid;
        } else {
          const valid = this.$refs.formapproveposting.checkValidity();
          this.voidState = valid;
          return valid;
        }
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault();
        // Trigger submit handler
        this.handleVoid();
      },
      handleOkApprove(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault();
        // Trigger submit handler
        this.handleApprove();
      },
      handleOkApprovePosting(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault();
        // Trigger submit handler
        this.handleApprovePosting();
      },
      handleOkDisApprove(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault();
        // Trigger submit handler
        this.handleDisApprove();
      },
      handleOkRevise(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault();
        // Trigger submit handler
        this.handleRevise();
      },
      handleCancel(bvModalEvt) {
        this.resetModal();
        // Prevent modal from closing
        this.$bvModal.hide("modal-void-reason");
        this.$bvModal.hide("modal-approve-reason");
        this.$bvModal.hide("modal-disapprove-reason");
      },
      handleVoid() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity("void")) {
          return;
        }
        // Push the name to submitted names
        this.doVoid();

        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide("modal-void-reason");
        });
      },
      handleApprove() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity("approve")) {
          return;
        }
        // Push the name to submitted names
        this.doApprove();

        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide("modal-approve-reason");
        });
      },
      handleApprovePosting() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity("approveposting")) {
          return;
        }
        // Push the name to submitted names
        this.doApprovePosting();

        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide("modal-approveposting-reason");
        });
      },
      handleDisApprove() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity("disapprove")) {
          return;
        }
        // Push the name to submitted names
        this.doDisApprove();

        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide("modal-disapprove-reason");
        });
      },
      handleRevise() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity("disapprove")) {
          return;
        }
        // Push the name to submitted names
        this.doRevise();

        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide("modal-disapprove-reason");
        });
      },
      async doVoid(row) {
        this.showLoader(true);

        this.form.model.Reason = this.form.VoidReason;

        await this.$store.dispatch(
          "features/finance/checkbook/checkbook_progress/actVoid",
          this.form.model
        );

        var response = this.$store.state.features.finance.checkbook
          .checkbook_progress.resultUpdate;
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

          this.$refs.gridCheckbookHistory.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },
      async doApprove(row) {
        this.showLoader(true);

        this.form.model.Reason = this.form.VoidReason;
        this.form.model.PersonId = this.$store.state.user;

        await this.$store.dispatch(
          "features/finance/checkbook/checkbook_progress/actApprove",
          this.form.model
        );

        var response = this.$store.state.features.finance.checkbook
          .checkbook_progress.resultUpdate;
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

          this.$refs.gridCheckbook.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },
      async doApprovePosting(row) {
        this.showLoader(true);

        this.form.model.Reason = this.form.VoidReason;
        this.form.model.PersonId = this.$store.state.user;

        await this.$store.dispatch(
          "features/finance/checkbook/checkbook_progress/actApprovePost",
          this.form.model
        );

        var response = this.$store.state.features.finance.checkbook
          .checkbook_progress.resultUpdate;
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

          this.$refs.gridCheckbook.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },
      async onModalShowDistJournal(row) {
        this.$refs.dlgDistJournal
          .open(this.form.model.DocumentNo)
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async doDisApprove(row) {
        this.showLoader(true);

        this.form.model.Reason = this.form.VoidReason;
        this.form.model.PersonId = this.$store.state.user;

        await this.$store.dispatch(
          "features/finance/checkbook/checkbook_progress/actDisApprove",
          this.form.model
        );

        var response = this.$store.state.features.finance.checkbook
          .checkbook_progress.resultUpdate;
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

          this.$refs.gridCheckbook.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },
      async doRevise(row) {
        this.showLoader(true);

        this.form.model.Reason = this.form.VoidReason;
        this.form.model.PersonId = this.$store.state.user;

        await this.$store.dispatch(
          "features/finance/checkbook/checkbook_progress/actRevise",
          this.form.model
        );

        var response = this.$store.state.features.finance.checkbook
          .checkbook_progress.resultUpdate;
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

          this.$refs.gridCheckbook.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },
      /* END VOID MODAL */
      async handleShowRateType() {
        if (
          this.form.model.TransactionDate == "" ||
          this.form.model.CheckbookCode == ""
        ) {
          this.handleToast(
            "Confirmation",
            "danger",
            "Please Select Document Date And Checkbook Code"
          );
        } else {
          this.isShowRateType = true;
        }
      },
      async onModalSearch(row) {
        this.$refs.dlgCustomModal
          .open(row, this.form.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onSelected(item, modelReff) {
        if (this.DocTypeSelect == "Customer") {
          this.form.model[modelReff] = item.CustomerCode;
          this.form.model.SubjectName = item.CustomerName;
        } else {
          this.form.model[modelReff] = item.VendorCode;
          this.form.model.SubjectName = item.VendorName;
        }
      },
      async handleChangeDocType() {
        if (this.form.model.DocumentType == "IN") {
          this.DocTypeSelect = "Customer";
          this.DocTypeSelect2 = "From";
          this.form.model.SubjectCode = "";
          this.form.model.SubjectName = "";
          this.arrTransactionType = [
            { value: "NORMAL", text: "NORMAL" },
            { value: "ADVANCE RECEIPT", text: "ADVANCE RECEIPT" }
          ];
        } else {
          this.DocTypeSelect = "Vendor";
          this.DocTypeSelect2 = "Paid To";
          this.form.model.SubjectCode = "";
          this.form.model.SubjectName = "";
          this.arrTransactionType = [
            { value: "NORMAL", text: "NORMAL" },
            { value: "ADVANCE PAYMENT", text: "ADVANCE PAYMENT" }
          ];
        }
      },
      async handleGetExchangeRate(state) {

        await this.$store.dispatch(
          "features/company/exchange_rate_header/actGetCurrentExchangeRate",
          "GetCurrentExchangeRate?CurrencyCode=" +
          this.form.model.CurrencyCode +
          "&TransactionDate=" +
          this.form.model.TransactionDate +
          "&RateType=" +
          this.form.defaultRateType
        );
        this.form.model.ExchangeRate = this.$store.state.features.company.exchange_rate_header.dataExcRate;
        if (state == "OK") {
          this.isShowRateType = false;
        }
      },
      async handleGetCheckbookSelect(url) {

         if (url.toLowerCase().lastIndexOf("InActive") < 0) {
          url = url + "&InActive=false";
        } else {
          var clean_uri = url
            .toLowerCase()
            .substring(0, url.indexOf("&InActive"));
          url =
            clean_uri + "&InActive=false";
        }

        if (url.lastIndexOf("Checkbook") < 0) {
          url = "Checkbook?" + url;
        }

        await this.$store.dispatch(
          "features/company/checkbook/actGetCheckbook",
          url
        );

        this.$refs.gridCheckbookSelect.doRefresh();
      },
      async handleSelectCheckbook(row) {
        
        this.form.model.CheckbookCode = row.CheckbookCode;
        this.form.model.CheckbookName = row.CheckbookName;
        this.form.model.CurrencyCode = row.CurrencyCode;
        this.form.model.BankAccountCode = row.BankAccountCode;
        this.form.model.ExchangeRate = 0;

        await this.$store.dispatch(
          "features/company/financial_setup/actGet",
          "FinancialSetup?FuncCurrencyCode=" + this.form.model.CurrencyCode
        );
        this.form.financialSetup = this.$store.state.features.company.financial_setup.data;

        this.form.defaultRateType = this.form.financialSetup[0].DefaultRateType;
        if (
          this.form.financialSetup[0].FuncCurrencyCode ==
          this.form.model.CurrencyCode
        ) {
          this.form.model.ExchangeRate = 1;
        }else{
          await this.handleGetExchangeRate();
        }

        this.isShowCheckbook = false;
      },
      async onFormClose() {
        this.ErrorMessage = "";
        this.isForm = false;
        this.form.isEdit = false;

        this.resetForm();
      },
      async onFormCreate() {
        this.form.disabled = false;
        this.ErrorMessage = "";
        this.form.model.CheckbookTransactionId = "";
        this.form.model.DocumentType = "IN";
        this.form.model.CheckbookCode = "";
        this.form.model.DocumentNo = "";
        this.form.model.CurrencyCode = "";
        this.form.model.ExchangeRate = 1;
        this.form.model.Status = 0;
        this.form.status.VoidName = "";
        this.form.status.VoidDate = "";
        this.form.model.OriginatingTotalAmount = 0;
        this.form.model.FunctionalTotalAmount = 0;

        this.form.model.TransactionDate = moment().format("YYYY-MM-DD");
        this.form.display.DocumentDate = moment().format(this.dateFormatString);
        this.form.display.DocumentStatus = "";
        this.form.display.StatusComment = "";
        this.form.display.VoidName = "";
        this.form.display.VoidDate = "";

        this.form.display.CreatedName = "";
        this.form.display.CreatedDate = "";

        this.form.model.TransactionType = "NORMAL";
        this.form.model.SubjectCode = "";
        this.form.model.PaidSubject = "";
        this.form.model.Description = "";
        this.form.model.SubjectName = "";
        this.form.model.BankAccountCode = "";
        this.form.model.ApprovalCode = "";
        this.form.StatusApproval = false;
        this.form.StatusPosting = false;

        this.form.alert.Status = "";
        this.form.alert.Desc = "";
        this.form.alert.UserFullName = "";
        this.CommentHistoryLength = "";

        this.CommentHistoryLength = 0;
        this.dataDetails = [];
        this.CommentHistory = [];
        this.form.isEdit = false;
        this.isForm = true;
        await this.handleChangeDocType();
        this.resetForm();
      },
      async handleEdit(row) {
        this.form.disabled = true;
        if (this.$store.state.user == row.CreatedBy) {
          this.form.disabled = false;
        }
        if (util.docStatus(row.Status) != util.docStatus("New")) {
          this.form.disabled = true;
        }
        this.CommentHistory = [];
        var subject = "";
        this.form.model.Status = util.docStatus(row.Status);
        this.form.model.ApprovalCode = row.ApprovalCode;
        if (row.DocumentType == "IN") {
          await this.$store.dispatch(
            "features/company/customer/actGetData",
            "Customer?CustomerCode=" + row.SubjectCode
          );
          subject = this.$store.state.features.company.customer.data;
          this.form.StatusApproval = false;
          this.form.StatusPosting = false;
          this.form.CurrentApproval = "";
          this.form.alert.Status = "";
          this.form.alert.Desc = "";
          this.form.alert.UserFullName = "";
          this.CommentHistoryLength = "";
        } else {
          await this.$store.dispatch(
            "features/company/vendor/actGetVendor",
            "Vendor?VendorCode=" + row.SubjectCode
          );
          subject = this.$store.state.features.company.vendor.data;

          //getcurrentuserapprove
          if (
            util.docStatus(row.Status) == util.docStatus("Process") &&
            row.ApprovalCode != null
          ) {
            await this.$store.dispatch(
              "features/finance/checkbook/checkbook_progress/actGetUserApproval",
              "GetUserApproval?CheckbookTransactionId=" +
              row.CheckbookTransactionId +
              "&PersonId=" +
              this.$store.state.user
            );
            var cekApprove = this.$store.state.features.finance.checkbook
              .checkbook_progress.resultApprove;
            this.form.model.CurrentIndex = cekApprove.CurrentIndex;
            this.form.StatusApproval = cekApprove.StatusApproval;
            this.form.StatusPosting = cekApprove.StatusPosting;
            this.form.CurrentApproval = cekApprove.CurrentApproval;
          } else {
            this.form.CurrentApproval = "";
          }
          //getcomment
          await this.$store.dispatch(
            "features/finance/checkbook/checkbook_history/actGetApprovalComment",
            "GetApprovalComment?CheckbookTransactionId=" +
            row.CheckbookTransactionId
          );
          this.CommentHistory = this.$store.state.features.finance.checkbook.checkbook_history.dataComment;
          this.form.alert.Status = "";
          this.form.alert.Desc = "";
          if (this.CommentHistory.length > 0) {
            this.form.alert.Status = this.CommentHistory[0].Status;
            this.form.alert.Desc = this.CommentHistory[0].Comments;
            this.form.alert.UserFullName = this.CommentHistory[0].UserFullName;
          }
        }
        
        this.CommentHistoryLength = this.CommentHistory.length;
        this.form.model.DocumentType = row.DocumentType;
        await this.handleChangeDocType();
        this.ErrorMessage = "";
        this.form.model.CheckbookTransactionId = row.CheckbookTransactionId;
        this.form.model.CheckbookCode = row.CheckbookCode;
        this.form.model.DocumentNo = row.DocumentNo;
        this.form.model.CurrencyCode = row.CurrencyCode;
        this.form.model.ExchangeRate = row.ExchangeRate;

        this.form.model.TransactionDate = moment(row.TransactionDate).format(
          "YYYY-MM-DD"
        );

        this.form.model.VoidDate = this.form.model.TransactionDate;

        this.form.display.DocumentDate = moment(
          this.form.model.TransactionDate
        ).format(this.dateFormatString);

        this.form.display.DocumentStatus = row.Status;
        this.form.display.StatusComment = row.StatusComment;
        this.form.display.VoidName = row.VoidByName;

        this.form.display.VoidDate = this.form.display.DocumentDate;

        this.form.display.CreatedName = row.CreatedName;
        this.form.display.CreatedDate = moment(row.CreatedDate).format(
          "DD/MM/YYYY HH:mm:ss"
        );

        this.form.status.VoidName = row.VoidByName;
        this.form.status.VoidDate =
          row.VoidDate != undefined
            ? moment(row.VoidDate).format("DD/MM/YYYY HH:mm:ss")
            : "";

        this.form.model.TransactionType = row.TransactionType;
        this.form.model.SubjectCode = row.SubjectCode;
        this.form.model.PaidSubject = row.PaidSubject;
        this.form.model.Description = row.Description;
        this.form.model.SubjectName = subject[0][this.DocTypeSelect + "Name"];
        this.form.model.BankAccountCode = row.BankAccountCode;

        if (
          this.form.model.CheckbookTransactionId != "" &&
          this.form.model.DocumentNo != ""
        ) {
          if (this.form.model.Status == util.docStatus("new")) {
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

        await this.$store.dispatch(
          "features/company/financial_setup/actGet",
          "FinancialSetup?FuncCurrencyCode=" + this.form.model.CurrencyCode
        );
        this.form.financialSetup = this.$store.state.features.company.financial_setup.data;

        var details = await this.$store.dispatch(
          "features/finance/checkbook/checkbook_detail/actGetData",
          row.CheckbookTransactionId
        );

        let arrDetails = [];
        if (details.length) {
          details.forEach(function (row, index) {
            arrDetails.push({
              Index: index,
              TransactionDetailId: row.TransactionDetailId,
              CheckbookTransactionId: row.CheckbookTransactionId,
              ChargesId: row.ChargesId,
              ChargesCode: row.ChargesCode,
              ChargesName: row.ChargesName,
              ChargesDescription: row.ChargesDescription,
              OriginatingAmount: row.OriginatingAmount,
              FunctionalAmount: row.FunctionalAmount,
              Status: row.status
            });
          });
        }
        
        this.dataDetails = arrDetails;

        this.form.isEdit = true;
        this.isForm = true;
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
      async doDelete(row) {
        this.showLoader(true);

        await this.$store.dispatch(
          "features/finance/checkbook/checkbook_progress/actDelete",
          row
        );

        var response = this.$store.state.features.finance.checkbook
          .checkbook_progress.resultDelete;
        if (response.status != 200) {
          this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription != null
              ? response.data.ErrorDescription
              : "Delete failed."
          );
        } else {
          this.$refs.gridCheckbook.doRefresh();
          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },
      async handleCancelSubject() {
        this.form.model.SubjectCode = "";
        this.form.model.SubjectName = "";
      },
      async handleGetCheckbook(url) {
        await this.$store.dispatch(
          "features/finance/checkbook/checkbook_progress/actGetProgress",
          url
        );
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async handleGetCheckbookHistory(url) {
        await this.$store.dispatch(
          "features/finance/checkbook/checkbook_history/actGetHistory",
          url
        );
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async History() {
        if (this.$refs.gridCheckbookHistory != null) {
          await this.$refs.gridCheckbookHistory.doRefresh();
        }
      },
      validateForm() {
        var valid = true;
        this.dataDetails.forEach(function (row, index) {
          row.RowIndex = index+1;
          if (row.OriginatingAmount < 1) {
            valid = false;
          }
        });

        if (valid == false) {
          this.handleToast(
            "Confirmation",
            "danger",
            "Detail Originating Amount must greater than 0"
          );
        }

        return valid;
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
              this.doPostingCheckbook(index);
            }
          })
          .catch(err => {
            // An error occurred
          });
      },
      async clickSubmitApprove(index) {
        this.$bvModal
          .msgBoxConfirm(
            "Submit " +
            this.form.model.DocumentNo +
            " ? (make sure you already save all your changes)",
            {
              title: "Submit Approval Confirmation",
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
              this.doSubmitCheckbook(index);
            }
          })
          .catch(err => {
            // An error occurred
          });
      },
      async doPostingCheckbook(row) {
        this.showLoader(true);

        this.form.model.Reason = "";

        await this.$store.dispatch(
          "features/finance/checkbook/checkbook_progress/actPosting",
          this.form.model
        );

        var response = this.$store.state.features.finance.checkbook
          .checkbook_progress.resultUpdate;
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

          this.$refs.gridCheckbook.doRefresh();
          this.$refs.gridCheckbookHistory.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },
      async doSubmitCheckbook(row) {
        this.showLoader(true);

        this.form.model.Reason = "";

        await this.$store.dispatch(
          "features/finance/checkbook/checkbook_progress/actSubmitApproval",
          this.form.model
        );

        var response = this.$store.state.features.finance.checkbook
          .checkbook_progress.resultCreate;
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

          this.$refs.gridCheckbook.doRefresh();
          this.$refs.gridCheckbookHistory.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },
      async onSubmit() {
        if (this.validateForm()) {
          this.showLoader(true);
          this.form.model.RequestCheckbookDetails = this.dataDetails;
          if (this.form.isEdit) {
            await this.$store.dispatch(
              "features/finance/checkbook/checkbook_progress/actUpdate",
              this.form.model
            );
            var response = this.$store.state.features.finance.checkbook
              .checkbook_progress.resultUpdate;

            if (response.status != 200) {
              this.handleToast(
                "Confirmation",
                "danger",
                response.data.ErrorDescription
              );
            } else {
              this.isForm = false;
              this.form.isEdit = false;

              this.$refs.gridCheckbook.doRefresh();
              this.resetForm();

              this.handleToast("Confirmation", "success", "Successfully updated");
            }
          } else {
            await this.$store.dispatch(
              "features/finance/checkbook/checkbook_progress/actCreate",
              this.form.model
            );

            var response = this.$store.state.features.finance.checkbook
              .checkbook_progress.resultCreate;

            if (response.status != 200) {
              this.handleToast(
                "Confirmation",
                "danger",
                response.data.ErrorDescription
              );
            } else {
              this.isForm = false;
              this.form.isEdit = false;

              this.$refs.gridCheckbook.doRefresh();
              this.resetForm();

              this.handleToast("Confirmation", "success", "Successfully saved");
            }
          }

          this.showLoader(false);
        }
      }
    }
  };
</script>

<style scoped>
  .writeofflimit {
    font-size: 12px;
    text-align: right;
    padding-right: 5px;
  }

  #table-sub {
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

    #table-sub th {
      border: 1px solid #ddd;
      padding: 5px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      height: 20px !important;
    }

    #table-sub td {
      border: 1px solid rgb(165, 165, 165);
      padding: 5px !important;
      font-size: 12px;
      text-align: center;
      height: 20px !important;
    }

    #table-sub .v-input {
      font-size: 12px !important;
    }

    #table-sub td .v-text-field {
      font-size: 12px !important;
      padding: 5px 5px;
      margin-top: 1px;
    }

    #table-sub tr {
    }

      #table-sub tr:hover {
      }

    #table-sub th {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: left;
      background-color: #f0f3f5;
    }

  .btn-xsmall {
    height: 20px;
    width: 20px;
  }

  @media only screen and (max-width: 1024px) {
    h5{
      font-size:14px;
    }
    .writeofflimit {
      font-size: 10px;
      text-align: right;
      padding-right: 5px;
    }

    #table-sub {
      font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }

      #table-sub th {
        border: 1px solid #ddd;
        padding: 5px;
        font-size: 10px;
        font-weight: bold;
        text-transform: uppercase;
        height: 20px !important;
      }

      #table-sub td {
        border: 1px solid rgb(165, 165, 165);
        padding: 5px !important;
        font-size: 10px;
        text-align: center;
        height: 20px !important;
      }

      #table-sub .v-input {
        font-size: 10px !important;
      }

      #table-sub td .v-text-field {
        font-size: 10px !important;
        padding: 5px 5px;
        margin-top: 1px;
      }

      #table-sub tr {
      }

        #table-sub tr:hover {
        }

      #table-sub th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #f0f3f5;
      }

    .btn-xsmall {
      height: 20px;
      width: 20px;
    }
  }
</style>
