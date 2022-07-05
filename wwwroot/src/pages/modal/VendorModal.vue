<template>
  <b-modal ref="modal-vendor" hide-footer size="xl">
    <template v-slot:modal-title>Vendors</template>
    <div class="d-block text-center">
      <SelectGrid
        ref="gridVendor"
        :fields="headersMain"
        :items="this.$store.state.features.company.vendor.data"
        :info="this.$store.state.features.company.vendor.listInfo"
        :baseUrl="this.$store.state.features.company.vendor.baseUrl"
        :actGetData="handleGetData"
        :selectedItem="selectedValue"
        selectedFieldName="VendorCode"
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
    modalId: "modal-vendor",
    baseUrl: "",
    headers: "",
    items: "",
    info: "",
    reffField: "VendorCode",
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
    reffModel: [],
    perPage: 20,
    headersMain: [
      {
        label: "Vendor Code",
        key: "VendorCode",
        width: 150,
        _Classes: "text-center"
      },
      {
        label: "Vendor Name",
        key: "VendorName",
        _Classes: "text-left"
      },
      {
        label: "Vendor Group",
        key: "VendorGroupCode",
        width: 150,
        _Classes: "text-left"
      },
      {
        label: "Payment Term",
        key: "PaymentTermCode",
        width: 150,
        _classes: "text-center",
      },
      {
        label: "Credit Limit",
        key: "HasCreditLimit",
        width: 150,
        _classes: "text-center",
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

      if (url.lastIndexOf("vendor") < 0) {
        url = "vendor?" + url;
      }

      await this.$store.dispatch("features/company/vendor/actGetVendor", url);
    },
    async open(modelField, currentVal, reffObj) {
      this.reffModelField = modelField;
      this.selectedValue = currentVal;
      this.reffModel = reffObj;

      await this.$store.dispatch(
        "features/company/vendor/actGetVendor",
        "vendor?&Inactive=false"
      );

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        this.dialog = true;

        this.$refs["modal-vendor"].show();
      });
    },
    accept(str) {
      this.dialog = false;
      this.resolve(str);
    },
    cancel(str) {
      this.dialog = false;
      this.reject("rejected");
      this.$refs["modal-vendor"].hide();
    },
    handleSelect(row) {
      this.dialog = false;
      this.actSelectedRow(row, this.reffModelField, this.reffModel);
      this.$refs["modal-vendor"].hide();
    }
  }
};
</script>