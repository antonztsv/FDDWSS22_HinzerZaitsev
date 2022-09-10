import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")

export const players = []

export class Player {
  constructor(name) {
    this.id = nanoid(5)
    this.name = name
  }
}
