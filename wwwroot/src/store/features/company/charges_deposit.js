import Axios from '../../../plugins/axios';

const configUrl = "ChargesDeposit?" 
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
 
  headers: [
    {
      text: 'Charges Code',
      value: 'ChargesCode',
      align: 'text-sm-center',
      width:150,
      sort: true,
      filter: true,
    },
    {
      text: 'Charges Name',
      value: 'ChargesName',
      align: 'text-sm-left',
      sort: true,
      filter: true,
    },
   
    { 
      text: 'Status',
      value: 'InActive',
      align: 'text-sm-center',
      width:100,
      sort: true, 
      filter: true,
    },
  ], 
});

export const actions = {
  async actGetCharges({ commit, rootState }, url) {
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
        for (var i = 0; i < response.data.Charges.length; i++) {
          response.data.Charges[i]['HasCostingCaption'] = (response.data.Charges[i].HasCosting == true ? "YES" : "");
        }

        commit("FETCH_DATA", response.data.Charges);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },

  async actUpdateCharges({ commit, rootState }, model){
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('Charges', {
          ChargesId: model.ChargesId,
          ChargesCode: model.ChargesCode,
          ChargeGroupCode: model.ChargeGroupCode,
          ChargesName: model.ChargesName,
          TransactionType: model.TransactionType,
          IsPurchasing : model.IsPurchasing,
          IsSales : model.IsSales,
          IsInventory : model.IsInventory,
          IsFinancial : model.IsFinancial,
          IsAsset : model.IsAsset,
          IsDeposit: model.IsDeposit,
          ShippingLineType: model.ShippingLineType,

          RevenueAccountNo: model.RevenueAccountNo,
          TempRevenueAccountNo: model.TempRevenueAccountNo,
          CostAccountNo: model.CostAccountNo,
          TaxScheduleCode: model.TaxScheduleCode,
          
          HasCosting: model.HasCosting,
          InActive: model.InActive
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
  async actCreateCharges({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('Charges', {
          ChargesId: model.ChargesId,
          ChargesCode: model.ChargesCode,
          ChargeGroupCode: model.ChargeGroupCode,
          ChargesName: model.ChargesName,
          TransactionType: model.TransactionType,
          IsPurchasing: model.IsPurchasing,
          IsSales : model.IsSales,
          IsInventory : model.IsInventory,
          IsFinancial : model.IsFinancial,
          IsAsset : model.IsAsset,
          IsDeposit: model.IsDeposit,
          ShippingLineType : model.ShippingLineType,

          RevenueAccountNo: model.RevenueAccountNo,
          TempRevenueAccountNo: model.TempRevenueAccountNo,
          CostAccountNo: model.CostAccountNo,
          TaxScheduleCode: model.TaxScheduleCode,
          
          HasCosting: model.HasCosting,
          InActive: model.InActive == "Inactive" ? true : false
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
  async actDelete({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('Charges', { data: { ChargesId: row.ChargesId } })
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


