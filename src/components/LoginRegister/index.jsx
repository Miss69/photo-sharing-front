import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Link } from "@mui/material";
import { API_BASE } from "../../config";

function LoginRegister({ onLoginSuccess }) {
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");

  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");

  const [regData, setRegData] = useState({
    login_name: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login_name: loginName, password: password }),
      credentials: "include",
    })
      .then((res) =>
        res.ok
          ? res.json()
          : res.text().then((t) => {
              throw new Error(t);
            })
      )
      .then((user) => {
        setError("");
        onLoginSuccess(user);
      })
      .catch((err) => setError("Sai tài khoản hoặc mật khẩu!"));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (regData.password !== regData.confirm_password) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    const url = `${API_BASE}/api/user`;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(regData),
      credentials: "include",
    })
      .then(async (res) => {
        if (res.ok) {
          alert("Đăng ký thành công! Hãy đăng nhập.");
          setMode("login");
          setError("");
          return;
        }

        // Read response safely and extract a readable message (handle JSON or HTML)
        const ct = res.headers.get("content-type") || "";
        let text = await res.text();
        let message = text;
        if (ct.includes("application/json")) {
          try {
            const j = JSON.parse(text);
            message = j.message || j.error || JSON.stringify(j);
          } catch (e) {}
        } else {
          // strip HTML tags if server returned an HTML error page (e.g., "Cannot POST /user")
          message = text.replace(/<[^>]+>/g, "").trim();
        }

        throw new Error(message || "Lỗi đăng ký");
      })
      .catch((err) => {
        const raw = (err.message || "").toLowerCase();

        // Common duplicate key patterns
        if (
          raw.includes("duplicate") ||
          raw.includes("e11000") ||
          raw.includes("login_name") ||
          raw.includes("login name") ||
          raw.includes("đã tồn tại") ||
          raw.includes("exists")
        ) {
          setError("Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.");
          return;
        }

        // If server returned a 'Cannot POST /user' HTML page, show a clearer message
        if (
          raw.includes("cannot post") ||
          raw.includes("cannot post /user") ||
          raw.includes("<!doctype html>")
        ) {
          setError(
            "Lỗi máy chủ: endpoint đăng ký không tồn tại hoặc cấu hình sai. Vui lòng kiểm tra backend."
          );
          return;
        }

        // Default: show the server message (already cleaned of HTML)
        setError(err.message || "Lỗi khi đăng ký");
      });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, width: "450px" }}>
        {mode === "login" ? (
          <Box>
            <Typography variant="h5" align="center" gutterBottom>
              Đăng nhập
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Login Name"
                margin="normal"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
              >
                Đăng nhập
              </Button>
            </form>
            <Typography align="center">
              Chưa có tài khoản?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
              >
                Đăng ký ngay
              </Link>
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="h5" align="center" gutterBottom>
              Đăng ký tài khoản
            </Typography>
            <form onSubmit={handleRegister}>
              <TextField
                fullWidth
                label="Login Name*"
                size="small"
                margin="dense"
                onChange={(e) =>
                  setRegData({ ...regData, login_name: e.target.value })
                }
                required
              />
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  label="First Name*"
                  size="small"
                  margin="dense"
                  onChange={(e) =>
                    setRegData({ ...regData, first_name: e.target.value })
                  }
                  required
                />
                <TextField
                  fullWidth
                  label="Last Name*"
                  size="small"
                  margin="dense"
                  onChange={(e) =>
                    setRegData({ ...regData, last_name: e.target.value })
                  }
                  required
                />
              </Box>
              <TextField
                fullWidth
                label="Password*"
                type="password"
                size="small"
                margin="dense"
                onChange={(e) =>
                  setRegData({ ...regData, password: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                label="Confirm Password*"
                type="password"
                size="small"
                margin="dense"
                onChange={(e) =>
                  setRegData({ ...regData, confirm_password: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                label="Location"
                size="small"
                margin="dense"
                onChange={(e) =>
                  setRegData({ ...regData, location: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Occupation"
                size="small"
                margin="dense"
                onChange={(e) =>
                  setRegData({ ...regData, occupation: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Description"
                size="small"
                margin="dense"
                multiline
                rows={2}
                onChange={(e) =>
                  setRegData({ ...regData, description: e.target.value })
                }
              />
              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
              >
                Đăng ký ngay
              </Button>
            </form>
            <Typography align="center">
              Đã có tài khoản?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
              >
                Quay lại Đăng nhập
              </Link>
            </Typography>
          </Box>
        )}
        {error && (
          <Typography
            color="error"
            variant="body2"
            align="center"
            sx={{ mt: 2, p: 1, bgcolor: "#ffebee" }}
          >
            {error}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default LoginRegister;
