import React from 'react';
import { getCurrentUser } from '../../utils/authUtils';

export const AdminOnly = ({ children }) => {
    const user = getCurrentUser();
    if (user && user.role === 'admin') {
        return <>{children}</>;
    }
    return null;
};

export const UserOnly = ({ children }) => {
    const user = getCurrentUser();
    if (user && user.role !== 'admin') {
        return <>{children}</>;
    }
    return null;
};

export const RoleBasedRender = ({ admin, user, guest }) => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        return guest ? <>{guest}</> : null;
    }

    if (currentUser.role === 'admin') {
        return admin ? <>{admin}</> : null;
    }

    return user ? <>{user}</> : null;
};
