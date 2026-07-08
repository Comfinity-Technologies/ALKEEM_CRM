const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0";

interface SendMessageOptions {
  to: string;
  body: string;
}

/**
 * Sends a text message via WhatsApp Cloud API.
 */
export async function sendWhatsAppMessage({ to, body }: SendMessageOptions) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    console.error("WhatsApp API credentials are not configured.");
    throw new Error("WhatsApp API credentials missing.");
  }

  const url = `${WHATSAPP_API_URL}/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { 
        preview_url: false, 
        body 
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("WhatsApp API Error:", response.status, errorData);
    throw new Error(`WhatsApp API responded with ${response.status}`);
  }

  return response.json();
}

/**
 * Sends a pre-approved template message (for first-contact / opt-in).
 */
export async function sendWhatsAppTemplate({
  to,
  templateName,
  languageCode = "en",
  parameters = [],
}: {
  to: string;
  templateName: string;
  languageCode?: string;
  parameters?: Array<{ type: "text"; text: string }>;
}) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    throw new Error("WhatsApp API credentials missing.");
  }

  const url = `${WHATSAPP_API_URL}/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        components: parameters.length > 0
          ? [{ type: "body", parameters }]
          : undefined,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("WhatsApp Template Error:", response.status, errorData);
    throw new Error(`WhatsApp Template API responded with ${response.status}`);
  }

  return response.json();
}
