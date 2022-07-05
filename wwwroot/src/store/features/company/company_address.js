import Axios from '../../../plugins/axios';

const configUrl = "CompanyAddress?"
export const state = () => ({
    data: [],
    resultDelete: {},
    resultUpdate: {},
    resultCreate: {},
    listInfo: [],
    baseUrl: configUrl,
    headers: [
        {
            text: 'Code',
            value: 'AddressCode',
            align: 'text-sm-left',
            width:120,
            sort: true,
            filter: true,
        },
        {
            text: 'Name',
            value: 'AddressName',
            align: 'text-sm-left',
            sort: true,
            filter: true,
        },
        {
            text: 'Contact Person',
            value: 'ContactPerson',
            align: 'text-sm-left',
            wdith:150,
            sort: true,
            filter: true,
        },
        {
            text: 'Address',
            value: 'Address',
            align: 'text-sm-left',
            sort: true,
            filter: true,
        },
        {
            text: 'Email Address',
            value: 'EmailAddress',
            align: 'text-sm-left',
            width: 150,
            sort: true,
            filter: true,
        },
        {
            text: 'Handphone',
            value: 'Handphone',
            align: 'text-sm-left',
            width:100,
            sort: true,
            filter: true,
        },
        {
            text: 'Phone',
            value: 'Phone1',
            align: 'text-sm-left',
            width:100,
            sort: true,
            filter: true,
        },
        {
            text: 'Default',    
            value: 'Default',
            align: 'text-sm-center',
            width:80,
            sort: true,
            filter: true,
        },
    ]
});

export const actions = {
    async actGetCompanyAddress({ commit, rootState }, url) {
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
          commit("FETCH_DATA", response.data.CompanyAddresses);
          commit("FETCH_DATA_INFO", response.data.ListInfo);
        }
      }
      catch (err) {
        console.log(err);
      }
    },

    async actCreateCompanyAddress({ commit, rootState }, model) {
        try {
          var response = await new Axios({
            'Content-Type': 'application/json',
            'Authorization': rootState.token
          })
          .post('CompanyAddress', {
            CompanyAddressId: model.CompanyAddressId,
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
  
    async actUpdateCompanyAddress({ commit, rootState }, model){
      try {
        var response = await new Axios({
          'Content-Type': 'application/json',
          'Authorization': rootState.token
        })
        .put('CompanyAddress', {
          CompanyAddressId : model.CompanyAddressId,
          PortCode : model.PortCode,
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
    
    async actDeleteCompanyAddress({ commit, rootState }, row) {
      try {
        var response = await new Axios({
          'Content-Type': 'application/json',
          'Authorization': rootState.token
        })
        .delete('CompanyAddress', { data: { CompanyAddressId: row.CompanyAddressId } })
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
