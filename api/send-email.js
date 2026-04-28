export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, nombre, email, empresa, marca, servicio, presupuesto, tipo, canales, descripcion } = req.body;

  const isCollab = type === 'colaboracion';
  const subject = isCollab
    ? `Colaboración: ${tipo} — ${marca}`
    : `Cotización: ${servicio}`;

  const html = isCollab ? `
    <h2 style="color:#c4a25a;font-family:sans-serif">Nueva solicitud de colaboración</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
      <tr><td style="padding:8px;color:#888;width:140px">Nombre</td><td style="padding:8px"><strong>${nombre}</strong></td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#888">Marca / Empresa</td><td style="padding:8px">${marca||'—'}</td></tr>
      <tr><td style="padding:8px;color:#888">Correo</td><td style="padding:8px">${email}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#888">Tipo colaboración</td><td style="padding:8px">${tipo||'—'}</td></tr>
      <tr><td style="padding:8px;color:#888">Canales</td><td style="padding:8px">${canales||'—'}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#888">Presupuesto</td><td style="padding:8px">${presupuesto||'A negociar'}</td></tr>
      <tr><td style="padding:8px;color:#888">Descripción</td><td style="padding:8px">${descripcion||'—'}</td></tr>
    </table>
  ` : `
    <h2 style="color:#c4a25a;font-family:sans-serif">Nueva cotización recibida</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
      <tr><td style="padding:8px;color:#888;width:140px">Nombre</td><td style="padding:8px"><strong>${nombre}</strong></td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#888">Empresa</td><td style="padding:8px">${empresa||'—'}</td></tr>
      <tr><td style="padding:8px;color:#888">Correo</td><td style="padding:8px">${email}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#888">Servicio</td><td style="padding:8px">${servicio||'—'}</td></tr>
      <tr><td style="padding:8px;color:#888">Presupuesto</td><td style="padding:8px">${presupuesto||'A definir'}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#888">Descripción</td><td style="padding:8px">${descripcion||'—'}</td></tr>
    </table>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Alexander Aya <noreply@alexanderaya.com>',
        to: 'alexanderayaaponte@gmail.com',
        subject: subject,
        html: html
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error Resend');
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}