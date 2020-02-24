let baseUrl, baseUrlApi;

// Change this value if you wish to connect to a remote QA/Prod server.
let local = true;

if (local) {
  // Local settings - do not change these.
  baseUrl = 'http://localhost:3000';
  baseUrlApi = 'http://localhost:3001';
} else {
  // Remote settings - change to desired QA/Prod server values.
  // Make sure 'local' is set to false above.
//   baseUrl = 'https://avodah-vlis-web-api.appserve.io';
//   baseUrlApi = 'https://avodah-vlis-ml-service.appserve.io';

//Optisol cloud url
//  baseUrl ='https://vlis.optisolbusiness.com/backend';
//  baseUrlApi = 'https://vlis.optisolbusiness.com/python';
}

const headers = {
  headers:{
    // Authorization: localStorage.getItem('Vlis-token'),
  }
};

export { baseUrl, baseUrlApi, headers };
