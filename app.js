require("console.table");
const inquirer = require("inquirer");
const { connect } = require("./config/connection");
const connection = require("./config/connection").promise();

async function chooseAction() {
  const { action } = await inquirer.prompt({
    name: "action",
    type: "list",
    message: "Please select a task.",
    choices: [
      "View departments",
      "View roles",
      "View employees",
      "Add department",
      "Add role",
      "Add employee",
      "Update employee role",
    ],
  });
  switch (action) {
    case "View departments":
      await viewDepartments();
      break;
    case "View roles":
      await viewRoles();
      break;
    case "View employees":
      await viewEmployees();
      break;
    case "Add department":
      await addDepartment();
      break;
    case "Add role":
      await addRole();
      break;
    case "Add employee":
      await addEmployee();
      break;
    case "Update employee role":
      await updateEmployeeRole();
      break;
  }
  process.exit(0);
}

async function viewDepartments() {
  const [departments] = await connection.query("select * from department");
  console.table(departments);
}

async function viewRoles() {
  const [roles] = await connection.query(`
    SELECT role.id, role.title, role.salary, department.name 
    FROM role
    LEFT JOIN department
    ON role.department_id = department.id`);
  console.table(roles);
}

async function viewEmployees() {
  const [employees] = await connection.query(`
    SELECT emp.id, emp.first_name, emp.last_name, role.title, department.name AS department, role.salary, man.first_name AS manager_first, man.last_name AS manager_last
    FROM employee emp
    LEFT JOIN role
    ON emp.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee man
    ON emp.manager_id = man.id`);
  console.table(employees);
}

async function addDepartment() {
  const { name } = await inquirer.prompt({
    type: "input",
    name: "name",
    message: "What is the name of your department?",
  });
  await connection.query(`INSERT INTO department (name)
    VALUES 
    ("${name}")`);
}

async function addRole() {
  const [departments] = await connection.query("select * from department");
  const choices = departments.map(({ id, name }) => {
    return {
      name: name,
      value: id,
    };
  });

  const { title, salary, department } = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the title of your role?",
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of your role?",
    },
    {
      name: "department",
      type: "list",
      message: "What is the department of your role?",
      choices: choices,
    },
  ]);
  await connection.query(`INSERT INTO role (title, salary, department_id)
    VALUES 
    ("${title}", ${salary}, ${department})`);
}

async function addEmployee() {
  const [roles] = await connection.query("select * from role");
  const roleChoices = roles.map(({ id, title }) => {
    return {
      name: title,
      value: id,
    };
  });
  const [managers] = await connection.query("select * from employee");
  const managerChoices = managers.map(({ id, first_name, last_name }) => {
    return {
      name: `${first_name} ${last_name}`,
      value: id,
    };
  });
  managerChoices.push({
    name: "none",
    value: null,
  });

  const { first_name, last_name, role, manager } = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the first name of your employee?",
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the last name of your employee?",
    },
    {
      name: "role",
      type: "list",
      message: "What is the role of your employee?",
      choices: roleChoices,
    },
    {
      name: "manager",
      type: "list",
      message: "Who is the manager of your employee?",
      choices: managerChoices,
    },
  ]);
  await connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES 
    ("${first_name}", "${last_name}", ${role}, ${manager})`);
}

async function updateEmployeeRole() {
  const [roles] = await connection.query("select * from role");
  const roleChoices = roles.map(({ id, title }) => {
    return {
      name: title,
      value: id,
    };
  });
  const [employees] = await connection.query("select * from employee");
  const employeeChoices = employees.map(({ id, first_name, last_name }) => {
    return {
      name: `${first_name} ${last_name}`,
      value: id,
    };
  });

  const { employee, role } = await inquirer.prompt([
    {
      name: "employee",
      type: "list",
      message: "Which employee would you like to change the role of?",
      choices: employeeChoices,
    },
    {
      name: "role",
      type: "list",
      message: "What role would you like to assign them to?",
      choices: roleChoices,
    },
  ]);
  await connection.query(`UPDATE employee
    SET role_id = "${role}"
   WHERE id = ${employee}`);
}

chooseAction();
