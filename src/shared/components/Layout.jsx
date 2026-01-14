import { useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Badge,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useTranslation } from "react-i18next";

import { useFavoritosStore } from "../state/favoritos";

export default function Layout({ children }) {
  const favoritosCount = useFavoritosStore(
    (s) => Object.keys(s.favoritosById).length
  );

  const { t, i18n } = useTranslation();

  const lang = i18n.language?.startsWith("en") ? "en" : "es";

  const idiomas = useMemo(
    () => [
      { code: "es", label: "Español", flagSrc: "/flags/es.png" },
      { code: "en", label: "English", flagSrc: "/flags/en.png" },
    ],
    []
  );

  const idiomaActivo = idiomas.find((x) => x.code === lang) ?? idiomas[0];

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleChangeLanguage = async (code) => {
    await i18n.changeLanguage(code);
    handleClose();
  };

  return (
    <Box>
      <AppBar position="sticky" elevation={1}>
        <Toolbar sx={{ gap: { xs: 0.5, sm: 1 } }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: 16, sm: 18, md: 20 },
              fontWeight: 800,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: { xs: 160, sm: 260, md: "none" },
            }}
            title={t("app.title")}
          >
            {t("app.title")}
          </Typography>

          <Box sx={{ width: { xs: 8, sm: 24, md: 56 } }} />

          <Tooltip title={t("nav.home")}>
            <IconButton
              component={RouterLink}
              to="/"
              color="inherit"
              aria-label={t("nav.home")}
              size="large"
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t("nav.favorites")}>
            <IconButton
              component={RouterLink}
              to="/favoritos"
              color="inherit"
              aria-label={t("nav.favorites")}
              sx={{ ml: 0.5 }}
              size="large"
            >
              <Badge badgeContent={favoritosCount} color="error">
                <FavoriteIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Box sx={{ flex: 1 }} />

          <Tooltip title={lang === "es" ? "Español" : "English"}>
            <IconButton
              onClick={handleOpen}
              aria-label="Selector de idioma"
              aria-controls={open ? "menu-idioma" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              sx={{
                p: 0.5,
                border: "2px solid",
                borderColor: "primary.main",
              }}
            >
              <Avatar
                src={idiomaActivo.flagSrc}
                alt={idiomaActivo.label}
                sx={{ width: 28, height: 28 }}
              />
            </IconButton>
          </Tooltip>

          <Menu
            id="menu-idioma"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {idiomas.map((opt) => (
              <MenuItem
                key={opt.code}
                selected={opt.code === lang}
                onClick={() => handleChangeLanguage(opt.code)}
              >
                <ListItemIcon>
                  <Avatar
                    src={opt.flagSrc}
                    alt={opt.label}
                    sx={{ width: 22, height: 22 }}
                  />
                </ListItemIcon>
                <ListItemText primary={opt.label} />
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
        {children}
      </Container>
    </Box>
  );
}
