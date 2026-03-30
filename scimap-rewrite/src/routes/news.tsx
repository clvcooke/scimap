import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink, Megaphone, Newspaper } from 'lucide-react'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'

export const Route = createFileRoute('/news')({
  component: NewsPage,
})

/* ── Data ──────────────────────────────────────────────────────────── */

interface NewsItem {
  date: string
  title: string
  description: string
  source: string
  url: string
  isOngoing?: boolean
}

const NEWS_ITEMS: NewsItem[] = [
  {
    date: 'Ongoing',
    title: 'Stand Up for Science, "Powered by SCIMaP"',
    description:
      'SCIMaP data powers the Stand Up for Science resource hub, helping advocates access localized research funding impact data for their communities.',
    source: 'Stand Up for Science',
    url: 'https://www.standupforscience.net/resources',
    isOngoing: true,
  },
  {
    date: 'November 20, 2025',
    title: 'Fact-checking claims about medical science research grant funding cuts',
    description:
      'PolitiFact uses SCIMaP data to evaluate claims made about the scale and impact of federal cuts to medical science research grants.',
    source: 'PolitiFact',
    url: 'https://www.politifact.com/factchecks/2025/nov/20/robert-f-kennedy-jr/medical-science-research-grant-funding-cuts-RFK/',
  },
  {
    date: 'October 31, 2025',
    title: 'Reporting on federal changes to science',
    description:
      'The Council for the Advancement of Science Writing highlights SCIMaP as a key resource for journalists covering federal changes to science funding.',
    source: 'CASW',
    url: 'https://connector.casw.org/resources/science-community-impacts-mapping-project-scimap/',
  },
  {
    date: 'September 15, 2025',
    title: 'Open Philanthropy Awards $336K to Map the Impact of Scientific Funding Cuts',
    description:
      'The University of Maryland announces a grant from Open Philanthropy to expand SCIMaP\'s capabilities in tracking the community-level effects of science funding reductions.',
    source: 'UMD CMNS',
    url: 'https://cmns.umd.edu/news-events/news/open-philanthropy-award-joshua-weitz-scimap',
  },
  {
    date: 'July 29, 2025',
    title: 'SCIMaP Visualizes the True Cost of Science Funding Cuts',
    description:
      'An in-depth profile of how the SCIMaP project translates federal grant data into interactive maps showing economic and job impacts at the local level.',
    source: 'The Scientist',
    url: 'https://www.the-scientist.com/scimap-visualizes-the-true-cost-of-science-funding-cuts-73211',
  },
  {
    date: 'July 23, 2025',
    title: 'Mapping federal funding cuts to U.S. colleges and universities',
    description:
      'Analysis of how federal funding reductions are affecting higher education institutions across the country, with SCIMaP data illustrating the geographic distribution of cuts.',
    source: 'Center for American Progress',
    url: 'https://www.americanprogress.org/article/mapping-federal-funding-cuts-to-us-colleges-and-universities/',
  },
  {
    date: 'July 23, 2025',
    title: 'NIH: The quiet engine of science is under threat',
    description:
      'Epidemiologist Katelyn Jetelina examines the far-reaching consequences of NIH funding disruptions, drawing on SCIMaP to illustrate the scale of impact.',
    source: 'Your Local Epidemiologist',
    url: 'https://yourlocalepidemiologist.substack.com/p/nih-the-quiet-engine-of-science-is',
  },
  {
    date: 'July 23, 2025',
    title: 'Feds axed grants across red and blue states, report finds',
    description:
      'Inside Higher Ed reports on how terminated federal grants have affected research institutions in both Republican and Democratic-leaning states.',
    source: 'Inside Higher Ed',
    url: 'https://www.insidehighered.com/news/faculty-issues/research/2025/07/23/feds-axed-grants-across-red-blue-states-report-finds',
  },
  {
    date: 'July 3, 2025',
    title: 'NIH grant restoration complicated by limits to court order',
    description:
      'STAT News investigates the challenges of restoring cancelled NIH grants in the wake of court rulings and ongoing policy restrictions.',
    source: 'STAT News',
    url: 'https://www.statnews.com/2025/07/03/nih-cuts-grant-restoration-complicated-by-limits-to-court-order-trump-dei-restrictions/',
  },
  {
    date: 'June 26, 2025',
    title: "What's at risk with science funding cuts",
    description:
      'Research!America uses SCIMaP findings to outline what communities stand to lose as federal science funding faces unprecedented reductions.',
    source: 'Research!America',
    url: 'https://www.researchamerica.org/marys-letters/whats-at-risk/',
  },
  {
    date: 'June 20, 2025',
    title: 'Opinion: The local cost of federal science cuts',
    description:
      'A Tampa Bay editorial examines how federal research funding reductions ripple through local economies, jobs, and community health services.',
    source: 'Tampa Bay Newspapers',
    url: 'https://www.tbnweekly.com/opinion/article_acaccd5e-ef10-4434-8bb6-cadf464009f9.html',
  },
  {
    date: 'June 18, 2025',
    title: 'Mapping local economic consequences of federal cuts to NIH',
    description:
      'A behind-the-scenes look at how SCIMaP was built and the methodology used to translate NIH funding data into county-level economic impact estimates.',
    source: 'AHCJ',
    url: 'https://healthjournalism.org/blog/2025/06/mapping-local-economic-consequences-of-federal-cuts-to-nih-how-they-did-it/',
  },
  {
    date: 'June 2, 2025',
    title: 'HHS faces $31B in cuts in proposed FY26 budget',
    description:
      'An overview of the proposed FY2026 Health and Human Services budget and its potential impact on research institutions and healthcare systems nationwide.',
    source: "Becker's Hospital Review",
    url: 'https://www.beckershospitalreview.com/hospital-management-administration/hhs-faces-31b-cuts-in-proposed-fy-26-budget-6-notes/',
  },
  {
    date: 'April 27, 2025',
    title: 'Houston-area institutions face significant NIH funding losses',
    description:
      'The Houston Chronicle reports on how proposed federal cuts would affect the Texas Medical Center and other major research hubs in the region.',
    source: 'Houston Chronicle',
    url: 'https://www.pressreader.com/usa/houston-chronicle-sunday/20250427/282071987764907?srsltid=AfmBOop1ZNOR-CGUQicuE6yLCwEGiKHhbzzOFTsF2b8vh_ikZ2JHgP72',
  },
  {
    date: 'April 18, 2025',
    title: 'The ripple effect of cuts to NIH research funding',
    description:
      'Open Campus explores how NIH funding reductions cascade beyond labs into local economies, affecting everything from supplier contracts to graduate student employment.',
    source: 'Open Campus',
    url: 'https://www.opencampus.org/2025/04/18/the-ripple-effect-of-cuts-to-nih-research-funding/',
  },
  {
    date: 'April 17, 2025',
    title: 'Trump health funding cuts hit Virginia hard',
    description:
      'Axios Richmond examines the state-level impact of federal health funding reductions on Virginia research institutions and the communities that depend on them.',
    source: 'Axios Richmond',
    url: 'https://www.axios.com/local/richmond/2025/04/17/trump-health-funding-cuts-virginia',
  },
  {
    date: 'April 16, 2025',
    title: 'NIH funding cuts by county: Cook and Suffolk among hardest hit',
    description:
      'Modern Healthcare maps the counties facing the largest economic losses from NIH funding reductions, with Cook County and Suffolk County topping the list.',
    source: 'Modern Healthcare',
    url: 'https://www.modernhealthcare.com/politics-policy/nih-funding-cuts-counties-cook-suffolk',
  },
  {
    date: 'April 11, 2025',
    title: 'NIH cuts would hurt Raleigh-Durham, Wake, and Orange counties',
    description:
      'A regional analysis of how the Research Triangle area stands to lose research jobs and economic activity under proposed NIH budget reductions.',
    source: 'Axios Raleigh',
    url: 'https://www.axios.com/local/raleigh/2025/04/11/nih-cuts-would-hurt-raleigh-durham-wake-orange',
  },
  {
    date: 'April 9, 2025',
    title: 'NIH cuts: A nationwide county-by-county impact map',
    description:
      'Axios features SCIMaP\'s interactive map showing the projected economic impact of NIH funding cuts in every county across the United States.',
    source: 'Axios',
    url: 'https://www.axios.com/2025/04/09/nih-cuts-nationwide-impact-county-map',
  },
  {
    date: 'April 2, 2025',
    title: 'Massachusetts communities brace for NIH funding losses',
    description:
      'MassLive reports on how Massachusetts — home to some of the nation\'s largest NIH grant recipients — faces outsized economic consequences from proposed cuts.',
    source: 'MassLive',
    url: 'https://www.axios.com/2025/04/09/nih-cuts-nationwide-impact-county-map',
  },
  {
    date: 'March 28, 2025',
    title: 'Economic impact of federal health research cuts',
    description:
      'Data visualization site Flowing Data highlights SCIMaP\'s mapping of the economic consequences of federal health research funding reductions.',
    source: 'Flowing Data',
    url: 'https://flowingdata.com/2025/03/28/economic-impact-of-federal-health-research-cuts/',
  },
]

