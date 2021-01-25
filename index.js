#!/usr/bin/env node
const { exec } = require("child_process");
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
    exec(`mkdir ${dataStore.projectName}`, (err, stdout, stdin) => {
      if (err) console.log(err);
    });
    exec(
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

        exec(
          `cd ${dataStore.projectName} &&  npm i react react-dom parcel-bundler`
        );
        exec(
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
        });

        fs.readFile(`./assets/index.html`, (err, content) => {
          if (err) console.log(err);

          fs.writeFile(
            `${dataStore.projectName}/public/index.html`,
            content,
            (err) => {
              if (err) console.log(err);
            }
          );
        });
        fs.mkdir(`${dataStore.projectName}/src`, (err) => {
          if (err) console.log(err);
        });
        fs.readFile(`./assets/style.css`, (err, content) => {
          if (err) console.log(err);

          fs.writeFile(
            `${dataStore.projectName}/src/style.css`,
            content,
            (err) => {
              if (err) console.log(err);
            }
          );
        });

        fs.readFile(`./assets/index.js`, (err, content) => {
          if (err) console.log(err);

          fs.writeFile(
            `${dataStore.projectName}/src/index.js`,
            content,
            (err) => {
              if (err) console.log(err);
            }
          );
        });
      }
    );
  });
