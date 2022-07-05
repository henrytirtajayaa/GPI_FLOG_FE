<template>
<section>
    <section class="pdf-content">
        <div  ref="document" v-if="isDataReady">
        <table width="100%" style="font-size:12px;font: 8pt normal Helvetica, Arial, sans-serif;">
            <tr>
            <td width="15%" style="vertical-align:top; text-align:left;">
                <img :src="data.CompanySetup.LogoImageUrl" style="height: 60px;" />
            </td>
            <td>
                <table width="100%" style="vertical-align:top; text-align:left;font-size:12px;">
                <tr>
                    <td>
                    <strong>{{data.CompanySetup.CompanyName}}</strong>
                    </td>
                </tr>
                <tr>
                    <td>
                    <strong>{{data.CompanyAddress.Address}}</strong>
                    </td>
                </tr>
                <tr>
                    <td>
                    <strong>Telp : {{data.CompanyAddress.Phone1}}, {{data.CompanyAddress.Phone1}} Fax : {{data.CompanyAddress.Fax}}</strong>
                    </td>
                </tr>
                </table>
            </td>
            </tr>
            <tr>
            <td>&nbsp;</td>
            </tr>
            <tr>
            <td style="text-align:center;font-size:12px;" colspan="2">
                <strong>{{data.ReceiveTransaction.DocumentType}}</strong>
            </td>
            </tr>
        </table>
        <div id="content">
            <div id="body">
            <div
                id
                style="margin-top:10px;font-size:12px;font: 8pt normal Helvetica, Arial, sans-serif;"
            >
                <table>
                <tr>
                    <td style="width:60%;">
                    <table style="width:100%;" >
                        <tr style="vertical-align: top;">
                        <td style="width:60px;">
                            <strong>To</strong>
                        </td>
                        <td>:</td>
                        <td>{{data.ReceiveTransaction.CustomerName}}</td>
                        <td style="width:150px;">
                            <strong>Document No</strong>
                        </td>
                        <td>:</td>
                        <td>{{data.ReceiveTransaction.DocumentNo}}</td>
                        </tr>
                        <tr>
                        <td>
                            <strong></strong>
                        </td>
                        <td></td>
                        <td>{{data.ReceiveTransaction.AddressBillToAddress}}</td>
                        <td>
                            <strong>Document Date</strong>
                        </td>
                        <td>:</td>
                        <td>{{data.ReceiveTransaction.TransactionDate | filterDate}}</td>
                        </tr>
                        <tr>
                        <td>
                            <strong></strong>
                        </td>
                        <td></td>
                        <td>{{data.ReceiveTransaction.CityBillToAddress}}</td>
                        <td>
                            <strong>SO Document No</strong>
                        </td>
                        <td>:</td>
                        <td>{{data.ReceiveTransaction.SoDocumentNo}}</td>
                        </tr>
                        <tr>
                        <td>
                            <strong>Currency</strong>
                        </td>
                        <td>:</td>
                        <td>{{data.ReceiveTransaction.CurrencyCode}}</td>
                        <td>
                            <strong>NS Document No</strong>
                        </td>
                        <td>:</td>
                        <td>{{data.ReceiveTransaction.NSDocumentNo}}</td>
                        </tr>
                    </table>
                    </td>
                </tr>
                </table>
            </div>
            <table
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
                <tr v-for="(item, itemIndex) in data.ReceiveTransactionDetail">
                <td
                    style="padding:0px 3px;border-right:1px solid black;"
                    class="text-center"
                >{{itemIndex+1}}</td>
                <td style="padding:0px 3px;border-right:1px solid black;">{{item.ChargesName}}</td>
                <td style="padding:0px 3px;" class="text-right">
                    {{item.OriginatingExtendedAmount | currency({symbol: '', fractionCount: '2', fractionSeparator: ',',
                    thousandsSeparator: '.', symbolPosition: '', symbolSpacing: ''})}}
                </td>
                </tr>
                <tr v-for="(item) in numbers" v-if="data.ReceiveTransactionDetail.length<5">
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
                    <strong>SUB TOTAL AMOUNT</strong>
                </td>
                <td style="padding:5px 3px;border-top:1px solid black;" class="text-right">
                    {{data.ReceiveTransaction.OriginatingExtendedAmount | currency({symbol: '', fractionCount: '2', fractionSeparator: ',',
                    thousandsSeparator: '.', symbolPosition: '', symbolSpacing: ''})}}
                </td>
                </tr>
                <tr v-if="data.ReceiveTransaction.DiscountAmount > 0">
                <td
                    style="padding:5px 3px;border-top:1px solid black;border-right:1px solid black;"
                    class="text-right"
                    colspan="2"
                >
                    <strong>DISCOUNT AMOUNT</strong>
                </td>
                <td style="padding:5px 3px;border-top:1px solid black;" class="text-right">
                    {{data.ReceiveTransaction.DiscountAmount | currency({symbol: '', fractionCount: '2', fractionSeparator: ',',
                    thousandsSeparator: '.', symbolPosition: '', symbolSpacing: ''})}}
                </td>
                </tr>
                <tr>
                <td
                    style="padding:5px 3px;border-top:1px solid black;border-right:1px solid black;"
                    class="text-right"
                    colspan="2"
                >
                    <strong>TAX AMOUNT</strong>
                </td>
                <td style="padding:5px 3px;border-top:1px solid black;" class="text-right">
                    {{data.ReceiveTransaction.TaxAmount | currency({symbol: '', fractionCount: '2', fractionSeparator: ',',
                    thousandsSeparator: '.', symbolPosition: '', symbolSpacing: ''})}}
                </td>
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
                    {{data.ReceiveTransaction.SubtotalAmount | currency({symbol: '', fractionCount: '2', fractionSeparator: ',',
                    thousandsSeparator: '.', symbolPosition: '', symbolSpacing: ''})}}
                </td>
                </tr>
            </table>
            <table style="font: 8pt normal Helvetica, Arial, sans-serif;margin-top:20px;">
                <tr>
                <th style="padding:0px 3px;">TOTAL IN WORDS</th>
                <th>:</th>
                <th>{{data.ReceiveTransaction.SubtotalAmount, data.Currency.CurrencyUnit, data.Currency.CurrencySubUnit | toWords}}</th>
                </tr>
            </table>
            <table style="font: 8pt normal Helvetica, Arial, sans-serif;margin-top:20px;">
                <tr>
                <th style="padding:0px 3px;">DESCRIPTION</th>
                <th>:</th>
                <th>{{data.ReceiveTransaction.Description}}</th>
                </tr>
            </table>
            <table style="font: 8pt normal Helvetica, Arial, sans-serif;margin-top:20px;">
                <tr>
                <th style="padding:0px 3px;" colspan="2">TERM & CONDITION</th>
                </tr>
                <tr>
                <td style="padding:0px 3px;">1.</td>
                <td>THIS INVOICE IS NOT A PROOF OF PAYMENT</td>
                </tr>
                <tr>
                <td style="padding:0px 3px;">2.</td>
                <td>ANY DICREPANCY, PLEASE NOTIFY ACCOUNT DEPARTMENT IN WRITING WITHIN 3 DAYS FROM RECEIVING THIS INVOICE</td>
                </tr>
                <tr>
                <td style="padding:0px 3px;">3.</td>
                <td>0.06%(USD) AND 0,1% (IDR) PER DAY INTEREST APPLIES ON OVERDUE</td>
                </tr>
                <tr>
                <td style="padding:0px 3px;">4.</td>
                <td>OFFICIAL RECEIPT WILL BE ISSUED FOR PAYMENT BY CASH</td>
                </tr>
                <tr>
                <td style="padding:0px 3px;">5.</td>
                <td>PAYMENT BY CHEQUE/BANK DRAFT/BILYET GIRO VALID UPON CLEARANCE IN OUR BANK</td>
                </tr>
                <tr>
                <td style="padding:0px 3px;">6.</td>
                <td>PAYMENT SHOULD BEMADE BY BANK TRANSFER, IF PAYMENT IS MADE BY CASH WOULD BE THERESPONSIBILITY OF CUSTOMER</td>
                </tr>
                <tr>
                <td style="padding:0px 3px;">7.</td>
                <td>CHEQUE/BANK DRAFTIBILYET GIRO SHOULD BECROSSES AND MADE PAYABLE TO</td>
                </tr>
                <tr>
                <th style="padding:0px 3px;" colspan="2">{{data.CompanySetup.CompanyName}}</th>
                </tr>
                <tr>
                <th style="padding:0px 3px;" colspan="2">BANK ACCOUNT</th>
                </tr>
            </table>
            <table
                style="font: 8pt normal Helvetica, Arial, sans-serif;margin-top:20px;border:1px solid black;margin-top:-1px;"
            >
                <tr>
                <th style="padding:0px 3px;width:300px" colspan="2">BANK CENTRAL ASIA</th>
                </tr>
                <tr>
                <th style="padding:0px 3px;" colspan="2">JL. DIPONEGORO NO.15, MEDAN</th>
                </tr>
                <tr>
                <th style="padding:0px 3px;" colspan="2">A/C: 022.245.8861 (IDR)</th>
                </tr>
                <tr>
                <th style="padding:0px 3px;" colspan="2">SWIFT CODE : CENAIDJA</th>
                </tr>
            </table>

            <table style="font: 8pt normal Helvetica, Arial, sans-serif;width:100%;">
                <tr>
                <th style="text-align:right;">Print By {{PrintBy}} | {{PrintDate}}</th>
                </tr>
            </table>
            </div>
        </div>
        </div>
    </section>
