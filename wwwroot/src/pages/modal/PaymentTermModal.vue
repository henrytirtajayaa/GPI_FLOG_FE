<template>
  <b-modal ref="modal-payment-term" hide-footer size="lg">
    <template v-slot:modal-title>Currency</template>
    <div class="d-block text-center">
      <SelectGrid
        ref="gridPaymentTerm"
        :fields="headerFields"
        :items="this.$store.state.features.company.payment_term.data"
        :info="this.$store.state.features.company.payment_term.listInfo"
        :baseUrl="this.$store.state.features.company.payment_term.baseUrl"
        :actGetData="handleGetData"
        :selectedItem="selectedValue"
        selectedFieldName="PaymentTermCode"
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
    modalId: "modal-payment-term",
    baseUrl: "",
    headers: "",
    items: "",
    info: "",
    reffField: "PaymentTermCode",
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
    headerFields: [
      {
        label: "Payment Term Code",
        key: "PaymentTermCode",
        _classes: "text-left",
        width:200
      },
      { label: "Description", key: "PaymentTermDesc",  },
      { label: "Due", key: "Due", _classes: "text-center", width:150},
      { label: "Unit", key: "Unit", _classes: "text-left", width:150},
    ]
  }),
  async mounted() {
    await this.$store.dispatch(
      "features/company/payment_term/actGetPaymentTerm",
      "paymentterm?"
    );
  },
  methods: {
    async handleGetData(url) {
      await this.$store.dispatch(
        "features/company/payment_term/actGetPaymentTerm",
        url
      );
    },
    async open(modelField, currentVal) {
      this.reffModelField = modelField;
      this.selectedValue = currentVal;

      await this.$store.dispatch(
        "features/company/payment_term/actGetPaymentTerm",
        "paymentterm?"
      );

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        this.dialog = true;

        this.$refs["modal-payment-term"].show();
      });
    },
    accept(str) {
      this.dialog = false;
      this.resolve(str);
    },
    cancel(str) {
      this.dialog = false;
      this.reject("rejected");
      this.$refs["modal-payment-term"].hide();
    },
    handleSelect(row) {
      this.dialog = false;
      this.actSelectedRow(row, this.reffModelField);
      this.$refs["modal-payment-term"].hide();
    }
  }
};
</script>