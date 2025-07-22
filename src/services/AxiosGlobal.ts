import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL_API
})

export default instance
