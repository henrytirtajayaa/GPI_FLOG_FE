<template>
  <b-modal ref="modal-qutotation" hide-footer size="xl">
    <template v-slot:modal-title>Sales Quotation</template>
    <div class="d-block text-center">
      <SelectGrid
        ref="gridSalesPerson"
        :fields="this.$store.state.features.sales.quotation.headers"
        :items="this.$store.state.features.sales.quotation.data"
        :info="this.$store.state.features.sales.quotation.listInfo"
        :baseUrl="this.$store.state.features.sales.quotation.baseUrl"
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
    modalId: "modal-qutotation",
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
    DocumentNo : '',
    TransactionType : '',
    perPage: 20,
  }),
  methods: {
    async handleGetData(url) {
       if (url == undefined) {
          url = this.$store.state.features.sales.quotation.baseUrl;
        }

        if (url.toLowerCase().lastIndexOf("TransactionType") < 0) {
          url =url + "&TransactionType=" + this.TransactionType ;
        } else {
          var clean_uri = url
            .toLowerCase()
            .substring(0, url.indexOf("&TransactionType"));
          url =
            clean_uri +
            "&TransactionType=" +
            this.TransactionType ;
        }

        if (url.toLowerCase().lastIndexOf("TransactionType") < 0) {
          url = "GetSalesQuotationHistory?" + url;
        }
    
     await this.$store.dispatch("features/sales/quotation/actGetData", url);
    },
    async open(modelField, currentVal,TransactionType,DocumentNo) {
      this.reffModelField = modelField;
      this.selectedValue = currentVal;
      this.TransactionType = TransactionType;
      await this.$store.dispatch(
        "features/sales/quotation/actGetData","GetSalesQuotationHistory?Status=21&TransactionType="+TransactionType
      );

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        this.dialog = true;

        this.$refs["modal-qutotation"].show();
      });
    },
    accept(str) {
      this.dialog = false;
      this.resolve(str);
    },
    cancel(str) {
      this.dialog = false;
      this.reject("rejected");
      this.$refs["modal-qutotation"].hide();
    },
    handleSelect(row) {
      this.dialog = false;
      this.actSelectedRow(row, this.reffModelField);
      this.$refs["modal-qutotation"].hide();
    }
  }
};
</script>
