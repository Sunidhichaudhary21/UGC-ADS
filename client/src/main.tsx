import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import {BrowserRouter} from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'
import { dark } from "@clerk/themes"

const PUBLISHABLE_KEY =import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if(!PUBLISHABLE_KEY){
    throw new Error('Missing key')
}

createRoot(document.getElementById('root')! as HTMLElement).render(
    <ClerkProvider
    appearance={{
        theme:dark,
        variables:{
            colorPrimary:'#2563EB',
            colorTextOnPrimaryBackground:"#ffffff"
        }
    }}
    
    publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
    
         <App />
       </BrowserRouter>
    </ClerkProvider>
)