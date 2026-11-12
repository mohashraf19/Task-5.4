import axios from 'axios'
let csrfToken = null

// `withCredentials: true` makes the browser send the httpOnly auth cookie on
// every request to the API — including requests triggered by a different site.
// That convenience is exactly what leaves this app open to CSRF: there is no
// second proof that a state-changing request actually came from our own UI.
export const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true
})
export async function fetchCsrfToken() {
  const res = await api.get('/csrf-token')
  csrfToken = res.data.csrfToken
}

api.interceptors.request.use(async config => {
  if (config.method !== 'get') {
    if (!csrfToken) {
      await fetchCsrfToken()
    }
    config.headers['X-CSRF-Token'] = csrfToken
  }
  return config
}, error => {
  return Promise.reject(error)
})
