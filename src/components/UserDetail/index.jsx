import React, { useState, useEffect } from "react";
import { Typography, Box, TextField, Button, Paper } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { API_BASE } from "../../config";

function UserDetail({ loggedInUser, onActionSuccess, onProfileUpdate }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });
  const [message, setMessage] = useState("");

  const isOwner = loggedInUser && String(loggedInUser._id) === String(userId);

  useEffect(() => {
    fetchModel(`${API_BASE}/api/user/${userId}`)
      .then((res) => {
        setUser(res.data);
        setForm({
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          location: res.data.location || "",
          description: res.data.description || "",
          occupation: res.data.occupation || "",
        });
      })
      .catch(() => {
        setUser(null);
      });
  }, [userId]);

  const handleSave = () => {
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setMessage("First name and last name are required");
      return;
    }

    fetch(`${API_BASE}/api/user/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    })
      .then(async (res) => {
        if (res.ok) return res.json();
        const text = await res.text();
        throw new Error(text || "Cập nhật thất bại");
      })
      .then((updated) => {
        setUser(updated);
        setEditMode(false);
        setMessage("Cập nhật thành công");
        if (onActionSuccess) onActionSuccess();
        if (isOwner && onProfileUpdate) onProfileUpdate();
      })
      .catch((err) => setMessage(err.message || "Lỗi hệ thống"));
  };

  if (!user)
    return (
      <Typography sx={{ p: 2 }}>Đang tải thông tin người dùng...</Typography>
    );

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">
            {user.first_name} {user.last_name}
          </Typography>
          <Box>
            <Button
              variant="outlined"
              sx={{ mr: 1 }}
              onClick={() => navigate(`/photos/${userId}`)}
            >
              Xem ảnh
            </Button>
            {isOwner && (
              <Button
                variant="contained"
                onClick={() => setEditMode((s) => !s)}
              >
                {editMode ? "Hủy" : "Sửa hồ sơ"}
              </Button>
            )}
          </Box>
        </Box>

        {message && (
          <Typography
            color={message.includes("thành công") ? "green" : "error"}
            sx={{ mt: 1 }}
          >
            {message}
          </Typography>
        )}

        <Box sx={{ mt: 2 }}>
          <TextField
            label="First Name"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            fullWidth
            margin="dense"
            InputProps={{ readOnly: !editMode }}
          />
          <TextField
            label="Last Name"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            fullWidth
            margin="dense"
            InputProps={{ readOnly: !editMode }}
          />
          <TextField
            label="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            fullWidth
            margin="dense"
            InputProps={{ readOnly: !editMode }}
          />
          <TextField
            label="Occupation"
            value={form.occupation}
            onChange={(e) => setForm({ ...form, occupation: e.target.value })}
            fullWidth
            margin="dense"
            InputProps={{ readOnly: !editMode }}
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            fullWidth
            margin="dense"
            multiline
            rows={3}
            InputProps={{ readOnly: !editMode }}
          />

          {editMode && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ mr: 1 }}
              >
                Lưu
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setEditMode(false);
                  setForm({
                    first_name: user.first_name || "",
                    last_name: user.last_name || "",
                    location: user.location || "",
                    description: user.description || "",
                    occupation: user.occupation || "",
                  });
                  setMessage("");
                }}
              >
                Hủy
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default UserDetail;
