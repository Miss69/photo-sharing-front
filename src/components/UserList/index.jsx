import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Badge,
  Box,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { API_BASE } from "../../config";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchModel(`${API_BASE}/api/user/list`)
      .then((response) => setUsers(response.data))
      .catch((err) => console.error(err));
  }, []);

  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = users.filter((item) => {
    const first = (item.first_name || item.firstname || "").toLowerCase();
    const last = (item.last_name || item.lastname || "").toLowerCase();
    const full = `${first} ${last}`.trim();
    return !q || first.includes(q) || last.includes(q) || full.includes(q);
  });

  return (
    <Box>
      <Typography variant="h6" sx={{ p: 2, fontWeight: "bold" }}>
        Danh sách người dùng
      </Typography>

      <Box sx={{ px: 2, pb: 1 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Tìm kiếm người dùng..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Box>

      <List>
        {filtered.length === 0 ? (
          <Typography sx={{ p: 2, color: "gray" }}>
            Không tìm thấy người dùng.
          </Typography>
        ) : (
          filtered.map((item) => (
            <React.Fragment key={item._id}>
              <ListItem button component={Link} to={`/users/${item._id}`}>
                <ListItemText
                  primary={`${item.first_name || item.firstname || ""} ${
                    item.last_name || item.lastname || ""
                  }`}
                />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Link
                    to={`/photos/${item._id}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{ textDecoration: "none" }}
                  >
                    <Badge
                      badgeContent={item.photoCount}
                      color="success"
                      showZero
                      sx={{ cursor: "pointer" }}
                    >
                      <Typography variant="caption" sx={{ color: "gray" }}>
                        Photos
                      </Typography>
                    </Badge>
                  </Link>
                  <Badge
                    badgeContent={item.commentCount}
                    color="error"
                    showZero
                  >
                    <Typography variant="caption" sx={{ color: "gray" }}>
                      Comments
                    </Typography>
                  </Badge>
                </Box>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))
        )}
      </List>
    </Box>
  );
}
export default UserList;
