import Axios from '../../../plugins/axios';

const configUrl = "VendorGroup?"
export const state = () => ({
    data: [],
    resultDelete: {},
    resultUpdate: {},
    resultCreate: {},
    listInfo: [],
    baseUrl: configUrl,
    headers: [
        {
            label: 'Vendor Group Code',
            key: 'VendorGroupCode',
            classes: 'text-left',
            width: 200,
            sort: true,
            filter: true,
        },
        {
            label: 'Vendor Group Name',
            key: 'VendorGroupName',
            classes: 'text-left',
            sort: true,
            filter: true,
        },
        {
          label: 'Payable Account No',
          key: 'PayableAccountNo',
          classes: 'text-left',
          sort: true,
          filter: true,
        },
        {
          label: 'Status',
          key: 'InActive',
          _classes: 'text-center',
          width:'200px',
          width: 100,
          filter_select: true,
          filter_select_options: [
              { key: false, value: 'Active' },
              { key: true, value: 'Inactive' }
          ]
        }
    ]
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
            for (var i = 0; i < response.data.VendorGroups.length; i++) {
                arrData.push({  
                  VendorGroupId: response.data.VendorGroups[i].VendorGroupId,
                  VendorGroupCode: response.data.VendorGroups[i].VendorGroupCode,
                  VendorGroupName: response.data.VendorGroups[i].VendorGroupName,
                  AddressCode : response.data.VendorGroups[i].AddressCode,
                  PaymentTermCode : response.data.VendorGroups[i].PaymentTermCode,
                  PayableAccountNo : response.data.VendorGroups[i].PayableAccountNo,
                  AccruedPayableAccountNo : response.data.VendorGroups[i].AccruedPayableAccountNo,
                  InActive: (response.data.VendorGroups[i].InActive==true ? "Inactive" : "Active")
                });
            }
        }
        commit("FETCH_DATA", arrData);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
      catch (err) {
        console.log(err);
      }
    },

    async actCreate({ commit, rootState }, model) {
        try {
          var response = await new Axios({
            'Content-Type': 'application/json',
            'Authorization': rootState.token
          })
          .post('VendorGroup', {
            VendorGroupCode : model.VendorGroupCode,
            VendorGroupName : model.VendorGroupName,
            AddressCode : model.AddressCode,
            PaymentTermCode : model.PaymentTermCode,
            PayableAccountNo : model.PayableAccountNo,
            AccruedPayableAccountNo : model.AccruedPayableAccountNo,
            InActive : model.InActive
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
  
    async actUpdate({ commit, rootState }, model){
      try {
        var response = await new Axios({
          'Content-Type': 'application/json',
          'Authorization': rootState.token
        })
        .put('VendorGroup', {
            VendorGroupId : model.VendorGroupId,
            VendorGroupCode : model.VendorGroupCode,
            VendorGroupName : model.VendorGroupName,
            AddressCode : model.AddressCode,
            PaymentTermCode : model.PaymentTermCode,
            PayableAccountNo : model.PayableAccountNo,
            AccruedPayableAccountNo : model.AccruedPayableAccountNo,
            InActive : model.InActive
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
    
    async actDelete({ commit, rootState }, row) {
      try {
        var response = await new Axios({
          'Content-Type': 'application/json',
          'Authorization': rootState.token
        })
        .delete('VendorGroup', { data: { VendorGroupId: row.VendorGroupId } })
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
