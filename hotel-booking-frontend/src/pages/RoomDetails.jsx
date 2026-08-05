import RoomGallery from "../components/roomDetails/RoomGallery";
import RoomInfo from "../components/roomDetails/RoomInfo";
import RoomDetailAmenities from "../components/roomDetails/RoomDetailAmenities";
import BookingForm from "../components/roomDetails/BookingForm";
import RelatedRooms from "../components/roomDetails/RelatedRooms";

const RoomDetails = () => {
  return (
    <>
      <RoomGallery />
      <RoomInfo />
      <RoomDetailAmenities />
      <BookingForm />
      <RelatedRooms />
    </>
  );
};

export default RoomDetails;
