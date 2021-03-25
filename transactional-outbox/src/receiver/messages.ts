const messages: Map<number, Object> = new Map<number, Object>();

export const saveMessage = (call: object) => {
  messages.set(messages.size, call);
}

export const getAllMessages = () => {
  return Array.from(messages.keys()).map((key)=>{
    return {[key]: messages.get(key)};
  });
}
