// Netlify runs this function after every verified form submission ("submission-created" event).
// For reservation requests that include an email address, it sends the guest a short confirmation
// in the language they used on the site, through Resend (https://resend.com).
//
// It does nothing until these environment variables are set in Netlify:
//   RESEND_API_KEY        API key from Resend
//   CONFIRMATION_FROM     sender, e.g. "Gostilna Pri Brvi <rezervacije@your-domain.si>" (domain verified in Resend)
//   CONFIRMATION_REPLY_TO optional reply-to address

const PHONE = "+386 (0)5 000 00 00";

const TEXT = {
  sl: {
    locale: "sl-SI",
    subject: "Prejeli smo vaše povpraševanje – Gostilna Pri Brvi",
    body: (d) =>
      `Pozdravljeni, ${d.name}!\n\nHvala za povpraševanje za mizo:\n${d.when} ob ${d.time}, število oseb: ${d.guests}\n\n` +
      `To še ni potrditev. Poklicali vas bomo in mizo potrdili še isti dan.\nČe želite kaj spremeniti, nas pokličite na ${PHONE}.\n\nGostilna Pri Brvi`
  },
  en: {
    locale: "en-GB",
    subject: "We've received your request – Gostilna Pri Brvi",
    body: (d) =>
      `Hello ${d.name},\n\nThank you for your table request:\n${d.when} at ${d.time}, guests: ${d.guests}\n\n` +
      `This is not a confirmation yet. We'll call you to confirm your table the same day.\nTo change anything, call us on ${PHONE}.\n\nGostilna Pri Brvi`
  },
  it: {
    locale: "it-IT",
    subject: "Abbiamo ricevuto la tua richiesta – Gostilna Pri Brvi",
    body: (d) =>
      `Ciao ${d.name},\n\ngrazie per la richiesta di prenotazione:\n${d.when} alle ${d.time}, persone: ${d.guests}\n\n` +
      `Non è ancora una conferma. Ti chiameremo per confermare il tavolo in giornata.\nPer modifiche chiamaci al ${PHONE}.\n\nGostilna Pri Brvi`
  }
};

exports.handler = async (event) => {
  const { payload } = JSON.parse(event.body || "{}");
  const data = (payload && payload.data) || {};
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONFIRMATION_FROM;
  if (!payload || payload.form_name !== "reservation" || !data.email || !key || !from) {
    return { statusCode: 200, body: "skipped" };
  }

  const t = TEXT[data.language] || TEXT.sl;
  const when = data.date
    ? new Intl.DateTimeFormat(t.locale, { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${data.date}T12:00:00`))
    : "";
  const guests = data.guests === "9+" ? "9+" : data.guests;
  const body = {
    from,
    to: [data.email],
    subject: t.subject,
    text: t.body({ name: data.name || "", when, time: data.time || "", guests: guests || "" })
  };
  if (process.env.CONFIRMATION_REPLY_TO) body.reply_to = process.env.CONFIRMATION_REPLY_TO;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) console.error("Confirmation email failed:", res.status, await res.text());
  return { statusCode: 200, body: res.ok ? "sent" : "failed" };
};
