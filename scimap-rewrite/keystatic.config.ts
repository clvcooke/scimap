import { config, fields, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'cloud',
    project: 'scimap/scimap-rewrite'
  },
  singletons: {
    homepage: singleton({
      label: 'Homepage Content',
      path: 'src/content/homepage',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Title' }),
        description: fields.text({ label: 'Description', multiline: true }),
        cancelledTabTitle: fields.text({ label: 'Cancelled Tab Title' }),
        cancelledTabDescription: fields.text({ label: 'Cancelled Tab Description', multiline: true }),
        indirectTabTitle: fields.text({ label: 'Indirect Tab Title' }),
        indirectTabDescription: fields.text({ label: 'Indirect Tab Description', multiline: true }),
        fy2026TabTitle: fields.text({ label: 'FY2026 Tab Title' }),
        fy2026TabDescription: fields.text({ label: 'FY2026 Tab Description', multiline: true }),
      },
    }),
  },
});
