'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const username = formData.get('username')
  const password = formData.get('password')

  const validUser = process.env.ADMIN_USERNAME || 'Admin'
  const validPass = process.env.ADMIN_PASSWORD || '2027isMine!'

  if (username === validUser && password === validPass) {
    const cookieStore = await cookies()
    cookieStore.set('admin_session', 'authenticated', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
    redirect('/admin')
  }
  return { error: 'Invalid credentials' }
}
export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/login')
}