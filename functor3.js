import _ from 'ramda';
import { Maybe, Future, IO } from 'ramda-fantasy';
import assert from 'assert';

// TEST HELPERS
// =====================
function inspectIt(x) {
  return (x.inspect && x.inspect()) || (x.toString && x.toString()) || x.valueOf();
}

function assertEqual(x, y) {
  assert.equal(x, y);
}
function assertDeepEqual(x, y) {
  assert.deepEqual(x, y);
}

function log(x) { console.log(x); return x; }

function getPost(i) {
  return new Future((rej, res) => {
    setTimeout(() => {
      res({ id: i, title: 'Love them futures' });
    }, 300);
  });
}

function getComments(i) {
  return new Future((rej, res) => {
    setTimeout(() => {
      res(['This class should be illegal', 'Monads are like space burritos']);
    }, 300);
  });
}

// Exercise 1
// ==========
// Use getPost(id) to return a Future of the title of the post ({id: i, title: 'Love them futures'})
console.log('--------Start exercise 1--------');

const ex1 = _.compose(_.map(_.prop('title')), getPost);

ex1(3).fork(log, function (title) {
  assertEqual('Love them futures', title);
  console.log('exercise 1..ok!');
});

// Exercise 2
// ==========
// Use ex1 to extend the computation and render the title in a div
console.log('--------Start exercise 2--------');

const render = (x) => `<div>${x}</div>`;

const ex2 = _.compose(_.map(render), ex1);

ex2(3).fork(log, function (html) {
  assertEqual('<div>Love them futures</div>', html);
  console.log('exercise 2...ok!');
});

// Exercise 3
// ==========
// In JSBin, click the "Output" tab to see a div. Click this div to run the test.
// Turn the clicks into a stream of the div's innerHTML
console.log('--------Start exercise 3--------');

const clicks = Bacon.fromEventTarget(document.querySelector('#box'), 'click');

// TODO: turn clicks into a stream of the e.target.innerHTML
const htmlClicks = _.compose(_.map(_.prop('innerHTML')), _.map(_.prop('target')), clicks);

htmlClicks.onValue(function (html) {
  assertEqual('<span>CLICK ME</span>', trim(html));
  console.log('exercise 3...ok!');
});

// Exercise 4
// ==========
// Keep the Output tab open. Type into the input to run the test.
// Transform the keydowns into a stream of the input's value
// Then use pureLog() to log it to the console
console.log('--------Start exercise 4--------');

const pureLog = (x) => new IO((x) => { console.log(x); return x; });
const search_input = document.querySelector('#search');
const keydowns = Bacon.fromEventTarget(search_input, 'keydown');

// Todo: turn keydowns into a stream of the logged input's value
const logs = _.compose(
  _.map(pureLog),
  _.map(_.prop('value')),
  _.map(_.prop('target')),
  keydowns
);

logs.onValue(function (io) {
  assertEqual(search_input.value, io.runIO());
  console.log('exercise 4...ok!');
});

// Exercise 5*
// ==========
// Use only safeGet() to safely return the street name

console.log('--------Start exercise 5--------');

const safeGet = _.curry((x, o) => new Maybe(o[x]));
const user = {
  id: 2,
  name: 'Albert',
  address: {
    street: {
      number: 22,
      name: 'Walnut St',
    },
  },
};

const ex5 = _.compose(
  _.chain(safeGet('name')),
  _.chain(safeGet('street')),
  safeGet('address')
);

assertDeepEqual(new Maybe('Walnut St'), ex5(user));
console.log('exercise 5...ok!');
