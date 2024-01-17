let message = '/msg npmkqgfcm hola perro hp'

const [, targetUserId, ...msgContentArray] = message.split(' ');
console.log("target: "+targetUserId);
console.log("array");
console.log(msgContentArray);

const msgContent = msgContentArray.join(' ');
console.log("mgs: "+msgContent);

const targetClient = Array.from(clients).find((client) => client.userId === targetUserId);