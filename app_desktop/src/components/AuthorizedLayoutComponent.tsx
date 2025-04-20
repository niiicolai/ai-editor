import { JSX } from "react";

interface AuthorizedLayoutComponentProps {
    slot: JSX.Element;
}

function AuthorizedLayoutComponent(props: AuthorizedLayoutComponentProps) {
    return (
        <>
            {props.slot}
        </>
    );
}

export default AuthorizedLayoutComponent;
