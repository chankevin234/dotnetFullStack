import { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';

function App() {
  const location = useLocation();
  
  return (
    // 1 Element per react component (NavBar and Container = 2 elements at same level)
    /* location.pathname checks whether the address is '/' to show the homepage, 
    otherwise, it shows the navbar and outlet routes */
    <Fragment>
      <ToastContainer position='bottom-right' theme='colored' />
      {location.pathname === '/' ? <HomePage /> : (
        <Fragment>
          <NavBar />
            <Container style={{marginTop: '7em'}}>
              <Outlet />
            </Container>
        </Fragment>
      )}   
    </Fragment>
  );
}

export default observer(App);
