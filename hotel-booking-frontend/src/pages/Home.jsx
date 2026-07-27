import Hero from '../components/Hero';
import FeaturedRooms from '../components/FeaturedRooms';
import Testimonials from '../components/Testimonials';
import DiningSection from '../components/DiningSection';
import RecentGuests from '../components/RecentGuests';

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedRooms />
      <Testimonials />
      <DiningSection />
      <RecentGuests />
    </div>
  );
};

export default Home;