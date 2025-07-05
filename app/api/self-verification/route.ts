// import { getUserIdentifier, SelfBackendVerifier, countryCodes } from "@selfxyz/core";

export async function POST() {
  try {
    // Temporarily disabled - missing @selfxyz/core dependency
    return Response.json(
      { message: "Self verification temporarily disabled" },
      { status: 501 },
    );

    // const requestJson = await request.json();
    // const { proof, publicSignals } = requestJson;

    // if (!proof || !publicSignals) {
    //   return Response.json({ message: "Missing required fields" }, { status: 400 });
    // }

    // // Extract user ID from the proof
    // const userId = await getUserIdentifier(publicSignals);
    // console.log("Extracted userId:", userId);

    // // Initialize and configure the verifier
    // const selfBackendVerifier = new SelfBackendVerifier("https://forno.celo.org", "creator-rewards");

    // // Configure verification options
    // selfBackendVerifier.setMinimumAge(18);
    // selfBackendVerifier.excludeCountries(
    //   countryCodes.IRN, // Iran
    //   countryCodes.PRK // North Korea
    // );
    // selfBackendVerifier.enableNameAndDobOfacCheck();

    // // Verify the proof
    // const result = await selfBackendVerifier.verify(proof, publicSignals);

    // if (result.isValid) {
    //   return Response.json({ success: true }, { status: 200 });
    //   // Return successful verification response
    // } else {
    //   // Return failed verification response
    //   return Response.json(
    //     {
    //       result: false,
    //       message: "Verification failed",
    //       details: result.isValidDetails
    //     },
    //     { status: 400 }
    //   );
    // }
  } catch (error) {
    console.error("Error verifying proof:", error);
    return Response.json(
      {
        result: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
