<template>
  <b-modal ref="modal-shippingline" hide-footer size="xl">
    <template v-slot:modal-title>Shipping Line</template>
    <div class="d-block text-center">
      <SelectGrid
        ref="gridVendor"
        :fields="headersMain"
        :items="this.$store.state.features.company.shipping_line.data"
        :info="this.$store.state.features.company.shipping_line.listInfo"
        :baseUrl="this.$store.state.features.company.shipping_line.baseUrl"
        :actGetData="handleGetData"
        :selectedItem="selectedValue"
        selectedFieldName="ShippingLineCode"
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
    modalId: "modal-shippingline",
    baseUrl: "",
    headers: "",
    items: "",
    info: "",
    reffField: "ShippingLineCode",
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
    perPage: 20,
    headersMain: [
     {
        label: 'Shipping Line Code',
        key: 'ShippingLineCode',
        width: 180,
        align: 'text-sm-left',
        sort: true,
        filter: true,
      },
      {
        label: 'Shipping Line Name',
        key: 'ShippingLineName',
        align: 'text-sm-left',
        sort: true,
        filter: true,
      },
      { 
        label: 'Type',
        key: 'ShippingLineType',
        align: 'text-sm-center',
        width: 100,
        sort: true, 
        filter: true,
      },
      { 
        label: 'Vendor Name',
        key: 'VendorName',
        align: 'text-sm-center',
        width: 300,
        sort: true, 
        filter: true,
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

      if (url.lastIndexOf("ShippingLine") < 0) {
        url = "ShippingLine?" + url;
      }
      
      await this.$store.dispatch("features/company/shipping_line/actGet", url);
    },
    async open(modelField, currentVal) {
      this.reffModelField = modelField;
      this.selectedValue = currentVal;

      await this.$store.dispatch(
        "features/company/shipping_line/actGet","ShippingLine?Inactive=false"
      );

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        this.dialog = true;

        this.$refs["modal-shippingline"].show();
      });
    },
    accept(str) {
      this.dialog = false;
      this.resolve(str);
    },
    cancel(str) {
      this.dialog = false;
      this.reject("rejected");
      this.$refs["modal-shippingline"].hide();
    },
    handleSelect(row) {
      this.dialog = false;
      this.actSelectedRow(row, this.reffModelField);
      this.$refs["modal-shippingline"].hide();
    }
  }
};
</script>
