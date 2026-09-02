export type JourneyChapter = {
  company: string
  role: string
  location: string
  start: string
  end: string
  summary: string
  highlights: string[]
}

// Sourced directly from Brent's resume -- company names, roles, locations,
// and dates are factual and should not be altered without updating the
// source resume first. Highlights are condensed/narrative-ized versions of
// the resume bullets, not verbatim copies.
export const journey: JourneyChapter[] = [
  {
    company: 'Blueprint Income',
    role: 'Senior Software Engineer',
    location: 'Remote (Boston, MA)',
    start: 'March 2022',
    end: 'June 2025',
    summary:
      'Built Storybook from the ground up as the shared source of truth between engineering and design, and grew into the technical lead for the component library that came out of it.',
    highlights: [
      'Established component APIs, prop interfaces, and documentation standards adopted across the entire front-end codebase.',
      'Architected a scalable React and TypeScript component library, setting the technical standard for testing and maintainability at scale.',
      'Drove WCAG-compliant accessibility patterns and semantic HTML in close partnership with UX.',
      'Led technical design reviews and code reviews, mentoring engineers on component API quality and composability.',
      'Set up CI/CD pipelines in GitHub Actions with automated testing and feature-flagged release workflows.',
    ],
  },
  {
    company: 'Hillrom',
    role: 'Software Engineer',
    location: 'Cary, NC',
    start: 'December 2018',
    end: 'March 2022',
    summary:
      'Designed and distributed reusable front-end SDKs and component libraries consumed across multiple engineering teams in a large enterprise healthcare organization.',
    highlights: [
      'Published shared component APIs and CSS architecture patterns via Azure Artifacts and NPM.',
      'Built responsive, accessible, cross-browser front-end applications for enterprise healthcare workflows.',
      'Partnered closely with UI/UX through design-to-development handoff, catching edge cases early.',
      'Profiled and optimized rendering performance for large-scale, real-time interfaces.',
    ],
  },
  {
    company: 'Robert Half / Hillrom',
    role: 'Software Engineer (Contract)',
    location: 'Cary, NC',
    start: 'December 2017',
    end: 'December 2018',
    summary:
      'Contracted into Hillrom to contribute to shared front-end platform standards using Angular and Material UI.',
    highlights: [
      'Built accessible, responsive components within Agile development cycles.',
      'Collaborated with design teams on well-tested, production-ready features.',
    ],
  },
  {
    company: 'SAVO Group',
    role: 'Front End Developer',
    location: 'Raleigh, NC',
    start: 'April 2017',
    end: 'October 2017',
    summary:
      'Architected and built a component-based web application from the ground up, owning front-end decisions end to end.',
    highlights: [
      'Built the app using Node.js and Angular 4.',
      'Established front-end architecture patterns from planning through deployment.',
    ],
  },
  {
    company: 'Arakyta',
    role: 'Web Developer',
    location: 'Maumee, OH',
    start: 'December 2015',
    end: 'September 2016',
    summary:
      'Built reusable React and JavaScript UI components for enterprise clients, working directly with stakeholders.',
    highlights: [
      'Developed responsive, accessible interfaces for enterprise clients.',
      'Translated stakeholder design requirements directly into production-ready software.',
    ],
  },
]
