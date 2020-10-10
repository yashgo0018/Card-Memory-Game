import Navbar from './navbar';

const Layout = (props) => (
    <div style={{ height: '100%' }}>
        <Navbar />
        {props.children}

    </div>
)

export default Layout;
