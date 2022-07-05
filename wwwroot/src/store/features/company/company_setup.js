import Axios from '../../../plugins/axios';

const configUrl = "companysetup?"
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [

    {
      text: 'Company Name',
      value: 'CompanyName',
      align: 'text-sm-left',
      sort: true,
      filter: true,
    },
    {
      text: 'Company Address',
      value: 'AddressName',
      align: 'text-sm-left',
      sort: true,
      filter: true,
    },
    {
      text: 'Tax Registration No',
      value: 'TaxRegistrationNo',
      align: 'text-sm-left',
      sort: true,
      filter: true,
    },
    {
      text: 'Company Tax Name',
      value: 'CompanyTaxName',
      align: 'text-sm-left',
      sort: true,
      filter: true,
    }, {
      text: 'Logo',
      value: 'CompanyLogo',
      align: 'text-sm-left',
      sort: true,
      filter: true,
    }
  ],
});

export const actions = {
  async actGetCompanySetup({ commit, rootState }, url) {
    try {
      if (url == null || url == undefined) {
        url = configUrl
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get(url)
      if (response.status == 200) {
        commit("FETCH_DATA", response.data.CompanySetup);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },

  async actUpdateCompanySetup({ commit, rootState }, model) {
    try {
      let formData = new FormData();

      formData.append('CompanySetupId', model.CompanySetupId);
      formData.append('CompanyId', model.CompanyId);
      formData.append('CompanyName', model.CompanyName);
      formData.append('CompanyAddressId', model.CompanyAddressId);
      formData.append('TaxRegistrationNo', model.TaxRegistrationNo);
      formData.append('CompanyTaxName', model.CompanyTaxName);
      formData.append('CompanyLogo', model.CompanyLogo);
      formData.append('LogoImage', model.LogoImage);
      
      var response = await new Axios({
        'Content-Type': 'multipart/form-data', //; boundary=' + formData._boundary,
        'Authorization': rootState.token
      })
        .put('CompanySetup', formData) //,{ headers: { 'Content-Type': 'multipart/form-data' }}
        .then(response => {
          commit("FETCH_RESULT_UPDATE", response);
        })
        .catch(e => {
          this.errors.push(e);
        })
    }
    catch (err) {
      console.log(err)
    }
  },
  async actCreateCompanySetup({ commit, rootState }, model) {
    try {
      let formData = new FormData();

      formData.append('CompanyId', model.CompanyId);
      formData.append('CompanyName', model.CompanyName);
      formData.append('CompanyAddressId', model.CompanyAddressId);
      formData.append('TaxRegistrationNo', model.TaxRegistrationNo);
      formData.append('CompanyTaxName', model.CompanyTaxName);
      formData.append('CompanyLogo', model.CompanyLogo);
      formData.append('LogoImage', model.LogoImage);

      var response = await new Axios({
        'Content-Type': 'multipart/form-data',
        'Authorization': rootState.token
      })
        .post('CompanySetup', formData)
        .then(response => {
          commit("FETCH_RESULT_CREATE", response);
        })
        .catch(e => {
          this.errors.push(e);
        })
    }
    catch (err) {
      console.log(err);
    }
  },
  async actDelete({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('TaxSchedule', { data: { CompanySetupId: row.CompanySetupeId } })
        .then(response => {
          commit("FETCH_RESULT_DELETE", response);
        })
        .catch(e => {
          this.errors.push(e);
          alert(this.errors);
        })
    }
    catch (err) {
      console.log(err);
    }
  }
};

export const mutations = {
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
};


