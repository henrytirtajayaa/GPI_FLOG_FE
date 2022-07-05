<template>
  <b-modal ref="modal-salesperson" hide-footer size="lg">
    <template v-slot:modal-title>Sales Person</template>
    <div class="d-block text-center">
      <SelectGrid
        ref="gridSalesPerson"
        :fields="headersMain"
        :items="this.$store.state.features.company.sales_person.data"
        :info="this.$store.state.features.company.sales_person.listInfo"
        :baseUrl="this.$store.state.features.company.sales_person.baseUrl"
        :actGetData="handleGetData"
        :selectedItem="selectedValue"
        selectedFieldName="SalesCode"
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
    modalId: "modal-salesperson",
    baseUrl: "",
    headers: "",
    items: "",
    info: "",
    reffField: "SalesCode",
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
        label: 'Sales Code',
        key: 'SalesCode',
        width: 200,
        align: 'text-sm-left',
        sort: true,
        filter: true,
      },
      {
        label: 'Sales Name',
        key: 'SalesName',
        align: 'text-sm-left',
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

      if (url.lastIndexOf("SalesPerson") < 0) {
        url = "SalesPerson?" + url;
      }
      
      await this.$store.dispatch("features/company/sales_person/actGetSalesPerson", url);
    },
    async open(modelField, currentVal) {
      this.reffModelField = modelField;
      this.selectedValue = currentVal;

      await this.$store.dispatch(
        "features/company/sales_person/actGetSalesPerson","SalesPerson?Inactive=false"
      );

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        this.dialog = true;

        this.$refs["modal-salesperson"].show();
      });
    },
    accept(str) {
      this.dialog = false;
      this.resolve(str);
    },
    cancel(str) {
      this.dialog = false;
      this.reject("rejected");
      this.$refs["modal-salesperson"].hide();
    },
    handleSelect(row) {
      this.dialog = false;
      this.actSelectedRow(row, this.reffModelField);
      this.$refs["modal-salesperson"].hide();
    }
  }
};
</script>
