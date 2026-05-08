"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supportApi, SupportTicket, TicketCategory, TicketPriority } from "@/services/support";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTicket: SupportTicket) => void;
}

export function CreateTicketModal({ isOpen, onClose, onSuccess }: CreateTicketModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState<TicketCategory>("order");
  const [newPriority, setNewPriority] = useState<TicketPriority>("medium");
  const [newMessage, setNewMessage] = useState("");

  if (!isOpen) return null;

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) {
      toast.error("Subject and message are required.");
      return;
    }

    setIsCreating(true);
    try {
      const newTicket = await supportApi.createTicket(newSubject, newCategory, newPriority, newMessage);
      toast.success("Ticket created successfully.");
      
      // Pass the new ticket back to the parent page and reset state
      onSuccess(newTicket);
      setNewSubject("");
      setNewMessage("");
      setNewCategory("order");
      setNewPriority("medium");
    } catch {
      toast.error("Failed to create ticket.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity" 
        onClick={() => !isCreating && onClose()} 
        aria-hidden="true"
      />
      
      <div className="relative w-full max-w-lg animate-in zoom-in-95 fade-in rounded-3xl bg-white p-6 shadow-2xl overflow-hidden">
        <div className="absolute top-4 right-4">
          <Button aria-label="Close ticket modal" variant="ghost" size="icon" disabled={isCreating} onClick={onClose} className="h-8 w-8 rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <h2 className="text-xl font-black text-zinc-900 mb-1">Create New Ticket</h2>
        <p className="text-xs font-medium text-zinc-500 mb-6">Describe your issue and we&apos;ll get back to you ASAP.</p>

        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Subject</label>
            <Input 
              value={newSubject} 
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="e.g. Missing payout for last week" 
              className="h-11 rounded-xl bg-zinc-50 text-sm font-medium shadow-inner focus-visible:ring-zinc-900"
              disabled={isCreating}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Category</label>
              <select 
                aria-label="Ticket Category"
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value as TicketCategory)} 
                className="h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold text-zinc-700 shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 cursor-pointer"
                disabled={isCreating}
              >
                <option value="order">Order Issue</option>
                <option value="payout">Payout Issue</option>
                <option value="inventory">Product / Inventory</option>
                <option value="tech">Technical Issue</option>
                <option value="account">Account Issue</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Priority</label>
              <select 
                aria-label="Ticket Priority"
                value={newPriority} 
                onChange={(e) => setNewPriority(e.target.value as TicketPriority)} 
                className="h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold text-zinc-700 shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 cursor-pointer"
                disabled={isCreating}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Message</label>
            <textarea 
              aria-label="Support ticket message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Provide as much detail as possible..." 
              className="min-h-30 w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm font-medium shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
              disabled={isCreating}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isCreating || !newSubject.trim() || !newMessage.trim()} className="h-11 w-full rounded-xl bg-zinc-900 text-sm font-black text-white shadow-md hover:bg-zinc-800 disabled:opacity-50">
              {isCreating ? "Submitting..." : "Submit Ticket"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
