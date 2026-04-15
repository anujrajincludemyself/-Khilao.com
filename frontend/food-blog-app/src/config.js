// Central API URL configuration for local/dev and production builds.
const BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : 'https://khilao-com-e5uj.onrender.com'
)
export default BASE_URL;
