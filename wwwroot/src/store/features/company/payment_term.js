import Axios from '../../../plugins/axios';

const configUrl = "paymentterm?" 
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
      text: 'Payment Term Code',
      value: 'PaymentTermCode',
      align: 'text-sm-left',
      width:'100px',
      sort: true,
      filter: true,
    },
    {
      text: 'Description',
      value: 'PaymentTermDesc',
      align: 'text-sm-left',
      sort: true,
      filter: true,
    },
    { 
      value: 'Due',
      text: 'Due',
      align: 'text-sm-center',
      width:'100px',
      sort: true, 
      filter: true,
    },
    { 
      text: 'Unit',
      value: 'Unit',
      align: 'text-sm-left',
      width:'100px',
      sort: true, 
      filter: true,
    }
  ], 
});

export const actions = {
  async actGetPaymentTerm({ commit, rootState }, url) {
    try {
      if(url == null || url == undefined){
        url = configUrl
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .get(url)
      if (response.status == 200) {
        
        let arrResult = [];
        for (var i = 0; i < response.data.PaymentTerms.length; i++) {
          var unit = ""
          
          if(response.data.PaymentTerms[i].Unit == 1){
            unit = "Days"
          } else if(response.data.PaymentTerms[i].Unit == 2){
            unit = "Months"
          } else {
            unit = "Years"
          }

          arrResult.push({
            PaymentTermId : response.data.PaymentTerms[i].PaymentTermId,
            PaymentTermCode : response.data.PaymentTerms[i].PaymentTermCode,
            PaymentTermDesc : response.data.PaymentTerms[i].PaymentTermDesc,
            Due : response.data.PaymentTerms[i].Due,
            Unit : unit,
            CreatedBy: response.data.PaymentTerms[i].CreatedByName,
            CreatedDate: (response.data.PaymentTerms[i].CreatedDate != null ? response.data.PaymentTerms[i].CreatedDate : ''),
            ModifiedBy: response.data.PaymentTerms[i].ModifiedByName,
            ModifiedDate: (response.data.PaymentTerms[i].ModifiedDate != null ? response.data.PaymentTerms[i].ModifiedDate : ''),
          })
        }

        commit("FETCH_DATA", arrResult);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },

  async actUpdatePaymentTerm({ commit, rootState }, model){
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .put('PaymentTerm', {
        PaymentTermId : model.PaymentTermId,
        PaymentTermCode : model.PaymentTermCode,
        PaymentTermDesc : model.PaymentTermDesc,
        Due: model.Due,
        Unit: model.Unit
      
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
  async actCreatePaymentTerm({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .post('PaymentTerm', {
        PaymentTermCode: model.PaymentTermCode,
       PaymentTermDesc: model.PaymentTermDesc,
        Due: model.Due,
        Unit: model.Unit,
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
  async actDeletePaymentTerm({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .delete('PaymentTerm', { data: { PaymentTermId: row.PaymentTermId } })
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


