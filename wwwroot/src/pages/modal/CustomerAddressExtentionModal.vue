<template>
  <b-modal ref="modal-address-detail"
           size="lg"
           @ok="handleOk"
           @hide="resetModal"
           @cancel="handleCancel">
    <template v-slot:modal-title>
      <span>Customer Address Detail</span>
    </template>
    <div class="d-block">
      <div class="d-block text-left">
        <b-row>
          <b-col sm="12">
            <b-row>
              <b-col sm="6">
                <label for="CustAddrName">Address Name</label>
                <b-form-input name="CustAddrName" class="font-weight-bold" readonly type="text"
                              v-model="model.AddressName"
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
                                v-model="model.ContactPerson"
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
                                v-model="model.Handphone"
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
                                   v-model="model.Address"
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
                                v-model="model.Phone1"
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
                                v-model="model.Extension1"
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
                                v-model="model.Fax"
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
                                v-model="model.Phone2"
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
                                v-model="model.Extension2"
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
                                v-model="model.EmailAddress"
                                size="sm"
                                aria-describedby="tab2-email-feedback" />
                </b-form-group>
              </b-col>
            </b-row>
            <b-card sm="12" style="margin:0; padding:0;">
              <b-row>
                <b-col sm="4">
                  <label>Billing Address</label>
                  <b-input-group prepend>
                    <b-form-input v-model="model.CustomerBillAddressCode"
                                  class="font-weight-bold"
                                  readonly
                                  size="sm"></b-form-input>
                    <b-input-group-append>
                      <b-button variant="outline-secondary"
                                size="sm"
                                @click="onModalSearchCustomerAddress('CustomerBillAddressCode','CustomerBillAddressCode')">
                        <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>
                      </b-button>

                    </b-input-group-append>
                  </b-input-group>
                </b-col>
                <b-col sm="6">
                  <label for="CustAddrName">Address Name</label>
                  <b-form-input name="CustAddrName" class="font-weight-bold" readonly type="text"
                                v-model="model.CustomerBillAddressName"
                                size="sm"
                                aria-describedby="tab2-addr-name-feedback" />
                </b-col>
                <b-col sm="4">
                  <b-form-group>
                    <label for="ContactPerson">Contact Person</label>
                    <b-form-input name="ContactPerson"
                                  class="font-weight-bold"
                                  readonly
                                  type="text"
                                  v-model="model.CustomerBillContactPerson"
                                  aria-describedby="tab2-contact-person-feedback"
                                  size="sm" />
                  </b-form-group>
                </b-col>
                <b-col sm="6">
                  <b-form-group>
                    <label for="ContactPerson">Address</label>
                    <b-form-input name="Address"
                                  class="font-weight-bold"
                                  readonly
                                  type="text"
                                  v-model="model.CustomerBillAddress"
                                  aria-describedby="tab2-contact-person-feedback"
                                  size="sm" />
                  </b-form-group>
                </b-col>
              </b-row>
            </b-card>
            <br />
            <b-card sm="12" style="margin:0; padding:0;">
              <b-row>

                <b-col sm="4">
                  <label>Ship To Address</label>
                  <b-input-group prepend>
                    <b-form-input v-model="model.CustomerShipAddressCode"
                                  class="font-weight-bold"
                                  readonly
                                  size="sm"></b-form-input>
                    <b-input-group-append>
                      <b-button variant="outline-secondary"
                                size="sm"
                                @click="onModalSearchCustomerAddress('CustomerShipAddressCode','CustomerShipAddressCode')">
                        <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>
                      </b-button>

                    </b-input-group-append>
                  </b-input-group>
                </b-col>
                <b-col sm="6">
                  <label>Address Name</label>
                  <b-form-input name="CustomerShipAddressName" class="font-weight-bold" readonly type="text"
                                v-model="model.CustomerShipAddressName"
                                size="sm"
                                aria-describedby="tab2-addr-name-feedback" />
                </b-col>
                <b-col sm="4">
                  <b-form-group>
                    <label>Contact Person</label>
                    <b-form-input name="ContactPerson"
                                  class="font-weight-bold"
                                  readonly
                                  type="text"
                                  v-model="model.CustomerShipContactPerson"
                                  aria-describedby="tab2-contact-person-feedback"
                                  size="sm" />
                  </b-form-group>
                </b-col>
                <b-col sm="6">
                  <b-form-group>
                    <label>Address</label>
                    <b-form-input name="Address"
                                  class="font-weight-bold"
                                  readonly
                                  type="text"
                                  v-model="model.CustomerShipAddress"
                                  aria-describedby="tab2-contact-person-feedback"
                                  size="sm" />
                  </b-form-group>
                </b-col>

              </b-row>
            </b-card>
          </b-col>
        </b-row>
      </div>
    </div>
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
                      :selectedItem="CustomerAddressReffField"
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
  </b-modal>

</template>

