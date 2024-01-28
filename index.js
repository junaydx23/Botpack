const { spawn } = require("child_process");
const express = require("express");
const app = express();
const logger = require("./utils/log.js");
const path = require('path');
const net = require('net');
const chalk = require('chalk');
const config = require('./config.json');
const pkg = require('./package.json');
const axios = require('axios');

const getRandomPort = () => Math.floor(Math.random() * (1000 - 1024) + 1024);
const PORT = getRandomPort();
let currentPort = PORT;
const REPL_HOME = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`.toLowerCase();

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/includes/login/cover/index.html'));
});

app.get('/', (req, res) => res.sendStatus(200));

setInterval(uptime, 1000);

function uptime() {
  axios.get(REPL_HOME).then(() => {}).catch(() => {});
}

  console.clear();
  startBot(0);

  async function isPortAvailable(port) {
    return new Promise((resolve) => {
      const tester = net.createServer()
        .once('error', () => resolve(false))
        .once('listening', () => {
          tester.once('close', () => resolve(true)).close();
        })
        .listen(port, '127.0.0.1');
    });
  }

  function startServer(port) {
    app.listen(port, () => {
      logger.loader(`The server is currently running on port: ${port}!`);
      logger.loader(`Starting the uptime for ${chalk.underline(`${REPL_HOME}!`)}`, 'SYSTEM');
    });

    app.on('error', (error) => {
      logger(`An error occurred while starting the server: ${error}`, "SYSTEM");
    });
  }

  async function startBot(index) {
    console.log(chalk.bold.dim(` ${process.env.REPL_SLUG}`.toLowerCase() + ` (v${config.version})`));
    logger(`Starting...`, "STARTER");
    try {
      const isAvailable = await isPortAvailable(currentPort);
      if (!isAvailable) {
        logger(`Retrying...`, "SYSTEM");
        const newPort = getRandomPort();
        logger.loader(`Current port ${currentPort} is not available. Switching to a anew port ${newPort}.`);
        currentPort = newPort;
      }

      startServer(currentPort);

      const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "main.js", "custom.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true,
        env: {
          ...process.env,
          CHILD_INDEX: index,
        },
      });

      child.on("close", (codeExit) => {
        if (codeExit !== 0) {
          startBot(index);
        }
      });

      child.on("error", (error) => {
        logger(`An error occurred while starting the child process: ${error}`, "SYSTEM");
      });
    } catch (err) {
      logger(`Error while starting the system: ${err}`, "SYSTEM");
    }
  }