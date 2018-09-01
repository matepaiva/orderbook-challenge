const program = require('commander');
const server = require('./server');
const cli = require('./cli');
const { connectToDatabase } = require('./services');

const bootstrap = async () => {
    try {
        await connectToDatabase();

        program
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
            .option('-r, --rebalance <orderbookId>', 'Rebalance an orderbook by id')
            .action(cli.bind(null, program));

        program.parse(process.argv);
    } catch (error) {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log(error);
    }
};

bootstrap();