<script>
  import moment from "moment";
  import SelectGrid from "@/components/tables/SelectGrid";

  export default {
    props: {
      modalId: "modal-exchange-rate",
      actSelectedRow: { type: Function },
      isShow: false,
      rateTypeOptions: Array
    },
    components: {
      SelectGrid
    },
    data() {
      return {
        dialog: false,
        resolve: null,
        reject: null,
        isShowCustomerAddress: false,
        CustomerAddressActiveField: "",
        CustomerAddressReffField: "",
        perPage: 10,
        model: {

          CustomerId: null,
          CustomerCode: null,
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
          EmailAddress: "",
          CustomerBillAddressCode: "",
          CustomerBillAddressName: "",
          CustomerBillContactPerson: "",
          CustomerBillAddress: "",

          CustomerShipAddressCode: "",
          CustomerShipAddressName: "",
          CustomerShipContactPerson: "",
          CustomerShipAddress: "",
        },
        display: {
          TrxDate: ""
        }
      };
    },
    async mounted() {

      if (this.model.CustomerId != null)
        await this.$store.dispatch("features/company/customer_address/actGetData", "CustomerAddress?" + "&CustomerId=" + this.model.CustomerId + "&Inactive=false" + "&AddressCode=" + this.model.AddressCode);
    },
    methods: {
      async getData() {
        await this.$store.dispatch("features/company/customer_address/actGetData", "CustomerAddress?" + "&CustomerId=" + this.model.CustomerId + "&Inactive=false" + "&AddressCode=" + this.model.AddressCode);
        var data = this.$store.state.features.company.customer_address.data;
        if (data.length > 0) {
          var detail = data[0];
          this.model.CustomerCode = detail.CustomerCode;
          this.model.CustomerName = detail.CustomerName;
          this.model.AddressName = detail.AddressName;
          this.model.ContactPerson = detail.ContactPerson;
          this.model.Address = detail.Address;
          this.model.Handphone = detail.Handphone;
          this.model.Phone1 = detail.Phone1;
          this.model.Extension1 = detail.Extension1;
          this.model.Phone2 = detail.Phone2;
          this.model.Extension2 = detail.Extension2;
          this.model.Fax = detail.Fax;
          this.model.EmailAddress = detail.EmailAddress;
        }
      },


      async open(CustomerId, addressCode, CustomerBillAddressCode, CustomerShipAddressCode) {
      
        this.model.CustomerId = CustomerId;
        this.model.AddressCode = addressCode;

        this.getData();
       
        await this.$store.dispatch("features/company/customer_address/actGetData", "CustomerAddress?" + "&CustomerId=" + CustomerId + "&Inactive=false" + "&AddressCode=" + CustomerBillAddressCode);
        var databill = this.$store.state.features.company.customer_address.data;
        if (databill.length > 0) {
          var bill = databill[0];
           this.model.CustomerBillAddressCode = bill.AddressCode;
          this.model.CustomerBillAddressName = bill.AddressName;
          this.model.AddressName = bill.AddressName;
          this.model.CustomerBillContactPerson = bill.ContactPerson;
          this.model.CustomerBillAddress = bill.Address;
        }
        await this.$store.dispatch("features/company/customer_address/actGetData", "CustomerAddress?" + "&CustomerId=" + CustomerId + "&Inactive=false" + "&AddressCode=" + CustomerShipAddressCode);
        var dataship = this.$store.state.features.company.customer_address.data;
        if (dataship.length > 0) {
          var ship = dataship[0];
          this.model.CustomerShipAddressCode = ship.AddressCode;
          this.model.CustomerShipAddressName = ship.AddressName;
          this.model.CustomerShipAddressName = ship.AddressName;
          this.model.CustomerShipContactPerson = ship.ContactPerson;
          this.model.CustomerShipAddress = ship.Address;
        }


        return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;

          this.dialog = true;

          this.$refs["modal-address-detail"].show();
        });
      },
      resetModal() {
        this.model.CurrencyCode = "";
        this.model.TrxDate = moment().format("YYYY-MM-DD");
        this.model.RateType = 0;
        this.model.ExchangeRateAmount = 0;
      },
      handleOk(str) {
        if (this.actSelectedRow != undefined) {
          this.actSelectedRow(this.model);
        }
        this.dialog = false;
        this.resolve(str);
      },
      handleCancel(str) {
        this.dialog = false;
        this.reject("rejected");
      },
      async handleSelectCustomerAddress(row) {

        this.model[this.CustomerAddressActiveField] = row.AddressCode;

        if (this.CustomerAddressActiveField == "CustomerBillAddressCode") {

          this.model.CustomerBillAddressName = row.AddressName;
          this.model.CustomerBillContactPerson = row.ContactPerson;
          this.model.CustomerBillAddress = row.Address;
        } else {
          this.model.CustomerShipAddressName = row.AddressName;
          this.model.CustomerShipContactPerson = row.ContactPerson;
          this.model.CustomerShipAddress = row.Address;
        }

        this.CustomerAddressActiveField = "";
        this.CustomerAddressReffField = "";

        this.isShowCustomerAddress = false;
      },
      async onModalSearchCustomerAddress(reff, active) {
        await this.doFindCustomerAddresses();
        this.CustomerAddressReffField = this.model[reff];
        this.CustomerAddressActiveField = active;
        this.isShowCustomerAddress = true;
      },
      async handleGetCustomerAddress(url) {
        await this.doFindCustomerAddresses(url);
      },
      async doFindCustomerAddresses(url) {
        if (url == undefined) {
          url = this.$store.state.features.company.customer_address.baseUrl;
        }

        if (url.toLowerCase().lastIndexOf("customerid") < 0) {
          url =
            url + "&CustomerId=" + this.model.CustomerId + "&Inactive=false";
        } else {
          var clean_uri = url
            .toLowerCase()
            .substring(0, url.indexOf("&customerid"));
          url =
            clean_uri +
            "&CustomerId=" +
            this.model.CustomerId +
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
    }
  };
</script>
