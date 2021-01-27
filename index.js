#!/usr/bin/env node
const { exec: spawn } = require("child_process");
const { stdout } = require("process");
const fs = require("fs");
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const inquirer = require("inquirer");
const dataStore = require("./dataStore");

clear();
console.log(
  chalk.green(figlet.textSync(`React Easy App`, { horizontalLayout: "full" }))
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
    answer.name === "" ? "" : (dataStore.projectName = answer.name);
    answer.version === "" ? "" : (dataStore.projectVer = answer.version);
    answer.description === ""
      ? ""
      : (dataStore.projectDes = answer.description);
    answer.author === "" ? "" : (dataStore.author = answer.author);

    console.log(dataStore);
    spawn(`mkdir ${dataStore.projectName}`, (err, stdout, stdin) => {
      if (err) console.log(err);
    });
    spawn(
      `npm init -y`,
      { cwd: dataStore.projectName },
      (err, stdout, stdin) => {
        if (err) {
          console.log(err);
          return;
        }

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
  }
  `,
          (err) => {
            if (err) {
              console.log(err);
              return;
            }
          }
        );

        spawn(
          `cd ${dataStore.projectName} &&  npm i react react-dom parcel-bundler`
        );
        spawn(
          `cd ${dataStore.projectName} &&  npm i babel-preset-env babel-preset-react --save-dev`
        );
        fs.writeFile(
          `${dataStore.projectName}/.babelrc`,
          `
    {
    "presets": ["env", "react"]
    }
     `,
          (err) => {
            if (err) console.log(err);
            return;
          }
        );
        fs.mkdir(`${dataStore.projectName}/public`, (err) => {
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
            (err) => {
              if (err) console.log(err);
            }
          );
        });

        fs.mkdir(`${dataStore.projectName}/src`, (err) => {
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
            (err) => {
              if (err) console.log(err);
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
            (err) => {
              if (err) console.log(err);
            }
          );
        });
      }
    );
  });
