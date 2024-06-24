import axios from 'axios';


const instance = axios.create({
    baseURL: 'http://192.168.1.157:9000',
    withCredentials: true,
});

export default instance;