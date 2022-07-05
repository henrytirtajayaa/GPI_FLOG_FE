import axios from 'axios';
import config from '../static/config'

// add session token to all requests
const requestInterceptor = (config) => ({
  
});

class ApiAxios {
  constructor(header) {
    const options = {
      baseURL : config.API,
    };
    if(header != null){
      options.headers = header;
    }
    const instance = axios.create(options);
    
    // Add a request interceptor
    instance.interceptors.request.use(function (config) {

      var CompanyId = sessionStorage.getItem('CompanyId');

      if (CompanyId != null) {
        if (CompanyId != localStorage.getItem('NewCompanyId') && localStorage.getItem('NewCompanyId') != null)  {
          sessionStorage.removeItem('CompanyId');
          window.location.reload();
        }
      } else {
        CompanyId = localStorage.getItem('NewCompanyId')
      }


      // Do something before request is sent
      return config;
    }, function (error) {
      // Do something with request error
      return error.response;
    });
  
    // Add a response interceptor
    instance.interceptors.response.use(function (response) {
      
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    }, function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      
        if (error.response.status == "401") {
          localStorage.removeItem('CompanyId')
          sessionStorage.removeItem('NewCompanyId')
          //window.location.reload();
        } 
         

      return error.response;
    });

    return instance;
  }
}

export default ApiAxios;

