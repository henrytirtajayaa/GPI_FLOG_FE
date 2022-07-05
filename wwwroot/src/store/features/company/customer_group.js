import Axios from '../../../plugins/axios';

const configUrl = "CustomerGroup?" 
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
      label: 'Customer Group Code',
      key: 'CustomerGroupCode',
      _classes: 'text-left',
      width:'200px',
      sort: true,
      filter: true,
    },
    {
      label: 'Customer Group Name',
      key: 'CustomerGroupName',
      _classes: 'text-left',
      sort: true,
      filter: true,
    },
    // { 
    //   label: 'Payment Term',
    //   key: 'PaymentTermCode',
    //   _classes: 'text-center',
    //   width:'100px',
    //   sort: true, 
    //   filter: true,
    // },
    { 
      label: 'Receivable Account No',
      key: 'ReceivableAccountNo',
      _classes: 'text-left',
      sort: true, 
      filter: true,
    },
    // { 
    //   label: 'Accrued Rec Account',
    //   key: 'AccruedReceivableAccountNo',
    //   _classes: 'text-center',
    //   width:'150px',
    //   sort: true, 
    //   filter: true,
    // },
    {
      key: 'Inactive',
      label: 'Status',
      _classes: 'text-center',
      width: 100,
      filter_select: true,
      filter_select_options: [
        { key: false, value: 'Active' },
        { key: true, value: 'Inactive' }
      ]
    },
  ], 
});

export const actions = {
  async actGet({ commit, rootState }, url) {
    var arrData = [];
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
        for (var i = 0; i < response.data.CustomerGroups.length; i++) {
          arrData.push({  
            CustomerGroupId: response.data.CustomerGroups[i].CustomerGroupId,
            CustomerGroupCode: response.data.CustomerGroups[i].CustomerGroupCode,
            CustomerGroupName: response.data.CustomerGroups[i].CustomerGroupName,
            AddressCode : response.data.CustomerGroups[i].AddressCode,
            PaymentTermCode : response.data.CustomerGroups[i].PaymentTermCode,
            ReceivableAccountNo : response.data.CustomerGroups[i].ReceivableAccountNo,
            AccruedReceivableAccountNo : response.data.CustomerGroups[i].AccruedReceivableAccountNo,
            Inactive: (response.data.CustomerGroups[i].Inactive==true ? "Inactive" : "Active")
          });
        }
        commit("FETCH_DATA", arrData);
        commit("FETCH_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },
  async actUpdate({ commit, rootState }, model){
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .put('CustomerGroup', {
        CustomerGroupId: model.CustomerGroupId,
        CustomerGroupCode: model.CustomerGroupCode,
        CustomerGroupName: model.CustomerGroupName,
        AddressCode : model.AddressCode,
        PaymentTermCode : model.PaymentTermCode,
        ReceivableAccountNo : model.ReceivableAccountNo,
        AccruedReceivableAccountNo : model.AccruedReceivableAccountNo,
        Inactive: model.Inactive,
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
  async actCreate({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .post('CustomerGroup', {
        CustomerGroupCode: model.CustomerGroupCode,
        CustomerGroupName: model.CustomerGroupName,
        AddressCode : model.AddressCode,
        PaymentTermCode : model.PaymentTermCode,
        ReceivableAccountNo : model.ReceivableAccountNo,
        AccruedReceivableAccountNo : model.AccruedReceivableAccountNo,
        Inactive: model.Inactive,        
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
      .delete('CustomerGroup', { data: { CustomerGroupId: row.CustomerGroupId } })
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
  FETCH_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
};


