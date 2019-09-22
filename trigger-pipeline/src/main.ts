import * as core from "@actions/core";

async function run() {
  try {
    const myInput = core.getInput("org");
    core.debug(`Hello ${myInput}`);
    core.debug("env: " + JSON.stringify(process.env, null, 2));
  } catch (ex) {
    core.setFailed(ex.message);
  }
}

run();
