// This file is kept for potential future use but SST deployment is disabled
// to prevent conflicts with OpenNext Terraform module

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "eth-global-creator-rewards",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws"
    };
  },
  async run() {
    // SST deployment disabled - using OpenNext Terraform module instead
    // Remove this comment and implement SST resources if needed
    return {};
  }
});
