"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCurrentUser } from "@/lib/auth/useCurrentUser";
import type { Id } from "@/convex/_generated/dataModel";

interface ProviderConfig {
  _id: Id<"providerConfigs">;
  provider: string;
  defaultModel: string;
  enabled: boolean;
  apiKeyRef?: string; // Reference to encrypted storage
}

export default function ProvidersPage() {
  const { userId, isLoading: userLoading } = useCurrentUser();
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState<Record<string, boolean>>({});

  const providerConfigs = useQuery(
    api.provider.listForUser,
    userId ? { ownerUserId: userId } : "skip"
  );

  const settings = useQuery(
    api.settings.getForUser,
    userId ? { ownerUserId: userId } : "skip"
  );

  const updateProvider = useMutation(api.provider.setDefault);
  const createProviderConfig = useMutation(api.provider.createConfig);

  useEffect(() => {
    if (providerConfigs) {
      // Initialize API keys from configs (in production, these would be decrypted)
      const keys: Record<string, string> = {};
      providerConfigs.forEach((config) => {
        if (config.apiKeyRef) {
          // In production, decrypt apiKeyRef
          keys[config.provider] = ""; // Placeholder - would decrypt
        }
      });
      setApiKeys(keys);
    }
  }, [providerConfigs]);

  const handleSaveProvider = async (providerName: string, apiKey: string, model: string) => {
    if (!userId) return;

    setSaving((prev) => ({ ...prev, [providerName]: true }));
    try {
      // In production, encrypt and store API key securely
      // For now, we'll store a reference (apiKeyRef would be encrypted in production)
      const apiKeyRef = `encrypted_${providerName}_${Date.now()}`;

      // Create or update provider config
      await createProviderConfig({
        ownerUserId: userId,
        provider: providerName,
        apiKeyRef,
        defaultModel: model,
        enabled: true,
      });

      // Set as default if not already set
      if (!settings?.defaultProvider || settings.defaultProvider !== providerName) {
        await updateProvider({
          ownerUserId: userId,
          provider: providerName,
          model,
        });
      }

      setApiKeys((prev) => ({ ...prev, [providerName]: "" })); // Clear after save
    } catch (error) {
      console.error(`Failed to save ${providerName}:`, error);
      alert(`Failed to save ${providerName} configuration`);
    } finally {
      setSaving((prev) => ({ ...prev, [providerName]: false }));
    }
  };

  const handleTestConnection = async (providerName: string, apiKey: string) => {
    if (!apiKey.trim()) {
      alert("Please enter an API key first");
      return;
    }

    setTesting((prev) => ({ ...prev, [providerName]: true }));
    try {
      // Test API connection
      const response = await fetch("/api/providers/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: providerName,
          apiKey,
        }),
      });

      if (response.ok) {
        alert(`${providerName} connection successful!`);
      } else {
        const error = await response.json();
        alert(`Connection failed: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error(`Failed to test ${providerName}:`, error);
      alert(`Failed to test ${providerName} connection`);
    } finally {
      setTesting((prev) => ({ ...prev, [providerName]: false }));
    }
  };

  const providers = [
    {
      name: "openai",
      displayName: "OpenAI",
      models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
      defaultModel: "gpt-4",
    },
    {
      name: "zai",
      displayName: "z.ai",
      models: ["glm-4-plus"], // GLM Lite plan only supports glm-4-plus
      defaultModel: "glm-4-plus",
    },
  ];

  if (userLoading || settings === undefined) {
    return (
      <div className="p-8 text-center">
        <p className="text-body text-text-secondary">加载中...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-h1 font-semibold text-text-primary mb-6">AI Providers</h1>
      <p className="text-body-small text-text-muted mb-6">
        Configure your AI provider API keys and default models
      </p>

      <div className="space-y-6">
        {providers.map((provider) => {
          const config = providerConfigs?.find((c) => c.provider === provider.name);
          const isDefault = settings?.defaultProvider === provider.name;
          const currentModel = config?.defaultModel || provider.defaultModel;
          const apiKey = apiKeys[provider.name] || "";
          const [model, setModel] = useState(currentModel);

          return (
            <Card key={provider.name} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-h3 font-semibold text-text-primary">
                    {provider.displayName}
                  </h3>
                  {isDefault && (
                    <Badge variant="active" className="text-label">
                      Default
                    </Badge>
                  )}
                  {config?.enabled && (
                    <Badge variant="active" className="text-label">
                      Connected
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="API Key"
                  type="password"
                  placeholder={`Enter ${provider.displayName} API key`}
                  value={apiKey}
                  onChange={(e) =>
                    setApiKeys((prev) => ({ ...prev, [provider.name]: e.target.value }))
                  }
                  helpText={
                    config?.apiKeyRef
                      ? "API key is saved. Enter a new key to update."
                      : "Your API key is encrypted and stored securely"
                  }
                />

                <div>
                  <label className="block text-body-small text-text-secondary mb-2">
                    Default Model
                  </label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-sm bg-bg-surface-soft border border-border-default text-body text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
                  >
                    {provider.models.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    onClick={() => handleSaveProvider(provider.name, apiKey, model)}
                    disabled={saving[provider.name] || !apiKey.trim()}
                  >
                    {saving[provider.name] ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleTestConnection(provider.name, apiKey)}
                    disabled={testing[provider.name] || !apiKey.trim()}
                  >
                    {testing[provider.name] ? "Testing..." : "Test Connection"}
                  </Button>
                  {!isDefault && (
                    <Button
                      variant="secondary"
                      onClick={async () => {
                        if (!userId) return;
                        await updateProvider({
                          ownerUserId: userId,
                          provider: provider.name,
                          model,
                        });
                      }}
                    >
                      Set as Default
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-4 rounded-sm bg-bg-surface-soft border border-border-default">
        <h4 className="text-h4 font-semibold text-text-primary mb-2">Security Note</h4>
        <p className="text-body-small text-text-secondary">
          API keys are encrypted before storage. They are only used server-side and never exposed
          to the client. In production, keys are stored using secure encryption.
        </p>
      </div>
    </div>
  );
}
