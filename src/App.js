import { ThemeProvider } from "styled-components";
import { useEffect, useState } from "react";
import { darkTheme, lightTheme } from "./utils/Themes.js";
import Navbar from "./components/Navbar";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import HeroSection from "./components/HeroSection";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import Education from "./components/Education";
import ProjectDetails from "./components/ProjectDetails";
import styled from "styled-components";
import database from "./components/Firebase/FIrebase.js";

const Body = styled.div`
  background-color: ${({ theme }) => theme.bg};
  width: 100%;
  overflow-x: hidden;
`;

const Wrapper = styled.div`
  background: linear-gradient(
      38.73deg,
      rgba(204, 0, 187, 0.15) 0%,
      rgba(201, 32, 184, 0) 50%
    ),
    linear-gradient(
      141.27deg,
      rgba(0, 70, 209, 0) 50%,
      rgba(0, 70, 209, 0.15) 100%
    );
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 98%, 0 100%);
`;
function App() {
  const [darkMode] = useState(true);
  const [openModal, setOpenModal] = useState({ state: false, project: null });

  useEffect(() => {
    
    const hasLogDetailsBeenInserted =
      localStorage.getItem("logDetailsInserted");

   if (!hasLogDetailsBeenInserted) {
      


      fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      const ip = data.ip;
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile =
        /iphone|ipod|ipad|android|blackberry|windows phone|opera mini|iemobile/.test(
          userAgent
        );
      const device = isMobile ? "Mobile" : "Desktop";

      const now = new Date();

      const visitData = {
        Device: device,
        IP: ip,
      };

      getLocation()
        .then((location) => {
          visitData.Location = location.status
            ? {
              ...location,
            }
            : { Status: "Geolocation not available" };

          if (location.status) {
            const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.Latitude}&lon=${location.Longitude}`;

            return fetch(nominatimUrl)
              .then((response) => response.json())
              .then((details) => {
                visitData.Location.Details = details;
              })
              .catch((error) => {
                console.error("Error fetching details from Nominatim: ", error);
                visitData.Location.Details = { Status: "Details unavailable" };
              });
          } else {
            visitData.Location.Details = { Status: "Details unavailable" };
          }

         
        })
        .finally(() => {

          database
          .ref("logdetails")
          .push(visitData)
          .then(() => {
            console.log("Data appended successfully");
            localStorage.setItem("logDetailsInserted", true);
          })
          .catch((error) => console.error("Error appending data:", error));
        });
    })
    .catch((error) => {
      console.error("Error fetching IP address: ", error);
    });


    }
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Router>
        <Navbar />
        <Body>
          <HeroSection />
          <Wrapper>
            <Skills />
          </Wrapper>
          <Projects openModal={openModal} setOpenModal={setOpenModal} />
          <Wrapper>
            <Education />
          </Wrapper>
          <Footer />
          {openModal.state && (
            <ProjectDetails openModal={openModal} setOpenModal={setOpenModal} />
          )}
        </Body>
      </Router>
    </ThemeProvider>
  );
}


function getLocation() {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            status: true,
            Latitude: position.coords.latitude,
            Longitude: position.coords.longitude,
          });
        },
        () => {
          resolve({ status: false }); // Location unavailable
        }
      );
    } else {
      resolve({ status: false }); // Geolocation not supported
    }
  });
}

export default App;
