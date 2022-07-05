import Axios from '../../../plugins/axios';

const configUrl = "VendorAddress?"
export const state = () => ({
    data: [],
    resultDelete: {},
    resultUpdate: {},
    resultCreate: {},
    listInfo: [],
    baseUrl: configUrl,
    headers: [
        {
            label: 'Address Code',
            key: 'AddressCode',
            _classes: 'text-center',
            width: 120,
            sort: true,
            filter: true,
        },
        {
            label: 'Address Name',
            key: 'AddressName',
            classes: 'text-left',
            sort: true,
            filter: true,
        },
        /*{
            label: 'Vendor Code',
            key: 'VendorCode',
            _classes: 'text-center',
            width: 100,
            sort: true,
            filter: true,
        },
        {
            label: 'Vendor Name',
            key: 'VendorName',
            classes: 'text-left',
            sort: true,
            filter: true,
        },*/
        {
            label: 'Contact Person',
            key: 'ContactPerson',
            classes: 'text-left',
            wdith: 150,
            sort: true,
            filter: true,
        },
        {
            label: 'Address',
            key: 'Address',
            classes: 'text-left',
            sort: true,
            filter: false,
        },
        /*{
            label: 'Handphone',
            key: 'Handphone',
            classes: 'text-left',
            width: 100,
            sort: true,
            filter: false,
        },*/
        {
            label: 'Phone',
            key: 'Phone1',
            classes: 'text-left',
            width: 100,
            sort: true,
            filter: false,
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
          key: 'Default',
          label: 'Default',
          _classes: 'text-center',
          width: 100,
          filter_select: true,
          filter_select_options: [
            { key: false, value: 'Non-Default' },
            { key: true, value: 'Default-Only' }
          ]
        }*/
    ]
});

export const actions = {
    async actGetData({ commit, rootState }, url) {
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
          for (var i = 0; i < response.data.VendorAddresses.length; i++) {
            response.data.VendorAddresses[i]['Default'] = (response.data.VendorAddresses[i].Default == true ? "Default" : "");
            response.data.VendorAddresses[i]['CityName'] = (response.data.VendorAddresses[i]['CityName'] == null ? "-" : response.data.VendorAddresses[i]['CityName']);
          }

          commit("FETCH_DATA", response.data.VendorAddresses);
          commit("FETCH_DATA_INFO", response.data.ListInfo);
        }
      }
      catch (err) {
        console.log(err);
      }
    },

    async actGetDataVendor({ commit, rootState }, model) {

      try {
        var response = await new Axios({
          'Content-Type': 'application/json',
          'Authorization': rootState.token
        })
          .get('VendorAddress?AddressCode=' + model.AddressCode + '&VendorId=' + model.VendorId, model)
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
    async actGetDataVendorById({ commit, rootState }, id) {

      try {
        var response = await new Axios({
          'Content-Type': 'application/json',
          'Authorization': rootState.token
        })
          .get('VendorAddress?VendorAddressId=' + id)
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
            .post('VendorAddress', {
            VendorAddressId: model.VendorAddressId,
            VendorId: model.VendorId,
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
  
    async actUpdateData({ commit, rootState }, model){
      try {
        var response = await new Axios({
          'Content-Type': 'application/json',
          'Authorization': rootState.token
        })
        .put('VendorAddress', {
          VendorAddressId : model.VendorAddressId,
          VendorId : model.VendorId,
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
      catch (err){
        console.log(err)
      }
    },
    
    async actDeleteData({ commit, rootState }, row) {
      try {
        var response = await new Axios({
          'Content-Type': 'application/json',
          'Authorization': rootState.token
        })
        .delete('VendorAddress', { data: { VendorAddressId: row.VendorAddressId } })
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
