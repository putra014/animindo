import { Suspense } from "react";
import SearchContent from "./SearchContent";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-custom py-8">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}