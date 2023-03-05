import axios from "axios";


const API_URL = "http://127.0.0.1:4000/api/";


export const getData = () => {
  return axios.get(`${API_URL}read`).then((response) => {
    return response.data;
  });
};


export function postData(uid, kids) {
  return axios.post(API_URL + "write", { uid, kids });
}




export const deleteData = (id) => {
  return axios.delete(API_URL + "delete/" + id);
};
