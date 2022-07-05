import Axios from '../../../plugins/axios';

const configUrl = "CustomerAddress?"
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    /*{
      label: 'Customer Code',
      key: 'CustomerCode',
      _classes: 'text-center',
      width: 100,
    },
    {
      label: 'Customer Name',
      key: 'CustomerName',
      _classes: 'text-left',
      width: 250,
    },*/
    {
      label: 'Address Code',
      key: 'AddressCode',
      _classes: 'text-center',
      width: 130,
    },
    {
      label: 'Name',
      key: 'AddressName',
      _classes: 'text-left',
    },
    {
      label: 'Contact Person',
      key: 'ContactPerson',
      _classes: 'text-left',
      width: 150,
    },
    {
      label: 'Address',
      key: 'Address',
      _classes: 'text-left',
      filter: false,
    },
    /*{
      label: 'Handphone',
      key: 'Handphone',
      _classes: 'text-left',
      width: 100,
      sort: true,
    },*/
    {
      label: 'Phone',
      key: 'Phone1',
      _classes: 'text-left',
      width: 100,
      sorter: true,
      filter: true,
    },
    {
      label: 'City',
      key: 'CityName',
      _classes: 'text-left',
      width: 130,
      sorter: true,
      filter: true,
    },
    /*{
      label: '',
      key: 'Default',
      _classes: 'text-center',
      width: 60,
      sorter: false,
      filter: false,
    },*/
  ]
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
        for (var i = 0; i < response.data.CustomerAddresses.length; i++) {
          response.data.CustomerAddresses[i]['Default'] = (response.data.CustomerAddresses[i].Default == true ? "Default" : "");
          response.data.CustomerAddresses[i]['CityName'] = (response.data.CustomerAddresses[i]['CityName'] == null ? "-" : response.data.CustomerAddresses[i]['CityName']);
        }
        commit("FETCH_DATA", response.data.CustomerAddresses);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },


  async actGetDataCustomer({ commit, rootState }, model) {

    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get('customerAddress?AddressCode=' + model.AddressCode + '&CustomerId=' + model.CustomerId, model)
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
  async actGetDataCustomerById({ commit, rootState }, id) {

    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get('customerAddress?CustomerAddressId=' + id)
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
  async actCreateData({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('CustomerAddress', {
          CustomerAddressId: model.CustomerAddressId,
          CustomerId: model.CustomerId,
          AddressCode: model.AddressCode,
          AddressName: model.AddressName,
          ContactPerson: model.ContactPerson,
          Address: model.Address,
          Handphone: model.Handphone,
          Phone1: model.Phone1,
          Extension1: model.Extension1,
          Phone2: model.Phone2,
          Extension2: model.Extension2,
          Fax: model.Fax,
          EmailAddress: model.EmailAddress,
          HomePage: model.HomePage,
          Neighbourhood: model.Neighbourhood,
          Hamlet: model.Hamlet,
          UrbanVillage: model.UrbanVillage,
          SubDistrict: model.SubDistrict,
          CityCode: model.CityCode,
          PostCode: model.PostCode,
          IsSameAddress: model.IsSameAddress,
          TaxAddressId: model.TaxAddressId,
          Default: model.Default,
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

  async actUpdateData({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('CustomerAddress', {
          CustomerAddressId: model.CustomerAddressId,
          PortCode: model.PortCode,
          AddressCode: model.AddressCode,
          AddressName: model.AddressName,
          ContactPerson: model.ContactPerson,
          Address: model.Address,
          Handphone: model.Handphone,
          Phone1: model.Phone1,
          Extension1: model.Extension1,
          Phone2: model.Phone2,
          Extension2: model.Extension2,
          Fax: model.Fax,
          EmailAddress: model.EmailAddress,
          HomePage: model.HomePage,
          Neighbourhood: model.Neighbourhood,
          Hamlet: model.Hamlet,
          UrbanVillage: model.UrbanVillage,
          SubDistrict: model.SubDistrict,
          CityCode: model.CityCode,
          PostCode: model.PostCode,
          IsSameAddress: model.IsSameAddress,
          TaxAddressId: model.TaxAddressId,
          Default: model.Default,
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

  async actDeleteData({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('CustomerAddress', { data: { CustomerAddressId: row.CustomerAddressId } })
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
