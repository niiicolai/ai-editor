import { useGetUser } from "../hooks/useUser";
import { JSX, useEffect, useState } from "react";

function RequireRoleComponent({
    role,
    slot
}: {
    role: string;
    slot: JSX.Element;
}) {
    const { data: user } = useGetUser();
    const [hasRole, setHasRole] = useState(false);

    useEffect(() => {
        if (user && user.role === role) {
            setHasRole(true);
        }
    }, [user]);
    console.log("user", user);

    if (!hasRole) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <p className="text-lg">Access Denied</p>
                    <p className="text-sm mt-2">You do not have permission to view this page</p>
                </div>
            </div>
        );
    }

    return (
        <>{slot}</>
    );
}

export default RequireRoleComponent;
