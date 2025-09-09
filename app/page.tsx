import BannerCarousel from "./components/BannerCarousel";
import CategorySection from "./components/CategorySection";
import RecommendedProducts from "./components/RecommendedProducts";
import TodaysDeal from "./components/TodaysDeal";

export default function Home() {
  return (
    <div className="bg-red-50">
      <BannerCarousel
      />
      <CategorySection />
      <RecommendedProducts />
      <TodaysDeal />
    </div>
  );
}