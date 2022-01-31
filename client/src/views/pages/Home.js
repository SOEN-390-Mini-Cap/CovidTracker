import { getUserData } from "../../utility/Utils";

function Home() {
    return <div>Token: {getUserData().accessToken.substring(0, 30)}...</div>;
}

export default Home;
