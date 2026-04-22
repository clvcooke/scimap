import { createFileRoute } from '@tanstack/react-router'
import { Info, Users } from 'lucide-react'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import { getTeamMembers, getPage } from '@/lib/content'
import { InlineMarkdown } from '@/components/InlineMarkdown'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

/* ── Data ──────────────────────────────────────────────────────────── */

const TEAM = getTeamMembers()
const OVERVIEW = getPage('about-overview')

/* ── Components ────────────────────────────────────────────────────── */

function TeamCard({
  member,
}: {
  member: { name: string; role: string; bio: string; photo: string }
}) {
  const initials = member.name
    .split(' ')
    .filter((p) => !p.includes(',') && !p.includes('('))
    .slice(0, 2)
    .map((p) => p[0])
    .join('')

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900">{member.name}</h3>
          <p className="text-sm font-medium text-brand-blue">{member.role}</p>
        </div>
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-gray-500 [&_a]:text-brand-blue [&_a]:underline [&_a]:hover:text-brand-sky">
        <InlineMarkdown>{member.bio}</InlineMarkdown>
      </p>
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────────── */

function AboutPage() {
  return (
    <div className="flex w-full flex-1 flex-col bg-neutral-50">
      <Tabs defaultValue="overview" className="flex w-full flex-1 flex-col gap-0">
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
                  className="h-10 gap-2 rounded-none px-2 text-xs font-semibold text-gray-500 hover:text-gray-700 data-active:text-brand-blue after:bg-brand-blue sm:px-4 sm:text-sm"
                >
                  <Info className="hidden h-4 w-4 sm:block" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="team"
                  className="h-10 gap-2 rounded-none px-2 text-xs font-semibold text-gray-500 hover:text-gray-700 data-active:text-brand-blue after:bg-brand-blue sm:px-4 sm:text-sm"
                >
                  <Users className="hidden h-4 w-4 sm:block" />
                  The Team
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        {/* ── Overview ─────────────────────────────────────────────── */}
        <TabsContent value="overview" className="flex-1 text-base">
          <div className="w-full px-6 py-8 md:py-10">
            <div className="mx-auto max-w-4xl">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-xl font-bold text-gray-900">
                  {OVERVIEW.attrs.title}
                </h2>

                <div className="mt-4 space-y-4 leading-relaxed text-gray-600 [&_a]:text-brand-blue [&_a]:underline [&_a]:hover:text-brand-sky">
                  {OVERVIEW.body.split(/\n\n+/).map((paragraph, i) => (
                    <p key={i}><InlineMarkdown>{paragraph}</InlineMarkdown></p>
                  ))}
                </div>
              </div>

              {/* Video embed */}
              {OVERVIEW.attrs.video_url && (
                <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {OVERVIEW.attrs.video_heading ?? 'Video'}
                  </h2>
                  <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg bg-black">
                    <video
                      className="h-full w-full"
                      src={OVERVIEW.attrs.video_url}
                      controls
                      preload="metadata"
                    >
                      <track kind="captions" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ── The Team ─────────────────────────────────────────────── */}
        <TabsContent value="team" className="flex-1 text-base">
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
