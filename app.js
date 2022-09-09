require('console.table')
const inquirer = require('inquirer');
const { connect } = require('./config/connection');
const connection = require('./config/connection').promise();

async function chooseAction() {
    const { action } = await inquirer.prompt({
        name: "action",
        type: "list",
        message: "Please select a task.",
        choices: [
            "View departments",
            "View roles",
            "View employees",
            "Add department"
        ]
    })
    switch (action) {
        case "View departments":
            await viewDepartments();
            break;
        case "View roles":
            await viewRoles()
            break;
        case "View employees":
            await viewEmployees();
            break;
        case "Add department":
            await addDepartment();
            break;
    }
    process.exit(0);
}

async function viewDepartments() {
    const [departments] = await connection.query('select * from department')
    console.table(departments)
}

async function viewRoles() {
    const [roles] = await connection.query(`
    SELECT role.id, role.title, role.salary, department.name 
    FROM role
    LEFT JOIN department
    ON role.department_id = department.id`)
    console.table(roles)
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
    ON emp.manager_id = man.id`)
    console.table(employees)
}

async function addDepartment() {
    const {name} = await inquirer.prompt({
        type: "input",
        name: "name",
        message: "What is the name of your department?"
    })
    await connection.query(`INSERT INTO department (name)
    VALUES 
    ("${name}")`)
}

chooseAction();