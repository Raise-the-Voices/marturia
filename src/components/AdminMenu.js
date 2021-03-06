import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import ViewAllUsers from '../components/Viewallusers';
import CreateUser from '../components/Createuser';
import SetReportStatus from '../components/SetReportStatus';
import OptionMenu from '../components/OptionsMenu';
import { tokenIsStillValid } from '../utils/utils';

const routes = [
  {
    path: '/admin/1',
    sidebar: () => <div>Create User</div>,
    main: () => <CreateUser />,
  },
  {
    path: '/admin/2',
    sidebar: () => <div>View All Users</div>,
    main: () => <ViewAllUsers />,
  },
  {
    path: '/admin/3',
    sidebar: () => <div>Manage Reports</div>,
    main: () => <SetReportStatus />,
  },
  {
    path: '/admin/4',
    sidebar: () => <div>Options Menu</div>,
    main: () => <OptionMenu />,
  },
];

const AdminMenu = () => {
  if (!tokenIsStillValid()) {
    return <Redirect to='/login' />;
  }

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    window.location.reload();
  };
  const localStorageName = localStorage.getItem('name');
  const localStorageRole = localStorage.getItem('role');
  const adminRole = 'admin';

  return (
    <Router>
      <div className='admin-wrapper'>
        <div className='admin-choice-container'>
          <ul>
            {localStorageName && (
              <li>
                <div>Hi, {localStorageName}</div>
              </li>
            )}
            {localStorageRole === adminRole && (
              <>
                <li>
                  <Link to='/admin/1'>Create User</Link>
                </li>
                <li>
                  <Link to='/admin/2'>View All Users</Link>
                </li>
              </>
            )}
            <li>
              <Link to='/admin/3'>Manage Reports</Link>
            </li>
            {localStorageRole === adminRole && (
              <li>
                <Link to='/admin/4'>Options Menu</Link>
              </li>
            )}
            <li>
              <Link onClick={logout} to=''>
                Logout
              </Link>
            </li>
          </ul>
        </div>

        <div className='admin-container'>
          <Switch>
            {routes.map((route, index) => (
              // Render more <Route>s with the same paths as
              // above, but different components this time.
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                children={<route.main />}
              />
            ))}
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default AdminMenu;
