import './App.css';
import React, { useState, useEffect } from "react";
import { Grid, Paper, Box, Typography, CircularProgress } from "@mui/material"; 
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  const triggerRefresh = () => {
    console.log("Trigger refresh sidebar...");
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetch("http://localhost:8081/admin/session", { 
      method: "GET",
      credentials: "include" 
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("No session");
      })
      .then((userData) => {
        setIsLoggedIn(true);
        setUser(userData);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); 

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  // Refresh session / user info after profile update
  const handleProfileUpdate = () => {
    fetch("http://localhost:8081/admin/session", { method: "GET", credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then((userData) => {
        if (userData) setUser(userData);
        triggerRefresh();
      })
      .catch(() => {});
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar 
              isLoggedIn={isLoggedIn} 
              user={user} 
              onLogout={handleLogout} 
              onUploadSuccess={triggerRefresh} 
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 8 }} />

          <Grid item sm={3}>
            <Paper elevation={3} sx={{ height: '80vh', overflow: 'auto', p: 1 }}>
              {isLoggedIn ? (
            
                <UserList key={refreshTrigger} /> 
              ) : (
                <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
                  Vui lòng đăng nhập
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item sm={9}>
            <Paper elevation={3} sx={{ height: '80vh', overflow: 'auto', p: 2 }}>
              <Routes>
                {isLoggedIn ? (
                  <>
                    <Route path="/users/:userId" element={<UserDetail loggedInUser={user} onActionSuccess={triggerRefresh} onProfileUpdate={handleProfileUpdate} />} />
                    <Route path="/photos/:userId" element={
                      <UserPhotos 
                        loggedInUser={user} 
                        onActionSuccess={triggerRefresh} 
                      />
                    } />
                    <Route path="/login-register" element={<Navigate to={user ? `/users/${user._id}` : "/"} />} />
                    <Route path="/" element={<Navigate to={user ? `/users/${user._id}` : "/"} />} />
                  </>
                ) : (
                  <>
                    <Route path="/login-register" element={<LoginRegister onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="*" element={<Navigate to="/login-register" />} />
                  </>
                )}
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Router>
  );
}

export default App;