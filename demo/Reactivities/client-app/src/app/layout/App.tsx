import { Fragment, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  // monitors changes in state! (will be moved to centralized store)
  const {activityStore} = useStore();

  useEffect(() => {
    activityStore.loadActivities(); 
  }, [activityStore])

  //check if the screen is in "loading" state
  if (activityStore.loadingInitial) return <LoadingComponent content='Loading App' />

  // 1 Element per react component (NavBar and Container = 2 elements at same level)
  return (
    <Fragment> 
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard />
      </Container>
    </Fragment>
  );
}

export default observer(App);
