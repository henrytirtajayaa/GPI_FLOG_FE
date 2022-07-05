import Axios from '../../../plugins/axios';

const configUrl = "Vendor?"
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
      label: 'Vendor Code',
      key: 'VendorCode',
      classes: 'text-left',
      width: 100,
      sort: true,
      filter: true,
    },
    {
      label: 'Vendor Name',
      key: 'VendorName',
      classes: 'text-left',
      width: 200,
      sort: true,
      filter: true,
    },
    {
      label: 'Vendor Group',
      key: 'VendorGroupCode',
      classes: 'text-left',
      width: 100,
      sort: true,
      filter: true,
    },
    {
      label: 'Address Code',
      key: 'AddressCode',
      _classes: 'text-left',
      width: 100,
      sort: true,
      filter: true,
    },
    {
      label: 'Contact Person',
      key: 'ContactPerson',
      classes: 'text-left',
      width: 100,
      sort: true,
      filter: true,
    },
    {
      label: 'Address',
      key: 'Address',
      _classes: 'text-left',
      width: 300,
      sort: true,
      filter: true,
    },
    {
      label: 'Status',
      key: 'Inactive',
      _classes: 'text-center',
      width:'200px',
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
  async actGetVendor({ commit, rootState }, url) {
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
        for (var i = 0; i < response.data.Vendors.length; i++) {
          response.data.Vendors[i]['Inactive'] = (response.data.Vendors[i].Inactive == true ? "Inactive " : "Active");
          response.data.Vendors[i]['HasCreditLimit'] = (response.data.Vendors[i].HasCreditLimit ? "Yes " : "No");
        }

        commit("FETCH_DATA", response.data.Vendors);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },

  async actUpdateVendor({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('Vendor', {
            VendorId: model.VendorId,
            VendorCode: model.VendorCode,
            VendorName: model.VendorName,
            AddressCode: model.AddressCode,
            TaxRegistrationNo: model.TaxRegistrationNo,
            VendorTaxName: model.VendorTaxName,
            VendorGroupCode: model.VendorGroupCode,
            PaymentTermCode: model.PaymentTermCode,
            HasCreditLimit: model.HasCreditLimit,
            CreditLimit: model.CreditLimit,
            ShipToAddressCode: model.ShipToAddressCode,
            BillToAddressCode: model.BillToAddressCode,
            TaxAddressCode : model.TaxAddressCode,
            PayableAccountNo: model.PayableAccountNo,
            AccruedPayableAccountNo: model.AccruedPayableAccountNo,
            Inactive: model.Inactive
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
  async actCreateVendor({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('Vendor', {
            VendorCode: model.VendorCode,
            VendorName: model.VendorName,
            AddressCode: model.AddressCode,
            TaxRegistrationNo: model.TaxRegistrationNo,
            VendorTaxName: model.VendorTaxName,
            VendorGroupCode: model.VendorGroupCode,
            PaymentTermCode: model.PaymentTermCode,
            HasCreditLimit: model.HasCreditLimit,
            CreditLimit: model.CreditLimit,
            ShipToAddressCode: model.ShipToAddressCode,
            BillToAddressCode: model.BillToAddressCode,
            TaxAddressCode : model.TaxAddressCode,
            PayableAccountNo: model.PayableAccountNo,
            AccruedPayableAccountNo: model.AccruedPayableAccountNo,
            Inactive: model.Inactive
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
        .delete('Vendor', { data: { VendorId: row.VendorId } })
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


