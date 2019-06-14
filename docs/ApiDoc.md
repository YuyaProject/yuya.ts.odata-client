# yuya.ts.odata-client Api Documentation

OData Client for Typescript with axios

## 1. Install

```console
npm i yuya.ts.odata-client
or
yarn add yuya.ts.odata-client
```

## 2. Quick Start

```typescript
const odataQuery = new ODataQueryBuilder('products');
odataQuery
  .q()
  .then(d=>console.log(d));
```

## 3. ODataQuery Operations

### 3.1. Get all rows

```typescript
const odataQuery = new ODataQuery('products');
odataQuery
  .q()
  .then(d=>console.log(d));
```

### 3.2. Get row by id

```typescript
const odataQuery = new ODataQuery('products');
odataQuery
  .getByKey(1)
  .then(d=>console.log(d));
```

### 3.3. Get row count

```typescript
const odataQuery = new ODataQuery('products');
odataQuery
  .count()
  .then(d=>console.log(d));
```

## 4. ODataQueryBuilder Operations

### 4.1. Get all rows

```typescript
const odataQuery = new ODataQueryBuilder('products');
odataQuery
  .q()
  .then(d=>console.log(d));
```

### 4.2. Add column for select

```typescript
const odataQuery = new ODataQueryBuilder('products');
odataQuery
  .addColumn('id')
  .q()
  .then(d=>console.log(d));
// Result has only id column
```

```typescript
const odataQuery = new ODataQueryBuilder('products');
odataQuery
  .addColumn('id')
  .addColumn('name')
  .q()
  .then(d=>console.log(d));
// Result has only id and name columns
```

### 4.3. Add columns for select

with array:

```typescript
const odataQuery = new ODataQueryBuilder('products');
odataQuery
  .addColumns('id', 'name')
  .q()
  .then(d=>console.log(d));
// Result has only id and name columns
```

with comma seperated string:

```typescript
const odataQuery = new ODataQueryBuilder('products');
odataQuery
  .addColumns('id,name')
  .q()
  .then(d=>console.log(d));
// Result has only id and name columns
```

### 4.4. Remove columns for select

```typescript
const odataQuery = new ODataQueryBuilder('products');
odataQuery
  .addColumns('id', 'name', 'price')
  .removeColumns('price')
  .q()
  .then(d=>console.log(d));
// Result has only id and name columns
```

```typescript
const odataQuery = new ODataQueryBuilder('products');
odataQuery
  .addColumns('id', 'name', 'price')
  .removeColumns('price', 'name')
  .q()
  .then(d=>console.log(d));
// Result has only id column
```

### 4.5. Clear columns for select

```typescript
const odataQuery = new ODataQueryBuilder('products');
odataQuery
  .addColumns('id', 'name', 'price')
  .clearColumns()
  .q()
  .then(d=>console.log(d));
// Result has all columns
```

