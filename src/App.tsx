/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "dabb4bc3-e7cf-4bbd-8162-6b326e335d9d",
    authority:
      "https://login.microsoftonline.com/7e3b2087-fa1d-486e-91b2-393c709765b1",
    redirectUri: window.location.origin, // Use the current origin for redirect
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

export default function App() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    company: "",
    location: "",
    geo: "",
    bandwidth: 50,
    customBandwidth: "",
    azureRegion: "",
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        await msalInstance.initialize();
        const response = await msalInstance.handleRedirectPromise();
        const account = response?.account || msalInstance.getAllAccounts()[0];

        if (account) {
          //@ts-ignore
          setUser(account);
        } else {
          // If no account found after redirect, try silent login or redirect
          await msalInstance.loginRedirect();
        }
      } catch (error) {
        console.error("MSAL Init/Login error:", error);
        // Optionally, display a user-friendly error message
      }
    };

    initAuth();
  }, []);

  const handleGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((f) => ({
            ...f,
            geo: `Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude}`,
          }));
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(
            "Unable to retrieve geolocation. Please enable location services or enter manually."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  //@ts-ignore
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("Form submitted:", form);
    // Here you would typically send the form data to an API
    alert("Form submitted successfully! (Check console for data)");
    // Optionally, reset the form
    setForm({
      company: "",
      location: "",
      geo: "",
      bandwidth: 50,
      customBandwidth: "",
      azureRegion: "",
    });
  };

  return user ? (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-2xl w-full">
        {/* Header with Logo and Title */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="bg-blue-700 p-4 rounded-full -mt-16 mb-4 shadow-lg">
            <img
              src={"/logo.svg"} // Assuming logo.svg is in your public folder
              alt="Company Logo"
              className="h-20 w-20 object-contain" // Adjusted size and object-contain
            />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-4 mb-2">
            Express Route Request
          </h1>
          <p className="text-gray-600 text-center">
            Please fill out the form below to request an Express Route
            connection.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Company Name */}
          <div>
            <label
              htmlFor="company"
              className="block text-gray-700 font-semibold mb-1"
            >
              Customer Company Name
            </label>
            <input
              type="text"
              id="company"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              value={form.company}
              onChange={(e) => handleChange("company", e.target.value)}
              required
            />
          </div>

          {/* Name of Requester */}
          <div>
            <label
              htmlFor="requester"
              className="block text-gray-700 font-semibold mb-1"
            >
              Name of Requester
            </label>
            <input
              type="text"
              id="requester"
              readOnly
              className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2 cursor-not-allowed"
              //@ts-ignore
              value={user.name || user.username || "N/A"} // Fallback for name property
            />
            <p className="text-sm text-gray-500 mt-1">
              This field is pre-filled from your login.
            </p>
          </div>

          {/* Customer Location / Datacenter */}
          <div>
            <label
              htmlFor="location"
              className="block text-gray-700 font-semibold mb-1"
            >
              Customer Location / Datacenter (Address)
            </label>
            <textarea
              id="location"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              rows={3}
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              required
            />
            <button
              type="button" // Important to prevent form submission
              className="text-sm text-blue-600 hover:text-blue-800 mt-2 underline transition duration-150 ease-in-out"
              onClick={handleGeoLocation}
            >
              Get Geolocation
            </button>
            <input
              type="text"
              readOnly
              value={form.geo}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-2 bg-gray-50 cursor-not-allowed"
              placeholder="Geolocation will appear here (Lat: X, Lng: Y)"
            />
          </div>

          {/* Bandwidth (Mb) */}
          <div>
            <label
              htmlFor="bandwidth"
              className="block text-gray-700 font-semibold mb-1"
            >
              Bandwidth (Mb)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                id="bandwidth"
                min={50}
                max={10000} // Increased max for more "pro" options
                step={50}
                value={form.bandwidth}
                onChange={(e) =>
                  handleChange("bandwidth", parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
              />
              <span className="text-lg font-bold text-blue-600 min-w-[70px] text-right">
                {form.bandwidth} Mb
              </span>
            </div>
            <div className="mt-4">
              <label
                htmlFor="customBandwidth"
                className="block text-gray-700 text-sm mb-1"
              >
                Or specify custom (multiples of 50):
              </label>
              <input
                type="number"
                id="customBandwidth"
                step={50}
                placeholder="e.g. 750"
                className="w-full sm:w-auto border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                onChange={(e) =>
                  handleChange("customBandwidth", e.target.value)
                }
                value={form.customBandwidth}
              />
            </div>
          </div>

          {/* Destination Azure DataCenter */}
          <div>
            <label
              htmlFor="azureRegion"
              className="block text-gray-700 font-semibold mb-1"
            >
              Destination Azure DataCenter
            </label>
            <select
              id="azureRegion"
              value={form.azureRegion}
              onChange={(e) => handleChange("azureRegion", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              required
            >
              <option value="">-- Select an Azure Region --</option>
              <option value="East US">East US</option>
              <option value="West US 2">West US 2</option>
              <option value="Central US">Central US</option>
              <option value="North Europe">North Europe</option>
              <option value="West Europe">West Europe</option>
              <option value="Southeast Asia">Southeast Asia</option>
              <option value="East Asia">East Asia</option>
              <option value="Australia East">Australia East</option>
              <option value="Canada Central">Canada Central</option>
              <option value="Brazil South">Brazil South</option>
              <option value="South Africa North">South Africa North</option>
              <option value="UAE North">UAE North</option>{" "}
              {/* Added Dubai North/Center equivalents */}
              <option value="Germany West Central">
                Germany West Central
              </option>{" "}
              {/* Frankfurt equivalent */}
              <option value="Sweden Central">Sweden Central</option>{" "}
              {/* Stockholm equivalent */}
              {/* Add more Azure regions as needed */}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out text-lg"
          >
            Submit Express Route Request
          </button>
        </form>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-3">
        <svg
          className="animate-spin h-6 w-6 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-lg text-gray-700">Loading authentication...</p>
      </div>
    </div>
  );
}
