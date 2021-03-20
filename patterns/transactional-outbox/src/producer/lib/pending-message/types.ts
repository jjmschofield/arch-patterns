export interface Message {
  id: string,
  msg: string,
  correlation: string,
  _id?: string,
  attempts?: number,
}
