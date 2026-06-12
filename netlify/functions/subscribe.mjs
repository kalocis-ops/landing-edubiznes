// Zapis na webinar — pośrednik między formularzem a GetResponse.
// Klucz API żyje w zmiennych środowiskowych Netlify, nigdy w kodzie strony.

const CAMPAIGN_ID = 'fHPfW';     // lista "Webinar Edubiznes" — każdy zapis
const VIP_CAMPAIGN_ID = 'fHuoS'; // lista "Edubiznes VIP" — dodatkowo przy zaznaczonym checkboksie

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let data;
  try {
    data = await req.json();
  } catch {
    return Response.json({ error: 'invalid request' }, { status: 400 });
  }

  const { name, email, vip } = data;
  if (!email || !/.+@.+\..+/.test(email)) {
    return Response.json({ error: 'invalid email' }, { status: 400 });
  }

  const cleanEmail = String(email).trim().slice(0, 128);
  const cleanName = String(name || '').trim().slice(0, 128) || undefined;

  const addToList = (campaignId) =>
    fetch('https://api.getresponse.com/v3/contacts', {
      method: 'POST',
      headers: {
        'X-Auth-Token': `api-key ${process.env.GETRESPONSE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: cleanEmail,
        name: cleanName,
        campaign: { campaignId },
      }),
    });

  const res = await addToList(CAMPAIGN_ID);

  // VIP: dodatkowo na listę "Edubiznes VIP" (best-effort — nie blokuje zapisu)
  if (vip) {
    try {
      const vipRes = await addToList(VIP_CAMPAIGN_ID);
      if (vipRes.status !== 202 && vipRes.status !== 409) {
        console.error('VIP list error:', vipRes.status, await vipRes.text());
      }
    } catch (e) {
      console.error('VIP list error:', e);
    }
  }

  // 202 = przyjęto do przetworzenia; 409 = kontakt już na liście — też sukces
  if (res.status === 202 || res.status === 409) {
    return Response.json({ ok: true });
  }

  console.error('GetResponse error:', res.status, await res.text());
  return Response.json({ error: 'subscription failed' }, { status: 502 });
};
