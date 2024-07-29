import Axios from 'axios'
import config from '../../config';

const baseURL = config.baseUrl

const axios = Axios.create({
  baseURL,
  timeout: 20000 // timeout 20s
})

// response interceptors
axios.interceptors.response.use(
  (response: any) => {
    return response
  },
  (errors: any) => {
    if (errors.response && errors.response.data) {
      const msg = errors.response.data.message
      console.error(msg)
    } else {
      console.error(errors)
    }
    return Promise.reject(errors)
  }
)

export { axios }