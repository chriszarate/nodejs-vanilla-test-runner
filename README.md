# You might not need Jest!

**tl;dr**: You may still want Jest! But for small projects, the unit test runner that ships with Node.js v18 is very powerful.

Node.js v18 introduced a [built-in test runner](https://nodejs.org/docs/latest-v18.x/api/test.html#test-runner) and v18.13 introduced mocking capabilities. Let's take a quick look at what's currently possible with zero dependencies. First, let's introduce a simple class named Greeter:

```js
// greeter.js
export default class Greeter {
	getName() {
		return 'friendly neighbor';
	}

	sayHello () {
		return `Hello, ${ this.getName() }!`;
	}

	async sayGoodbye () {
		await new Promise( resolve => setTimeout( resolve, 1000 ) );

		return `Goodbye, ${ this.getName() }!`;
	}
}
```

Now we can write a test:

```js
// greeter.test.js
import assert from 'node:assert';
import { test } from 'node:test';
import Greeter from './greeter.js';

test( 'Greeter says hello', () => {
  const greeter = new Greeter();
  assert.strictEqual( greeter.sayHello(), 'Hello, friendly neighbor!' );
} );
```

... and run it with `node --test`:

```sh
> node --test .
TAP version 13
# Subtest: ~/Code/node-vanilla-testing/greeter.test.js
    # Subtest: Greeter says hello
    ok 1 - Greeter says hello
      ---
      duration_ms: 0.688292
      ...
    1..1
ok 1 - ~/Code/node-vanilla-testing/greeter.test.js
  ---
  duration_ms: 44.523208
  ...
1..1
# tests 1
# pass 1
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 46.485708
```

This output is TAP-compliant so it could be easily piped to another tool, like a formatter:

```sh
> node --test . | tnyan
 1   -_,------,
 0   -_|   /\_/\ 
 0   -^|__( ^ .^) 
     -  ""  "" 
  Pass!
```

Tests can be async:

```js
test( 'Greeter says goodbye', async () => {
  const greeter = new Greeter();
  assert.strictEqual( await greeter.sayGoodbye(), 'Goodbye, friendly neighbor!' );
} );
```

You can also use describe / it syntax, with familiar friends like `beforeEach` / `afterEach`:

```js
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import Greeter from './greeter.js';

describe( 'Greeter', () => {
  let greeter;

  beforeEach( () => {
    greeter = new Greeter();
  } );

  it( 'says hello', () => {
    assert.strictEqual( greeter.sayHello(), 'Hello, friendly neighbor!' );
  } );

  it( 'says goodbye', async () => {
    assert.strictEqual( await greeter.sayGoodbye(), 'Goodbye, friendly neighbor!' );
  } );
} );
```

The `assert` utility is currently [not as full-featured](https://nodejs.org/docs/latest-v18.x/api/assert.html) as Jest's `expect`, but is gaining functionality and includes the basics, including error / promise rejection handling and snapshot comparisons.

Mocks just landed and the functionality is limited (no import mocking) but I expect it to mature quickly:

```js
test( 'Greeter calls getName()', ( t ) => {
  const greeter = new Greeter();

  t.mock.method( Greeter.prototype, 'getName', () => 'Alice' );

  assert.strictEqual( greeter.sayHello(), 'Hello, Alice!' );
  assert.strictEqual( greeter.getName.mock.calls.length, 1 );
} );
```

Note that we are using `test` and accessing the `TestContext` argument `t` passed to the test function. The advantage of this approach is that mocks are restored automatically without having to call anything. Using describe / it syntax, I don't receive a `TestContext` and I need to use the top-level mock utility and restore manually:

```js
import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import Greeter from './greeter.js';

describe( 'Greeter', () => {
  it( 'calls getName()', () => {
    const greeter = new Greeter();

    mock.method( Greeter.prototype, 'getName', () => 'Alice' );

    assert.strictEqual( greeter.sayHello(), 'Hello, Alice!' );
    assert.strictEqual( greeter.getName.mock.calls.length, 1 );

    Greeter.prototype.getName.mock.restore();
  } );
} );
```

Code coverage reports require third-party code but are easy to produce:

```sh
> npx c8 --check-coverage node --test .
------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------|---------|----------|---------|---------|-------------------
All files   |     100 |      100 |     100 |     100 |                   
 greeter.js |     100 |      100 |     100 |     100 |                   
------------|---------|----------|---------|---------|-------------------
```

I hope I've shown you that the built-in Node.js test runner is powerful enough to consider for future projects, and this just scratches the surface of what's possible. I encourage you to check out the test runner and assert docs for a deeper dive.
