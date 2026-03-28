"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TriggerRule } from "@/lib/types";

interface Props {
  initialRules: TriggerRule[];
  userId: string;
}

const empty = { name: "", trigger_phrase: "", phone_number: "", message: "" };

export default function RulesManager({ initialRules, userId }: Props) {
  const [rules, setRules] = useState<TriggerRule[]>(initialRules);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  function field(key: keyof typeof empty) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function save() {
    if (!form.name || !form.trigger_phrase || !form.phone_number || !form.message) {
      setError("All fields are required.");
      return;
    }
    setSaving(true);
    setError("");

    if (editId) {
      const { data, error: err } = await supabase
        .from("trigger_rules")
        .update({ ...form })
        .eq("id", editId)
        .select()
        .single();
      if (err) { setError(err.message); setSaving(false); return; }
      setRules((r) => r.map((x) => (x.id === editId ? (data as TriggerRule) : x)));
      setEditId(null);
    } else {
      const { data, error: err } = await supabase
        .from("trigger_rules")
        .insert({ ...form, user_id: userId })
        .select()
        .single();
      if (err) { setError(err.message); setSaving(false); return; }
      setRules((r) => [data as TriggerRule, ...r]);
    }

    setForm(empty);
    setSaving(false);
  }

  async function remove(id: string) {
    await supabase.from("trigger_rules").delete().eq("id", id);
    setRules((r) => r.filter((x) => x.id !== id));
  }

  function startEdit(rule: TriggerRule) {
    setEditId(rule.id);
    setForm({
      name: rule.name,
      trigger_phrase: rule.trigger_phrase,
      phone_number: rule.phone_number,
      message: rule.message,
    });
  }

  function cancel() {
    setEditId(null);
    setForm(empty);
    setError("");
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Form */}
      <div className="border border-zinc-100 rounded-xl p-6 flex flex-col gap-4">
        <h2 className="text-sm font-medium text-zinc-900">
          {editId ? "Edit rule" : "New rule"}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 uppercase tracking-wide">Label</label>
            <Input placeholder="e.g. Call mom" value={form.name} onChange={field("name")} className="h-9 text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 uppercase tracking-wide">Trigger phrase</label>
            <Input placeholder="e.g. pizza" value={form.trigger_phrase} onChange={field("trigger_phrase")} className="h-9 text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 uppercase tracking-wide">Phone number to call</label>
            <Input placeholder="e.g. +1 (555) 000-0000" value={form.phone_number} onChange={field("phone_number")} className="h-9 text-sm" />
          </div>
          <div className="flex flex-col gap-1.5 col-span-2">
            <label className="text-xs text-zinc-400 uppercase tracking-wide">Message the AI delivers</label>
            <textarea
              placeholder="e.g. Andrew is in danger, please call authorities."
              value={form.message}
              onChange={field("message")}
              rows={2}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-400 resize-none transition-colors"
            />
          </div>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2">
          <Button onClick={save} disabled={saving} className="h-9 text-sm">
            {saving ? "Saving..." : editId ? "Update" : "Add rule"}
          </Button>
          {editId && (
            <Button onClick={cancel} variant="outline" className="h-9 text-sm">Cancel</Button>
          )}
        </div>
      </div>

      {/* Rules list */}
      {rules.length === 0 ? (
        <p className="text-sm text-zinc-400">No rules yet. Add one above.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rules.map((rule) => (
            <div key={rule.id} className="border border-zinc-100 rounded-xl px-5 py-4 flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-900">{rule.name}</span>
                  <span className="text-xs bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full font-mono">
                    &ldquo;{rule.trigger_phrase}&rdquo;
                  </span>
                </div>
                <p className="text-xs text-zinc-500 truncate">→ {rule.phone_number}</p>
                <p className="text-xs text-zinc-400 italic truncate">&ldquo;{rule.message}&rdquo;</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(rule)} className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">Edit</button>
                <button onClick={() => remove(rule.id)} className="text-xs text-zinc-400 hover:text-red-500 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
