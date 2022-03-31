// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/HorizontalLayout";

const HorizontalLayout = (props) => {
    // const [menuData, setMenuData] = useState([])

    // ** For ServerSide navigation
    // useEffect(() => {
    //   axios.get(URL).then(response => setMenuData(response.data))
    // }, [])

    return (
        <Layout menuData={[]} {...props}>
            {props.children}
        </Layout>
    );
};

export default HorizontalLayout;
