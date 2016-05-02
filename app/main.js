'use strict';

import expect from 'expect';
import deepFreeze from 'deep-freeze';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';

const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      }
    case 'TOGGLE_TODO':
      if (state.id === action.id) {
        return {
          ...state,
          completed: !state.completed
        }
      }
      return state;
    default:
      return state;
  }
}

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
}

const visibilityFilter = (
    state = 'SHOW_ALL',
    action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}

/*const todoApp = (state = {}, action) => {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action)
  }
}*/

const todoApp = combineReducers({
  todos,
  visibilityFilter
});


const testAddTodo = () => {
  const stateBefore = [];
  const action = {
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
  }
  const stateAfter = [{
    id: 0,
    text: 'Learn Redux',
    completed: false
  }];
  deepFreeze(stateBefore);
  deepFreeze(action);
  expect(todos(stateBefore, action)).toEqual(stateAfter);
};

const testToggleTodo = () => {
  const stateBefore = [{
    id: 0,
    text: 'Learn Redux',
    completed: false
  }, {
    id: 1,
    text: 'Learn Redux',
    completed: false
  }];

  const action = {
    type: 'TOGGLE_TODO',
    id: 1,
  };

  const stateAfter = [{
    id: 0,
    text: 'Learn Redux',
    completed: false
  }, {
    id: 1,
    text: 'Learn Redux',
    completed: true
  }];

  deepFreeze(stateBefore);
  deepFreeze(action);
  expect(todos(stateBefore, action)).toEqual(stateAfter);
}


testAddTodo();
testToggleTodo();
console.log('Tests Passed!');

const store = createStore(todoApp);

const FilterLink = ({
  filter,
  currentFilter,
  children,
  onClick
}) => {
  if (filter === currentFilter) {
    return (<span>{children}</span>);
  }
  return (<a href="#" onClick={e => {
    e.preventDefault();
    onClick(filter);
  }}>{children}</a>);
}

const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed);
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
    default:
      return todos;
  }
}
const Todo = ({
  completed,
  text,
  onClick
}) => {
  return (
    <li onClick={ onClick }
        style={{
          textDecoration: completed ?
            'line-through' :
            'none'
        }}>
      {text}
    </li>
  );
}

const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map( t =>
      <Todo
        key={t.id}
        {...t}
        onClick={() => onTodoClick(t.id)}
      />
    )}
  </ul>
);

const AddTodo = ({
  onAddClick
}) => {
  let input;
  return (
    <div>
      <input type="text" ref={node => {
        input = node;
      }} />
      <button onClick={() => {
        onAddClick(input.value)
        input.value = '';
      }}>Add Todo</button>
    </div>
  );
};

const Footer = ({
    visibilityFilter,
    onClickFilter
}) => (
    <p>
      Show: {' '}
      <FilterLink
        filter="SHOW_ALL"
        currentFilter={visibilityFilter}
        onClick={onClickFilter}>All</FilterLink> {' '}
      <FilterLink
        filter="SHOW_COMPLETED"
        currentFilter={visibilityFilter}
        onClick={onClickFilter}>Completed</FilterLink> {' '}
      <FilterLink
        filter="SHOW_ACTIVE"
        currentFilter={visibilityFilter}
        onClick={onClickFilter}>Active</FilterLink>
    </p>
);

let nextId = 0;
const TodoApp = ({todos, visibilityFilter}) => {
  return (
    <div>
      <AddTodo
        onAddClick={ text =>
          store.dispatch({
            type: 'ADD_TODO',
            id: nextId++,
            text: text
          })
        }
      />
      <TodoList
        todos={getVisibleTodos(todos, visibilityFilter)}
        onTodoClick={id =>
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          })
        } />
      <Footer
        visibilityFilter={visibilityFilter}
        onClickFilter={filter =>
            store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: filter
          })
        }
      />
    </div>
  );
}

const render = () => {
  ReactDOM.render(
    <TodoApp {...store.getState()}/>,
    document.getElementById('app'));
}

store.subscribe(render);
render();
