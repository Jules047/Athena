import * as React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TimelineIcon from '@mui/icons-material/Timeline';
import MessageIcon from '@mui/icons-material/Message';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

import Administrators from './Administrators/Administrators';
import IntranetSettings from './Parametre_intranet/IntranetSettings';
import FabricationOrders from '../ProjectPage';
import DailyReports from './DailyReports';
import Messaging from './Messaging';
import Agenda from './Agenda';
import Users from './Administrators/Users';
import Orders from './Administrators/Orders';
import Statistics from '../Dashboard/Administrators/Statistics';
import CollaboratorPage from './Parametre_intranet/CollaboratorPage';
import AtelierPage from './Parametre_intranet/AtelierPage';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import ProjectPage from './../ProjectPage';

const drawerWidth = 240;
const miniDrawerWidth = 60;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: theme.spacing(3),
  marginTop: theme.spacing(8),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `${miniDrawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `${drawerWidth}px`,
  }),
}));

interface AppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    width: `calc(100% - ${miniDrawerWidth}px)`,
    marginLeft: `${miniDrawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const DrawerContent = styled(Drawer)(({ theme, open }) => ({
  width: open ? drawerWidth : miniDrawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  boxSizing: 'border-box',
  ...(!open && {
    width: miniDrawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    '& .MuiDrawer-paper': {
      width: miniDrawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  }),
  ...(open && {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  }),
}));

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [openAdmin, setOpenAdmin] = React.useState(false);
  const [openIntranet, setOpenIntranet] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickAdmin = () => {
    setOpenAdmin(!openAdmin);
  };

  const handleClickIntranet = () => {
    setOpenIntranet(!openIntranet);
  };

  const handleLogoutClick = () => {
    setDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setDialogOpen(false);
    navigate('/login');
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard_1
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <div>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Mon compte</MenuItem>
              <MenuItem onClick={handleLogoutClick}>Deconnecter</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <DrawerContent variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : null}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItemButton onClick={handleClickAdmin}>
            <ListItemIcon>
              <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Administrateurs" />
            {openAdmin ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openAdmin} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="administrators/users">
                <ListItemIcon>
                  <SupervisedUserCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Utilisateurs" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="administrators/orders">
                <ListItemIcon>
                  <LocalShippingOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Commande" />
              </ListItemButton>
            </List>
          </Collapse>
          <ListItemButton onClick={handleClickIntranet}>
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary="Paramètres Intranet" />
            {openIntranet ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openIntranet} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="intranet-settings/collaborator">
                <ListItemIcon>
                  <GroupsIcon />
                </ListItemIcon>
                <ListItemText primary="Collaborateur" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="intranet-settings/atelier">
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Atelier" />
              </ListItemButton>
            </List>
          </Collapse>
          <ListItemButton component={Link} to="fabrication-orders">
            <ListItemIcon>
              <AssignmentTurnedInIcon />
            </ListItemIcon>
            <ListItemText primary="Ordres de Fabrication" />
          </ListItemButton>
          <ListItemButton component={Link} to="daily-reports">
            <ListItemIcon><TimelineIcon /></ListItemIcon>
            <ListItemText primary="Rapport Journalier d'activités" />
          </ListItemButton>
          <ListItemButton component={Link} to="messaging">
            <ListItemIcon><MessageIcon /></ListItemIcon>
            <ListItemText primary="Messagerie Intranet" />
          </ListItemButton>
          <ListItemButton component={Link} to="agenda">
            <ListItemIcon><DateRangeIcon /></ListItemIcon>
            <ListItemText primary="Agenda" />
          </ListItemButton>
          <Divider />
          <ListItemButton component={Link} to="statistics">
            <ListItemIcon><LeaderboardIcon /></ListItemIcon>
            <ListItemText primary="Statistique" />
          </ListItemButton>
        </List>
      </DrawerContent>
      <Main open={open}>
        <DrawerHeader />
        <Routes>
          <Route path="/" element={<Statistics />} />
          <Route path="administrators/*" element={<Administrators />} />
          <Route path="administrators/users" element={<Users />} />
          <Route path="administrators/orders" element={<Orders />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="intranet-settings" element={<IntranetSettings />} />
          <Route path="intranet-settings/collaborator" element={<CollaboratorPage />} />
          <Route path="intranet-settings/atelier" element={<AtelierPage />} />
          <Route path="fabrication-orders" element={<FabricationOrders />} />
          <Route path="daily-reports" element={<DailyReports />} />
          <Route path="messaging" element={<Messaging />} />
          <Route path="agenda" element={<Agenda />} />
        </Routes>
      </Main>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle>Confirmer la déconnexion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir vous déconnecter ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleLogoutConfirm} color="primary" autoFocus>
            Deconnecter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
