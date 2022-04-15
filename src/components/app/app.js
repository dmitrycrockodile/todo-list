import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import AddItem from '../item-add-form';

import './app.css';

export default class App extends Component {

  newId = 100;

  state = {
    todoData: [
      this.createItem('Drink Coffee'),
      this.createItem('Make Awesome App'),
      this.createItem('Have a lunch'),
    ], 
    term: '',
    filter: 'all'
  }

  createItem(label) {
    return {
      label,
      important: false,
      id: this.newId++,
      done: false,
    };
  }

  toggleProperty(arr, id, propName) {
    const idx = arr.findIndex((el) => el.id === id);

      const oldItem = arr[idx];
      const newItem = {...oldItem, 
        [propName]: !oldItem[propName]};

      return [
        ...arr.slice(0, idx), 
        newItem,
        ...arr.slice(idx + 1)
      ];
  };

  deleteItem = (id) => {
    this.setState(({ todoData }) => {
      const idx = todoData.findIndex((el) => el.id === id);
      
      const newArray = [
        ...todoData.slice(0, idx), 
        ...todoData.slice(idx + 1)
      ];

      return { todoData: newArray };
    });
  }

  addItem = (text) => {
    this.setState(({ todoData }) => {

      const newItem = this.createItem(text);

      const newArray = [...todoData, newItem];

      return { todoData: newArray };
    });
  }

  onToggleDone = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'done')
      };
    })
  }

  onToggleImportant = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'important')
      };
    });
  }

  onSearchChange = (term) => {
    this.setState({ term });
  }

  onFilterChange = (filter) => {
    this.setState({ filter });
  }

  search = (items, term) => {
    if (term.length === 0) return items;

    return items.filter((item) => {
      return item.label
                 .toLowerCase()
                 .indexOf(term.toLowerCase()) > -1;
    });
  }

  filter = (items, filter) => {
    switch (filter) {
      case 'all':
        return items;
      case 'done':
        return items.filter((item) => item.done);
      case 'active':
        return items.filter((item) => !item.done);
      default:
        return items;
    }
  }

  render() {
    const { todoData, term, filter } = this.state;

    const doneCount = todoData.filter((el) => el.done).length;
    const todoCount = todoData.length - doneCount;

    const visibleItems = this.filter(this.search(todoData, term), filter);

    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel onSearchChange={ this.onSearchChange } />
          <ItemStatusFilter 
            filter={filter} 
            onFilterChange={ this.onFilterChange }/>
        </div>
  
        <TodoList 
        todos={visibleItems}
        onDeleted={ this.deleteItem } 
        onToggleImportant={ this.onToggleImportant }
        onToggleDone={ this.onToggleDone } />
        <AddItem  
        onItemAdded={ this.addItem }/>
      </div>
    );
  }
};