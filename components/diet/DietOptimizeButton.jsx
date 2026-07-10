'use client'

import { useState } from 'react'
import { MessageSquarePlus, X, Send, Loader2, Sparkles } from 'lucide-react'

const EXAMPLE_QUESTIONS = [
  'Today I had a cheat meal (biryani). How should I adjust tomorrow?',
  'I had grilled chicken for lunch — is that OK with my plan?',
  'Can you suggest lighter dinners for the coming days?',
  'I skipped breakfast today. What should I do now?',
]

export function DietOptimizeButton({ plan, userProfile, planId }) {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    if (!question.trim() || loading) return
    setLoading(true)
    setResponse('')

    try {
      const res = await fetch('/api/diet/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, currentPlan: plan, userProfile, planId }),
      })
      const { advice, error } = await res.json()
      setResponse(advice || error || 'Unable to generate advice at this time.')
    } catch {
      setResponse('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-4 z-40 w-14 h-14 bg-[#2D6A4F] rounded-2xl shadow-xl flex items-center justify-center hover:bg-[#245c43] hover:shadow-2xl active:scale-95 transition-all duration-200"
        title="Ask diet question or optimize plan"
      >
        <MessageSquarePlus className="w-6 h-6 text-white" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl shadow-xl flex flex-col max-h-[90vh] animate-slide-up">
            <div className="flex items-start justify-between p-5 border-b border-[#E4E0D8]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#D4A853]" />
                  <p className="text-xs font-semibold text-[#D4A853] uppercase tracking-wide">AI Plan Optimizer</p>
                </div>
                <h3 className="font-display text-xl font-bold text-[#1C1C1A]">Ask your nutritionist</h3>
                <p className="text-sm text-[#6B6760]">Any deviation or question? Get instant advice.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F2F0EB] flex items-center justify-center hover:bg-[#E4E0D8] transition-colors ml-2 shrink-0"
              >
                <X className="w-4 h-4 text-[#6B6760]" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto">
              {!response && !loading && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-[#9E9A94] mb-2 uppercase tracking-wide">Examples</p>
                  <div className="space-y-2">
                    {EXAMPLE_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuestion(q)}
                        className="w-full text-left text-sm text-[#2D6A4F] bg-[#D8F3DC] hover:bg-[#52B788]/20 px-3 py-2.5 rounded-xl transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex items-center gap-3 p-4 bg-[#F2F0EB] rounded-xl">
                  <Loader2 className="w-5 h-5 animate-spin text-[#2D6A4F] shrink-0" />
                  <p className="text-sm text-[#6B6760]">Analyzing your plan...</p>
                </div>
              )}

              {response && (
                <div className="p-4 bg-[#D8F3DC] border border-[#52B788]/30 rounded-xl animate-scale-in">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#2D6A4F]" />
                    <p className="text-xs font-semibold text-[#2D6A4F] uppercase tracking-wide">Nutritionist Advice</p>
                  </div>
                  <p className="text-sm text-[#1C1C1A] leading-relaxed whitespace-pre-line">{response}</p>
                  <button
                    onClick={() => { setResponse(''); setQuestion('') }}
                    className="mt-4 text-xs text-[#2D6A4F] font-medium hover:underline"
                  >
                    Ask another question →
                  </button>
                </div>
              )}
            </div>

            {!response && (
              <div className="p-4 border-t border-[#E4E0D8]">
                <div className="flex gap-2 items-end">
                  <textarea
                    placeholder="e.g. I had a cheat meal today, how do I adjust the rest of the week?"
                    className="input-field flex-1 text-sm resize-none"
                    rows={3}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleAsk()
                      }
                    }}
                  />
                  <button
                    onClick={handleAsk}
                    disabled={loading || !question.trim()}
                    className="w-10 h-10 bg-[#2D6A4F] rounded-xl flex items-center justify-center text-white hover:bg-[#245c43] disabled:opacity-50 transition-colors shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-[#9E9A94] mt-2">Press Enter to submit · Shift+Enter for new line</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
