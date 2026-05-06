export default function ArticleVerifiedBadge({ verified, factChecked }: { verified: boolean; factChecked: boolean }) {
  // Only show the badge if the article has been through the fact-checker
  if (!factChecked) return null;

  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 text-green-600 text-xs">
        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Verified
      </span>
    );
  }

  // Fact-checked but failed — article should be hidden, but just in case
  return null;
}
