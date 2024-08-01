import { Share, ShareOutlined } from "@mui/icons-material";
import { RWebShare } from "react-web-share";

const ShareButton = ({ title, text, url }) => {
  return (
    <RWebShare
      data={{
        title: title,
        text: text,
        url: url,
      }}
    >
      <ShareOutlined />
    </RWebShare>
  );
};
export default ShareButton;
