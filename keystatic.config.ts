import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  singletons: {
    about: singleton({
      label: 'About Page',
      path: 'src/content/about',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Title' }),
        mission: fields.document({ label: 'Mission', formatting: true, links: true }),
        team: fields.document({ label: 'The Team', formatting: true, links: true }),
        currentImpact: fields.document({ label: 'Current Impact', formatting: true, links: true }),
        futureImpact: fields.document({ label: 'Future Impact', formatting: true, links: true }),
        economicImpact: fields.document({ label: 'Economic Impact', formatting: true, links: true }),
        fy26Budget: fields.document({ label: 'FY2026 Budget', formatting: true, links: true }),
        sourceCode: fields.document({ label: 'Source Code', formatting: true, links: true }),
        contactUs: fields.document({ label: 'Contact Us', formatting: true, links: true }),
        updates: fields.document({ label: 'Updates', formatting: true, links: true }),
      },
    }),
    advocacy: singleton({
      label: 'Advocacy Page',
      path: 'src/content/advocacy',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Title' }),
        headerText: fields.document({ label: 'Header Text', formatting: true, links: true }),
        contactCardTitle: fields.text({ label: 'Contact Card Title' }),
        contactCardText: fields.document({ label: 'Contact Card Text', formatting: true, links: true }),
        contactCardList: fields.array(
          fields.document({ label: 'List Item', formatting: true, links: true }),
          {
            label: 'Contact Card List Items',
            itemLabel: _props => 'List Item',
          }
        ),
        shareCardTitle: fields.text({ label: 'Share Card Title' }),
        shareCardText: fields.document({ label: 'Share Card Text', formatting: true, links: true }),
      },
    }),
    learnMore: singleton({
      label: 'Learn More Page',
      path: 'src/content/learnMore',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Title' }),
        sections: fields.array(
          fields.object({
            title: fields.text({ label: 'Section Title' }),
            content: fields.document({ label: 'Content', formatting: true, links: true }),
          }),
          {
            label: 'Accordion Sections',
            itemLabel: props => props.fields.title.value,
          }
        ),
      },
    }),
    impactStatement: singleton({
      label: 'Impact Statement (Welcome Modal)',
      path: 'src/content/impactStatement',
      format: { data: 'json' },
      schema: {
        modalTitle: fields.text({ label: 'Modal Title' }),
        part1: fields.document({ label: 'Part 1 Content', formatting: true, links: true }),
        part2: fields.document({ label: 'Part 2 Content', formatting: true, links: true }),
        fy26Content: fields.document({ label: 'FY26 Budget Content', formatting: true, links: true }),
        consentLabel: fields.text({ label: 'Consent Checkbox Label', multiline: true }),
      },
    }),
    quiz: singleton({
      label: 'Quiz',
      path: 'src/content/quiz',
      format: { data: 'json' },
      schema: {
        overviewTitle: fields.document({ label: 'Overview Title', formatting: true, links: true }),
        overviewQuestion: fields.document({ label: 'Overview Question', formatting: true, links: true }),
        cancelledGrantsText1: fields.document({ label: 'Cancelled Grants Text 1', formatting: true, links: true }),
        cancelledGrantsText2: fields.document({ label: 'Cancelled Grants Text 2', formatting: true, links: true }),
        cancelledGrantsQuestion: fields.text({ label: 'Cancelled Grants Question', multiline: true }),
        indirectCostsText1: fields.document({ label: 'Indirect Costs Text 1', formatting: true, links: true }),
        indirectCostsText2: fields.document({ label: 'Indirect Costs Text 2', formatting: true, links: true }),
        indirectCostsQuestion: fields.text({ label: 'Indirect Costs Question', multiline: true }),
        resultsText: fields.document({ label: 'Results Final Question', formatting: true, links: true }),
      },
    }),
  },
  collections: {
    news: collection({
      label: 'News Items',
      path: 'src/content/news/*',
      slugField: 'title',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Title' }),
        date: fields.text({ label: 'Date' }),
        url: fields.text({ label: 'URL' }),
        isOngoing: fields.checkbox({ label: 'Is Ongoing?' }),
      },
    }),
  },
});