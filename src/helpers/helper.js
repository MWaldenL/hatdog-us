export default class Helper {

  // returns integer in the range min to (max-1) inclusive
  static getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  static getRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let res = ''
    for (let i=0; i < 4; i++) { 
      res += chars.charAt(this.getRandomInt(0, chars.length))
    }
    return res
  }

  static getRandomName() {
    const names = [
      'Ayaka',
      'Eula',
      'Sam Paul',
      'Johnny',
      'Kiana Kaslana',
      'Raiden Mei',
      'Yae Sakura'
    ]
    return names[this.getRandomInt(0, names.length)]
  }
}