# READ ME

![snap01](assets/snap001.png)

a sample project for [@koakh/typescript-rest-actions-api](https://www.npmjs.com/package/@koakh/typescript-rest-actions-api) module

## Start Project

```shell
# install dependencies
$ npm i
# copy sample to .env
$ cp sample.env .env
# run app
$ npm run start
# or
$ npm run debug
```

> NOTE: replace `YOUR-SECRET-KEY-HERE` in bellow files to meaningful apiKey

- `sample.env`
- `.env`
- `client.http`

## Static Pages

- [docs](https://localhost:9050/doc?apiKey=YOUR-SECRET-KEY-HERE)
- [audit](https://localhost:9050/audit?apiKey=YOUR-SECRET-KEY-HERE)

## Request

use vscode rest client and invoke some requests from `client.http`

ex

```shell
$ curl --request POST \
  --url https://localhost:9050/api/action \
  --header 'authorization: Bearer YOUR-SECRET-KEY-HERE' \
  --header 'content-type: application/json' \
  --data '{"action": "ACTION_ACTION_LIST"}'

$ curl --request GET \
  --url https://localhost:9050/api/audit \
  --header 'authorization: Bearer YOUR-SECRET-KEY-HERE' \
  --header 'content-type: application/json'
```
