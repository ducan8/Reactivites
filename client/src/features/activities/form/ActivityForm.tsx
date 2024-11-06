import { Button, Header, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { v4 as uuid } from "uuid";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const { loading, createActivity, updateActivity, loadActivity } =
    activityStore;
  const { id } = useParams();

  const [activity, setActivity] = useState<Activity>({
    id: "",
    title: "",
    description: "",
    category: "",
    date: null,
    city: "",
    venue: "",
  });

  const validationSchema = Yup.object({
    title: Yup.string().required("The title is required"),
    description: Yup.string().required("The description is required"),
    category: Yup.string().required("The category is required"),
    date: Yup.string().required("The date is required").nullable(),
    venue: Yup.string().required("The venue is required"),
    city: Yup.string().required("The city is required"),
  });

  useEffect(() => {
    if (id) {
      loadActivity(id).then((activity) => setActivity(activity!));
    }
  }, [id, loadActivity, activity]);

  const navigate = useNavigate();

  function handleFormSubmit(activity: Activity) {
    if (activity.id) {
      updateActivity(activity).then(() =>
        navigate(`/activities/${activity.id}`)
      );
    } else {
      activity.id = uuid();
      createActivity(activity).then(() => {
        navigate(`/activities/${activity.id}`);
      });
    }
  }

  if (loading) return <LoadingComponent content="Loading activity" />;

  return (
    <Segment clearing>
      <Header content="Activity Details" sub color="teal" />
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput placeholder={"Title"} name={"title"} />
            <MyTextArea
              placeholder={"Description"}
              name={"description"}
              rows={3}
            />
            <MySelectInput
              placeholder={"Category"}
              name={"category"}
              options={categoryOptions}
            />
            <MyDateInput
              placeholderText={"Date"}
              name={"date"}
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
            <Header content="Location Details" sub color="teal" />
            <MyTextInput placeholder={"Venue"} name={"venue"} />
            <MyTextInput placeholder={"City"} name={"city"} />

            <Button
              loading={loading}
              disabled={isSubmitting || !dirty || !isValid}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              as={Link}
              to={`/activities`}
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
