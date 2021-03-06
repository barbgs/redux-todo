'use strict';

import expect from 'expect';
import deepFreeze from 'deep-freeze';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';

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

const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  }
};

const Link = ({
  active,
  children,
  onClick
}) => {
  if (active) {
    return (<span>{children}</span>);
  }
  return (<a href="#" onClick={e => {
    e.preventDefault();
    onClick();
  }}>{children}</a>);
}
const mapStateToLink = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
};

const mapDispatchToLink = (dispatch, ownProps) => {
  return {
    onClick: () =>{
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  };
};

const FilterLink = connect( mapStateToLink, mapDispatchToLink)(Link);

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

const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  };
};

const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id
  }
}

const mapDispatchToToTodoListProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id));
    }
  };
};

const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToToTodoListProps
)(TodoList);

const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    id: nextId++,
    text
  }
};

let AddTodo = ({ dispatch }) => {
  let input;
  return (
    <div>
      <input type="text" ref={node => {
        input = node;
      }} />
    <button onClick={ () => {
        dispatch(addTodo(input.value));
        input.value = '';
      }}>Add Todo</button>
    </div>
  );
};
AddTodo = connect()(AddTodo);

const Footer = () => (
    <p>
      Show: {' '}
      <FilterLink
        filter="SHOW_ALL">All</FilterLink> {' '}
      <FilterLink
        filter="SHOW_COMPLETED">Completed</FilterLink> {' '}
      <FilterLink
        filter="SHOW_ACTIVE">Active</FilterLink>
    </p>
);

let nextId = 0;
const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('app')
);
