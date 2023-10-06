//imports
import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
// global
import Topbar from "./pages/global/Topbar";
import Sidebar from "./pages/global/Sidebar";
//settings
import Updatepassword from "./pages/updatepassword";
import Dashboard from "./pages/dashboard";
//auth
import CheckOTP from "./pages/auth/CheckOTP";
import Emailverification from "./pages/auth/emailVerification";
import Setnewpassword from "./pages/auth/Setnewpassword";
import LoginPage from "./pages/auth/loginPage.js"
//polling
import ManagePoll from "./pages/ManagePoll"
import AddPoll from "./pages/AddPoll"
import UpdatePoll from "./pages/UpdatePoll"
//ad
import ManageBannersAds from "./pages/manageBannersAds"
import AddExercise from "./pages/add_AD"
import UpdateExercise from "./pages/updateAD"
//categories
import Categories from "./pages/categories"
import AddCategory from "./pages/AddCategory"
import UpdateCategory from "./pages/EditCategory"
//posts
import ManagePosts from "./pages/ManagePosts"
import EditMerchandise from "./pages/EditPost"
import AddMerchandise from "./pages/addPost"
//users
import ManageUsers from "./pages/ManageUsers"
//products // items 
import ManageItems from "./pages/ManageItems"
import AddItem from "./pages/addItem"
import EditItem from "./pages/EditItem"
//profile
import Profile from "./pages/profile/Profile";

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

