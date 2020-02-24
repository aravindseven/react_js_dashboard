import { baseUrl,baseUrlApi, headers } from '../config';
import Axios from 'axios';
import { Alert } from 'react-bootstrap';

export const getAllFrames = () => {
  return Axios.get("http://localhost:3001/getframes")
    .then(res => {
        let response = res['data']
        if (response.status === 200) {
          return response.data
        } else {
          alert("Server not reached")
        }
    })
    .catch(err => {
      
    });

   
};

export const getAllPoints = () => {
  return Axios.get(baseUrlApi +"/getpoints")
    .then(res => {
        let response = res['data']
        if (response.status === 200) {
          return response
        } else {
          alert("Server not reached")
        }
    })
    .catch(err => {
      
    });

   
};

export const getCameraVideos = (payload) => {
  return Axios.post(baseUrlApi +"/getvideosbycamera",payload)
    .then(res => {
        let response = res['data']
        if (response.status === 200) {
          return response
        } else {
          alert("Server not reached")
        }
    })
    .catch(err => {
      
    });
}
