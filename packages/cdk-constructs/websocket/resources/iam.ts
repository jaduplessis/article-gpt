// import {
//   WebSocketApi,
//   WebSocketStage,
//   Web,
// } from "@aws-cdk/aws-apigatewayv2-alpha";
// import { AuthorizationType } from "@aws-cdk/aws-apigatewayv2-alpha";
// import { WebSocketAuthRole } from "./auth-role";


// export class WebSocket extends Construct {
//   // ...

//   constructor(scope: Construct, id: string) {
//     super(scope, id);

//     // ...

//     const authRole = new WebSocketAuthRole(this, "WebSocketAuthRole");

//     this.webSocketApi = new WebSocketApi(this, "websocket-api", {
//       connectRouteOptions: {
//         // ...
//       },
//       disconnectRouteOptions: {
//         // ...
//       },
//       defaultRouteOptions: {
//         authorizationType: AuthorizationType.AWS_IAM,
//         authorizationRole: authRole.role,
//       },
//     });

//     // ...
//   }
// }
