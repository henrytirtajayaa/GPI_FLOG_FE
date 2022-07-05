<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <b-card no-body v-show="isForm">
      <b-tabs pills card>
        <b-tab active @click="isTabMain=true">
          <template v-slot:title>
            <font-awesome-icon :icon="['fas', 'heart']" />&nbsp;Vendor
          </template>
          <!-- TAB Vendor BEGIN -->
          <validation-observer ref="observer" v-slot="{ handleSubmit }">
            <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
              <b-row>
                <b-col sm="12">
                  <b-card>
                    <div slot="header">
                      <span class="font-weight-bold">{{formCaption}}</span>
                      <small>{{ (form.isEdit) ? "Edit" : "New" }}</small>
                      <div right style="float:right;">
                        <b-button variant="blue" type="submit">
                          <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                        </b-button>
                        <b-button @click="onFormClose">
                          <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                        </b-button>
                      </div>
                    </div>
                    <b-row>
                      <b-col sm="8">
                        <b-row>
                          <b-col sm="3">
                            <validation-provider
                              name="Vendor Code"
                              :rules="{ required: true }"
                              v-slot="validationContext"
                            >
                              <b-form-group>
                                <label for="VendorCode">Vendor Code</label>
                                <b-form-input
                                  name="VendorCode"
                                  type="text"
                                  placeholder="Vendor Code "
                                  v-model="form.model.VendorCode"
                                  :state="validateState(validationContext)"
                                  aria-describedby="code-feedback"
                                  size="sm" class="font-weight-bold"
                                  :disabled="form.isEdit"
                                />
                                <b-form-invalid-feedback
                                  id="code-feedback"
                                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                              </b-form-group>
                            </validation-provider>
                          </b-col>
                          <b-col sm="6">
                            <validation-provider
                              name="Vendor Name"
                              :rules="{ required: true }"
                              v-slot="validationContext"
                            >
                              <b-form-group>
                                <label for="VendorName">Vendor Name</label>
                                <b-form-input
                                  name="VendorName"
                                  type="text"
                                  placeholder="Vendor name"
                                  v-model="form.model.VendorName"
                                  :state="validateState(validationContext)"
                                  size="sm" class="font-weight-bold"
                                  aria-describedby="cust-name-feedback"
                                />
                                <b-form-invalid-feedback
                                  id="cust-name-feedback"
                                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                              </b-form-group>
                            </validation-provider>
                          </b-col>
                          <b-col sm="3">
                            <label>Vendor Group Code</label>
                            <b-input-group prepend>
                              <b-form-input
                                v-model="form.model.VendorGroupCode"
                                size="sm"
                                readonly
                              ></b-form-input>
                              <b-input-group-append>
                                <b-button
                                  variant="outline-primary"
                                  size="sm"
                                  @click="onModalSearchVendorGroup('VendorGroupCode', 'VendorGroupCode')"
                                >
                                  <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                </b-button>
                                <b-button variant="outline-danger" size="sm" v-if="form.model.VendorGroupCode" @click="form.model.VendorGroupCode=''">
                                    <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                                  </b-button>
                              </b-input-group-append>
                            </b-input-group>
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col sm="4">
                            <label for="NPWP">Tax Registration No (NPWP)</label>
                            <b-form-input
                              name="NPWP"
                              type="text"
                              placeholder="NPWP/Taxpayer Identification"
                              v-model="form.model.TaxRegistrationNo"
                              size="sm"
                            />
                          </b-col>
                          <b-col sm="8">
                            <label for="NPWP">Vendor Tax Name</label>
                            <b-form-input
                              name="NPWP"
                              type="text"
                              placeholder="Tax related company name"
                              v-model="form.model.VendorTaxName"
                              size="sm"
                            />
                          </b-col>
                        </b-row>
                        <b-row class="mt-2">
                          <b-col sm="3">
                            <label>Payment Term</label>
                            <b-input-group prepend>
                              <b-form-input v-model="form.model.PaymentTermCode" size="sm" readonly></b-form-input>
                              <b-input-group-append>
                                <b-button
                                  variant="outline-primary"
                                  size="sm"
                                  @click="onModalSearchPaymentTerm('PaymentTermCode')"
                                >
                                  <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                </b-button>
                                <b-button variant="outline-danger" size="sm" v-if="form.model.PaymentTermCode" @click="form.model.PaymentTermCode=''">
                                    <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                                  </b-button>
                              </b-input-group-append>
                            </b-input-group>
                          </b-col>
                          <b-col sm="6">
                            <label>Credit Term</label>
                            <b-input-group>
                              <template v-slot:prepend>
                                <b-form-radio-group
                                  class="mt-1"
                                  v-model="form.model.HasCreditLimit"
                                  :options="[{ item: false, name: 'No' },{ item: true, name: 'Yes' }]"
                                  size="sm"
                                  value-field="item"
                                  text-field="name"
                                ></b-form-radio-group>
                              </template>
                              <template v-slot:append>
                                <money v-model="form.model.CreditLimit" v-bind="moneyOptions" size="sm" v-show="form.model.HasCreditLimit" class="currency"></money>
                              </template>
                            </b-input-group>
                          </b-col>
                        </b-row>
                        <b-row class="mt-3">
                          <b-col sm="3">
                            <label>Main Address Code</label>
                            <b-input-group prepend>
                              <b-form-input
                                v-model="form.model.AddressCode"
                                class="font-weight-bold"
                                readonly
                                size="sm"
                              ></b-form-input>
                              <b-input-group-append>
                                <b-button
                                  variant="outline-primary"
                                  size="sm"
                                  @click="onModalSearchVendorAddress('AddressCode','AddressCode')"
                                >
                                  <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                </b-button>
                                <b-button variant="outline-danger" size="sm" v-if="form.model.AddressCode" @click="form.model.AddressCode=''">
                                    <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                                  </b-button>
                              </b-input-group-append>
                            </b-input-group>
                          </b-col>
                          <b-col sm="3">
                            <label>Bill To Address Code</label>
                            <b-input-group prepend>
                              <b-form-input
                                v-model="form.model.BillToAddressCode"
                                readonly
                                size="sm"
                                aria-describedby="bill-to-addr-feedback"
                              ></b-form-input>
                              <b-input-group-append>
                                <b-button
                                  variant="outline-primary"
                                  size="sm"
                                  @click="onModalSearchVendorAddress('BillToAddressCode','BillToAddressCode')"
                                >
                                  <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                </b-button>
                                <b-button variant="outline-danger" size="sm" v-if="form.model.BillToAddressCode" @click="form.model.BillToAddressCode=''">
                                    <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                                  </b-button>
                              </b-input-group-append>
                            </b-input-group>
                          </b-col>
                          <b-col sm="3">
                            <label>Ship To Address Code</label>
                            <b-input-group prepend>
                              <b-form-input
                                v-model="form.model.ShipToAddressCode"
                                readonly
                                size="sm"
                                aria-describedby="shipto-addr-feedback"
                              ></b-form-input>
                              <b-input-group-append>
                                <b-button
                                  variant="outline-primary"
                                  size="sm"
                                  @click="onModalSearchVendorAddress('ShipToAddressCode','ShipToAddressCode')"
                                >
                                  <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                </b-button>
                                <b-button variant="outline-danger" size="sm" v-if="form.model.ShipToAddressCode" @click="form.model.ShipToAddressCode=''">
                                    <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                                  </b-button>
                              </b-input-group-append>
                            </b-input-group>
                          </b-col>
                          <b-col sm="3">
                            <label>Tax Address</label>
                            <b-input-group prepend>
                              <b-form-input v-model="form.model.TaxAddressCode" size="sm" readonly></b-form-input>
                              <b-input-group-append>
                                <b-button
                                  variant="outline-primary"
                                  size="sm"
                                  @click="onModalSearchVendorAddress('TaxAddressCode','TaxAddressCode')"
                                >
                                  <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                </b-button>
                                <b-button variant="outline-danger" size="sm" v-if="form.model.TaxAddressCode" @click="form.model.TaxAddressCode=''">
                                    <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                                  </b-button>
                              </b-input-group-append>
                            </b-input-group>
                          </b-col>
                        </b-row>
                      </b-col>
                      <b-col sm="4">
                        <b-card tag="article" class="mb-1">
                          <b-card-sub-title class="mb-2">
                            CHART OF ACCOUNT
                            <small>related to vendor</small>
                          </b-card-sub-title>
                          <b-card-text>
                            <b-row class="mt-2">
                              <b-col>
                                <validation-provider
                                  name="Payable Account No"
                                  :rules="{ required: true }"
                                  v-slot="validationContext"
                                >
                                  <label>Payable Account No</label>
                                  <b-input-group prepend>
                                    <b-form-input
                                      v-model="form.model.PayableAccountNo"
                                      :state="validateState(validationContext)"
                                      readonly
                                      size="sm"
                                      aria-describedby="payable-account-feedback"
                                    ></b-form-input>
                                    <b-input-group-append>
                                      <b-button
                                        variant="outline-primary"
                                        size="sm"
                                        @click="onModalSearchAccount('PayableAccountNo')"
                                      >
                                        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                      </b-button>
                                    </b-input-group-append>
                                    <b-form-invalid-feedback
                                      id="payable-account-feedback"
                                    >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                  </b-input-group>
                                </validation-provider>
                              </b-col>
                            </b-row>
                            <b-row class="mt-2">
                              <b-col>
                                  <label>Accrued Payable Account No</label>
                                  <b-input-group prepend>
                                    <b-form-input
                                      v-model="form.model.AccruedPayableAccountNo"
                                      readonly
                                      size="sm"
                                      aria-describedby="accr-ap-feedback"
                                    ></b-form-input>
                                    <b-input-group-append>
                                      <b-button
                                        variant="outline-primary"
                                        size="sm"
                                        @click="onModalSearchAccount('AccruedPayableAccountNo')"
                                      >
                                        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                      </b-button>
                                <b-button variant="outline-danger" size="sm" v-if="form.model.AccruedPayableAccountNo" @click="form.model.AccruedPayableAccountNo=''">
                                    <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                                  </b-button>
                                    </b-input-group-append>
                                  </b-input-group>
                              </b-col>
                            </b-row>
                          </b-card-text>
                          <b-card-sub-title class="mb-2">
                            Status
                            <small></small>
                          </b-card-sub-title>
                          <b-card-text>
                            <validation-provider
                              name="Status"
                              :rules="{ required: true }"
                              v-slot="validationContext"
                            >
                              <b-form-group>
                                <b-form-select
                                  id="status"
                                  name="Status"
                                  v-model="form.model.Inactive"
                                  :state="validateState(validationContext)"
                                  :plain="true"
                                  :options="[{value:false,text:'Active'},{value:true,text:'Inactive'}]"
                                  size="sm"
                                  aria-describedby="status-feedback"
                                />
                                <b-form-invalid-feedback
                                  id="status-feedback"
                                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                              </b-form-group>
                            </validation-provider>
                          </b-card-text>
                        </b-card>
                      </b-col>
                    </b-row>
                    <b-row class="mt-3" v-if="form.model.AddressCode != ''">
                      <!-- Address Detail Start -->
                      <b-col sm="12">
                        <b-card tag="article">
                          <b-card-title></b-card-title>
                          <b-card-sub-title>
                            <small></small>
                          </b-card-sub-title>
                          <b-card-text class="address-detail">
                            <b-row class="mt-1">
                              <b-col sm="3">
                                <label>Address Name</label>
                                <div>{{form.display.AddressName}}</div>
                              </b-col>
                              <b-col sm="6" rows="2">
                                <label>Address</label>
                                <div>{{form.display.Address}}</div>
                              </b-col>
                            </b-row>
                            <b-row class="mt-3">
                              <b-col sm="3">
                                <label>Contact Person</label>
                                <div>{{form.display.ContactPerson}}</div>
                              </b-col>
                              <b-col sm="2">
                                <label>Mobile No</label>
                                <div>{{form.display.Handphone}}</div>
                              </b-col>
                              <b-col sm="2">
                                <label>Phone</label>
                                <div>
                                  {{form.display.Phone1}}&nbsp;&nbsp;
                                  <small>EXT</small>
                                  &nbsp;{{form.display.Extension1}}
                                </div>
                              </b-col>
                              <b-col sm="2">
                                <label>Phone</label>
                                <div>
                                  {{form.display.Phone2}}&nbsp;&nbsp;
                                  <small>EXT</small>
                                  &nbsp;{{form.display.Extension2}}
                                </div>
                              </b-col>
                              <b-col sm="2">
                                <label>Fax</label>
                                <div>{{form.display.Fax}}&nbsp;</div>
                              </b-col>
                            </b-row>
                            <b-row class="mt-3">
                              <b-col sm="4">
                                <label>Email</label>
                                <div>{{form.display.EmailAddress}}</div>
                              </b-col>
                              <b-col sm="8">
                                <label>Homepage</label>
                                <div>{{form.display.HomePage}}</div>
                              </b-col>
                            </b-row>
                            <b-row class="mt-3">
                              <b-col sm="3">
                                <label>Neighbourhood</label>
                                <div>{{form.display.Neighbourhood}}</div>
                              </b-col>
                              <b-col sm="3">
                                <label>Hamlet</label>
                                <div>{{form.display.Hamlet}}</div>
                              </b-col>
                              <b-col sm="3">
                                <label>Urban Village</label>
                                <div>{{form.display.UrbanVillage}}</div>
                              </b-col>
                              <b-col sm="3">
                                <label>Sub District</label>
                                <div>{{form.display.SubDistrict}}</div>
                              </b-col>
                            </b-row>
                            <b-row class="mt-3">
                              <b-col sm="3">
                                <label>Province</label>
                                <div>{{form.display.Province}}</div>
                              </b-col>
                              <b-col sm="1">
                                <label>Postal Code</label>
                                <div>{{form.display.PostCode}}</div>
                              </b-col>
                              <b-col sm="3">
                                <label>Country</label>
                                <div>{{form.display.CountryName}}</div>
                              </b-col>
                            </b-row>
                          </b-card-text>
                        </b-card>
                      </b-col>

                      <!-- Address Detail End -->
                    </b-row>
                  </b-card>
                </b-col>
              </b-row>
            </b-form>
          </validation-observer>
          <!-- TAB Vendor END -->
        </b-tab>
        <b-tab
          v-if="form.model.VendorId != null && form.model.VendorId != ''"
          @click="isTabMain=false"
        >
          <template v-slot:title>
            <font-awesome-icon :icon="['fas', 'map-marked-alt']" />&nbsp;Addresses
          </template>
          <b-card-text>
            <!-- TAB ADDRESS BEGIN -->
            <validation-observer ref="observerAddress" v-slot="{ handleSubmit }">
              <b-form
                ref="formVendorAddress"
                @submit.stop.prevent="handleSubmit(onSubmitAddress)"
                v-show="isFormAddress"
              >
                <b-row>
                  <b-col sm="12">
                    <b-card>
                      <div slot="header">
                        <span class="font-weight-bold">{{form.model.VendorName}}&nbsp;</span>
                        <small>{{ (formAddress.isEdit) ? "Edit" : "New" }}&nbsp;Address</small>
                        <div right style="float:right;">
                          <b-button variant="blue" type="submit">
                            <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                          </b-button>
                          <b-button @click="onFormTabAddressClose">
                            <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                          </b-button>
                        </div>
                      </div>
                      <b-row>
                        <b-col sm="8">
                          <b-row>
                            <b-col sm="4">
                              <validation-provider
                                name="Vendor Address Code"
                                :rules="{ required: true }"
                                v-slot="validationContext"
                              >
                                <b-form-group>
                                  <label for="CustAddressCode">Address Code</label>
                                  <b-form-input
                                    name="CustAddressCode"
                                    type="text"
                                    placeholder="Address Code "
                                    v-model="formAddress.model.AddressCode"
                                    :state="validateState(validationContext)"
                                    aria-describedby="tab2-addr-code-feedback"
                                    size="sm"
                                    :disabled="formAddress.isEdit"
                                  />
                                  <b-form-invalid-feedback
                                    id="tab2-addr-code-feedback"
                                  >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-form-group>
                              </validation-provider>
                            </b-col>
                            <b-col sm="8">
                              <validation-provider
                                name="Address Name"
                                :rules="{ required: true }"
                                v-slot="validationContext"
                              >
                                <b-form-group>
                                  <label for="CustAddrName">Address Name</label>
                                  <b-form-input
                                    name="CustAddrName"
                                    type="text"
                                    placeholder="Vendor Address name"
                                    v-model="formAddress.model.AddressName"
                                    :state="validateState(validationContext)"
                                    size="sm"
                                    aria-describedby="tab2-addr-name-feedback"
                                  />
                                  <b-form-invalid-feedback
                                    id="tab2-addr-name-feedback"
                                  >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-form-group>
                              </validation-provider>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col sm="12">
                              <validation-provider
                                name="Address Detail"
                                :rules="{ required: true }"
                                v-slot="validationContext"
                              >
                                <b-form-group>
                                  <label for="CustAddrDetail">Address</label>
                                  <b-form-textarea
                                    name="CustAddrDetail"
                                    v-model="formAddress.model.Address"
                                    placeholder="Provide detail address"
                                    :state="validateState(validationContext)"
                                    rows="3"
                                    max-rows="6"
                                    aria-describedby="tab2-addr-detail-feedback"
                                    size="sm"
                                  ></b-form-textarea>
                                  <b-form-invalid-feedback
                                    id="tab2-addr-detail-feedback"
                                  >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-form-group>
                              </validation-provider>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col sm="4">
                              <b-form-group v-b-tooltip.hover title="Nomor RT.">
                                <label for="Neighbourhood">Neighbourhood</label>
                                <b-form-input
                                  name="Neighbourhood"
                                  type="text"
                                  placeholder="Neighourhood"
                                  v-model="formAddress.model.Neighbourhood"
                                  size="sm"
                                />
                              </b-form-group>
                            </b-col>
                            <b-col sm="4">
                              <b-form-group v-b-tooltip.hover title="Nomor RW.">
                                <label for="Hamlet">Hamlet</label>
                                <b-form-input
                                  name="Hamlet"
                                  type="text"
                                  placeholder="Hamlet"
                                  v-model="formAddress.model.Hamlet"
                                  size="sm"
                                />
                              </b-form-group>
                            </b-col>
                            <b-col sm="4">
                              <b-form-group v-b-tooltip.hover title="Kelurahan">
                                <label for="UrbanVillage">Urban Village</label>
                                <b-form-input
                                  name="UrbanVillage"
                                  type="text"
                                  placeholder="Urban Village"
                                  v-model="formAddress.model.UrbanVillage"
                                  size="sm"
                                />
                              </b-form-group>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col sm="4">
                              <b-form-group v-b-tooltip.hover title="Kecamatan">
                                <label for="SubDistrict">Sub District</label>
                                <b-form-input
                                  name="SubDistrict"
                                  type="text"
                                  placeholder="Sub District"
                                  v-model="formAddress.model.SubDistrict"
                                  size="sm"
                                />
                              </b-form-group>
                            </b-col>
                            <b-col sm="3">
                              <b-form-group v-b-tooltip.hover title="Kode Pos">
                                <label for="PostalCode">Postal Code</label>
                                <b-form-input
                                  name="PostalCode"
                                  type="text"
                                  placeholder="Postal Code"
                                  v-model="formAddress.model.PostCode"
                                  size="sm"
                                />
                              </b-form-group>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col sm="4">
                              <validation-provider
                                name="City"
                                :rules="{ required: false  }"
                                v-slot="validationContext"
                              >
                                <b-form-group>
                                  <label for="City">City</label>
                                  <b-form-select
                                    size="sm"
                                    v-model="formAddress.model.CityCode"
                                    :state="validateState(validationContext)"
                                    @change="selectCity(formAddress.model.CityCode)"
                                    aria-describedby="city-feedback"
                                  >
                                    <b-form-select-option value="">-- select city --</b-form-select-option>
                                    <b-form-select-option
                                      :value="city.code"
                                      v-for="(city, index) in itemCities" v-bind:key="city.code"
                                    >{{city.name}}</b-form-select-option>
                                  </b-form-select>
                                  <b-form-invalid-feedback
                                    id="city-feedback"
                                  >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-form-group>
                              </validation-provider>
                            </b-col>
                            <b-col sm="4">
                              <b-form-group>
                                <label for="Province">Province</label>
                                <b-form-input
                                  name="Province"
                                  type="text"
                                  placeholder="Province"
                                  v-model="formAddress.display.Province"
                                  size="sm"
                                  readonly
                                />
                              </b-form-group>
                            </b-col>
                            <b-col sm="4">
                              <b-form-group>
                                <label for="Country">Country</label>
                                <b-form-input
                                  name="Country"
                                  type="text"
                                  placeholder="Country"
                                  v-model="formAddress.display.Country"
                                  size="sm"
                                  readonly
                                />
                              </b-form-group>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col sm="12">
                              <label>Tax Address</label>
                              <b-input-group>
                                <template v-slot:prepend>
                                  <b-form-radio-group
                                    class="mt-1"
                                    v-model="formAddress.model.IsSameAddress"
                                    :options="[{ key: true, text: 'Same with current address' }, { key: false, text: 'Other' }]"
                                    size="sm"
                                    value-field="key"
                                    text-field="text"
                                    @change="changeRadioTaxAddress"
                                  ></b-form-radio-group>
                                </template>
                                <template v-slot:append>
                                  <b-input-group prepend v-show="!formAddress.model.IsSameAddress">
                                    <b-form-input
                                      v-model="formAddress.display.TaxAddressCode"
                                      size="sm"
                                      readonly
                                    ></b-form-input>
                                    <b-input-group-append>
                                      <b-button
                                        variant="outline-primary"
                                        size="sm"
                                        @click="onModalSearchVendorAddress2('TaxAddressId','TaxAddressId')"
                                      >
                                        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                      </b-button>
                                    </b-input-group-append>
                                  </b-input-group>
                                </template>
                              </b-input-group>
                            </b-col>
                          </b-row>
                          <b-row class="mt-3">
                            <b-col>
                              <b-form-group>
                                <b-form-checkbox
                                  v-model="formAddress.model.Default"
                                  size="sm"
                                  name="Default"
                                  value="true"
                                  unchecked-value="false"
                                >
                                  <span class="font-blue font-weight-bold">Default</span>
                                </b-form-checkbox>
                              </b-form-group>
                            </b-col>
                          </b-row>
                        </b-col>
                        <b-col sm="4">
                          <b-row>
                            <b-col sm="12">
                              <validation-provider
                                name="Contact Person"
                                :rules="{ required: false }"
                                v-slot="validationContext"
                              >
                                <b-form-group>
                                  <label for="ContactPerson">Contact Person</label>
                                  <b-form-input
                                    name="ContactPerson"
                                    type="text"
                                    placeholder="Name of contact / role / unit"
                                    v-model="formAddress.model.ContactPerson"
                                    :state="validateState(validationContext)"
                                    aria-describedby="tab2-contact-person-feedback"
                                    size="sm"
                                  />
                                  <b-form-invalid-feedback
                                    id="tab2-contact-person-feedback"
                                  >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-form-group>
                              </validation-provider>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col sm="12">
                              <b-form-group>
                                <label for="Handphone">Handphone</label>
                                <b-form-input
                                  name="Handphone"
                                  type="text"
                                  placeholder="Mobile no / handphone"
                                  v-model="formAddress.model.Handphone"
                                  size="sm"
                                />
                              </b-form-group>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col sm="12">
                              <validation-provider
                                name="Email"
                                :rules="{ email : true }"
                                v-slot="validationContext"
                              >
                                <b-form-group>
                                  <label for="Email">Email</label>
                                  <b-form-input
                                    name="Email"
                                    type="text"
                                    placeholder="Email"
                                    v-model="formAddress.model.EmailAddress"
                                    :state="validateState(validationContext)"
                                    size="sm"
                                    aria-describedby="tab2-email-feedback"
                                  />
                                  <b-form-invalid-feedback
                                    id="tab2-email-feedback"
                                  >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-form-group>
                              </validation-provider>
                            </b-col>
                          </b-row>
                          <b-row class="mt-3">
                            <b-col sm="8">
                              <b-form-group>
                                <label for="Phone1">
                                  Phone&nbsp;
                                  <b-badge pill variant="purple">1</b-badge>
                                </label>
                                <b-form-input
                                  name="Phone1"
                                  type="text"
                                  placeholder="Phone"
                                  v-model="formAddress.model.Phone1"
                                  size="sm"
                                />
                              </b-form-group>
                            </b-col>
                            <b-col sm="4">
                              <b-form-group>
                                <label for="Ext1">
                                  Ext&nbsp;
                                  <b-badge pill variant="purple">1</b-badge>
                                </label>
                                <b-form-input
                                  name="Ext1"
                                  type="text"
                                  placeholder="Ext"
                                  v-model="formAddress.model.Extension1"
                                  size="sm"
                                />
                              </b-form-group>
                            </b-col>
                          </b-row>
                          <b-row class="mt-3">
                            <b-col sm="8">
                              <b-form-group>
                                <label for="Phone2">
                                  Phone&nbsp;
                                  <b-badge pill variant="purple">2</b-badge>
                                </label>
                                <b-form-input
                                  name="Phone2"
                                  type="text"
                                  placeholder="Phone"
                                  v-model="formAddress.model.Phone2"
                                  size="sm"
                                />
                              </b-form-group>
                            </b-col>
                            <b-col sm="4">
                              <b-form-group>
                                <label for="Ext2">
                                  Ext&nbsp;
                                  <b-badge pill variant="purple">2</b-badge>
                                </label>
                                <b-form-input
                                  name="Ext2"
                                  type="text"
                                  placeholder="Ext"
                                  v-model="formAddress.model.Extension2"
                                  size="sm"
                                />
                              </b-form-group>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col sm="12">
                              <b-form-group>
                                <label for="Fax">Fax</label>
                                <b-form-input
                                  name="Fax"
                                  type="text"
                                  placeholder="Fax No"
                                  v-model="formAddress.model.Fax"
                                  size="sm"
                                />
                              </b-form-group>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col sm="12">
                              <label for="Homepage">Homepage</label>
                              <b-form-input
                                name="Homepage"
                                type="text"
                                placeholder="Website homepage"
                                v-model="formAddress.model.HomePage"
                                size="sm"
                              />
                            </b-col>
                          </b-row>
                        </b-col>
                      </b-row>
                    </b-card>
                  </b-col>
                </b-row>
              </b-form>
            </validation-observer>
            <!-- TAB ADDRESS END -->
            <!-- GRID ADDRESS BEGIN -->
            <b-row v-show="!isFormAddress">
              <b-col cols="12" sm="12">
                <b-card width="100%">
                  <DataGrid
                    ref="gridVendorAddress"
                    :fields="this.$store.state.features.company.vendor_address.headers"
                    :items="this.$store.state.features.company.vendor_address.data"
                    :info="this.$store.state.features.company.vendor_address.listInfo"
                    :baseUrl="this.$store.state.features.company.vendor_address.baseUrl"
                    :actGetData="handleGetTabAddress"
                    :actCreate="onFormCreateTabAddress"
                    :actEditRow="handleEditTabAddress"
                    :actDeleteRow="handleDeleteTabAddress"
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
                    caption="Vendor Addresses"
                  ></DataGrid>
                </b-card>
              </b-col>
            </b-row>
            <!-- GRID ADDRESS END -->
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>

    <!-- GRID MAIN BEGIN -->
    <b-row v-show="!isForm">
      <b-col cols="12" sm="12">
        <b-card width="100%">
          <DataGrid
            ref="gridMain"
            :fields="this.$store.state.features.company.vendor.headers"
            :items="this.$store.state.features.company.vendor.data"
            :info="this.$store.state.features.company.vendor.listInfo"
            :baseUrl="this.$store.state.features.company.vendor.baseUrl"
            :actGetData="handleGet"
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
            :caption="caption"
          ></DataGrid>
        </b-card>
      </b-col>
    </b-row>
    <!-- GRID MAIN END -->

    <!-- MODAL -->
    <AccountModal ref="dlgAccount" :actSelectedRow="onSelectedCOA"></AccountModal>
    <PaymentTermModal ref="dlgPaymentTerm" :actSelectedRow="onSelectedPaymentTerm"></PaymentTermModal>

    <div id="page-dialogs" height="100%">
      <b-modal v-model="isShowVendorGroup" hide-footer>
        <template v-slot:modal-title>Vendor Group</template>
        <div class="d-block text-center">
          <SelectGrid
            ref="gridModalVendorGroup"
            :fields="[{label: 'Vendor Group Code',key: 'VendorGroupCode',_classes: 'text-center',width:'120px',sort: true,filter: true,},
            {label: 'Vendor Group Name',key: 'VendorGroupName',_classes: 'text-left',sort: true,filter: true,}]"
            :items="this.$store.state.features.company.vendor_group.data"
            :info="this.$store.state.features.company.vendor_group.listInfo"
            :baseUrl="this.$store.state.features.company.vendor_group.baseUrl"
            :actGetData="handleGetVendorGroup"
            :selectedItem="form.model.VendorGroupCode"
            selectedFieldName="VendorGroupCode"
            :actSelectRow="handleSelectVendorGroup"
            addTableClasses="table-bordered"
            responsive
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
      <b-modal v-model="isShowVendorAddress" hide-footer size="lg">
        <template v-slot:modal-title>Vendor Address</template>
        <div class="d-block text-center">
          <SelectGrid
            ref="gridModalVendorAddress"
            :fields="[{label: 'Address Code', key: 'AddressCode', _classess: 'text-left', width:150, filter: true},
                      {label: 'Address Name', key: 'AddressName', _classess: 'text-left',filter: true}, 
                      {label: 'Contact', key: 'ContactPerson', _classess: 'text-left', width:150, filter: true},
                      {label: '', key: 'Default', _classess: 'text-center', width:50, sorter: false, filter: false}]"
            :items="this.$store.state.features.company.vendor_address.data"
            :info="this.$store.state.features.company.vendor_address.listInfo"
            :baseUrl="this.$store.state.features.company.vendor_address.baseUrl"
            :actGetData="handleGetVendorAddress"
            :selectedItem="form.VendorAddressReffField"
            selectedFieldName="AddressCode"
            :actSelectRow="handleSelectVendorAddress"
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
      <b-modal v-model="isShowVendorAddress2" hide-footer size="lg">
        <template v-slot:modal-title>Vendor Address</template>
        <div class="d-block text-center">
          <SelectGrid
            ref="gridModalVendorAddress"
            :fields="[{label: 'Address Code', key: 'AddressCode', _classess: 'text-left', width:150, filter: true},
                      {label: 'Address Name', key: 'AddressName', _classess: 'text-left',filter: true}, 
                      {label: 'Contact', key: 'ContactPerson', _classess: 'text-left', width:150, filter: true},
                      {label: '', key: 'Default', _classess: 'text-center', width:50, sorter: false, filter: false}]"
            :items="this.$store.state.features.company.vendor_address.data"
            :info="this.$store.state.features.company.vendor_address.listInfo"
            :baseUrl="this.$store.state.features.company.vendor_address.baseUrl"
            :actGetData="handleGetVendorAddress"
            :selectedItem="formAddress.model.TaxAddressCode"
            selectedFieldName="AddressCode"
            :actSelectRow="handleSelectVendorAddress2"
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

    <!-- END MODAL -->
  </div>
