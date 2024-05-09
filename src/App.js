import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";
import theme from "./theme";
import { ThemeProvider } from "@mui/system";
export const config = {
//   endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
    endpoint: `https://qkartexpress.onrender.com/api/v1`,

};

/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */

function App() {
  return (
    <div className="App">
      <Switch>
        <Route component={Products} path={"/"} exact />
        <Route component={Login} path={"/login"} exact />
        <Route component={Register} path={"/register"} exact />
        <Route component={Checkout} path={"/checkout"} exact />
        <Route component={Thanks} path={"/thanks"} exact />
      </Switch>
    </div>
  );
}

export default App;
//  <Switch>
//         <Route exact path="/register">
//           <Register />
//         </Route>
//         <Route exact path="/login">
//           <Login />
//         </Route>
//         <Route exact path="/">
//           <Products />
//         </Route>
//       </Switch>
