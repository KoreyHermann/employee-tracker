// required packages
const inquirer = require('inquirer');
const db = require('./db/connection');
db.connect(err => {
    console.log('Database connected.');
    employee_tracker();
});

// command line prompts
var employee_tracker = function () {
    inquirer.prompt([{
        type: 'list',
        name: 'prompt',
        message: 'Select an option below:',
        choices: ['View departments', 'View roles', 'View employees', 'Add department', 'Add role', 'Add employee', 'Update roles', 'Finish']
    }]).then((answers) => {
        
        if (answers.prompt === 'View department') {
            db.query(`SELECT * FROM department`, (err, result) => {
                
                console.log("Viewing departments: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'View roles') {
            db.query(`SELECT * FROM role`, (err, result) => {
                
                console.log("Viewing roles: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'View employees') {
            db.query(`SELECT * FROM employee`, (err, result) => {
                
                console.log("Viewing employees: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'Add department') {
            inquirer.prompt([{
                
                type: 'input',
                name: 'department',
                message: 'Input new department',
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log('Cannot be blank');
                        return false;
                    }
                }
            }]).then((answers) => {
                db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
                    
                    console.log(`Added ${answers.department} to the database.`)
                    employee_tracker();
                });
            })
        } else if (answers.prompt === 'Add role') {
            
            db.query(`SELECT * FROM department`, (err, result) => {
                

                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'role',
                        message: 'Input new role',
                        validate: roleInput => {
                            if (roleInput) {
                                return true;
                            } else {
                                console.log('Cannot be blank');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'Edit salary',
                        validate: salaryInput => {
                            if (salaryInput) {
                                return true;
                            } else {
                                console.log('Cannot be blank');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Choose associated department',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].name);
                            }
                            return array;
                        }
                    }
                ]).then((answers) => {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].name === answers.department) {
                            var department = result[i];
                        }
                    }

                    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (err, result) => {
                        
                        console.log(`Added ${answers.role} to the database.`)
                        employee_tracker();
                    });
                })
            });
        } else if (answers.prompt === 'Add employee') {
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                

                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'Add first name',
                        validate: firstNameInput => {
                            if (firstNameInput) {
                                return true;
                            } else {
                                console.log('Cannot be blank');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'Add last name',
                        validate: lastNameInput => {
                            if (lastNameInput) {
                                return true;
                            } else {
                                console.log('Cannot be blank');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Add employee role',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            var newArray = [...new Set(array)];
                            return newArray;
                        }
                    },
                    {
                        type: 'input',
                        name: 'manager',
                        message: 'Add employee manager',
                        validate: managerInput => {
                            if (managerInput) {
                                return true;
                            } else {
                                console.log('Cannot be blank');
                                return false;
                            }
                        }
                    }
                ]).then((answers) => {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answers.role) {
                            var role = result[i];
                        }
                    }

                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.manager.id], (err, result) => {
                        
                        console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
                        employee_tracker();
                    });
                })
            });
        } else if (answers.prompt === 'Update roles') {
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Select employee to update role',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].last_name);
                            }
                            var employeeArray = [...new Set(array)];
                            return employeeArray;
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Input new role',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            var newArray = [...new Set(array)];
                            return newArray;
                        }
                    }
                ]).then((answers) => {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].last_name === answers.employee) {
                            var name = result[i];
                        }
                    }

                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answers.role) {
                            var role = result[i];
                        }
                    }
                    db.query(`Update employee`, [{role_id: role}, {last_name: name}], (err, result) => {
                        
                        console.log(`Updated ${answers.employee} role to the database.`)
                        employee_tracker();
                    });
                })
            });
        } else if (answers.prompt === 'Finish') {
            db.end();
            console.log("Closing employee tracker");
        }
    })
};


