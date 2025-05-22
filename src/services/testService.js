// frontend/src/services/testService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/print'; // 后端API地址
const API_URL2 = 'http://localhost:8080/123'; // 后端API地址


export default {
  test() {
    return axios.get(`${API_URL}`);
  },
  
  pp123(name) { // 接收 name 参数
      return axios.get(`${API_URL2}`, {
        params: { name } // 将 name 作为查询参数传递
      });
    }
  
  
  
  
};