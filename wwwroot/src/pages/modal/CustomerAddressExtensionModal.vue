<template>
  <b-modal ref="modal-cust-address-ext" 
           size="lg"
           @ok="handleOk"
           @hide="handleCancel"
           @cancel="handleCancel">
    <template v-slot:modal-title>Customer Address Detail</template>
    <div class="d-block">
        <b-card>
        <b-row>
            <label hidden>{{ model.AddressCode }}</label>
            <b-col md="6" lg="4">
                <label for="AddressName">Address Name</label>
                <b-input-group size="sm">
                    <b-form-input class="font-weight-bold"
                                id="input"
                                readonly
                                v-model="model.AddressName"
                                size="sm"></b-form-input>
                </b-input-group>
            </b-col>
            <b-col md="6" lg="4">
                <label for="ContactPerson">Contact Person</label>
                <b-input-group size="sm">
                    <b-form-input v-model="model.ContactPerson"
                                id="input"
                                readonly
                                size="sm"></b-form-input>
                </b-input-group>
            </b-col>
            <b-col md="12" lg="4">
                <label for="EmailAddress">Email Address</label>
                <b-input-group size="sm">
                    <b-form-input v-model="model.EmailAddress"
                                id="input"
                                readonly
                                size="sm"></b-form-input>
                </b-input-group>
            </b-col>
        </b-row><br>
        <b-row>
            <b-col sm="12">
                <label for="Address">Address</label>
                <b-input-group size="sm">
                    <b-form-textarea v-model="model.Address"
                                id="input"
                                readonly
                                size="sm"></b-form-textarea>
                </b-input-group>
            </b-col>
        </b-row><br>
        <b-row>
            <b-col sm="4">
                <label for="Handphone">Handphone</label>
                <b-input-group size="sm">
                    <b-form-input v-model="model.Handphone"
                                id="input"
                                readonly
                                size="sm"></b-form-input>
                </b-input-group>
            </b-col>
            <b-col sm="4">
                <label for="Phone1">
                    Phone
                    <b-badge variant="yellow">1</b-badge>
                </label>
                <b-input-group size="sm">
                    <b-form-input v-model="model.Phone1"
                                id="input"
                                readonly
                                size="sm"></b-form-input>
                </b-input-group>
            </b-col>
            <b-col sm="4">
                <label for="Ext1">
                    Ext.
                    <b-badge variant="yellow">1</b-badge>
                </label>
                <b-input-group size="sm">
                    <b-form-input v-model="model.Extension1"
                                id="input"
                                readonly
                                size="sm"></b-form-input>
                </b-input-group>
            </b-col>
        </b-row><br>
        <b-row>
            <b-col sm="4">
                <label for="Fax">Fax</label>
                <b-input-group size="sm">
                    <b-form-input v-model="model.Fax"
                                id="input"
                                readonly
                                size="sm"></b-form-input>
                </b-input-group>
            </b-col>
            <b-col sm="4">
                <label for="Phone2">Phone
                    <b-badge variant="yellow">2</b-badge>
                </label>
                <b-input-group size="sm">
                    <b-form-input v-model="model.Phone2"
                                id="input"
                                readonly
                                size="sm"></b-form-input>
                </b-input-group>
            </b-col>
            <b-col sm="4">
                <label for="Ext2">
                    Ext.
                    <b-badge variant="yellow">2</b-badge>
                </label>
                <b-input-group size="sm">
                    <b-form-input v-model="model.Extension2"
                                id="input"
                                readonly
                                size="sm"></b-form-input>
                </b-input-group>
            </b-col>
        </b-row>
        </b-card>

        <b-card>
        <b-row>
            <b-col md="12" lg="4">
                <label for="BillToAddressCode"><b>Billing Address</b></label>
                <b-input-group size="sm">
                    <b-form-input v-model="model.BillToAddressCode"
                                id="input"
                                class="font-weight-bold"
                                readonly
                                size="sm"></b-form-input>
                    <b-button variant="outline-primary"
                                size="sm"
                                :disabled="Status!=1 && Status!='New' && Status!='Shipper' && Status!='Consignee'"
                                @click="onModalSearchCustomerAddressforBilling('BillToAddressCode','BillToAddressCode')">
                        <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>
                    </b-button>
                    <b-button variant="outline-danger" size="sm" v-if="model.BillToAddressCode" 
                    :disabled="Status!=1 && Status!='New' && Status!='Shipper' && Status!='Consignee'"
                    @click="model.BillToAddressCode='', 
                            model.billing.AddressName='',
                            model.billing.ContactPerson='',
                            model.billing.Address=''">
                      <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                    </b-button>
                </b-input-group><br>
            </b-col>
            <b-col md="6" lg="4">
                <label for="AddressName">Address Name</label>
                <b-input-group size="sm">
                    <b-form-input v-model="model.billing.AddressName"
                                id="input"
                                readonly
                                size="sm"></b-form-input>
                </b-input-group>
            </b-col>
            <b-col md="6" lg="4">
                <label for="ContactPerson">Contact Person</label>
                <b-input-group size="sm">
                    <b-form-input v-model="model.billing.ContactPerson"
                                id="input"
                                readonly
                                size="sm"></b-form-input>
                </b-input-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="12">
                <label for="Address">Address</label>
                <b-input-group size="sm">
                    <b-form-textarea v-model="model.billing.Address"
                                id="input"
                                readonly
                                size="sm"></b-form-textarea>
                </b-input-group>
            </b-col>
        </b-row><br>
        </b-card>

        <b-card>
        <b-row>
            <b-col md="12" lg="4">
                <label for="ShipToAddressCode"><b>Shipping Address</b></label>
                <b-input-group size="sm">
                    <b-form-input v-model="model.ShipToAddressCode"
                                class="font-weight-bold"
                                readonly
                                size="sm"></b-form-input>
                    <b-button variant="outline-primary"
                                size="sm"
                                :disabled="Status!=1 && Status!='New' && Status!='Shipper' && Status!='Consignee'"
                                @click="onModalSearchCustomerAddressforShipping('ShipToAddressCode','ShipToAddressCode')">
                        <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>
                    </b-button>
                    <b-button variant="outline-danger" size="sm" v-if="model.ShipToAddressCode" 
                    :disabled="Status!=1 && Status!='New' && Status!='Shipper' && Status!='Consignee'"
                    @click="model.ShipToAddressCode='', 
                            model.shipping.AddressName='',
                            model.shipping.ContactPerson='',
                            model.shipping.Address=''">
                      <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                    </b-button>
                </b-input-group><br>
            </b-col>
            <b-col md="6" lg="4">
                <label for="AddressName">Address Name</label>
                <b-input-group size="sm">
                    <b-form-input v-model="model.shipping.AddressName"
                                readonly
                                size="sm"></b-form-input>
                </b-input-group>
            </b-col>
            <b-col md="6" lg="4">
                <label for="ContactPerson">Contact Person</label>
                <b-input-group size="sm">
                    <b-form-input v-model="model.shipping.ContactPerson"
                                readonly
                                size="sm"></b-form-input>
                </b-input-group>
            </b-col>
        </b-row><br>
        <b-row>
            <b-col sm="12">
                <label for="Address">Address</label>
                <b-input-group size="sm">
                    <b-form-textarea v-model="model.shipping.Address"
                                readonly
                                size="sm"></b-form-textarea>
                </b-input-group>
            </b-col>
        </b-row><br>
        </b-card>
    </div>

    <div id="page-dialogs">
      <b-modal v-model="isShowCustomerAddressforBilling" hide-footer size="lg">
        <template v-slot:modal-title>
          Billing Customer Address
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
                      :actSelectRow="handleSelectCustomerAddressforBilling"
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

    <div id="page-dialogs">
      <b-modal v-model="isShowCustomerAddressforShipping" hide-footer size="lg">
        <template v-slot:modal-title>
          Shipping Customer Address
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
                      :actSelectRow="handleSelectCustomerAddressforShipping"
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
import SelectGrid from "@/components/tables/SelectGrid";

