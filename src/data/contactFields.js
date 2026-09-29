// Campi "Dati azienda & referente" della Scheda Tecnica di Fabbisogno
export const CONTACT_FIELDS = [
  { key: 'company', label: 'Ragione sociale', placeholder: 'es. Studio Rossi S.r.l.', type: 'text', required: true, autoComplete: 'organization' },
  { key: 'vat', label: 'Partita IVA / Codice Fiscale', placeholder: 'es. 01234567890 o Codice Fiscale', type: 'text', required: false, autoComplete: 'off' },
  { key: 'name', label: 'Referente (nome e cognome)', placeholder: 'es. Mario Rossi', type: 'text', required: true, autoComplete: 'name' },
  { key: 'role', label: 'Ruolo del referente', placeholder: 'es. Titolare, Responsabile IT', type: 'text', required: false, autoComplete: 'organization-title' },
  { key: 'email', label: 'Email', placeholder: 'es. mario@studiorossi.it', type: 'email', required: false, autoComplete: 'email' },
  { key: 'phone', label: 'Telefono', placeholder: 'es. +39 340 1234567', type: 'tel', required: false, autoComplete: 'tel' }
];

export const REQUIRED_CONTACT_FIELDS = CONTACT_FIELDS.filter((f) => f.required).map((f) => f.key);

export function validateContacts(info) {
  const errors = {};
  REQUIRED_CONTACT_FIELDS.forEach((key) => {
    if (!String(info[key] || '').trim()) errors[key] = 'Campo obbligatorio per la scheda';
  });
  const vat = String(info.vat || '').replace(/\s/g, '').replace(/^IT/i, '');
  // Accepts either 11 digits (Italian VAT) or 16 alphanumeric characters (Codice Fiscale)
  if (vat && !/^\d{11}$/.test(vat) && !/^[A-Za-z0-9]{16}$/.test(vat)) {
    errors.vat = 'Inserisci 11 cifre (P.IVA) oppure 16 caratteri (Codice Fiscale)';
  }
  if (info.email && !/^\S+@\S+\.\S+$/.test(info.email)) errors.email = 'Controlla l\'indirizzo email';
  return errors;
}
