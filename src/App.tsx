import { BrowserRouter as Router, Routes, Route } from "react-router";
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
import PendingList from "./pages/Pendings/PendingList";
import Reports from "./pages/Reports/Reports";



import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/student" element={<StudentsList />} />
            <Route path="/student/create" element={<CreateStudent />} />
            <Route path="/batch" element={<BatchList />} />
            <Route path="/batch/create" element={<CreateBatch />} />
            <Route path="/course" element={<CourseList />} />
            <Route path="/course/create" element={<CreateCourse />} />
            <Route path="/payment/create" element={<CreatePayment />} />
            <Route path="/payments" element={<PaymentList />} />
            <Route path="/pendings" element={<PendingList />} />
            <Route path="/reports" element={<Reports />} />

           





            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
