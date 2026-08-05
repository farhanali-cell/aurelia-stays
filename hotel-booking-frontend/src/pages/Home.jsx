import Hero from "../components/Home/Hero";
import FeaturedRooms from "../components/Home/FeaturedRooms";
import WhyChooseUs from "../components/Home/WhyChooseUs";
import PopularDestinations from "../components/Home/PopularDestinations";
import SpecialOffers from "../components/Home/SpecialOffers";
import Testimonials from "../components/Home/Testimonials";
import DiningSection from "../components/Home/DiningSection";
import RecentGuests from "../components/Home/RecentGuests";
import TrustStats from "../components/Home/TrustStats";

const Home = () => {
  return (
    <div>
      <Hero />
      <PopularDestinations />
      <FeaturedRooms />
      <WhyChooseUs />
      <SpecialOffers />
      <Testimonials />
      <TrustStats />
      <DiningSection />
      <RecentGuests />
    </div>
  );
};

export default Home;