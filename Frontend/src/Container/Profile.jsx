import React from 'react';
import { NavLink } from 'react-router-dom';

const Profile = ({ name, image, description , Enroll }) => {
  // Convert name to lowercase and replace spaces with hyphens
  const formattedName = name.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg mt-6 w-96 bg-blue-300 p-4"> {/* Added padding to the card */}
      {/* Image that fits perfectly in the card box */}
      <img
        src={image}
        alt="profile-image"
        className="w-full h-56 object-cover rounded-lg" // Image fits the card box with correct proportions and rounded corners
      />
      <div className="px-6 py-4">
        <h5 className="text-blue-gray-700 text-xl font-semibold mb-2">{name}</h5>
        <p className="text-gray-700 text-base mb-4">
          {description}
        </p>
      </div>
      <div className="px-6 pb-6 pt-2"> {/* Added padding to the button container */}
        <NavLink
          to={`/appo/${formattedName}_${Enroll}`} // Dynamically create the URL based on the formatted name
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Appointment
        </NavLink>
      </div>
    </div>
  );
};

export default Profile;
