import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Divider,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { API_BASE } from "../../config";

function UserPhotos({ loggedInUser, onActionSuccess }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState(null);
  const [newComment, setNewComment] = useState({});

  const loadPhotos = useCallback(() => {
    const url = `${API_BASE}/api/photo/photosOfUser/${userId}`;
    fetchModel(url).then((response) => {
      setPhotos(response.data);
    });
  }, [userId]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const handleAddComment = (photoId) => {
    const text = newComment[photoId];
    if (!text?.trim()) return alert("Bình luận không được để trống");
    fetch(`${API_BASE}/api/photo/commentsOfPhoto/${photoId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: text }),
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        setNewComment({ ...newComment, [photoId]: "" });
        loadPhotos();
        if (onActionSuccess) onActionSuccess();
      }
    });
  };

  const handleDeletePhoto = (photoId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa ảnh này?")) return;
    fetch(`${API_BASE}/api/photo/delete/${photoId}`, {
      method: "DELETE",
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        loadPhotos();
        if (onActionSuccess) onActionSuccess();
      } else alert("Lỗi khi xóa ảnh");
    });
  };

  const handleDeleteComment = (photoId, commentId) => {
    if (!window.confirm("Xác nhận xóa bình luận?")) return;
    fetch(`${API_BASE}/api/photo/deleteComment/${photoId}/${commentId}`, {
      method: "DELETE",
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        loadPhotos();
        if (onActionSuccess) onActionSuccess();
      } else alert("Lỗi khi xóa bình luận");
    });
  };

  if (!photos) return <Typography sx={{ p: 2 }}>Đang tải ảnh...</Typography>;

  return (
    <Box>
      {photos.map((photo) => {
        const isPhotoOwner =
          loggedInUser && String(photo.user_id) === String(loggedInUser._id);

        return (
          <Card key={photo._id} sx={{ mb: 4 }}>
            <CardHeader
              title={"Posted: " + new Date(photo.date_time).toLocaleString()}
              action={
                isPhotoOwner && (
                  <Button
                    color="error"
                    variant="outlined"
                    size="small"
                    onClick={() => handleDeletePhoto(photo._id)}
                  >
                    Xóa ảnh
                  </Button>
                )
              }
            />
            <CardMedia
              component="img"
              image={`${API_BASE}/images/${photo.file_name}`}
              sx={{ maxHeight: 600, objectFit: "contain", bgcolor: "#f5f5f5" }}
            />
            <CardContent>
              <Typography variant="h6">Comments</Typography>
              <Divider />
              {photo.comments?.map((c) => {
                const isCommentOwner =
                  loggedInUser &&
                  String(c.user?._id || c.user_id) === String(loggedInUser._id);

                return (
                  <Box
                    key={c._id}
                    sx={{ mt: 2, mb: 1, pl: 2, borderLeft: "2px solid #eee" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2">
                        <Link
                          to={"/users/" + (c.user?._id || c.user_id)}
                          style={{ fontWeight: "bold", textDecoration: "none" }}
                        >
                          {c.user?.first_name} {c.user?.last_name}
                        </Link>
                      </Typography>
                      {isCommentOwner && (
                        <Button
                          color="error"
                          size="small"
                          onClick={() => handleDeleteComment(photo._id, c._id)}
                        >
                          Xóa
                        </Button>
                      )}
                    </Box>
                    <Typography variant="body2">{c.comment}</Typography>
                  </Box>
                );
              })}
              <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Thêm bình luận..."
                  value={newComment[photo._id] || ""}
                  onChange={(e) =>
                    setNewComment({
                      ...newComment,
                      [photo._id]: e.target.value,
                    })
                  }
                />
                <Button
                  variant="contained"
                  onClick={() => handleAddComment(photo._id)}
                >
                  Gửi
                </Button>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}

export default UserPhotos;
