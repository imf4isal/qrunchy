import { Route, Switch } from "wouter";
import Home from "@/pages/home/Home";
import NotFound from "@/pages/notFound/NotFound";
import PhotoMenu from "@/pages/photomenu/PhotoMenu";
import DigitalMenu from "@/pages/digitalmenu/DigitalMenu";
import About from "@/pages/about/About";
import Contact from "@/pages/contact/Contact";
import { Hello } from "@/components/Hello";
import HowItWorks from "@/pages/howWorks/HowItWorks";

export default function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/trpc-test" component={Hello} />
      <Route path="/photo-menu" component={PhotoMenu} />
      <Route path="/digital-menu" component={DigitalMenu} />
      <Route path="/about" component={About} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}
