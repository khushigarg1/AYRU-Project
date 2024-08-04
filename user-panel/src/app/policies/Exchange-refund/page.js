"use client";
import Head from 'next/head';
import { Button, Container, Typography } from '@mui/material';
import { WhatsappIcon } from 'next-share';

export default function ReturnAndExchangePolicy() {

  // const whatsappMessage = "";
  return (
    <>
      <Head>
        <title>Return and Exchange Policy</title>
        <meta name="description" content="Return and Exchange Policy of our website" />
      </Head>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: "bolder", fontSize: "33px" }}>
          Return and Exchange Policy
        </Typography>
        <Typography paragraph>
          At AYRU JAIPUR, we strive to ensure that you are satisfied with your purchase. Please read our return and refund policy carefully to understand our procedures and requirements.
        </Typography>
        <Typography variant="h5" component="h2">
          Return/Exchange Requirements
        </Typography>
        <Typography paragraph>
          <strong>1. Parcel or Unboxing Video:</strong> To assist us in processing your return or exchange efficiently and resolving any issues effectively, we require a parcel or unboxing video as part of the return policy.
        </Typography>
        <ul>
          <li>Before opening the package, start recording a video using a smartphone.</li>
          <li>Show the package from all angles, including any visible signs of damage or tampering.</li>
          <li>Carefully unbox the item, making sure to capture the process on video.</li>
          <li>Clearly display the item and any accompanying accessories or documentation in the video.</li>
          <li>If there are any defects, damages, or missing parts, please zoom in and provide a detailed close-up view.</li>
        </ul>
        <Typography paragraph>
          <strong>2. Purpose of the Video:</strong> The parcel or unboxing video helps us verify the condition of the returned item, determine if any damages occurred during transit, and resolve any issues promptly and fairly.
        </Typography>
        <Typography paragraph>
          <strong>3. Item Condition:</strong> The item must be unused, in its original packaging, and in the same condition as when it was received.
        </Typography>
        <Typography paragraph>
          <strong>4. Acceptable Returns/Exchanges:</strong> We accept exchanges or returns only if you have received items that are physically damaged, have missing parts or accessories, are defective, or are different from their description.
        </Typography>
        <Typography paragraph>
          <strong>5. Reporting Issues:</strong> If you receive a damaged or defective item, please contact us within 24 hours of delivery to arrange for a replacement or refund.
        </Typography>
        <Typography paragraph>
          <strong>6. Refund Processing:</strong> Refunds will be processed within 10 days after receiving the returned product. Once the item is received, it will go through a verification process before a refund is issued.
        </Typography>

        <Typography variant="h5" component="h2">
          Return Shipping
        </Typography>
        <Typography paragraph>
          <strong>1. Customer Responsibility:</strong> Customers are responsible for return shipping costs, unless the return is due to an error on our part. To ensure a smooth return process, please use the original packaging and affix the provided return shipping label/address. If you need assistance with the return shipping process, please contact us on whatsapp.
          {/* our {' '}
          <Button
            aria-label="Chat on WhatsApp"
            href={`https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<WhatsappIcon style={{ height: "15px", width: "15px", padding: "0px", marginRight: "4px" }} />}
            sx={{
              color: '#25D366',
              fontWeight: 'bold',
              textTransform: 'none',
              mb: 0,
              padding: "0px",
            }}
          >
            WhatsApp
          </Button>
          {' '}. */}
        </Typography>
        <Typography paragraph>
          <strong>2. Shipping Loss/Damage:</strong> We are not responsible for the loss of shipment while returning the product or damage to the product incurred during the return process.
        </Typography>

        <Typography variant="h5" component="h2">
          Conditions for Refusal
        </Typography>
        <Typography paragraph>
          <strong>1. Unacceptable Returns:</strong> Items that have been used, damaged, or altered.
        </Typography>
        <Typography paragraph>
          <strong>2. Late Returns/Exchanges:</strong> Returns or exchanges initiated after the specified timeframe.
        </Typography>
        <Typography paragraph>
          <strong>3. Missing Video:</strong> Without the parcel opening video, we are unable to verify the condition of the item or assess any potential issues accurately. In such cases, we will be unable to proceed with your return request until we receive the requested video.
        </Typography>

        <Typography variant="h5" component="h2">
          Additional Information
        </Typography>
        <Typography paragraph>
          <strong>1. Further Questions:</strong> For any further questions or concerns regarding our return and refund policy, Please contact us on whatsapp.
          {/* {' '}
          <Button
            aria-label="Chat on WhatsApp"
            href={`https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<WhatsappIcon style={{ height: "15px", width: "15px", padding: "0px", marginRight: "4px" }} />}
            sx={{
              color: '#25D366',
              fontWeight: 'bold',
              textTransform: 'none',
              mb: 0,
              padding: "0px",
            }}
          >
            WhatsApp
          </Button>
          {' '}. */}
        </Typography>
        <Typography paragraph>
          <strong>2. Policy Copy:</strong> Please retain a copy of this policy for your reference. This policy is subject to change without prior notice.
        </Typography>
        <Typography paragraph>
          Thank you for your understanding and cooperation.
        </Typography>
      </Container>
    </>
  );
}
