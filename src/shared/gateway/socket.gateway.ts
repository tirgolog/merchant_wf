// socket.gateway.ts
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer() server: Server;

  handleConnection(client: any, ...args: any[]) {
    // Handle new socket connections
    console.log(client)
  }
}
