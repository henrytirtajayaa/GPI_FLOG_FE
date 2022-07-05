<template>
  <b-modal ref="modal-negotiation-sheet" hide-footer size="xl">
    <template v-slot:modal-title>Negotiation Sheet</template>
    <div class="d-block text-center">
      <SelectGrid
        ref="gridNegotiationSheet"
        :fields="headersMain"
        :items="this.$store.state.features.sales.ns_progress.data"
        :info="this.$store.state.features.sales.ns_progress.listInfo"
        :baseUrl="this.$store.state.features.sales.ns_progress.baseUrl"
        :actGetData="handleGetData"
        :selectedItem="selectedValue"
        selectedFieldName="DocumentNo"
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
    modalId: "modal-negotiation-sheet",
    baseUrl: "",
    headers: "",
    items: "",
    info: "",
    reffField: "NsDocumentNo",
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
    headersMain: [
            {
                label: 'Doc. No',
                key: 'DocumentNo',
                _classes: 'text-left',
                width:150,  
                filter:true,
                sort:true,
            },
            {
                label: 'SO Doc. No',
                key: 'SoDocumentNo',
                _classes: 'text-left',
                width:150, 
            },
            {
                label: 'Customer Name',
                key: 'CustomerName',
                _classes: 'text-left'
            },
            {
                label: 'Master No',
                key: 'MasterNo',
                _classes: 'text-left'
            },
            {
                label: 'Agreement No',
                key: 'AgreementNo',
                _classes: 'text-left'
            },
            {
                label: 'Booking No',
                key: 'BookingNo',
                _classes: 'text-left'
            },
            {
                label: 'Type',
                key: 'TransactionType',
                _classes: 'text-left',
                filter: false
            }
    ]
  }),
  methods: {
    async handleGetData(url) {
      //  if (url == undefined) {
      //     url = this.$store.state.features.sales.ns_progress.baseUrl;
      //   }

        if (url.toLowerCase().lastIndexOf("TransactionType") < 0) {
          url = url + "&TransactionType=" + this.TransactionType ;
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
          url = "GetNegotiationSheetAll?" + url;
        }
    
     await this.$store.dispatch("features/sales/ns_all/actGetData", url);
    },
    async open(modelField, currentVal,TransactionType,DocumentNo) {
      this.reffModelField = modelField;
      this.selectedValue = currentVal;
      this.TransactionType = TransactionType;

      await this.$store.dispatch(
        "features/sales/ns_progress/actGetData",
        "GetNegotiationSheetAll?&TransactionType="+TransactionType
      ); 

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        this.dialog = true;

        this.$refs["modal-negotiation-sheet"].show();
      });
    },
    accept(str) {
      this.dialog = false;
      this.resolve(str);
    },
    cancel(str) {
      this.dialog = false;
      this.reject("rejected");
      this.$refs["modal-negotiation-sheet"].hide();
    },
    handleSelect(row) {
      this.dialog = false;
      this.actSelectedRow(row, this.reffModelField);
      this.$refs["modal-negotiation-sheet"].hide();
    }
  }
};
</script>
