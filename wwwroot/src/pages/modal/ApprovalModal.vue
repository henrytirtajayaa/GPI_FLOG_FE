<template>
  <b-modal ref="modal-approval" hide-footer size="xl">
    <template v-slot:modal-title>Approvals</template>
    <div class="d-block text-center">
      <SelectGrid
        ref="gridApproval"
        :fields="headersMain"
        :items="this.$store.state.features.company.approval_setup.data"
        :info="this.$store.state.features.company.approval_setup.listInfo"
        :baseUrl="this.$store.state.features.company.approval_setup.baseUrl"
        :actGetData="handleGetData"
        :selectedItem="selectedValue"
        selectedFieldName="ApprovalCode"
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
    modalId: "modal-approval",
    baseUrl: "",
    headers: "",
    items: "",
    info: "",
    reffField: "ApprovalCode",
    reffObj : [],
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
        label: "Approval Code",
        key: "ApprovalCode",
        width: 120,
        _Classes: "text-center"
      },
      {
        label: "Description",
        key: "Description",
        _Classes: "text-left"
      }
    ]
  }),
  methods: {
    async handleGetData(url) {
      await this.$store.dispatch("features/company/approval_setup/actGetData", url);
    },
    async open(modelField, currentVal, obj) {
      this.reffModelField = modelField;
      this.selectedValue = currentVal;
      this.reffObj = obj;

      await this.$store.dispatch(
        "features/company/approval_setup/actGetData",
        "ApprovalSetup?"
      );

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        this.dialog = true;

        this.$refs["modal-approval"].show();
      });
    },
    accept(str) {
      this.dialog = false;
      this.resolve(str);
    },
    cancel(str) {
      this.dialog = false;
      this.reject("rejected");
      this.$refs["modal-approval"].hide();
    },
    handleSelect(row) {
      this.dialog = false;
      this.actSelectedRow(row, this.reffModelField, this.reffObj);
      this.$refs["modal-approval"].hide();
    }
  }
};
</script>