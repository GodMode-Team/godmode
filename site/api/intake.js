/**
 * POST /api/intake
 *
 * Receives AI Audit intake form submissions from /audit-intake.
 * Creates/updates a contact in GHL with the ai-audit tag and all form data.
 * Sends the admin a notification email via GHL.
 *
 * Env vars required:
 *   GHL_PIT_TOKEN     — GHL Private Integration Token (already in Vercel)
 *   GHL_LOCATION_ID   — GHL Location ID for the GodMode sub-account
 */

const GHL_API = 'https://services.leadconnectorhq.com';

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.GHL_PIT_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!token || !locationId) {
    console.error('[intake] Missing GHL_PIT_TOKEN or GHL_LOCATION_ID');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const {
    first_name,
    last_name,
    email,
    phone,
    business_name,
    business_type,
    team_size,
    revenue_range,
    biggest_pain,
    current_tools,
    ai_experience,
    time_tasks,
    goals,
  } = body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Version: '2021-07-28',
  };

  // Build custom fields note with all intake data
  const intakeNote = [
    `=== AI AUDIT INTAKE FORM ===`,
    `Submitted: ${new Date().toISOString()}`,
    ``,
    `Business: ${business_name || 'N/A'}`,
    `Type: ${business_type || 'N/A'}`,
    `Team Size: ${team_size || 'N/A'}`,
    `Revenue Range: ${revenue_range || 'N/A'}`,
    ``,
    `Biggest Pain: ${biggest_pain || 'N/A'}`,
    `Current Tools: ${current_tools || 'N/A'}`,
    `AI Experience: ${ai_experience || 'N/A'}`,
    `Time Drains: ${time_tasks || 'N/A'}`,
    `Goals: ${goals || 'N/A'}`,
  ].join('\n');

  try {
    // Step 1: Upsert contact in GHL
    const contactPayload = {
      locationId,
      firstName: first_name || '',
      lastName: last_name || '',
      email,
      phone: phone || '',
      tags: ['ai-audit', 'intake-submitted'],
      customFields: [],
    };

    const upsertRes = await fetch(`${GHL_API}/contacts/upsert`, {
      method: 'POST',
      headers,
      body: JSON.stringify(contactPayload),
    });

    const upsertData = await upsertRes.json();

    if (!upsertRes.ok) {
      console.error('[intake] GHL upsert failed:', upsertData);
      return res.status(502).json({ error: 'Failed to create contact', details: upsertData });
    }

    const contactId = upsertData?.contact?.id;

    // Step 2: Add intake note to contact
    if (contactId) {
      await fetch(`${GHL_API}/contacts/${contactId}/notes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ body: intakeNote, userId: contactId }),
      });
    }

    console.log(`[intake] Contact upserted: ${contactId} — ${email}`);
    return res.status(200).json({ success: true, contactId });

  } catch (err) {
    console.error('[intake] Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
