<template>
  <b-modal ref="modal-account" hide-footer size="xl">
    <template v-slot:modal-title>
      Chart of Accounts
    </template>
    <div class="d-block text-center">
      <CheckGrid
            ref="gridAccount"
            :fields="headersAccount"
            :sourceItems="allSourceItems"
            :items="this.$store.state.features.company.account.data"
            :info="this.$store.state.features.company.account.listInfo"
            :baseUrl="this.$store.state.features.company.account.baseUrl"
            :actGetData="handleGetData"
            :selectedItemArray="selectedValue"
            selectedFieldName = "AccountId"
            :actSelectRow="handleSelect"
            addTableClasses="table-bordered"
            responsive
            loading
            hover
            sorter
            pagination
            column-filter
            :itemsPerPage="perPage"
          ></CheckGrid>
    </div>    
  </b-modal>
</template>

<script>
import CheckGrid from "@/components/tables/CheckGrid";

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
    CheckGrid
  },
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    reffModelField: "",
    selectedValue: [],
    selectedFieldName:"AccountId",
    allSourceItems : [],
    perPage: 15,
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
    await this.handleGetData("Account?");
    await this.customizeHeaders("AccountSegment?");
  },
  methods: {
    async customizeHeaders(url){
      await this.$store.dispatch("features/company/account_segment/actGetAccountSegment", url);
      var segments = this.$store.state.features.company.account_segment.data;
      
      for (var i = 0; i < segments.length; i++) {
        this.headersAccount.push({
          key: "Segment" + segments[i].SegmentNo, label : segments[i].Description, 
          _classes:"text-center", width : (segments[i].Length * 40)});
      }
    },
    async handleGetData(url) {
      await this.$store.dispatch("features/company/account/actGetAccount", url);    
    },
    async open(modelField, currentVal) {
      if(modelField != undefined)
            this.reffModelField = modelField;

      if(currentVal != undefined)
            this.selectedValue = currentVal;

      //RESETING DATA TO VIEW ONLY
      await this.handleGetData("Account?offset=0&limit="+ this.perPage);

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
    handleSelect(selecteds) {
      this.dialog = false;
      this.actSelectedRow(selecteds, this.reffModelField);
      this.$refs['modal-account'].hide();
    }
  }
};
</script>

<style scoped>

</style>