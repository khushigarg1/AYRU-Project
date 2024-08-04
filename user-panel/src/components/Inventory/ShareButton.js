import { ShareOutlined } from "@mui/icons-material";
import { RWebShare } from "react-web-share";

const ShareButton = ({ title, text, url }) => {
  const combinedText = `${text}\n\n`;

  return (
    <RWebShare
      data={{
        title: title,
        text: combinedText,
        url: url,
      }}
    >
      <ShareOutlined />
    </RWebShare>
  );
};

export default ShareButton;