</section>  
</template>

<script>
import moment from 'moment';
import numberToText from 'number2text';

export default {
    name: "ReceivablePdf",
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

            return moment(value).format('dddd, DD MMMM YYYY');
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
  width: 800px;
  background: #fff;
  padding:20px;

  /*html{margin-bottom: 5px;}*/
  @page {
    margin: 50px 30px 10px 60px;
  }

  body {
    background-color: #fff;
    margin: 15px 15px 15px 15px;
    font: 8pt normal Helvetica, Arial, sans-serif;
    color: #000000;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
  }

  a {
    color: #003399;
    background-color: transparent;
    font-weight: normal;
  }

  h1 {
    color: #444;
    background-color: transparent;
    font-size: 14px;
    font-weight: normal;
    margin: 0 0 0 0;
    padding: 0px;
    text-align: left;
  }

  .logo {
    position: fixed;
    top: 10px;
    left: 15px;
    width: 200px;
  }

  #body {
    margin: 0;
  }

  p.footer {
    text-align: right;
    font-size: 11px;
    border-top: 1px solid #d0d0d0;
    line-height: 32px;
    padding: 0 10px 0 10px;
    margin: 20px 0 0 0;
  }

  #container {
    border: 1px solid #000000;
  }

  #footer {
    width: 100%;
  }

  .padding-3 {
    padding: 3px;
  }

  .padding-5 {
    padding: 5px;
  }

  .border {
    border: 1px solid #000000;
  }
  .no_border,
  .table_detail tr td.no_border {
    border: 0px;
  }

  .table_detail tr td.no_padding {
    padding: 0px;
  }
  .table_detail tr td.no_padding_top_bottom {
    padding-top: 0px;
    padding-bottom: 0px;
  }

  table.auto_width {
    width: auto;
  }

  .border_no_left {
    border-top: 1px solid #000000;
    border-right: 1px solid #000000;
    border-bottom: 1px solid #000000;
  }

  .border_no_right {
    border-top: 1px solid #000000;
    border-left: 1px solid #000000;
    border-bottom: 1px solid #000000;
  }

  .border_top {
    border-top: 1px solid #000000;
  }

  .border_right {
    border-right: 1px solid #000000;
  }

  .border_bottom {
    border-bottom: 1px solid #000000;
  }

  .v_middle {
    vertical-align: middle;
  }
  .v_top {
    vertical-align: top;
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  hr {
    margin: 1px;
    border-top: 1px solid #000000;
    border-bottom: 0px;
    border-left: 0px;
    border-right: 0px;
  }

  .table_head tr td {
    padding-top: 5px;
    vertical-align: top;
    padding-bottom: 0px;
  }

  .table_detail th {
    /*background: #f3f3f3;*/
    vertical-align: top;
  }

  .table_detail tr td {
    border-right: 1px solid #000000;
    border-left: 1px solid #000000;
    vertical-align: top;
    line-height: 15px;
  }

  .table_detail tr td {
    padding: 4px 3px 0px;
  }
  .table_detail_item tr td {
    padding: 0px 3px;
  }
  .table_detail tr.first td {
    padding-top: 4px;
  }

}
</style>