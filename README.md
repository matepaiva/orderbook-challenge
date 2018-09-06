# orderbook-challenge

This project creates orderbooks based on an index of cryptocurrencies with weight and price, aiming to create and maintain a well distributed portfolio.

How it does that?
- By receiving a total fund amount and creating an orderbook;
- By receiving an orderbook as reference and creating a new orderbook to rebalance the first one.

## Requirements
- Node 8 or higher

## Usage

First of all, run: `npm install`

There are two ways to use this project: via command line or starting a web server.

Anyway, all starts at `npm start`.

```
Usage: npm start -- [options] [command]

Options:

-V, --version               output the version number
-h, --help                  output usage information

Commands:

server|s                    Start a RESTful http server to work with orderbooks
command-line|cli [options]  Work with orderbooks in command line
```

### Command-line

You have to call `npm start` with command `command-line` (or just `cli`) and some of the options below. It's required to provide an option.

Example: `npm start -- cli --help`

```
Usage: command-line|cli [options]

Work with orderbooks in command line

Options:

-o, --orderbook <fund>         Create an orderbook according to fund amount
-r, --rebalance <orderbookId>  Rebalance an orderbook by id and create a new orderbook
-h, --help                     output usage information
```

Either option will save a new orderbook csv file to the root of this project.

At the end, it will be displayed the id of the generated orderbook. Also, the orderbook id is the first one in the name of the file.

You must provide that orderbook id later to rebalance it.

### Server

If you call `npm start -- server` it will start a web server on port 3000, then you can create orderbooks via `http`.

Alias: `npm run start:server`.

#### Available endpoints

- `[POST] /orderbooks`

    Create a new orderbook. Required parameter (via body): `fundAmount`.

    Example:
    ```
    POST /orderbooks HTTP/1.1
    Host: localhost:3000
    Content-Type: application/x-www-form-urlencoded
    Accept: application/json
    Cache-Control: no-cache
    Postman-Token: 3e74dcc8-d21b-461e-b1f0-f0e916fef68a

    fundAmount=12345678123123123
    ```

    You will need the orderbook id to rebalance it in the next endpoint. If you are receiving a JSON, you will have the orderbookId in the response. If you are downloading a CSV file, look at the response headers. The `Content-Disposition` header has the name of the file, and that name is composed with the orderbook id.

    Example:
    ```
        content-disposition = attachment; filename="orderbookId_f9Q3rXB2NNGpcLOK__portfolioId_dZlN7iMZtH1Cq94q.csv" // the orderbook id is f9Q3rXB2NNGpcLOK
    ```

    At the end, it will be displayed the id of the generated orderbook. Also, the orderbook id is the first one in the name of the file.

    You must provide that orderbook id later to rebalance it.

- `[POST] /orderbooks/:orderbookId/rebalance`

    Create a new orderbook as a result of the reference orderbook rebalance. Required parameter: `orderbookId`.

    Example:
    ```
    POST /orderbooks/f9Q3rXB2NNGpcLOK/rebalance HTTP/1.1
    Host: localhost:3000
    Content-Type: application/x-www-form-urlencoded
    Accept: application/json
    ```

#### Response types

By default the requests will return an csv file, and the header `Content-Disposition` will contain the filename. The filename contains the `orderbookId`, necessary to rebalance.

If you set `Accept` header to `application/json`, the response will be a json.

## Tests

Just run `npm t`. To get coverage, run `npm t -- --coverage`.

## Development

### Folder structure

    .
    ├── models        # Models (Portfolio, Orderbook, Instruction...)
    ├── modules       # The core business logic
    ├── programs      # The command-line and webserver logic
    ├── services      # database connect, 3rd party services...
    └── index.js      # application bootstrap

### Database

As this project is meant to be a prove-of-concept, I wanted to use a file based database, so there is no necessity to have a SQL Server or a MongoDB server running to start this project. It uses [nedb](https://github.com/louischatriot/nedb).

### Models

I thought in 3 main models when I started the project:

- Portfolio: The cryptocurrencies portfolio. Here you store data about all your assets. For now it's not doing much, it's just being used to keep track that a orderbook belongs to a portfolio.

- Orderbook: The orderbook is a group of instructions that need to be taken to have a well balanced portfolio.

- Instruction: It's the orderbook instruction.

### Next steps

Take into account that this whole project was made in 3 days. There are some parts that I would like to improve:

- Create and use environment variables.
- Logger and error handlers
- Improve injection of mock dependencies in tests.
- modularization of the `modules` (core) logic.
- Create a Asset model to store and manage the portfolio assets. Today we are just storing the instructions.
- Create other http endpoints and methods to get Orderbook, Portfolio etc.
