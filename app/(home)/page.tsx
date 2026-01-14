import { getOffersData } from "@/app/(home)/get-offers-data";
import { HomeIntro } from "@/app/(home)/home-intro";
import HomeUpdates from "@/app/(home)/home-updates";

export default async function Home() {
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
