"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"


export function PharmacistChat() {


const [question,setQuestion] = useState("")
const [messages,setMessages] = useState<any[]>([])
const [loading,setLoading] = useState(false)



const sendMessage = async()=>{


if(!question.trim())
return



const userMessage = {
    role:"user",
    text:question
}


setMessages(prev=>[
    ...prev,
    userMessage
])


setLoading(true)



try{


const saved =
localStorage.getItem(
    "prescriptionResult"
)



let medicines=[]


if(saved){

const data =
JSON.parse(saved)


medicines =
data?.data?.counseling?.medicines || []

}




const response =
await fetch(
"http://127.0.0.1:8000/api/v1/chat",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

question,

medicines

})

}

)



const result =
await response.json()



setMessages(prev=>[
...prev,
{
role:"ai",
text:
result.data.answer
}
])


}

catch(error){

console.log(error)

setMessages(prev=>[
...prev,
{
role:"ai",
text:"Sorry, I could not process your question."
}
])


}


setQuestion("")
setLoading(false)


}



return (

<Card className="flex flex-1 flex-col">

<CardContent className="flex flex-1 flex-col gap-4 p-5">


<div className="flex-1 space-y-4 overflow-y-auto">


{
messages.map(
(msg,index)=>(

<div
key={index}
className={
msg.role==="user"
?
"rounded-lg bg-primary p-3 text-primary-foreground ml-auto max-w-md"
:
"rounded-lg bg-muted p-3 max-w-md"
}
>

{msg.text}

</div>


)
)
}


</div>



<div className="flex gap-2">


<input

value={question}

onChange={
(e)=>
setQuestion(e.target.value)
}

placeholder="Ask about your medicines..."

className="flex-1 rounded-lg border px-3 py-2"

/>


<Button
onClick={sendMessage}
disabled={loading}
>

{
loading
?
"Thinking..."
:
"Send"
}

</Button>


</div>



</CardContent>

</Card>

)


}