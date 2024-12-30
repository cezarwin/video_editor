import { AwsRegion, getRenderProgress } from "@remotion/lambda/client";

import {
  ProgressRequest,
  ProgressResponse,
} from "@/components/editor/version-4.0.0/types";
import { executeApi } from "@/components/editor/version-4.0.0/lambda-helpers/api-response";
import {
  LAMBDA_FUNCTION_NAME,
  REGION,
} from "@/components/editor/version-4.0.0/constants";

/**
 * API endpoint to check the progress of a Remotion video render on AWS Lambda
 *
 * @route POST /api/v4/lambda/progress
 * @returns {ProgressResponse} The current status of the render
 *   - type: 'error' - If a fatal error occurred during rendering
 *   - type: 'done' - If rendering is complete, includes output URL and file size
 *   - type: 'progress' - If rendering is in progress, includes completion percentage
 */
export const POST = executeApi<ProgressResponse, typeof ProgressRequest>(
  ProgressRequest,
  async (req, body) => {
    console.log("Progress request", { body });
    console.log("Bucket name", { bucketName: body.bucketName });
    const renderProgress = await getRenderProgress({
      bucketName: body.bucketName,
      functionName: LAMBDA_FUNCTION_NAME,
      region: REGION as AwsRegion,
      renderId: body.id,
    });

    if (renderProgress.fatalErrorEncountered) {
      console.log("ERROR", renderProgress.errors[0].message);
      return {
        type: "error",
        message: renderProgress.errors[0].message,
      };
    }

    if (renderProgress.done) {
      console.log("DONE");
      return {
        type: "done",
        url: renderProgress.outputFile as string,
        size: renderProgress.outputSizeInBytes as number,
      };
    }

    return {
      type: "progress",
      progress: Math.max(0.03, renderProgress.overallProgress),
    };
  }
);
