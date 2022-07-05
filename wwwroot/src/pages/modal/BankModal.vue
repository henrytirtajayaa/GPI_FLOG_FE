<template>
  <b-modal ref="modal-bank" hide-footer size="xl">
    <template v-slot:modal-title>Banks</template>
    <div class="d-block text-center">
      <SelectGrid
        ref="gridBank"
        :fields="headersMain"
        :items="this.$store.state.features.company.bank.data"
        :info="this.$store.state.features.company.bank.listInfo"
        :baseUrl="this.$store.state.features.company.bank.baseUrl"
        :actGetData="handleGetData"
        :selectedItem="selectedValue"
        selectedFieldName="BankCode"
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
    modalId: "modal-bank",
    baseUrl: "",
    headers: "",
    items: "",
    info: "",
    reffField: "BankCode",
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
        label: "Bank Code",
        key: "BankCode",
        width: 120,
        _Classes: "text-center"
      },
      {
        label: "Bank Name",
        key: "BankName",
        _Classes: "text-left"
      },
      {
        label: "Address",
        key: "Address",
        width: 100,
        _Classes: "text-left"
      },
      {
        label: "City",
        key: "CityName",
        width: 100,
        _classes: "text-center",
      }
    ]
  }),
  methods: {
    async handleGetData(url) {
      if (url.toLowerCase().lastIndexOf("InActive") < 0) {
        url = url + "&InActive=false";
      } else {
        var clean_uri = url
          .toLowerCase()
          .substring(0, url.indexOf("&InActive"));
        url =
          clean_uri + "&InActive=false";
      }

      if (url.lastIndexOf("bank") < 0) {
        url = "bank?" + url;
      }

      await this.$store.dispatch("features/company/bank/actGetBank", url);
    },
    async open(modelField, currentVal) {
      this.reffModelField = modelField;
      this.selectedValue = currentVal;

      await this.$store.dispatch(
        "features/company/bank/actGetBank",
        "bank?&InActive=false"
      );

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        this.dialog = true;

        this.$refs["modal-bank"].show();
      });
    },
    accept(str) {
      this.dialog = false;
      this.resolve(str);
    },
    cancel(str) {
      this.dialog = false;
      this.reject("rejected");
      this.$refs["modal-bank"].hide();
    },
    handleSelect(row) {
      this.dialog = false;
      this.actSelectedRow(row, this.reffModelField);
      this.$refs["modal-bank"].hide();
    }
  }
};
</script>