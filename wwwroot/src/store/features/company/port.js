import Axios from '../../../plugins/axios';

const configUrl = "port?"
export const state = () => ({
    data: [],
    resultDelete: {},
    resultUpdate: {},
    resultCreate: {},
    listInfo: [],
    baseUrl: configUrl,
    headers: [
        {
            text: 'Port Code',
            value: 'PortCode',
            align: 'text-sm-left',
            width:'100px;',
            sort: true,
            filter: true,
        },
        {
            text: 'Port Name',
            value: 'PortName',
            align: 'text-sm-left',
            sort: true,
            filter: true,
        },
        {
            text: 'City',
            value: 'CityName',
            align: 'text-sm-left',
            width:'200px',
            sort: true,
            filter: true,
        },
        {
            text: 'Status',
            value: 'InActive',
            align: 'text-sm-center',
            width:100,
            sort: true,
            filter: true,
        },
    ]
});

export const actions = {
  async actGetPort({ commit, rootState }, url) {
    var arrPorts = [];
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
          for (var i = 0; i < response.data.Ports.length; i++) {
           
            arrPorts.push({
              PortId: response.data.Ports[i].PortId,
              PortCode: response.data.Ports[i].PortCode,
              PortName: response.data.Ports[i].PortName,
              PortType: response.data.Ports[i].PortType,
              CityName: response.data.Ports[i].CityName,
              CityCode: response.data.Ports[i].CityCode,
              Province: response.data.Ports[i].Province,
              CountryName: response.data.Ports[i].CountryName,
              InActive: response.data.Ports[i].InActive == true ? "Inactive " : "Active",
            });
          }
          commit("FETCH_DATA", arrPorts);
          commit("FETCH_DATA_INFO", response.data.ListInfo);
        }
      }
      catch (err) {
        console.log(err);
      }
    },
  
    async actUpdatePort({ commit, rootState }, model){
      try {
        var response = await new Axios({
          'Content-Type': 'application/json',
          'Authorization': rootState.token
        })
        .put('port', {
          PortId : model.PortId,
          PortCode : model.PortCode,
          PortName : model.PortName,
          PortType: model.PortType,
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
      catch (err){
        console.log(err)
      }
    },
    async actCreatePort({ commit, rootState }, model) {
      try {
        var response = await new Axios({
          'Content-Type': 'application/json',
          'Authorization': rootState.token
        })
        .post('port', {
          PortCode: model.PortCode,
          PortName: model.PortName,
          PortType: model.PortType,
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
    async actDeletePort({ commit, rootState }, row) {
      try {
        var response = await new Axios({
          'Content-Type': 'application/json',
          'Authorization': rootState.token
        })
        .delete('port', { data: { PortId: row.PortId } })
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
