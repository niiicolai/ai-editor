import { useIsAuthorized } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { JSX, useEffect } from "react";

interface RestrictedComponentProps {
    slot: JSX.Element;
}

function RestrictedComponent(props: RestrictedComponentProps) {
    const { data: isAuthorized } = useIsAuthorized();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthorized === false) navigate("/user/login");
    }, [isAuthorized]);

    return (
        <>{props.slot}</>
    );
}

export default RestrictedComponent;
