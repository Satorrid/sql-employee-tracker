require('console.table')
const inquirer = require('inquirer');
const connection = require('./config/connection').promise();

async function chooseAction() {
    const { action } = await inquirer.prompt({
        name: "action",
        type: "list",
        message: "Please select a task.",
        choices: [
            "View departments",
            "View roles"
        ]
    })
    switch (action) {
        case "View departments":
            viewDepartments();
            break;
        case "View roles":
            viewRoles()
            break;
    }
}

async function viewDepartments() {
    const [departments] = await connection.query('select * from department')
    console.table(departments)
}

async function viewRoles() {
    const [roles] = await connection.query('select role.id, role.title, role.salary, department.name from role left join department on role.department_id = department.id')
    console.table(roles)
}
chooseAction();