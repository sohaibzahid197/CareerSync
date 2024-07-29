// profile/candidate/page.jsx

import React from 'react';
import ProfileLayout from '@/components/profileComponents/ProfileLayout'; 
import ProfileDetails from '@/components/profileComponents/ProfileCandidate'; 

export default function CandidateProfilePage() {
  return (
    <ProfileLayout>
      <ProfileDetails />
    </ProfileLayout>
  );
}
