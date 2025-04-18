"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This file is the entry point for the `post:` hook of `upload-sarif-action.yml`.
 * It will run after the all steps in this job, in reverse order in relation to
 * other `post:` hooks.
 */
const core = __importStar(require("@actions/core"));
const actionsUtil = __importStar(require("./actions-util"));
const api_client_1 = require("./api-client");
const debugArtifacts = __importStar(require("./debug-artifacts"));
const environment_1 = require("./environment");
const logging_1 = require("./logging");
const util_1 = require("./util");
async function runWrapper() {
    try {
        // Restore inputs from `upload-sarif` Action.
        actionsUtil.restoreInputs();
        const logger = (0, logging_1.getActionsLogger)();
        const gitHubVersion = await (0, api_client_1.getGitHubVersion)();
        (0, util_1.checkGitHubVersionInRange)(gitHubVersion, logger);
        // Upload SARIF artifacts if we determine that this is a third-party analysis run.
        // For first-party runs, this artifact will be uploaded in the `analyze-post` step.
        if (process.env[environment_1.EnvVar.INIT_ACTION_HAS_RUN] !== "true") {
            if (gitHubVersion.type === undefined) {
                core.warning(`Did not upload debug artifacts because cannot determine the GitHub variant running.`);
                return;
            }
            await (0, logging_1.withGroup)("Uploading combined SARIF debug artifact", () => debugArtifacts.uploadCombinedSarifArtifacts(logger, gitHubVersion.type, 
            // The codeqlVersion is not applicable for uploading non-codeql sarif.
            // We can assume all versions are safe to upload.
            undefined));
        }
    }
    catch (error) {
        core.setFailed(`upload-sarif post-action step failed: ${(0, util_1.getErrorMessage)(error)}`);
    }
}
void runWrapper();
//# sourceMappingURL=upload-sarif-action-post.js.map