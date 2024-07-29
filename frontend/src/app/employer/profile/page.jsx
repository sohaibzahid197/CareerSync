import React from 'react';
import ProfileLayout from '@/components/profileComponents/ProfileLayout';
import ProfileEmployer from '@/components/profileComponents/ProfileEmployer';

export default function CandidateProfilePage() {
  return (
    <ProfileLayout>
      <ProfileEmployer />
    </ProfileLayout>
  );
}



// export default function CandidateProfilePage() {
//     return <ProfileLayout />
// }