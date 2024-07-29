import { axios } from '../react/utils/axios'

export function getOperatorList(params: any) {
  return axios({
    url: '/validators/eth-ssv-operator',
    method: 'get',
    params
  })
}

export function getAddressNonce(params: any) {
  return axios({
    url: '/networks/eth/ssv-nonce',
    method: 'get',
    params
  })
}