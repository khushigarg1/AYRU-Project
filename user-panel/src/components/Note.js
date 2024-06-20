import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import api from '../../api';
import Link from 'next/link';

const MainContainer = styled('div')(({ theme }) => ({
  marginTop: "10px",
  padding: '20px',
  backgroundColor: theme.palette.background.paper,
}));

const NoteContainer = styled('div')(({ theme }) => ({
  fontFamily: 'serif',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
  boxShadow: theme.shadows[2],
  fontSize: '1.2rem',
  border: '2px dotted black',
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
    fontSize: '1.4rem',
    padding: '30px',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.6rem',
    padding: '40px',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '1.8rem',
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
  fontSize: '1rem',
  fontWeight: 'bold',
  borderBottom: '2px solid black',
  paddingBottom: '2px', // Adjust padding to space the border from text
  transition: 'border-bottom 0.3s ease',
  '&:hover': {
    borderBottomColor: theme.palette.primary.main, // Example of changing color on hover
  },
}));

export const Note = () => {
  const [notetext, setnoteText] = useState("");

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
    <MainContainer>
      <NoteContainer>
        {notetext || "Loading..."}
        {/* Replace <Link> with <a> to avoid nesting <a> within <a> */}
        <ViewDetailsLink href="/details">View Details</ViewDetailsLink>
      </NoteContainer>
    </MainContainer>
  );
};

export default Note;
