const program = require('commander');
const { server, cli } = require('./programs');
const { connectToDatabase } = require('./services');

const bootstrap = async () => {
    try {
        await connectToDatabase();

        program
            .usage('\n npm start -- [options] [command]')
            .version(process.env.npm_package_version);

        program
            .command('server')
            .alias('s')
            .description('Start a RESTful http server to work with orderbooks')
            .action(server);

        program
            .command('command-line')
            .alias('cli')
            .description('Work with orderbooks in command line')
            .option('-o, --orderbook <fund>', 'Create an orderbook according to fund amount', parseInt)
            .option('-r, --rebalance <orderbookId>', 'Rebalance an orderbook by id and create a new orderbook')
            .action(cli.bind(null, program));

        program.parse(process.argv);


        const hasCommand = program.args.some((arg) => arg instanceof program.Command);

        // Show help in command line if no valid command is passed as argument.
        if (!hasCommand) {
            program.help();
        }
    } catch (error) {
        console.log(error);
    }
};

bootstrap();

module.exports = bootstrap;
