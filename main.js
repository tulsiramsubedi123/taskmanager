document.addEventListener('DOMContentLoaded', () => {
  // Retrieving DOM elements
  const taskTitle = document.getElementById('taskTitle');
  const taskDescription = document.getElementById('taskDescription');
  const taskDueDate = document.getElementById('taskDueDate');
  const taskCategory = document.getElementById('taskCategory');
  const taskPriority = document.getElementById('taskPriority');
  const addTaskButton = document.getElementById('addTaskButton');
  const taskList = document.getElementById('taskList');
  const filterTitle = document.getElementById('filterTitle');
  const filterDueDate = document.getElementById('filterDueDate');
  const filterCategory = document.getElementById('filterCategory');
  const filterPriority = document.getElementById('filterPriority');
  const sortTasks = document.getElementById('sortTasks');

  let tasks = []; // Array to store tasks

  // Function to add a task to the task list
  const addTaskToList = (task) => {
      const taskItem = document.createElement('div');
      taskItem.classList.add('taskItem');
      taskItem.setAttribute('data-id', task.id);
      taskItem.innerHTML = `
          <h3>${task.title}</h3>
          <p>${task.description}</p>
          <small>Due: ${task.dueDate}</small>
          <span>Category: ${task.category}</span>
          <span>Priority: ${task.priority}</span>
      `;
      taskList.appendChild(taskItem);
  };

  // Function to load tasks from local storage
  const loadTasks = () => {
      tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.forEach(task => addTaskToList(task));
  };

  // Function to filter tasks based on filter criteria
  const filterTasks = () => {
      const titleFilter = filterTitle.value.toLowerCase();
      const dueDateFilter = filterDueDate.value;
      const categoryFilter = filterCategory.value;
      const priorityFilter = filterPriority.value;
      return tasks.filter(task => {
          return (titleFilter === '' || task.title.toLowerCase().includes(titleFilter))
              && (dueDateFilter === '' || task.dueDate === dueDateFilter)
              && (categoryFilter === '' || task.category === categoryFilter)
              && (priorityFilter === '' || task.priority === priorityFilter);
      });
  };

  // Function to sort tasks based on selected sorting option
  const sortTasksList = (tasks) => {
      const sortBy = sortTasks.value;
      return tasks.sort((a, b) => {
          if (sortBy === 'alphabetical') {
              return a.title.localeCompare(b.title);
          } else if (sortBy === 'reverseAlphabetical') {
              return b.title.localeCompare(a.title);
          } else if (sortBy === 'soonest') {
              return new Date(a.dueDate) - new Date(b.dueDate);
          } else if (sortBy === 'latest') {
              return new Date(b.dueDate) - new Date(a.dueDate);
          }
      });
  };

  // Function to clear input fields after adding a task
  const clearInputs = () => {
      taskTitle.value = '';
      taskDescription.value = '';
      taskDueDate.value = '';
      taskCategory.selectedIndex = 0;
      taskPriority.selectedIndex = 0;
  };

  // Event listener for adding a task
  addTaskButton.addEventListener('click', () => {
      const title = taskTitle.value.trim();
      const description = taskDescription.value.trim();
      const dueDate = taskDueDate.value;
      const category = taskCategory.value;
      const priority = taskPriority.value;

      if (!title || !description || !dueDate || !category || !priority) {
          alert('Please fill in all fields');
          return;
      }

      const id = new Date().getTime().toString();
      const newTask = { id, title, description, dueDate, category, priority };
      tasks.push(newTask);
      addTaskToList(newTask);
      saveTasks();
      clearInputs();
  });

  // Event listeners for filter and sort options
  filterTitle.addEventListener('input', displayFilteredTasks);
  filterDueDate.addEventListener('change', displayFilteredTasks);
  filterCategory.addEventListener('change', displayFilteredTasks);
  filterPriority.addEventListener('change', displayFilteredTasks);
  sortTasks.addEventListener('change', displayFilteredTasks);

  // Function to display filtered tasks
  const displayFilteredTasks = () => {
      const filteredTasks = filterTasks();
      const sortedTasks = sortTasksList(filteredTasks);
      taskList.innerHTML = '';
      sortedTasks.forEach(task => addTaskToList(task));
  };

  // Function to save tasks to local storage
  const saveTasks = () => {
      localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  // Initial loading of tasks
  loadTasks();
});