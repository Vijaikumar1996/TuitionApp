import { useState, useMemo } from "react";
import { useNavigate } from "react-router";

export default function CourseList() {
  const navigate = useNavigate();

  // ✅ Dummy Data
  const coursesData = [
    { id: 1, name: "8th Standard", description: "State Board", status: "Active" },
    { id: 2, name: "9th Standard", description: "CBSE", status: "Active" },
    { id: 3, name: "Typewriting Lower", description: "Beginner Level", status: "Inactive" },
  ];

  const [search, setSearch] = useState("");

  // ✅ Filter Logic
  const filteredCourses = useMemo(() => {
    return coursesData.filter((course) =>
      course.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="bg-white p-5 rounded-xl shadow">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Courses</h2>

        <button
          onClick={() => navigate("/course/create")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Course
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 border px-3 py-2 rounded"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Course Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Description
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <tr key={course.id} className="border-t hover:bg-gray-50">

                  <td className="px-4 py-3">{course.name}</td>

                  <td className="px-4 py-3 text-gray-600">
                    {course.description}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        course.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 flex gap-3 text-sm">
                    <button
                      onClick={() => navigate(`/courses/edit/${course.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button className="text-red-600 hover:underline">
                      Disable
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                  No courses found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}