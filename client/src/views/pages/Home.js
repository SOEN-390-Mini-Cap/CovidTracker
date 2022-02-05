import { useSelector } from "react-redux";

const selectToken = (state) => state.auth.userData.token;

function Home() {
    const token = useSelector(selectToken);
    return <div>Token: {token.substring(0, 30)}...</div>;
}

export default Home;
