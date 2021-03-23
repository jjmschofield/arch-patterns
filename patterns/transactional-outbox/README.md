# Transactional Outbox

Chris Richardson - [Microservices.io](https://microservices.io/patterns/data/transactional-outbox.html)

## About

### TLDR;
When a record is inserted a message is written to an outbox table in the same local transaction. 

A relay process sends messages in the outbox table and deletes them when the message is sent successfully.

![Transactional Outbox](./docs/TransactionalOutbox.png)

### Useful When
You need to update records in you database and reliably notify other services.

Example: An order has been placed. It needs to be recorded and fulfillment systems need to respond.


### Considerations
Delivery guarantee is "At least once" - the record might not get removed from the outbox after the message is sent, resulting in a duplicate delivery. As such, consumers of messages should handle the same message being delivered multiple times.

When scaling relays horizontally, a locking system needs to be used to prevent sending the same message many times. 


## This Implementation
![Transactional Outbox Implementation](./docs/Implementation.jpg)

### Running It
```shell script
$ npm i
$ npm run start
```

This launches the docker containers as described in the [docker-compose.yml](docker-compose.yml)
* Producer (http://localhost:3000)
* Receiver (http://localhost:3001)
* Producer Relay
* Producer DB 


### Calling it

**POST: http://localhost:3000/hero/create**

```json
{ "name": "Batman" }
```
Creates a hero called batman using the outbox (observe console output).

**GET: http://localhost:3001/messages**

Gets all messages sent to the receiver returned in the order they were received.

**POST: http://localhost:3000/hero/create-sync**

```json
{ "name": "Batman" }
```
Creates a hero called batman and directly calls the receiver without the outbox.




## Notes
This implementation does not ensure message order - favouring through put and simplified horizontal scaling. 
