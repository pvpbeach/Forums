const chalk = require('chalk');

module.exports = {
    info: async msg => console.log(chalk.blue(msg)),
    success: async msg => console.log(chalk.green(msg)),
    error: async msg => console.log(chalk.red(msg)),
    warning: async msg => console.log(chalk.yellow(msg)),
}