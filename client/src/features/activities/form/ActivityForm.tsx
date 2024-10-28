import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { ChangeEvent, useState } from "react";

interface Props {
  closeForm: () => void;
  activity: Activity | undefined;
  createOrEditActivity: (activity: Activity) => void;
  submiting: boolean;
}

export default function ActivityForm({
  closeForm,
  activity: selectedActivity,
  createOrEditActivity,
  submiting,
}: Props) {
  const initialActicity = selectedActivity ?? {
    id: "",
    title: "",
    description: "",
    category: "",
    date: "",
    city: "",
    venue: "",
  };

  const [activity, setActivity] = useState<Activity>(initialActicity);

  function handleChangeInput(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value });
  }

  function handleSubmit() {
    createOrEditActivity(activity);
  }

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          placeholder="Title"
          value={activity.title}
          name="title"
          onChange={handleChangeInput}
        />
        <Form.TextArea
          placeholder="Description"
          value={activity.description}
          name="description"
          onChange={handleChangeInput}
        />
        <Form.Input
          placeholder="Category"
          value={activity.category}
          name="category"
          onChange={handleChangeInput}
        />
        <Form.Input
          placeholder="Date"
          value={activity.date}
          type="date"
          name="date"
          onChange={handleChangeInput}
        />
        <Form.Input
          placeholder="City"
          value={activity.city}
          name="city"
          onChange={handleChangeInput}
        />
        <Form.Input
          placeholder="Venue"
          value={activity.venue}
          name="venue"
          onChange={handleChangeInput}
        />
        <Button
          loading={submiting}
          floated="right"
          positive
          type="submit"
          content="Submit"
        />
        <Button
          onClick={() => closeForm()}
          floated="right"
          type="button"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
}
