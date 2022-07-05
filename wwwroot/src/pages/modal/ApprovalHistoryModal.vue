<template>
  <b-modal ref="modal-history" size="xl" hide-footer @hide="resetModal">
    <template v-slot:modal-title>
      <span class="font-weight-bold">Approval History</span>
    </template>
    <div class="d-block">
      <b-row>
        <b-col sm="12" class="table-responsive">
          <table id="table-detail"
                 width="100%"
                 class="table-light table-striped table-hover table-bordered">
            <thead>
              <tr>
                <th class="text-center" width="150">DATE</th>
                <th class="text-center" width="220">NAME</th>
                <th class="text-center" width="80">STATUS</th>
                <th class="text-center" >COMMENTS</th>
              </tr>

            </thead>
            <tbody class="position-relative">
              <template v-for="(item, itemIndex) in CommentHistory">
                <tr>
                  <td class="text-center">{{item.CommentDate}}</td>
                  <td class="text-left" >{{item.UserFullName}}</td>
                  <td class="text-center text-uppercase font-weight-bold" ><b-badge :variant="item.StatusColor">{{item.Status}}</b-badge></td>
                  <td class="text-left">{{item.Comments}}</td>
                </tr>

              </template>
            </tbody>
            <tfoot>

            </tfoot>
          </table>
        </b-col>
      </b-row>
    </div>
  </b-modal>
</template>

<script>
  import moment from "moment";

  export default {
    props: {
      modalId: "modal-history",
      isShow: false
    },
    data() {
      return {
        moneyOptions: {
          decimal: ",",
          thousands: ".",
          prefix: "",
          suffix: "",
          precision: 2,
          masked: false,
          allowBlank: false,
          min: 0
          //max: Number.MAX_SAFE_INTEGER
        },
        dialog: false,
        resolve: null,
        reject: null,
        CommentHistory: [],
        model: {
          DocumentNo: "",
          DocumentDate: "",
          CurrencyCode: "",
          DecimalPoint: 2,
          JournalDetails: Array,
          OriginatingDebit: 0,
          OriginatingCredit: 0,
          FunctionalCredit: 0,
          FunctionalDebit: 0,
        },
        isCrossCurrency: true
      };
    },
    async mounted() {
    },
    methods: {
     
      async open(data) {
        this.CommentHistory = data;
       
        return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;

          this.dialog = true;

          this.$refs["modal-history"].show();
        });
      },
      resetModal() {
       
        this.CommentHistory= []

       
      },
      handleOk(str) {
        this.dialog = false;
        this.resolve(str);
      },
      handleCancel(str) {
        this.dialog = false;
        this.reject("rejected");
      }
    }
  };
</script>

<style scoped>
  #table-detail thead th {
    font-size: 12px;
    border: 1px solid #cfd8dc;
    padding: 5px;
    background-color: #f5f5f5;
  }

  #table-detail tbody td {
    font-size: 12px;
    border-left: 0.5px solid #cfd8dc;
    border-right: 0.5px solid #cfd8dc;
    border-bottom: 1px solid #cfd8dc;
    padding: 3px;
    background-color: white;
  }

  #table-detail tfoot th {
    font-size: 12px;
    border: 1px solid #cfd8dc;
    padding: 5px;
    background-color: #f5f5f5;
  }

  .v-money {
    width: 200px;
  }

  #table-detail input:disabled {
    background-color: #e8eaf6;
    cursor: text;
    margin: 0em;
    border: 1px solid #c2cfd6;
  }
</style>
