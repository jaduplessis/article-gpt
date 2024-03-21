#!/usr/bin/env node
import { getStage } from "@gen-ai-poc/helpers/cdk";
import { App } from "aws-cdk-lib";
import { starterStack } from "../lib/backend-stack-rds";
import "dotenv/config";

const app = new App();

const stage = getStage();

new starterStack(app, `${stage}-gen-ai-kb`);
