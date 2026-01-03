
const USE_LOCAL = false; 

const BASE_DOMAIN = USE_LOCAL
  ?"put your render URL": "http://localhost:5004"

 
// https://socially-d8k0.onrender.com
export const API_BASE_URL = `${BASE_DOMAIN}/api`;