import assert from 'node:assert';
import { beforeEach, describe, it, mock, test } from 'node:test';
import Greeter from './greeter.js';

test( 'Greeter says hello', () => {
  const greeter = new Greeter();
  assert.strictEqual( greeter.sayHello(), 'Hello, friendly neighbor!' );
} );

test( 'Greeter says goodbye', async () => {
  const greeter = new Greeter();
  assert.strictEqual( await greeter.sayGoodbye(), 'Goodbye, friendly neighbor!' );
} );

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

test( 'Greeter calls getName()', ( t ) => {
  const greeter = new Greeter();

  t.mock.method( Greeter.prototype, 'getName', () => 'Alice' );

  assert.strictEqual( greeter.sayHello(), 'Hello, Alice!' );
  assert.strictEqual( greeter.getName.mock.calls.length, 1 );
} );

test( 'TestContext automatically restores mock', () => {
  const greeter = new Greeter();
  assert.strictEqual( greeter.sayHello(), 'Hello, friendly neighbor!' );
} );

describe( 'Greeter', () => {
  it( 'calls getName()', () => {
    const greeter = new Greeter();

    mock.method( Greeter.prototype, 'getName', () => 'Alice' );

    assert.strictEqual( greeter.sayHello(), 'Hello, Alice!' );
    assert.strictEqual( greeter.getName.mock.calls.length, 1 );

    Greeter.prototype.getName.mock.restore();
  } );

  it( 'restores mock', () => {
    const greeter = new Greeter();
    assert.strictEqual( greeter.sayHello(), 'Hello, friendly neighbor!' );
  } );
} );
