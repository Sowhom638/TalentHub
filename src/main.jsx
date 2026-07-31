import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store } from './redux/store';
import SignUp from './pages/SignUp.jsx'
import Login from './pages/Login.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Jobs from './pages/Jobs.jsx'
import CreateJob from './pages/CreateJob.jsx'
import RecruiterDashboard from './pages/RecruiterDashboard.jsx'
import JobDetails from './pages/JobDetails.jsx'
import Bookmarks from './pages/Bookmarks.jsx'
import JobApplicants from './pages/JobApplicants.jsx'
import Profile from './pages/Profile.jsx'
import EditProfile from './pages/EditProfile.jsx'
import EditJob from './pages/EditJob.jsx'
import ApplicantDashboard from './pages/ApplicantDashboard.jsx'
import ApplicantApplications from './pages/ApplicantApplications.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/jobs",
    element: (
      <ProtectedRoute>
        <Jobs />
      </ProtectedRoute>
    )
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: "/applicants", // r
    element: (
      <ProtectedRoute>
        <JobApplicants />
      </ProtectedRoute>
    )
  },
  {
    path: "/applications", // a
    element: (
      <ProtectedRoute>
        <ApplicantApplications />
      </ProtectedRoute>
    )
  },
  {
    path: "/editprofile",
    element: (
      <ProtectedRoute>
        <EditProfile />
      </ProtectedRoute>
    )
  },
  {
    path: "/jobs/:jobId",
    element: (
      <ProtectedRoute>
        <JobDetails />
      </ProtectedRoute>
    )
  },
  {
    path: "/jobs/:jobId/edit", // r
    element: (
      <ProtectedRoute>
        <EditJob />
      </ProtectedRoute>
    )
  },
  {
    path: "/recruiter/dashboard", // r
    element: (
      <ProtectedRoute>
        <RecruiterDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/applicant/dashboard", // a
    element: (
      <ProtectedRoute>
        <ApplicantDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/bookmarks", // a
    element: (
      <ProtectedRoute>
        <Bookmarks />
      </ProtectedRoute>
    )
  },
  {
    path: "/createjob", // r
    element: (
      <ProtectedRoute>
        <CreateJob />
      </ProtectedRoute>
    )
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)