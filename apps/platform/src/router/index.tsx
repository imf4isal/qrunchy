import { Route, Switch } from "wouter";
import Home from "@/pages/home/Home";
import NotFound from "@/pages/notFound/NotFound";
import PhotoMenu from "@/pages/photomenu/PhotoMenu";
import { Hello } from "@/components/Hello";

export default function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/trpc-test" component={Hello} />
      <Route path="/photo-menu" component={PhotoMenu} />
      <Route path="/digital-menu">{() => <div>Digital Menu Page</div>}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}
