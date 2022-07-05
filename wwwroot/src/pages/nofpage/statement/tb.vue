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
      :show-layout="true"
      :preview-in-newtab="isPreviewInNewTab"
      :paginate-elements-by-height="1400"
      :filename="FileName"
      :enable-download="true"
      :pdf-quality="4"
      pdf-format="a4"
      pdf-content-width="800px"
      ref="html2Pdf"
      @progress="onProgress($event)"
      @hasStartedDownload="hasStartedDownload()"
      @hasDownloaded="hasDownloaded()"
    >
      <!-- BEGIN CONTENT -->
      <section slot="pdf-content" class="pdf-content"  >
        <div ref="document" >
          Hello World
        </div>          
      </section>  
      <!-- END CONTENT -->
    </vue-html2pdf>
    <!-- PRINT OUT -->
  </div>
</template>

<script>

  import VueHtml2pdf from '@/components/Pdf/VueHtml2pdf';
  import moment from "moment";

  export default {
      name: "StatementTrialBalance", 
      layout: "clear",
      components: {
        VueHtml2pdf
      }, 
      data () {
        return {
          model:{
            PeriodIndex:1,
            PeriodYear:moment().format('YYYY'),
            BranchCode : '',
          },
          fileName : 'TB_',          
          reportData : [],
          hasAlreadyParsed: false,
          progress: 0,
          pdfWindow: null,
          isPrintReady: false,
          isPreviewInNewTab : false,
        }
      },
      created(){
        //this.loadDocument();
      },
      async mounted(){
        
      },
      watch: {
        "reportData"(val){          
            if(this.reportData != undefined && JSON.stringify(this.reportData).length > 0){
                this.isPrintReady = true
            }else{
                this.isPrintReady = false
            }
        }
      },
      computed: {
        FileName(){
          return this.fileName + this.model.PeriodIndex + '_' + this.model.PeriodYear + '_' + this.model.BranchCode + '.pdf';
        }
      },
      methods:{
        async loadDocument(){
          if(this.$store.state.token != null){
            if(this.$route.query != undefined){
              this.model.BranchCode = this.$route.query.BranchCode;
              this.model.PeriodIndex = this.$route.query.PeriodIndex;
              this.model.PeriodYear = this.$route.query.PeriodYear;

              await this.populateContent();
            }
          }          
        },
        async populateContent(){
          if(this.model.PeriodIndex != '' && this.model.PeriodIndex != ''){
            //TRIAL BALANCE
            await this.$store.dispatch("features/finance/glstatement/report/actGetTrialBalance", this.model);
            this.reportData = this.$store.state.features.finance.glstatement.report.data;
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