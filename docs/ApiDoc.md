# yuya.ts.odata-client Api Documentation

OData Client for Typescript with axios

## Install

```console
npm i yuya.ts.odata-client
or
yarn add yuya.ts.odata-client
```

## Quick Start

```typescript
const odataQuery = new ODataQueryBuilder('products');
odataQuery.q()
  .then(d=>console.log(d));
```
