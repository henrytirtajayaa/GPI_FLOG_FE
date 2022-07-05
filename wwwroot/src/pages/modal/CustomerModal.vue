<template>
  <b-modal ref="modal-customer" hide-footer size="xl">
    <template v-slot:modal-title>Customers</template>
    <div class="d-block text-center">
      <SelectGrid
        ref="gridCustomer"
        :fields="headersMain"
        :items="this.$store.state.features.company.customer.data"
        :info="this.$store.state.features.company.customer.listInfo"
        :baseUrl="this.$store.state.features.company.customer.baseUrl"
        :actGetData="handleGetData"
        :selectedItem="selectedValue"
        selectedFieldName="CustomerCode"
        :actSelectRow="handleSelect"
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
</template>

<script>
import SelectGrid from "@/components/tables/SelectGrid";

export default {
  props: {
    modalId: "modal-customer",
    baseUrl: "",
    headers: "",
    items: "",
    info: "",
    reffField: "CustomerCode",
    actSelectedRow: { type: Function },
    isSelect: { type: Boolean, default: false },
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
    reffModel : [],
    perPage: 20,
    headersMain: [
      {
        label: "Customer Code",
        key: "CustomerCode",
        width: 150,
        _classes: "text-left"
      },
      {
        label: "Customer Name",
        key: "CustomerName",
        _classes: "text-left"
      },
      {
        label: "Group",
        key: "CustomerGroupCode",
        width: 150,
        _classes: "text-left"
      },
      {
        label: "Payment Term",
        key: "PaymentTermCode",
        width: 150,
        _classes: "text-center"
      },
      {
        label: "Credit Limit",
        key: "HasCreditLimit",
        _classes: "text-center",
        width: 150,
        filter_select: true,
        filter_select_options: [
          { key: false, value: "No" },
          { key: true, value: "Yes" }
        ]
      }
    ]
  }),
  methods: {
    async handleGetData(url) {
      if (url.toLowerCase().lastIndexOf("Inactive") < 0) {
        url = url + "&Inactive=false";
      } else {
        var clean_uri = url
          .toLowerCase()
          .substring(0, url.indexOf("&Inactive"));
        url =
          clean_uri + "&Inactive=false";
      }

      if (url.lastIndexOf("customer") < 0) {
        url = "customer?" + url;
      }

      await this.$store.dispatch("features/company/customer/actGetData", url);
    },
    async open(modelField, currentVal, reffObj) {
      this.reffModelField = modelField;
      this.selectedValue = currentVal;
      this.reffModel = reffObj;

      await this.$store.dispatch(
        "features/company/customer/actGetData",
        "customer?&Inactive=false"
      );

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        this.dialog = true;

        this.$refs["modal-customer"].show();
      });
    },
    accept(str) {
      this.dialog = false;
      this.resolve(str);
    },
    cancel(str) {
      this.dialog = false;
      this.reject("rejected");
      this.$refs["modal-customer"].hide();
    },
    handleSelect(row) {
      this.dialog = false;
      this.actSelectedRow(row, this.reffModelField, this.reffModel);
      this.$refs["modal-customer"].hide();
    }
  }
};
</script>