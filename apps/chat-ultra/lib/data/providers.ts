// Placeholder implementation for provider configs
// TODO: Add provider_configs table to Drizzle schema or use Supabase directly

export interface ProviderConfig {
  _id: string;
  ownerUserId?: string;
  provider: string; // "openai" | "zai"
  apiKeyRef: string;
  defaultModel: string;
  enabled: boolean;
  createdAt: number;
}

export async function getProviderConfigsForUser(userId: string): Promise<ProviderConfig[]> {
  // TODO: Implement with Supabase or add to Drizzle schema
  return [];
}

export async function createProviderConfig(data: {
  ownerUserId?: string;
  provider: string;
  apiKeyRef: string;
  defaultModel: string;
  enabled: boolean;
}): Promise<ProviderConfig> {
  // TODO: Implement with Supabase or add to Drizzle schema
  throw new Error('Provider config creation not yet implemented');
}

export async function setDefaultProvider(
  userId: string,
  provider: string
): Promise<void> {
  // TODO: Implement with Supabase or add to Drizzle schema
  throw new Error('Set default provider not yet implemented');
}

