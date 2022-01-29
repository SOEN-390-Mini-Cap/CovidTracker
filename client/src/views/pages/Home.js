import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { handleLogout } from "@store/authentication";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

function Home() {
    const dispatch = useDispatch();
    const history = useHistory();

    const signOut = () => {
        dispatch(handleLogout());
        history.push("./login");
    };

    return (
        <div>
            <Navbar>
                <Container>
                    <Navbar.Brand href="./home">Covid Tracker</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>Signed in as: John Doe</Navbar.Text>
                        <Button variant="primary" style={{ marginLeft: "10px" }} onClick={signOut}>
                            Sign Out
                        </Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default Home;
