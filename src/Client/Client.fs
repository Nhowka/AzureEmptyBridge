module Client

open Elmish
open Elmish.Bridge
open Elmish.React

open Fable.Helpers.React
open Fable.Helpers.React.Props

open Fable.Core.JsInterop

open Shared

open Fulma

importSideEffects "../../node_modules/bulma/bulma.sass"
importSideEffects "../../node_modules/font-awesome/scss/font-awesome.scss"
importSideEffects "./openSans.scss"


#if DEBUG
open Elmish.Debug
open Elmish.HMR
#endif

let init () = (), Cmd.none
let update _ () = (), Cmd.none

let view _ _ = Container.container [] []

Program.mkProgram init update view
|> Program.withBridge Endpoints.Bridge
#if DEBUG
|> Program.withConsoleTrace
|> Program.withHMR
#endif
|> Program.withReact "elmish-app"
#if DEBUG
|> Program.withDebugger
#endif
|> Program.run
