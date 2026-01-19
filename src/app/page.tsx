import { client } from '@/sanity/lib/client'
import { VERSIONS_QUERY } from '@/sanity/lib/queries'
import { VersionCard } from '@/components/VersionCard'
import type { ContentVersion } from '@/types'

export const revalidate = 60

export default async function Home() {
  const versions = await client.fetch<ContentVersion[]>(VERSIONS_QUERY)

  return (
    <main className="min-h-screen p-8 md:p-12 lg:p-24 max-w-7xl mx-auto">
      <header className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          K-IDOL <span className="text-pink-500">KOREAN</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          Learn Korean with your favorite AI Idol lyrics and stories.
          Select a version to start learning.
        </p>
      </header>

      {versions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {versions.map((version) => (
            <VersionCard key={version._id} version={version} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-xl text-gray-500">No versions published yet.</p>
          <p className="text-sm text-gray-400 mt-2">Go to <a href="/studio" className="underline hover:text-pink-500">/studio</a> to add content.</p>
        </div>
      )}
    </main>
  )
}
