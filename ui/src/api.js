export default class API {
  constructor(baseUrl) {
    this.base = baseUrl
  }

  async get(url) {
    return fetch(this.base + url).then(res => res.json())
  }

  async getAnswer(prompt) {
    return this.get(`/answer?prompt=${prompt}`)
  }

}