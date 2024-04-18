export default class API {
  constructor(baseUrl) {
    this.base = baseUrl
  }

  async get(url) {
    return await fetch(`${this.base}${url}`).then(res => res.json())
  }

  async getAnswer(prompt) {
    const response = await this.get(`/answer?prompt=${prompt}`)
    return response['answer']
  }

  async getAnswerYN(prompt) {
    const response = await this.get(`/answerYN?prompt=${prompt}`)
    return response['answer']
  }
}