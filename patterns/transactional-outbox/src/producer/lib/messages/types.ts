export interface Message {
  id: string,
  msg: string,
  correlation: string,
}

export interface MessageRecord extends Message{
  _id: string,
  attempts: number,
  lastAttemptAt: Date | null,
  lockedAt: Date | null,
  createdAt: Date,
  updatedAt: Date,
}
