import { cacheLife } from "next/cache";

export async function CopyrightYear() {
  "use cache";
  cacheLife("max");
  return <>{new Date().getFullYear()}</>;
}
