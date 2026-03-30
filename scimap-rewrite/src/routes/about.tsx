import { createFileRoute } from '@tanstack/react-router'
import { Info, Users } from 'lucide-react'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

/* ── Data ──────────────────────────────────────────────────────────── */

interface TeamMember {
  name: string
  role: string
  bio: string
}

const TEAM: TeamMember[] = [
  {
    name: 'Joshua Weitz, PhD',
    role: 'Co-Lead, SCIMaP Project',
    bio: 'Joshua Weitz, PhD is the co-lead on the SCIMaP project with expertise in data analytics. He is a theoretical ecologist interested in the structure and dynamics of complex biological systems. He is currently a professor of biology and the Clark Leadership Chair in data analytics at the University of Maryland. He leads an interdisciplinary team that develops theories and computational models of how viral infections modulate the fates of individuals, populations, and communities and influence ecosystem-scale function. The team collaborates with a global network of experimentalists, field-centered biologists and public health experts, striving to integrate models and data to advance the fundamental understanding of how living systems work and to inform science-driven-action-taking.',
  },
  {
    name: 'Alyssa (Allie) Sinclair, PhD',
    role: 'Co-Lead, SCIMaP Project',
    bio: "Alyssa (Allie) Sinclair, PhD is the co-lead on the SCIMaP project with expertise in the cognitive neuroscience of learning, motivation, and behavior change. She is an Assistant Professor in the Department of Psychological Sciences at Rice University, where she directs the Learning & Behavior Change Lab. Her research interests and expertise include learning and memory, belief updating, behavior change, information consumption, and affect. Allie uses a combination of psychological studies, functional neuroimaging, and large-scale online field studies. Her research prioritizes real-world applications for challenges related to public health, education, climate change, and science communication.",
  },
  {
    name: 'Mallory Harris, PhD',
    role: 'Senior Data Analyst',
    bio: 'Mallory Harris, PhD is Senior Data Analyst for SCIMaP and a postdoctoral associate at the University of Maryland and the Institute for Health Computing. Mallory uses quantitative methods to study the interplay between human behavior and infectious diseases: how human activity can impact epidemic dynamics and how people respond to outbreaks.',
  },
  {
    name: 'Aroon Chande, PhD',
    role: 'Technical Consultant',
    bio: "Aroon Chande, PhD, is a Senior Engineer at Color Health and a Technical Consultant for the SCIMaP project. Aroon's background is in human genetics and bioinformatics and he develops software for biological data analysis. He acts as a technical advisor and solution architect for the SCIMaP project. Providing engineering and infrastructure support for SCIMaP research and publications.",
  },
  {
    name: 'Clio Andris, PhD',
    role: 'Associate Professor, Georgia Tech',
    bio: 'Clio Andris is an associate professor at Georgia Tech with a joint appointment in the School of City and Regional Planning and the School of Interactive Computing. She directs the Friendly Cities Lab and conducts research on geographic information science (GIScience), social networks, and geovisualization. She received her PhD from MIT in 2011 in Urban Information Systems.',
  },
  {
    name: 'Lahne Mattas Curry',
    role: 'Media & Outreach Specialist',
    bio: "Lahne Mattas Curry is PhD candidate in Communication at the University of Maryland and the media and outreach specialist for the SCIMaP team. Lahne's research focuses on organizational relationships during environmental emergencies, with particular interest on community building, engagement, trust in institutions, access to accurate information, and organizational and internal crisis communication. Lahne has more than two decades of practical experience across government, corporate, and non-profit organizations. She most recently served as the Communication Director for the U.S. Environmental Protection Agency's Center for Environmental Solutions & Emergency Response, which was eliminated in 2025.",
  },
]

/* ── Components ────────────────────────────────────────────────────── */

function TeamCard({ member }: { member: TeamMember }) {
  const initials = member.name
    .split(' ')
    .filter((p) => !p.includes(',') && !p.includes('('))
    .slice(0, 2)
    .map((p) => p[0])
    .join('')

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900">{member.name}</h3>
          <p className="text-sm font-medium text-brand-blue">{member.role}</p>
        </div>
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-gray-500">
        {member.bio}
      </p>
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────────── */

function AboutPage() {
  return (
    <div className="flex w-full flex-col bg-neutral-50">
      <Tabs defaultValue="overview" className="w-full gap-0">
        <div className="w-full bg-white px-6 pt-6">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-2xl font-bold text-brand-blue">About</h1>
            <p className="mt-1 text-sm text-gray-500">
              The project, the mission, and the people behind SCIMaP
            </p>

            <div className="-mb-px mt-5 border-b border-gray-200">
              <TabsList
                variant="line"
                className="h-10 w-full justify-start gap-0"
              >
                <TabsTrigger
                  value="overview"
                  className="h-10 gap-2 rounded-none px-4 text-sm font-semibold text-gray-500 hover:text-gray-700 data-active:text-brand-blue after:bg-brand-blue"
                >
                  <Info className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="team"
                  className="h-10 gap-2 rounded-none px-4 text-sm font-semibold text-gray-500 hover:text-gray-700 data-active:text-brand-blue after:bg-brand-blue"
                >
                  <Users className="h-4 w-4" />
                  The Team
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        {/* ── Overview ─────────────────────────────────────────────── */}
        <TabsContent value="overview" className="text-base">
          <div className="w-full px-6 py-8 md:py-10">
            <div className="mx-auto max-w-4xl">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-xl font-bold text-gray-900">
                  The SCIMaP Project
                </h2>

                <div className="mt-4 space-y-4 leading-relaxed text-gray-600">
                  <p>
                    Our team tracks, analyzes, and visualizes the impact of
                    federal science funding cuts across the United States. We
                    create a clear picture of how policy decisions affect real
                    people and places by combining public data on federal grants,
                    federal budget proposals, economic indicators, Census data on
                    commuter flows, and community-level statistics.
                  </p>
                  <p>
                    Our research goes beyond numbers to tell the story of how
                    science funding supports innovation, jobs, education, and
                    economic growth in every state and territory — and what
                    happens when funding gets cut.
                  </p>
                  <p>
                    Through interactive data visualizations and actionable
                    insights, we make complex policy decisions understandable and
                    their consequences visible to everyone, from concerned
                    citizens to policy makers.
                  </p>
                  <p>
                    The team consists of experts from around the country,
                    including researchers at the University of Maryland, the
                    University of Pennsylvania, the University of Utah, the
                    Georgia Institute of Technology, and the University of
                    Oregon. The interdisciplinary team has expertise across a
                    variety of areas including biology, psychology, neuroscience,
                    communication, and geographic information science, united by
                    a common goal.
                  </p>
                </div>
              </div>

              {/* Video embed */}
              <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-lg font-semibold text-gray-900">
                  See SCIMaP in Action
                </h2>
                <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg bg-black">
                  <video
                    className="h-full w-full"
                    src="https://data.scienceimpacts.org/SCIMaP_NIH_cuts.mp4"
                    controls
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── The Team ─────────────────────────────────────────────── */}
        <TabsContent value="team" className="text-base">
          <div className="w-full px-6 py-8 md:py-10">
            <div className="mx-auto max-w-4xl space-y-4">
              {TEAM.map((member) => (
                <TeamCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
