[![npm](https://img.shields.io/npm/v/@snapshot-labs/pineapple.svg)](https://www.npmjs.com/package/@snapshot-labs/pineapple) 

# Pineapple.js

Blazing fast IPFS JSON pinning with replication on multiple pinning services. 

### Install
Pineapple.js was designed to work both in the browser and in Node.js.

#### Node.js
To install Pineapple.js on Node.js, open your terminal and run:
```
npm install @snapshot-labs/pineapple
```

#### Browser
You can create an index.html file and include Pineapple.js with:
```html
<script src="https://cdn.jsdelivr.net/npm/@snapshot-labs/pineapple"></script>
```

### Usage
```js
import { pin } from '@snapshot-labs/pineapple';

// Pin JSON
const obj = { foo: 'bar' };
const receipt = await pin(obj);
console.log(receipt);
```

## License

[MIT](LICENSE).
