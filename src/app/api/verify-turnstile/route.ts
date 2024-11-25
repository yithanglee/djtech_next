import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { token } = await request.json()

  const formData = new FormData()
  formData.append('secret', '0x4AAAAAAA0np3ri74xKNaGbY9TJrmRguD8')
  formData.append('response', token)

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
  const result = await fetch(url, {
    body: formData,
    method: 'POST',
  })

  const outcome = await result.json()
  if (outcome.success) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false }, { status: 400 })
  }
}