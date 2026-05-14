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
import { toast } from "react-toastify";


const Signup = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")

    


    const handleSubmit = async (e:any) => {
        e.preventDefault()
        
        const {data,error:signupError} = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    age: 25,
                    country: "Nepal"
                }
            }
        })

        if(signupError) {
            console.log(signupError)
            toast.error(signupError.message);
        }else{
            console.log(data)
            toast.success("Account created successfully!");
            setEmail("")
            setPassword("")
            setName("")
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
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            onChange={e => setName(e.target.value)}
                            placeholder="Ashish Khadka"
                            type="text"
                            value={name}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            onChange={e => setEmail(e.target.value)}
                            placeholder="m@Signup.com"
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
                    <Button onClick={handleSubmit} className="w-full">Sign Up</Button>
                    <Button className="w-full" variant="outline">
                        Login with Google
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-muted-foreground text-sm">
                        Don't have an account?{" "}
                        <Link  to={'/signin'} className="underline">
                            Sign In
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Signup
