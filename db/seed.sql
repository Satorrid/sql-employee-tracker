INSERT INTO department (id, name)
VALUES 
(1, "Human Resources"),
(2, "Accounting"),
(3, "Sales");

INSERT INTO role (id, title, salary, department_id)
VALUES
(1, "intern", 15000, 1),
(2, "intern", 15000, 2),
(3, "intern", 15000, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
(1, "Bob", "Craig", 1, NULL),
(2, "Steve", "Jones", 2, 1),
(3, "Eric", "Smith", 3, 1);