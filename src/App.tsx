import { Button } from "@/components/ui/button"
import  Signup  from "@/components/examples/dialog/standard/dialog-signup-form";
import  Signin  from "@/components/examples/dialog/standard/dialog-signin-form";


function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button>Click me</Button>
      <Signup />
      <Signin />
    </div>
  )
}

export default App