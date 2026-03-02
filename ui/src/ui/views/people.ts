/**
 * People view — DEPRECATED (view removed, types kept for backward compatibility)
 */

export type Person = {
  id: string;
  name: string;
  emoji?: string;
  company?: string;
  role?: string;
  tags: string[];
  email?: string;
  phone?: string;
  birthday?: string;
  lastContact?: string;
  notes?: string;
  projects?: string[];
};
