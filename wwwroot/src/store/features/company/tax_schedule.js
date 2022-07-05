
import Axios from '../../../plugins/axios';

const configUrl = "taxSchedule?"
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    { key: 'TaxScheduleCode', label: 'Tax Schedule Code', _classes: 'text-left' },
    {
      key: 'Description',
      label: 'Description',
      width: 200,
    },
    { key: 'IsSales', label: 'Type', _classes: 'text-center', width: 100,  },
    { key: 'PercentOfSalesPurchase', label: '% Sales | Purchase', _classes: 'text-center', width: 50 },
    { key: 'TaxablePercent', label: 'Taxable Percent', _classes: 'text-center', width: 50 },
    { key: 'RoundingType', label: 'Rounding Type', _classes: 'text-center', width: 50 },
    { key: 'InActive', label: 'Status', _classes: 'text-center', width: 50 },
  ],
  
});

export const actions = {
  async actGetTaxSchedule({ commit, rootState }, url) {
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
        commit("FETCH_DATA", response.data.TaxSchedules);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },

  async actUpdateTaxSchedule({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('TaxSchedule', {
          TaxScheduleId: model.TaxScheduleId,
          TaxScheduleCode: model.TaxScheduleCode,
          Description: model.Description,
          IsSales: model.IsSales,
          PercentOfSalesPurchase: model.PercentOfSalesPurchase,
          TaxablePercent: model.TaxablePercent,
          RoundingType: model.RoundingType,
          RoundingLimitAmount: model.RoundingLimitAmount,
          TaxInclude: model.TaxInclude,
          WithHoldingTax: model.WithHoldingTax,
          TaxAccountNo: model.TaxAccountNo,
          InActive: model.InActive
        })
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
  async actCreateTaxSchedule({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('TaxSchedule', {
          TaxScheduleId: model.TaxScheduleId,
          TaxScheduleCode: model.TaxScheduleCode,
          Description: model.Description,
          IsSales: model.IsSales,
          PercentOfSalesPurchase: model.PercentOfSalesPurchase,
          TaxablePercent: model.TaxablePercent,
          RoundingType: model.RoundingType,
          RoundingLimitAmount: model.RoundingLimitAmount,
          TaxInclude: model.TaxInclude,
          WithHoldingTax: model.WithHoldingTax,
          TaxAccountNo: model.TaxAccountNo,
          InActive: model.InActive
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
        .delete('TaxSchedule', { data: { TaxScheduleId: row.TaxScheduleId } })
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


