
const tasks = [
  { id: 1, title: "Complete DBMS assignment", completed: false },
  { id: 2, title: "Revise computer networks", completed: true },
  { id: 3, title: "Practice Java questions", completed: false }
];

function getTasks(completed) {
  if (completed === undefined) {
    return tasks;
  }

  return tasks.filter(task => task.completed === completed);
}

function getTaskSummary() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;

  return { total, completed, pending };
}

// Tool registry: tools the agent is allowed to use
const tools = {
  getTasks: getTasks,
  getTaskSummary: getTaskSummary
};

module.exports = tools;
