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

const empty = { name: "", trigger_phrase: "", phone_number: "", message: "", include_location: false };

export default function RulesManager({ initialRules, userId }: Props) {
  const [rules, setRules] = useState<TriggerRule[]>(initialRules);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  function field(key: keyof Omit<typeof empty, "include_location">) {
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
        .from("trigger_rules").update({ ...form }).eq("id", editId).select().single();
      if (err) { setError(err.message); setSaving(false); return; }
      setRules((r) => r.map((x) => (x.id === editId ? (data as TriggerRule) : x)));
      setEditId(null);
    } else {
      const { data, error: err } = await supabase
        .from("trigger_rules").insert({ ...form, user_id: userId }).select().single();
      if (err) { setError(err.message); setSaving(false); return; }
      setRules((r) => [data as TriggerRule, ...r]);
    }

    setForm(empty);
    setSaving(false);
    setShowForm(false);
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
      include_location: rule.include_location ?? false,
    });
    setShowForm(true);
  }

  function cancel() {
    setEditId(null);
    setForm(empty);
    setError("");
    setShowForm(false);
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 flex flex-col gap-4">
          <p className="text-sm font-medium text-zinc-900">{editId ? "Edit trigger" : "New trigger"}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 font-medium">Label</label>
              <Input placeholder="e.g. Call mom" value={form.name} onChange={field("name")} className="h-9 text-sm bg-white" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 font-medium">Trigger phrase</label>
              <Input placeholder="e.g. pizza" value={form.trigger_phrase} onChange={field("trigger_phrase")} className="h-9 text-sm bg-white" />
            </div>
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-xs text-zinc-400 font-medium">Phone number to call</label>
              <Input placeholder="+1 (555) 000-0000" value={form.phone_number} onChange={field("phone_number")} className="h-9 text-sm bg-white" />
            </div>
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-xs text-zinc-400 font-medium">Message the AI delivers</label>
              <textarea
                placeholder="e.g. Andrew is in danger, please call authorities."
                value={form.message}
                onChange={field("message")}
                rows={2}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-400 resize-none transition-colors"
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
                <input
                  type="checkbox"
                  checked={form.include_location ?? false}
                  onChange={(e) => setForm((f) => ({ ...f, include_location: e.target.checked }))}
                  className="w-4 h-4 rounded border-zinc-300 accent-zinc-900 cursor-pointer"
                />
                <span className="text-sm text-zinc-700">Append my location to the message</span>
              </label>
              {form.include_location && (
                <p className="text-xs text-zinc-400 mt-1.5 ml-6">Your street address will be looked up and added when the call fires.</p>
              )}
            </div>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={save} disabled={saving} className="h-8 text-xs px-4">
              {saving ? "Saving..." : editId ? "Update" : "Save trigger"}
            </Button>
            <Button onClick={cancel} variant="outline" className="h-8 text-xs px-4">Cancel</Button>
          </div>
        </div>
      )}

      {/* Rules list */}
      {rules.length === 0 && !showForm ? (
        <div className="rounded-xl border border-dashed border-zinc-200 px-6 py-12 flex flex-col items-center gap-3 text-center">
          <span className="text-2xl">⚡</span>
          <p className="text-sm font-medium text-zinc-700">No triggers yet</p>
          <p className="text-xs text-zinc-400 max-w-xs">Create a trigger to map a spoken phrase to a phone call. When heard, the AI agent fires automatically.</p>
          <Button onClick={() => setShowForm(true)} className="h-8 text-xs px-4 mt-1">Add your first trigger</Button>
        </div>
      ) : (
        <>
          {!showForm && (
            <div className="flex justify-end">
              <Button onClick={() => setShowForm(true)} className="h-8 text-xs px-4">+ New trigger</Button>
            </div>
          )}
          <div className="flex flex-col gap-2">
            {rules.map((rule) => (
              <div key={rule.id} className="group rounded-xl border border-zinc-100 bg-white px-5 py-4 flex items-start justify-between gap-4 hover:border-zinc-200 transition-colors">
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-zinc-900">{rule.name}</span>
                    <span className="text-xs font-mono bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md">
                      &ldquo;{rule.trigger_phrase}&rdquo;
                    </span>
                    {rule.include_location && (
                      <span className="text-xs bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-md">📍 location</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">Calls <span className="font-medium text-zinc-700">{rule.phone_number}</span></p>
                  <p className="text-xs text-zinc-400 italic truncate max-w-md">&ldquo;{rule.message}&rdquo;</p>
                </div>
                <div className="flex gap-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(rule)} className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">Edit</button>
                  <button onClick={() => remove(rule.id)} className="text-xs text-zinc-400 hover:text-red-500 transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
