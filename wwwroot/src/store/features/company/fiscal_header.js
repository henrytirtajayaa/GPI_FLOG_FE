import Axios from '../../../plugins/axios';
import moment from 'moment'

const configUrl = "fiscalperiodheader?" 
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
      text: 'Period',
      value: 'PeriodYear',
      align: 'text-sm-center',
      width:'150px',
      sort: true,
      filter: true,
    },
    {
      text: 'Months',
      value: 'TotalPeriod',
      align: 'text-sm-center',
      width:'150px',
      sort: true,
      filter: true,
    },
    { 
      text: 'Start Date',
      value: 'StartDate',
      align: 'text-sm-center',
      sort: true, 
      filter: true,
    },
    { 
      text: 'End Date',
      value: 'EndDate',
      align: 'text-sm-center',
      sort: true, 
      filter: true,
    },
    { 
      text: 'Closed Year',
      value: 'ClosingYear',
      align: 'text-sm-center',
      sort: true, 
      filter: true,
    },
  ], 
});

export const actions = {
  async actGetFiscalHeader({ commit, rootState }, url) {
    var arrFiscal = [];
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
        for (var i = 0; i < response.data.FiscalPeriodHeaders.length; i++) {
          arrFiscal.push({  
            FiscalHeaderId: response.data.FiscalPeriodHeaders[i].FiscalHeaderId,
            PeriodYear: response.data.FiscalPeriodHeaders[i].PeriodYear,
            TotalPeriod: response.data.FiscalPeriodHeaders[i].TotalPeriod,
            StartDate: response.data.FiscalPeriodHeaders[i].StartDate,
            EndDate: response.data.FiscalPeriodHeaders[i].EndDate,
            ClosingYear: (response.data.FiscalPeriodHeaders[i].ClosingYear==true ? "CLOSED" : "OPEN")
          });
    }
        commit("FETCH_DATA_FISCAL_HEADER", arrFiscal);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },
  async actUpdateFiscalHeader({ commit, rootState }, model){
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .put('fiscalperiodheader', {
        FiscalHeaderId : model.FiscalHeaderId,
        PeriodYear : model.PeriodYear,
        TotalPeriod : model.TotalPeriod,
        StartDate : model.StartDate,
        EndDate : model.EndDate,
        ClosingYear : model.ClosingYear,
        FiscalDetails : model.FiscalDetails
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
  async actCreateFiscalHeader({ commit, rootState }, model) {
    try {
      
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .post('fiscalperiodheader', {
        PeriodYear : model.PeriodYear,
        TotalPeriod : model.TotalPeriod,
        StartDate : model.StartDate,
        EndDate : model.EndDate,
        ClosingYear : model.ClosingYear,
        FiscalDetails : model.FiscalDetails
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
  async actDeleteFiscalHeader({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .delete('fiscalperiodheader', { data: { FiscalHeaderId: row.FiscalHeaderId } })
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
  FETCH_DATA_FISCAL_HEADER: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
};


