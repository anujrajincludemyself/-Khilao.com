// Auto-detect environment
const BASE_URL = import.meta.env.MODE === 'development' 
  ? "http://localhost:5000" 
  : "https://khilao-com.onrender.com";
export default BASE_URL;
