#!/usr/bin/env node

const { exec } = require("child_process");
const { stdout } = require("process");
const fs = require("fs");
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const inquirer = require("inquirer");
const dataStore = require("./dataStore");
const Spinner = require("cli-spinner").Spinner;

const spinner = new Spinner();
spinner.setSpinnerString("|/-\\");

clear();
console.log(
  chalk.green(
    figlet.textSync(`React Easy App`, {
      horizontalLayout: "full",
    })
  )
);
console.log(
  chalk.green("Create a React app using parcel and minimum configuration.")
);

inquirer
  .prompt([
    {
      name: "name",
      type: "input",
      message: "What do you want your project to be called?",
    },
    {
      name: "version",
      type: "input",
      message: "What is the version of your project?",
    },
    {
      name: "description",
      type: "input",
      message: "Describe your project.",
    },
    {
      name: "author",
      type: "input",
      message: "Who is the author of project?",
    },
  ])
  .then((answer) => {
    clear();
    console.log(chalk.green("Doing some magic! Just Chill and Wait :) "));
    spinner.start();
    answer.name === ""
      ? dataStore.projectName
      : (dataStore.projectName = answer.name);
    answer.version === ""
      ? dataStore.projectVer
      : (dataStore.projectVer = answer.version);
    answer.description === ""
      ? dataStore.projectDes
      : (dataStore.projectDes = answer.description);
    answer.author === ""
      ? dataStore.author
      : (dataStore.author = answer.author);

    configureStruct(dataStore);
  });

function configureStruct(dataStore) {
  exec(`mkdir ${dataStore.projectName}`, function (err, stdout, stdin) {
    if (err) {
      console.log(err);
      return;
    }
  });

  exec(
    `cd ${dataStore.projectName} && npm init -y`,

    function (err, stdout, stdin) {
      if (err) {
        console.log(err);
        return;
      }
    }
  );

  fs.writeFile(
    `${dataStore.projectName}/package.json`,
    `{
          "name": "${dataStore.projectName}",
          "version": "${dataStore.projectVer}",
          "description": "${dataStore.projectDes}",
          "main": "index.js",
          "scripts": {
            "test": "No test script was specified.",
            "start": "${dataStore.startScript}"
          },
          "keywords": [],
          "author": "${dataStore.author}",
          "license": "ISC"
          }`,
    function (err) {
      if (err) {
        console.log(err);
        return;
      }
    }
  );
  let isDep = false,
    isDev = false;
  exec(
    `cd ${dataStore.projectName} &&  npm i react react-dom parcel-bundler`,
    function (err) {
      if (err) console.log(err);
      else {
        isDep = true;
        if (isDep && isDev) {
          spinner.stop(true);
          console.log(
            chalk.green(
              `Project is created! Execute 'cd ${dataStore.projectName} , then 'npm start'`
            )
          );
        }
      }
    }
  );
  exec(
    `cd ${dataStore.projectName} &&  npm i babel-preset-env babel-preset-react --save-dev`,
    function (err) {
      if (err) console.log(err);
      else {
        isDev = true;
        if (isDep && isDev) {
          spinner.stop(true);
          console.log(
            chalk.green(
              `Project is created! Execute 'cd ${dataStore.projectName} , then 'npm start'`
            )
          );
        }
      }
    }
  );
  fs.writeFile(
    `${dataStore.projectName}/.babelrc`,
    `
           {
              "presets": ["env", "react"]
            } 
          `,
    function (err) {
      if (err) console.log(err);
      return;
    }
  );
  fs.mkdir(`${dataStore.projectName}/public`, function (err) {
    if (err) console.log(err);

    fs.writeFile(
      `${dataStore.projectName}/public/index.html`,
      `<!DOCTYPE html>
            <html>
              <head>
                <title>React Easy App</title>
                <link rel="stylesheet" href="../src/style.css" />
              </head>
              <body>
                <div id="app"></div>
                <script src="../src/index.js"></script>
              </body>
            </html>
            `,
      function (err) {
        if (err) {
          console.log(err);
          return;
        }
      }
    );
  });

  fs.mkdir(`${dataStore.projectName}/src`, function (err) {
    if (err) console.log(err);

    fs.writeFile(
      `${dataStore.projectName}/src/style.css`,
      `body {
                background-color: black;
                color: white;
                font-size: 28px;
                text-align: center;
              }
              `,
      function (err) {
        if (err) {
          console.log(err);
          return;
        }
      }
    );

    fs.writeFile(
      `${dataStore.projectName}/src/index.js`,

      `import React from "react";
          import ReactDOM from "react-dom";
          
          class HelloMessage extends React.Component {
            render() {
              return (
                <div>
                  <div className="container">
                    <h1>Made Using {this.props.name}</h1>
                  </div>
                </div>
              );
            }
          }
          
          let App = document.getElementById("app");
          
          ReactDOM.render(<HelloMessage name="React Easy" />, App);
          `,
      function (err) {
        if (err) {
          console.log(err);
          return;
        }
      }
    );
  });
}
