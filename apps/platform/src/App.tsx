import "./App.css";
import CTA from "@/pages/cta/CTA";
import { Switch, Route } from "wouter";
import { ROUTES } from "./router";
import SortableImages from "./pages/photomenu/SortableImages";

function App() {
  return (
    <>
      <Switch>
        <Route path={ROUTES.HOME} component={CTA} />
        <Route path={ROUTES.PHOTOMENUUPLOAD} component={SortableImages} />
      </Switch>
    </>
  );
}

export default App;
