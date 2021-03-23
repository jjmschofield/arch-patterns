export interface Message {
  id: string,
  msg: string,
  payload: object | null,
  correlation: string,
}

export interface MessageRecord extends Message{
  attempts: number,
  lastAttemptAt: Date | null,
  lockedAt: Date | null,
  createdAt: Date,
  updatedAt: Date,
}
