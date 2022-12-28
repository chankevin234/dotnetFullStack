import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuid} from 'uuid';

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>(); // acitivties should be sorted by date
    selectedActivity: Activity | undefined = undefined; 
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this) //auto recognizes the functions and properties in the class and makes them observable
    }

    get activitiesByDate() { //this 
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
            Date.parse(a.date) - Date.parse(b.date));
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = activity.date; // the key for each act obj
                // checks if the activity obj at the date has a match in the MAP
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities; //returns array of activities matching this date 
            }, {} as {[key: string]: Activity[]})
        )
    }

    //loads ALL the activities in your registry
    loadActivities = async () => {
        this.setLoadingInitial(true); // changes the property 
        try {
            const activities = await agent.Activities.list();         
            activities.forEach(activity => {
                this.setActivity(activity); // SET
            })
            this.setLoadingInitial(false); // changes the property 
        } catch (error) {
            console.log(error)
            this.setLoadingInitial(false);; // changes the property
        }
    }

    // loads 1 activity in your registry
    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity; // set selected act as your chosen act (if the act exists in the registry otherwise, check API)
            return activity;
        }
        else {
            this.setLoadingInitial(true);
            try {
                // this is grabbing info from the API 
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => this.selectedActivity = activity); 
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false); // this occurs if the value of activity is undefined
            }
        }
        
    }

    //this is a private function (only used in this class)
    private getActivity = (id: string) => { 
        // gets the activity in the registry map 
        return this.activityRegistry.get(id);
    }
    //this is a private function (only used in this class)
    private setActivity = (activity: Activity) => {
        activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id, activity); // pushing into this MAP obj in class and update state
    }


    setLoadingInitial = (state: boolean) => { //occurs in its own action
        this.loadingInitial = state;
    }

    // SINCE we are using routing, no need for individual functions 
    // -----------------------------------------------------------------------------------------------
    // selectActivity = (id: string) => { // looks for activity in the activities array
    //     this.selectedActivity = this.activityRegistry.get(id); //retruns Activity obj at w/ id key
    // }

    // cancelSelectedActivity = () => { // sets the selected activity as undefined to cancel
    //     this.selectedActivity = undefined;
    // }

    // openForm = (id?: string) => {
    //     // optional id means that this function can be used for creating act or editing act
    //     // does this id exist? if not, cancel
    //     id ? this.selectActivity(id) : this.cancelSelectedActivity();
    //     this.editMode = true; //sets the state as opened
    // }

    // closeForm = () => {
    //     this.editMode = false; //changes the edit mode back to false
    // }

    createActivity = async (activity: Activity) => { //create a new activity
        this.loading = true;
        activity.id = uuid(); //new uuid for new activity
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => { //update existing activity
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) => { //delete an activity
        this.loading = true;
        try {
            await agent.Activities.delete(id); //delete action from agent.ts
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}