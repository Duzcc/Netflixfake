import React from 'react';
import { isAdmin } from '../../utils/authUtils';

/**
 * AdminOnly component - Only renders children if user is admin
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if admin
 * @returns {React.ReactNode|null} - Children if admin, null otherwise
 */
function AdminOnly({ children }) {
    if (!isAdmin()) {
        return null;
    }

    return <>{children}</>;
}

export default AdminOnly;
