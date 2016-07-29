import _ from 'ramda';
import { Identity, Maybe } from 'ramda-fantasy';
import assert from 'assert';

console.log("--------Start exercise 1--------");
const ex1 = _.map(_.inc);

assert.deepEqual(new Identity(3), ex1(new Identity(2)));
console.log("exercise 1...ok!");

console.log("--------Start exercise 2--------");
const xs = new Identity(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);

const ex2 = _.map(_.head);

assert.deepEqual(new Identity('do'), ex2(xs));
console.log("exercise 2...ok!");

console.log("--------Start exercise 3--------");
const safeGet = _.curry((x,o) => new Maybe(o[x]));
const user = { id: 2, name: 'Albert' };
const userWithoutName = { id: 3 };

const ex3 = _.compose(_.map(_.head), safeGet('name'));

assert.deepEqual(new Maybe('A'), ex3(user));
assert.deepEqual(new Maybe(null), ex3(userWithoutName));
console.log("exercise 3...ok!");

console.log("--------Start exercise 4--------")

const ex4 = _.compose(_.map(parseInt), Maybe);

assert.deepEqual(new Maybe(4), ex4('4'));
console.log("exercise 4...ok!");
