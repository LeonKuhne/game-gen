export default class Task {
  constructor(name, code, worthRemembering) {
    this.name = name
    this.do = new Function("state", code)
    this.worthRemembering = worthRemembering 
  }
}