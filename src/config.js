/** Public website configuration. Never put credentials in a frontend project. */
export const siteConfig = {
  // preview | upcoming | open | closed
  registrationStatus: 'preview',
  links: {
    // Supply an HTTPS URL for each language, or leave it empty for the placeholder dialog.
    registration: { zh: '', en: '' },
    pastProblems: { zh: '', en: '' },
  },
};
