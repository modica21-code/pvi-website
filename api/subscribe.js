import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://pinevalleyinvestments.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { EMAIL, FNAME, LNAME, MMERGE6 } = req.body;
  if (!EMAIL) return res.status(400).json({ error: 'Email is required' });

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const dc = apiKey.split('-')[1];
  const subscriberHash = crypto.createHash('md5').update(EMAIL.toLowerCase()).digest('hex');

  try {
    const mcRes = await fetch(
      'https://' + dc + '.api.mailchimp.com/3.0/lists/' + audienceId + '/members/' + subscriberHash,
      {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email_address: EMAIL,
          status_if_new: 'subscribed',
          status: 'subscribed',
          merge_fields: { FNAME: FNAME || '', LNAME: LNAME || '', MMERGE6: MMERGE6 || '' }
        })
      }
    );

    if (!mcRes.ok) {
      const err = await mcRes.json();
      return res.status(400).json({ error: err.detail || 'Mailchimp error' });
    }

    const tagRes = await fetch(
      'https://' + dc + '.api.mailchimp.com/3.0/lists/' + audienceId + '/members/' + subscriberHash + '/tags',
      {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: [{ name: 'Morning Core - Subscribed', status: 'active' }] })
      }
    );

    if (!tagRes.ok) {
      const tagErr = await tagRes.json();
      console.error('Tag assignment failed:', tagErr.detail || tagErr);
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
