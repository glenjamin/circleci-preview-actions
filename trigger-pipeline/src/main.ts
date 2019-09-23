import * as core from "@actions/core";
import dotprop from "dot-prop";
import httpism from "httpism";

type Args = {
  token: string;
  vcs: string;
  org: string;
  repo: string;
  branch: string;
  parameters: object;
};

type TriggerResponse = {
  number: number;
  id: string;
  created_at: string;
};

async function run() {
  try {
    const args = readArgs();

    console.log("Triggering CircleCI Pipeline with details:");
    console.dir(args, { color: true }); // rely on GitHub to mask token secret

    const resp = await postRequest(args);

    core.setOutput("pipeline_number", String(resp.number));
    core.setOutput("pipeline_id", resp.id);

    console.log("CircleCI Pipeline Created");
    console.dir(resp, { color: true });
  } catch (ex) {
    core.setFailed(ex.message);
  }
}

function readArgs(): Args {
  try {
    const token = core.getInput("token", { required: true });
    const vcs = core.getInput("vcs") || "github";
    const org = readArg("org", "organization.login");
    const repo = readArg("repo", "repository.name");
    const branch = readArg("repo", "pull_request.head.ref");
    const parameters = JSON.parse(core.getInput("parameters_json") || "{}");

    return { token, vcs, org, repo, branch, parameters };
  } catch (ex) {
    console.log("Failed to read args");
    console.dir(process.env, { depth: Infinity, color: true });
    console.dir(getEvent(), { depth: Infinity, color: true });
    throw ex;
  }
}

async function postRequest(args: Args): Promise<TriggerResponse> {
  const client = httpism.client("https://circleci.com/api/v2/", {
    headers: {
      "user-agent": "trigger-pipeline GitHub Action",
      "Circle-Token": args.token
    },
    responseBody: "json"
  });

  const resp = await client.post(
    "project/:vcs/:org/:project/pipeline",
    {
      branch: args.branch,
      parameters: args.parameters
    },
    {
      params: {
        vcs: args.vcs,
        org: args.org,
        project: args.repo
      }
    }
  );

  return resp;
}

function readArg(input: string, fallback: string): string {
  const val = core.getInput(input);
  if (val) {
    return val;
  }
  const event = getEvent();
  if (dotprop.has(event, fallback)) {
    return dotprop.get<string>(event, fallback);
  }
  throw new Error(`Missing '${input}' argument`);
}

function getEvent(): object {
  if (process.env.GITHUB_EVENT_PATH) {
    return require(process.env.GITHUB_EVENT_PATH);
  }
  return {};
}

run();
