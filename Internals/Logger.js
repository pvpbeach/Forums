const chalk = require('chalk');

module.exports = {
    info: async msg => console.log(chalk.blue('[MineForums] ' + msg)),
    success: async msg => console.log(chalk.green('[MineForums] ' + msg)),
    error: async msg => console.log(chalk.red('[MineForums] ' + msg)),
    warning: async msg => console.log(chalk.yellow('[MineForums] ' + msg)),
}