import { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityFilters from "./ActivityFilters";

export default observer(function ActivityDashboard() {
    // monitors changes in state!
    const {activityStore} = useStore();
    const {loadActivities, activityRegistry} = activityStore;
    
    useEffect(() => {
        if (activityRegistry.size <= 1) loadActivities(); // if there is stuff in the actReg, don't need to load from the api
    }, [loadActivities, activityRegistry.size]) // 2 dependency in square brackets

    //check if the screen is in "loading" state
    if (activityStore.loadingInitial) return <LoadingComponent content='Loading Activities' />
    
    return (
        <Grid>
            <Grid.Column width={'10'}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters />
            </Grid.Column>
        </Grid>
    )
})