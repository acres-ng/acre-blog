import { draftMode } from "next/headers";
import Link from "next/link";

export async function DraftBanner() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;

  return (
    <div className="bg-yellow-400 text-yellow-900 text-sm text-center px-4 py-2">
      Draft Mode active —{" "}
      <Link href="/api/preview/disable" className="underline font-semibold">
        Exit preview
      </Link>
    </div>
  );
}
