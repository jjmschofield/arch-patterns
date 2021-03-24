# Transactional Outbox

Chris Richardson - [Microservices.io](https://microservices.io/patterns/data/transactional-outbox.html)

## About

### TLDR;
When a record is inserted a message is written to an outbox table at the same time - and importantly in a transaction!  

A relay process sends messages in the outbox table and deletes them when the message is sent successfully.

This means that a record cannot not be added without a corresponding message already being queued up to be sent - ensuring that service crashes or temporary issues whilst talking with the DB don't risk us loosing important messages.  

![Transactional Outbox](./docs/TransactionalOutbox.png)

### Useful When
You need to update records in you database and reliably notify other services.

Example: An order has been placed. It needs to be recorded and we need a guarantee that fulfillment systems will be notified eventually.


### Considerations
Delivery guarantee is "at least once", As such, consumers of messages should handle the same message being delivered multiple times.
 
This is because the record might not get removed from the outbox after the message is sent (the sending of a message and removal of the message from the db is not atomic). This will results in a duplicate delivery. 

When scaling relays horizontally, a locking system needs to be used to prevent sending the same message many times. 


## This Implementation
![Transactional Outbox Implementation](./docs/Implementation.jpg)

### Running it
```shell script
$ npm i
$ npm run start
```

This launches the docker containers as described in the [docker-compose.yml](docker-compose.yml)
* Producer (http://localhost:3000)
* Receiver (http://localhost:3001)
* Producer Relay
* Producer DB 


### Configuring it
All config is done through the environment variables exposed in the [docker-compose.yml](docker-compose.yml) 

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

### Understanding it
Most of the code in this repo is quite boring and serves to make an observable play pen. 

Let's take a look at the actually interesting bits.

#### The transaction 
Triggered as a result of an API call, [createSuperHero](src/producer/lib/superhero/create.ts) is the place to dig in.

#### The relay 

The entry point to polling process is [startSendingMessages](src/producer/lib/messages/send.ts).

There are a few noteworthy things here...

***Scaling***

The implementation is setup to support horizontal scaling - eg running many relay instances. In fact you can control this with the `scale` value inside the [docker-compose.yml](docker-compose.yml). 

This is quite important in a high volume system, if we don't process messages in time the outbox will grow and grow. 

With multiple relays running, it is highly likely that (at least) two relays will try to send the same message - resulting in many duplicate message deliveries. 

To prevent this the implementation uses `getNextMessageExclusively` [to temporarily lock messages](src/producer/lib/messages/get.ts) when the relay picks them up to try and send them.

***Reliability***

As ever, predicting and handling non-happy scenarios is where the details lie. Check out [handleFailures](src/producer/lib/messages/send.ts).

In this implementation a retry mechanism is built in to the process, specifically with a delay before retrying. 

Delays (and exponential back offs, not implemented) can be very useful to prevent bombarding failed or failing services.

***Undeliverable***

In this implementation a message is given a certain number of attempts before it is assumed undeliverable and deleted from the queue silently. 

This is brutally simple and prevents the process from getting or gummed up by bad messages - however think about the needs of your solution. 

What should happen to messages that can't be delivered? Is it ok for them to vanish? The answer is normally *no*.


### Exploring it
#### Connecting to the DB
Being able to look inside the producers database would be good - PGadmin4, Postico and Datagrip are all noteworthy tools.



## Notes
This implementation does not ensure message order - favouring through put and simplified horizontal scaling. 
