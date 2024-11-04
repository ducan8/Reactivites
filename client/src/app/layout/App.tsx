import { useEffect } from "react";
import { Container, List } from "semantic-ui-react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./LoadingComponent";
import { useStore } from "../models/store";
import { observer } from "mobx-react-lite";

function App() {
  const { activityStore } = useStore();

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) {
    return <LoadingComponent content="Loading app" inverted={true} />;
  }

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <List>
          <ActivityDashboard />
        </List>
      </Container>
    </>
  );
}

export default observer(App);
