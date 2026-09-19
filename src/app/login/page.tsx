'use client'
import { useState } from 'react'
import { login } from './actions'

export default function LoginPage() {
  const [error, setError] = useState('')

  async function handleSubmit(formData: FormData) {
    const res = await login(formData)
    if (res?.error) setError(res.error)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-slate-200">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-slate-900">CMS Login</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 font-semibold p-4 rounded-lg mb-6 text-sm border border-red-100 text-center">
            {error}
          </div>
        )}
        
        <form action={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
            <input 
              type="text" 
              name="username" 
              required 
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
              placeholder="Enter username"
            />
          </div>
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition shadow-sm">
            Sign In to Dashboard
          </button>
        </form>
      </div>
    </div>
  )
}