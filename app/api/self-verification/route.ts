import { SelfBackendVerifier, InMemoryConfigStore, AllIds, DefaultConfigStore } from "@selfxyz/core";
import { NextRequest, NextResponse } from "next/server";
import { BigNumberish } from "ethers";

// Configure dynamic verification based on user context
const configStore = new DefaultConfigStore({
  minimumAge: 18,
  excludedCountries: ["IRN", "PRK"],
  ofac: true
});

// Initialize the verifier
const verifier = new SelfBackendVerifier(
  "creator-rewards", // Must match frontend scope
  "https://cannes.creatorscore.app/api/self-verification", // Your verification endpoint
  false, // Production mode (real passports)
  AllIds, // Accept all document types
  configStore, // Dynamic configuration
  "uuid" // User identifier type
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("body", body);
    const { attestationId, proof, publicSignals, userContextData } = body;

    // Validate input
    console.log("test", attestationId, proof, publicSignals, userContextData);
    if (!attestationId || !proof || !publicSignals || !userContextData) {
      return NextResponse.json({ error: "Missing required verification parameters" }, { status: 400 });
    }

    // Verify the proof
    const result = await verifier.verify(attestationId, proof, publicSignals as BigNumberish[], userContextData);

    // Check overall verification result
    if (!result.isValidDetails.isValid) {
      return NextResponse.json({ error: "Cryptographic proof verification failed" }, { status: 400 });
    }

    // Check specific requirements
    if (!result.isValidDetails.isMinimumAgeValid) {
      return NextResponse.json({ error: "Age requirement not met" }, { status: 403 });
    }

    if (!result.isValidDetails.isOfacValid) {
      return NextResponse.json({ error: "OFAC sanctions check failed" }, { status: 403 });
    }

    // Verification successful - return relevant information
    return NextResponse.json(
      {
        status: "success",
        result: true,
        verified: true,
        verificationId: result.discloseOutput.nullifier,
        userIdentifier: result.userData.userIdentifier,
        nationality: result.discloseOutput.nationality,
        ageVerified: result.isValidDetails.isMinimumAgeValid,
        // Include disclosed information based on your requirements
        disclosedData: {
          name: result.discloseOutput.name,
          dateOfBirth: result.discloseOutput.dateOfBirth,
          issuingState: result.discloseOutput.issuingState
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Verification error:", error);

    if (error.name === "ConfigMismatchError") {
      // Log detailed configuration mismatches for debugging
      console.error("Config mismatches:", error.issues);

      return NextResponse.json(
        {
          error: "Configuration mismatch",
          details: error.issues.map((issue: { type: string; message: string }) => ({
            type: issue.type,
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Internal verification error" }, { status: 500 });
  }
}
