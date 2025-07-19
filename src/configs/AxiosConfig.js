import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'http://14.225.218.217:5000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default httpClient;