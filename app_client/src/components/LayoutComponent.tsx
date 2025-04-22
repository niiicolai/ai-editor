import { useIsAuthorized } from "../hooks/useUser";
import { Link } from "react-router-dom";
import { JSX } from "react";

interface LayoutComponentProps {
    pageName: string;
    slot: JSX.Element;
}

function LayoutComponent(props: LayoutComponentProps) {
    const { data: isAuthorized } = useIsAuthorized();

    return (
        <>
            <div className="flex justify-between gap-3 bg-slate-800 text-white px-2">
                <div>
                    <h1 className="p-2 font-bold">AI Editor</h1>
                </div>
                <div>
                    <nav className="flex gap-1">
                        <Link to="/" className={`p-2 hover:underline ${props.pageName == 'home' ? 'underline' : ''}`}>Home</Link>
                        <Link to="/pricing" className={`p-2 hover:underline ${props.pageName == 'pricing' ? 'underline' : ''}`}>Pricing</Link>
                        <Link to="/features" className={`p-2 hover:underline ${props.pageName == 'features' ? 'underline' : ''}`}>Features</Link>
                        <Link to="/docs" className={`p-2 hover:underline ${props.pageName == 'docs' ? 'underline' : ''}`}>Docs</Link>
                        {!isAuthorized && (
                            <>
                                <Link to="/user/login" className="p-2 hover:underline">Login</Link>
                                <Link to="/user/signup" className="p-2 hover:underline">Signup</Link>
                            </>
                        )}
                        {isAuthorized && (
                                <Link to="/user" className="p-2 hover:underline">Profile</Link>
                        )}
                        <Link to="/download" className="p-2 hover:underline bg-blue-500 text-white">Download</Link>
                    </nav>
                </div>
            </div>

            {props.slot}
        </>
    );
}

export default LayoutComponent;
