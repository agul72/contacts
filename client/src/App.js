import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "./components/NavBar";
import UserListPage from "./components/UserListPage";
import SearchPage from "./components/SearchPage";
import {CreatePage} from "./components/CreatePage";
import {EditPage} from "./components/EditPage";

function App() {
    return (
        <div className="container mt-1">

            <BrowserRouter >
                <NavBar/>
                <Switch>
                    <Route path={'/create'} component={CreatePage} />
                    <Route path={'/update'} component={EditPage} />
                    <Route path={'/search'} component={SearchPage} />
                    <Route path={['/list', '/home', '/']} component={UserListPage} exact />
                    <Redirect to={'/home'} />
                </Switch>
            </BrowserRouter>

        </div>
    );
}

export default App;
