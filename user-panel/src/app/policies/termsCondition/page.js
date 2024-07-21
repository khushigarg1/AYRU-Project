import Head from 'next/head';
import { Container, Typography } from '@mui/material';

export default function TermsAndConditions() {
  return (
    <>
      <Head>
        <title>Terms and Conditions</title>
        <meta name="description" content="Terms and Conditions of AYRU JAIPUR website" />
      </Head>
      <Container>
        <Typography variant="h2" component="h1" gutterBottom>
          Terms and Conditions
        </Typography>
        <Typography paragraph>
          Welcome to AYRU JAIPUR. These terms and conditions outline the rules and regulations for the use of our website.
        </Typography>
        <Typography variant="h5" component="h2">
          Contact Information
        </Typography>
        <Typography paragraph>
          If you have any questions about these Terms and Conditions, please contact us at:
          <br />
          WhatsApp: +91-9785852222
          <br />
          Email: ayrujaipur@gmail.com
          <br />
          Address: Prangan, 302012, Jaipur, Rajasthan, INDIA
        </Typography>
        <Typography variant="h5" component="h2">
          Effective Date
        </Typography>
        <Typography paragraph>
          These Terms and Conditions are effective as of [Effective Date].
        </Typography>
        <Typography variant="h5" component="h2">
          Limitation of Liability and Disclaimer of Warranties
        </Typography>
        <Typography paragraph>
          AYRU JAIPUR is provided "as is" and without any warranty or condition, express, implied, or statutory. We specifically disclaim any implied warranties of title, merchantability, fitness for a particular purpose, and non-infringement. Our liability is limited to the maximum extent permitted by law.
        </Typography>
        <Typography variant="h5" component="h2">
          Rules of Conduct
        </Typography>
        <Typography paragraph>
          Users are expected to behave in a lawful and respectful manner while using our website. Prohibited activities include but are not limited to:
          <ul>
            <li>Posting or transmitting any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.</li>
            <li>Engaging in any activity that could harm or disrupt the website's operation.</li>
            <li>Impersonating any person or entity or misrepresenting your affiliation with any person or entity.</li>
          </ul>
        </Typography>
        <Typography variant="h5" component="h2">
          User Restrictions
        </Typography>
        <Typography paragraph>
          Users must not use our website for any illegal or unauthorized purpose. Users must not, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
        </Typography>
        <Typography paragraph>
          By accessing this website, we assume you accept these terms and conditions. Do not continue to use AYRU JAIPUR if you do not agree to all of the terms and conditions stated on this page.
        </Typography>
      </Container>
    </>
  );
}
