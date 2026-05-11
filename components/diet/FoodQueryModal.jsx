'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Loader2, HelpCircle } from 'lucide-react'


const QUICK_QUESTIONS = [
  'How much is the minimum/maximum I should eat?',
  'How do I prepare this?',
  'What are the best alternatives?',
  'Is this good for my goal?',
]


export function FoodQueryModal({ food, userProfile, planId, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendQuestion = async (question) => {
    if (!question.trim() || loading) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', content: question }])
    setLoading(true)

    try {
      const res = await fetch('/api/food/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          foodContext: `${food.name} - ${food.quantity}${food.unit}, ${food.calories} kcal, ${food.protein}g protein`,
          userProfile,
          planId,
        }),
      })
      const { answer, error } = await res.json()
      setMessages((m) => [...m, { role: 'assistant', content: answer || error || 'Unable to answer.' }])
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white sm:rounded-2xl shadow-xl flex flex-col max-h-[90vh] animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-[#E4E0D8]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HelpCircle className="w-4 h-4 text-[#2980B9]" />
              <p className="text-xs font-semibold text-[#2980B9] uppercase tracking-wide">Ask about this food</p>
            </div>
            <h3 className="font-display text-lg font-bold text-[#1C1C1A]">{food.name}</h3>
            <p className="text-xs text-[#9E9A94]">
              {food.quantity}{food.unit} · {food.calories} kcal · {food.protein}g protein
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F2F0EB] flex items-center justify-center hover:bg-[#E4E0D8] transition-colors ml-2 shrink-0">
            <X className="w-4 h-4 text-[#6B6760]" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
          {messages.length === 0 && (
            <div>
              <p className="text-sm text-[#9E9A94] mb-3">Quick questions:</p>
              <div className="space-y-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendQuestion(q)}
                    className="w-full text-left text-sm text-[#2D6A4F] bg-[#D8F3DC] hover:bg-[#52B788]/20 px-3 py-2.5 rounded-xl transition-colors font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#2D6A4F] text-white rounded-br-sm'
                    : 'bg-[#F2F0EB] text-[#1C1C1A] rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#F2F0EB] px-4 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2D6A4F]" />
                <span className="text-sm text-[#6B6760]">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#E4E0D8]">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask anything about this food..."
              className="input-field flex-1 text-sm py-2.5"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendQuestion(input)}
              disabled={loading}
            />
            <button
              onClick={() => sendQuestion(input)}
              disabled={loading || !input.trim()}
              className="w-10 h-10 bg-[#2D6A4F] rounded-xl flex items-center justify-center text-white hover:bg-[#245c43] disabled:opacity-50 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
