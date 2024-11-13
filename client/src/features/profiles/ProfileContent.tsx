import { Tab, TabPane } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import { Profile } from "../../app/models/profile";
import ProfileFollowing from "./ProfileFollowing";
import { useStore } from "../../app/stores/store";

interface Props {
  profile: Profile;
}

export default function ProfileContent({ profile }: Props) {
  const { profileStore } = useStore();

  const panes = [
    { menuItem: "About", render: () => <TabPane>About Content</TabPane> },
    { menuItem: "Photos", render: () => <ProfilePhotos profile={profile} /> },
    { menuItem: "Events", render: () => <TabPane>Events Content</TabPane> },
    {
      menuItem: "Followers",
      render: () => <ProfileFollowing />,
    },
    {
      menuItem: "Following",
      render: () => <ProfileFollowing />,
    },
  ];

  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      onTabChange={(_, data) => {
        profileStore.setActiveTab(data.activeIndex as number);
      }}
    />
  );
}