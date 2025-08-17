import { Route, Switch } from "wouter";
import Home from "@/pages/home/Home";
import NotFound from "@/pages/notFound/NotFound";
import PhotoMenu from "@/pages/photomenu/PhotoMenu";
import DigitalMenu from "@/pages/digitalmenu/DigitalMenu";
import About from "@/pages/about/About";
import Contact from "@/pages/contact/Contact";
import { Hello } from "@/components/Hello";
import HowItWorks from "@/pages/howWorks/HowItWorks";
import MenuHandler from "@/pages/menu/MenuHandler";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/dashboard/Dashboard";
import RestaurantMenuManager from "@/pages/dashboard/RestaurantMenuManager";
import RestaurantPhotoMenuManager from "@/pages/dashboard/RestaurantPhotoMenuManager";
import FoodCourtManager from "@/pages/dashboard/FoodCourtManager";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import HomeTest from "@/pages/test/HomeTest";
import LandingPageTest from "@/pages/test/LandingPageTest";
import MenuDemo from "@/pages/demo/MenuDemo";

export default function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/test" component={HomeTest} />
      <Route path="/test2" component={LandingPageTest} />
      <Route path="/demo/:restaurantName">
        {(params) => <MenuDemo />}
      </Route>
      <Route path="/trpc-test" component={Hello} />
      <Route path="/photo-menu" component={PhotoMenu} />
      <Route path="/digital-menu" component={DigitalMenu} />
      <Route path="/login" component={Login} />
      <Route path="/about" component={About} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/contact" component={Contact} />
      
      {/* Protected Routes */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/restaurant/:id/menu">
        <ProtectedRoute>
          <RestaurantMenuManager />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/restaurant/:id/photomenu">
        <ProtectedRoute>
          <RestaurantPhotoMenuManager />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/foodcourt/:id">
        <ProtectedRoute>
          <FoodCourtManager />
        </ProtectedRoute>
      </Route>
      
      {/* Customer Menu Route (Public) */}
      <Route path="/menu/:qrCode">
        {(params) => <MenuHandler qrCode={params.qrCode} />}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}
