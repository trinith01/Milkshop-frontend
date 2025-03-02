import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductsPage from "./pages/products";
import MembersPage from "./pages/members";
import MainLayout from "./layouts/mainLayouts";
import { ClerkProvider, RedirectToSignIn, SignedOut } from "@clerk/clerk-react";
import { SignUp} from "@clerk/clerk-react";
import SignInPage from "./pages/singInPage";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/sign-in">
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/members" element={<MembersPage />} />
          </Route>
         
          
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
