import Poller from 'ft-poller'
import httpError from 'http-errors'
import deepFreeze from 'deep-freeze'
import fetch from 'node-fetch'

const parseData = (data: object) => {
  // Makes the navigation data completely immutable,
  // To modify the data, clone the parts you need to change then modify in your app
  return deepFreeze(data)
}

const defaults = {
  menuUrl: 'http://next-navigation.ft.com/v2/menus',
  crumbtrailUrl: 'http://next-navigation.ft.com/v2/hierarchy',
  interval: 15 * 60 * 1000 // poll every 15 minutes
}

export class Navigation {
  public options
  public poller
  public initialPromise

  constructor(options = {}) {
    this.options = { ...defaults, ...options }

    this.poller = new Poller({
      url: this.options.menuUrl,
      refreshInterval: this.options.interval,
      parseData
    })

    this.initialPromise = this.poller.start({ initialRequest: true })
  }

  async getNavigation() {
    // initialPromise does not resolve any data
    // but it must resolve before `.data` is available to read.
    await this.initialPromise
    return this.poller.getData()
  }

  async getMenu(menuItem: string) {
    const data = await this.getNavigation()

    if (data.hasOwnProperty(menuItem)) {
      return data[menuItem]
    } else {
      throw Error(`Navigation menu "${menuItem}" does not exist. Available options: ${Object.keys(data)}.`)
    }
  }

  async getCrumbtrail(currentPage: string) {
    const crumbtrail = `${this.options.crumbtrailUrl}/${currentPage}`
    const response = await fetch(crumbtrail)

    if (response.ok) {
      const data = await response.json()
      return parseData(data)
    } else {
      throw httpError(response.status, `Navigation crumbtrail for ${currentPage} could not be found.`)
    }
  }
}