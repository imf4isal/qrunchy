import "./App.css";
import CTA from "@/pages/cta/CTA";
import SortableImages from "./components/micro/SortableImages";
import { Switch, Route } from "wouter";
import { ROUTES } from "./router";

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
