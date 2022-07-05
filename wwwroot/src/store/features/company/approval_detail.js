import Axios from '../../../plugins/axios';

const configUrl = "approvalsetupdetail?" 
export const state = () => ({
  data: [],
  listInfo: [],
  baseUrl: configUrl,
 
  headers: [
    {
      text: 'Id / User Group',
      value: 'PersonName',
      align: 'text-sm-left',
      width:150,
      sort: true,
      filter: true,
      display: true
    },
    {
      text: 'Person Id',
      value: 'PersonId',
      align: 'text-sm-left',
      sort: true,
      filter: true,    
    },
    {
      text: 'Person Category Id',
      value: 'PersonCategoryId',
      align: 'left',
      visibility: 'hidden-xs-only',
      sort: true,
      filter: true,      
    },
    {
      text: 'Name',
      value: 'PersonName',
      align: 'text-sm-left',
      sort: true,
      filter: true,
      display: true
    },
    { 
      text: 'Approval Level',
      value: 'Level',
      align: 'text-sm-center',
      width: '100',
      sort: true, 
      filter: true,
      display: true
    }
    ,{ 
      text: 'Approval Limit',
      value: 'ApprovalLimit',
      currency: true,
      align: 'text-sm-right',
      sort: true, 
      filter: true,
      display: true
    }
  
  ], 
});

export const actions = {
    async actGetData({ commit, rootState }, model) {
    
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get('approvalsetupdetail?ApprovalSetupHeaderId=' + model.ApprovalSetupHeaderId, model)
        .then(response => {
          return response;
        })
        .catch(e => {
          this.errors.push(e);
          alert(this.errors);
        })
      return response;

    }
    catch (err) {
      console.log(err);
    }
  },

 
};

export const mutations = {
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
};


