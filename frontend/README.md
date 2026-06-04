4 layers arch{
    UI(kya user ko dikhana h +navigation handle krna )
    => component
    =>pages

    hook(for managing stae and api layer)
    =>hooks

    State(user data jo hume frontend pr dikhana h vo sb state me rhta h)
=>auth.context.jsx
=>ai.context.jsx

API(frontend back(4 api create kri h auth.routes ke andr) se kaise communicate krega )
=>services
   =>auth.api.js
}