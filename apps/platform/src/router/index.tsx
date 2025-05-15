import { Route, Switch } from "wouter";
import Home from "@/pages/home/Home";
import NotFound from "@/pages/notFound/NotFound";

export default function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/photo-menu">{() => <div>Photo Menu Page</div>}</Route>
      <Route path="/digital-menu">{() => <div>Digital Menu Page</div>}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}
