import { Suspense } from "react";
import WatchClient from "./WatchClient";

export default async function WatchPage() {
  return (
    <Suspense fallback={
      <div className="container-custom py-8 text-center">
        Loading player...
      </div>
    }>
      <WatchClient />
    </Suspense>
  );
}