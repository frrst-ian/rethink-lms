import useOAuthCallback from "../../hooks/OAuthCallback/useOAuthCallback";

export default function OAuthCallback() {
    useOAuthCallback();
    return <div className="loading" >Logging you in...</div>;
}