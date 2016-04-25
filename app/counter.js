'use strict';

import expect from 'expect';
import { createStore } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';

const counter = (state = 0, action) => {
  switch(action.type) {
    case 'INCREMENT':
      return state+1;
    case 'DECREMENT':
      return state-1;
  }
  return state;
}

/*
Implementation of createStore
const createStore = (reducer) => {
  let state;
  let listeners = [];

  const getState = () => {
    return state;
  }

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  }

  dispatch({});
  return { getState, dispatch, subscribe };
}*/
const Counter = ({
  value,
  onIncrement,
  onDecrement
}) => {
  return (
    <div>
      <h1>{value}</h1>
      <button onClick={onIncrement}>+</button>
      <button onClick={onDecrement}>-</button>
    </div>
  );
}

const render = () => {
  ReactDOM.render(<Counter
    value={store.getState()}
    onIncrement={ () => {
      store.dispatch({ type: 'INCREMENT'});
    }}
    onDecrement={ () => {
      store.dispatch({ type: 'DECREMENT'});
    }} />, document.getElementById("app"));
}

const store = createStore(counter);
store.subscribe(render);
render();

expect(
  counter(0, { type: 'INCREMENT' })
).toEqual(1)

expect(
  counter(1, { type: 'INCREMENT' })
).toEqual(2)

expect(
  counter(2, { type: 'DECREMENT' })
).toEqual(1)

expect(
  counter(1, { type: 'DECREMENT' })
).toEqual(0)

expect(
  counter(undefined, { type: 'SOMETHING_ELSE'})
).toEqual(0)

console.log("Test passed!");
