import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'; // Default Twilio sandbox or your approved business number

const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
  try {
    const { clientName, phone, title, id, amount, status, payLink } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Client phone number is missing' }, { status: 400 });
    }

    // Format phone number to E.164 standard required by WhatsApp API
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    const messageBody = 
      `🏛️ *VELOLEDGER INSTITUTIONAL SETTLEMENT NOTICE*\n\n` +
      `Dear *${clientName}*,\n\n` +
      `This is a priority settlement dispatch for milestone *"${title}"* reference *(${id})*.\n\n` +
      `• *Statement Balance:* $${Number(amount).toLocaleString()}.00\n` +
      `• *Current Standing:* ${status}\n\n` +
      `To secure continuous enterprise velocity and finalize this release, please authorize payment immediately via our secure gateway:\n` +
      `🔗 ${payLink}\n\n` +
      `_Secure Escrow Handled via VeloLedger Infrastructure_`;

    const response = await client.messages.create({
      from: twilioWhatsAppNumber,
      to: `whatsapp:${formattedPhone}`,
      body: messageBody,
    });

    return NextResponse.json({ success: true, sid: response.sid });
  } catch (error: any) {
    console.error('Twilio WhatsApp Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to dispatch message' }, { status: 500 });
  }
}
