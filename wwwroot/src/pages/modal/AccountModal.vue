<template>
  <b-modal ref="modal-account" hide-footer size="lg">
    <template v-slot:modal-title>
      Chart of Accounts
    </template>
    <div class="d-block text-center">
      <SelectGrid
            ref="gridAccount"
            :fields="headersAccount"
            :items="this.$store.state.features.company.account.data"
            :info="this.$store.state.features.company.account.listInfo"
            :baseUrl="this.$store.state.features.company.account.baseUrl"
            :actGetData="handleGetData"
            :selectedItem="selectedValue"
            selectedFieldName="AccountId"
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
    modalId: "modal-account",
    baseUrl: "",
    headers: "",
    items: "",
    info: "",
    reffField: "AccountId",
    handleGetAccount: { type: Function },
    actSelectedRow: { type: Function },
    isSelect: { type: Boolean, default: false },
    isShow: false,
    noDirectEntry:false
  },
  components: {
    SelectGrid
  },
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    reffModelField: "",
    reffType : "",
    selectedValue: "",
    perPage: 20,
    headersAccount: [
      {
        key: "AccountId",
        label: "Account No",
        _classes: "text-left",
        width: 150
      },
      {
        key: "Description",
        label: "Description",
        _classes: "text-left"
      }
    ]
  }),
  async mounted() {
    await this.handleGetData("Account?")
  },
  methods: {
    async handleGetData(url) {
      if(this.noDirectEntry){
        await this.$store.dispatch("features/company/account/actGetOnlyDirectEntry", url);
      }else{
        await this.$store.dispatch("features/company/account/actGetOnlyActive", url);
      }      
    },
    async open(modelField, currentVal, type) {
      if(modelField != undefined)
            this.reffModelField = modelField;

      if(currentVal != undefined)
            this.selectedValue = currentVal;

      if(type != undefined)
            this.reffType = type;

      await this.handleGetData("Account?")

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        this.dialog = true;

        this.$refs['modal-account'].show();
      });
    },
    accept(str) {
      this.dialog = false;
      this.resolve(str);
    },
    cancel(str) {
      this.dialog = false;
      this.reject("rejected");
      this.$refs['modal-account'].hide();
    },
    handleSelect(row) {
      this.dialog = false;
      this.actSelectedRow(row, this.reffModelField, this.reffType);
      this.$refs['modal-account'].hide();
    }
  }
};
</script>