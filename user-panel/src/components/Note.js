import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import api from '../../api';
import Link from 'next/link';
import Image from 'next/image';
import WebpImage from "../../public/images/blog8.webp";
import { useMediaQuery, useTheme } from '@mui/material';


const MainContainer = styled('div')(({ theme }) => ({
  padding: '20px 40px',
  backgroundColor: theme.palette.background.paper,
  position: "relative"
}));

const NoteContainer = styled('div')(({ theme }) => ({
  fontFamily: theme.palette.typography.fontFamily,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
  boxShadow: theme.shadows[0],
  fontSize: '1rem',
  // border: '2px dotted black',
  minHeight: '130px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: "column",
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'normal',
  wordWrap: 'break-word',
  [theme.breakpoints.up('sm')]: {
    fontSize: '1rem',
    padding: '30px',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.2rem',
    padding: '40px',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '1.4rem',
    padding: '50px',
  },
  '@media (max-width: 600px)': {
    fontSize: '1rem',
    padding: '10px',
  },
}));

const ViewDetailsLink = styled('a')(({ theme }) => ({
  marginTop: '2px',
  textDecoration: 'none',
  color: 'inherit',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  borderBottom: '2px solid black',
  paddingBottom: '2px',
  transition: 'border-bottom 0.3s ease',
  '&:hover': {
    borderBottomColor: theme.palette.primary.main,
  },
}));

export const Note = () => {
  const [notetext, setnoteText] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchNoteText = async () => {
      try {
        const response = await api.get("/customer-side-data/1");
        setnoteText(response.data.data.extraNote);
      } catch (error) {
        console.error("Error fetching note text:", error);
      }
    };

    fetchNoteText();
  }, []);

  return (
    <MainContainer mt={0}>
      <Image src={WebpImage} alt="Left Image" width={100} height={45} style={{ position: 'absolute', left: '-8px', top: isMobile ? "75%" : "70%", transform: 'translateY(-50%)', maxWidth: '20%', height: 'auto', opacity: "1" }} />
      <NoteContainer>
        {notetext || "Loading..."}
      </NoteContainer>
      <Image src={WebpImage} alt="Right Image" width={100} height={45} style={{ position: 'absolute', right: '-8px', top: isMobile ? "75%" : "70%", transform: 'translateY(-50%)', maxWidth: '20%', height: 'auto', opacity: "1" }} />
    </MainContainer>
  );
};

export default Note;
