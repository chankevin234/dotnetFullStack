import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuid} from 'uuid';

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>(); // acitivties should be sorted by date
    selectedActivity: Activity | undefined = undefined; 
    editMode = false;
    loading = false;
    loadingInitial = true;

    constructor() {
        makeAutoObservable(this) //auto recognizes the functions and properties in the class and makes them observable
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
            Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async () => {
        // this.setLoadingInitial(true); // changes the property 
        try {
            const activities = await agent.Activities.list();         
            activities.forEach(activity => {
                activity.date = activity.date.split('T')[0];
                this.activityRegistry.set(activity.id, activity); // pushing into this MAP obj in class and update state
                })
            this.setLoadingInitial(false); // changes the property 
        } catch (error) {
            console.log(error)
            this.setLoadingInitial(false);; // changes the property
        }
    }
    setLoadingInitial = (state: boolean) => { //occurs in its own action
        this.loadingInitial = state;
    }

    selectActivity = (id: string) => {
        // looks for activity in the activities array
        this.selectedActivity = this.activityRegistry.get(id); //retruns Activity obj at w/ id key
    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        // optional id means that this function can be used for creating act or editing act
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true; //sets the state as opened
    }

    closeForm = () => {
        this.editMode = false; //changes the edit mode back to false
    }

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
                if (this.selectedActivity?.id === id) this.cancelSelectedActivity();
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