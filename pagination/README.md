# Pagination

Unbounded, large collections of data being requested from a server by a client pose the following challenges:

* Query and storage retrieval - how long and how many resources it takes to retrieve data from a store by a server
* Serialization and Deserialization - how long and how many resources it takes to marshal or unmarshal data for / from transmission by the server and client
* Transmission - how long and how many resources it takes to transmit data over the wire
* Reliability - long running operations are more likely to fail, with no point to restart from exceptionally large collections may never be retrievable
* Predictability - without bounds request duration and resource requirements can vary dramatically  

Pagination solves these problems by breaking up collections into manageable chunks which can be navigated through by a client.

There are multiple approaches to pagination with varying trade offs.

## Running
```shell script
$ npm --prefix ../common install
$ npm i
$ npm run start
```

This launches the docker containers as described in the [docker-compose.yml](docker-compose.yml)

* webserver (http://localhost:3000)
* db 

## Configuring

The database will seed 20,000 records by default. You can modify `SEED_COUNT` in [docker-compose.yml](docker-compose.yml) to observe how each of the following patterns behaves against different amounts of data. 

## No Pagination

### TLDR;

No pagination is provided, returned collection size is unbounded.

### Calling

**GET: http://localhost:3000/no-pagination**

Returns all of the entities in the database without pagination.

```json
{
    "data": {
        "products": [
            {
                "id": "acf3cd60-0881-47d3-b3d9-525286c4d26f",
                "name": "Handmade Granite Fish",
                "color": "gold",
                "material": "Cotton",
                "price": 133,
                "createdAt": "2021-04-19T10:29:25.198Z",
                "updatedAt": "2021-04-19T10:29:25.198Z"
            },
            ...
        ]
    }
}
```

### Useful When

The size of a collection is limited to a reasonable number by some other constraint and increasing the complexity of the API has no benefit. This is rare.

### Considerations

Requests could take potential infinite resources to complete for both the server, client and underlying transport medium.

In many systems it might take time for such problems to become apparent (as data sets scale through general usage).

### Implementation
  

## Offset


## Cursor


// https://slack.engineering/evolving-api-pagination-at-slack/
// https://medium.com/swlh/how-to-implement-cursor-pagination-like-a-pro-513140b65f32
// https://uxdesign.cc/why-facebook-says-cursor-pagination-is-the-greatest-d6b98d86b6c0


