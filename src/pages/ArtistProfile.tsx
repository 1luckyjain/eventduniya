import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User, LogOut, Instagram, Twitter, Globe, Edit } from 'lucide-react';
import { useAuth } from '../context/auth-context';

// Define the interface according to the Artist schema
export interface IArtistProfile {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatars: string[];
  city: string;
  state: string;
  country: string;
  pincode: string;
  phoneNumber: string;
  tag: string;
  bio: string;
  videoLink1: string;
  videoLink2?: string;
  videoLink3?: string;
  instagram: string;
  twitter?: string;
  youtube?: string;
  facebook?: string;
  tiktok?: string;
  createdAt: string;
  updatedAt: string;
}

// Define the review interface (adjust as needed)
interface IReview {
  _id: string;
  artistId: string;
  userId: string;
  rating: number;
  reviewDescription: string;
  createdAt: string;
}

// ----- Existing AvatarSlider Component -----
// (You may keep this or replace it with a gallery if desired.)
const AvatarSlider: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative w-full max-w-[200px] md:max-w-full mx-auto mb-4 overflow-hidden rounded-lg border-4 border-purple-500 hover:scale-105 transition-transform duration-300">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Avatar ${index + 1}`}
          className={`absolute inset-0 object-cover w-full h-full aspect-square transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
};

const ArtistProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artistProfile, setArtistProfile] = useState<IArtistProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const auth = useAuth();
  const token = auth.token;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // States for rating & review
  const [review, setReview] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [reviewSuccess, setReviewSuccess] = useState<string>('');
  const [reviewError, setReviewError] = useState<string>('');
  const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);

  // States for fetched reviews and the current user's review
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [userReview, setUserReview] = useState<IReview | null>(null);

  // ----- New Contact Form States -----
  const [showContactForm, setShowContactForm] = useState<boolean>(false);
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactSubject, setContactSubject] = useState<string>('');
  const [contactMessage, setContactMessage] = useState<string>('');
  const [contactSubmitting, setContactSubmitting] = useState<boolean>(false);
  const [contactError, setContactError] = useState<string>('');
  const [contactSuccess, setContactSuccess] = useState<string>('');

  // ----- Fetch Artist Data -----
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/artist/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: IArtistProfile) => {
        setArtistProfile(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching artist:', error);
        setLoading(false);
      });
  }, [id, token, API_URL]);

  // ----- Fetch Reviews -----
  useEffect(() => {
    if (artistProfile) {
      fetch(`${API_URL}/api/review?artistId=${artistProfile._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch reviews');
          }
          return res.json();
        })
        .then((data: IReview[]) => {
          setReviews(data);
          // Check if current user has already submitted a review
          const existing = data.find((r) => r.userId === auth.user?._id);
          if (existing) {
            setUserReview(existing);
          }
        })
        .catch((error) => {
          console.error('Error fetching reviews:', error);
        });
    }
  }, [artistProfile, token, auth.user, API_URL]);

  // ----- Handle Review Submit -----
  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewError('');
    setReviewSuccess('');

    if (rating < 1 || rating > 5) {
      setReviewError('Please select a valid rating between 1 and 5.');
      setReviewSubmitting(false);
      return;
    }
    if (!review.trim()) {
      setReviewError('Review text cannot be empty.');
      setReviewSubmitting(false);
      return;
    }

    try {
      const user = auth.user;
      const response = await fetch(`${API_URL}/api/review/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          artistId: artistProfile?._id,
          rating,
          reviewDescription: review,
          userId: user._id,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
      const createdReview = await response.json();
      setReviewSuccess('Review submitted successfully!');
      setReview('');
      setRating(0);
      // Update reviews list and set current user's review
      setReviews((prev) => [createdReview, ...prev]);
      setUserReview(createdReview);
    } catch (error: any) {
      setReviewError(error.message || 'Error submitting review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  // ----- Handle Contact Form Submit -----
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactError('');
    setContactSuccess('');

    // Validate required fields (email, subject, message)
    if (!contactEmail.trim() || !contactSubject.trim() || !contactMessage.trim()) {
      setContactError('Email, Subject, and Message are required.');
      setContactSubmitting(false);
      return;
    }

    try {
      const payload = {
        userId: auth.user?._id,
        artistId: artistProfile?._id,
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        subject: contactSubject,
        message: contactMessage,
      };

      const response = await fetch(`${API_URL}/api/contact/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }
      const data = await response.json();
      setContactSuccess('Your message has been sent successfully!');
      // Reset the contact form fields
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactSubject('');
      setContactMessage('');
      // Optionally, close the form after successful submission
      setShowContactForm(false);
    } catch (error: any) {
      setContactError(error.message || 'Error submitting contact form');
    } finally {
      setContactSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!artistProfile) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        Artist not found.
      </div>
    );
  }

  // Use the first avatar as the cover image fallback
  const coverImage =
    artistProfile.avatars.length > 0
      ? artistProfile.avatars[0]
      : 'https://via.placeholder.com/2000x500';

  return (
    <div className="bg-black min-h-screen">
      {/* Cover Image */}
      <div
        className="h-48 w-full relative"
        style={{
          backgroundImage: `url(${coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black"></div>
      </div>

      <div className="container mx-auto px-6 -mt-20 relative">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex flex-col items-center text-center mb-6">
                {/* Animated avatar slider */}
                <AvatarSlider
                  images={
                    artistProfile.avatars.length > 0
                      ? artistProfile.avatars
                      : ['https://via.placeholder.com/150']
                  }
                />
                <h2 className="text-xl font-bold">{artistProfile.username}</h2>
                <p className="text-purple-500">{artistProfile.tag}</p>
              </div>
              <div className="flex justify-center space-x-4 mb-6">
                {artistProfile.instagram && (
                  <a
                    href={artistProfile.instagram}
                    className="text-gray-400 hover:text-purple-500"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                )}
                {artistProfile.twitter && (
                  <a
                    href={artistProfile.twitter}
                    className="text-gray-400 hover:text-purple-500"
                  >
                    <Twitter className="h-6 w-6" />
                  </a>
                )}
                {artistProfile.facebook && (
                  <a
                    href={artistProfile.facebook}
                    className="text-gray-400 hover:text-purple-500"
                  >
                    <Globe className="h-6 w-6" />
                  </a>
                )}
              </div>
              {/* Additional sidebar content can go here */}
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-8">
            {/* Bio Section */}
            <div className="bg-gray-900 rounded-xl p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold">About</h3>
                <button className="text-purple-500 hover:text-purple-400">
                  <Edit className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-300">{artistProfile.bio}</p>
            </div>

            {/* Video Links Section */}
            <div className="bg-gray-900 rounded-xl p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-6 text-center md:text-left">
                Videos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Video 1 */}
                <a
                  href={artistProfile.videoLink1}
                  className="group flex items-center p-4 rounded-lg bg-gray-800 hover:bg-purple-900/20 transition-all duration-300 border border-gray-700 hover:border-purple-500"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <svg
                          className="w-6 h-6 text-purple-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-purple-400 group-hover:text-purple-300 font-medium transition-colors">
                        Video 1
                      </span>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-purple-500 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>

                {/* Video 2 - Conditional */}
                {artistProfile.videoLink2 && (
                  <a
                    href={artistProfile.videoLink2}
                    className="group flex items-center p-4 rounded-lg bg-gray-800 hover:bg-purple-900/20 transition-all duration-300 border border-gray-700 hover:border-purple-500"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <svg
                            className="w-6 h-6 text-purple-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-purple-400 group-hover:text-purple-300 font-medium transition-colors">
                          Video 2
                        </span>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-purple-500 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                )}

                {/* Video 3 - Conditional */}
                {artistProfile.videoLink3 && (
                  <a
                    href={artistProfile.videoLink3}
                    className="group flex items-center p-4 rounded-lg bg-gray-800 hover:bg-purple-900/20 transition-all duration-300 border border-gray-700 hover:border-purple-500"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <svg
                            className="w-6 h-6 text-purple-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-purple-400 group-hover:text-purple-300 font-medium transition-colors">
                          Video 3
                        </span>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-purple-500 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Contact Details</h3>
              <ul className="text-gray-300">
                <li>
                  <strong>Email:</strong> {artistProfile.email}
                </li>
                <li>
                  <strong>Phone:</strong> {artistProfile.phoneNumber}
                </li>
                <li>
                  <strong>Location:</strong>{' '}
                  {artistProfile.city}, {artistProfile.state}, {artistProfile.country} -{' '}
                  {artistProfile.pincode}
                </li>
              </ul>
            </div>

            {/* Contact the Artist Section */}
            <div className="bg-gray-900 rounded-xl p-8">
              <button
                onClick={() => setShowContactForm((prev) => !prev)}
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg"
              >
                {showContactForm ? 'Hide Contact Form' : 'Contact the Artist'}
              </button>
              {showContactForm && (
                <form onSubmit={handleContactSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-1">Name:</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full p-2 rounded-lg bg-gray-800 text-white"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Email:</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full p-2 rounded-lg bg-gray-800 text-white"
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Phone:</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full p-2 rounded-lg bg-gray-800 text-white"
                      placeholder="Your phone number (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Subject:</label>
                    <input
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full p-2 rounded-lg bg-gray-800 text-white"
                      placeholder="Subject"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Message:</label>
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={4}
                      className="w-full p-2 rounded-lg bg-gray-800 text-white"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  {contactError && <p className="text-red-500">{contactError}</p>}
                  {contactSuccess && <p className="text-green-500">{contactSuccess}</p>}
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg"
                  >
                    {contactSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Rating & Review Section */}
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Rating & Review</h3>
              {userReview ? (
                <div className="mb-6">
                  <p className="text-green-500 font-semibold">Your submitted review:</p>
                  <div className="p-4 bg-gray-800 rounded-lg mt-2 border border-yellow-500">
                    <p>
                      <strong>Rating:</strong> {userReview.rating}
                    </p>
                    <p>
                      <strong>Review:</strong> {userReview.reviewDescription}
                    </p>
                    <p className="text-sm text-gray-400">
                      Submitted on: {new Date(userReview.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-1">Rating (1-5):</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full p-2 rounded-lg bg-gray-800 text-white"
                    >
                      <option value="0" disabled>
                        Select Rating
                      </option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Review:</label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      rows={4}
                      className="w-full p-2 rounded-lg bg-gray-800 text-white"
                      placeholder="Write your review here..."
                    ></textarea>
                  </div>
                  {reviewError && <p className="text-red-500">{reviewError}</p>}
                  {reviewSuccess && <p className="text-green-500">{reviewSuccess}</p>}
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg"
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              <div className="mt-6">
                <h4 className="text-xl font-semibold mb-4">All Reviews</h4>
                {reviews.length === 0 ? (
                  <p className="text-gray-300">No reviews yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {reviews.map((r) => (
                      <li
                        key={r._id}
                        className={`p-4 rounded-lg border ${
                          r.userId === auth.user?._id
                            ? 'bg-gray-600 border-yellow-500'
                            : 'bg-gray-800 border-gray-700'
                        }`}
                      >
                        <p>
                          <strong>Rating:</strong> {r.rating}
                        </p>
                        <p>
                          <strong>Review:</strong> {r.reviewDescription}
                        </p>
                        <p className="text-sm text-gray-400">
                          Submitted on: {new Date(r.createdAt).toLocaleDateString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
