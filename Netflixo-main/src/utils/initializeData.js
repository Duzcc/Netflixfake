/**
 * Initialize default data for the application
 * Creates default admin account if it doesn't exist
 */

export const initializeDefaultData = () => {
    // Initialize users array if it doesn't exist
    if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify([]));
    }

    // Create default admin account if no admin exists
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const adminExists = users.some((user) => user.role === "admin");

    if (!adminExists) {
        const defaultAdmin = {
            name: "Administrator",
            email: "admin@netflix.com",
            password: "Admin@123",
            role: "admin",
            avatar: null,
            createdAt: new Date().toISOString(),
        };

        users.push(defaultAdmin);
        localStorage.setItem("users", JSON.stringify(users));

        console.log("✅ Default admin account created:");
        console.log("   Email: admin@netflix.com");
        console.log("   Password: Admin@123");
    }
};
