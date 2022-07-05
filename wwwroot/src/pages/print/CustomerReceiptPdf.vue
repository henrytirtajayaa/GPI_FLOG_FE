<template>
  <section>
    <section class="pdf-content">
      <div ref="document" v-if="isDataReady">
        <table width="100%" class="header-title">
          <tr>
            <td width="15%" style="vertical-align:top; text-align:left;">
              <img :src="data.CompanySetup.LogoImageUrl" style="height: 50px;" class="logo" />
            </td>
            <td>
              <table width="100%" style="vertical-align:top; text-align:left;font-size:12px;">
                <tr>
                  <td>
                    <strong>{{data.CompanySetup.CompanyName}}</strong>
                  </td>
                </tr>
                <tr>
                  <td>{{data.CompanyAddress.Address}}</td>
                </tr>
                <tr>
                  <td>Telp : {{data.CompanyAddress.Phone1}}, {{data.CompanyAddress.Phone1}} Fax : {{data.CompanyAddress.Fax}}</td>
                </tr>
              </table>
            </td>
            <td width="15%"></td>
          </tr>
          <tr>
            <td colspan="3" class="pt-3">
              <strong class="report-title">RECEIPT VOUCHER</strong>
            </td>
          </tr>
        </table>
        <div id="content">
          <div id="body">
            <!-- BEGIN HEADER -->
            <table>
              <tr>
                <td>
                  <table style="width:100%;" class="table-header">
                    <tr style="vertical-align: top;">
                      <td style="width:30%;">
                        <strong>Document No</strong>
                      </td>
                      <td>:</td>
                      <td>{{data.CustomerReceipt.DocumentNo}}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Document Date</strong>
                      </td>
                      <td>:</td>
                      <td>{{data.CustomerReceipt.TransactionDate | filterDate}}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Paid From</strong>
                      </td>
                      <td>:</td>
                      <td>{{data.CustomerReceipt.CustomerName}}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Currency</strong>
                      </td>
                      <td>:</td>
                      <td>{{data.CustomerReceipt.CurrencyCode}}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Amount</strong>
                      </td>
                      <td>:</td>
                      <td>
                        {{data.CustomerReceipt.OriginatingTotalPaid | currency({symbol: '', fractionCount: '2', fractionSeparator: ',',
                        thousandsSeparator: '.', symbolPosition: '', symbolSpacing: ''}) }}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Description</strong>
                      </td>
                      <td>:</td>
                      <td>{{data.CustomerReceipt.Description}}</td>
                    </tr>
                    <tr>
                      <td><strong>Total In Words</strong></td>
                      <td>:</td>
                      <td>{{data.CustomerReceipt.OriginatingTotalPaid, data.Currency.CurrencyUnit, data.Currency.CurrencySubUnit | toWords}}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <!-- END HEADER -->
            <!-- BEGIN TABLE DETAIL -->
            <!--table
              v-if="data.ReceiptDetails.length > 0"
              class="table_detail table_detail_item"
              style="width:100%;border:1px solid black;margin-top:20px;font-size:12px;font: 8pt normal Helvetica, Arial, sans-serif;"
            >
              <tr>
                <th
                  style="width:50px;padding:5px 3px;border-right:1px solid black;border-bottom:1px solid black;"
                  class="text-center"
                >NO</th>
                <th
                  style="padding:5px 3px;border-right:1px solid black;border-bottom:1px solid black;"
                  class="text-left border_right border_bottom"
                >DESCRIPTION</th>
                <th
                  style="width:100px;padding:5px 3px;border-bottom:1px solid black;"
                  class="text-center border_right border_bottom"
                >AMOUNT</th>
              </tr>

              <tr v-for="(item, itemIndex) in data.ReceiptDetails">
                <td
                  style="padding:5px 3px;border-right:1px solid black;"
                  class="text-center"
                >{{itemIndex+1}}</td>
                <td style="padding:5px 3px;border-right:1px solid black;">{{item.DocumentNo}}</td>
                <td style="padding:5px 3px;" class="text-right">
                  {{item.OriginatingPaid | currency({symbol: '', fractionCount: '2', fractionSeparator: ',',
                  thousandsSeparator: '.', symbolPosition: '', symbolSpacing: ''})}}
                </td>
              </tr>
              <tr v-for="(item) in numbers" v-if="data.ReceiptDetails.length<5">
                <td style="border-right:1px solid black;">&nbsp;</td>
                <td style="border-right:1px solid black;">&nbsp;</td>
                <td style>&nbsp;</td>
              </tr>
              <tr>
                <td
                  style="padding:5px 3px;border-top:1px solid black;border-right:1px solid black;"
                  class="text-right"
                  colspan="2"
                >
                  <strong>TOTAL AMOUNT</strong>
                </td>
                <td style="padding:5px 3px;border-top:1px solid black;" class="text-right">
                  {{data.CustomerReceipt.AppliedTotalPaid | currency({symbol: '', fractionCount: '2', fractionSeparator: ',',
                  thousandsSeparator: '.', symbolPosition: '', symbolSpacing: ''})}}
                </td>
              </tr>
            </table -->
            <!-- END TABLE DETAIL -->

            <table style="font: 8pt normal Helvetica, Arial, sans-serif;margin-top:20px;">
              
            </table>
            <table class="table-signature"
            >
            <thead>
              <tr>
                <th style="width:20%;">CREATED BY</th>
                <th style="width:20%;">CHECKED BY</th>
                <th style="width:20%;">APPROVED BY</th>
                <th style="width:20%;">PAID BY</th>
                <th style="width:20%;">RECEIPT BY</th>
              </tr>
            </thead>
            <tbody>
              <tr style="height:80px;">
                <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
              </tr>
              
              <tr>
                <td
                  style="padding:5px 3px;border-bottom:1px solid black;border-right:1px solid black;"
                >
                  <strong>{{data.CustomerReceipt.CreatedByName}}</strong>
                </td>
                <td
                  style="padding:5px 3px;border-bottom:1px solid black;border-right:1px solid black;"
                >&nbsp;</td>
                <td style="padding:5px 3px;border-bottom:1px solid black;">&nbsp;</td>
                <td></td>
                <td></td>
              </tr>
              
            </tbody>
            
            </table>
          </div>          
            <table style="font: 8pt normal Helvetica, Arial, sans-serif;width:100%;">
              <tr>
                <td style="text-align:right;"><small>Print By {{PrintBy}} | {{PrintDate}}</small></td>
              </tr>
            </table>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import moment from 'moment';
