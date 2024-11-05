import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { format } from "date-fns";

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date!, "dd MMM yyyy");
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  private setActivity = (activity: Activity) => {
    activity.date = new Date(activity.date!);
    this.activityRegistry.set(activity.id, activity);
  };

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.setLoadingInitial(true);
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        runInAction(() => {
          this.selectedActivity = activity;
        });
        this.setLoadingInitial(false);
        return activity;
      } catch (error) {
        console.log(
          "check loadActivity() in activityStore.ts -> error: ",
          error
        );
        this.setLoadingInitial(false);
      }
    }
  };

  loadActivities = async () => {
    this.setLoadingInitial(true);
    try {
      const activities: Activity[] = await agent.Activities.list();
      activities.forEach((activity) => {
        this.setActivity(activity);
      });

      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);

      this.setLoadingInitial(false);
    }
  };

  setLoadingInitial: (state: boolean) => void = (state) => {
    this.loadingInitial = state;
  };

  createActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.loading = false;
        this.editMode = false;
        this.selectedActivity = activity;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
        this.editMode = false;
      });
    }
  };

  updateActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      await agent.Activities.update(activity.id, activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.loading = false;
        this.editMode = false;
        this.selectedActivity = activity;
      });
    } catch (error) {
      console.log(error);

      runInAction(() => {
        this.loading = false;
        this.editMode = false;
      });
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.loading = false;
      });
    } catch (error) {}
    runInAction(() => {
      this.loading = false;
    });
  };
}