</template>

<script>
import DataGrid from "@/components/Tables/DataGrid";
import SelectGrid from "@/components/tables/SelectGrid";
import VueElementLoading from "vue-element-loading";
import { AccountModal, PaymentTermModal } from "@/pages/modal/index.js";
  import { mask } from 'vue-the-mask';
  import loginServices from '../services/loginservices'

export default {
  name: "Vendors",
  layout: "dashboard",
  components: {
    DataGrid,
    SelectGrid,
    VueElementLoading,
    AccountModal,
    PaymentTermModal
  },
  directives: {
        mask
    },
  data() {
    return {
      isTabMain: true,
      formCaption: "Vendors",
      caption: "Vendors",
      blockLoader: false,
      isForm: false, //FORM IN TAB CUSTOMER
      isFormAddress: false, //FORM IN TAB ADDRESS
      isShowVendorGroup: false,
      isShowVendorAddress: false,
      isShowVendorAddress2: false,
      moneyOptions: {
        decimal: ',',
        thousands: '.',
        prefix: '',
        suffix: '',
        decimalLength: 2,
        masked: false,
        allowBlank: false,
        min: 0,
        //max: Number.MAX_SAFE_INTEGER
      },
      itemCities: Array(),
      perPage: 10,
      form: {
        valid: false,
        isEdit: false,
        VendorAddressActiveField: "",
        VendorAddressReffField: "",
        model: {
          VendorId: null,
          VendorCode: "",
          VendorName: "",
          AddressCode: "",
          TaxRegistrationNo: "",
          VendorTaxName: "",
          TaxAddressCode: "",
          VendorGroupCode: "",
          PaymentTermCode: "",
          HasCreditLimit: false,
          CreditLimit: "",
          ShipToAddressCode: "",
          BillToAddressCode: "",
          PayableAccountNo: "",
          AccruedPayableAccountNo: "",
          Inactive: false
        },
        display: {
          VendorGroupCaption: "",
          AddressCode: "",
          AddressName: "",
          TaxAddressCaption: "",
          BillToAddressCaption: "",
          ShipToAddressCaption: "",
          ContactPerson: "",
          Address: "",
          Handphone: "",
          Phone1: "",
          Extension1: "",
          Phone2: "",
          Extension2: "",
          Fax: "",
          EmailAddress: "",
          HomePage: "",
          Neighbourhood: "",
          Hamlet: "",
          UrbanVillage: "",
          SubDistrict: "",
          CityCode: "",
          PostCode: "",
          Province: "",
          CountryName: "",
          CreditTerm: ""
        }
      },
      formAddress: {
        valid: false,
        isEdit: false,
        model: {
          VendorAddressId: null,
          VendorId: null,
          VendorCode: null,
          VendorName: null,
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
          EmailAddress: "",
          HomePage: "",
          Neighbourhood: "",
          Hamlet: "",
          UrbanVillage: "",
          SubDistrict: "",
          CityCode: "",
          PostCode: "",
          IsSameAddress: true,
          TaxAddressId: "",
          Default: false
        },
        display: {
          Province: "",
          CityName: "",
          Country: "",
          TaxAddressCode: ""
        }
      }
    };
  },
  async mounted() {
    if (this.$refs.gridMain != null) {
      await this.$refs.gridMain.doRefresh();
    }

    await this.$store.dispatch(
      "features/company/vendor_group/actGet",
      "VendorGroup?InActive=false"
    );

    await this.$store.dispatch(
      "features/company/city/actGetCity", 
      "city?InActive=false"
      );

    var arr = [];
    this.$store.state.features.company.city.data.forEach(function(row, index) {
      arr.push({ code: row.CityCode, name: row.CityName });
    });
    this.itemCities = arr;
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
    /*** TAB Vendor BEGIN ***/
    async doFindVendorAddresses(url) {
      if (url == undefined) {
        url = this.$store.state.features.company.vendor_address.baseUrl;
      }

      if (url.toLowerCase().lastIndexOf("vendorid") < 0) {
        url =
          url + "&VendorId=" + this.form.model.VendorId + "&Inactive=false";
      } else {
        var clean_uri = url
          .toLowerCase()
          .substring(0, url.indexOf("&vendorid"));
        url =
          clean_uri +
          "&VendorId=" +
          this.form.model.VendorId +
          "&Inactive=false";
      }

      if (url.toLowerCase().lastIndexOf("vendoraddress") < 0) {
        url = "vendoraddress?" + url;
      }

      await this.$store.dispatch(
        "features/company/vendor_address/actGetData",
        url
      );
    },
    async handleGetAddressCode(url) {
      await this.doFindVendorAddresses(url);
    },
    async handleGet(url) {
      await this.$store.dispatch("features/company/vendor/actGetVendor", url);
      await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
    },
    async onFormClose() {
      this.ErrorMessage = "";
      this.isForm = false;
      this.form.isEdit = false;

      this.resetForm();
    },
    resetForm() {
      this.form.model.VendorId = null;
      this.form.model.VendorCode = "";
      this.form.model.VendorName = "";
      this.form.model.AddressCode = "";
      this.form.model.TaxAddressCode = "";
      this.form.model.TaxRegistrationNo = "";
      this.form.model.VendorTaxName = "";
      this.form.model.VendorGroupCode = "";
      this.form.model.PaymentTermCode = "";
      this.form.model.HasCreditLimit = false;
      this.form.model.CreditLimit = 0;
      this.form.model.ShipToAddressCode = "";
      this.form.model.BillToAddressCode = "";
      this.form.model.PayableAccountNo = "";
      this.form.model.AccruedPayableAccountNo = "";
      this.form.model.Inactive = false;

      //Clear selected attr
      this.form.display.AddressName = "";
      this.form.display.ContactPerson = "";
      this.form.display.Address = "";
      this.form.display.Handphone = "";
      this.form.display.Phone1 = "";
      this.form.display.Extension1 = "";
      this.form.display.Phone2 = "";
      this.form.display.Extension2 = "";
      this.form.display.Fax = "";
      this.form.display.EmailAddress = "";
      this.form.display.HomePage = "";
      this.form.display.Neighbourhood = "";
      this.form.display.Hamlet = "";
      this.form.display.UrbanVillage = "";
      this.form.display.SubDistrict = "";
      this.form.display.CityCode = "";
      this.form.display.PostCode = "";
      this.form.display.Province = "";
      this.form.display.CountryName = "";

      this.$nextTick(() => {
        this.$refs.observer.reset();
      });
    },
    async onFormCreate() {
      this.resetForm();

      this.form.isEdit = false;
      this.isForm = true;
    },
    async handleEdit(row) {
      this.isForm = true;

      this.form.model.VendorId = row.VendorId;
      this.form.model.VendorCode = row.VendorCode;
      this.form.model.VendorName = row.VendorName;
      this.form.model.AddressCode = row.AddressCode;
      this.form.model.TaxAddressCode = row.TaxAddressCode;
      this.form.model.TaxRegistrationNo = row.TaxRegistrationNo;
      this.form.model.VendorTaxName = row.VendorTaxName;
      this.form.model.VendorGroupCode = row.VendorGroupCode;
      this.form.model.PaymentTermCode = row.PaymentTermCode;
      this.form.model.HasCreditLimit =
        row.HasCreditLimit.toLowerCase() == "no" ? false : true;
      this.form.model.CreditLimit = row.CreditLimit;
      this.form.model.ShipToAddressCode = row.ShipToAddressCode;
      this.form.model.BillToAddressCode = row.BillToAddressCode;
      this.form.model.PayableAccountNo = row.PayableAccountNo;
      this.form.model.AccruedPayableAccountNo =
        row.AccruedPayableAccountNo;
      this.form.model.InActive =
        row.Inactive.toLowerCase() == "inactive" ? true : false;

      await this.setMainAddress();

      this.$refs.gridVendorAddress.doRefresh();

      this.form.isEdit = true;
    },
    async setMainAddress() {
      var response = await this.$store.dispatch(
        "features/company/vendor_address/actGetDataVendor",
        this.form.model
      );
      if (response.status == 200) {
        if (response.data.VendorAddresses.length > 0) {
          var data = response.data.VendorAddresses[0];
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
    async onSelectedPaymentTerm(item, modelReff) {
      this.form.model[modelReff] = item.PaymentTermCode;
    },
    async handleGetVendorGroup(url) {

       if (url.toLowerCase().lastIndexOf("InActive") < 0) {
          url = url + "&InActive=false";
        } else {
          var clean_uri = url
            .toLowerCase()
            .substring(0, url.indexOf("&InActive"));
          url =
            clean_uri + "&InActive=false";
        }

        if (url.lastIndexOf("VendorGroup") < 0) {
          url = "VendorGroup?" + url;
        }
       
      await this.$store.dispatch("features/company/vendor_group/actGet",url);
    },
    async handleSelectVendorGroup(row) {
      this.form.model.VendorGroupCode = row.VendorGroupCode;
      this.isShowVendorGroup = false;
    },
    async onModalSearchVendorAddress(reff, active) {
      await this.doFindVendorAddresses();

      this.form.VendorAddressReffField = this.form.model[reff];
      this.form.VendorAddressActiveField = active;

      this.isShowVendorAddress = true;
    },
    async handleGetVendorAddress(url) {
      await this.doFindVendorAddresses(url);
    },
    async handleSelectVendorAddress(row) {
      this.form.model[this.form.VendorAddressActiveField] = row.AddressCode;

      if (this.form.VendorAddressActiveField == "AddressCode") {
        await this.setMainAddress();
      }

      this.form.VendorAddressActiveField = "";
      this.form.VendorAddressReffField = "";

      this.isShowVendorAddress = false;
    },
    
    async onModalSearchVendorGroup(reff, active) {
      await this.doFindVendorGroup();

      this.isShowVendorGroup = true;
    },
    async doFindVendorGroup(url){
      await this.$store.dispatch(
        "features/company/vendor_group/actGet",
        url
      );
    },

    async doDelete(row) {
      this.showLoader(true);

      await this.$store.dispatch("features/company/vendor/actDelete", row);

      var response = this.$store.state.features.company.vendor.resultDelete;
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
    async onSubmit() {
      this.showLoader(true);

      if (this.form.isEdit) {
        await this.$store.dispatch(
          "features/company/vendor/actUpdateVendor",
          this.form.model
        );
        var response = this.$store.state.features.company.vendor.resultUpdate;

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
          "features/company/vendor/actCreateVendor",
          this.form.model
        );
        var response = this.$store.state.features.company.vendor.resultCreate;

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
    },
    /*** TAB CUSTOMER END ***/

    /*** TAB ADDRESS BEGIN ***/
    async handleGetTabAddress(url) {
      await this.doFindVendorAddresses(url);
    },
    async onFormTabAddressClose() {
      this.ErrorMessage = "";
      this.isFormAddress = false;
      this.formAddress.isEdit = false;

      this.resetFormTabAddress();
    },
    resetFormTabAddress() {
      this.formAddress.model.VendorAddressId = "";
      this.formAddress.model.VendorId = "";
      this.formAddress.model.VendorCode = "";
      this.formAddress.model.VendorName = "";
      this.formAddress.model.AddressCode = "";
      this.formAddress.model.AddressName = "";
      this.formAddress.model.CityCode = "";
      this.formAddress.model.ContactPerson = "";
      this.formAddress.model.Address = "";
      this.formAddress.model.Handphone = "";
      this.formAddress.model.Phone1 = "";
      this.formAddress.model.Extension1 = "";
      this.formAddress.model.Phone2 = "";
      this.formAddress.model.Extension2 = "";
      this.formAddress.model.Fax = "";
      this.formAddress.model.EmailAddress = "";
      this.formAddress.model.HomePage = "";
      this.formAddress.model.Neighbourhood = "";
      this.formAddress.model.Hamlet = "";
      this.formAddress.model.UrbanVillage = "";
      this.formAddress.model.SubDistrict = "";
      this.formAddress.model.PostCode = "";
      this.formAddress.model.IsSameAddress = true;
      this.formAddress.model.TaxAddressId = "";
      this.formAddress.model.Default = false;

      this.formAddress.display.Province = "";
      this.formAddress.display.Country = "";
      this.formAddress.display.TaxAddressCode = "";

      this.$nextTick(() => {
        this.$refs.observerAddress.reset();
      });
    },
    async onFormCreateTabAddress() {
      this.resetFormTabAddress();

      this.formAddress.model.VendorId = this.form.model.VendorId;
      this.formAddress.model.VendorCode = this.form.model.VendorCode;
      this.formAddress.model.VendorName = this.form.model.VendorName;

      this.formAddress.isEdit = false;
      this.isFormAddress = true;
    },
    async handleEditTabAddress(row) {
      this.isFormAddress = true;

      this.formAddress.model.VendorAddressId = row.VendorAddressId;
      this.formAddress.model.VendorId = row.VendorId;
      this.formAddress.model.VendorCode = row.VendorCode;
      this.formAddress.model.VendorName = row.VendorName;
      this.formAddress.model.AddressCode = row.AddressCode;
      this.formAddress.model.AddressName = row.AddressName;
      this.formAddress.model.CityCode = row.CityCode;
      this.formAddress.model.ContactPerson = row.ContactPerson;
      this.formAddress.model.Address = row.Address;
      this.formAddress.model.Handphone = row.Handphone;
      this.formAddress.model.Phone1 = row.Phone1;
      this.formAddress.model.Extension1 = row.Extension1;
      this.formAddress.model.Phone2 = row.Phone2;
      this.formAddress.model.Extension2 = row.Extension2;
      this.formAddress.model.Fax = row.Fax;
      this.formAddress.model.EmailAddress = row.EmailAddress;
      this.formAddress.model.HomePage = row.HomePage;
      this.formAddress.model.Neighbourhood = row.Neighbourhood;
      this.formAddress.model.Hamlet = row.Hamlet;
      this.formAddress.model.UrbanVillage = row.UrbanVillage;
      this.formAddress.model.SubDistrict = row.SubDistrict;
      this.formAddress.model.PostCode = row.PostCode;
      this.formAddress.model.IsSameAddress = row.IsSameAddress;
      this.formAddress.model.TaxAddressId = row.TaxAddressId;
      this.formAddress.model.Default =
        row.Default.toLowerCase() == "default" ? true : false;

      this.formAddress.display.Province = row.Province;
      this.formAddress.display.Country = row.CountryName;
      this.formAddress.display.TaxAddressCode = "";

      if (this.formAddress.model.TaxAddressId != "") {
        var response = await this.$store.dispatch(
          "features/company/vendor_address/actGetDataVendorById",
          this.formAddress.model.TaxAddressId
        );
        if (response.status == 200) {
          if (response.data.VendorAddresses.length > 0) {
            var data = response.data.VendorAddresses[0];
            this.formAddress.display.TaxAddressCode = data.AddressCode;
          }
        }
      }

      this.formAddress.isEdit = true;
    },
    async selectCity(value) {
      var Province;
      var CountryName;
      this.$store.state.features.company.city.data.forEach(function(
        row,
        index
      ) {
        if (row.CityCode == value) {
          Province = row.Province;
          CountryName = row.CountryName;
        }
      });
      this.formAddress.display.Province = Province;
      this.formAddress.display.Country = CountryName;
    },
    async changeRadioTaxAddress() {
      if (this.formAddress.model.IsSameAddress) {
        this.formAddress.model.TaxAddressId = "";
        this.formAddress.display.TaxAddressCode = "";
      }
    },
    async onModalSearchVendorAddress2(reff, active) {
      await this.doFindVendorAddresses();

      this.isShowVendorAddress2 = true;
    },
    async handleSelectVendorAddress2(row) {
      this.formAddress.model.TaxAddressId = row.VendorAddressId;
      this.formAddress.display["TaxAddressCode"] = row.AddressCode;

      this.isShowVendorAddress2 = false;
    },
    async doDeleteVendorAddress(row) {
      this.showLoader(true);

      await this.$store.dispatch(
        "features/company/vendor_address/actDeleteData",
        row
      );

      var response = this.$store.state.features.company.vendor_address.resultDelete;
      if (response.status != 200) {
        this.handleToast(
          "Confirmation",
          "danger",
          response.data.ErrorDescription != null
            ? response.data.ErrorDescription
            : "Delete failed."
        );
      } else {
        this.$refs.gridVendorAddress.doRefresh();

        this.handleToast("Confirmation", "success", "Successfully deleted");
      }

      this.showLoader(false);
    },
    async handleDeleteTabAddress(row) {
      this.$bvModal
        .msgBoxConfirm("Are you sure ?", {
          title: "Delete Vendor Address",
          size: "sm",
          buttonSize: "sm",
          okVariant: "blue",
          centered: true,
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0"
        })
        .then(ok => {
          if (ok) {
            this.doDeleteVendorAddress(row);
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    async onSubmitAddress() {
      this.showLoader(true);

      if (this.formAddress.isEdit) {
        await this.$store.dispatch(
          "features/company/vendor_address/actUpdateData",
          this.formAddress.model
        );
        var response = this.$store.state.features.company.vendor_address
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
          this.isFormAddress = false;
          this.formAddress.isEdit = false;

          this.$refs.gridVendorAddress.doRefresh();

          this.handleToast("Confirmation", "success", "Successfully updated");
        }
      } else {
        await this.$store.dispatch(
          "features/company/vendor_address/actCreateData",
          this.formAddress.model
        );
        var response = this.$store.state.features.company.vendor_address
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
          this.isFormAddress = false;
          this.formAddress.isEdit = false;

          this.$refs.gridVendorAddress.doRefresh();

          this.handleToast("Confirmation", "success", "Successfully saved");
        }
      }

      this.showLoader(false);
    }

    /*** TAB ADDRESS END ***/
  }
};
</script>

<style scoped>
.address-detail label {
  color: #283593;
  font-size: 11px;
  opacity: 0.8px;
  padding-bottom: 0px;
  font-weight: bold;
}

.currency{
  font-size:12px;
  text-align: right;
  padding-right: 5px;
}
</style>
