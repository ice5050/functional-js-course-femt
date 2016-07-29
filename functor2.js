import _ from 'ramda';
import { Either, Maybe, IO } from 'ramda-fantasy';
import assert from 'assert';

const { Left, Right } = Either;
const log = (message) => { console.log(message); return message; };

// Exercise 1
// ==========
// Write a function that uses checkActive() and showWelcome() to grant access or return the error
console.log('--------Start exercise 1--------');

const showWelcome = _.compose(_.concat('Welcome '), _.prop('name'));
const checkActive = _.ifElse(_.prop('active'), Right, () => new Left('Your account is not active'));

const ex1 = _.compose(_.map(showWelcome), checkActive);

assert.deepEqual(new Left('Your account is not active'), ex1({ active: false, name: 'Gary' }));
assert.deepEqual(new Right('Welcome Theresa'), ex1({ active: true, name: 'Theresa' }));
console.log('exercise 1...ok!');

// Exercise 2
// ==========
// Write a validation function that checks for a length > 3.
// It should return Right(x) if it is greater than 3 and Left("You need > 3") otherwise
console.log('--------Start exercise 2--------');

const ex2 = _.ifElse(_.compose(_.lt(3), _.length), Right, () => new Left('You need > 3'));

assert.deepEqual(new Right('fpguy99'), ex2('fpguy99'));
assert.deepEqual(new Left('You need > 3'), ex2('...'));
console.log('exercise 2...ok!');

// Exercise 3
// ==========
// Use ex2 above and Either as a functor to save the user if they are valid
console.log('--------Start exercise 3--------');

const save = _.compose(log);

const ex3 = _.compose(_.map(save), ex2);

assert.deepEqual(new Right('fpguy99'), ex3('fpguy99'));
assert.deepEqual(new Left('You need > 3'), ex3('duh'));
console.log('exercise 3...ok!');

// Exercise 4
// ==========
// Get the text from the input and strip the spaces
console.log('--------Start exercise 4--------');

const getValue = () => new IO(() => 'honkey tonk');
const stripSpaces = (s) => s.replace(/\s+/g, '');

const ex4 = _.compose(_.map(stripSpaces), getValue);

assert.equal('honkeytonk', (ex4('#text').runIO()));
console.log('exercise 4...ok!');

// Exercise 5
// ==========
// Use getHref() / getProtocal() and runIO() to get the protocal of the page.
console.log("--------Start exercise 5--------")

const getHref = () => new IO(() => 'http://localhost:3000');
const getProtocal = _.compose(_.head, _.split('/'));

const ex5 = _.compose(_.map(getProtocal), getHref);

assert.equal('http:', ex5().runIO());
console.log("exercise 5...ok!");

// Exercise 6*
// ==========
// Write a function that returns the Maybe(email) of the User from getCache().
// Don't forget to JSON.parse once it's pulled from the cache so you can _.get() the email

const localStorage = { user: JSON.stringify({ email: 'george@foreman.net' }) };
const getCache = (x) => new IO(() => new Maybe(localStorage[x]));
const getEmail = _.prop('email');

const ex6 = _.compose(_.map(_.map(_.compose(getEmail, JSON.parse))), getCache);

assert.deepEqual(new Maybe('george@foreman.net'), (ex6('user').runIO()));
assert.deepEqual(new Maybe(null), (ex6('notexist').runIO()));
console.log("exercise 6...ok!");
