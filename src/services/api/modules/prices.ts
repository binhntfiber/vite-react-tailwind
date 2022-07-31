import { makeAPI } from 'services/api'

const api = makeAPI('https://api.coingecko.com/api/v3')

type usdResponse = Record<string, { usd: string | number }>

export const fetchUsdPrices = async (ids: string[]) => {
  try {
    const stringifiedIds = ids.join(',')
    const { data } = await api.get<unknown, usdResponse>(
      `/simple/price?ids=${stringifiedIds}&vs_currencies=usd`
    )

    return ids.map((el) => {
      return { id: el, usdPrice: data[el].usd }
    })
  } catch (error) {
    console.error(error)
    return null
  }
}
