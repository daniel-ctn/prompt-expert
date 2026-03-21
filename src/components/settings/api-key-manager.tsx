'use client';

import { useState } from 'react';
import { Check, Eye, EyeOff, Key, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { saveApiKey, deleteApiKey } from '@/lib/actions/api-keys';
import { toast } from 'sonner';

const PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    placeholder: 'sk-...',
    description: 'GPT-4.1, GPT-4.1 Mini',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    placeholder: 'sk-ant-...',
    description: 'Claude Opus 4-6, Claude Sonnet 4-6',
  },
  {
    id: 'google',
    name: 'Google AI',
    placeholder: 'AIza...',
    description: 'Gemini 2.5 Pro, Gemini 2.5 Flash',
  },
] as const;

interface Props {
  savedProviders: string[];
}

export function ApiKeyManager({ savedProviders }: Props) {
  const [saved, setSaved] = useState<Set<string>>(new Set(savedProviders));
  const [values, setValues] = useState<Record<string, string>>({});
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState<string | null>(null);

  const handleSave = async (providerId: string) => {
    const key = values[providerId];
    if (!key?.trim()) return;

    setSaving(providerId);
    try {
      await saveApiKey(providerId, key.trim());
      setSaved((prev) => new Set([...prev, providerId]));
      setValues((prev) => ({ ...prev, [providerId]: '' }));
      toast.success(
        `${PROVIDERS.find((p) => p.id === providerId)?.name} key saved`,
      );
    } catch {
      toast.error('Failed to save API key');
    }
    setSaving(null);
  };

  const handleDelete = async (providerId: string) => {
    try {
      await deleteApiKey(providerId);
      setSaved((prev) => {
        const next = new Set(prev);
        next.delete(providerId);
        return next;
      });
      toast.success('API key removed');
    } catch {
      toast.error('Failed to remove API key');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Keys
        </CardTitle>
        <CardDescription>
          Add your own API keys to use instead of the shared server keys. Keys
          are encrypted at rest.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {PROVIDERS.map((provider) => (
          <div key={provider.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor={`key-${provider.id}`}
                className="text-sm font-medium"
              >
                {provider.name}
                <span className="text-muted-foreground ml-2 text-xs font-normal">
                  {provider.description}
                </span>
              </Label>
              {saved.has(provider.id) && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Check className="h-3 w-3" />
                  Configured
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id={`key-${provider.id}`}
                  type={visible.has(provider.id) ? 'text' : 'password'}
                  value={values[provider.id] ?? ''}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [provider.id]: e.target.value,
                    }))
                  }
                  placeholder={
                    saved.has(provider.id)
                      ? '••••••••  (replace existing)'
                      : provider.placeholder
                  }
                  className="pr-10 font-mono text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 h-full w-10"
                  onClick={() =>
                    setVisible((prev) => {
                      const next = new Set(prev);
                      next.has(provider.id)
                        ? next.delete(provider.id)
                        : next.add(provider.id);
                      return next;
                    })
                  }
                >
                  {visible.has(provider.id) ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button
                onClick={() => handleSave(provider.id)}
                disabled={
                  !values[provider.id]?.trim() || saving === provider.id
                }
                size="sm"
              >
                {saving === provider.id ? 'Saving...' : 'Save'}
              </Button>
              {saved.has(provider.id) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => handleDelete(provider.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
