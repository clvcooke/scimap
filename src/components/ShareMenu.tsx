import { useState, useRef, useEffect } from 'react'
import { Share2, Link, Check } from 'lucide-react'

const btnBase =
  'flex size-8 items-center justify-center bg-white shadow-md transition-colors hover:bg-gray-100 active:bg-gray-200'

/** Reusable share button + dropdown. Renders a share icon that opens a menu
 *  with native share (on mobile), copy-link, and social sharing options.
 *  Designed to sit alongside MapControls or anywhere on the page.
 *  @param dropUp — opens the menu above the button instead of below.
 *  @param shareUrl — override the URL to share (defaults to current page URL).
 *  @param shareTitle — override the share title (defaults to current page title). */
export default function ShareMenu({ className, dropUp, shareUrl, shareTitle }: { className?: string; dropUp?: boolean; shareUrl?: string; shareTitle?: string }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [pos, setPos] = useState<{ up: boolean; alignRight: boolean }>({ up: false, alignRight: true })
  const menuRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  // close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const pageUrl = shareUrl ?? window.location.href
  const pageTitle = shareTitle ?? document.title

  const copyLink = async () => {
    await navigator.clipboard.writeText(pageUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareNative = async () => {
    try {
      await navigator.share({ title: pageTitle, url: pageUrl })
    } catch {
      // user cancelled or not supported
    }
    setOpen(false)
  }

  const shareX = () => {
    window.open(
      `https://x.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`,
      '_blank',
      'noopener',
    )
    setOpen(false)
  }

  const shareBluesky = () => {
    window.open(
      `https://bsky.app/intent/compose?text=${encodeURIComponent(`${pageTitle} ${pageUrl}`)}`,
      '_blank',
      'noopener',
    )
    setOpen(false)
  }

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
      '_blank',
      'noopener',
    )
    setOpen(false)
  }

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
      '_blank',
      'noopener',
    )
    setOpen(false)
  }

  const shareEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(pageTitle)}&body=${encodeURIComponent(pageUrl)}`
    setOpen(false)
  }

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share

  return (
    <div className={className ?? ''}>
      <div ref={menuRef} className="relative inline-block">
      <button
        ref={btnRef}
        onClick={() => {
          setOpen((o) => {
            if (!o && btnRef.current) {
              const rect = btnRef.current.getBoundingClientRect()
              const menuH = 280 // approximate menu height
              const menuW = 192 // w-48 = 12rem = 192px
              setPos({
                up: (dropUp ?? false) || rect.bottom + menuH > window.innerHeight,
                alignRight: rect.right >= menuW,
              })
            }
            return !o
          })
        }}
        className={`${btnBase} rounded-lg`}
        aria-label="Share"
        aria-expanded={open}
      >
        <Share2 className="size-4" />
      </button>

      {open && (
        <div className={`absolute w-48 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 ${pos.up ? 'bottom-full mb-2' : 'top-full mt-2'} ${pos.alignRight ? 'right-0' : 'left-0'}`}>
          {hasNativeShare && (
            <ShareItem icon={<Share2 className="size-4" />} label="Share..." onClick={() => void shareNative()} />
          )}
          <ShareItem
            icon={copied ? <Check className="size-4 text-green-600" /> : <Link className="size-4" />}
            label={copied ? 'Copied!' : 'Copy link'}
            onClick={() => void copyLink()}
          />
          <div className="my-1 border-t border-gray-100" />
          <ShareItem icon={<XLogo />} label="X / Twitter" onClick={shareX} />
          <ShareItem icon={<BlueskyLogo />} label="Bluesky" onClick={shareBluesky} />
          <ShareItem icon={<FacebookLogo />} label="Facebook" onClick={shareFacebook} />
          <ShareItem icon={<LinkedInLogo />} label="LinkedIn" onClick={shareLinkedIn} />
          <ShareItem icon={<EmailIcon />} label="Email" onClick={shareEmail} />
        </div>
      )}
      </div>
    </div>
  )
}

function ShareItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
    >
      <span className="flex size-5 items-center justify-center">{icon}</span>
      {label}
    </button>
  )
}

// Tiny inline SVG brand logos (no extra dependencies)

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function BlueskyLogo() {
  return (
    <svg viewBox="0 0 600 530" className="size-4" fill="currentColor">
      <path d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.72 40.255-67.24 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z" />
    </svg>
  )
}

function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function LinkedInLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}
