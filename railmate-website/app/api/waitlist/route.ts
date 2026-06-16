import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { email, plan } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const selectedPlan = plan === 'monthly' ? 'Monthly (৳99/month)' : 'Annual (৳799/year)'

    // Notify admin
    await resend.emails.send({
      from: 'RailMate Bangladesh <noreply@railmatebd.com>',
      to: process.env.CONTACT_TO_EMAIL || 'support@railmatebd.com',
      subject: '[RailMate] New Pro Waitlist Signup',
      text: `New Pro waitlist entry:\n\nEmail: ${email}\nPlan interest: ${selectedPlan}\n\nNotify this user when Pro launches.`,
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error: any) {
    console.error('[Waitlist] Error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

export async function GET() {
  return new Response('Method Not Allowed', { status: 405 })
}
