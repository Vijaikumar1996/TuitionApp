import { BrowserRouter as Router, Routes, Route } from "react-router";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

import SignIn from "./pages/AuthPages/SignIn";
// import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";

import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import StudentsList from "./pages/Students/StudentsList";
import CreateStudent from "./pages/Students/CreateStudent";
import CourseList from "./pages/Courses/CourseList";
import CreateCourse from "./pages/Courses/CreateCourse";
import BatchList from "./pages/Batches/BatchList";
import CreateBatch from "./pages/Batches/CreateBatch";
import CreatePayment from "./pages/Payment/CreatePayment";
import PaymentList from "./pages/Payment/PaymentList";
import MachineList from "./pages/Machines/MachineList";
import CreateMachine from "./pages/Machines/CreateMachine";
import Reports from "./pages/Reports/Reports";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import GlobalLoader from "./components/loader/GlobalLoader";
import Home from "./pages/Dashboard/Home";
import EnrollmentList from "./pages/Enrollments/EnrollmentList";
import CreateEnrollment from "./pages/Enrollments/CreateEnrollment";
import FeesPage from "./pages/Fees/FeesPage";
import PrivateRoute from "./PrivateRoute";

export default function App() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isLoading = isFetching || isMutating;

  // ✅ Detect mobile screen
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      {isLoading ? <GlobalLoader /> : null}

      <Router>
        <ScrollToTop />

        {/* ✅ Responsive Toaster */}
        <Toaster
          position={isMobile ? "bottom-center" : "top-center"}
          reverseOrder={false}
          gutter={8}
          containerStyle={
            isMobile
              ? { bottom: 20 }
              : { top: 20 }
          }
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: "14px",
              zIndex: 999999,
              borderRadius: "8px",
              padding: "12px 16px",
            },
          }}
        />

        <Routes>
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/home" element={<Home />} />

              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/students" element={<StudentsList />} />
              <Route path="/enrollments" element={<EnrollmentList />} />
              <Route path="/enrollment/create" element={<CreateEnrollment />} />
              <Route path="/student/create" element={<CreateStudent />} />
              <Route path="/batches" element={<BatchList />} />
              <Route path="/batch/create" element={<CreateBatch />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/course/create" element={<CreateCourse />} />
              <Route path="/payment/create" element={<CreatePayment />} />
              <Route path="/payments" element={<PaymentList />} />
              <Route path="/fees" element={<FeesPage />} />
              <Route path="/reports" element={<Reports />} />

              <Route path="/machines" element={<MachineList />} />
              <Route path="/machine/create" element={<CreateMachine />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>
          </Route>

          {/* Auth Layout */}
          <Route path="/" element={<SignIn />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

