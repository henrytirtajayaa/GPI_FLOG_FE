<template>
  <b-modal ref="modal-customer_group" hide-footer size="lg">
    <template v-slot:modal-title>Customer Group</template>
    <div class="d-block text-center">
      <SelectGrid
        ref="gridCustomerGroup"
        :fields="headersAccount"
        :items="this.$store.state.features.company.customer_group.data"
        :info="this.$store.state.features.company.customer_group.listInfo"
        :baseUrl="this.$store.state.features.company.customer_group.baseUrl"
        :actGetData="handleGetData"
        :selectedItem="selectedValue"
        selectedFieldName="CustomerGroupCode"
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
    modalId: "modal-customer_group",
    baseUrl: "",
    headers: "",
    items: "",
    info: "",
    reffField: "CustomerGroupCode",
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
    headersAccount: [
      {
        label: "Code",
        key: "CustomerGroupCode",
        _classes: "text-left",
        width:100
      },
      { 
        label: "Name", 
        key: "CustomerGroupName",
        _classes: "text-left",
        width:100
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

      if (url.lastIndexOf("CustomerGroup") < 0) {
        url = "CustomerGroup?" + url;
      }

      await this.$store.dispatch("features/company/customer_group/actGet", url);
    },
    async open(modelField, currentVal) {
      this.reffModelField = modelField;
      this.selectedValue = currentVal;

      await this.$store.dispatch(
        "features/company/customer_group/actGet",
        "CustomerGroup?"
      );
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        this.dialog = true;

        this.$refs["modal-customer_group"].show();
      });
    },
    accept(str) {
      this.dialog = false;
      this.resolve(str);
    },
    cancel(str) {
      this.dialog = false;
      this.reject("rejected");
      this.$refs["modal-customer_group"].hide();
    },
    handleSelect(row) {
      this.dialog = false;
      this.actSelectedRow(row, this.reffModelField);
      this.$refs["modal-customer_group"].hide();
    }
  }
};
</script>