import numberToText from 'number2text';

export default {
    name: "CustomerReceiptPdf",
    layout: "clear",
    props: {
		printData: "",
    },
    data() {
      return {
        numbers: [ 1, 2, 3, 4, 5 ],
        PrintBy: this.$store.state.name,
        PrintDate: moment().format("DD MMMM YYYY"),
        isPrint: false,      
        data: this.printData || [],
        isDataReady : false,
      };
    },
    created(){
        console.log("Created ...");
    },
    mounted () {
		this.$nextTick(() => {
            setTimeout(() => {
                this.$emit('domRendered')
            }, 1000);
		})
    },
    watch: {
        "printData"(val){
            this.data = val;

            if(this.printData != undefined){
                this.isDataReady = true
            }else{
                this.isDataReady = false
            }
        }
    },
    filters: {
        toWords: function (value, CurrencyUnit, CurrencySubUnit) {
            if (!value) return ''

            return numberToText(value, 'English', true).toUpperCase()
            .replace("ONLY", "")
            .replace("DOLLAR", CurrencyUnit).toUpperCase()
            .replace("CENT", CurrencySubUnit).toUpperCase()
            .replace(/-/g, " ");
        },

        filterDate: function (value) {
            if(!value) return ''
            //return moment(value).format('dddd, DD MMMM YYYY');
            return moment(value).format('DD MMMM YYYY');
        }
    },
    methods:{
        onPrint(){
            this.$emit('onPrintOk');
        }
    },
}
</script>

<style lang="scss" scoped>
.pdf-content {
  background: #fff;
  padding: 25px;
  width:700px;

  .logo {
    position: relative;
    top: 10px;
    left: 10px;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
  }

  #body {
    margin: 0;
  }

  #container {
    border: 1px solid #000000;
  }

  /*html{margin-bottom: 5px;}*/

  .header-title tr td {
    font-size: 11px;
    text-align: center;
  }

  .report-title {
    font-size: 14px;
    text-align: center;
  }

  .table-header tr td {
    padding-top: 5px;
    vertical-align: top;
    padding-bottom: 0px;
    font-size: 11px;
  }

  .table-signature thead tr th{
    font-size:10px;
    padding: 5px 3px;
    border: 1px solid;
  }

  .table-signature tbody tr td{
    font-size:10px;
    border: 1px solid;
  }
}
</style>