import Axios from '../../../plugins/axios';

const configUrl = "Customer?"
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
      label: 'Customer Code',
      key: 'CustomerCode',
      classes: 'text-center',
      width: 100,
      sort: true,
      filter: true,
    },
    {
      label: 'Customer Name',
      key: 'CustomerName',
      classes: 'text-left',
      width: 200,
      filter: true,
      sort: true
    },
    {
      label: 'Customer Group',
      key: 'CustomerGroupCode',
      classes: 'text-left',
      width: 100,
      sort: true,
      filter: true,
     
    },    
    {
      label: 'Address Code',
      key: 'AddressCode',
      classes: 'text-left',
      sort: true,
      filter: true,
      width: 100
    },    
    {
      label: 'Contact Person',
      key: 'ContactPerson',
      classes: 'text-center',
      sort: true,
      width: 100,
      filter: true,
    },
    {
      label: 'Address',
      key: 'Address',
      classes: 'text-left',
      width: 300,
      sort: true,
      filter: true,
    },    
    {
      label: 'Status',
      key: 'Inactive',
      _classes: 'text-center',
      width: 100,
      filter_select: true,
      filter_select_options: [
          { key: false, value: 'Active' },
          { key: true, value: 'Inactive' }
      ]
    }
  ],
});

export const actions = {
  async actGetData({ commit, rootState }, url) {
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
        for (var i = 0; i < response.data.Customers.length; i++) {
          response.data.Customers[i]['Inactive'] = (response.data.Customers[i].Inactive == true ? "Inactive " : "Active");
          response.data.Customers[i]['HasCreditLimit'] = (response.data.Customers[i].HasCreditLimit ? "Yes " : "No");
        }
        commit("FETCH_DATA", response.data.Customers);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },

  async actUpdateData({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('Customer', {
          CustomerId: model.CustomerId,
          CustomerCode: model.CustomerCode,
          CustomerName: model.CustomerName,
          AddressCode: model.AddressCode,
          TaxRegistrationNo: model.TaxRegistrationNo,
          CustomerTaxName: model.CustomerTaxName,
          CustomerGroupCode: model.CustomerGroupCode,
          PaymentTermCode: model.PaymentTermCode,
          HasCreditLimit: model.HasCreditLimit,
          CreditLimit: model.CreditLimit,
          ShipToAddressCode: model.ShipToAddressCode,
          BillToAddressCode: model.BillToAddressCode,
          TaxAddressCode : model.TaxAddressCode,
          ReceivableAccountNo: model.ReceivableAccountNo,
          AccruedReceivableAccountNo: model.AccruedReceivableAccountNo,
          Inactive: model.Inactive,         
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
  async actCreateData({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('Customer', {
   
          CustomerCode: model.CustomerCode,
          CustomerName: model.CustomerName,
          AddressCode: model.AddressCode,
          TaxRegistrationNo: model.TaxRegistrationNo,
          CustomerTaxName: model.CustomerTaxName,
          CustomerGroupCode: model.CustomerGroupCode,
          PaymentTermCode: model.PaymentTermCode,
          HasCreditLimit: model.HasCreditLimit,
          CreditLimit: model.CreditLimit,
          ShipToAddressCode: model.ShipToAddressCode,
          BillToAddressCode: model.BillToAddressCode,
          TaxAddressCode : model.TaxAddressCode,
          ReceivableAccountNo: model.ReceivableAccountNo,
          AccruedReceivableAccountNo: model.AccruedReceivableAccountNo,
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
        .delete('customer', { data: { CustomerId: row.CustomerId} })
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


