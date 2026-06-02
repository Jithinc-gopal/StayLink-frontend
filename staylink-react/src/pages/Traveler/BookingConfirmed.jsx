import { useParams, useNavigate } from 'react-router-dom';

export default function BookingConfirmed() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 mb-1">Your Booking ID</p>
        <p className="text-2xl font-bold text-gray-800 mb-4">#{bookingId}</p>
        <p className="text-gray-400 text-sm mb-6">
          Confirmation email will be sent shortly. The owner has been notified.
        </p>
        <button
          onClick={() => navigate('/my-trips')}
          className="w-full bg-rose-500 text-white py-3 rounded-xl font-semibold hover:bg-rose-600"
        >
          View My Trips
        </button>
      </div>
    </div>
  );
}