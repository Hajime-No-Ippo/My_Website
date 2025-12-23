import nodemailer from "nodemailer"

export const runtime = "nodejs"

type ContactPayload = {
  name: string
  email: string
  message: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ContactPayload>
    const name = body.name?.toString().trim() ?? ""
    const email = body.email?.toString().trim() ?? ""
    const message = body.message?.toString().trim() ?? ""

    if (!name || !email || !message) {
      return Response.json({ ok: false, error: "Missing fields" }, { status: 400 })
    }

    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || 0)
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const to = process.env.CONTACT_TO || "shuaibtcm@gmail.com"
    const from = process.env.CONTACT_FROM || user || "no-reply@example.com"

    if (!host || !port || !user || !pass) {
      return Response.json({ ok: false, error: "Email not configured" }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    await transporter.sendMail({
      to,
      from,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    })

    return Response.json({ ok: true })
  } catch (error) {
    console.error("Contact form error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return Response.json({ ok: false, error: message }, { status: 500 })
  }
}
