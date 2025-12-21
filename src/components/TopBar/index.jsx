import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

function TopBar({ isLoggedIn, user, onLogout }) {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    fetch("http://localhost:8081/api/photo/new", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          alert("Tải ảnh thành công!");
          window.location.reload();
        } else {
          res.text().then((text) => alert("Lỗi: " + text));
        }
      })
      .catch((err) => console.error("Lỗi upload:", err));
  };

  const handleLogout = () => {
    fetch("http://localhost:8081/admin/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(() => {
        onLogout();
      })
      .catch((err) => console.error("Lỗi đăng xuất:", err));
  };

  return (
    <AppBar position="absolute">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" color="inherit">
          Photo Sharing App
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isLoggedIn ? (
            <>
              <Button variant="contained" color="info" component="label">
                Add Photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleUpload}
                />
              </Button>

              <Typography variant="body1">Hi {user?.first_name}</Typography>

              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Typography variant="body1">Please Login</Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