interface PressRelease {
  date: string
  title: string
  url: string
  summary: string
}

const PRESS_RELEASES: PressRelease[] = [
  {
    date: 'Placeholder',
    title: 'Placeholder Press Release Title',
    url: '#',
    summary:
      'Replace with a brief summary of the press release and its key announcements.',
  },
  {
    date: 'Placeholder',
    title: 'Another Press Release',
    url: '#',
    summary:
      'Replace with the actual press release summary content.',
  },
]

/* ── Page ──────────────────────────────────────────────────────────── */

function NewsPage() {
  return (
    <div className="flex w-full flex-col bg-neutral-50">
      <Tabs defaultValue="in-the-news" className="w-full gap-0">
        <div className="w-full bg-white px-6 pt-6">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-2xl font-bold text-brand-blue">News</h1>
            <p className="mt-1 text-sm text-gray-500">
              Press releases and media coverage of SCIMaP
            </p>

            <div className="-mb-px mt-5 border-b border-gray-200">
              <TabsList
                variant="line"
                className="h-10 w-full justify-start gap-0"
              >
                <TabsTrigger
                  value="in-the-news"
                  className="h-10 gap-2 rounded-none px-4 text-sm font-semibold text-gray-500 hover:text-gray-700 data-active:text-brand-blue after:bg-brand-blue"
                >
                  <Newspaper className="h-4 w-4" />
                  SCIMaP in the News
                </TabsTrigger>
                <TabsTrigger
                  value="press"
                  className="h-10 gap-2 rounded-none px-4 text-sm font-semibold text-gray-500 hover:text-gray-700 data-active:text-brand-blue after:bg-brand-blue"
                >
                  <Megaphone className="h-4 w-4" />
                  Press Releases
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        {/* ── SCIMaP in the News ──────────────────────────────────── */}
        <TabsContent value="in-the-news" className="text-base">
          <div className="w-full px-6 py-8 md:py-10">
            <div className="mx-auto max-w-4xl">
              <div className="space-y-4">
                {NEWS_ITEMS.map((item, i) => (
                  <a
                    key={`${item.title}-${i}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-brand-blue/30 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`text-xs font-medium ${
                          item.isOngoing ? 'text-brand-blue' : 'text-gray-400'
                        }`}
                      >
                        {item.date}
                      </span>
                      <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                        {item.source}
                      </span>
                    </div>
                    <h3 className="mt-2 font-semibold text-gray-900 group-hover:text-brand-blue">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-gray-500">
                      {item.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Press Releases ──────────────────────────────────────── */}
        <TabsContent value="press" className="text-base">
          <div className="w-full px-6 py-8 md:py-10">
            <div className="mx-auto max-w-4xl">
              <div className="space-y-4">
                {PRESS_RELEASES.map((pr) => (
                  <a
                    key={pr.title}
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-brand-blue/30 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-medium text-gray-400">
                          {pr.date}
                        </span>
                        <h3 className="mt-1 font-semibold text-gray-900 group-hover:text-brand-blue">
                          {pr.title}
                        </h3>
                      </div>
                      <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-brand-blue" />
                    </div>
                    <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
                      {pr.summary}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
