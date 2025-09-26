"use client";
import { useState, useEffect } from "react";
import {
  Building2,
  Search,
  Download,
  FileSpreadsheet,
  Plus,
  Users,
} from "lucide-react";

export default function Home() {
  const [name, setName] = useState("");
  const [agencies, setAgencies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all agencies
  const fetchAgencies = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/agencies");
      const data = await res.json();
      setAgencies(data || []); // <- FIX: use data directly
    } catch (error) {
      console.error("Failed to fetch agencies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      setName("");
      await fetchAgencies(); // <- FIX: await to refresh list
    } catch (error) {
      console.error("Failed to register agency:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download CSV or Excel
  const handleDownload = (type: "csv" | "excel") => {
    window.location.href = `/api/download?format=${type}`;
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  const filteredAgencies = agencies.filter((agency) =>
    agency.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Agency Commission Report Registration
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Register agencies that haven't submitted commission reports and
            manage them efficiently
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Registration Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Register New Agency
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="agency-name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Agency Name
                  </label>
                  <input
                    id="agency-name"
                    type="text"
                    placeholder="Enter agency name..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black"
                    value={name}
                    onChange={(e) => {
                      // Only allow English letters, numbers, spaces, and basic punctuation
                      const allowed = e.target.value.replace(
                        /[^a-zA-Z0-9 .,()-]/g,
                        ""
                      );
                      setName(allowed);
                    }}
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!name.trim() || isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Registering...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" />
                      Register Agency
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Agency List */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Registered Agencies
                </h2>
                <div className="bg-white/20 px-3 py-1 rounded-full">
                  <span className="text-white text-sm font-medium">
                    {filteredAgencies.length}{" "}
                    {filteredAgencies.length === 1 ? "agency" : "agencies"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Search Box */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search agencies..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Agency List */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 text-gray-600">
                      Loading agencies...
                    </span>
                  </div>
                ) : filteredAgencies.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      {agencies.length === 0
                        ? "No agencies registered yet"
                        : "No agencies match your search"}
                    </p>
                  </div>
                ) : (
                  filteredAgencies.map((agency, index) => (
                    <div
                      key={agency.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-150"
                    >
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-medium text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-gray-800 font-medium">
                        {agency.name}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Download Buttons */}
              {agencies.length > 0 && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleDownload("excel")}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Excel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
