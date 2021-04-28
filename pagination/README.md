# Pagination

Unbounded, large collections of data being requested from a server by a client pose the following challenges:

* Query and storage retrieval - how long and how many resources it takes to retrieve data from a store by a server
* Serialization and Deserialization - how long and how many resources it takes to marshal or unmarshal data for / from transmission by the server and client
* Transmission - how long and how many resources it takes to transmit data over the wire
* Reliability - long running operations are more likely to fail, with no point to restart from exceptionally large collections may never be retrievable
* Predictability - without bounds request duration and resource requirements can vary dramatically  

Pagination solves these problems by breaking up collections into manageable chunks which can be navigated through by a client.

There are multiple approaches to pagination with varying trade offs.

## TODO
1) Add implementations for filtering

2) Update this doc with description of the pagination types

3) Add page based pagination example

4) Update this readme with thinking on how to make a choice on pagination type, referencing:

- https://slack.engineering/evolving-api-pagination-at-slack/
- https://medium.com/swlh/how-to-implement-cursor-pagination-like-a-pro-513140b65f32
- https://uxdesign.cc/why-facebook-says-cursor-pagination-is-the-greatest-d6b98d86b6c0
- https://www.django-rest-framework.org/api-guide/pagination/#:~:text=Cursor%20based%20pagination%20requires%20that,more%20complex%20than%20other%20schemes.

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


## Cursor
### TLDR;
Provides an encoded cursor to page through results - handling problems of `offset` and `page` strategies for large records sets at scale.

### Calling

**GET: http://localhost:3000/cursor-pagination/?limit=1&sort=material&cursor=eyJjcmVhdGVkQXQiOiIyMDIwLTA1LTAzVDE5OjAwOjE2LjU3MVoiLCJpZCI6ImJiNTA1ZDA1LWFkMjktNGYxZi04MTlhLWE1YTZkYjQ4YTU1MiIsIm1hdGVyaWFsIjoiQ29uY3JldGUifQ==**


```json

    "data": {
        "products": [
            {
                "id": "bb505d05-ad29-4f1f-819a-a5a6db48a552",
                "name": "Awesome Fresh Pizza",
                "color": "indigo",
                "material": "Concrete",
                "price": 323,
                "createdAt": "2020-05-03T19:00:16.571Z",
                "updatedAt": "2021-04-29T18:54:42.063Z"
            }
        ]
    },
    "meta": {
        "total": 20000
    },
    "links": {
        "self": null,
        "first": "http://localhost:3000/cursor-pagination/?limit=1&sort=material",
        "last": "http://localhost:3000/cursor-pagination/?limit=1&sort=material&cursor=eyJjcmVhdGVkQXQiOiIyMDIxLTA0LTI3VDA0OjExOjM2LjM0MFoiLCJpZCI6ImEwYmI2ZjU0LTc5ZjMtNGZmMC1iNGZlLWMzYTBmYjEzNTI2ZSIsIm1hdGVyaWFsIjoiV29vZGVuIn0=",
        "prev": null,
        "next": "http://localhost:3000/cursor-pagination/?limit=1&sort=material&cursor=eyJjcmVhdGVkQXQiOiIyMDIwLTA1LTAzVDE5OjAwOjE2LjU3MVoiLCJpZCI6ImJiNTA1ZDA1LWFkMjktNGYxZi04MTlhLWE1YTZkYjQ4YTU1MiIsIm1hdGVyaWFsIjoiQ29uY3JldGUifQ=="
    }
}
```

Decoded next cursor:

```json
{"createdAt":"2020-05-03T19:00:16.571Z","id":"bb505d05-ad29-4f1f-819a-a5a6db48a552","material":"Concrete"}
```

### Considerations

### Implementation
This implementation provides a stable sort solution (defaulting to `createdAt` and `id` fields) and granting support for ordering by non-unique fields.

The cursor contains information to provide to an ORM quuery without translation - potential resulting in coupling of column names to cursors.

[Library implementation](src/lib/pagination/cursor)

[Model usage](src/lib/product/list-cursor.ts)

[Route usage](src/routes/list-cursor.ts)
  

## Offset
**GET: http://localhost:3000/offset-pagination?offset=10&limit=1**

```json
{
       "data": {
           "products": [
               {
                   "id": "24857400-ad7b-4268-a780-dedfe3b2feac",
                   "name": "Refined Plastic Tuna",
                   "color": "cyan",
                   "material": "Concrete",
                   "price": 863,
                   "createdAt": "2021-04-19T19:46:45.857Z",
                   "updatedAt": "2021-04-19T19:46:45.857Z"
               }
           ]
       },
       "meta": {
           "total": 20000
       },
       "links": {
           "self": "http://localhost:3000/offset-pagination?offset=10&limit=1",
           "first": "http://localhost:3000/offset-pagination?offset=0&limit=1",
           "last": "http://localhost:3000/offset-pagination?offset=19999&limit=1",
           "prev": "http://localhost:3000/offset-pagination?offset=9&limit=1",
           "next": "http://localhost:3000/offset-pagination?offset=11&limit=1"
       }
   }
```