export default {
  props: {
    modalId: "modal-cust-address-ext",
    actSelectedRow: { type: Function },
    isShow: false
  },
  components: {
      SelectGrid
  },
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    reffModelField: "",
    selectedValue: "",
    perPage: 20,
    isShowCustomerAddressforBilling: false,
    isShowCustomerAddressforShipping: false,
    CustomerAddressActiveField: "",
    CustomerAddressReffField: "",
    Status: "",
    model:{
        CustomerId: "",
        CustomerCode: "",
        AddressCode: "",
        AddressName: "",
        ContactPerson: "",
        Address: "",
        EmailAddress: "",            
        Handphone: "",
        Fax: "",
        Phone1: "",
        Extension1: "",
        Phone2: "",
        Extension2: "",
        BillToAddressCode: "",
        billing: {
            AddressName: "",
            ContactPerson: "",
            Address: ""
        },
        ShipToAddressCode: "",
        shipping: {
            AddressName: "",
            ContactPerson: "",
            Address: ""
        },
    }
  }),
  async mounted(){
      if (this.model.CustomerId != null)
        await this.$store.dispatch("features/company/customer_address/actGetData", "CustomerAddress?" + "&CustomerId=" + this.model.CustomerId + "&Inactive=false" + "&AddressCode=" + this.model.AddressCode);

        await this.$store.dispatch(
          "features/company/customer/actGetData",
          "Customer?"
      );
  },
  methods: {
    async getData(){
/////////////////// Customer /////////////////////////
        let custId = this.model.CustomerId;
        let addrCode = this.model.AddressCode;
        var header = await this.$store.dispatch(
            "features/company/customer_address/actGetData",
            "CustomerAddress?&CustomerId=" + custId + "&Inactive=false&AddressCode=" + addrCode
        );
        var dataAddress = this.$store.state.features.company.customer_address.data;

        let arrDetails = [];
        dataAddress = dataAddress[0];

////////////////////// Billing Address ////////////////////////
        let billAddr = this.model.BillToAddressCode;
        await this.$store.dispatch(
            "features/company/customer_address/actGetData",
            "CustomerAddress?CustomerId=" + custId + "&Inactive=false&AddressCode=" + billAddr
        );
        var dataBilling = this.$store.state.features.company.customer_address.data;
        dataBilling = dataBilling[0];

///////////////////////// Shipping Address /////////////////////////////////
        let shipAddr = this.model.ShipToAddressCode;
        await this.$store.dispatch(
            "features/company/customer_address/actGetData",
            "CustomerAddress?CustomerId=" + custId + "&Inactive=false&AddressCode=" + shipAddr
        );
        var dataShipping = this.$store.state.features.company.customer_address.data;
        dataShipping = dataShipping[0];

        this.checkForm(addrCode,billAddr,shipAddr,dataAddress,dataBilling,dataShipping);

        var Status = this.Status;
       
    },
    async open(custId,addrCode,billAddr,shipAddr,Status) {

        this.model.CustomerId = custId;
        this.model.AddressCode = addrCode;
        this.model.BillToAddressCode = billAddr;
        this.model.ShipToAddressCode = shipAddr;
        this.Status = Status;

        await this.getData();

        console.log("Status = " + this.Status);

        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;

            this.dialog = true;

            this.$refs["modal-cust-address-ext"].show();
      });
        
    },

    async checkForm(addrCode,billAddr,shipAddr,dataAddress,dataBilling,dataShipping){
        if(addrCode == ""){
            this.model.AddressName = "";
            this.model.ContactPerson = "";
            this.model.Address = "";
            this.model.EmailAddress = "";            
            this.model.Handphone = "";
            this.model.Fax = "";
            this.model.Phone1 = "";
            this.model.Extension1 = "";
            this.model.Phone2 = "";
            this.model.Extension2 = "";   
            this.model.BillToAddressCode = "";
            this.model.billing.AddressName = "";
            this.model.billing.ContactPerson = "";
            this.model.billing.Address = "";
            this.model.ShipToAddressCode = "";
            this.model.shipping.AddressName = "";
            this.model.shipping.ContactPerson = "";
            this.model.shipping.Address = "";
        }else{
            if(dataAddress != undefined){
                this.model.AddressName = dataAddress.AddressName;
                this.model.ContactPerson = dataAddress.ContactPerson;
                this.model.Address = dataAddress.Address;
                this.model.EmailAddress = dataAddress.EmailAddress;            
                this.model.Handphone = dataAddress.Handphone;
                this.model.Fax = dataAddress.Fax;
                this.model.Phone1 = dataAddress.Phone1;
                this.model.Extension1 = dataAddress.Extension1;
                this.model.Phone2 = dataAddress.Phone2;
                this.model.Extension2 = dataAddress.Extension2;  
            }
                        
            if(billAddr == ""){
                this.model.BillToAddressCode = "";
                this.model.billing.AddressName = "";
                this.model.billing.ContactPerson = "";
                this.model.billing.Address = "";
            }else{
                if(dataBilling != undefined){
                    this.model.BillToAddressCode = dataBilling.AddressCode;
                    this.model.billing.AddressName = dataBilling.AddressName; 
                    this.model.billing.ContactPerson = dataBilling.ContactPerson; 
                    this.model.billing.Address = dataBilling.Address;  
                }
            }
            if(shipAddr == ""){
                this.model.ShipToAddressCode = "";
                this.model.shipping.AddressName = "";
                this.model.shipping.ContactPerson = "";
                this.model.shipping.Address = "";
            }else{
                if(dataShipping != undefined){
                    this.model.ShipToAddressCode = dataShipping.AddressCode; 
                    this.model.shipping.AddressName = dataShipping.AddressName; 
                    this.model.shipping.ContactPerson = dataShipping.ContactPerson; 
                    this.model.shipping.Address = dataShipping.Address;  
                }
            }  
        }
    },

    resetForm() {
        this.model.BillToAddressCode = "";
        this.model.billing.AddressName = "";
        this.model.billing.ContactPerson = "";
        this.model.billing.Address = "";
        this.model.BillToAddressCode = "";
        this.model.billing.AddressName = ""; 
        this.model.billing.ContactPerson = ""; 
        this.model.billing.Address = "";  
        this.model.ShipToAddressCode = "";
        this.model.shipping.AddressName = "";
        this.model.shipping.ContactPerson = "";
        this.model.shipping.Address = "";
        this.model.ShipToAddressCode = ""; 
        this.model.shipping.AddressName = ""; 
        this.model.shipping.ContactPerson = ""; 
        this.model.shipping.Address = "";  
    },

    async handleSelectCustomerAddressforBilling(row) {
        this.model[this.CustomerAddressActiveField] = row.AddressCode;
        this.model.BillToAddressCode = row.AddressCode;
        this.model.billing.AddressName = row.AddressName;
        this.model.billing.ContactPerson = row.ContactPerson;
        this.model.billing.Address= row.Address;
       
        this.CustomerAddressActiveField = "";
        this.CustomerAddressReffField = "";

        this.isShowCustomerAddressforBilling = false;
      },
    async onModalSearchCustomerAddressforBilling(reff, active) {
        await this.doFindCustomerAddresses();
        this.CustomerAddressReffField = this.model[reff];
        this.CustomerAddressActiveField = active;
        this.isShowCustomerAddressforBilling = true;
      },

    async handleSelectCustomerAddressforShipping(row) {
        this.model[this.CustomerAddressActiveField] = row.AddressCode;
        this.model.ShipToAddressCode = row.AddressCode;
        this.model.shipping.AddressName = row.AddressName;
        this.model.shipping.ContactPerson = row.ContactPerson;
        this.model.shipping.Address= row.Address;
       
        this.CustomerAddressActiveField = "";
        this.CustomerAddressReffField = "";

        this.isShowCustomerAddressforShipping = false;
      },
    async onModalSearchCustomerAddressforShipping(reff, active) {
        await this.doFindCustomerAddresses();
        this.CustomerAddressReffField = this.model[reff];
        this.CustomerAddressActiveField = active;
        this.isShowCustomerAddressforShipping = true;
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

    async handleOk(str) {
      if (this.actSelectedRow != undefined) {
        this.actSelectedRow(this.model, this.Status);
      }
      this.dialog = false;
      this.resolve(str);
    },
    handleCancel(str) {
        this.dialog = false;
        this.reject("rejected");
        this.resetForm();
      },
  }
};
</script>

<style scoped>
@media only screen and (max-width: 1024px) {
  body{
    font-size:5px;
  }
  button{
    padding:5px;
    font-size:8px;
  }

  #input{
    font-size:10px;
  }

  select{
    font-size:8px;
  }
}
</style>