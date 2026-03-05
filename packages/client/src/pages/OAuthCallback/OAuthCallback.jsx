import useOAuthCallback from "../../hooks/OAuthCallback/useOAuthCallback";

export default function OAuthCallback() {
    useOAuthCallback();
    return <div>Logging you in...</div>;
}