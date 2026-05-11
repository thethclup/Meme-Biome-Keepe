/**
 * ERC-8021: Transaction Attribution Integration
 * Simplifies and standardizes creator attribution in on-chain transactions.
 */
import { toHex } from "viem";

// Placeholder codes to be replaced or injected later
export const ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";
export const BUILDER_CODE = "bc_ikns9i54";

export interface AttributionDetails {
  builderId: string;
  appId: string;
  source?: string;
}

/**
 * Generates an ERC-8021 compliant calldata suffix or attribution object
 * depending on the target contract's supported integration method.
 * For this implementation, we simulate appending hex data.
 */
export function generateAttributionSuffix({
  builderId = BUILDER_CODE,
  appId,
}: { builderId?: string; appId?: string } = {}): string {
  // In a real implementation, this would encode the details into a hex suffix
  // according to the ERC-8021 specification (e.g., specific byte sequences).
  
  // Example dummy hex suffix representing the builder and app IDs:
  const encodedBuilder = toHex(builderId).replace('0x', '');
  const encodedApp = appId ? toHex(appId).replace('0x', '') : '';
  
  return `8021${encodedBuilder}${encodedApp}`;
}

/**
 * Wraps an existing contract call with ERC-8021 attribution.
 */
export function withAttribution(calldata: string, details?: AttributionDetails) {
  const suffix = generateAttributionSuffix({
    builderId: details?.builderId || BUILDER_CODE,
    appId: details?.appId,
  });
  
  return `${calldata}${suffix}`;
}
