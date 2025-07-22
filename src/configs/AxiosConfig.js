import axios from 'axios';

// docker https://localhost:5001/api
// http server http://14.225.218.217:5000
// https server https://sugarnest-api.io.vn/

export const serverApi = axios.create({
  baseURL: 'https://sugarnest-api.io.vn'
})

export const dockerApi = axios.create({
  baseURL: 'https://localhost:5001/api'
})
