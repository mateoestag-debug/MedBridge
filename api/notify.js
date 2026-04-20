// api/notify.js — Vercel Serverless Function
// Envía alerta WhatsApp via Twilio cuando hay un caso URGENTE
//
// Variables de entorno requeridas en Vercel:
//   TWILIO_ACCOUNT_SID   → tu Account SID de Twilio
//   TWILIO_AUTH_TOKEN    → tu Auth Token de Twilio
//   TWILIO_WHATSAPP_FROM → "whatsapp:+14155238886" (sandbox) o tu número aprobado
//   DOCTOR_WHATSAPP_TO   → "whatsapp:+521XXXXXXXXXX" (número del médico)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { patientName, age, symptom, triage, promotor, caseId } = req.body;

  if (!patientName || !triage) {
    return res.status(400).json({ error: 'Faltan datos del caso' });
  }

  // Solo enviar alerta para casos urgentes y moderados
  if (triage === 'BAJO') {
    return res.status(200).json({ sent: false, reason: 'Bajo riesgo — sin alerta' });
  }

  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_WHATSAPP_FROM,
    DOCTOR_WHATSAPP_TO
  } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.warn('Twilio no configurado — omitiendo notificación');
    return res.status(200).json({ sent: false, reason: 'Twilio no configurado' });
  }

  const emoji  = triage === 'URGENTE' ? '🚨' : '⚠️';
  const label  = triage === 'URGENTE' ? 'URGENTE' : 'MODERADO';
  const action = triage === 'URGENTE'
    ? 'Requiere atención inmediata.'
    : 'Revisar en las próximas horas.';

  const message = `${emoji} *MedBridge — Caso ${label}*

Paciente: ${patientName}, ${age} años
Síntoma: ${symptom}
Promotor: ${promotor}
${action}

Ver caso completo en la app.`;

  try {
    const twilio = await import('twilio');
    const client = twilio.default(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    await client.messages.create({
      from: TWILIO_WHATSAPP_FROM,
      to:   DOCTOR_WHATSAPP_TO,
      body: message
    });

    return res.status(200).json({ sent: true });
  } catch (error) {
    console.error('Error Twilio:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
