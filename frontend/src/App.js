import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import theme from "assets/theme";
import ProfileInfoCard from "Pages/Test";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

import WelcomePage from "./Pages/Welcome.js";

function ConfigurationPage() {
  return (
    <div>
      <h1>Configuration Page</h1>
    </div>
  );
}

function AboutUsPage() {
  return (
    <div>
      <h1>About Us Page</h1>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/*"
            element={
              <ProfileInfoCard
                title="profile information"
                description="Hi, I’m Mark Johnson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
                info={{
                  fullName: "Mark Johnson",
                  mobile: "(44) 123 1234 123",
                  email: "mark@simmmple.com",
                  location: "United States",
                }}
                social={[
                  {
                    link: "https://www.facebook.com/CreativeTim/",
                    icon: <FacebookIcon />,
                    color: "facebook",
                  },
                  {
                    link: "https://twitter.com/creativetim",
                    icon: <TwitterIcon />,
                    color: "twitter",
                  },
                  {
                    link: "https://www.instagram.com/creativetimofficial/",
                    icon: <InstagramIcon />,
                    color: "instagram",
                  },
                ]}
              />
            }
          />
          <Route path="/configuration" element={<ConfigurationPage />} />
          <Route path="/about" element={<AboutUsPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
