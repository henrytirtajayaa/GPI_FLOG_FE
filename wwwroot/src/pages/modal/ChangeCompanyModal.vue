<template>
  <b-modal ref="modal-change-company" hide-footer size="md">
    <template v-slot:modal-title>
      <span class="font-weight-bold">Select Company</span>
    </template>
    <b-row>
      <b-col md="12">
        <b-card-group>
          <b-card-body>
            <div>
              <b-form-group>
                <b-row>
                  <b-col>
                    <h1>Welcome, <span style="text-transform: capitalize;">{{this.$store.state.name}}</span></h1>
                    <label for="DocumentType">Choose your company</label>
                    <b-form-select id="input-1"
                                   v-model="selectedCompany"
                                   :options="selectOptions"
                                   required
                                   size="sm"
                                   class="mt-3"></b-form-select>
                  </b-col>
                </b-row>
                <b-row class="mt-3">
                  <b-col cols="6">
                    <b-button variant="primary"
                              @click="onButtonClick(selectedCompany)"
                              class="px-4">Select</b-button>
                  </b-col>
                </b-row>
              </b-form-group>
            </div>
          </b-card-body>

        </b-card-group>
      </b-col>
    </b-row>

  </b-modal>
</template>
<script>
  import loginServices from '../../services/loginservices'
  export default {
    props: {
      modalId: "modal-change-company",
      isShow: false
    },
    data() {
      return {
        selectedCompany: null,
        selectOptions: [{ value: null, text: 'Please select an option' }],
        userId: '',
        accessToken: '',
        dialog: false,
        resolve: null,
        reject: null,

        model: {
          DocumentNo: ""
        },
        state: {
          userId: '',
          name: '',
          email: '',
          role: '',
          token: '',
          menus: [],
          companySecurity: '',
          companyId: ''
        },
      };
    },
    async mounted() {
    },
    methods: {

      async open(data, companyId) {
        this.selectOptions = []
        this.selectOptions.push({
          value: null,
          text: 'Please select a company',
          selected: 'selected'
        })

        for (var i = 0; i < data.length; i++) {
          if (data[i].CompanyId != companyId) {
            this.selectOptions.push({
              value: data[i].SecurityId,
              text: data[i].CompanyName

            })
          }
        }
        return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;

          this.dialog = true;

          this.$refs["modal-change-company"].show();
        });
      },
      async onButtonClick(compSecId) {
        this.dialog = false;
        this.$emit('update-company', compSecId);
        this.$refs['modal-change-company'].hide();


      }

    }
  };
</script>
