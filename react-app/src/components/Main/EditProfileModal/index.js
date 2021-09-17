import { useState, useEffect } from 'react';
import { Modal } from '../../context/Modal/Modal';
import EditProfile from './edit-profile';

import './edit-profile.css';


function EditProfileModal() {
  const [editProfile, setEditProfile] = useState(false);


  return (
    <>
      <button className='logout' onClick={() => {setEditProfile(!editProfile)}} type='button'>Settings</button>
      {editProfile && (
        <Modal className='edit-profile-modal' onClose={() => setEditProfile(false)}>
          <>
            <EditProfile setEditProfile={setEditProfile} />
          </>
        </Modal>
      )}
    </>
  );
}

export default EditProfileModal;