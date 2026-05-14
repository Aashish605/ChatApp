"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { supabase } from "@/config/supabase"
import { toast } from "react-toastify"
import { useUserState } from "@/hooks/useUserState"



const Signin = () => {
  const userState = useUserState()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const { data, error: signupError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signupError) {
      console.log(signupError)
      toast.error(signupError.message);
    } else {
      console.log(data.user.user_metadata)
      toast.success("User Logged In Successfully!");
      const user = data.user.user_metadata
      userState.setUser({
        name:user.name,
        email:user.email
      })
      setEmail("")
      setPassword("")
    }

    


  }


  return (
    <div className="min-h-[80vh]  flex items-center justify-center">
      <Card className="w-full max-w-md  mx-auto ">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              onChange={e => setEmail(e.target.value)}
              placeholder="m@Signin.com"
              type="email"
              value={email}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a className="text-sm hover:underline" href="#">
                Forgot your password?
              </a>
            </div>
            <Input
              id="password"
              onChange={e => setPassword(e.target.value)}
              type="password"
              value={password}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">Login</Button>
          <Button className="w-full" variant="outline">
            Login with Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-muted-foreground text-sm">
            Don't have an account?{" "}
            <Link to={'/signup'} className="underline" >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Signin
