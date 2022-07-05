import Axios from '../../../plugins/axios';

const configUrl = "company?" 
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    { key: 'CompanyName', label: 'Company Name', _classes:'text-left'},
    { key: 'DatabaseId', label: 'Database', _classes:'text-left',  width: 400, },
    {
      key: 'DatabaseAddress',
      label: 'Server',
      width: 200,
    },
    { key: 'CoaSymbol', label: 'COA Symbol', _classes:'text-center',  width: 50, filter: false },
    { key: 'CoaTotalLength', label: 'COA Length', _classes:'text-center',  width: 50 },
    { key: 'InActive', label: 'Status', _classes:'text-center',  width: 50 },
  ],
});

export const actions = {
  async actGetCompany({ commit, rootState }, url) {
    try {
      if(url == null || url == undefined){
        url = configUrl
      }
      
      if(url.indexOf('undefined') > -1){
        url = url.replace('undefined',configUrl);
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .get(url)
      if (response.status == 200) {
        let arrResult = [];
        for (var i = 0; i < response.data.Companies.length; i++) {
          arrResult.push({
            CompanyId : response.data.Companies[i].CompanyId,
            CompanyName: response.data.Companies[i].CompanyName,
            DatabaseId: response.data.Companies[i].DatabaseId,
            DatabaseAddress: response.data.Companies[i].DatabaseAddress,
            DatabasePassword: response.data.Companies[i].DatabasePassword,
            CoaSymbol: response.data.Companies[i].CoaSymbol,
            CoaTotalLength: response.data.Companies[i].CoaTotalLength,
            InActive: response.data.Companies[i].InActive,
            CreatedBy: response.data.Companies[i].CreatedByName,
            CreatedDate: (response.data.Companies[i].CreatedDate != null ? response.data.Companies[i].CreatedDate : ''),
            ModifiedBy: response.data.Companies[i].ModifiedByName,
            ModifiedDate: (response.data.Companies[i].ModifiedDate != null ? response.data.Companies[i].ModifiedDate : ''),
            InActive : (response.data.Companies[i].InActive ? 'Inactive' : 'Active'),
            SmtpServer: response.data.Companies[i].SmtpServer,
            SmtpPort: response.data.Companies[i].SmtpPort,
            SmtpUser: response.data.Companies[i].SmtpUser,
            SmtpPassword: response.data.Companies[i].SmtpPassword
          });
        }
        commit("FETCH_DATA_COMPANY", arrResult);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },
  async actUpdateCompany({ commit, rootState }, model){
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .put('Company', {
        CompanyName : model.CompanyName,
        CompanyId : model.CompanyId,
        InActive : model.InActive,
        DatabaseAddress : model.DatabaseAddress,
        DatabasePassword:model.Password,
        CoaSymbol : model.CoaSymbol,
        CoaTotalLength : model.CoaTotalLength,
        SmtpServer : model.SmtpServer,
        SmtpPort : model.SmtpPort,
        SmtpUser : model.SmtpUser,
        SmtpPassword : model.SmtpPassword
      })
      .then(response => {
        commit("FETCH_RESULT_UPDATE", response);
      })
      .catch(e => {
        this.errors.push(e);
      })
    }
    catch (err){
      console.log(err)
    }
  },
  async actCreateCompany({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .post('Company', {
        CompanyName : model.CompanyName,
        DatabaseId : model.DatabaseId,
        DatabaseAddress: model.DatabaseAddress,
        DatabasePassword: model.Password,
        CoaSymbol: model.CoaSymbol,
        CoaTotalLength: model.CoaTotalLength,
        InActive: model.InActive,
        SmtpServer : model.SmtpServer,
        SmtpPort : model.SmtpPort,
        SmtpUser : model.SmtpUser,
        SmtpPassword : model.SmtpPassword
      })
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
  async actDeleteCompany({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .delete('Company', { data: { companyId: row.CompanyId } })
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
  FETCH_DATA_COMPANY: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
};


