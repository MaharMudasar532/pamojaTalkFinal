//imports
import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme.js";
// global
import Topbar from "./pages/global/Topbar.jsx";
import Sidebar from "./pages/global/Sidebar.jsx";
//settings
import Updatepassword from "./pages/updatepassword/index.jsx";
import Dashboard from "./pages/dashboard/index.jsx";
//auth
import CheckOTP from "./pages/auth/CheckOTP.js";
import Emailverification from "./pages/auth/emailVerification.js";
import Setnewpassword from "./pages/auth/Setnewpassword.js";
import LoginPage from "./pages/auth/loginPage.js"
//polling
import ManagePoll from "./pages/ManagePoll/index.jsx"
import AddPoll from "./pages/AddPoll/index.jsx"
import UpdatePoll from "./pages/UpdatePoll/index.jsx"
//ad
import ManageBannersAds from "./pages/manageBannersAds/index.jsx"
import AddExercise from "./pages/add_AD/index.jsx"
import UpdateExercise from "./pages/updateAD/index.jsx"
//categories
import Categories from "./pages/categories/index.jsx"
import AddCategory from "./pages/AddCategory/index.jsx"
import UpdateCategory from "./pages/EditCategory/index.jsx"
//posts
import ManagePosts from "./pages/ManagePosts/index.jsx"
import EditMerchandise from "./pages/EditPost/index.jsx"
import AddMerchandise from "./pages/addPost/index.jsx"
//users
import ManageUsers from "./pages/ManageUsers/index.jsx"
//products // items 
import ManageItems from "./pages/ManageItems/index.jsx"
import AddItem from "./pages/addItem/index.jsx"
import EditItem from "./pages/EditItem/index.jsx"
//profile
import Profile from "./pages/profile/Profile.jsx";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.location.pathname === '/' && window.location.pathname === '/emailverification' && window.location.pathname === '/setnewpassword') {
      setIsSidebar(false);

    }
  }, []);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {localStorage.getItem('jwtoken') &&
            <Sidebar isSidebar={isSidebar} />
          }
          <main className="content">
            {localStorage.getItem('jwtoken') &&
              <Topbar setIsSidebar={setIsSidebar} />
            }
            {localStorage.getItem('jwtoken') ?
              <Routes>
                <Route path={`/*`} element={<Dashboard />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/ManageUsers" element={<ManageUsers />} />

                <Route path="/ManagePoll" element={<ManagePoll />} />
                <Route path="/AddPoll" element={<AddPoll />} />
                <Route path="/UpdatePoll" element={<UpdatePoll />} />

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/manage_banners_ads" element={<ManageBannersAds />} />
                <Route path="/updateexercise" element={<UpdateExercise />} />
                <Route path="/addexercise" element={<AddExercise />} />

                <Route path="/ManageItems" element={<ManageItems />} />
                <Route path="/AddItem" element={<AddItem />} />
                <Route path="/EditItem" element={<EditItem />} />

                <Route path="/categories" element={<Categories />} />
                <Route path="/AddCategory" element={<AddCategory />} />
                <Route path="/UpdateCategory" element={<UpdateCategory />} />

                <Route path="/AddMerchandise" element={<AddMerchandise />} />
                <Route path="/ManagePosts" element={<ManagePosts />} />
                <Route path="/EditMerchandise" element={<EditMerchandise />} />

                <Route path="/updatepassword" element={<Updatepassword />} />

                <Route path="/profile" element={<Profile />} />
              </Routes>
              :
              <Routes>
                <Route path={`/*`} element={<LoginPage />} />
                <Route path="/" element={<LoginPage />} />
                <Route path="/emailverification" element={<Emailverification />} />
                <Route path="/setnewpassword" element={<Setnewpassword />} />
                <Route path="/check_otp" element={<CheckOTP />} />

                <Route path="*" element={<LoginPage />} />
              </Routes>
            }
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

