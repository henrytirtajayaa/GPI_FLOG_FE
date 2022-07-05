import Axios from '../../../plugins/axios';

const configUrl = "ContainerDepot?"
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
      label: 'Depot Code',
      key: 'DepotCode',
      width: 150,
      sort: true,
      filter: true,
    },
    {
      label: 'Depot Name',
      key: 'DepotName',
      align: 'text-left',
      sort: true,
      filter: true,
    },
    {
      label: 'City Name',
      key: 'CityName',
      align: 'text-left',
      width: 200,
      sort: true,
      filter: true,
    },
    {
      label: 'Vendor Name',
      key: 'VendorName',
      align: 'text-left',
      width: 200,
      sort: true,
      filter: true,
    },
    {
      label: 'Status',
      key: 'InActive',
      align: 'text-center',
      width: 80,
      sort: true,
      filter_select: true,
      filter_select_options: [
        { key: false, value: 'Active' },
        { key: true, value: 'Inactive' }
      ]
    },
  ],
});

export const actions = {
  async actGetContainerDepot({ commit, rootState }, url) {
    var arrContainerDepot = [];
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

        for (var i = 0; i < response.data.ContainerDepots.length; i++) {
          arrContainerDepot.push({
            ContainerDepotId: response.data.ContainerDepots[i].ContainerDepotId,
            DepotCode: response.data.ContainerDepots[i].DepotCode,
            DepotName: response.data.ContainerDepots[i].DepotName,
            OwnerVendorId: response.data.ContainerDepots[i].OwnerVendorId,
            VendorName: response.data.ContainerDepots[i].VendorName,
            VendorCode: response.data.ContainerDepots[i].VendorCode,
            CityName: response.data.ContainerDepots[i].CityName,
            CityCode: response.data.ContainerDepots[i].CityCode,
            InActive: response.data.ContainerDepots[i].InActive == true ? "Inactive " : "Active"
          });

        }
        commit("FETCH_DATA", arrContainerDepot);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },

  async actUpdateContainerDepot({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('ContainerDepot', {
          ContainerDepotId: model.ContainerDepotId,
          DepotCode: model.DepotCode,
          DepotName: model.DepotName,
          OwnerVendorId: model.OwnerVendorId,
          CityCode: model.CityCode,
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
  async actCreateContainerDepot({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('ContainerDepot', {
          DepotCode: model.DepotCode,
          DepotName: model.DepotName,
          OwnerVendorId: model.OwnerVendorId,
          CityCode: model.CityCode,
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
  async actDeleteContainerDepot({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('ContainerDepot', { data: { ContainerDepotId: row.ContainerDepotId } })
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


