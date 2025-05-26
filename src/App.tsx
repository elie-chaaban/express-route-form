/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "dabb4bc3-e7cf-4bbd-8162-6b326e335d9d",
    authority:
      "https://login.microsoftonline.com/7e3b2087-fa1d-486e-91b2-393c709765b1",
    redirectUri: window.location.origin,
  },
};
const FUNCTION_URL =
  "https://express-route-form-email.azurewebsites.net/api/express-route-form-email";

const msalInstance = new PublicClientApplication(msalConfig);

export default function App() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    company: "",
    location: "",
    geo: "",
    bandwidth: 50,
    customBandwidth: "",
    azureRegion: "",
  });
  const submitForm = async () => {
    setStatus("Sending...");
    try {
      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        body: JSON.stringify({
          //@ts-ignore
          name: user?.name,
          //@ts-ignore
          email: user?.username, // This is usually the email in MSAL
          message: `
            Company: ${form.company}
            Location: ${form.location}
            Geolocation: ${form.geo}
            Bandwidth: ${form.customBandwidth || form.bandwidth} Mb
            Azure Region: ${form.azureRegion}
          `,
        }),
      });

      const text = await response.text();
      if (response.ok) {
        setStatus("✅ Email sent successfully!");
        setForm({
          company: "",
          location: "",
          geo: "",
          bandwidth: 50,
          customBandwidth: "",
          azureRegion: "",
        });
      } else {
        setStatus(`❌ Failed: ${text}`);
      }
    } catch (err) {
      console.error(err);
      //@ts-ignore
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        // ✅ Initialize MSAL instance
        await msalInstance.initialize();

        // ✅ Handle redirect response
        const response = await msalInstance.handleRedirectPromise();
        const account = response?.account || msalInstance.getAllAccounts()[0];

        if (account) {
          //@ts-ignore
          setUser(account);
        } else {
          await msalInstance.loginRedirect();
        }
      } catch (error) {
        console.error("MSAL Init/Login error:", error);
      }
    };

    initAuth();
  }, []);
  const handleGeoLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((f) => ({
        ...f,
        geo: `Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude}`,
      }));
    });
  };

  //@ts-ignore
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  return user ? (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-xl w-full">
        <div className="flex justify-center mb-6">
          <img
            src={"/logo.svg"}
            alt="Company Logo"
            className="h-16 drop-shadow-lg"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Express Route Request Form
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">
              Customer Company Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-4 py-2 mt-1"
              value={form.company}
              onChange={(e) => handleChange("company", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Name of Requester
            </label>
            <input
              type="text"
              readOnly
              className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-2 mt-1"
              //@ts-ignore
              value={user.name}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Customer Location / Datacenter (Address)
            </label>
            <textarea
              className="w-full border border-gray-300 rounded px-4 py-2 mt-1"
              rows={2}
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
            <button
              className="text-sm text-blue-600 mt-2 underline"
              onClick={handleGeoLocation}
            >
              Get Geolocation
            </button>
            <input
              readOnly
              value={form.geo}
              className="w-full border border-gray-300 rounded px-4 py-2 mt-1 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Bandwidth (Mb)
            </label>
            <input
              type="range"
              min={50}
              max={1000}
              step={50}
              value={form.bandwidth}
              onChange={(e) =>
                handleChange("bandwidth", parseInt(e.target.value))
              }
              className="w-full mt-1"
            />
            <div className="text-sm text-gray-600 mt-1">
              Selected: {form.bandwidth} Mb
            </div>
            <div className="mt-2">
              Or specify custom (multiples of 50):
              <input
                type="number"
                step={50}
                placeholder="e.g. 750"
                className="ml-2 border rounded px-2 py-1 w-32"
                onChange={(e) =>
                  handleChange("customBandwidth", e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Destination Azure DataCenter
            </label>
            <select
              value={form.azureRegion}
              onChange={(e) => handleChange("azureRegion", e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 mt-1"
            >
              <option value="">-- Select --</option>
              <option value="Dubai North">Dubai North</option>
              <option value="Dubai Center">Dubai Center</option>
              <option value="Frankfurt">Frankfurt</option>
              <option value="Stockholm">Stockholm</option>
            </select>
          </div>

          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4"
            onClick={submitForm}
          >
            Submit Request
          </button>
          {status && (
            <div className="mt-4 text-center text-sm text-gray-700">
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-gray-600">Loading...</p>
    </div>
  );
}
