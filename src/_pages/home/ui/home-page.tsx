import { getOffersData } from "../api/get-offers-data";

import { HomeIntro } from "./home-intro";
import { HomeUpdates } from "./home-updates";

async function HomePage() {
  const { catalogDate, city, mostProfitable, mostDiscounted, mostCheap, error } =
    await getOffersData();
  return (
    <div>
      <HomeIntro />

      <HomeUpdates
        city={city}
        date={catalogDate}
        mostProfitable={mostProfitable}
        mostDiscounted={mostDiscounted}
        mostCheap={mostCheap}
        error={error}
      />
    </div>
  );
}

export { HomePage };
