<template>
  <div id="app">
    <!--div class="pull-right" v-if="isPrintReady">
      <b-button class="bg-green" size="sm" v-b-tooltip.hover title="Print" @click="handlePrint">
        <i class="fa fa-print"></i>
      </b-button>
      <b-button
        class="bg-primary mr-2"
        size="sm"
        v-b-tooltip.hover
        title="Download"
        @click="handleDownload"
      >
        <i class="fa fa-download"></i>
      </b-button>
      <b-button size="sm" onclick="window.close();">
        <i class="fa fa-times"></i>
      </b-button>
    </div -->
    <!-- PRINT OUT -->
    
    
    <vue-html2pdf
      :show-layout="false"
      :preview-in-newtab="isPreviewInNewTab"
      :paginate-elements-by-height="1400"
      :filename="document.FileName"
      :enable-download="true"
      :pdf-quality="4"
      pdf-format="a4"
      pdf-content-width="800px"
      ref="html2Pdf"
      @progress="onProgress($event)"
      @hasStartedDownload="hasStartedDownload()"
      @hasDownloaded="hasDownloaded()"
    >
      <ReceivablePdf
        :printData="dataPrint"
        slot="pdf-content"
        v-if="document.DocType=='receivable'"
      />
      <PayablePdf :printData="dataPrint" slot="pdf-content" v-if="document.DocType=='payable'" />
      <CustomerReceiptPdf
        :printData="dataPrint"
        slot="pdf-content"
        v-if="document.DocType=='customer_receipt'"
      />
      <VendorPaymentPdf
        :printData="dataPrint"
        slot="pdf-content"
        v-if="document.DocType=='vendor_payment'"
      />
      <CheckbookVoucherPdf
        :printData="dataPrint"
        slot="pdf-content"
        v-if="document.DocType=='checkbook_voucher'"
      />
    </vue-html2pdf>
    <!-- PRINT OUT -->
  </div>
</template>
  
  <script>
  import VueHtml2pdf from '@/components/Pdf/VueHtml2pdf';
  import {ReceivablePdf, PayablePdf, CustomerReceiptPdf, VendorPaymentPdf,CheckbookVoucherPdf} from '@/pages/print/index';

  export default {
      name: "Preview", 
      layout: "clear",
      components: {
        VueHtml2pdf, ReceivablePdf, PayablePdf, CustomerReceiptPdf, VendorPaymentPdf, CheckbookVoucherPdf
      }, 
      data () {
        return {
          document:{
            DocType : '',
            DocId : '',
            FileName : '',
          },
          dataPrint : [],
          hasAlreadyParsed: false,
          progress: 0,
          pdfWindow: null,
          isPrintReady: false,
          isPreviewInNewTab : false,
        }
      },
      created(){
        
      },
      async mounted(){
        this.loadDocument();
      },
      watch: {
        "dataPrint"(val){
          console.log( JSON.stringify(this.dataPrint).length)
            if(this.dataPrint != undefined && JSON.stringify(this.dataPrint).length > 0){
                this.isPrintReady = true
            }else{
                this.isPrintReady = false
            }
        }
      },
      methods:{
        async loadDocument(){
          if(this.$store.state.token != null){
            if(this.$route.query != undefined){
              this.document.DocType = this.$route.query.DocType;
              this.document.DocId = this.$route.query.DocId;
              this.document.FileName = this.$route.query.FileName;

              await this.populateContent();
            }
          }else{

          }    
          
          this.handlePrint();
          //this.handleDownload();
        },
        async populateContent(){
          if(this.document.DocType != '' && this.document.DocId != ''){
            let docType = this.document.DocType.toLowerCase();

            if(docType=='receivable'){
              //RECEIVABLE
              var model = {
                ReceiveTransactionId : this.document.DocId,
                CompanyId : this.$store.state.companyId
              }

              await this.$store.dispatch("features/finance/receivable/receivable_transaction/actGetDataPrint", model);
              this.dataPrint = this.$store.state.features.finance.receivable.receivable_transaction.resultDataPrint
              
            }else if(docType=='payable'){
              //PAYABLE
              var model = {
                PayableTransactionId : this.document.DocId,
                CompanyId : this.$store.state.companyId
              }

              await this.$store.dispatch("features/finance/payable/payable_transaction/actGetDataPrint", model);
              this.dataPrint = this.$store.state.features.finance.payable.payable_transaction.resultDataPrint

            }else if(docType == 'customer_receipt'){
              var model = {
                ReceiptHeaderId: this.document.DocId,
                CompanyId: this.$store.state.companyId
              };
              await this.$store.dispatch(
                "features/finance/receipt/receipt_transaction/actGetDataPrint",
                model
              );
              this.dataPrint = this.$store.state.features.finance.receipt.receipt_transaction.resultDataPrint;

            }else if(docType == 'vendor_payment'){
              var model = {
                PaymentHeaderId: this.document.DocId,
                CompanyId: this.$store.state.companyId
              };
              await this.$store.dispatch(
                "features/finance/payment/payment_transaction/actGetDataPrint",
                model
              );
              this.dataPrint = this.$store.state.features.finance.payment.payment_transaction.resultDataPrint;
              
            }else if(docType == 'checkbook_voucher'){
              var model = {
                CheckbookTransactionId : this.document.DocId,
                CompanyId : this.$store.state.companyId
              }
              await this.$store.dispatch("features/finance/checkbook/checkbook_detail/actGetDataPrint", model);
              this.dataPrint = this.$store.state.features.finance.checkbook.checkbook_detail.resultDataPrint
              
            }else{

            }
          }
        },
        onProgress (progress) {
            this.progress = progress
            
            
            console.log(`PDF generation progress: ${progress}%`)
        },

        hasStartedDownload () {
            console.log(`PDF has started generation`)
        },

        hasDownloaded () {
            this.pdfDownloaded = true

            console.log(`PDF has downloaded.`)
        },
        handlePrint(){
            //if (!await this.validateControlValue()) return
            this.isPreviewInNewTab = true;
            
            this.$refs.html2Pdf.generatePdf()
        },
        handleDownload(){
            //if (!await this.validateControlValue()) return
            this.isPreviewInNewTab = false;
            
            this.$refs.html2Pdf.generatePdf()
        },
      },
  }

  </script>
  
  <style lang="scss">
html,
body {
  width: 100%;
  padding: 0;
  margin: 0;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}

@page {
  margin: 50px 30px 10px 60px;
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  background: #fff;
  flex-direction: column;
  overflow: hidden;
}

.pull-right {
  float: right;
  position: fixed;
  top: 10px;
  right: 30px;
  cursor: hand;
}
</style>