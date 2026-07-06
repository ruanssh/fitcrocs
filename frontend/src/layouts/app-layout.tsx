import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { BarChart3, ChevronDown, ClipboardList, LogOut, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/use-auth';

const navButtonSx = {
  border: 'none',
  '&:hover': { border: 'none' },
  '&.active': { color: 'primary.main' },
} as const;

export function AppLayout() {
  const { t } = useTranslation('common');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const initials = useMemo(() => {
    const name = user?.name?.trim();
    if (!name) return 'U';

    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? 'U';

    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }, [user?.name]);

  const bottomNavValue = location.pathname.startsWith('/workouts')
    ? '/workouts'
    : '/dashboard';

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <AppBar position="sticky">
        <Toolbar disableGutters>
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3 md:gap-8">
              <Typography variant="overline" color="primary" component="p">
                {t('brand')}
              </Typography>

              <nav className="hidden items-center gap-1 md:flex">
                <Button
                  component={NavLink}
                  to="/dashboard"
                  variant="text"
                  size="small"
                  startIcon={<BarChart3 className="h-4 w-4" />}
                  sx={navButtonSx}
                >
                  {t('dashboard')}
                </Button>
                <Button
                  component={NavLink}
                  to="/workouts"
                  variant="text"
                  size="small"
                  startIcon={<ClipboardList className="h-4 w-4" />}
                  sx={navButtonSx}
                >
                  {t('workouts')}
                </Button>
              </nav>
            </div>

            <Button
              aria-haspopup="menu"
              aria-expanded={Boolean(menuAnchor)}
              aria-label={t('menu.openUserMenu')}
              onClick={(event) => setMenuAnchor(event.currentTarget)}
              sx={{ px: 1, py: 0.75, textTransform: 'none' }}
            >
              <Avatar
                src={user?.photoBase64 ?? undefined}
                alt={user?.name ?? 'Foto de perfil'}
                sx={{ width: 32, height: 32, mr: 1 }}
              >
                {initials}
              </Avatar>
              <span className="hidden max-w-[160px] truncate sm:block">
                {user?.name ?? '-'}
              </span>
              <ChevronDown
                className={`ml-1 h-4 w-4 transition ${menuAnchor ? 'rotate-180' : ''}`}
              />
            </Button>

            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{ paper: { sx: { width: 224 } } }}
            >
              <li className="border-b border-soot px-4 pb-2 pt-1">
                <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                  {user?.name ?? '-'}
                </Typography>
              </li>
              <MenuItem
                onClick={() => {
                  setMenuAnchor(null);
                  navigate('/profile');
                }}
              >
                <ListItemIcon>
                  <User className="h-4 w-4" />
                </ListItemIcon>
                {t('profile')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setMenuAnchor(null);
                  logout();
                }}
                sx={{ color: 'error.main' }}
              >
                <ListItemIcon>
                  <LogOut className="h-4 w-4" />
                </ListItemIcon>
                {t('logout')}
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      <Outlet />

      <Paper
        className="fixed inset-x-0 bottom-0 z-30 md:hidden"
        sx={{ borderLeft: 'none', borderRight: 'none', borderBottom: 'none' }}
      >
        <BottomNavigation showLabels value={bottomNavValue}>
          <BottomNavigationAction
            component={NavLink}
            to="/dashboard"
            value="/dashboard"
            label={t('dashboard')}
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <BottomNavigationAction
            component={NavLink}
            to="/workouts"
            value="/workouts"
            label={t('workouts')}
            icon={<ClipboardList className="h-5 w-5" />}
          />
        </BottomNavigation>
      </Paper>
    </div>
  );
}
